const { User, PasswordReset } = require('../models');
const crypto = require('crypto');
const { sendEmail } = require('../services/emailService');

// Solicitar recuperación de contraseña
exports.requestReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await PasswordReset.create({ user_id: user.id, token, expires_at });
    await sendEmail({
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Usa este enlace para restablecer tu contraseña: https://tuapp.com/reset-password?token=${token}`
    });
    res.json({ message: 'Correo de recuperación enviado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Restablecer contraseña
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const reset = await PasswordReset.findOne({ where: { token, used: false } });
    if (!reset || reset.expires_at < new Date()) return res.status(400).json({ error: 'Token inválido o expirado' });
    const user = await User.findByPk(reset.user_id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  user.password_hash = await bcrypt.hash(newPassword, saltRounds);
    await user.save();
    reset.used = true;
    await reset.save();
    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
