const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y obtiene un token JWT
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@dominio.com
 *               password:
 *                 type: string
 *                 example: tu_contraseña
 *     responses:
 *       200:
 *         description: Token JWT generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Credenciales inválidas
 */

router.post('/login', [
  body('email').isEmail(),
  body('password').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('[LOGIN] Usuario no encontrado:', email);
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      console.log('[LOGIN] Contraseña incorrecta para:', email);
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    // Obtener todos los roles del usuario
    const roles = await user.getRoles();
    const roleNames = roles.map(r => r.name);
    console.log('[LOGIN] Roles del usuario:', roleNames);
    const payload = { id: user.id, roles: roleNames, email: user.email };
    console.log('[LOGIN] Payload JWT:', payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    console.log('[LOGIN] Token generado:', token);
    res.json({ token, refreshToken });
  } catch (err) {
    console.log('[LOGIN] Error en login:', err);
    res.status(500).json({ error: 'Error en login', details: err.message });
  }
});

module.exports = router;
