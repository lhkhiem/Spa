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
    
    console.log(`🔍 Testing lookup for phone: ${testPhone}`);
    console.log(`📱 Normalized: ${normalized}\n`);
    
    // Test exact match
    const exactMatch = await client.query(
      'SELECT id, order_number, customer_phone FROM orders WHERE customer_phone = $1',
      [testPhone]
    );
    console.log(`1. Exact match: ${exactMatch.rows.length} orders`);
    
    // Test normalized match
    const normalizedMatch = await client.query(
      `SELECT id, order_number, customer_phone 
       FROM orders 
       WHERE REPLACE(REPLACE(REPLACE(REPLACE(customer_phone, ' ', ''), '-', ''), '(', ''), ')', '') = $1`,
      [normalized]
    );
    console.log(`2. Normalized match: ${normalizedMatch.rows.length} orders`);
    
    // Test LIKE match
    const likeMatch = await client.query(
      'SELECT id, order_number, customer_phone FROM orders WHERE customer_phone LIKE $1',
      [`%${normalized}%`]
    );
    console.log(`3. LIKE match: ${likeMatch.rows.length} orders\n`);
    
    // Show all phone numbers in database
    const allPhones = await client.query(
      'SELECT DISTINCT customer_phone FROM orders WHERE customer_phone IS NOT NULL ORDER BY customer_phone'
    );
    console.log('📞 All phone numbers in database:');
    allPhones.rows.forEach(row => {
      console.log(`   - "${row.customer_phone}"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
})();

