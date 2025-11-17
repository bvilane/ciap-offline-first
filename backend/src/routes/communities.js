const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Get database path from env or use default
const DB_PATH = process.env.SQLITE_FILE || './data/ciap.db';
const dbPath = path.resolve(__dirname, '../../', DB_PATH);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Communities route - Database connection error:', err);
  }
});

/**
 * GET /api/v1/communities
 * Returns all communities
 */
router.get('/', (req, res) => {
  const sql = 'SELECT id, slug, name, created_at FROM communities ORDER BY name ASC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('GET /api/v1/communities error:', err);
      return res.status(500).json({ 
        error: 'Failed to fetch communities',
        message: err.message 
      });
    }
    
    res.json(rows || []);
  });
});

/**
 * POST /api/v1/communities
 * Create a new community
 */
router.post('/', (req, res) => {
  const { slug, name } = req.body;
  
  if (!slug || !name) {
    return res.status(400).json({ 
      error: 'Validation Error',
      message: 'slug and name are required' 
    });
  }
  
  const sql = 'INSERT INTO communities (slug, name, created_at) VALUES (?, ?, datetime("now"))';
  
  db.run(sql, [slug, name], function(err) {
    if (err) {
      if (err.message && err.message.includes('UNIQUE')) {
        return res.status(409).json({ 
          error: 'Conflict',
          message: 'Community slug already exists' 
        });
      }
      console.error('POST /api/v1/communities error:', err);
      return res.status(500).json({ 
        error: 'Failed to create community',
        message: err.message 
      });
    }
    
    res.status(201).json({ 
      message: 'Community created',
      data: { id: this.lastID, slug, name } 
    });
  });
});

module.exports = router;