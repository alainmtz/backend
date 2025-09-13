const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// GET /api/suppliers
router.get('/', supplierController.getAll);
// POST /api/suppliers
router.post('/', supplierController.create);
// GET /api/suppliers/:id
router.get('/:id', supplierController.getById);
// PUT /api/suppliers/:id
router.put('/:id', supplierController.update);
// DELETE /api/suppliers/:id
router.delete('/:id', supplierController.remove);

module.exports = router;
