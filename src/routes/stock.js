const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// PUT /api/stock/:id
router.put('/:id', stockController.update);

module.exports = router;
