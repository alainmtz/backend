/**
 * @swagger
 * /api/consumibles:
 *   get:
 *     summary: Obtiene todos los consumibles
 *     tags:
 *       - Consumibles
 *     responses:
 *       200:
 *         description: Lista de consumibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consumible'
 */
/**
 * @swagger
 * /api/consumibles:
 *   post:
 *     summary: Crea un nuevo consumible
 *     tags:
 *       - Consumibles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Consumible'
 *     responses:
 *       201:
 *         description: Consumible creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consumible'
 */
/**
 * @swagger
 * /api/consumibles/{id}:
 *   get:
 *     summary: Obtiene un consumible por ID
 *     tags:
 *       - Consumibles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consumible encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consumible'
 *       404:
 *         description: Consumible no encontrado
 */
/**
 * @swagger
 * /api/consumibles/{id}:
 *   put:
 *     summary: Actualiza un consumible existente
 *     tags:
 *       - Consumibles
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
 *             $ref: '#/components/schemas/Consumible'
 *     responses:
 *       200:
 *         description: Consumible actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consumible'
 *       404:
 *         description: Consumible no encontrado
 */
/**
 * @swagger
 * /api/consumibles/{id}:
 *   delete:
 *     summary: Elimina un consumible por ID
 *     tags:
 *       - Consumibles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consumible eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Consumible no encontrado
 */
const express = require('express');
const router = express.Router();
const consumibleController = require('../controllers/consumibleController');

router.get('/', consumibleController.getAll);
router.post('/', consumibleController.create);
router.get('/:id', consumibleController.getById);
router.put('/:id', consumibleController.update);
router.delete('/:id', consumibleController.remove);

module.exports = router;
