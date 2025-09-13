const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const path = require('path');
const multer = require('multer');

// Configuración de multer para guardar imágenes en /uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../../uploads'));
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

// GET /api/items
router.get('/', itemController.getAll);
// GET /api/items/recommendations
router.get('/recommendations', itemController.getRecommendations);
// POST /api/items
router.post('/', itemController.create);
// GET /api/items/:id
router.get('/:id', itemController.getById);
// PUT /api/items/:id
router.put('/:id', itemController.update);
// DELETE /api/items/:id
router.delete('/:id', itemController.remove);

module.exports = router;
