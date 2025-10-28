/**
 * Database Seeder
 * Populates database with sample data for demonstration
 * Run: node src/database/seed.js
 */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const database = require('./connection');
const logger = require('../utils/logger');

async function seed() {
  try {
    await database.connect();
    logger.info('Starting database seeding...');

    // Create admin user
    const adminId = uuidv4();
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await database.execute(
      `INSERT OR IGNORE INTO users (user_id, username, password_hash, email, role)
       VALUES (?, ?, ?, ?, ?)`,
      [adminId, 'admin', adminPassword, 'admin@ciap.local', 'admin']
    );
    logger.info('✅ Admin user created (username: admin, password: admin123)');

    // Create regular user
    const userId = uuidv4();
    const userPassword = await bcrypt.hash('user123', 10);
    
    await database.execute(
      `INSERT OR IGNORE INTO users (user_id, username, password_hash, email, role)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, 'user', userPassword, 'user@ciap.local', 'user']
    );
    logger.info('✅ Regular user created (username: user, password: user123)');

    // Create sample content
    const sampleContent = [
      {
        title: 'Introduction to Software Engineering',
        description: 'Comprehensive guide to software engineering principles and best practices',
        content_type: 'application/pdf',
        tags: 'education,software,engineering',
        file_size: 524288,
      },
      {
        title: 'Python Programming Basics',
        description: 'Learn Python programming from scratch with practical examples',
        content_type: 'text/html',
        tags: 'programming,python,tutorial',
        file_size: 102400,
      },
      {
        title: 'Data Structures and Algorithms',
        description: 'Essential data structures and algorithms every programmer should know',
        content_type: 'application/pdf',
        tags: 'computer-science,algorithms,education',
        file_size: 1048576,
      },
      {
        title: 'Web Development Guide',
        description: 'Complete guide to modern web development with HTML, CSS, and JavaScript',
        content_type: 'text/html',
        tags: 'web-development,frontend,tutorial',
        file_size: 204800,
      },
      {
        title: 'Database Design Principles',
        description: 'Learn how to design efficient and scalable database systems',
        content_type: 'application/pdf',
        tags: 'database,sql,design',
        file_size: 716800,
      },
    ];

    for (const content of sampleContent) {
      const contentId = uuidv4();
      await database.execute(
        `INSERT OR IGNORE INTO content_items 
         (content_id, title, description, content_type, file_path, file_size, tags, uploaded_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          contentId,
          content.title,
          content.description,
          content.content_type,
          `/content/${contentId}`,
          content.file_size,
          content.tags,
          adminId,
        ]
      );
    }
    logger.info(`✅ Created ${sampleContent.length} sample content items`);

    // Create sample request logs
    for (let i = 0; i < 50; i++) {
      const servedFrom = Math.random() > 0.3 ? 'cache' : 'database';
      const latency = servedFrom === 'cache' 
        ? Math.floor(Math.random() * 10) + 1 
        : Math.floor(Math.random() * 200) + 50;
      
      await database.execute(
        `INSERT INTO request_logs (user_id, content_id, served_from, latency_ms)
         VALUES (?, NULL, ?, ?)`,
        [userId, servedFrom, latency]
      );
    }
    logger.info('✅ Created sample request logs');

    logger.info('🎉 Database seeding completed successfully!');
    logger.info('');
    logger.info('Test Credentials:');
    logger.info('  Admin - username: admin, password: admin123');
    logger.info('  User  - username: user, password: user123');
    
    await database.close();
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed', { error: error.message });
    process.exit(1);
  }
}

// Run seeder
seed();