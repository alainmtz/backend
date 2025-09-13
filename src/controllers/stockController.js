const { Stock } = require('../models');

// Actualizar stock por ID
exports.update = async (req, res) => {
  try {
  // Buscar el registro Stock por item_id en vez de por id
  const stock = await Stock.findOne({ where: { item_id: req.params.id } });
  if (!stock) return res.status(404).json({ error: 'Stock no encontrado para ese item_id' });
  const { quantity } = req.body;
  if (typeof quantity !== 'number') return res.status(400).json({ error: 'Cantidad inválida' });
  stock.quantity = quantity;
  stock.status = quantity === 0 ? 'out-of-stock' : (quantity < 5 ? 'low-stock' : 'in-stock');
  stock.updated_at = new Date();
  await stock.save();
  res.json(stock);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar stock', details: err.message });
  }
};
