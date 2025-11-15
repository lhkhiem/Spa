// Test products API endpoint
const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:3011';
const ENDPOINT = '/api/public/products';

console.log(`🧪 Testing Products API...\n`);
console.log(`URL: ${API_URL}${ENDPOINT}\n`);

const options = {
  hostname: API_URL.replace(/^https?:\/\//, '').split(':')[0],
  port: API_URL.includes(':') ? API_URL.split(':').pop().replace(/\/.*$/, '') : (API_URL.startsWith('https') ? 443 : 80),
  path: ENDPOINT,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';

  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  console.log('');

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      
      if (res.statusCode === 200) {
        console.log('✅ API Response Success!\n');
        console.log('Response structure:');
        console.log(JSON.stringify(json, null, 2).substring(0, 1000));
        
        if (json.data && Array.isArray(json.data)) {
          console.log(`\n📦 Products found: ${json.data.length}`);
          if (json.meta) {
            console.log(`   Total: ${json.meta.total || json.data.length}`);
            console.log(`   Page: ${json.meta.page || 1}`);
            console.log(`   Page Size: ${json.meta.pageSize || json.data.length}`);
          }
          
          if (json.data.length > 0) {
            console.log('\n📋 First product:');
            const first = json.data[0];
            console.log(`   Name: ${first.name}`);
            console.log(`   Slug: ${first.slug}`);
            console.log(`   Price: $${first.price}`);
            console.log(`   Status: ${first.status}`);
          } else {
            console.log('\n⚠️  No products in response!');
            console.log('   Check if products have status = "published"');
          }
        } else {
          console.log('\n⚠️  Response format unexpected!');
          console.log('   Expected: { data: [], meta: {} }');
        }
      } else {
        console.log('❌ API Response Error!\n');
        console.log('Response:', json);
      }
    } catch (error) {
      console.log('❌ Failed to parse response as JSON');
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
  console.error('\nPossible issues:');
  console.error('1. Backend server is not running');
  console.error('2. Wrong API_URL (check .env or NEXT_PUBLIC_API_URL)');
  console.error('3. CORS or network issue');
  console.error('\nTry:');
  console.error(`   curl ${API_URL}${ENDPOINT}`);
});

req.end();

