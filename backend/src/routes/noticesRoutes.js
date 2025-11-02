const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/', async (req, res, next) => {
  try {
    const community = req.query.community || 'Acornhoek';
    await db.connect();
    const rows = await db.query(
      'SELECT * FROM notices WHERE community = ? ORDER BY created_at DESC LIMIT 50',
      [community]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { community = 'Acornhoek', title, body = '' } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title required' });

    await db.connect();
    const now = Date.now();
    const result = await db.execute(
      'INSERT INTO notices (community, title, body, created_at) VALUES (?,?,?,?)',
      [community, title, body, now]
    );
    const row = await db.queryOne('SELECT * FROM notices WHERE id = ?', [result.lastID]);
    res.json(row);
  } catch (err) { next(err); }
});

module.exports = router;
