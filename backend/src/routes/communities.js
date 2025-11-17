const express = require('express');
const router = express.Router();
const db = require('../database/connection');

/**
 * GET /api/v1/communities
 * Returns all communities
 */
router.get('/', async (req, res) => {
  try {
    const communities = await new Promise((resolve, reject) => {
      db.all(
        'SELECT id, slug, name, created_at FROM communities ORDER BY name ASC',
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
    
    res.json(communities);
  } catch (error) {
    console.error('GET /api/v1/communities error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch communities',
      message: error.message 
    });
  }
});

/**
 * POST /api/v1/communities
 * Create a new community
 */
router.post('/', async (req, res) => {
  try {
    const { slug, name } = req.body;
    
    if (!slug || !name) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'slug and name are required' 
      });
    }
    
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO communities (slug, name, created_at) VALUES (?, ?, datetime("now"))',
        [slug, name],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
    
    res.status(201).json({ 
      message: 'Community created',
      data: { id: result.id, slug, name } 
    });
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE')) {
      return res.status(409).json({ 
        error: 'Conflict',
        message: 'Community slug already exists' 
      });
    }
    console.error('POST /api/v1/communities error:', error);
    res.status(500).json({ 
      error: 'Failed to create community',
      message: error.message 
    });
  }
});

module.exports = router;