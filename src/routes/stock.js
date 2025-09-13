/**
 * @swagger
 * /api/stock/{id}:
 *   put:
 *     summary: Actualiza el stock de un item
 *     tags:
 *       - Stock
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stock:
 *                   $ref: '#/components/schemas/Stock'
 */
const express = require('express');
const stockController = require('../controllers/stockController');
const router = express.Router();

// PUT /api/stock/:id
router.put('/:id', stockController.update);

module.exports = router;
// ...existing code...
