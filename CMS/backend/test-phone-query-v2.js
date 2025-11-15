const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://spa_cms_user:spa_cms_password@localhost:5432/spa_cms_db',
});

(async () => {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    const testPhone = '0886939879';
    const normalizedPhone = testPhone.replace(/[\s\-\(\)]/g, '');
    const phoneLike = `%${normalizedPhone}%`;

    console.log(`🔍 Testing query with phone: "${testPhone}"`);
    console.log(`📱 Normalized: "${normalizedPhone}"`);
    console.log(`🔎 LIKE pattern: "${phoneLike}"\n`);

    // Test query exactly as in controller
    const query = `
      SELECT 
        o.id,
        o.order_number,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.total,
        o.status,
        o.payment_status,
        o.payment_method,
        o.tracking_number,
        o.shipping_address,
        o.created_at,
        o.shipped_at,
        o.delivered_at
      FROM orders o
      WHERE o.customer_phone IS NOT NULL
        AND (
          o.customer_phone = $1 
          OR o.customer_phone LIKE $2
        )
      ORDER BY o.created_at DESC
      LIMIT 50
    `;

    console.log('1️⃣  Running query with exact match and LIKE...');
    const result = await client.query(query, [testPhone, phoneLike]);
    console.log(`   Found: ${result.rows.length} orders\n`);

    if (result.rows.length > 0) {
      console.log('📋 Orders found:');
      result.rows.forEach((row, index) => {
        const orderPhoneNormalized = row.customer_phone.replace(/[\s\-\(\)]/g, '');
        const matchesExact = row.customer_phone === testPhone;
        const matchesNormalized = orderPhoneNormalized === normalizedPhone;
        
        console.log(`\n   ${index + 1}. Order: ${row.order_number}`);
        console.log(`      Phone: "${row.customer_phone}"`);
        console.log(`      Normalized: "${orderPhoneNormalized}"`);
        console.log(`      Matches exact: ${matchesExact}`);
        console.log(`      Matches normalized: ${matchesNormalized}`);
      });

      // Test filtering in code (as in controller)
      console.log('\n2️⃣  Filtering in code (as in controller)...');
      const filteredOrders = result.rows.filter((order) => {
        if (!order.customer_phone) return false;
        const orderPhoneNormalized = order.customer_phone.replace(/[\s\-\(\)]/g, '');
        return order.customer_phone === testPhone || orderPhoneNormalized === normalizedPhone;
      });
      console.log(`   After filter: ${filteredOrders.length} orders`);
    } else {
      console.log('❌ No orders found\n');
      
      // Check if any orders exist
      const countResult = await client.query('SELECT COUNT(*) FROM orders WHERE customer_phone IS NOT NULL');
      console.log(`📊 Total orders with phone: ${countResult.rows[0].count}`);
      
      // Get all unique phones
      const phonesResult = await client.query(
        `SELECT DISTINCT customer_phone, COUNT(*) as count 
         FROM orders 
         WHERE customer_phone IS NOT NULL 
         GROUP BY customer_phone 
         ORDER BY count DESC 
         LIMIT 10`
      );
      console.log('\n📞 Sample phone numbers in database:');
      phonesResult.rows.forEach(row => {
        console.log(`   "${row.customer_phone}" - ${row.count} orders`);
      });
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    await client.end();
    process.exit(1);
  }
})();

