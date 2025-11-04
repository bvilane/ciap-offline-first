// backend/database/seeders/quickSeed.js
// Run: node database/seeders/quickSeed.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../ciap.sqlite');
const db = new sqlite3.Database(dbPath);

const COMMUNITY = 'Acornhoek';

console.log('🌱 Starting quick seed...');

// Helper to insert data
function insertData(table, data) {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(',');
    
    const sql = `INSERT OR IGNORE INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
    
    db.run(sql, values, function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

// Seed data
async function seed() {
  try {
    // Jobs
    const jobs = [
      {
        id: 1,
        title: 'Remote Customer Support Representative',
        description: 'Help customers via chat and email. Training provided.',
        company: 'Remote Inc.',
        location: 'Remote',
        type: 'Full-time',
        apply_url: 'https://example.com/apply',
        community: COMMUNITY,
        status: 'approved',
        created_at: Date.now()
      },
      {
        id: 2,
        title: 'Receptionist - Local Clinic',
        description: 'Front desk, patient queries, scheduling.',
        company: 'Acornhoek Clinic',
        location: 'Acornhoek',
        type: 'Full-time',
        apply_url: 'https://example.com/apply',
        community: COMMUNITY,
        status: 'approved',
        created_at: Date.now()
      },
      {
        id: 3,
        title: 'Junior Developer Internship',
        description: 'Learn web development. 6-month program.',
        company: 'TechHub SA',
        location: 'Remote',
        type: 'Internship',
        apply_url: 'https://example.com/apply',
        community: COMMUNITY,
        status: 'approved',
        featured: 1,
        created_at: Date.now()
      }
    ];

    // Skills
    const skills = [
      {
        id: 1,
        title: 'Intro to Freelancing',
        description: 'Self-paced video course for beginners.',
        provider: 'Remote Academy',
        url: 'https://example.com/course',
        community: COMMUNITY,
        status: 'approved',
        created_at: Date.now()
      },
      {
        id: 2,
        title: 'Basics of Digital Marketing',
        description: 'Free weekend workshop. Limited seats.',
        provider: 'Community Hub',
        url: 'https://example.com/course',
        community: COMMUNITY,
        status: 'approved',
        created_at: Date.now()
      },
      {
        id: 3,
        title: 'Computer Literacy Training',
        description: 'Learn Microsoft Office basics.',
        provider: 'Local Library',
        url: 'https://example.com/course',
        community: COMMUNITY,
        status: 'approved',
        featured: 1,
        created_at: Date.now()
      }
    ];

    // Notices
    const notices = [
      {
        id: 1,
        title: 'Water Maintenance - Ward 8',
        description: 'Low pressure expected 10:00-13:00. Use water sparingly.',
        contact: 'Municipality: 013-123-4567',
        community: COMMUNITY,
        status: 'approved',
        created_at: Date.now()
      },
      {
        id: 2,
        title: 'Free Health Screening',
        description: 'Free screenings at Community Hall, Saturday 09:00-12:00.',
        contact: 'Health Dept: 013-987-6543',
        community: COMMUNITY,
        status: 'approved',
        featured: 1,
        created_at: Date.now()
      },
      {
        id: 3,
        title: 'Community Meeting - Road Repairs',
        description: 'Discuss upcoming road repairs. Thursday 18:00 at Town Hall.',
        contact: 'Ward Councillor',
        community: COMMUNITY,
        status: 'approved',
        created_at: Date.now()
      }
    ];

    // Directory
    const businesses = [
      {
        id: 1,
        name: 'Acornhoek General Store',
        description: 'Groceries, household items, and more.',
        category: 'Retail',
        phone: '013-111-2222',
        website: 'https://example.com',
        community: COMMUNITY,
        created_at: Date.now()
      },
      {
        id: 2,
        name: 'Dr. Mbatha - Family Practice',
        description: 'General practitioner. Walk-ins welcome.',
        category: 'Healthcare',
        phone: '013-333-4444',
        community: COMMUNITY,
        created_at: Date.now()
      },
      {
        id: 3,
        name: 'Quick Fix Plumbing',
        description: '24/7 emergency plumbing services.',
        category: 'Services',
        phone: '013-555-6666',
        community: COMMUNITY,
        created_at: Date.now()
      },
      {
        id: 4,
        name: 'Acornhoek Primary School',
        description: 'Grades R-7. Enrolling for 2026.',
        category: 'Education',
        phone: '013-777-8888',
        community: COMMUNITY,
        created_at: Date.now()
      }
    ];

    // Insert all data
    console.log('📝 Inserting jobs...');
    for (const job of jobs) {
      await insertData('jobs', job);
    }

    console.log('📚 Inserting skills...');
    for (const skill of skills) {
      await insertData('skills', skill);
    }

    console.log('📢 Inserting notices...');
    for (const notice of notices) {
      await insertData('notices', notice);
    }

    console.log('🏢 Inserting directory entries...');
    for (const business of businesses) {
      await insertData('directory', business);
    }

    console.log('✅ Seed complete! Your sections should now have content.');
    console.log('🔄 Refresh your frontend to see the data.');

  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    db.close();
  }
}

seed();