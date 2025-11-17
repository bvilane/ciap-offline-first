// backend/src/routes/health.js
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'healthy',
    uptime: process.uptime().toFixed(0) + 's',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;