const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Lista todos los servicios
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get('/', serviceController.getAll);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Consulta un servicio por ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/:id', serviceController.getById);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Crea un nuevo servicio
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Servicio creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 */
router.post('/', serviceController.create);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Actualiza un servicio
 *     tags: [Services]
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
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Servicio actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Servicio no encontrado
 */
router.put('/:id', serviceController.update);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Elimina un servicio
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Servicio no encontrado
 */
router.delete('/:id', serviceController.remove);

module.exports = router;
