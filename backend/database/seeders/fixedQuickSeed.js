// backend/database/seeders/fixedQuickSeed.js
// Run: node database/seeders/fixedQuickSeed.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../data/ciap.db'); // Up 2 levels from seeders/
const schemaPath = path.resolve(__dirname, '../schema.sql');

// Create data directory if it doesn't exist
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  console.log(`📁 Creating data directory at ${dataDir}...`);
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log(`📂 Database path: ${dbPath}`);

const db = new sqlite3.Database(dbPath);
const COMMUNITY = 'Acornhoek';

console.log('🌱 Starting seed process...');

// Step 1: Create tables from schema
function createTables() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(schemaPath)) {
      console.log('⚠️  schema.sql not found, creating tables manually...');
      
      const createStatements = [
        `CREATE TABLE IF NOT EXISTS notices (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          community TEXT NOT NULL DEFAULT 'Acornhoek',
          title TEXT NOT NULL,
          body TEXT,
          contact TEXT,
          status TEXT DEFAULT 'approved',
          featured INTEGER DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER
        )`,
        `CREATE TABLE IF NOT EXISTS jobs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          community TEXT NOT NULL DEFAULT 'Acornhoek',
          title TEXT NOT NULL,
          summary TEXT,
          company TEXT,
          location TEXT,
          type TEXT,
          apply_url TEXT,
          status TEXT DEFAULT 'approved',
          featured INTEGER DEFAULT 0,
          posted_at INTEGER NOT NULL,
          created_at INTEGER,
          updated_at INTEGER
        )`,
        `CREATE TABLE IF NOT EXISTS skills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          community TEXT NOT NULL DEFAULT 'Acornhoek',
          title TEXT NOT NULL,
          provider TEXT,
          summary TEXT,
          url TEXT,
          status TEXT DEFAULT 'approved',
          featured INTEGER DEFAULT 0,
          starts_at INTEGER,
          created_at INTEGER,
          updated_at INTEGER
        )`,
        `CREATE TABLE IF NOT EXISTS directory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          community TEXT NOT NULL DEFAULT 'Acornhoek',
          name TEXT NOT NULL,
          description TEXT,
          category TEXT,
          phone TEXT,
          website TEXT,
          hours TEXT,
          address TEXT,
          created_at INTEGER,
          updated_at INTEGER
        )`,
        `CREATE INDEX IF NOT EXISTS idx_notices_community ON notices(community)`,
        `CREATE INDEX IF NOT EXISTS idx_jobs_community ON jobs(community)`,
        `CREATE INDEX IF NOT EXISTS idx_skills_community ON skills(community)`,
        `CREATE INDEX IF NOT EXISTS idx_directory_community ON directory(community)`
      ];

      db.serialize(() => {
        createStatements.forEach(stmt => {
          db.run(stmt, (err) => {
            if (err) console.error('Error creating table:', err);
          });
        });
        resolve();
      });
    } else {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schema, (err) => {
        if (err) reject(err);
        else resolve();
      });
    }
  });
}

