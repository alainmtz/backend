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
    const items = await Item.findAll({
      include: [
        { model: Supplier, as: 'supplier', attributes: ['name'] },
        { model: Stock, as: 'stock' }
      ]
    });
    // Mapear para mostrar todos los campos relevantes de Item y Stock
    const itemsFull = items.map(item => ({
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
    res.json(itemsFull);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener items' });
  }
};

// Crear item
exports.create = async (req, res) => {
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
    res.status(400).json({ error: 'Error al crear item', details: err.message });
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
exports.update = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar item', details: err });
  }
};

// Eliminar item
exports.remove = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    const Stock = require('../models').Stock;
    const ProjectItem = require('../models').ProjectItem;
    const Transaction = require('../models').Transaction;
    // Verificar dependencias
    const projectItems = await ProjectItem.findOne({ where: { item_id: item.id } });
    const transactions = await Transaction.findOne({ where: { item_id: item.id } });
    if (projectItems) {
      return res.status(400).json({ error: 'No se puede eliminar el artículo porque está vinculado a uno o más proyectos.' });
    }
    if (transactions) {
      return res.status(400).json({ error: 'No se puede eliminar el artículo porque tiene transacciones asociadas.' });
    }
    await Stock.destroy({ where: { item_id: item.id } });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar item', details: err.message });
  }
};
