// Check products in spa_cms_db database
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'spa_cms_db',
  user: process.env.DB_USER || 'spa_cms_user',
  password: process.env.DB_PASSWORD || 'spa_cms_password',
});

async function checkProducts() {
  try {
    console.log('🔍 Checking products in spa_cms_db...\n');

    // Test connection
    console.log('1. Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    // Check if products table exists
    console.log('2. Checking if products table exists...');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Products table does NOT exist!');
      console.log('   You need to run migrations first.');
      return;
    }
    console.log('✅ Products table exists\n');

    // Count total products
    console.log('3. Counting products...');
    const countResult = await pool.query('SELECT COUNT(*) as total FROM products');
    const totalProducts = parseInt(countResult.rows[0].total);
    console.log(`   Total products: ${totalProducts}\n`);

    // Count by status
    console.log('4. Products by status:');
    const statusCount = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM products 
      GROUP BY status 
      ORDER BY status
    `);
    statusCount.rows.forEach(row => {
      console.log(`   ${row.status}: ${row.count}`);
    });
    console.log('');

    // Check published products
    console.log('5. Published products (visible on frontend):');
    const publishedCount = await pool.query(`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE status = 'published'
    `);
    const publishedTotal = parseInt(publishedCount.rows[0].count);
    console.log(`   Published products: ${publishedTotal}\n`);

    if (publishedTotal > 0) {
      // Show sample published products
      console.log('6. Sample published products (first 5):');
      const sampleProducts = await pool.query(`
        SELECT id, name, slug, price, status, created_at
        FROM products 
        WHERE status = 'published'
        ORDER BY created_at DESC
        LIMIT 5
      `);
      sampleProducts.rows.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.slug}) - $${product.price}`);
      });
      console.log('');
    } else {
      console.log('⚠️  No published products found!');
      console.log('   Products need to have status = "published" to be visible on frontend.\n');
    }

    // Check product categories
    console.log('7. Checking product categories...');
    const categoryCheck = await pool.query(`
      SELECT COUNT(*) as count 
      FROM product_categories
    `);
    const categoryCount = parseInt(categoryCheck.rows[0].count);
    console.log(`   Total categories: ${categoryCount}\n`);

    // Check product-category relationships
    console.log('8. Checking product-category relationships...');
    const relationshipCheck = await pool.query(`
      SELECT COUNT(*) as count 
      FROM product_product_categories
    `);
    const relationshipCount = parseInt(relationshipCheck.rows[0].count);
    console.log(`   Product-category relationships: ${relationshipCount}\n`);

    // Check brands
    console.log('9. Checking brands...');
    const brandCheck = await pool.query(`
      SELECT COUNT(*) as count 
      FROM brands
    `);
    const brandCount = parseInt(brandCheck.rows[0].count);
    console.log(`   Total brands: ${brandCount}\n`);

    // Summary
    console.log('📊 Summary:');
    console.log(`   ✅ Database: Connected`);
    console.log(`   ✅ Products table: Exists`);
    console.log(`   📦 Total products: ${totalProducts}`);
    console.log(`   🌐 Published products: ${publishedTotal}`);
    console.log(`   📁 Categories: ${categoryCount}`);
    console.log(`   🏷️  Brands: ${brandCount}`);
    
    if (publishedTotal === 0) {
      console.log('\n⚠️  WARNING: No published products found!');
      console.log('   To make products visible:');
      console.log('   1. Update product status to "published"');
      console.log('   2. Or run seed script: npm run seed');
    }

  } catch (error) {
    console.error('❌ Error checking products:', error.message);
    if (error.code === '28P01') {
      console.error('   Authentication failed. Check DB_USER and DB_PASSWORD in .env');
    } else if (error.code === '3D000') {
      console.error('   Database does not exist. Create database: spa_cms_db');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   Cannot connect to database. Check DB_HOST and DB_PORT');
    }
  } finally {
    await pool.end();
  }
}

checkProducts();

