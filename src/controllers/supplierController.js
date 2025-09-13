
const { ValidationError, AuthError, NotFoundError, InternalError } = require('../utils/errors');
const { Supplier } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (err) {
    next(new InternalError('Error al obtener suppliers', err.message));
  }
};

const { body, validationResult } = require('express-validator');

exports.validateCreate = [
  body('name').isString().notEmpty().withMessage('El nombre es obligatorio'),
  body('contact').optional().isString(),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('phone').optional().isString(),
  body('address').optional().isString(),
];

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError('Datos inválidos para crear supplier', errors.array()));
  }
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    next(new ValidationError('Error al crear supplier', err.message));
  }
};

exports.getById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return next(new NotFoundError('Supplier no encontrado'));
    res.json(supplier);
  } catch (err) {
    next(new InternalError('Error al obtener supplier', err.message));
  }
};

exports.update = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return next(new NotFoundError('Supplier no encontrado'));
    await supplier.update(req.body);
    res.json(supplier);
  } catch (err) {
    next(new ValidationError('Error al actualizar supplier', err.message));
  }
};

exports.remove = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return next(new NotFoundError('Supplier no encontrado'));
    await supplier.destroy();
    res.json({ success: true });
  } catch (err) {
    next(new InternalError('Error al eliminar supplier', err.message));
  }
};
