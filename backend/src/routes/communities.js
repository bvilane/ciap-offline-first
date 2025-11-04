// backend/routes/communities.js
const express = require('express');
const router = express.Router();

/**
 * Expects a SQLite connection via req.app.get('db')
 * Tables:
 *  - communities(id INTEGER PK, slug TEXT UNIQUE, name TEXT, created_at TEXT)
 */

router.get('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    const rows = await db.all('SELECT id, slug, name FROM communities ORDER BY name ASC;');
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error('GET /communities error:', err);
    res.status(500).json({ ok: false, error: 'INTERNAL_ERROR' });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { slug, name } = req.body || {};
    if (!slug || !name) return res.status(400).json({ ok: false, error: 'MISSING_FIELDS' });
    await db.run(
      'INSERT INTO communities (slug, name, created_at) VALUES (?, ?, datetime("now"))',
      [slug, name]
    );
    res.status(201).json({ ok: true, data: { slug, name } });
  } catch (err) {
    if (String(err?.message || '').includes('UNIQUE')) {
      return res.status(409).json({ ok: false, error: 'SLUG_EXISTS' });
    }
    console.error('POST /communities error:', err);
    res.status(500).json({ ok: false, error: 'INTERNAL_ERROR' });
  }
});

module.exports = router;
