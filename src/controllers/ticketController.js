const { Ticket } = require('../models');

module.exports = {
  async getAll(req, res) {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  },
  async getById(req, res) {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Not found' });
    res.json(ticket);
  },
  async create(req, res) {
    const ticket = await Ticket.create(req.body);
    res.status(201).json(ticket);
  },
  async update(req, res) {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Not found' });
    await ticket.update(req.body);
    res.json(ticket);
  },
  async remove(req, res) {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Not found' });
    await ticket.destroy();
    res.json({ success: true });
  },
};