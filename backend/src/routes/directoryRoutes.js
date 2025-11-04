const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/', async (req, res, next) => {
  try {
    const community = req.query.community || 'Acornhoek';
    const category = req.query.category;
    const limit = parseInt(req.query.limit) || 200;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'name';

    await db.connect();

    // Build WHERE clause
    let whereClause = 'WHERE community = ?';
    const params = [community];

    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    // Build ORDER BY clause
    let orderBy = 'ORDER BY name ASC';
    if (sort === 'category') {
      orderBy = 'ORDER BY category ASC, name ASC';
    } else if (sort === 'date') {
      orderBy = 'ORDER BY created_at DESC';
    }

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM directory ${whereClause}`;
    const countResult = await db.queryOne(countSql, params);
    const total = countResult ? countResult.total : 0;

    // Get paginated results
    const sql = `SELECT * FROM directory ${whereClause} ${orderBy} LIMIT ? OFFSET ?`;
    const rows = await db.query(sql, [...params, limit, offset]);

    // Get available categories
    const categoriesSql = 'SELECT DISTINCT category FROM directory WHERE community = ? AND category IS NOT NULL ORDER BY category';
    const categories = await db.query(categoriesSql, [community]);

    res.json({
      data: rows,
      categories: categories.map(c => c.category),
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
      name,
      description = '',
      category = '',
      phone = '',
      website = '',
      hours = '',
      address = ''
    } = req.body || {};

    if (!name) return res.status(400).json({ error: 'name required' });

    await db.connect();
    const now = Date.now();
    const result = await db.execute(
      `INSERT INTO directory (community, name, description, category, phone, website, hours, address, created_at)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [community, name, description, category, phone, website, hours, address, now]
    );
    const row = await db.queryOne('SELECT * FROM directory WHERE id = ?', [result.lastID]);
    res.json(row);
  } catch (err) {
    next(err);
  }
});

module.exports = router;