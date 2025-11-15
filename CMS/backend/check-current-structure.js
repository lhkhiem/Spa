// Check current database structure
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'spa_cms_db',
  user: process.env.DB_USER || 'spa_cms_user',
  password: process.env.DB_PASSWORD || 'spa_cms_password',
});

async function checkStructure() {
  try {
    console.log('🔍 Checking current database structure...\n');

    // Check product_product_categories columns
    console.log('1. product_product_categories table columns:');
    const columns = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'product_product_categories'
      ORDER BY ordinal_position;
    `);
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    console.log('');

    // Check if product_id column exists
    const hasProductId = columns.rows.some(c => c.column_name === 'product_id');
    const hasGroupId = columns.rows.some(c => c.column_name === 'group_id');

    console.log(`2. Status:`);
    console.log(`   - Has product_id: ${hasProductId ? '✅' : '❌'}`);
    console.log(`   - Has group_id: ${hasGroupId ? '✅' : '❌'}`);
    console.log('');

    // Check products table
    console.log('3. Products table - group_id column:');
    const productCols = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'group_id';
    `);
    if (productCols.rows.length > 0) {
      console.log('   ✅ products.group_id exists');
      
      // Check sample data
      const sample = await pool.query(`
        SELECT id, name, group_id 
        FROM products 
        WHERE group_id IS NOT NULL 
        LIMIT 3
      `);
      console.log('   Sample products with group_id:');
      sample.rows.forEach(row => {
        console.log(`     - ${row.name}: group_id = ${row.group_id}`);
      });
    } else {
      console.log('   ❌ products.group_id does NOT exist');
    }
    console.log('');

    // Check product_groups table
    console.log('4. product_groups table:');
    const groupsTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'product_groups'
      );
    `);
    if (groupsTable.rows[0].exists) {
      const groupCount = await pool.query('SELECT COUNT(*) as count FROM product_groups');
      console.log(`   ✅ Exists (${groupCount.rows[0].count} groups)`);
    } else {
      console.log('   ❌ Does NOT exist');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkStructure();

