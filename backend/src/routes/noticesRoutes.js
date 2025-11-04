const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/', async (req, res, next) => {
  try {
    const community = req.query.community || 'Acornhoek';
    const featured = req.query.featured === 'true';
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'date';

    await db.connect();

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
    const countResult = await db.queryOne(countSql, params);
    const total = countResult ? countResult.total : 0;

    // Get paginated results
    const sql = `SELECT * FROM notices ${whereClause} ${orderBy} LIMIT ? OFFSET ?`;
    const rows = await db.query(sql, [...params, limit, offset]);

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      community = 'Acornhoek',
      title,
      body = '',
      contact = '',
      featured = 0
    } = req.body || {};

    if (!title) return res.status(400).json({ error: 'title required' });

    await db.connect();
    const now = Date.now();
    const result = await db.execute(
      'INSERT INTO notices (community, title, body, contact, featured, status, created_at) VALUES (?,?,?,?,?,?,?)',
      [community, title, body, contact, featured, 'pending', now]
    );
    const row = await db.queryOne('SELECT * FROM notices WHERE id = ?', [result.lastID]);
    res.json(row);
  } catch (err) {
    next(err);
  }
});

module.exports = router;