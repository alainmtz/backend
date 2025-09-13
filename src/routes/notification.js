const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Crea una notificación y envía por WhatsApp si es crítica
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notificación creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 */
router.post('/', notificationController.create);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Lista notificaciones de un usuario
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
router.get('/', notificationController.list);

/**
 * @swagger
 * /api/notifications/{id}/confirm:
 *   post:
 *     summary: Confirma una notificación (solo admin)
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificación confirmada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notificación no encontrada
 */
router.post('/:id/confirm', notificationController.confirm);

module.exports = router;
