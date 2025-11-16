const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'spa_cms_db';
const dbUser = process.env.DB_USER || 'spa_cms_user';
const dbPassword = process.env.DB_PASSWORD || 'spa_cms_password';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);

const pool = new Pool({
  host: dbHost,
  port: dbPort,
  database: dbName,
  user: dbUser,
  password: dbPassword,
});

async function runMigration() {
  try {
    await pool.connect();
    console.log(`✅ Connected to database: ${dbName}`);

    const sqlPath = path.join(__dirname, 'src/migrations/036_add_zalopay_fields_to_orders.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('\n📄 Running migration: 036_add_zalopay_fields_to_orders.sql');
    await pool.query(sql);

    console.log('✅ Migration completed successfully!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();





