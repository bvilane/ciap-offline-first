/**
 * Events Routes - Mock Endpoint
 * Place in: backend/src/routes/eventsRoutes.js
 */

const express = require('express');
const router = express.Router();

// GET /api/v1/events - Return empty array directly (not wrapped in object)
router.get('/', (req, res) => {
  res.json([]);
});

module.exports = router;