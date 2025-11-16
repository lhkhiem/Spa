/**
 * Test if .env file is loaded correctly
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');

console.log('🔍 Kiểm tra file .env và biến môi trường:\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
console.log('📁 Đường dẫn file .env:', envPath);
console.log('📁 File .env tồn tại:', fs.existsSync(envPath) ? '✅ Có' : '❌ Không');
console.log('');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Nội dung file .env (dòng có ZP_):');
  console.log('─'.repeat(60));
  envContent.split('\n').forEach((line, index) => {
    if (line.includes('ZP_') && !line.trim().startsWith('#')) {
      // Hide sensitive values
      const safeLine = line.replace(/=(.+)/, (match, value) => {
        if (value.trim().length > 20) {
          return `=***${value.trim().slice(-10)} (length: ${value.trim().length})`;
        }
        return match;
      });
      console.log(`Line ${index + 1}: ${safeLine}`);
    }
  });
  console.log('─'.repeat(60));
  console.log('');
}

// Check environment variables
console.log('🔍 Kiểm tra biến môi trường đã load:');
console.log('─'.repeat(60));

const vars = {
  'ZP_APP_ID': process.env.ZP_APP_ID,
  'ZP_KEY1': process.env.ZP_KEY1,
  'ZP_CALLBACK_KEY': process.env.ZP_CALLBACK_KEY,
  'ZP_CALLBACK_URL': process.env.ZP_CALLBACK_URL,
};

let allOk = true;

for (const [key, value] of Object.entries(vars)) {
  if (!value) {
    console.log(`❌ ${key}: Not loaded`);
    allOk = false;
  } else {
    if (key === 'ZP_APP_ID') {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue <= 0) {
        console.log(`⚠️  ${key}: ${value} (invalid number)`);
        allOk = false;
      } else {
        console.log(`✅ ${key}: ${numValue}`);
      }
    } else if (key === 'ZP_CALLBACK_URL') {
      if (value.includes('xxxx')) {
        console.log(`⚠️  ${key}: ${value} (placeholder - cần thay bằng URL ngrok thật)`);
        allOk = false;
      } else {
        console.log(`✅ ${key}: ${value}`);
      }
    } else {
      const displayValue = value.length > 30 ? `${value.substring(0, 30)}...` : value;
      console.log(`✅ ${key}: ${displayValue} (length: ${value.length})`);
    }
  }
}

console.log('─'.repeat(60));
console.log('');

if (allOk) {
  console.log('✅ Tất cả các biến đã được load đúng!');
  console.log('💡 Nếu backend vẫn báo lỗi, hãy restart backend server');
} else {
  console.log('❌ Có vấn đề với việc load biến môi trường!');
  console.log('💡 Kiểm tra:');
  console.log('   1. File .env có đúng format không');
  console.log('   2. Không có khoảng trắng thừa trước/sau dấu =');
  console.log('   3. ZP_CALLBACK_URL đã được thay placeholder chưa');
}




