
const { ValidationError, AuthError, NotFoundError, InternalError } = require('../utils/errors');
const Product = require('../models/product');

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    next(new InternalError('Error al obtener productos', err.message));
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
    return next(new ValidationError('Datos inválidos para crear producto', errors.array()));
  }
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(new ValidationError('Error al crear producto', err.message));
  }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return next(new NotFoundError('Producto no encontrado'));
    res.json(product);
  } catch (err) {
    next(new InternalError('Error al obtener producto', err.message));
  }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return next(new NotFoundError('Producto no encontrado'));
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    next(new ValidationError('Error al actualizar producto', err.message));
  }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return next(new NotFoundError('Producto no encontrado'));
    await product.destroy();
    res.json({ success: true });
  } catch (err) {
    next(new InternalError('Error al eliminar producto', err.message));
  }
};
