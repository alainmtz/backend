const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

router.post('/', async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token requerido' });
  try {
    // Verificar refresh token
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    const roles = await user.getRoles();
    const roleNames = roles.map(r => r.name);
    // Generar nuevo access token
    const token = jwt.sign({ id: user.id, roles: roleNames, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(403).json({ error: 'Refresh token inválido', details: err.message });
  }
});

module.exports = router;
