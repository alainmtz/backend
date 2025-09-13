const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

/**
 * @swagger
 * /api/password/request:
 *   post:
 *     summary: Solicita recuperación de contraseña
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo de recuperación enviado
 */
router.post('/request', passwordController.requestReset);

/**
 * @swagger
 * /api/password/reset:
 *   post:
 *     summary: Restablece la contraseña usando el token
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña restablecida correctamente
 */
router.post('/reset', passwordController.resetPassword);

module.exports = router;
