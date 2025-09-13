const { Stock } = require('../models');
const { ValidationError, NotFoundError, InternalError } = require('../utils/errors');

// Actualizar stock por ID
exports.update = async (req, res, next) => {
  try {
    // Buscar el registro Stock por item_id en vez de por id
    const stock = await Stock.findOne({ where: { item_id: req.params.id } });
    if (!stock) throw new NotFoundError('Stock no encontrado para ese item_id');
    const { quantity } = req.body;
    if (typeof quantity !== 'number') throw new ValidationError('Cantidad inválida');
    stock.quantity = quantity;
    stock.status = quantity === 0 ? 'out-of-stock' : (quantity < 5 ? 'low-stock' : 'in-stock');
    stock.updated_at = new Date();
    await stock.save();
    res.json(stock);
  } catch (err) {
    if (err instanceof NotFoundError || err instanceof ValidationError) return next(err);
    next(new InternalError('Error al actualizar stock', err));
  }
};
