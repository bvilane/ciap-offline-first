/**
 * Reset admin password to Admin123!
 * Run this if you need to reset the admin password
 */

const database = require('./src/database/connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetAdminPassword() {
  console.log('Resetting admin password...\n');

  try {
    await database.connect();
    
    // Find admin user
    const admin = await database.queryOne(
      'SELECT * FROM users WHERE email = ? OR role = ?',
      ['admin@ciap.local', 'admin']
    );
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    
    console.log('Found admin user:');
    console.log(`  ID: ${admin.id || admin.user_id}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Username: ${admin.username || 'N/A'}`);
    
    // Hash new password
    const newPassword = 'Admin123!';
    const password_hash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    const idColumn = admin.id ? 'id' : 'user_id';
    const idValue = admin.id || admin.user_id;
    
    await database.execute(
      `UPDATE users SET password_hash = ? WHERE ${idColumn} = ?`,
      [password_hash, idValue]
    );
    
    console.log('\n✓ Admin password reset successfully!');
    console.log(`  New password: ${newPassword}`);
    console.log(`  Email: ${admin.email}`);
    
    // Verify it works
    const isValid = await bcrypt.compare(newPassword, password_hash);
    console.log(`  Verification: ${isValid ? '✓ Password works' : '✗ Password failed'}`);
    
    await database.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to reset password:', error);
    await database.close();
    process.exit(1);
  }
}

resetAdminPassword();