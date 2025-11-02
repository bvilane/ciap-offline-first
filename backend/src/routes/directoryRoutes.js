const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/', async (req, res, next) => {
  try {
    const community = req.query.community || 'Acornhoek';
    await db.connect();
    const rows = await db.query(
      'SELECT * FROM directory WHERE community = ? ORDER BY name LIMIT 200',
      [community]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      community = 'Acornhoek',
      name, category = '', phone = '', hours = '', address = ''
    } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name required' });

    await db.connect();
    const result = await db.execute(
      `INSERT INTO directory (community, name, category, phone, hours, address)
       VALUES (?,?,?,?,?,?)`,
      [community, name, category, phone, hours, address]
    );
    const row = await db.queryOne('SELECT * FROM directory WHERE id = ?', [result.lastID]);
    res.json(row);
  } catch (err) { next(err); }
});

module.exports = router;
