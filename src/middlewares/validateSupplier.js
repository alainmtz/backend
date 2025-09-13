const { body } = require('express-validator');

const validateSupplier = [
  body('name').isString().notEmpty().withMessage('El nombre es obligatorio'),
  body('contact_person').optional().isString(),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('phone').optional().isString(),
  body('items_supplied').optional().isString(),
];

module.exports = validateSupplier;
