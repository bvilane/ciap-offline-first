/**
 * Test API endpoints
 * Make sure server is running first: npm start
 * Then run: node testAPI.js
 */

const API_BASE = 'http://localhost:3001/api/v1';

async function testAPI() {
  console.log('Testing CIAP API Endpoints...\n');
  
  try {
    // Test 1: Health check
    console.log('Test 1: Health Check');
    const healthRes = await fetch(`${API_BASE}/health`);
    const health = await healthRes.json();
    console.log('✓ Health:', health.status);
    
    // Test 2: Login
    console.log('\nTest 2: Login as Admin');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@ciap.local',
        password: 'Admin123!'
      })
    });
    
    if (!loginRes.ok) {
      const error = await loginRes.json();
      console.log('✗ Login failed:', error);
      return;
    }
    
    const loginData = await loginRes.json();
    console.log('✓ Login successful');
    console.log('  User:', loginData.user.name);
    console.log('  Role:', loginData.user.role);
    console.log('  Token:', loginData.token.substring(0, 50) + '...');
    
    const token = loginData.token;
    
    // Test 3: Get current user
    console.log('\nTest 3: Get Current User (/auth/me)');
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!meRes.ok) {
      const error = await meRes.json();
      console.log('✗ Get me failed:', error);
    } else {
      const meData = await meRes.json();
      console.log('✓ Current user:', meData.user.email);
    }
    
    // Test 4: Admin stats
    console.log('\nTest 4: Admin Stats');
    const statsRes = await fetch(`${API_BASE}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!statsRes.ok) {
      const error = await statsRes.json();
      console.log('✗ Admin stats failed:', error);
    } else {
      const stats = await statsRes.json();
      console.log('✓ Admin stats:');
      console.log('  Users:', stats.users);
      console.log('  Pending:', stats.pending);
      console.log('  Total:', stats.total);
    }
    
    // Test 5: List users (admin only)
    console.log('\nTest 5: List Users (Admin Only)');
    const usersRes = await fetch(`${API_BASE}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!usersRes.ok) {
      const error = await usersRes.json();
      console.log('✗ List users failed:', error);
    } else {
      const usersData = await usersRes.json();
      console.log('✓ Found', usersData.users.length, 'users');
      usersData.users.forEach(u => {
        console.log(`  - ${u.email} (${u.role})`);
      });
    }
    
    // Test 6: Register new user
    console.log('\nTest 6: Register New User');
    const registerRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newuser@ciap.local',
        password: 'NewUser123!',
        name: 'New User'
      })
    });
    
    if (registerRes.status === 409) {
      console.log('✓ User already exists (this is fine)');
    } else if (!registerRes.ok) {
      const error = await registerRes.json();
      console.log('✗ Register failed:', error);
    } else {
      const registerData = await registerRes.json();
      console.log('✓ User registered:', registerData.user.email);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ All API tests completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testAPI();