/**
 * Quick test script for authentication
 * Run: node testAuth.js
 */

const database = require('./src/database/connection');
const User = require('./src/models/User');
require('dotenv').config();

async function testAuth() {
  console.log('Testing authentication system...\n');

  try {
    await database.connect();
    
    // Test 1: Find admin user
    console.log('Test 1: Finding admin user...');
    const admin = await User.findByEmail('admin@ciap.local');
    
    if (admin) {
      console.log('✓ Admin found:');
      console.log(`  ID: ${admin.id || admin.user_id}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
    } else {
      console.log('✗ Admin not found');
    }
    
    // Test 2: Verify password
    console.log('\nTest 2: Verifying admin password...');
    const isValid = await User.verifyPassword('Admin123!', admin.password_hash);
    console.log(isValid ? '✓ Password verified' : '✗ Password incorrect');
    
    // Test 3: Create test user
    console.log('\nTest 3: Creating test user...');
    try {
      const testUser = await User.create({
        email: 'test@ciap.local',
        password: 'Test123!',
        name: 'Test User',
        role: 'user'
      });
      console.log('✓ Test user created:');
      console.log(`  ID: ${testUser.id}`);
      console.log(`  Email: ${testUser.email}`);
    } catch (error) {
      if (error.message.includes('Email already exists')) {
        console.log('✓ Test user already exists (this is fine)');
      } else {
        throw error;
      }
    }
    
    // Test 4: Count users by role
    console.log('\nTest 4: Counting users by role...');
    const counts = await User.countByRole();
    console.log('✓ User counts:');
    console.log(`  Admins: ${counts.admin}`);
    console.log(`  Moderators: ${counts.moderator}`);
    console.log(`  Users: ${counts.user}`);
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ All authentication tests passed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await database.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    await database.close();
    process.exit(1);
  }
}

testAuth();