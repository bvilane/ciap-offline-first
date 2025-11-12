const database = require('./connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();

/**
 * Initialize authentication tables
 * Adds users table with roles to existing database
 */
async function initAuthTables() {
  console.log('Initializing authentication tables...\n');

  try {
    await database.connect();
    
    // Create users table if it doesn't exist
    await createUsersTable();
    
    // Create default admin user if none exists
    await createDefaultAdmin();
    
    console.log('\n✓ Authentication initialization complete!');
  } catch (error) {
    console.error('❌ Authentication initialization failed:', error);
    throw error;
  }
}

/**
 * Create users table with authentication fields
 * This checks what exists and updates accordingly
 */
async function createUsersTable() {
  console.log('Checking users table...');
  
  try {
    // Check if users table exists and what columns it has
    const tableInfo = await database.query("PRAGMA table_info(users)");
    
    if (tableInfo.length === 0) {
      // Table doesn't exist, create it with our schema
      console.log('Creating new users table...');
      const schema = `
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT DEFAULT 'user' CHECK(role IN ('user', 'moderator', 'admin')),
          status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await database.execute(schema);
      
      // Create indexes
      await database.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
      await database.execute('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
      await database.execute('CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)');
      
      console.log('✓ Users table created');
    } else {
      // Table exists, check for our required columns
      const columns = tableInfo.map(col => col.name);
      console.log('✓ Users table exists with columns:', columns.join(', '));
      
      // Add missing columns
      const requiredColumns = [
        { name: 'email', type: 'TEXT UNIQUE' },
        { name: 'password_hash', type: 'TEXT NOT NULL' },
        { name: 'name', type: 'TEXT' },
        { name: 'role', type: "TEXT DEFAULT 'user'" },
        { name: 'status', type: "TEXT DEFAULT 'active'" }
      ];
      
      for (const col of requiredColumns) {
        if (!columns.includes(col.name)) {
          try {
            console.log(`  Adding column: ${col.name}`);
            await database.execute(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
          } catch (error) {
            if (!error.message.includes('duplicate column')) {
              console.error(`  Warning: Could not add ${col.name}:`, error.message);
            }
          }
        }
      }
      
      // Try to create indexes (ignore if they exist)
      try {
        await database.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
        await database.execute('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
        await database.execute('CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)');
      } catch (error) {
        // Ignore index errors
      }
      
      console.log('✓ Users table updated');
    }
  } catch (error) {
    console.error('Failed to create/update users table:', error);
    throw error;
  }
}

/**
 * Update existing tables to add moderation fields
 */
async function addModerationFields() {
  console.log('\nAdding moderation fields to existing tables...');
  
  const alterations = [
    // Add status column to notices if it doesn't exist
    `ALTER TABLE notices ADD COLUMN status TEXT DEFAULT 'approved' CHECK(status IN ('pending', 'approved', 'rejected'))`,
    `ALTER TABLE notices ADD COLUMN created_by INTEGER`,
    `ALTER TABLE notices ADD COLUMN moderated_by INTEGER`,
    `ALTER TABLE notices ADD COLUMN moderated_at DATETIME`,
    `ALTER TABLE notices ADD COLUMN rejection_reason TEXT`,
    
    // Same for jobs
    `ALTER TABLE jobs ADD COLUMN status TEXT DEFAULT 'approved' CHECK(status IN ('pending', 'approved', 'rejected'))`,
    `ALTER TABLE jobs ADD COLUMN created_by INTEGER`,
    `ALTER TABLE jobs ADD COLUMN moderated_by INTEGER`,
    `ALTER TABLE jobs ADD COLUMN moderated_at DATETIME`,
    `ALTER TABLE jobs ADD COLUMN rejection_reason TEXT`,
    
    // Same for skills
    `ALTER TABLE skills ADD COLUMN status TEXT DEFAULT 'approved' CHECK(status IN ('pending', 'approved', 'rejected'))`,
    `ALTER TABLE skills ADD COLUMN created_by INTEGER`,
    `ALTER TABLE skills ADD COLUMN moderated_by INTEGER`,
    `ALTER TABLE skills ADD COLUMN moderated_at DATETIME`,
    `ALTER TABLE skills ADD COLUMN rejection_reason TEXT`
  ];
  
  for (const sql of alterations) {
    try {
      await database.execute(sql);
    } catch (error) {
      // Ignore "duplicate column" errors - means it already exists
      if (!error.message.includes('duplicate column')) {
        console.error('Warning:', error.message);
      }
    }
  }
  
  console.log('✓ Moderation fields added (existing columns skipped)');
}

/**
 * Create default admin user if no admin exists
 */
async function createDefaultAdmin() {
  try {
    // First check if table has our required columns
    const tableInfo = await database.query("PRAGMA table_info(users)");
    const columns = tableInfo.map(col => col.name);
    
    // Check if we have id or user_id
    const idColumn = columns.includes('id') ? 'id' : 'user_id';
    
    // Check if any admin exists
    const existing = await database.queryOne(
      `SELECT COUNT(*) as count FROM users WHERE role = ?`,
      ['admin']
    );
    
    if (existing && existing.count > 0) {
      console.log('✓ Admin user already exists');
      return;
    }

    // Get admin credentials from environment or use defaults
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@ciap.local';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';
    const name = process.env.DEFAULT_ADMIN_NAME || 'CIAP Administrator';
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Build insert statement based on available columns
    let insertSql = '';
    let insertParams = [];
    
    if (columns.includes('email') && columns.includes('password_hash')) {
      // New schema with email/password_hash
      insertSql = `INSERT INTO users (email, password_hash, name, role, status) VALUES (?, ?, ?, ?, ?)`;
      insertParams = [email, password_hash, name, 'admin', 'active'];
    } else if (columns.includes('username') && columns.includes('password_hash')) {
      // Your existing schema from connection.js
      insertSql = `INSERT INTO users (user_id, username, password_hash, email, role) VALUES (?, ?, ?, ?, ?)`;
      const userId = `user_${Date.now()}`; // Generate a user_id
      insertParams = [userId, 'admin', password_hash, email, 'admin'];
    } else {
      throw new Error('Users table has unexpected schema. Please check connection.js');
    }
    
    // Create admin user
    await database.execute(insertSql, insertParams);

    console.log('\n✓ Default admin user created:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role: admin`);
    console.log('\n  ⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN!');
  } catch (error) {
    // If error is about duplicate, that's okay
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      console.log('✓ Admin user already exists');
      return;
    }
    console.error('Failed to create default admin:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initAuthTables()
    .then(async () => {
      // Also add moderation fields to existing tables
      await addModerationFields();
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✓ Database ready for authentication!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      await database.close();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error('\n❌ Initialization failed:', error);
      await database.close();
      process.exit(1);
    });
}

module.exports = {
  initAuthTables,
  createUsersTable,
  createDefaultAdmin,
  addModerationFields
};