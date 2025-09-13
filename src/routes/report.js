const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Genera y guarda un reporte financiero para un periodo
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               period:
 *                 type: string
 *                 example: "2025-09"
 *     responses:
 *       201:
 *         description: Reporte generado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 */
router.post('/', reportController.generate);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Lista reportes financieros
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Lista de reportes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 */
router.get('/', reportController.list);

module.exports = router;
