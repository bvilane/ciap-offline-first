// backend/routes/submissions.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const profanityGuard = require('../utils/profanityGuard');

const router = express.Router();

/**
 * Adds public submissions for: jobs, notices, skills
 * Saved with status='pending' for admin approval.
 *
 * Tables must have:
 *  - jobs|notices|skills (..., status TEXT DEFAULT 'approved'|'pending'|'rejected', community TEXT)
 */

const publicLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 50, // generous but safe
  standardHeaders: true,
  legacyHeaders: false,
});

const VALID = new Set(['jobs', 'notices', 'skills']);
const MAX_LEN = 2000;

router.post('/:type', publicLimiter, async (req, res) => {
  try {
    const db = req.app.get('db');
    const { type } = req.params;
    if (!VALID.has(type)) return res.status(404).json({ ok: false, error: 'UNKNOWN_TYPE' });

    const body = (req.body || {});
    // Common minimal fields:
    const title = (body.title || '').trim();
    const description = (body.description || '').trim();
    const contact = (body.contact || '').trim();
    const community = (body.community || '').trim();

    if (!title || !description || !community) {
      return res.status(400).json({ ok: false, error: 'MISSING_FIELDS' });
    }
    if (title.length > 160 || description.length > MAX_LEN) {
      return res.status(400).json({ ok: false, error: 'FIELD_TOO_LONG' });
    }
    const badWord = profanityGuard.findBadWord(`${title} ${description}`);
    if (badWord) {
      return res.status(400).json({ ok: false, error: 'CONTENT_PROFANITY', word: badWord });
    }

    const createdAt = new Date().toISOString();
    const sql = {
      jobs: 'INSERT INTO jobs (title, description, contact, community, status, created_at) VALUES (?, ?, ?, ?, "pending", ?)',
      notices: 'INSERT INTO notices (title, description, contact, community, status, created_at) VALUES (?, ?, ?, ?, "pending", ?)',
      skills: 'INSERT INTO skills (title, description, contact, community, status, created_at) VALUES (?, ?, ?, ?, "pending", ?)',
    }[type];

    const params = [title, description, contact || null, community, createdAt];
    const result = await db.run(sql, params);

    res.status(201).json({ ok: true, data: { id: result.lastID, status: 'pending' } });
  } catch (err) {
    console.error('POST /submit error:', err);
    res.status(500).json({ ok: false, error: 'INTERNAL_ERROR' });
  }
});

module.exports = router;
