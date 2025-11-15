const axios = require('axios');
require('dotenv').config();

const API_BASE = process.env.API_URL || 'http://localhost:3011/api';

async function testLookup() {
  const testPhone = '0886939879';
  
  try {
    console.log(`🔍 Testing order lookup API for phone: ${testPhone}`);
    console.log(`📡 URL: ${API_BASE}/orders/phone/${encodeURIComponent(testPhone)}\n`);
    
    const response = await axios.get(`${API_BASE}/orders/phone/${encodeURIComponent(testPhone)}`, {
      timeout: 5000,
      validateStatus: (status) => status < 500 // Don't throw on 404
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📦 Response:`, JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data) {
      console.log(`\n✅ Found ${response.data.count || response.data.data.length} orders`);
    } else {
      console.log(`\n⚠️  No orders found`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testLookup();

