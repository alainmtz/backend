const { Supplier } = require('../models');

// Obtener todos los proveedores
exports.getAll = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener suppliers' });
  }
};

// Crear proveedor
exports.create = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear supplier', details: err });
  }
};

// Obtener proveedor por ID
exports.getById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier no encontrado' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener supplier' });
  }
};

// Actualizar proveedor
exports.update = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier no encontrado' });
    await supplier.update(req.body);
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar supplier', details: err });
  }
};

// Eliminar proveedor
exports.remove = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier no encontrado' });
    await supplier.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar supplier' });
  }
};
