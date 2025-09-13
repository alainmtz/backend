const express = require('express');
const router = express.Router();
const consumibleController = require('../controllers/consumibleController');

router.get('/', consumibleController.getAll);
router.post('/', consumibleController.create);
router.get('/:id', consumibleController.getById);
router.put('/:id', consumibleController.update);
router.delete('/:id', consumibleController.remove);

module.exports = router;
