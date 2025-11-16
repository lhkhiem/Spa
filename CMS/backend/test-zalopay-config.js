/**
 * Test ZaloPay Sandbox Configuration
 * 
 * Script để kiểm tra cấu hình ZaloPay sandbox có đầy đủ và có thể kết nối được không
 * 
 * Usage: node test-zalopay-config.js
 */

require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

// Helper function to calculate HMAC SHA256
function hmacSHA256Hex(key, data) {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest('hex');
}

// Get Vietnam timezone YYMMDD format
function vnYYMMDD(date = new Date()) {
  const tzOffset = 7 * 60; // minutes
  const local = new Date(date.getTime() + (tzOffset - date.getTimezoneOffset()) * 60000);
  const y = local.getFullYear().toString().slice(-2);
  const m = (local.getMonth() + 1).toString().padStart(2, '0');
  const d = local.getDate().toString().padStart(2, '0');
  return `${y}${m}${d}`;
}

async function testZaloPayConfig() {
  console.log('🔍 Kiểm tra cấu hình ZaloPay Sandbox...\n');

  // Check environment variables
  const app_id = Number(process.env.ZP_APP_ID);
  const key1 = process.env.ZP_KEY1;
  const callback_key = process.env.ZP_CALLBACK_KEY;
  const callback_url = process.env.ZP_CALLBACK_URL;
  const redirect_url = process.env.ZP_REDIRECT_URL;
  const api_base = process.env.ZP_API_BASE || 'https://sb-openapi.zalopay.vn/v2';
  const website_origin = process.env.WEBSITE_ORIGIN || 'http://localhost:3000';

  console.log('📋 Environment Variables:');
  console.log('─'.repeat(60));
  console.log(`ZP_APP_ID:        ${app_id ? `✅ ${app_id}` : '❌ Missing'}`);
  console.log(`ZP_KEY1:          ${key1 ? '✅ Set (length: ' + key1.length + ')' : '❌ Missing'}`);
  console.log(`ZP_CALLBACK_KEY:  ${callback_key ? '✅ Set (length: ' + callback_key.length + ')' : '❌ Missing'}`);
  console.log(`ZP_CALLBACK_URL:  ${callback_url || '❌ Missing'}`);
  console.log(`ZP_REDIRECT_URL:  ${redirect_url || '⚠️  Not set (will use WEBSITE_ORIGIN)'}`);
  console.log(`ZP_API_BASE:      ${api_base}`);
  console.log(`WEBSITE_ORIGIN:   ${website_origin}`);
  console.log('─'.repeat(60));
  console.log('');

  // Validate required variables
  const missing = [];
  if (!app_id || isNaN(app_id) || app_id <= 0) {
    missing.push('ZP_APP_ID (must be a positive number)');
  }
  if (!key1) {
    missing.push('ZP_KEY1');
  }
  if (!callback_key) {
    missing.push('ZP_CALLBACK_KEY');
  }
  if (!callback_url) {
    missing.push('ZP_CALLBACK_URL');
  }

  if (missing.length > 0) {
    console.log('❌ Thiếu các biến môi trường sau:');
    missing.forEach(m => console.log(`   - ${m}`));
    console.log('\n💡 Vui lòng thêm các biến này vào file .env');
    return;
  }

  console.log('✅ Tất cả các biến môi trường đã được cấu hình\n');

  // Test API connection
  console.log('🔌 Kiểm tra kết nối đến ZaloPay API...');
  console.log(`   API Base: ${api_base}\n`);

  try {
    // Test 1: Create a test order
    console.log('📦 Test 1: Tạo test order...');
    
    const testOrderId = `TEST_${Date.now()}`;
    const app_time = Date.now();
    const app_trans_id = `${vnYYMMDD()}_${testOrderId}`;
    const testAmount = 1000; // 1000 VND
    const testAppUser = 'test_user';
    const testDescription = 'Test order from config checker';

    const embed_data = JSON.stringify({
      redirecturl: redirect_url || `${website_origin}/checkout/result`,
    });

    const item = JSON.stringify([]);

    // Calculate MAC
    const macInput = [
      app_id,
      app_trans_id,
      testAppUser,
      testAmount,
      app_time,
      embed_data,
      item,
    ].join('|');

    const mac = hmacSHA256Hex(key1, macInput);

    const requestBody = {
      app_id,
      app_user: testAppUser,
      app_trans_id,
      app_time,
      amount: testAmount,
      description: testDescription,
      embed_data,
      item,
      callback_url,
      mac,
    };

    console.log('   Request body:');
    console.log(`   - app_id: ${app_id}`);
    console.log(`   - app_trans_id: ${app_trans_id}`);
    console.log(`   - amount: ${testAmount} VND`);
    console.log(`   - callback_url: ${callback_url}`);
    console.log('');

    const response = await axios.post(
      `${api_base}/create`,
      requestBody,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );

    console.log('   Response:');
    console.log(`   - return_code: ${response.data.return_code}`);
    console.log(`   - return_message: ${response.data.return_message}`);
    
    if (response.data.return_code === 1) {
      console.log('   ✅ Kết nối thành công!');
      console.log(`   - order_url: ${response.data.order_url ? '✅ Có' : '❌ Không có'}`);
      console.log(`   - zp_trans_token: ${response.data.zp_trans_token ? '✅ Có' : '❌ Không có'}`);
      
      if (response.data.order_url) {
        console.log(`\n   🔗 Order URL: ${response.data.order_url}`);
        console.log('   💡 Bạn có thể mở URL này để xem QR code thanh toán');
      }
    } else {
      console.log('   ⚠️  ZaloPay trả về lỗi:');
      console.log(`   - return_code: ${response.data.return_code}`);
      console.log(`   - return_message: ${response.data.return_message}`);
      if (response.data.sub_return_code) {
        console.log(`   - sub_return_code: ${response.data.sub_return_code}`);
      }
      if (response.data.sub_return_message) {
        console.log(`   - sub_return_message: ${response.data.sub_return_message}`);
      }
    }

    console.log('\n✅ Test hoàn tất!');
    console.log('\n📝 Kết luận:');
    if (response.data.return_code === 1) {
      console.log('   ✅ Cấu hình ZaloPay sandbox đã đúng và có thể sử dụng');
      console.log('   ✅ Bạn có thể test thanh toán ZaloPay ngay bây giờ');
    } else {
      console.log('   ⚠️  Cấu hình có vấn đề, vui lòng kiểm tra lại:');
      console.log('   1. Kiểm tra APP_ID, KEY1, CALLBACK_KEY có đúng không');
      console.log('   2. Kiểm tra CALLBACK_URL có accessible từ internet không');
      console.log('   3. Kiểm tra tài khoản ZaloPay sandbox có active không');
    }

  } catch (error) {
    console.log('   ❌ Lỗi khi kết nối đến ZaloPay API:');
    
    if (error.response) {
      console.log(`   - Status: ${error.response.status}`);
      console.log(`   - Data:`, JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('   - Không nhận được response từ server');
      console.log('   - Có thể do:');
      console.log('     + Mạng không kết nối được');
      console.log('     + API URL không đúng');
      console.log('     + Firewall chặn kết nối');
    } else {
      console.log(`   - Error: ${error.message}`);
    }

    console.log('\n❌ Test thất bại!');
    console.log('💡 Vui lòng kiểm tra lại cấu hình và thử lại');
  }
}

// Run test
testZaloPayConfig().catch(console.error);




