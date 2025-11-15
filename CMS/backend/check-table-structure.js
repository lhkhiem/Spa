// Check table structure for product_product_categories
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'spa_cms_db',
  user: process.env.DB_USER || 'spa_cms_user',
  password: process.env.DB_PASSWORD || 'spa_cms_password',
});

async function checkTableStructure() {
  try {
    console.log('🔍 Checking table structure...\n');

    // Check product_product_categories table
    console.log('1. Checking product_product_categories table...');
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'product_product_categories'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ Table product_product_categories does NOT exist!');
      return;
    }
    console.log('✅ Table exists\n');

    // Get column names
    console.log('2. Column structure:');
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'product_product_categories'
      ORDER BY ordinal_position;
    `);
    
    columns.rows.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type}) - ${col.is_nullable === 'YES' ? 'nullable' : 'NOT NULL'}`);
    });
    console.log('');

    // Check sample data
    console.log('3. Sample data (first 3 rows):');
    const sample = await pool.query(`
      SELECT * FROM product_product_categories LIMIT 3
    `);
    if (sample.rows.length > 0) {
      sample.rows.forEach((row, index) => {
        console.log(`   Row ${index + 1}:`, row);
      });
    } else {
      console.log('   No data found');
    }
    console.log('');

    // Check products table columns
    console.log('4. Products table key columns:');
    const productCols = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name IN ('id', 'name', 'slug', 'status', 'category_id')
      ORDER BY ordinal_position;
    `);
    productCols.rows.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTableStructure();

