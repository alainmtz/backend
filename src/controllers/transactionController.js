const { Transaction, Item, User } = require('../models');

// Obtener todas las transacciones
exports.getAll = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: Item, as: 'item' },
        { model: User, as: 'user' }
      ]
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener transacciones', details: err });
  }
};

// Crear una transacción
exports.create = async (req, res) => {
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
    res.status(400).json({ error: 'Error al crear transacción', details: err });
  }
};

// Obtener una transacción por ID
exports.getById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        { model: Item, as: 'item' },
        { model: User, as: 'user' }
      ]
    });
    if (!transaction) return res.status(404).json({ error: 'Transacción no encontrada' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener transacción', details: err });
  }
};

// Actualizar una transacción
exports.update = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transacción no encontrada' });
    await transaction.update(req.body);
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar transacción', details: err });
  }
};

// Eliminar una transacción
exports.remove = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transacción no encontrada' });
    await transaction.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar transacción', details: err });
  }
};
