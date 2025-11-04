// backend/resetDatabase.js
// Complete database reset with seed data + IMAGE URLS
// Run: node resetDatabase.js

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'data/ciap.db');
const COMMUNITY = 'Acornhoek';

console.log('🔥 RESETTING DATABASE WITH IMAGES...\n');

// Step 1: Delete old database
if (fs.existsSync(dbPath)) {
  console.log('❌ Deleting old database...');
  fs.unlinkSync(dbPath);
  console.log('✅ Old database deleted\n');
}

// Step 2: Create fresh database
console.log('📋 Creating fresh database with schema...');
const db = new sqlite3.Database(dbPath);

// Step 3: Create tables with image_url column
db.serialize(() => {
  // Communities
  db.run(`CREATE TABLE communities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`);

  // Notices - ADD image_url
  db.run(`CREATE TABLE notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    community TEXT NOT NULL DEFAULT 'Acornhoek',
    title TEXT NOT NULL,
    body TEXT,
    contact TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'approved',
    featured INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER
  )`);

  // Jobs - ADD image_url
  db.run(`CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    community TEXT NOT NULL DEFAULT 'Acornhoek',
    title TEXT NOT NULL,
    summary TEXT,
    company TEXT,
    location TEXT,
    type TEXT,
    apply_url TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'approved',
    featured INTEGER DEFAULT 0,
    posted_at INTEGER NOT NULL,
    created_at INTEGER,
    updated_at INTEGER
  )`);

  // Skills - ADD image_url
  db.run(`CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    community TEXT NOT NULL DEFAULT 'Acornhoek',
    title TEXT NOT NULL,
    provider TEXT,
    summary TEXT,
    url TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'approved',
    featured INTEGER DEFAULT 0,
    starts_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER
  )`);

  // Directory - already has images typically
  db.run(`CREATE TABLE directory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    community TEXT NOT NULL DEFAULT 'Acornhoek',
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    phone TEXT,
    website TEXT,
    hours TEXT,
    address TEXT,
    image_url TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )`);

  // Users
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    community TEXT DEFAULT 'Acornhoek',
    created_at INTEGER NOT NULL,
    last_login INTEGER
  )`);

  console.log('✅ Tables created\n');

  // Step 4: Insert seed data WITH IMAGES
  console.log('🌱 Inserting seed data with images...\n');

  const now = Date.now();

  // Seed Communities
  const communities = [
    ['Acornhoek', 'Acornhoek', now],
    ['Bushbuckridge', 'Bushbuckridge', now],
    ['Hoedspruit', 'Hoedspruit', now]
  ];

  const communityStmt = db.prepare('INSERT INTO communities (slug, name, created_at) VALUES (?, ?, ?)');
  communities.forEach(c => communityStmt.run(c));
  communityStmt.finalize();
  console.log(`✅ Inserted ${communities.length} communities`);

  // Jobs with images - using Unsplash for variety
  const jobs = [
    [COMMUNITY, 'Remote Customer Support Representative', 'Help customers via chat and email. Training provided.', 'Remote Inc.', 'Remote', 'Full-time', 'https://example.com/apply', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop', 'approved', 0, now, now, now],
    [COMMUNITY, 'Receptionist - Local Clinic', 'Front desk, patient queries, scheduling.', 'Acornhoek Clinic', 'Acornhoek', 'Full-time', 'mailto:jobs@clinic.co.za', 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&h=400&fit=crop', 'approved', 0, now - 86400000, now, now],
    [COMMUNITY, 'Junior Developer Internship', 'Learn web development with mentorship. 6-month program.', 'TechHub SA', 'Remote / Hybrid', 'Internship', 'https://techhub.co.za/apply', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop', 'approved', 1, now - 172800000, now, now],
    [COMMUNITY, 'Delivery Driver - Weekends', 'Saturday & Sunday deliveries. Own vehicle required.', 'QuickShip Logistics', 'Acornhoek & Bushbuckridge', 'Part-time', 'tel:0131234567', 'https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?w=800&h=400&fit=crop', 'approved', 0, now - 259200000, now, now],
    [COMMUNITY, 'Administrative Assistant', 'Office admin, filing, data capture. Grade 12 required.', 'Local Municipality', 'Acornhoek', 'Contract', 'mailto:hr@municipality.gov.za', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=400&fit=crop', 'approved', 0, now - 345600000, now, now],
    [COMMUNITY, 'Social Media Manager', 'Manage social accounts for local businesses. Remote OK.', 'Digital Dreams Agency', 'Remote', 'Freelance', 'https://digitaldreams.co.za/careers', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop', 'approved', 1, now - 432000000, now, now]
  ];

  const jobStmt = db.prepare('INSERT INTO jobs (community, title, summary, company, location, type, apply_url, image_url, status, featured, posted_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  jobs.forEach(job => jobStmt.run(job));
  jobStmt.finalize();
  console.log(`✅ Inserted ${jobs.length} jobs`);

  // Skills with images
  const skills = [
    [COMMUNITY, 'Intro to Freelancing', 'Self-paced video course for beginners. Learn how to find clients.', 'Remote Academy', 'https://remoteacademy.co.za/freelancing', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop', 'approved', 1, now + 604800000, now, now],
    [COMMUNITY, 'Basics of Digital Marketing', 'Free weekend workshop. Learn social media, SEO, email marketing.', 'Community Hub', 'https://communityhub.org/workshop', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop', 'approved', 0, now + 1209600000, now, now],
    [COMMUNITY, 'Computer Literacy Training', 'Learn Microsoft Office basics: Word, Excel, PowerPoint.', 'Local Library', 'tel:0139876543', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop', 'approved', 1, now + 259200000, now, now],
    [COMMUNITY, 'Entrepreneurship Bootcamp', '3-week intensive program on starting a business.', 'Small Business Development', 'mailto:info@sbd.org.za', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop', 'approved', 0, now + 1814400000, now, now],
    [COMMUNITY, 'English Conversation Classes', 'Improve spoken English. Every Tuesday & Thursday evening.', 'Community Education Center', 'https://cec.org.za/english', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=400&fit=crop', 'approved', 0, now + 86400000, now, now]
  ];

  const skillStmt = db.prepare('INSERT INTO skills (community, title, summary, provider, url, image_url, status, featured, starts_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  skills.forEach(skill => skillStmt.run(skill));
  skillStmt.finalize();
  console.log(`✅ Inserted ${skills.length} skills`);

  // Notices with images
  const notices = [
    [COMMUNITY, 'Water Maintenance - Ward 8', 'Low pressure expected 10:00-13:00. Use water sparingly. Apologies for the inconvenience.', 'Municipality: 013-123-4567', 'https://images.unsplash.com/photo-1542855368-ca6ea825bca2?w=800&h=400&fit=crop', 'approved', 1, now, null],
    [COMMUNITY, 'Free Health Screening Saturday', 'Free blood pressure, diabetes, and HIV screenings at Community Hall, Saturday 09:00-12:00. Bring your ID.', 'Health Department: 013-987-6543', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop', 'approved', 1, now - 86400000, null],
    [COMMUNITY, 'Community Meeting - Road Repairs', 'Discuss upcoming road repairs and budget allocation. Thursday 18:00 at Town Hall. All residents welcome.', 'Ward Councillor', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=400&fit=crop', 'approved', 0, now - 172800000, null],
    [COMMUNITY, 'Load Shedding Schedule Updated', 'Stage 2 scheduled for Monday & Wednesday 18:00-22:00. Check Eskom app for real-time updates.', 'Eskom Hotline: 0860-037-566', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop', 'approved', 0, now - 259200000, null],
    [COMMUNITY, 'School Holiday Program', 'Free activities for kids aged 6-14 during school holidays. Sports, arts, tutoring. Starts 15 Dec.', 'Youth Center: 013-555-7890', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop', 'approved', 0, now - 345600000, null]
  ];

  const noticeStmt = db.prepare('INSERT INTO notices (community, title, body, contact, image_url, status, featured, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  notices.forEach(notice => noticeStmt.run(notice));
  noticeStmt.finalize();
  console.log(`✅ Inserted ${notices.length} notices`);

  // Directory with images
  const businesses = [
    [COMMUNITY, 'Acornhoek General Store', 'Groceries, household items, school supplies, airtime.', 'Retail', '013-111-2222', 'https://acornhoekstore.co.za', 'Mon-Sat 08:00-18:00, Sun 09:00-14:00', 'Main Road, Acornhoek', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=400&fit=crop', now, null],
    [COMMUNITY, 'Dr. Mbatha - Family Practice', 'General practitioner. Walk-ins welcome. Medical aid accepted.', 'Healthcare', '013-333-4444', null, 'Mon-Fri 08:00-17:00, Sat 08:00-13:00', 'Clinic Street, Acornhoek', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop', now, null],
    [COMMUNITY, 'Quick Fix Plumbing', '24/7 emergency plumbing services. Burst pipes, blocked drains, installations.', 'Services', '013-555-6666', null, '24/7 Emergency', 'Serves Acornhoek & surrounding areas', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=400&fit=crop', now, null],
    [COMMUNITY, 'Acornhoek Primary School', 'Grades R-7. Enrolling for 2026. Quality education in safe environment.', 'Education', '013-777-8888', 'https://acornhoekprimary.edu.za', 'School hours: 07:30-14:00', 'School Road, Acornhoek', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=400&fit=crop', now, null],
    [COMMUNITY, "Mama's Kitchen", 'Traditional food, pap & vleis, takeaways. Affordable prices.', 'Food & Dining', '072-123-4567', null, 'Mon-Sun 10:00-20:00', 'Market Square, Acornhoek', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop', now, null],
    [COMMUNITY, 'TechFix Computer Repairs', 'Laptop & phone repairs, software installation, data recovery.', 'Technology', '082-987-6543', null, 'Mon-Sat 09:00-17:00', 'Shopping Center, Acornhoek', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=400&fit=crop', now, null]
  ];

  const dirStmt = db.prepare('INSERT INTO directory (community, name, description, category, phone, website, hours, address, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  businesses.forEach(biz => dirStmt.run(biz));
  dirStmt.finalize();
  console.log(`✅ Inserted ${businesses.length} directory entries`);

  // Create demo users
  const users = [
    ['admin@ciap.local', 'admin', 'password123', 'admin', COMMUNITY, now, null],
    ['moderator@ciap.local', 'moderator', 'password123', 'moderator', COMMUNITY, now, null],
    ['user@ciap.local', 'user', 'password123', 'user', COMMUNITY, now, null]
  ];

  const userStmt = db.prepare('INSERT INTO users (email, username, password_hash, role, community, created_at, last_login) VALUES (?, ?, ?, ?, ?, ?, ?)');
  users.forEach(user => userStmt.run(user));
  userStmt.finalize();
  console.log(`✅ Created ${users.length} demo users`);
  console.log('   📧 admin@ciap.local / password123 (Admin)');
  console.log('   📧 moderator@ciap.local / password123 (Moderator)');
  console.log('   📧 user@ciap.local / password123 (User)\n');

  db.close(() => {
    console.log('🎉 DATABASE RESET COMPLETE!\n');
    console.log('✅ Database:', dbPath);
    console.log('✅ Tables: communities, notices, jobs, skills, directory, users');
    console.log('✅ All content now has image URLs from Unsplash');
    console.log('✅ Seed data: 6 jobs, 5 skills, 5 notices, 6 businesses, 3 users, 3 communities\n');
    console.log('🚀 Next steps:');
    console.log('   1. Restart backend: npm run dev');
    console.log('   2. Refresh frontend at http://localhost:5173');
    console.log('   3. Cards should now show images!\n');
  });
});