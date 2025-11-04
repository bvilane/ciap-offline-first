// backend/database/seeders/seedCommunities.js
// Uses only sqlite3 (no 'sqlite' helper). Safe to run multiple times.

const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE = process.env.SQLITE_FILE || path.join(__dirname, '..', 'ciap.sqlite');

// Ensure parent dir exists
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

(async () => {
  const db = new sqlite3.Database(DB_FILE);

  try {
    await run(db, `
      CREATE TABLE IF NOT EXISTS communities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    const communities = [
      { slug: 'Acornhoek', name: 'Acornhoek' },
      { slug: 'Bushbuckridge', name: 'Bushbuckridge' },
      { slug: 'Hoedspruit', name: 'Hoedspruit' },
    ];

    for (const c of communities) {
      await run(db, `INSERT OR IGNORE INTO communities (slug, name) VALUES (?, ?)`, [c.slug, c.name]);
    }

    console.log('✓ Seeded communities into', DB_FILE);
  } catch (e) {
    console.error('Seed communities error:', e.message);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
