const fs = require('fs');
const { Client } = require('pg');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const dbPassword = process.env.DB_PASSWORD || 'spa_cms_password';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 5432;
  let dbName = process.env.DB_NAME;
  if (!dbName && process.env.DATABASE_URL) {
    const urlParts = process.env.DATABASE_URL.split('/');
    dbName = urlParts[urlParts.length - 1]?.split('?')[0];
  }
  dbName = dbName || 'spa_cms_db';
  const dbUser = process.env.DB_USER || 'spa_cms_user';

  const connectionString = process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

  const client = new Client({
    connectionString: connectionString
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const migrationPath = path.join(__dirname, 'src/migrations/035_add_customer_phone_to_orders.sql');
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Running migration: 035_add_customer_phone_to_orders.sql');
    console.log('   This will add customer_phone column for phone-based order lookup\n');
    
    await client.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('📋 Changes made:');
    console.log('   - Added customer_phone column to orders table');
    console.log('   - Added index for customer_phone');
    console.log('   - Migrated existing phone numbers from shipping_address');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.detail) {
      console.error('   Detail:', error.detail);
    }
    if (error.code) {
      console.error('   Code:', error.code);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();

