/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Obtiene todas las transacciones
 *     tags:
 *       - Transacciones
 *     responses:
 *       200:
 *         description: Lista de transacciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Crea una nueva transacción
 *     tags:
 *       - Transacciones
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transacción creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Obtiene una transacción por ID
 *     tags:
 *       - Transacciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transacción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transacción no encontrada
 */
/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Actualiza una transacción existente
 *     tags:
 *       - Transacciones
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transacción actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transacción no encontrada
 */
/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Elimina una transacción por ID
 *     tags:
 *       - Transacciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transacción eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Transacción no encontrada
 */

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const validateTransaction = require('../middlewares/validateTransaction');
const { validationResult } = require('express-validator');

function handleValidation(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
}

router.get('/', transactionController.getAll);
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

router.post('/', authenticateToken, validateTransaction, handleValidation, transactionController.create);
router.get('/:id', transactionController.getById);
router.put('/:id', authenticateToken, authorizeRole('admin', 'developer', 'vendedor'), validateTransaction, handleValidation, transactionController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), transactionController.remove);

module.exports = router;
