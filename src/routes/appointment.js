const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Lista todas las citas
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Lista de citas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */
router.get('/', appointmentController.getAll);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Consulta una cita por ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cita encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Cita no encontrada
 */
router.get('/:id', appointmentController.getById);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Crea una nueva cita
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Cita creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 */
router.post('/', appointmentController.create);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Actualiza una cita
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Cita actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Cita no encontrada
 */
router.put('/:id', appointmentController.update);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Elimina una cita
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cita eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Cita no encontrada
 */
router.delete('/:id', appointmentController.remove);

module.exports = router;
