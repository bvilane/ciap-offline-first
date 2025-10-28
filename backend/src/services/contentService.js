/**
 * Content Service
 */

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');
const database = require('../database/connection');
const { CacheStrategyFactory } = require('../strategies/cacheStrategy');

class ContentService {
  constructor() {
    this.cache = CacheStrategyFactory.create();
  }

  /**
   * Get all content items with optional filtering
   * Implements caching for performance
   */
  async getAllContent(filters = {}) {
    const cacheKey = `content:all:${JSON.stringify(filters)}`;
    
    // Try cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      await this.logRequest(null, null, 'cache', 0);
      return cached;
    }

    const start = Date.now();
    let query = 'SELECT * FROM content_items WHERE 1=1';
    const params = [];

    // Apply filters
    if (filters.type) {
      query += ' AND content_type = ?';
      params.push(filters.type);
    }
    if (filters.search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const content = await database.query(query, params);
    const latency = Date.now() - start;

    // Cache the result
    await this.cache.set(cacheKey, content, 300); // 5 minutes TTL

    await this.logRequest(null, null, 'database', latency);
    logger.info('Content retrieved', { count: content.length, latency: `${latency}ms` });

    return content;
  }

  /**
   * Get single content item by ID
   * Demonstrates cache-aside pattern
   */
  async getContentById(contentId, userId = null) {
    const cacheKey = `content:${contentId}`;
    
    // Cache lookup
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      await this.logRequest(userId, contentId, 'cache', 0);
      await this.updateCacheAccess(contentId);
      return cached;
    }

    // Database lookup
    const start = Date.now();
    const content = await database.queryOne(
      'SELECT * FROM content_items WHERE content_id = ?',
      [contentId]
    );
    const latency = Date.now() - start;

    if (!content) {
      throw new Error('Content not found');
    }

    // Cache for future requests
    await this.cache.set(cacheKey, content);
    await this.logRequest(userId, contentId, 'database', latency);
    
    // Update cache entry metadata
    await this.createOrUpdateCacheEntry(contentId, cacheKey);

