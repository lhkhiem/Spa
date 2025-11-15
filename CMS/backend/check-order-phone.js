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
    
    const res = await client.query(`
      SELECT 
        id, 
        order_number, 
        customer_name, 
        customer_email, 
        customer_phone,
        created_at
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('📋 Recent orders:');
    console.log(JSON.stringify(res.rows, null, 2));
    
    // Check if customer_phone column exists
    const colCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'customer_phone'
    `);
    
    if (colCheck.rows.length === 0) {
      console.log('\n⚠️  WARNING: customer_phone column does not exist!');
    } else {
      console.log('\n✅ customer_phone column exists');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
})();

