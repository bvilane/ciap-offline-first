/**
 * Database Seeder
 * Run: node src/database/seed.js
 */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const database = require('./connection');
const logger = require('../utils/logger');

const COMMUNITY = 'Acornhoek';

async function seed() {
  try {
    await database.connect();
    logger.info('Starting database seeding...');

    // --- Users ---
    const adminId = uuidv4();
    const adminPassword = await bcrypt.hash('admin123', 10);
    await database.execute(
      `INSERT OR IGNORE INTO users (user_id, username, password_hash, email, role)
       VALUES (?, ?, ?, ?, ?)`,
      [adminId, 'admin', adminPassword, 'admin@ciap.local', 'admin']
    );

    const userId = uuidv4();
    const userPassword = await bcrypt.hash('user123', 10);
    await database.execute(
      `INSERT OR IGNORE INTO users (user_id, username, password_hash, email, role)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, 'user', userPassword, 'user@ciap.local', 'user']
    );
    logger.info('✅ Users seeded (admin/user)');

    // --- Content (existing demo content) ---
    const sampleContent = [
      { title: 'Introduction to Software Engineering', description: 'Guide to principles and best practices', content_type: 'application/pdf', tags: 'education,software,engineering', file_size: 524288 },
      { title: 'Python Programming Basics', description: 'Learn Python from scratch', content_type: 'text/html', tags: 'programming,python,tutorial', file_size: 102400 },
      { title: 'Data Structures and Algorithms', description: 'Essentials for programmers', content_type: 'application/pdf', tags: 'algorithms,education', file_size: 1048576 }
    ];
    for (const c of sampleContent) {
      const id = uuidv4();
      await database.execute(
        `INSERT OR IGNORE INTO content_items
         (content_id, title, description, content_type, file_path, file_size, tags, uploaded_by)
         VALUES (?,?,?,?,?,?,?,?)`,
        [id, c.title, c.description, c.content_type, `/content/${id}`, c.file_size, c.tags, adminId]
      );
    }
    logger.info(`✅ Content items seeded (${sampleContent.length})`);

    // Request logs (analytics sample)
    for (let i = 0; i < 30; i++) {
      const servedFrom = Math.random() > 0.4 ? 'cache' : 'database';
      const latency = servedFrom === 'cache' ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 200) + 50;
      await database.execute(
        `INSERT INTO request_logs (user_id, content_id, served_from, latency_ms)
         VALUES (?, NULL, ?, ?)`,
        [userId, servedFrom, latency]
      );
    }
    logger.info('✅ Request logs seeded');

    // --- NEW: Community data ---
    // Notices
    await database.execute(
      `INSERT INTO notices (community, title, body, created_at) VALUES (?,?,?,?)`,
      [COMMUNITY, 'Water Maintenance – Ward 8', 'Low pressure expected 10:00–13:00. Use water sparingly.', Date.now() - 3600e3]
    );
    await database.execute(
      `INSERT INTO notices (community, title, body, created_at) VALUES (?,?,?,?)`,
      [COMMUNITY, 'Clinic Outreach', 'Free screenings at Community Hall, Sat 09:00–12:00.', Date.now() - 7200e3]
    );

    // Jobs
    await database.execute(
      `INSERT INTO jobs (community, title, summary, company, location, type, apply_url, posted_at)
       VALUES (?,?,?,?,?,?,?,?)`,
      [COMMUNITY, 'Receptionist – Local Clinic', 'Front desk, patient queries, scheduling.', 'Acornhoek Clinic', COMMUNITY, 'Full-time', '', Date.now()]
    );
    await database.execute(
      `INSERT INTO jobs (community, title, summary, company, location, type, apply_url, posted_at)
       VALUES (?,?,?,?,?,?,?,?)`,
      [COMMUNITY, 'Remote Customer Support (Entry)', 'Chat/email support. Training provided.', 'Remote Inc.', 'Remote', 'Remote', 'https://example.com/apply', Date.now()]
    );

    // Skills
    await database.execute(
      `INSERT INTO skills (community, title, provider, summary, url, starts_at)
       VALUES (?,?,?,?,?,?)`,
      [COMMUNITY, 'Basics of Digital Marketing', 'Community Hub', 'Free weekend workshop. Limited seats.', '', Date.now() + 7 * 24 * 3600e3]
    );
    await database.execute(
      `INSERT INTO skills (community, title, provider, summary, url, starts_at)
       VALUES (?,?,?,?,?,NULL)`,
      [COMMUNITY, 'Intro to Freelancing', 'Remote Academy', 'Self-paced video course for beginners.', 'https://example.com/course']
    );

    // Directory
    await database.execute(
      `INSERT INTO directory (community, name, category, phone, hours, address)
       VALUES (?,?,?,?,?,?)`,
      [COMMUNITY, 'Acornhoek Clinic', 'Clinic', '+27 11 000 0001', 'Mon–Fri 08:00–16:00', 'Main Rd, Acornhoek']
    );
    await database.execute(
      `INSERT INTO directory (community, name, category, phone, hours, address)
       VALUES (?,?,?,?,?,?)`,
      [COMMUNITY, 'Ward 8 Primary School', 'School', '+27 11 000 0002', 'Mon–Fri 07:30–14:00', 'School St, Acornhoek']
    );

    logger.info('✅ Community data (notices/jobs/skills/directory) seeded');
    logger.info('🎉 Seeding completed.');
    logger.info('Admin login: admin / admin123  |  User: user / user123');

    await database.close();
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed', { error: error.message });
    process.exit(1);
  }
}

seed();
