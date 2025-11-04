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
    const sort = req.query.sort || 'date'; // date, title

    await db.connect();

    // Build WHERE clause
    let whereClause = 'WHERE community = ? AND status = ?';
    const params = [community, 'approved'];

    if (featured) {
      whereClause += ' AND featured = 1';
    }

    // Build ORDER BY clause
    let orderBy = 'ORDER BY posted_at DESC';
    if (sort === 'title') {
      orderBy = 'ORDER BY title ASC';
    }

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM jobs ${whereClause}`;
    const countResult = await db.queryOne(countSql, params);
    const total = countResult ? countResult.total : 0;

    // Get paginated results
    const sql = `SELECT * FROM jobs ${whereClause} ${orderBy} LIMIT ? OFFSET ?`;
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
      summary = '',
      company = '',
      location = '',
      type = '',
      applyUrl = '',
      featured = 0
    } = req.body || {};

    if (!title) return res.status(400).json({ error: 'title required' });

    await db.connect();
    const now = Date.now();
    const result = await db.execute(
      `INSERT INTO jobs (community, title, summary, company, location, type, apply_url, featured, status, posted_at, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [community, title, summary, company, location, type, applyUrl, featured, 'pending', now, now]
    );
    const row = await db.queryOne('SELECT * FROM jobs WHERE id = ?', [result.lastID]);
    res.json(row);
  } catch (err) {
    next(err);
  }
});

module.exports = router;