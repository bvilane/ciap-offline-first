// backend/tests/test-health.js
// Test script to verify health endpoint returns correct data structure

const API_URL = process.env.API_URL || 'https://ciap-backend-prod.onrender.com/api/v1';

async function testHealthEndpoint() {
  console.log('='.repeat(60));
  console.log('CIAP Health Endpoint Test');
  console.log('='.repeat(60));
  console.log(`Testing: ${API_URL}/health\n`);

  try {
    const response = await fetch(`${API_URL}/health`);
    
    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:', {
      'content-type': response.headers.get('content-type'),
      'access-control-allow-origin': response.headers.get('access-control-allow-origin')
    });
    console.log();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('Response Body:');
    console.log(JSON.stringify(data, null, 2));
    console.log();

    // Validate expected fields
    console.log('Validation Checks:');
    console.log('✓ Status field present:', 'status' in data);
    console.log('✓ Status value:', data.status);
    console.log('✓ Database field present:', 'database' in data);
    console.log('✓ Database value:', data.database);
    console.log('✓ Uptime field present:', 'uptime' in data);
    console.log('✓ Uptime value:', data.uptime);
    console.log('✓ Environment field present:', 'environment' in data);
    console.log('✓ Environment value:', data.environment);
    console.log();

    // Check for expected values
    const checks = {
      'status === "ok"': data.status === 'ok',
      'database === "connected"': data.database === 'connected',
      'uptime is string': typeof data.uptime === 'string',
      'environment is set': data.environment !== undefined
    };

    console.log('Expected Value Checks:');
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`${passed ? '✓' : '✗'} ${check}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    console.log();

    const allPassed = Object.values(checks).every(v => v);
    
    if (allPassed) {
      console.log('✓ All checks passed! Health endpoint is working correctly.');
    } else {
      console.log('✗ Some checks failed. Review the response structure.');
    }
    
    console.log('='.repeat(60));
    
    return { success: allPassed, data };
    
  } catch (error) {
    console.error('✗ Health check failed:', error.message);
    console.log('='.repeat(60));
    return { success: false, error: error.message };
  }
}

// Run if called directly
if (require.main === module) {
  testHealthEndpoint()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Unexpected error:', err);
      process.exit(1);
    });
}

module.exports = { testHealthEndpoint };