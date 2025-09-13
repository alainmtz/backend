const { Notification, User } = require('../models');
const { sendWhatsApp } = require('../services/whatsappService');

// Crear notificación y enviar por WhatsApp si es crítica
exports.create = async (req, res) => {
  try {
    const { user_id, type, message, status } = req.body;
    const notification = await Notification.create({ user_id, type, message, status });
    // Si es notificación crítica de finanzas, enviar WhatsApp
    if (type === 'whatsapp' || type === 'finanzas_critica') {
      const user = await User.findByPk(user_id);
      if (user && user.phone) {
        await sendWhatsApp({ to: user.phone, message });
      }
    }
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar notificaciones para un usuario
exports.list = async (req, res) => {
  try {
    const { user_id } = req.query;
    const notifications = await Notification.findAll({ where: { user_id } });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Confirmar notificación (solo admin)
exports.confirm = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' });
    notification.status = 'confirmada';
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
