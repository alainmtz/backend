const { body } = require('express-validator');

const validatePurchase = [
  body('items').isString().notEmpty().withMessage('Debes especificar los items'),
  body('metodo_compra').isIn(['tienda online','tienda fisica','proveedor local','proveedor extranjero','proveedor interno']).withMessage('Método de compra inválido'),
  body('proveedor_id').optional().isInt({ min: 1 }),
  body('proveedor_nombre').optional().isString(),
  body('costo_envio').optional().isFloat({ min: 0 }),
  body('fecha_compra').optional().isISO8601(),
  body('notas').optional().isString(),
];

module.exports = validatePurchase;
