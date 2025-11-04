// backend/diagnose.js
// Run: node diagnose.js
// This checks database, routes, and returns diagnostic info

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'data/ciap.db');

console.log('🔍 CIAP DIAGNOSTIC TOOL\n');
console.log('='.repeat(50));

// Check 1: Database file exists
console.log('\n📁 CHECK 1: Database File');
console.log('Expected path:', dbPath);
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log('✅ Database exists');
  console.log('   Size:', (stats.size / 1024).toFixed(2), 'KB');
  console.log('   Modified:', stats.mtime);
} else {
  console.log('❌ Database file NOT FOUND');
  console.log('   Run: node resetDatabase.js');
  process.exit(1);
}

// Check 2: Can connect to database
console.log('\n🔌 CHECK 2: Database Connection');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log('❌ Cannot connect:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected successfully');
});

// Check 3: Tables exist
console.log('\n📋 CHECK 3: Tables');
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
  if (err) {
    console.log('❌ Error querying tables:', err.message);
    db.close();
    process.exit(1);
  }
  
  const expectedTables = ['communities', 'notices', 'jobs', 'skills', 'directory', 'users'];
  const foundTables = tables.map(t => t.name);
  
  console.log('Expected tables:', expectedTables.length);
  console.log('Found tables:', foundTables.length);
  
  expectedTables.forEach(table => {
    if (foundTables.includes(table)) {
      console.log(`   ✅ ${table}`);
    } else {
      console.log(`   ❌ ${table} - MISSING!`);
    }
  });
  
  // Check 4: Count records
  console.log('\n📊 CHECK 4: Record Counts');
  
  const queries = [
    "SELECT COUNT(*) as count FROM jobs WHERE community='Acornhoek'",
    "SELECT COUNT(*) as count FROM skills WHERE community='Acornhoek'",
    "SELECT COUNT(*) as count FROM notices WHERE community='Acornhoek'",
    "SELECT COUNT(*) as count FROM directory WHERE community='Acornhoek'",
    "SELECT COUNT(*) as count FROM communities"
  ];
  
  const labels = ['Jobs', 'Skills', 'Notices', 'Directory', 'Communities'];
  
  let completed = 0;
  queries.forEach((query, i) => {
    db.get(query, [], (err, row) => {
      if (err) {
        console.log(`   ❌ ${labels[i]}: Error - ${err.message}`);
      } else {
        const count = row.count;
        if (count > 0) {
          console.log(`   ✅ ${labels[i]}: ${count} records`);
        } else {
          console.log(`   ⚠️  ${labels[i]}: 0 records - No data!`);
        }
      }
      
      completed++;
      if (completed === queries.length) {
        // Check 5: Sample data
        console.log('\n🎯 CHECK 5: Sample Records');
        
        db.get("SELECT title FROM jobs WHERE community='Acornhoek' LIMIT 1", [], (err, job) => {
          if (err) {
            console.log('   ❌ Jobs query error:', err.message);
          } else if (job) {
            console.log('   ✅ Sample job:', job.title);
          } else {
            console.log('   ⚠️  No jobs found for Acornhoek');
          }
          
          db.get("SELECT title FROM notices WHERE community='Acornhoek' LIMIT 1", [], (err, notice) => {
            if (err) {
              console.log('   ❌ Notices query error:', err.message);
            } else if (notice) {
              console.log('   ✅ Sample notice:', notice.title);
            } else {
              console.log('   ⚠️  No notices found for Acornhoek');
            }
            
            // Check 6: Schema check
            console.log('\n🔧 CHECK 6: Table Structure (jobs)');
            db.all("PRAGMA table_info(jobs)", [], (err, columns) => {
              if (err) {
                console.log('   ❌ Error:', err.message);
              } else {
                const hasStatus = columns.some(c => c.name === 'status');
                const hasFeatured = columns.some(c => c.name === 'featured');
                
                console.log('   Columns found:', columns.map(c => c.name).join(', '));
                console.log('   Has "status" column:', hasStatus ? '✅' : '❌ MISSING!');
                console.log('   Has "featured" column:', hasFeatured ? '✅' : '❌ MISSING!');
              }
              
              // Final summary
              console.log('\n' + '='.repeat(50));
              console.log('🏁 DIAGNOSTIC COMPLETE\n');
              console.log('Next steps:');
              console.log('1. If tables are missing → run: node resetDatabase.js');
              console.log('2. If records are 0 → run: node resetDatabase.js');
              console.log('3. If status/featured missing → run: node resetDatabase.js');
              console.log('4. If everything ✅ → check backend routes and frontend\n');
              
              db.close();
            });
          });
        });
      }
    });
  });
});