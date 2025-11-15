const fs = require('fs');
const { Client } = require('pg');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Read migration file
    const migrationPath = path.join(__dirname, 'src/migrations/010_menu_system.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Run migration
    await client.query(sql);
    console.log('✅ Migration completed successfully!');
    console.log('📋 Added sample menu with 3 levels:');
    console.log('   Level 1: Home, Products, Blog, About, Contact');
    console.log('   Level 2: Electronics, Clothing, Home & Garden, Sale');
    console.log('   Level 3: Phones, Laptops, Tablets, Accessories, Men, Women, Kids');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();






































