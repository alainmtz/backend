/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Obtiene todos los proveedores
 *     tags:
 *       - Proveedores
 *     responses:
 *       200:
 *         description: Lista de proveedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Crea un nuevo proveedor
 *     tags:
 *       - Proveedores
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Proveedor creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 */
/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Obtiene un proveedor por ID
 *     tags:
 *       - Proveedores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Proveedor no encontrado
 */
/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Actualiza un proveedor existente
 *     tags:
 *       - Proveedores
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
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Proveedor actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Proveedor no encontrado
 */
/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Elimina un proveedor por ID
 *     tags:
 *       - Proveedores
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
 *         description: Proveedor eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Proveedor no encontrado
 */

const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

const validateSupplier = require('../middlewares/validateSupplier');
const { validationResult } = require('express-validator');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

function handleValidation(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
}

router.get('/', authenticateToken, supplierController.getAll);

router.post('/', authenticateToken, validateSupplier, handleValidation, supplierController.create);
router.get('/:id', supplierController.getById);
router.put('/:id', authenticateToken, authorizeRole('admin', 'developer', 'vendedor'), validateSupplier, handleValidation, supplierController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), supplierController.remove);

module.exports = router;
