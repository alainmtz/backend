const { Consumible } = require('../models');
const { ValidationError, NotFoundError, InternalError } = require('../utils/errors');

exports.getAll = async (req, res, next) => {
  try {
    const consumibles = await Consumible.findAll();
    res.json(consumibles);
  } catch (err) {
    next(new InternalError('Error al obtener consumibles', err));
  }
};

const { body, validationResult } = require('express-validator');

exports.validateCreate = [
  body('name').isString().notEmpty().withMessage('El nombre es obligatorio'),
  body('usage_count').isInt({ min: 0 }).withMessage('El uso debe ser un número entero positivo'),
  body('cost_price').isFloat({ min: 0 }).withMessage('El costo debe ser un número positivo'),
  body('sale_price').isFloat({ min: 0 }).withMessage('El precio de venta debe ser un número positivo'),
];

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError('Datos inválidos para crear consumible', errors.array()));
  }
  try {
    const { name, usage_count, cost_price, sale_price } = req.body;
    const consumible = await Consumible.create({ name, usage_count, cost_price, sale_price });
    res.status(201).json(consumible);
  } catch (err) {
    next(new ValidationError('Error al crear consumible', err));
  }
};

exports.getById = async (req, res, next) => {
  try {
    const consumible = await Consumible.findByPk(req.params.id);
    if (!consumible) throw new NotFoundError('Consumible no encontrado');
    res.json(consumible);
  } catch (err) {
    if (err instanceof NotFoundError) return next(err);
    next(new InternalError('Error al obtener consumible', err));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, usage_count, cost_price, sale_price } = req.body;
    const consumible = await Consumible.findByPk(req.params.id);
    if (!consumible) throw new NotFoundError('Consumible no encontrado');
    await consumible.update({ name, usage_count, cost_price, sale_price });
    res.json(consumible);
  } catch (err) {
    if (err instanceof NotFoundError) return next(err);
    next(new ValidationError('Error al actualizar consumible', err));
  }
};

exports.remove = async (req, res, next) => {
  try {
    const consumible = await Consumible.findByPk(req.params.id);
    if (!consumible) throw new NotFoundError('Consumible no encontrado');
    await consumible.destroy();
    res.json({ success: true });
  } catch (err) {
    if (err instanceof NotFoundError) return next(err);
    next(new InternalError('Error al eliminar consumible', err));
  }
};
