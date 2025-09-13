const { Consumible } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const consumibles = await Consumible.findAll();
    res.json(consumibles);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener consumibles' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, usage_count, cost_price, sale_price } = req.body;
    const consumible = await Consumible.create({ name, usage_count, cost_price, sale_price });
    res.status(201).json(consumible);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear consumible', details: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const consumible = await Consumible.findByPk(req.params.id);
    if (!consumible) return res.status(404).json({ error: 'Consumible no encontrado' });
    res.json(consumible);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener consumible' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, usage_count, cost_price, sale_price } = req.body;
    const consumible = await Consumible.findByPk(req.params.id);
    if (!consumible) return res.status(404).json({ error: 'Consumible no encontrado' });
    await consumible.update({ name, usage_count, cost_price, sale_price });
    res.json(consumible);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar consumible', details: err });
  }
};

exports.remove = async (req, res) => {
  try {
    const consumible = await Consumible.findByPk(req.params.id);
    if (!consumible) return res.status(404).json({ error: 'Consumible no encontrado' });
    await consumible.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar consumible' });
  }
};
