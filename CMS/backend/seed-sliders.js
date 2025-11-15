const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cms_db',
  user: process.env.DB_USER || 'cms_user',
  password: process.env.DB_PASSWORD || 'cms_password'
});

async function seedSliders() {
  try {
    console.log('Starting slider seed...');
    
    const sqlPath = path.join(__dirname, 'src/migrations/seed-sliders.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    console.log('✅ Seed completed');
    
    // Get all sliders
    const result = await pool.query(`
      SELECT id, title, description, button_text, button_link, image_url, order_index, is_active 
      FROM sliders 
      ORDER BY order_index
    `);
    
    console.log('\n📊 Sliders in database:');
    result.rows.forEach((slider, index) => {
      console.log(`${index + 1}. ${slider.title}`);
      console.log(`   Description: ${slider.description || 'N/A'}`);
      console.log(`   Button: ${slider.button_text || 'N/A'} -> ${slider.button_link || 'N/A'}`);
      console.log(`   Image: ${slider.image_url || 'No image'}`);
      console.log(`   Order: ${slider.order_index}, Active: ${slider.is_active}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error seeding sliders:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

seedSliders();




