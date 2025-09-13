const { body, validationResult } = require('express-validator');

exports.validateCreate = [
  body('user_id').isInt().withMessage('user_id debe ser un entero'),
  body('type').isString().notEmpty().withMessage('El tipo es obligatorio'),
  body('amount').isFloat({ min: 0 }).withMessage('El monto debe ser un número positivo'),
  body('currency').optional().isString(),
  body('role_id').optional().isInt(),
  body('description').optional().isString(),
  body('reference_id').optional().isInt(),
  body('reference_type').optional().isString(),
];
const { Finance, User, Role } = require('../models');
const { ValidationError, NotFoundError, InternalError } = require('../utils/errors');

exports.getAll = async (req, res, next) => {
  try {
    const { user_id, role_id, type, from, to } = req.query;
    const where = {};
    if (user_id) where.user_id = user_id;
    if (role_id) where.role_id = role_id;
    if (type) where.type = type;
    if (from || to) {
      where.created_at = {};
      if (from) where.created_at.$gte = from;
      if (to) where.created_at.$lte = to;
    }
    const finances = await Finance.findAll({ where });
    res.json(finances);
  } catch (err) {
    next(new InternalError('Error al obtener finanzas', err));
  }
};

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError('Datos inválidos para crear registro financiero', errors.array()));
  }
  try {
    const { user_id, role_id, type, amount, currency, description, reference_id, reference_type } = req.body;
    const finance = await Finance.create({
      user_id,
      role_id,
      type,
      amount,
      currency,
      description,
      reference_id,
      reference_type
    });
    res.status(201).json(finance);
  } catch (err) {
    next(new ValidationError('Error al crear registro financiero', err));
  }
};

exports.getById = async (req, res, next) => {
  try {
    const finance = await Finance.findByPk(req.params.id);
    if (!finance) throw new NotFoundError('Registro financiero no encontrado');
    res.json(finance);
  } catch (err) {
    next(new InternalError('Error al obtener registro financiero', err));
  }
};

exports.remove = async (req, res, next) => {
  try {
    const finance = await Finance.findByPk(req.params.id);
    if (!finance) throw new NotFoundError('Registro financiero no encontrado');
    await finance.destroy();
    res.json({ success: true });
  } catch (err) {
    next(new InternalError('Error al eliminar registro financiero', err));
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const { user_id, role_id, type, from, to, group_by } = req.query;
    const where = {};
    if (user_id) where.user_id = user_id;
    if (role_id) where.role_id = role_id;
    if (type) where.type = type;
    if (from || to) {
      where.created_at = {};
      if (from) where.created_at.$gte = from;
      if (to) where.created_at.$lte = to;
    }
    let attributes = [];
    if (group_by === 'user') {
      attributes = ['user_id', [Finance.sequelize.fn('SUM', Finance.sequelize.col('amount')), 'total']];
      group_by = ['user_id'];
    } else if (group_by === 'role') {
      attributes = ['role_id', [Finance.sequelize.fn('SUM', Finance.sequelize.col('amount')), 'total']];
      group_by = ['role_id'];
    } else if (group_by === 'type') {
      attributes = ['type', [Finance.sequelize.fn('SUM', Finance.sequelize.col('amount')), 'total']];
      group_by = ['type'];
    } else {
      attributes = [[Finance.sequelize.fn('SUM', Finance.sequelize.col('amount')), 'total']];
      group_by = undefined;
    }
    const report = await Finance.findAll({
      where,
      attributes,
      group: group_by,
    });
    res.json(report);
  } catch (err) {
    next(new InternalError('Error al generar reporte financiero', err));
  }
};
