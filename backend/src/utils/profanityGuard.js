// backend/routes/admin.js
const express = require('express');
const router = express.Router();

/**
 * Minimal admin endpoints
 * NOTE: Protect these with your existing auth middleware if present.
 * Approve:  POST /api/v1/admin/approve/:type/:id
 * Reject:   POST /api/v1/admin/reject/:type/:id
 */

const VALID = new Set(['jobs', 'notices', 'skills']);

function tableFor(type) {
  if (!VALID.has(type)) return null;
  return type;
}

router.post('/approve/:type/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { type, id } = req.params;
    const table = tableFor(type);
    if (!table) return res.status(404).json({ ok: false, error: 'UNKNOWN_TYPE' });

    await db.run(`UPDATE ${table} SET status="approved", approved_at=datetime("now") WHERE id=?`, [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('admin approve error:', err);
    res.status(500).json({ ok: false, error: 'INTERNAL_ERROR' });
  }
});

router.post('/reject/:type/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { type, id } = req.params;
    const table = tableFor(type);
    if (!table) return res.status(404).json({ ok: false, error: 'UNKNOWN_TYPE' });

    await db.run(`UPDATE ${table} SET status="rejected", rejected_at=datetime("now") WHERE id=?`, [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('admin reject error:', err);
    res.status(500).json({ ok: false, error: 'INTERNAL_ERROR' });
  }
});

module.exports = router;
