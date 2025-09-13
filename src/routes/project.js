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
