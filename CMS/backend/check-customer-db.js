// Check if database is ready for customer ecommerce
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cms_db',
  user: process.env.DB_USER || 'cms_user',
  password: process.env.DB_PASSWORD || 'cms_password',
});

async function checkDatabase() {
  try {
    console.log('🔍 Checking database for customer ecommerce...\n');

    // Check required tables
    const requiredTables = [
      'users',
      'addresses',
      'orders',
      'order_items',
      'cart_items',
      'wishlist_items',
      'products',
    ];

    const results = {};

    for (const table of requiredTables) {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [table]);
      
      results[table] = result.rows[0].exists;
      console.log(`${results[table] ? '✅' : '❌'} ${table}: ${results[table] ? 'EXISTS' : 'MISSING'}`);
    }

    // Check users table columns
    console.log('\n📋 Checking users table columns...');
    const userColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    const userColumnNames = userColumns.rows.map(r => r.column_name);
    console.log('Current columns:', userColumnNames.join(', '));
    
    const requiredUserColumns = ['id', 'email', 'password_hash', 'name', 'role', 'status'];
    const optionalUserColumns = ['first_name', 'last_name', 'phone', 'avatar'];
    
    console.log('\nRequired columns:');
    requiredUserColumns.forEach(col => {
      const exists = userColumnNames.includes(col);
      console.log(`  ${exists ? '✅' : '❌'} ${col}`);
    });
    
    console.log('\nOptional columns (for customer profile):');
    optionalUserColumns.forEach(col => {
      const exists = userColumnNames.includes(col);
      console.log(`  ${exists ? '✅' : '❌'} ${col}`);
    });

    // Check addresses table structure if exists
    if (results.addresses) {
      console.log('\n📋 Checking addresses table columns...');
      const addressColumns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'addresses' 
        ORDER BY ordinal_position;
      `);
      console.log('Columns:', addressColumns.rows.map(r => r.column_name).join(', '));
    }

    // Summary
    console.log('\n📊 Summary:');
    const missingTables = requiredTables.filter(t => !results[t]);
    if (missingTables.length === 0) {
      console.log('✅ All required tables exist!');
    } else {
      console.log(`❌ Missing tables: ${missingTables.join(', ')}`);
    }

    const missingUserColumns = optionalUserColumns.filter(col => !userColumnNames.includes(col));
    if (missingUserColumns.length > 0) {
      console.log(`⚠️  Missing optional user columns: ${missingUserColumns.join(', ')}`);
      console.log('   (These are recommended for customer profile management)');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();

