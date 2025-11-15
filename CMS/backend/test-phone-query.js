const { Client } = require('pg');
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD || 'spa_cms_password';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;
let dbName = process.env.DB_NAME;
if (!dbName && process.env.DATABASE_URL) {
  const urlParts = process.env.DATABASE_URL.split('/');
  dbName = urlParts[urlParts.length - 1]?.split('?')[0];
}
dbName = dbName || 'spa_cms_db';
const dbUser = process.env.DB_USER || 'spa_cms_user';

const connectionString = process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const client = new Client({ connectionString });

(async () => {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    const testPhone = '0886939879';
    const normalized = testPhone.replace(/[\s\-\(\)]/g, '');
    
    console.log(`🔍 Testing query with phone: "${testPhone}"`);
    console.log(`📱 Normalized: "${normalized}"\n`);
    
    // Test 1: Exact match
    console.log('1️⃣  Testing exact match:');
    const exactRes = await client.query(
      `SELECT id, order_number, customer_phone 
       FROM orders 
       WHERE customer_phone IS NOT NULL 
         AND customer_phone = $1 
       LIMIT 5`,
      [testPhone]
    );
    console.log(`   Found: ${exactRes.rows.length} orders`);
    if (exactRes.rows.length > 0) {
      exactRes.rows.forEach(row => {
        console.log(`   - ${row.order_number}: "${row.customer_phone}"`);
      });
    }
    
    // Test 2: Normalized match
    console.log('\n2️⃣  Testing normalized match:');
    const normalizedRes = await client.query(
      `SELECT id, order_number, customer_phone 
       FROM orders 
       WHERE customer_phone IS NOT NULL 
         AND REPLACE(REPLACE(REPLACE(REPLACE(customer_phone, ' ', ''), '-', ''), '(', ''), ')', '') = $1 
       LIMIT 5`,
      [normalized]
    );
    console.log(`   Found: ${normalizedRes.rows.length} orders`);
    if (normalizedRes.rows.length > 0) {
      normalizedRes.rows.forEach(row => {
        const normalizedDb = row.customer_phone.replace(/[\s\-\(\)]/g, '');
        console.log(`   - ${row.order_number}: "${row.customer_phone}" → normalized: "${normalizedDb}"`);
      });
    }
    
    // Test 3: Combined query (as in controller)
    console.log('\n3️⃣  Testing combined query (as in controller):');
    const combinedRes = await client.query(
      `SELECT id, order_number, customer_phone 
       FROM orders 
       WHERE customer_phone IS NOT NULL 
         AND (
           customer_phone = $1 
           OR REPLACE(REPLACE(REPLACE(REPLACE(customer_phone, ' ', ''), '-', ''), '(', ''), ')', '') = $2
         )
       ORDER BY created_at DESC
       LIMIT 5`,
      [testPhone, normalized]
    );
    console.log(`   Found: ${combinedRes.rows.length} orders`);
    if (combinedRes.rows.length > 0) {
      combinedRes.rows.forEach(row => {
        console.log(`   - ${row.order_number}: "${row.customer_phone}"`);
      });
    }
    
    // Show all phones in DB
    console.log('\n📞 All phones in database:');
    const allPhones = await client.query(
      `SELECT DISTINCT customer_phone, COUNT(*) as count 
       FROM orders 
       WHERE customer_phone IS NOT NULL 
       GROUP BY customer_phone 
       ORDER BY count DESC`
    );
    allPhones.rows.forEach(row => {
      console.log(`   "${row.customer_phone}" - ${row.count} orders`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
})();

