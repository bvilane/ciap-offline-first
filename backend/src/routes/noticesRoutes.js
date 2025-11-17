const express = require('express');
const router = express.Router();
const db = require('../database/connection');

/**
 * GET /api/v1/notices
 * Fetch notices with filters and pagination
 */
router.get('/', async (req, res) => {
  try {
    const community = req.query.community || 'Acornhoek';
    const featured = req.query.featured === 'true';
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'date';

    // Build WHERE clause
    let whereClause = 'WHERE community = ? AND status = ?';
    const params = [community, 'approved'];

    if (featured) {
      whereClause += ' AND featured = 1';
    }

    // Build ORDER BY clause
    let orderBy = 'ORDER BY created_at DESC';
    if (sort === 'title') {
      orderBy = 'ORDER BY title ASC';
    }

    // Get total count
    const total = await new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) as total FROM notices ${whereClause}`;
      db.get(countSql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.total : 0);
      });
    });

    // Get paginated results
    const rows = await new Promise((resolve, reject) => {
      const sql = `SELECT * FROM notices ${whereClause} ${orderBy} LIMIT ? OFFSET ?`;
      db.all(sql, [...params, limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET /api/v1/notices error:', error);
    res.status(500).json({
      error: 'Failed to fetch notices',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/notices
 * Create a new notice (status: pending)
 */
router.post('/', async (req, res) => {
  try {
    const {
      community = 'Acornhoek',
      title,
      body = '',
      contact = '',
      featured = 0
    } = req.body || {};

    if (!title) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'title is required' 
      });
    }

    const result = await new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      db.run(
        'INSERT INTO notices (community, title, body, contact, featured, status, created_at) VALUES (?,?,?,?,?,?,?)',
        [community, title, body, contact, featured, 'pending', now],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });

    const notice = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM notices WHERE id = ?', [result.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.status(201).json(notice);
  } catch (error) {
    console.error('POST /api/v1/notices error:', error);
    res.status(500).json({
      error: 'Failed to create notice',
      message: error.message
    });
  }
});

module.exports = router;