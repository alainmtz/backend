/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtiene todos los proyectos
 *     tags:
 *       - Proyectos
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crea un nuevo proyecto
 *     tags:
 *       - Proyectos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Proyecto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtiene un proyecto por ID
 *     tags:
 *       - Proyectos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Proyecto no encontrado
 */
/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Actualiza un proyecto existente
 *     tags:
 *       - Proyectos
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
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Proyecto no encontrado
 */
/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Elimina un proyecto por ID
 *     tags:
 *       - Proyectos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Proyecto no encontrado
 */
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// GET /api/projects
router.get('/', projectController.getAll);
// POST /api/projects
router.post('/', projectController.create);
// GET /api/projects/:id
router.get('/:id', projectController.getById);
// PUT /api/projects/:id
router.put('/:id', projectController.update);
// DELETE /api/projects/:id
router.delete('/:id', projectController.remove);

module.exports = router;
