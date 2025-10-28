/**
 * Metrics Routes
 */

const express = require('express');
const database = require('../database/connection');
const contentService = require('../services/contentService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * GET /api/v1/metrics/cache
 * Get cache performance statistics
 */
router.get('/cache', async (req, res, next) => {
  try {
    const stats = await contentService.getCacheStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Get cache metrics failed', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/metrics/performance
 * Get system performance metrics
 */
router.get('/performance', async (req, res, next) => {
  try {
    const timeRange = req.query.timeRange || '24h';
    const metrics = await contentService.getPerformanceMetrics(timeRange);

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    logger.error('Get performance metrics failed', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/metrics/system
 * Get system health metrics
 */
router.get('/system', async (req, res, next) => {
  try {
    const metrics = {
      uptime: process.uptime(),
      memory: {
        used: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
        total: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      },
      cpu: process.cpuUsage(),
      nodeVersion: process.version,
    };

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    logger.error('Get system metrics failed', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/metrics/requests
 * Get request log summary
 */
router.get('/requests', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    
    const logs = await database.query(
      `SELECT * FROM request_logs 
       ORDER BY timestamp DESC 
       LIMIT ?`,
      [limit]
    );

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    logger.error('Get request logs failed', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/metrics/comparison
 * Compare online vs offline performance
 */
router.get('/comparison', async (req, res, next) => {
  try {
    const comparison = await database.query(`
      SELECT 
        served_from,
        COUNT(*) as requests,
        AVG(latency_ms) as avg_latency,
        MIN(latency_ms) as min_latency,
        MAX(latency_ms) as max_latency
      FROM request_logs
      WHERE timestamp > datetime('now', '-24 hours')
      GROUP BY served_from
    `);

    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    logger.error('Get comparison failed', { error: error.message });
    next(error);
  }
});

module.exports = router;