/**
 * Content API Routes
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const contentService = require('../services/contentService');
const { validateContent } = require('../validators/contentValidator');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './content/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/html'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

/**
 * GET /api/v1/content
 * Get all content items with optional filtering
 * Public access
 */
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      search: req.query.search,
    };

    const content = await contentService.getAllContent(filters);

    res.json({
      success: true,
      count: content.length,
      data: content,
    });
  } catch (error) {
    logger.error('Get content failed', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/content/:id
 * Get single content item by ID
 * Public access
 */
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user?.userId || null;
    const content = await contentService.getContentById(req.params.id, userId);

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    if (error.message === 'Content not found') {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }
    logger.error('Get content by ID failed', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/content
 * Create new content item
 * Requires authentication and admin role
 */
router.post('/', authMiddleware, adminMiddleware, upload.single('file'), async (req, res, next) => {
  try {
    // Validate request body
    const { error } = validateContent(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details[0].message,
      });
    }

    const content = await contentService.createContent(
      req.body,
      req.file,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: content,
    });
  } catch (error) {
    logger.error('Create content failed', { error: error.message });
    next(error);
  }
});

/**
 * PUT /api/v1/content/:id
 * Update existing content item
 * Requires authentication and admin role
 */
router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const content = await contentService.updateContent(
      req.params.id,
      req.body,
      req.user.userId
    );

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: content,
    });
  } catch (error) {
    logger.error('Update content failed', { error: error.message });
    next(error);
  }
});

/**
 * DELETE /api/v1/content/:id
 * Delete content item
 * Requires authentication and admin role
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await contentService.deleteContent(req.params.id, req.user.userId);

    res.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    logger.error('Delete content failed', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/content/stats/cache
 * Get cache statistics
 * Public access
 */
router.get('/stats/cache', async (req, res, next) => {
  try {
    const stats = await contentService.getCacheStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Get cache stats failed', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/content/stats/performance
 * Get performance metrics
 * Public access
 */
router.get('/stats/performance', async (req, res, next) => {
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

module.exports = router;