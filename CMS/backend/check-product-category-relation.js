// Check how products are related to categories
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'spa_cms_db',
  user: process.env.DB_USER || 'spa_cms_user',
  password: process.env.DB_PASSWORD || 'spa_cms_password',
});

async function checkRelation() {
  try {
    console.log('🔍 Checking product-category relationship...\n');

    // Check all tables with "product" in name
    console.log('1. Tables with "product" in name:');
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name LIKE '%product%'
      ORDER BY table_name;
    `);
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    console.log('');

    // Check if there's a product_groups table
    console.log('2. Checking for product_groups table...');
    const groupsTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'product_groups'
      );
    `);
    if (groupsTable.rows[0].exists) {
      console.log('✅ product_groups table exists');
      
      // Get structure
      const groupCols = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'product_groups'
        ORDER BY ordinal_position;
      `);
      console.log('   Columns:');
      groupCols.rows.forEach(col => {
        console.log(`     ${col.column_name} (${col.data_type})`);
      });
      
      // Check sample data
      const sample = await pool.query(`SELECT * FROM product_groups LIMIT 3`);
      if (sample.rows.length > 0) {
        console.log('\n   Sample data:');
        sample.rows.forEach((row, i) => {
          console.log(`     Row ${i + 1}:`, row);
        });
      }
    } else {
      console.log('❌ product_groups table does NOT exist');
    }
    console.log('');

    // Check products table for group_id
    console.log('3. Checking products table for group_id column...');
    const productGroupCol = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'group_id';
    `);
    if (productGroupCol.rows.length > 0) {
      console.log('✅ products.group_id exists');
    } else {
      console.log('❌ products.group_id does NOT exist');
    }

    // Try to understand the relationship
    console.log('\n4. Understanding relationship:');
    const relationQuery = await pool.query(`
      SELECT 
        p.id as product_id,
        p.name as product_name,
        pg.id as group_id,
        pc.id as category_id,
        pc.name as category_name
      FROM products p
      LEFT JOIN product_groups pg ON p.group_id = pg.id
      LEFT JOIN product_product_categories ppc ON pg.id = ppc.group_id
      LEFT JOIN product_categories pc ON ppc.category_id = pc.id
      LIMIT 5;
    `).catch(err => {
      console.log('   Query failed:', err.message);
      return { rows: [] };
    });
    
    if (relationQuery.rows.length > 0) {
      console.log('   Sample relationship:');
      relationQuery.rows.forEach(row => {
        console.log(`     Product: ${row.product_name} -> Group: ${row.group_id} -> Category: ${row.category_name}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkRelation();

