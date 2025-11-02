const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const logger = require('../utils/logger');

class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    this.db = null;
    this.isConnected = false;
    Database.instance = this;
  }

  /**
   * Initialize database connection and create tables
   */
  async connect() {
    if (this.isConnected) return this.db;

    try {
      // Ensure data directory exists
      const dbDir = path.dirname(config.database.path);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Create database connection
      this.db = new sqlite3.Database(config.database.path, (err) => {
        if (err) {
          logger.error('Database connection failed', { error: err.message });
          throw err;
        }
        logger.info('Database connected successfully', { path: config.database.path });
      });

      // Promisify methods
      this.db.runAsync = promisify(this.db.run.bind(this.db));
      this.db.getAsync = promisify(this.db.get.bind(this.db));
      this.db.allAsync = promisify(this.db.all.bind(this.db));

      // Pragmas
      await this.db.runAsync('PRAGMA foreign_keys = ON');

      // Create tables
      await this.createTables();

      this.isConnected = true;
      return this.db;
    } catch (error) {
      logger.error('Database initialization failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Create database schema
   */
  async createTables() {
    const schemas = [
      // Users
      `CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT UNIQUE,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )`,

      // Content items (existing)
      `CREATE TABLE IF NOT EXISTS content_items (
        content_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        content_type TEXT NOT NULL,
        file_path TEXT,
        file_size INTEGER,
        tags TEXT,
        uploaded_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
      )`,

      // Cache entries
      `CREATE TABLE IF NOT EXISTS cache_entries (
        cache_id TEXT PRIMARY KEY,
        content_id TEXT NOT NULL,
        cache_key TEXT UNIQUE NOT NULL,
        cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
        access_count INTEGER DEFAULT 0,
        expiry_date DATETIME,
        FOREIGN KEY (content_id) REFERENCES content_items(content_id)
      )`,

      // Request logs
      `CREATE TABLE IF NOT EXISTS request_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        content_id TEXT,
        served_from TEXT,
        latency_ms INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (content_id) REFERENCES content_items(content_id)
      )`,

      // Admin actions
      `CREATE TABLE IF NOT EXISTS admin_actions (
        action_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        action_type TEXT NOT NULL,
        description TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )`,

      // Performance metrics
      `CREATE TABLE IF NOT EXISTS performance_metrics (
        metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
        metric_name TEXT NOT NULL,
        metric_value REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      /* ==== NEW COMMUNITY TABLES ==== */

      // Notices/news
      `CREATE TABLE IF NOT EXISTS notices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        community TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT,
        created_at INTEGER DEFAULT (strftime('%s','now')*1000)
      )`,

      // Jobs
      `CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        community TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT,
        company TEXT,
        location TEXT,
        type TEXT,
        apply_url TEXT,
        posted_at INTEGER DEFAULT (strftime('%s','now')*1000)
      )`,

      // Skills/training
      `CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        community TEXT NOT NULL,
        title TEXT NOT NULL,
        provider TEXT,
        summary TEXT,
        url TEXT,
        starts_at INTEGER
      )`,

      // Directory
      `CREATE TABLE IF NOT EXISTS directory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        community TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        phone TEXT,
        hours TEXT,
        address TEXT
      )`
    ];

    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_cache_key ON cache_entries(cache_key)',
      'CREATE INDEX IF NOT EXISTS idx_content_type ON content_items(content_type)',
      'CREATE INDEX IF NOT EXISTS idx_request_timestamp ON request_logs(timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_user_role ON users(role)',
      'CREATE INDEX IF NOT EXISTS idx_notices_comm ON notices(community, created_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_jobs_comm ON jobs(community, posted_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_skills_comm ON skills(community, starts_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_directory_comm ON directory(community, name)'
    ];

    try {
      for (const schema of schemas) await this.db.runAsync(schema);
      for (const index of indexes) await this.db.runAsync(index);
      logger.info('Database schema created/verified successfully');
    } catch (error) {
      logger.error('Schema creation failed', { error: error.message });
      throw error;
    }
  }

  async query(sql, params = []) {
    try { return await this.db.allAsync(sql, params); }
    catch (error) { logger.error('Query failed', { sql, error: error.message }); throw error; }
  }

  async queryOne(sql, params = []) {
    try { return await this.db.getAsync(sql, params); }
    catch (error) { logger.error('QueryOne failed', { sql, error: error.message }); throw error; }
  }

  async execute(sql, params = []) {
    try { return await this.db.runAsync(sql, params); }
    catch (error) { logger.error('Execute failed', { sql, error: error.message }); throw error; }
  }

  async close() {
    if (!this.db) return;
    await new Promise((resolve, reject) => {
      this.db.close((err) => (err ? reject(err) : resolve()));
    });
    this.isConnected = false;
    logger.info('Database connection closed');
  }
}

module.exports = new Database();
