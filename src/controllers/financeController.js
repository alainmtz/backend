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
const { Finance, User, Role, FinanceHistory } = require('../models');
const { ValidationError, NotFoundError, InternalError } = require('../utils/errors');

// Helper for Sequelize date filtering
function buildDateFilter(from, to) {
  const filter = {};
  if (from) filter[Finance.sequelize.Op.gte] = from;
  if (to) filter[Finance.sequelize.Op.lte] = to;
  return Object.keys(filter).length ? filter : undefined;
}

// GET /api/finances?user_id&role_id&type&from&to&page&pageSize
exports.getAll = async (req, res, next) => {
  try {
    const { user_id, role_id, type, from, to, page = 1, pageSize = 20 } = req.query;
    const where = {};
    if (user_id) where.user_id = user_id;
    if (role_id) where.role_id = role_id;
    if (type) where.type = type;
    const dateFilter = buildDateFilter(from, to);
    if (dateFilter) where.created_at = dateFilter;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);
    const { count, rows } = await Finance.findAndCountAll({ where, offset, limit, order: [['created_at', 'DESC']] });
    res.json({ total: count, page: parseInt(page), pageSize: limit, finances: rows });
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
    // Auditoría: registrar creación

    // Notificación crítica si el monto supera cierto umbral
    if (amount >= 10000) { // Umbral ejemplo, ajusta según tu lógica
      const { sendCriticalNotificationToAdmins } = require('../utils/notificationUtils');
      await sendCriticalNotificationToAdmins({
        type: 'finanzas_critica',
        message: `Movimiento financiero crítico: $${amount} (${type}) por el usuario ${user_id}`
      });
    }
    await FinanceHistory.create({
      finance_id: finance.id,
      action: 'create',
      user_id: req.user?.id || user_id,
      changes: finance.toJSON(),
      reason: 'Creación de registro financiero',
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
    // Auditoría: registrar eliminación
    await FinanceHistory.create({
      finance_id: finance.id,
      action: 'delete',
      user_id: req.user?.id,
      changes: finance.toJSON(),
      reason: 'Eliminación de registro financiero',
    });
    await finance.destroy();
    res.json({ success: true });
  } catch (err) {
    next(new InternalError('Error al eliminar registro financiero', err));
  }
};
// Auditoría en actualización de finanzas
exports.update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError('Datos inválidos para actualizar registro financiero', errors.array()));
  }
  try {
    const finance = await Finance.findByPk(req.params.id);
    if (!finance) throw new NotFoundError('Registro financiero no encontrado');
    const oldData = finance.toJSON();
    await finance.update(req.body);
    await FinanceHistory.create({
      finance_id: finance.id,
      action: 'update',
      user_id: req.user?.id,
      changes: { before: oldData, after: finance.toJSON() },
      reason: req.body.reason || 'Actualización de registro financiero',
    });
    res.json(finance);
  } catch (err) {
    next(new InternalError('Error al actualizar registro financiero', err));
  }
};

// GET /api/finances/report?group_by=user|role|type|month|year&user_id&role_id&type&from&to
exports.getReport = async (req, res, next) => {
  try {
    const { user_id, role_id, type, from, to, group_by } = req.query;
    const where = {};
    if (user_id) where.user_id = user_id;
    if (role_id) where.role_id = role_id;
    if (type) where.type = type;
    const dateFilter = buildDateFilter(from, to);
    if (dateFilter) where.created_at = dateFilter;

    let attributes = [];
    let group = undefined;
    if (group_by === 'user') {
      attributes = ['user_id', [Finance.sequelize.fn('SUM', Finance.sequelize.col('amount')), 'total']];
      group = ['user_id'];
    } else if (group_by === 'role') {
      attributes = ['role_id', [Finance.sequelize.fn('SUM', Finance.sequelize.col('amount')), 'total']];
      group = ['role_id'];
    } else if (group_by === 'type') {
      attributes = ['type', [Finance.sequelize.fn('SUM', Finance.sequelize.col('amount')), 'total']];
      group = ['type'];
    } else if (group_by === 'week') {
      attributes = [
        [Finance.sequelize.fn('YEAR', Finance.sequelize.col('created_at')), 'year'],
        [Finance.sequelize.fn('WEEK', Finance.sequelize.col('created_at')), 'week'],
        [Finance.sequelize.fn('SUM', Finance.sequelize.col('amount')), 'total']
      ];
      group = [Finance.sequelize.fn('YEAR', Finance.sequelize.col('created_at')), Finance.sequelize.fn('WEEK', Finance.sequelize.col('created_at'))];
    } else if (group_by === 'month') {
      attributes = [
        [Finance.sequelize.fn('YEAR', Finance.sequelize.col('created_at')), 'year'],
        [Finance.sequelize.fn('MONTH', Finance.sequelize.col('created_at')), 'month'],
        [Finance.sequelize.fn('SUM', Finance.sequelize.col('amount')), 'total']
      ];
      group = [Finance.sequelize.fn('YEAR', Finance.sequelize.col('created_at')), Finance.sequelize.fn('MONTH', Finance.sequelize.col('created_at'))];
    } else if (group_by === 'year') {
      attributes = [
        [Finance.sequelize.fn('YEAR', Finance.sequelize.col('created_at')), 'year'],
        [Finance.sequelize.fn('SUM', Finance.sequelize.col('amount')), 'total']
      ];
      group = [Finance.sequelize.fn('YEAR', Finance.sequelize.col('created_at'))];
    } else {
      attributes = [[Finance.sequelize.fn('SUM', Finance.sequelize.col('amount')), 'total']];
    }
    const report = await Finance.findAll({
      where,
      attributes,
      group,
      order: group ? [[Finance.sequelize.col('created_at'), 'DESC']] : undefined
    });
    res.json(report);
  } catch (err) {
    next(new InternalError('Error al generar reporte financiero', err));
  }
};
