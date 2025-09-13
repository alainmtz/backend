const { Appointment } = require('../models');

module.exports = {
  async getAll(req, res) {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  },
  async getById(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Not found' });
    res.json(appointment);
  },
  async create(req, res) {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  },
  async update(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Not found' });
    await appointment.update(req.body);
    res.json(appointment);
  },
  async remove(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Not found' });
    await appointment.destroy();
    res.json({ success: true });
  },
};