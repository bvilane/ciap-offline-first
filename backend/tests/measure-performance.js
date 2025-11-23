const https = require('https');
const fs = require('fs');

const API_BASE = 'https://ciap-backend-prod.onrender.com/api/v1';

function measureResponseTime(url, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const start = Date.now();
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: body ? { 'Content-Type': 'application/json' } : {}
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({
          url: url,
          method: method,
          status: res.statusCode,
          responseTime: duration,
          timestamp: new Date().toISOString()
        });
      });
    });

    req.on('error', (e) => {
      const duration = Date.now() - start;
      resolve({
        url: url,
        method: method,
        status: 'ERROR',
        responseTime: duration,
        error: e.message,
        timestamp: new Date().toISOString()
      });
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runPerformanceTest(iterations = 10) {
  console.log(`\n🔬 Performance Testing - ${iterations} iterations per endpoint\n`);
  
  const endpoints = [
    { name: 'Health Check', url: `${API_BASE}/health`, method: 'GET' },
    { name: 'Communities List', url: `${API_BASE}/communities`, method: 'GET' },
    { name: 'Notices (Acornhoek)', url: `${API_BASE}/notices?community=Acornhoek`, method: 'GET' },
    { name: 'Jobs (Acornhoek)', url: `${API_BASE}/jobs?community=Acornhoek`, method: 'GET' },
    { name: 'Skills (Acornhoek)', url: `${API_BASE}/skills?community=Acornhoek`, method: 'GET' },
    { name: 'Directory (Acornhoek)', url: `${API_BASE}/directory?community=Acornhoek`, method: 'GET' }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint.name}`);
    const measurements = [];

    for (let i = 0; i < iterations; i++) {
      const result = await measureResponseTime(endpoint.url, endpoint.method);
      measurements.push(result.responseTime);
      process.stdout.write('.');
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between requests
    }

    const avg = Math.round(measurements.reduce((a, b) => a + b) / measurements.length);
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    console.log(`\n   ✅ Average: ${avg}ms | Min: ${min}ms | Max: ${max}ms\n`);

    results.push({
      endpoint: endpoint.name,
      url: endpoint.url,
      iterations: iterations,
      average: avg,
      min: min,
      max: max,
      measurements: measurements
    });
  }

  // Save results to file
  const output = {
    testDate: new Date().toISOString(),
    iterations: iterations,
    results: results
  };

  fs.writeFileSync(
    'performance-test-results.json',
    JSON.stringify(output, null, 2)
  );

  console.log('\n📊 Results saved to: performance-test-results.json\n');
  
  // Print summary table
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║              PERFORMANCE TEST SUMMARY                    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  results.forEach(r => {
    console.log(`${r.endpoint.padEnd(25)} → Avg: ${r.average}ms (${r.min}-${r.max}ms)`);
  });
  
  console.log('\n');
}

// Run with 10 iterations per endpoint
runPerformanceTest(10);