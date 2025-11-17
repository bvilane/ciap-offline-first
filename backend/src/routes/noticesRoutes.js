const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Get database path from env or use default
const DB_PATH = process.env.SQLITE_FILE || './data/ciap.db';
const dbPath = path.resolve(__dirname, '../../', DB_PATH);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Notices route - Database connection error:', err);
  }
});

/**
 * GET /api/v1/notices
 * Fetch notices with filters and pagination
 */
router.get('/', (req, res) => {
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
  const countSql = `SELECT COUNT(*) as total FROM notices ${whereClause}`;
  
  db.get(countSql, params, (err, countRow) => {
    if (err) {
      console.error('GET /api/v1/notices count error:', err);
      return res.status(500).json({
        error: 'Failed to fetch notices',
        message: err.message
      });
    }

    const total = countRow ? countRow.total : 0;

    // Get paginated results
    const sql = `SELECT * FROM notices ${whereClause} ${orderBy} LIMIT ? OFFSET ?`;
    
    db.all(sql, [...params, limit, offset], (err, rows) => {
      if (err) {
        console.error('GET /api/v1/notices data error:', err);
        return res.status(500).json({
          error: 'Failed to fetch notices',
          message: err.message
        });
      }

      res.json({
        data: rows || [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    });
  });
});

/**
 * POST /api/v1/notices
 * Create a new notice (status: pending)
 */
router.post('/', (req, res) => {
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

  const now = new Date().toISOString();
  const sql = 'INSERT INTO notices (community, title, body, contact, featured, status, created_at) VALUES (?,?,?,?,?,?,?)';
  
  db.run(sql, [community, title, body, contact, featured, 'pending', now], function(err) {
    if (err) {
      console.error('POST /api/v1/notices error:', err);
      return res.status(500).json({
        error: 'Failed to create notice',
        message: err.message
      });
    }

    // Fetch the created notice
    db.get('SELECT * FROM notices WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('POST /api/v1/notices fetch error:', err);
        return res.status(500).json({
          error: 'Notice created but failed to retrieve',
          message: err.message
        });
      }

      res.status(201).json(row);
    });
  });
});

module.exports = router;