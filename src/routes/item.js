const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const path = require('path');
const multer = require('multer');

// Configuración de multer para guardar imágenes en /uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// Guardar en /frontend/public/uploads
		cb(null, path.join(__dirname, '../../../frontend/public/uploads'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		const ext = path.extname(file.originalname);
		cb(null, 'imagen-' + uniqueSuffix + ext);
	}
});
const upload = multer({ storage });

// Endpoint para subir imagen
router.post('/upload', upload.single('file'), (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });
	res.json({ image_url: req.file.filename });
});

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Obtiene todos los items
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: Lista de items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 */
router.get('/', itemController.getAll);
/**
 * @swagger
 * /api/items/recommendations:
 *   get:
 *     summary: Obtiene recomendaciones de items con bajo stock y ventas recientes
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: Lista de recomendaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get('/recommendations', itemController.getRecommendations);
const validateItem = require('../middlewares/validateItem');
const { validationResult } = require('express-validator');

// Middleware para manejar errores de validación
function handleValidation(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
}

const { authenticateToken, authorizeRole } = require('../middlewares/auth');

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Crea un nuevo item
 *     tags:
 *       - Items
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 */
router.post('/', authenticateToken, validateItem, handleValidation, itemController.create);
/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Obtiene un item por ID
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item no encontrado
 */
router.get('/:id', itemController.getById);
/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Actualiza un item existente
 *     tags:
 *       - Items
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
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item no encontrado
 */
router.put('/:id', authenticateToken, authorizeRole('admin', 'developer', 'vendedor'), validateItem, handleValidation, itemController.update);
/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Elimina un item por ID
 *     tags:
 *       - Items
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
 *         description: Item eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Item no encontrado
 */
router.delete('/:id', authenticateToken, authorizeRole('admin'), itemController.remove);

module.exports = router;
