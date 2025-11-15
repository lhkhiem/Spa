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
    
    // Check orders with null customer_phone
    const nullPhoneRes = await client.query(`
      SELECT id, order_number, customer_name, customer_email, customer_phone, shipping_address
      FROM orders 
      WHERE customer_phone IS NULL
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    console.log(`📋 Found ${nullPhoneRes.rows.length} orders with null customer_phone\n`);
    
    // Try to extract phone from shipping_address
    let updatedCount = 0;
    for (const order of nullPhoneRes.rows) {
      let phone = null;
      
      if (order.shipping_address) {
        try {
          const addr = typeof order.shipping_address === 'string' 
            ? JSON.parse(order.shipping_address) 
            : order.shipping_address;
          
          if (addr && addr.phone) {
            phone = addr.phone;
          }
        } catch (e) {
          console.error(`Failed to parse shipping_address for order ${order.id}:`, e.message);
        }
      }
      
      if (phone) {
        await client.query(
          'UPDATE orders SET customer_phone = $1 WHERE id = $2',
          [phone, order.id]
        );
        console.log(`✅ Updated order ${order.order_number}: ${phone}`);
        updatedCount++;
      } else {
        console.log(`⚠️  No phone found for order ${order.order_number}`);
      }
    }
    
    console.log(`\n✅ Updated ${updatedCount} orders with phone from shipping_address`);
    
    // Check final result
    const finalRes = await client.query(`
      SELECT 
        COUNT(*) FILTER (WHERE customer_phone IS NOT NULL) as with_phone,
        COUNT(*) FILTER (WHERE customer_phone IS NULL) as without_phone,
        COUNT(*) as total
      FROM orders
    `);
    
    console.log('\n📊 Final statistics:');
    console.log(JSON.stringify(finalRes.rows[0], null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
})();

