/**
 * @swagger
 * /api/finances:
 *   get:
 *     summary: Consulta registros financieros
 *     tags:
 *       - Finanzas
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filtrar por usuario
 *       - in: query
 *         name: role_id
 *         schema:
 *           type: integer
 *         description: Filtrar por rol
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de operación
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final
 *     responses:
 *       200:
 *         description: Lista de registros financieros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Finance'
 */
/**
 * @swagger
 * /api/finances:
 *   post:
 *     summary: Crea un registro financiero
 *     tags:
 *       - Finanzas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Finance'
 *     responses:
 *       201:
 *         description: Registro financiero creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Finance'
 */
/**
 * @swagger
 * /api/finances/{id}:
 *   get:
 *     summary: Consulta un registro financiero por ID
 *     tags:
 *       - Finanzas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Finance'
 *       404:
 *         description: Registro no encontrado
 */
/**
 * @swagger
 * /api/finances/{id}:
 *   delete:
 *     summary: Elimina un registro financiero por ID
 *     tags:
 *       - Finanzas
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
 *         description: Registro eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Registro no encontrado
 */
/**
 * @swagger
 * /api/finances/report:
 *   get:
 *     summary: Obtiene reportes agregados de finanzas
 *     tags:
 *       - Finanzas
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filtrar por usuario
 *       - in: query
 *         name: role_id
 *         schema:
 *           type: integer
 *         description: Filtrar por rol
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de operación
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final
 *       - in: query
 *         name: group_by
 *         schema:
 *           type: string
 *           enum: [user, role, type]
 *         description: Agrupar resultados por usuario, rol o tipo
 *     responses:
 *       200:
 *         description: Reporte agregado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   total:
 *                     type: number
 *                   user_id:
 *                     type: integer
 *                   role_id:
 *                     type: integer
 *                   type:
 *                     type: string
 */
const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const { validateCreate } = require('../controllers/financeController');
const { validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Consultar registros financieros (filtros por usuario, rol, tipo, fechas)
router.get('/', authenticateToken, financeController.getAll);
// Crear registro financiero
router.post('/', authenticateToken, authorizeRole('admin', 'finanzas', 'gerente'), validateCreate, handleValidation, financeController.create);
// Consultar registro por ID
router.get('/:id', authenticateToken, financeController.getById);
// Eliminar registro financiero
router.delete('/:id', authenticateToken, authorizeRole('admin', 'finanzas'), financeController.remove);
// Reportes agregados
router.get('/report', authenticateToken, require('../controllers/financeController').getReport);

module.exports = router;
