const express = require('express');
const router = express.Router();


router.use('/stock', require('./stock'));
// Example route
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
