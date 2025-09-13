const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Lista todos los tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Lista de tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */
router.get('/', ticketController.getAll);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Consulta un ticket por ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket no encontrado
 */
router.get('/:id', ticketController.getById);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Crea un nuevo ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: Ticket creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 */
router.post('/', ticketController.create);

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Actualiza un ticket
 *     tags: [Tickets]
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
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Ticket actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket no encontrado
 */
router.put('/:id', ticketController.update);

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Elimina un ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Ticket no encontrado
 */
router.delete('/:id', ticketController.remove);

module.exports = router;
