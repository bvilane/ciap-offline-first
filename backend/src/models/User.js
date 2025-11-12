const bcrypt = require('bcryptjs');
const database = require('../database/connection');

// Cache the schema info so we don't check every time
let schemaChecked = false;
let useNewSchema = true; // Assume new schema (id, email, password_hash)

class User {
  /**
   * Check which schema the users table is using
   */
  static async checkSchema() {
    if (schemaChecked) return useNewSchema;
    
    try {
      await database.connect();
      const tableInfo = await database.query("PRAGMA table_info(users)");
      const columns = tableInfo.map(col => col.name);
      
      // Determine if we're using new schema (id, email) or old (user_id, username)
      useNewSchema = columns.includes('id') && columns.includes('email');
      schemaChecked = true;
      
      return useNewSchema;
    } catch (error) {
      console.error('Failed to check schema:', error);
      throw error;
    }
  }

  /**
   * Initialize users table with proper schema
   */
  static async initTable() {
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'moderator', 'admin')),
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `;
    
    await database.connect();
    return database.execute(schema);
  }

  /**
   * Create a new user
   */
  static async create({ email, password, name, role = 'user' }) {
    // Validate inputs
    if (!email || !password || !name) {
      throw new Error('Email, password, and name are required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    try {
      await database.connect();
      await this.checkSchema();
      
      // Generate username from email
      const username = email.split('@')[0];
      
      let sql, params, result;
      
      if (useNewSchema) {
        // Check if username column exists
        const tableInfo = await database.query("PRAGMA table_info(users)");
        const hasUsername = tableInfo.some(col => col.name === 'username');
        
        if (hasUsername) {
          // Include username and created_at
          sql = `INSERT INTO users (email, username, password_hash, name, role, status, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
          params = [email, username, password_hash, name, role, 'active'];
        } else {
          // No username column
          sql = `INSERT INTO users (email, password_hash, name, role, status, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
          params = [email, password_hash, name, role, 'active'];
        }
      } else {
        // Old schema: user_id, username, password_hash, email, role
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sql = `INSERT INTO users (user_id, username, password_hash, email, role) VALUES (?, ?, ?, ?, ?)`;
        params = [userId, username, password_hash, email, role];
      }
      
      result = await database.execute(sql, params);
      return { 
        id: result.lastID || params[0], 
        email, 
        name, 
        role 
      };
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    await database.connect();
    await this.checkSchema();
    
    let sql;
    if (useNewSchema) {
      sql = 'SELECT * FROM users WHERE email = ? AND status = "active"';
    } else {
      sql = 'SELECT * FROM users WHERE email = ?';
    }
    
    const user = await database.queryOne(sql, [email]);
    
    // Normalize the response to use 'id' field
    if (user && user.user_id && !user.id) {
      user.id = user.user_id;
    }
    
    return user;
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    await database.connect();
    await this.checkSchema();
    
    let sql;
    if (useNewSchema) {
      sql = 'SELECT id, email, name, role, status, created_at FROM users WHERE id = ?';
    } else {
      sql = 'SELECT user_id as id, email, username as name, role, created_at FROM users WHERE user_id = ?';
    }
    
    return database.queryOne(sql, [id]);
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Get all users (admin only)
   */
  static async getAll({ page = 1, limit = 20, role = null }) {
    await database.connect();
    const offset = (page - 1) * limit;
    
    let sql = 'SELECT id, email, name, role, status, created_at FROM users';
    const params = [];
    
    if (role) {
      sql += ' WHERE role = ?';
      params.push(role);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return database.query(sql, params);
  }

  /**
   * Update user role (admin only)
   */
  static async updateRole(userId, newRole) {
    const validRoles = ['user', 'moderator', 'admin'];
    if (!validRoles.includes(newRole)) {
      throw new Error('Invalid role');
    }

    await database.connect();
    const sql = `
      UPDATE users 
      SET role = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    const result = await database.execute(sql, [newRole, userId]);
    if (result.changes === 0) {
      throw new Error('User not found');
    }
    return { id: userId, role: newRole };
  }

  /**
   * Update user status (admin only)
   */
  static async updateStatus(userId, newStatus) {
    const validStatuses = ['active', 'inactive'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Invalid status');
    }

    await database.connect();
    const sql = `
      UPDATE users 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    const result = await database.execute(sql, [newStatus, userId]);
    if (result.changes === 0) {
      throw new Error('User not found');
    }
    return { id: userId, status: newStatus };
  }

  /**
   * Count users by role
   */
  static async countByRole() {
    await database.connect();
    const sql = `
      SELECT role, COUNT(*) as count 
      FROM users 
      WHERE status = 'active'
      GROUP BY role
    `;
    
    const rows = await database.query(sql);
    const counts = { user: 0, moderator: 0, admin: 0 };
    rows.forEach(row => {
      counts[row.role] = row.count;
    });
    return counts;
  }
}

module.exports = User;