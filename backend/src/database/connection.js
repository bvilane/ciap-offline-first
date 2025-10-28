const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const logger = require('../utils/logger');

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.db = null;
    this.isConnected = false;
    Database.instance = this;
  }

  /**
   * Initialize database connection and create tables
   */
  async connect() {
    if (this.isConnected) {
      return this.db;
    }

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

      // Promisify database methods
      this.db.runAsync = promisify(this.db.run.bind(this.db));
      this.db.getAsync = promisify(this.db.get.bind(this.db));
      this.db.allAsync = promisify(this.db.all.bind(this.db));

      // Enable foreign keys
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
   * Represents ERD from project proposal
   */
  async createTables() {
    const schemas = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT UNIQUE,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )`,

      // Content items table
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

      // Cache entries table
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

      // Request logs for analytics
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

      // Admin actions for audit trail
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
    ];

    // Create indexes for performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_cache_key ON cache_entries(cache_key)',
      'CREATE INDEX IF NOT EXISTS idx_content_type ON content_items(content_type)',
      'CREATE INDEX IF NOT EXISTS idx_request_timestamp ON request_logs(timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_user_role ON users(role)',
    ];

    try {
      for (const schema of schemas) {
        await this.db.runAsync(schema);
      }
      for (const index of indexes) {
        await this.db.runAsync(index);
      }
      logger.info('Database schema created successfully');
    } catch (error) {
      logger.error('Schema creation failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Execute a query with parameters
   */
  async query(sql, params = []) {
    try {
      return await this.db.allAsync(sql, params);
    } catch (error) {
      logger.error('Query execution failed', { sql, error: error.message });
      throw error;
    }
  }

  /**
   * Execute a single row query
   */
  async queryOne(sql, params = []) {
    try {
      return await this.db.getAsync(sql, params);
    } catch (error) {
      logger.error('Query execution failed', { sql, error: error.message });
      throw error;
    }
  }

  /**
   * Execute a write operation
   */
  async execute(sql, params = []) {
    try {
      return await this.db.runAsync(sql, params);
    } catch (error) {
      logger.error('Execute failed', { sql, error: error.message });
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.db) {
      await new Promise((resolve, reject) => {
        this.db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      this.isConnected = false;
      logger.info('Database connection closed');
    }
  }
}

// Export singleton instance
module.exports = new Database();