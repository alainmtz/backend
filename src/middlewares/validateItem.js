const { body } = require('express-validator');

const validateItem = [
  body('name').isString().notEmpty().withMessage('El nombre es obligatorio'),
  body('sku').isString().notEmpty().withMessage('El SKU es obligatorio'),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('La cantidad debe ser un entero positivo'),
  body('supplier_id').optional().isInt({ min: 1 }).withMessage('El proveedor debe ser un ID válido'),
  body('status').optional().isIn(['in-stock','low-stock','out-of-stock','discontinued']).withMessage('Estado inválido'),
  body('image_url').optional().isString(),
];

module.exports = validateItem;
