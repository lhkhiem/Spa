// Test product detail API endpoint
const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:3011';
const SLUG = 'radiant-vitamin-c-serum-default';
const ENDPOINT = `/api/public/products/${SLUG}`;

console.log(`🧪 Testing Product Detail API...\n`);
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
  console.log('');

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      
      if (res.statusCode === 200) {
        console.log('✅ API Response Success!\n');
        if (json.data) {
          console.log('Product found:');
          console.log(`   Name: ${json.data.name}`);
          console.log(`   Slug: ${json.data.slug}`);
          console.log(`   Price: $${json.data.price}`);
          console.log(`   Status: ${json.data.status || 'N/A'}`);
        } else {
          console.log('Response:', JSON.stringify(json, null, 2).substring(0, 500));
        }
      } else {
        console.log('❌ API Response Error!\n');
        console.log('Response:', JSON.stringify(json, null, 2));
      }
    } catch (error) {
      console.log('❌ Failed to parse response as JSON');
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
});

req.end();

