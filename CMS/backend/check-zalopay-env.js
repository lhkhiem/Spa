/**
 * Quick check ZaloPay environment variables
 * 
 * Usage: node check-zalopay-env.js
 */

require('dotenv').config();

console.log('🔍 Kiểm tra ZaloPay Environment Variables:\n');
console.log('─'.repeat(60));

const vars = {
  'ZP_APP_ID': process.env.ZP_APP_ID,
  'ZP_KEY1': process.env.ZP_KEY1,
  'ZP_CALLBACK_KEY': process.env.ZP_CALLBACK_KEY,
  'ZP_CALLBACK_URL': process.env.ZP_CALLBACK_URL,
  'ZP_REDIRECT_URL': process.env.ZP_REDIRECT_URL,
  'ZP_API_BASE': process.env.ZP_API_BASE,
  'WEBSITE_ORIGIN': process.env.WEBSITE_ORIGIN,
};

let allOk = true;

for (const [key, value] of Object.entries(vars)) {
  if (key === 'ZP_APP_ID') {
    const numValue = Number(value);
    if (!value || isNaN(numValue) || numValue <= 0) {
      console.log(`❌ ${key}: ${value || 'Missing'} (must be a positive number)`);
      allOk = false;
    } else {
      console.log(`✅ ${key}: ${numValue}`);
    }
  } else if (key === 'ZP_KEY1' || key === 'ZP_CALLBACK_KEY') {
    if (!value) {
      console.log(`❌ ${key}: Missing`);
      allOk = false;
    } else {
      console.log(`✅ ${key}: Set (length: ${value.length})`);
    }
  } else if (key === 'ZP_CALLBACK_URL') {
    if (!value) {
      console.log(`❌ ${key}: Missing (required)`);
      allOk = false;
    } else if (!value.startsWith('http')) {
      console.log(`⚠️  ${key}: ${value} (should start with http:// or https://)`);
    } else {
      console.log(`✅ ${key}: ${value}`);
    }
  } else {
    if (!value) {
      console.log(`⚠️  ${key}: Not set (optional)`);
    } else {
      console.log(`✅ ${key}: ${value}`);
    }
  }
}

console.log('─'.repeat(60));
console.log('');

if (allOk) {
  console.log('✅ Tất cả các biến bắt buộc đã được cấu hình!');
  console.log('💡 Nếu vẫn gặp lỗi, hãy:');
  console.log('   1. Restart backend server');
  console.log('   2. Kiểm tra file .env có trong thư mục CMS/backend/ không');
  console.log('   3. Kiểm tra backend logs để xem lỗi chi tiết');
} else {
  console.log('❌ Thiếu một số biến môi trường bắt buộc!');
  console.log('💡 Vui lòng thêm các biến này vào file CMS/backend/.env');
  console.log('');
  console.log('Ví dụ:');
  console.log('ZP_APP_ID=2553');
  console.log('ZP_KEY1=your_key1_here');
  console.log('ZP_CALLBACK_KEY=your_callback_key_here');
  console.log('ZP_CALLBACK_URL=https://your-domain.com/api/payments/zalopay/callback');
}




