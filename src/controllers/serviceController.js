const { Service } = require('../models');

module.exports = {
  async getAll(req, res) {
    const services = await Service.findAll();
    res.json(services);
  },
  async getById(req, res) {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Not found' });
    res.json(service);
  },
  async create(req, res) {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  },
  async update(req, res) {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Not found' });
    await service.update(req.body);
    res.json(service);
  },
  async remove(req, res) {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Not found' });
    await service.destroy();
    res.json({ success: true });
  },
};