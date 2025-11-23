const https = require('https');

const API_BASE = 'https://ciap-backend-prod.onrender.com/api/v1/notices?community=Acornhoek';

function makeRequest() {
  return new Promise((resolve) => {
    const start = Date.now();
    const urlObj = new URL(API_BASE);
    
    const req = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(Date.now() - start);
      });
    });
    
    req.on('error', () => resolve(Date.now() - start));
    req.end();
  });
}

async function loadTest(concurrency) {
  console.log(`\n🔥 Load Test: ${concurrency} concurrent requests\n`);
  
  const start = Date.now();
  const promises = [];
  
  for (let i = 0; i < concurrency; i++) {
    promises.push(makeRequest());
  }
  
  const results = await Promise.all(promises);
  const totalTime = Date.now() - start;
  
  const avg = Math.round(results.reduce((a, b) => a + b) / results.length);
  const min = Math.min(...results);
  const max = Math.max(...results);
  
  console.log(`Concurrent Users: ${concurrency}`);
  console.log(`Total Time: ${totalTime}ms`);
  console.log(`Average Response: ${avg}ms`);
  console.log(`Min: ${min}ms | Max: ${max}ms`);
  console.log(`Requests/second: ${Math.round(concurrency / (totalTime / 1000))}`);
  console.log('');
  
  return { concurrency, avg, min, max, totalTime };
}

async function runAllTests() {
  const results = [];
  
  for (const users of [1, 5, 10, 15, 20]) {
    const result = await loadTest(users);
    results.push(result);
    await new Promise(r => setTimeout(r, 2000)); // Wait 2s between tests
  }
  
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   LOAD TEST SUMMARY                  ║');
  console.log('╚══════════════════════════════════════╝\n');
  
  results.forEach(r => {
    console.log(`${r.concurrency} users → Avg: ${r.avg}ms (${r.min}-${r.max}ms)`);
  });
}

runAllTests();