// backend/src/routes/health.js
const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Track server start time for uptime calculation
const serverStartTime = Date.now();

/**
 * GET /health
 * Returns system health status
 * 
 * Response format:
 * {
 *   "status": "ok" | "degraded" | "error",
 *   "database": "connected" | "disconnected",
 *   "uptime": "50h 25m",
 *   "timestamp": "2025-11-25T11:38:21.089Z",
 *   "environment": "production" | "development"
 * }
 */
router.get('/health', (req, res) => {
  try {
    // Calculate uptime in hours and minutes
    const uptimeMs = Date.now() - serverStartTime;
    const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const uptime = `${uptimeHours}h ${uptimeMinutes}m`;

    // Check database connectivity
    let databaseStatus = 'connected';
    try {
      // Verify database is accessible with a simple query
      db.prepare('SELECT 1 as test').get();
    } catch (dbError) {
      console.error('Database health check failed:', dbError);
      databaseStatus = 'disconnected';
    }

    // Determine overall system status
    const systemStatus = databaseStatus === 'connected' ? 'ok' : 'degraded';

    const healthResponse = {
      status: systemStatus,
      database: databaseStatus,
      uptime: uptime,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };

    // Return 200 if healthy, 503 if degraded
    const statusCode = systemStatus === 'ok' ? 200 : 503;
    res.status(statusCode).json(healthResponse);

  } catch (error) {
    console.error('Health endpoint error:', error);
    res.status(500).json({
      status: 'error',
      database: 'unknown',
      uptime: '0h 0m',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      error: 'Health check failed'
    });
  }
});

module.exports = router;