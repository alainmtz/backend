// Recomendaciones: items con menos de 5 en stock y más de 1 vendidos en la última semana
exports.getRecommendations = async (req, res) => {
  try {
    const { Item, Stock, Transaction } = require('../models');
    // Buscar items con menos de 5 en stock
    const lowStockItems = await Stock.findAll({
      where: { quantity: { [require('sequelize').Op.lt]: 5, [require('sequelize').Op.gt]: 0 } },
      include: [{ model: Item, as: 'item' }]
    });
    // Calcular vendidos en la última semana
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recommendations = [];
    for (const stock of lowStockItems) {
      const item = stock.item;
      const sold = await Transaction.sum('quantity', {
        where: {
          item_id: item.id,
          type: 'sale',
          transaction_date: { [require('sequelize').Op.gte]: oneWeekAgo }
        }
      });
      if (sold > 1) {
        recommendations.push({
          id: item.id,
          name: item.name,
          quantity: stock.quantity,
          sold_last_week: sold
        });
      }
    }
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener recomendaciones', details: err.message });
  }
};
const { Item } = require('../models');

// Obtener todos los items
const { Supplier } = require('../models');


exports.getAll = async (req, res) => {
  try {
    const Stock = require('../models').Stock;
    // Paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Filtro por proveedor
    const supplierName = req.query.supplier;
    const whereSupplier = supplierName ? { name: supplierName } : {};

    const items = await Item.findAndCountAll({
      include: [
        { model: Supplier, as: 'supplier', attributes: ['name'], where: whereSupplier },
        { model: Stock, as: 'stock' }
      ],
      offset,
      limit
    });

    // Mapear para mostrar todos los campos relevantes de Item y Stock
    const itemsFull = items.rows.map(item => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      description: item.description,
      price: item.price,
      cost: item.cost,
      brand: item.brand,
      model: item.model,
      status: item.stock ? item.stock.status : item.status,
      quantity: item.stock ? item.stock.quantity : 0,
      supplier_id: item.supplier_id,
      supplier_name: item.supplier ? item.supplier.name : null,
      provenance: item.provenance,
      warranty_days: item.warranty_days,
      image_url: item.image_url || null,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    res.json({
      total: items.count,
      page,
      limit,
      items: itemsFull
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener items', details: err.message });
  }
};

const { body, validationResult } = require('express-validator');

exports.validateCreate = [
  body('name').isString().notEmpty().withMessage('El nombre es obligatorio'),
  body('sku').isString().notEmpty().withMessage('El SKU es obligatorio'),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('cost').isFloat({ min: 0 }).withMessage('El costo debe ser un número positivo'),
  body('brand').optional().isString(),
  body('model').optional().isString(),
  body('quantity').optional().isInt({ min: 0 }),
  body('supplier_id').optional().isInt(),
  body('provenance').optional().isString(),
  body('warranty_days').optional().isInt({ min: 0 }),
  body('image_url').optional().isString(),
];

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError('Datos inválidos para crear item', errors.array()));
  }
  try {
    const item = await Item.create(req.body);
    // Crear registro de Stock asociado
    const { quantity = 0 } = req.body;
    const Stock = require('../models').Stock;
    const stock = await Stock.create({
      item_id: item.id,
      quantity,
      status: (quantity === 0) ? 'out-of-stock' : (quantity < 5 ? 'low-stock' : 'in-stock')
    });
    res.status(201).json({ ...item.toJSON(), stock: stock.toJSON() });
  } catch (err) {
    next(new ValidationError('Error al crear item', err.message));
  }
};

// Obtener item por ID
exports.getById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener item' });
  }
};

// Actualizar item
const { ValidationError, AuthError, NotFoundError, InternalError } = require('../utils/errors');

exports.update = async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return next(new NotFoundError('Item no encontrado'));
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    next(new ValidationError('Error al actualizar item', err.message));
  }
};

// Eliminar item
exports.remove = async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return next(new NotFoundError('Item no encontrado'));
    const Stock = require('../models').Stock;
    const ProjectItem = require('../models').ProjectItem;
    const Transaction = require('../models').Transaction;
    // Verificar dependencias
    const projectItems = await ProjectItem.findOne({ where: { item_id: item.id } });
    const transactions = await Transaction.findOne({ where: { item_id: item.id } });
    if (projectItems) {
      return next(new ValidationError('No se puede eliminar el artículo porque está vinculado a uno o más proyectos.'));
    }
    if (transactions) {
      return next(new ValidationError('No se puede eliminar el artículo porque tiene transacciones asociadas.'));
    }
    await Stock.destroy({ where: { item_id: item.id } });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    next(new InternalError('Error al eliminar item', err.message));
  }
};