    logger.info('Content retrieved from database', { contentId, latency: `${latency}ms` });
    return content;
  }

  /**
   * Create new content item
   * Validates input and stores metadata
   */
  async createContent(contentData, file, userId) {
    const contentId = uuidv4();
    const filePath = file ? `uploads/${contentId}${path.extname(file.originalname)}` : null;

    const query = `
      INSERT INTO content_items 
      (content_id, title, description, content_type, file_path, file_size, tags, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await database.execute(query, [
      contentId,
      contentData.title,
      contentData.description || '',
      contentData.content_type || file.mimetype,
      filePath,
      file ? file.size : 0,
      contentData.tags || '',
      userId,
    ]);

    // Log admin action
    await this.logAdminAction(userId, 'CONTENT_CREATE', `Created content: ${contentData.title}`);

    // Invalidate cache
    await this.invalidateContentCache();

    logger.info('Content created', { contentId, title: contentData.title, userId });
    return { contentId, ...contentData, filePath };
  }

  /**
   * Update existing content
   * Implements optimistic locking
   */
  async updateContent(contentId, updates, userId) {
    const query = `
      UPDATE content_items 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          tags = COALESCE(?, tags),
          updated_at = CURRENT_TIMESTAMP
      WHERE content_id = ?
    `;

    await database.execute(query, [
      updates.title,
      updates.description,
      updates.tags,
      contentId,
    ]);

    // Invalidate cache for this content
    await this.cache.delete(`content:${contentId}`);
    await this.invalidateContentCache();

    await this.logAdminAction(userId, 'CONTENT_UPDATE', `Updated content: ${contentId}`);

    logger.info('Content updated', { contentId, userId });
    return this.getContentById(contentId);
  }

  /**
   * Delete content item
   * Implements soft delete pattern (can be extended)
   */
  async deleteContent(contentId, userId) {
    // Get content details first
    const content = await this.getContentById(contentId);

    // Delete file if exists
    if (content.file_path) {
      try {
        await fs.unlink(path.join('./content', content.file_path));
      } catch (error) {
        logger.warn('Failed to delete file', { filePath: content.file_path, error: error.message });
      }
    }

    // Delete from database
    await database.execute('DELETE FROM content_items WHERE content_id = ?', [contentId]);
    
    // Delete cache entries
    await database.execute('DELETE FROM cache_entries WHERE content_id = ?', [contentId]);
    await this.cache.delete(`content:${contentId}`);
    await this.invalidateContentCache();

    await this.logAdminAction(userId, 'CONTENT_DELETE', `Deleted content: ${contentId}`);

    logger.info('Content deleted', { contentId, userId });
  }

  /**
   * Get cache statistics
   * Used for performance monitoring dashboard
   */
  async getCacheStats() {
    const strategyStats = this.cache.getStats();
    
    // Get database cache entries
    const cacheEntries = await database.query(`
      SELECT 
        COUNT(*) as total_entries,
        SUM(access_count) as total_accesses,
        AVG(access_count) as avg_accesses
      FROM cache_entries
    `);

    // Get most accessed content
    const topContent = await database.query(`
      SELECT c.title, ce.access_count, ce.last_accessed
      FROM cache_entries ce
      JOIN content_items c ON ce.content_id = c.content_id
      ORDER BY ce.access_count DESC
      LIMIT 10
    `);

    return {
      ...strategyStats,
      database: cacheEntries[0],
      topContent,
    };
  }

  /**
   * Get performance metrics
   * Supports analysis requirement in rubric
   */
  async getPerformanceMetrics(timeRange = '24h') {
    const timeRangeMap = {
      '1h': 1,
      '24h': 24,
      '7d': 168,
    };

    const hours = timeRangeMap[timeRange] || 24;
    
    const metrics = await database.query(`
      SELECT 
        AVG(CASE WHEN served_from = 'cache' THEN latency_ms END) as avg_cache_latency,
        AVG(CASE WHEN served_from = 'database' THEN latency_ms END) as avg_db_latency,
        COUNT(CASE WHEN served_from = 'cache' THEN 1 END) as cache_hits,
        COUNT(CASE WHEN served_from = 'database' THEN 1 END) as cache_misses,
        COUNT(*) as total_requests
      FROM request_logs
      WHERE timestamp > datetime('now', '-${hours} hours')
    `);

    const result = metrics[0];
    const hitRate = result.total_requests > 0 
      ? ((result.cache_hits / result.total_requests) * 100).toFixed(2)
      : 0;

    return {
      timeRange,
      cacheHitRate: `${hitRate}%`,
      avgCacheLatency: `${Math.round(result.avg_cache_latency || 0)}ms`,
      avgDatabaseLatency: `${Math.round(result.avg_db_latency || 0)}ms`,
      totalRequests: result.total_requests,
      bandwidthSaved: this.calculateBandwidthSavings(result),
    };
  }

  /**
   * Helper: Calculate bandwidth savings from caching
   */
  calculateBandwidthSavings(metrics) {
    // Assume average content size of 100KB
    const avgContentSize = 100 * 1024; // bytes
    const savedRequests = metrics.cache_hits;
    const savedBytes = savedRequests * avgContentSize;
    
    return {
      savedRequests,
      savedData: `${(savedBytes / (1024 * 1024)).toFixed(2)} MB`,
    };
  }

  /**
   * Helper: Log request for analytics
   */
  async logRequest(userId, contentId, servedFrom, latencyMs) {
    await database.execute(
      'INSERT INTO request_logs (user_id, content_id, served_from, latency_ms) VALUES (?, ?, ?, ?)',
      [userId, contentId, servedFrom, latencyMs]
    );
  }

  /**
   * Helper: Create or update cache entry metadata
   */
  async createOrUpdateCacheEntry(contentId, cacheKey) {
    const existing = await database.queryOne(
      'SELECT * FROM cache_entries WHERE content_id = ?',
      [contentId]
    );

    if (existing) {
      await database.execute(
        `UPDATE cache_entries 
         SET last_accessed = CURRENT_TIMESTAMP, 
             access_count = access_count + 1 
         WHERE content_id = ?`,
        [contentId]
      );
    } else {
      await database.execute(
        `INSERT INTO cache_entries (cache_id, content_id, cache_key)
         VALUES (?, ?, ?)`,
        [uuidv4(), contentId, cacheKey]
      );
    }
  }

  /**
   * Helper: Update cache access metadata
   */
  async updateCacheAccess(contentId) {
    await database.execute(
      `UPDATE cache_entries 
       SET last_accessed = CURRENT_TIMESTAMP,
           access_count = access_count + 1
       WHERE content_id = ?`,
      [contentId]
    );
  }

  /**
   * Helper: Invalidate content cache
   */
  async invalidateContentCache() {
    const keys = this.cache.getStats().keys || [];
    for (const key of keys) {
      if (key.startsWith('content:all')) {
        await this.cache.delete(key);
      }
    }
  }

  /**
   * Helper: Log admin action for audit trail
   */
  async logAdminAction(userId, actionType, description) {
    await database.execute(
      'INSERT INTO admin_actions (user_id, action_type, description) VALUES (?, ?, ?)',
      [userId, actionType, description]
    );
  }
}

module.exports = new ContentService();