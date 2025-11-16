/**
 * Content Service - Working Version
 * Fetches from existing notices, jobs, skills tables
 */

const logger = require('../utils/logger');
const database = require('../database/connection');

class ContentService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get all content items - combines notices, jobs, skills
   */
  async getAllContent(filters = {}) {
    try {
      await database.connect();
      
      const community = 'Acornhoek'; // or from filters
      const allContent = [];

      // Fetch notices
      const noticesSql = `SELECT id, title, body as description, 'notice' as type, created_at, community 
                          FROM notices WHERE community = ? AND status = 'approved' 
                          ORDER BY created_at DESC LIMIT 10`;
      const notices = await database.query(noticesSql, [community]);
      allContent.push(...notices.map(n => ({
        id: `notice-${n.id}`,
        title: n.title,
        description: n.description,
        type: 'notice',
        created_at: n.created_at,
        cached: true
      })));

      // Fetch jobs
      const jobsSql = `SELECT id, title, summary as description, 'job' as type, created_at, community 
                       FROM jobs WHERE community = ? AND status = 'approved' 
                       ORDER BY created_at DESC LIMIT 10`;
      const jobs = await database.query(jobsSql, [community]);
      allContent.push(...jobs.map(j => ({
        id: `job-${j.id}`,
        title: j.title,
        description: j.description,
        type: 'job',
        created_at: j.created_at,
        cached: true
      })));

      // Fetch skills
      const skillsSql = `SELECT id, title, summary as description, 'skill' as type, created_at, community 
                         FROM skills WHERE community = ? AND status = 'approved' 
                         ORDER BY created_at DESC LIMIT 10`;
      const skills = await database.query(skillsSql, [community]);
      allContent.push(...skills.map(s => ({
        id: `skill-${s.id}`,
        title: s.title,
        description: s.description,
        type: 'skill',
        created_at: s.created_at,
        cached: true
      })));

      // Apply type filter if provided
      let filtered = allContent;
      if (filters.type && filters.type !== 'all') {
        filtered = allContent.filter(item => item.type === filters.type);
      }

      // Apply search filter if provided
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          (item.description && item.description.toLowerCase().includes(searchLower))
        );
      }

      // Sort by created_at descending
      filtered.sort((a, b) => b.created_at - a.created_at);

      logger.info('Content fetched', { count: filtered.length, filters });
      return filtered;

    } catch (error) {
      logger.error('Get content failed', { error: error.message });
      return [];
    }
  }

  async getContentById(contentId, userId = null) {
    throw new Error('Content not found');
  }

  async createContent(contentData, file, userId) {
    throw new Error('Content creation not implemented');
  }

  async updateContent(contentId, updates, userId) {
    throw new Error('Content update not implemented');
  }

  async deleteContent(contentId, userId) {
    throw new Error('Content deletion not implemented');
  }

  async getCacheStats() {
    return {
      hits: 0,
      misses: 0,
      hitRate: '0%',
      totalEntries: 0,
    };
  }

  async getPerformanceMetrics(timeRange = '24h') {
    return {
      timeRange,
      cacheHitRate: '0%',
      avgCacheLatency: '0ms',
      avgDatabaseLatency: '0ms',
      totalRequests: 0,
      bandwidthSaved: {
        savedRequests: 0,
        savedData: '0 MB',
      },
    };
  }
}

module.exports = new ContentService();