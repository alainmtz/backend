
const { ValidationError, AuthError, NotFoundError, InternalError } = require('../utils/errors');
const { Transaction, Item, User } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: Item, as: 'item' },
        { model: User, as: 'user' }
      ]
    });
    res.json(transactions);
  } catch (err) {
    next(new InternalError('Error al obtener transacciones', err.message));
  }
};

const { body, validationResult } = require('express-validator');

exports.validateCreate = [
  body('item_id').isInt().withMessage('item_id debe ser un entero'),
  body('user_id').isInt().withMessage('user_id debe ser un entero'),
  body('type').isString().notEmpty().withMessage('El tipo es obligatorio'),
  body('quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser un entero positivo'),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('notes').optional().isString(),
];

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError('Datos inválidos para crear transacción', errors.array()));
  }
  try {
    const { item_id, user_id, type, quantity, price, notes } = req.body;
    const transaction = await Transaction.create({
      item_id,
      user_id,
      type,
      quantity,
      price,
      notes
    });
    res.status(201).json(transaction);
  } catch (err) {
    next(new ValidationError('Error al crear transacción', err.message));
  }
};

exports.getById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        { model: Item, as: 'item' },
        { model: User, as: 'user' }
      ]
    });
    if (!transaction) return next(new NotFoundError('Transacción no encontrada'));
    res.json(transaction);
  } catch (err) {
    next(new InternalError('Error al obtener transacción', err.message));
  }
};

exports.update = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return next(new NotFoundError('Transacción no encontrada'));
    await transaction.update(req.body);
    res.json(transaction);
  } catch (err) {
    next(new ValidationError('Error al actualizar transacción', err.message));
  }
};

exports.remove = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return next(new NotFoundError('Transacción no encontrada'));
    await transaction.destroy();
    res.json({ success: true });
  } catch (err) {
    next(new InternalError('Error al eliminar transacción', err.message));
  }
};
