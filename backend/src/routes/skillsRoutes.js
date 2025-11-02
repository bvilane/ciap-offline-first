const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/', async (req, res, next) => {
  try {
    const community = req.query.community || 'Acornhoek';
    await db.connect();
    const rows = await db.query(
      'SELECT * FROM skills WHERE community = ? ORDER BY COALESCE(starts_at, 0) DESC LIMIT 50',
      [community]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      community = 'Acornhoek',
      title, provider = '', summary = '', url = '', startsAt = null
    } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title required' });

    await db.connect();
    const result = await db.execute(
      `INSERT INTO skills (community, title, provider, summary, url, starts_at)
       VALUES (?,?,?,?,?,?)`,
      [community, title, provider, summary, url, startsAt ? Number(startsAt) : null]
    );
    const row = await db.queryOne('SELECT * FROM skills WHERE id = ?', [result.lastID]);
    res.json(row);
  } catch (err) { next(err); }
});

module.exports = router;
