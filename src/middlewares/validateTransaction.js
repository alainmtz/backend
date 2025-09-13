const { body } = require('express-validator');

const validateTransaction = [
  body('item_id').isInt({ min: 1 }).withMessage('ID de item inválido'),
  body('user_id').isInt({ min: 1 }).withMessage('ID de usuario inválido'),
  body('type').isIn(['sale','purchase','adjustment']).withMessage('Tipo de transacción inválido'),
  body('quantity').isInt({ min: 1 }).withMessage('Cantidad debe ser positiva'),
  body('price').optional().isFloat({ min: 0 }),
  body('notes').optional().isString(),
  body('transaction_date').optional().isISO8601(),
];

module.exports = validateTransaction;
