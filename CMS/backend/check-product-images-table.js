// Check product images table
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'spa_cms_db',
  user: process.env.DB_USER || 'spa_cms_user',
  password: process.env.DB_PASSWORD || 'spa_cms_password',
});

async function checkTable() {
  try {
    console.log('🔍 Checking product images tables...\n');

    // Check all tables with "image" or "product" in name
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND (table_name LIKE '%image%' OR table_name LIKE '%product%')
      ORDER BY table_name;
    `);
    
    console.log('Tables found:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    console.log('');

    // Check product_group_images
    const groupImages = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'product_group_images'
      );
    `);
    
    if (groupImages.rows[0].exists) {
      console.log('✅ product_group_images exists');
      const cols = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'product_group_images'
        ORDER BY ordinal_position;
      `);
      console.log('   Columns:');
      cols.rows.forEach(col => {
        console.log(`     - ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('❌ product_group_images does NOT exist');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTable();