// Step 2: Insert data
function insertData(table, data) {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(',');
    
    const sql = `INSERT OR REPLACE INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
    
    db.run(sql, values, function(err) {
      if (err) {
        console.error(`Error inserting into ${table}:`, err.message);
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

// Seed data
async function seed() {
  try {
    // Create tables first
    console.log('📋 Creating database tables...');
    await createTables();
    console.log('✅ Tables created/verified');

    const now = Date.now();

    // Jobs (matching your jobsRoutes.js schema)
    const jobs = [
      {
        id: 1,
        title: 'Remote Customer Support Representative',
        summary: 'Help customers via chat and email. Training provided.',
        company: 'Remote Inc.',
        location: 'Remote',
        type: 'Full-time',
        apply_url: 'https://example.com/apply',
        community: COMMUNITY,
        status: 'approved',
        featured: 0,
        posted_at: now,
        created_at: now
      },
      {
        id: 2,
        title: 'Receptionist - Local Clinic',
        summary: 'Front desk, patient queries, scheduling.',
        company: 'Acornhoek Clinic',
        location: 'Acornhoek',
        type: 'Full-time',
        apply_url: 'mailto:jobs@clinic.co.za',
        community: COMMUNITY,
        status: 'approved',
        featured: 0,
        posted_at: now - 86400000,
        created_at: now - 86400000
      },
      {
        id: 3,
        title: 'Junior Developer Internship',
        summary: 'Learn web development with mentorship. 6-month program.',
        company: 'TechHub SA',
        location: 'Remote / Hybrid',
        type: 'Internship',
        apply_url: 'https://techhub.co.za/apply',
        community: COMMUNITY,
        status: 'approved',
        featured: 1,
        posted_at: now - 172800000,
        created_at: now - 172800000
      },
      {
        id: 4,
        title: 'Delivery Driver - Weekends',
        summary: 'Saturday & Sunday deliveries. Own vehicle required.',
        company: 'QuickShip Logistics',
        location: 'Acornhoek & Bushbuckridge',
        type: 'Part-time',
        apply_url: 'tel:0131234567',
        community: COMMUNITY,
        status: 'approved',
        featured: 0,
        posted_at: now - 259200000,
        created_at: now - 259200000
      },
      {
        id: 5,
        title: 'Administrative Assistant',
        summary: 'Office admin, filing, data capture. Grade 12 required.',
        company: 'Local Municipality',
        location: 'Acornhoek',
        type: 'Contract',
        apply_url: 'mailto:hr@municipality.gov.za',
        community: COMMUNITY,
        status: 'approved',
        featured: 0,
        posted_at: now - 345600000,
        created_at: now - 345600000
      },
      {
        id: 6,
        title: 'Social Media Manager',
        summary: 'Manage social accounts for local businesses. Remote OK.',
        company: 'Digital Dreams Agency',
        location: 'Remote',
        type: 'Freelance',
        apply_url: 'https://digitaldreams.co.za/careers',
        community: COMMUNITY,
        status: 'approved',
        featured: 1,
        posted_at: now - 432000000,
        created_at: now - 432000000
      }
    ];

    // Skills (matching your skillsRoutes.js schema)
    const skills = [
      {
        id: 1,
        title: 'Intro to Freelancing',
        summary: 'Self-paced video course for beginners. Learn how to find clients.',
        provider: 'Remote Academy',
        url: 'https://remoteacademy.co.za/freelancing',
        community: COMMUNITY,
        status: 'approved',
        featured: 1,
        starts_at: now + 604800000,
        created_at: now
      },
      {
        id: 2,
        title: 'Basics of Digital Marketing',
        summary: 'Free weekend workshop. Learn social media, SEO, email marketing.',
        provider: 'Community Hub',
        url: 'https://communityhub.org/workshop',
        community: COMMUNITY,
        status: 'approved',
        featured: 0,
        starts_at: now + 1209600000,
        created_at: now
      },
      {
        id: 3,
        title: 'Computer Literacy Training',
        summary: 'Learn Microsoft Office basics: Word, Excel, PowerPoint.',
        provider: 'Local Library',
        url: 'tel:0139876543',
        community: COMMUNITY,
        status: 'approved',
        featured: 1,
        starts_at: now + 259200000,
        created_at: now
      },
      {
        id: 4,
        title: 'Entrepreneurship Bootcamp',
        summary: '3-week intensive program on starting a business.',
        provider: 'Small Business Development',
        url: 'mailto:info@sbd.org.za',
        community: COMMUNITY,
        status: 'approved',
        featured: 0,
        starts_at: now + 1814400000,
        created_at: now
      },
      {
        id: 5,
        title: 'English Conversation Classes',
        summary: 'Improve spoken English. Every Tuesday & Thursday evening.',
        provider: 'Community Education Center',
        url: 'https://cec.org.za/english',
        community: COMMUNITY,
        status: 'approved',
        featured: 0,
        starts_at: now + 86400000,
        created_at: now
      }
    ];

    // Notices (matching your noticesRoutes.js schema)
    const notices = [
      {
        id: 1,
        title: 'Water Maintenance - Ward 8',
        body: 'Low pressure expected 10:00-13:00. Use water sparingly. Apologies for the inconvenience.',
        contact: 'Municipality: 013-123-4567',
        community: COMMUNITY,
        status: 'approved',
        featured: 1,
        created_at: now
      },
      {
        id: 2,
        title: 'Free Health Screening Saturday',
        body: 'Free blood pressure, diabetes, and HIV screenings at Community Hall, Saturday 09:00-12:00. Bring your ID.',
        contact: 'Health Department: 013-987-6543',
        community: COMMUNITY,
        status: 'approved',
        featured: 1,
        created_at: now - 86400000
      },
      {
        id: 3,
        title: 'Community Meeting - Road Repairs',
        body: 'Discuss upcoming road repairs and budget allocation. Thursday 18:00 at Town Hall. All residents welcome.',
        contact: 'Ward Councillor',
        community: COMMUNITY,
        status: 'approved',
        featured: 0,
        created_at: now - 172800000
      },
      {
        id: 4,
        title: 'Load Shedding Schedule Updated',
        body: 'Stage 2 scheduled for Monday & Wednesday 18:00-22:00. Check Eskom app for real-time updates.',
        contact: 'Eskom Hotline: 0860-037-566',
        community: COMMUNITY,
        status: 'approved',
        featured: 0,
        created_at: now - 259200000
      },
      {
        id: 5,
        title: 'School Holiday Program',
        body: 'Free activities for kids aged 6-14 during school holidays. Sports, arts, tutoring. Starts 15 Dec.',
        contact: 'Youth Center: 013-555-7890',
        community: COMMUNITY,
        status: 'approved',
        featured: 0,
        created_at: now - 345600000
      }
    ];

    // Directory (matching your directoryRoutes.js schema)
    const businesses = [
      {
        id: 1,
        name: 'Acornhoek General Store',
        description: 'Groceries, household items, school supplies, airtime.',
        category: 'Retail',
        phone: '013-111-2222',
        website: 'https://acornhoekstore.co.za',
        hours: 'Mon-Sat 08:00-18:00, Sun 09:00-14:00',
        address: 'Main Road, Acornhoek',
        community: COMMUNITY,
        created_at: now
      },
      {
        id: 2,
        name: 'Dr. Mbatha - Family Practice',
        description: 'General practitioner. Walk-ins welcome. Medical aid accepted.',
        category: 'Healthcare',
        phone: '013-333-4444',
        website: null,
        hours: 'Mon-Fri 08:00-17:00, Sat 08:00-13:00',
        address: 'Clinic Street, Acornhoek',
        community: COMMUNITY,
        created_at: now
      },
      {
        id: 3,
        name: 'Quick Fix Plumbing',
        description: '24/7 emergency plumbing services. Burst pipes, blocked drains, installations.',
        category: 'Services',
        phone: '013-555-6666',
        website: null,
        hours: '24/7 Emergency',
        address: 'Serves Acornhoek & surrounding areas',
        community: COMMUNITY,
        created_at: now
      },
      {
        id: 4,
        name: 'Acornhoek Primary School',
        description: 'Grades R-7. Enrolling for 2026. Quality education in safe environment.',
        category: 'Education',
        phone: '013-777-8888',
        website: 'https://acornhoekprimary.edu.za',
        hours: 'School hours: 07:30-14:00',
        address: 'School Road, Acornhoek',
        community: COMMUNITY,
        created_at: now
      },
      {
        id: 5,
        name: 'Mama\'s Kitchen',
        description: 'Traditional food, pap & vleis, takeaways. Affordable prices.',
        category: 'Food & Dining',
        phone: '072-123-4567',
        website: null,
        hours: 'Mon-Sun 10:00-20:00',
        address: 'Market Square, Acornhoek',
        community: COMMUNITY,
        created_at: now
      },
      {
        id: 6,
        name: 'TechFix Computer Repairs',
        description: 'Laptop & phone repairs, software installation, data recovery.',
        category: 'Technology',
        phone: '082-987-6543',
        website: null,
        hours: 'Mon-Sat 09:00-17:00',
        address: 'Shopping Center, Acornhoek',
        community: COMMUNITY,
        created_at: now
      }
    ];

    // Insert all data
    console.log('📝 Inserting jobs...');
    for (const job of jobs) {
      await insertData('jobs', job);
    }
    console.log(`✅ Inserted ${jobs.length} jobs`);

    console.log('📚 Inserting skills...');
    for (const skill of skills) {
      await insertData('skills', skill);
    }
    console.log(`✅ Inserted ${skills.length} skills`);

    console.log('📢 Inserting notices...');
    for (const notice of notices) {
      await insertData('notices', notice);
    }
    console.log(`✅ Inserted ${notices.length} notices`);

    console.log('🏢 Inserting directory entries...');
    for (const business of businesses) {
      await insertData('directory', business);
    }
    console.log(`✅ Inserted ${businesses.length} directory entries`);

    console.log('\n🎉 Seed complete! Your sections should now have content.');
    console.log('🔄 Refresh your frontend to see the data.');

  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    db.close();
  }
}

seed();