const express = require('express');
const router = express.Router();


router.use('/stock', require('./stock'));
router.use('/services', require('./service'));
router.use('/tickets', require('./ticket'));
router.use('/appointments', require('./appointment'));
router.use('/projects', require('./project'));
// Example route
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
