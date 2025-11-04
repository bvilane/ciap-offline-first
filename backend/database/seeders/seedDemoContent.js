// backend/database/seeders/seedDemoContent.js
// Uses only sqlite3 and inserts demo rows if the target tables exist.
// If your schema names/columns differ, we won't crash hard.

const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE = process.env.SQLITE_FILE || path.join(__dirname, '..', 'ciap.sqlite');

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
  const now = new Date().toISOString();
  const community = 'Acornhoek';

  try {
    // Ensure communities exists (no-op if already created)
    await run(db, `
      CREATE TABLE IF NOT EXISTS communities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await run(db, `INSERT OR IGNORE INTO communities (slug, name) VALUES (?, ?)`, [community, community]);

    // Helper to attempt an insert but ignore if table/cols don't exist
    async function tryInsert(sql, params) {
      try { await run(db, sql, params); } catch (_) { /* ignore */ }
    }

    // Demo content (adjust to your schema as needed)
    await tryInsert(
      `INSERT INTO notices (title, description, contact, community, status, created_at)
       VALUES (?, ?, ?, ?, "approved", ?)`,
      ['Community Clean-Up', 'Join us Saturday at 8am near the clinic.', '071-000-0001', community, now]
    );
    await tryInsert(
      `INSERT INTO notices (title, description, contact, community, status, created_at)
       VALUES (?, ?, ?, ?, "approved", ?)`,
      ['Clinic Hours Update', 'New opening times posted on notice board.', null, community, now]
    );

    await tryInsert(
      `INSERT INTO jobs (title, description, contact, community, status, created_at)
       VALUES (?, ?, ?, ?, "approved", ?)`,
      ['General Assistant', 'Local hardware needs weekend assistant.', 'jobs@example.com', community, now]
    );
    await tryInsert(
      `INSERT INTO jobs (title, description, contact, community, status, created_at)
       VALUES (?, ?, ?, ?, "approved", ?)`,
      ['Tutor Needed', 'Math tutor for Grade 10, afternoons.', '078-123-4567', community, now]
    );

    await tryInsert(
      `INSERT INTO skills (title, description, contact, community, status, created_at)
       VALUES (?, ?, ?, ?, "approved", ?)`,
      ['Plumber Available', 'Affordable call-outs in townships.', '073-000-9999', community, now]
    );
    await tryInsert(
      `INSERT INTO skills (title, description, contact, community, status, created_at)
       VALUES (?, ?, ?, ?, "approved", ?)`,
      ['Sewing Services', 'Alterations and custom dresses.', null, community, now]
    );

    await tryInsert(
      `INSERT INTO directory (name, description, category, phone, website, community, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Mkhulu Grocer', 'Groceries & essentials', 'Retail', '071-111-2222', 'https://example.com', community, now]
    );
    await tryInsert(
      `INSERT INTO directory (name, description, category, phone, website, community, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Khanyi Salon', 'Hair & beauty', 'Beauty', '071-333-4444', null, community, now]
    );

    console.log('✓ Seeded demo content into', DB_FILE);
  } catch (e) {
    console.error('Seed demo content error:', e.message);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
