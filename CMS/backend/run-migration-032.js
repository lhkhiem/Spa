const fs = require('fs');
const { Client } = require('pg');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  // Get database connection from env or use provided password
  const dbPassword = process.env.DB_PASSWORD || 'lhkhiem1990';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 5432;
  // Try to get database name from DATABASE_URL or use common names
  let dbName = process.env.DB_NAME;
  if (!dbName && process.env.DATABASE_URL) {
    const urlParts = process.env.DATABASE_URL.split('/');
    dbName = urlParts[urlParts.length - 1]?.split('?')[0];
  }
  dbName = dbName || 'cms_db' || 'cms_pressup' || 'postgres';
  const dbUser = process.env.DB_USER || 'postgres';

  // Build connection string
  const connectionString = process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

  const client = new Client({
    connectionString: connectionString
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read migration file
    const migrationPath = path.join(__dirname, 'src/migrations/032_education_resources_topics_tags.sql');
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Running migration: 032_education_resources_topics_tags.sql');
    
    // Run migration
    await client.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('📋 Created junction tables:');
    console.log('   - education_resource_topics');
    console.log('   - education_resource_tags');
    console.log('   - Added indexes for better performance');

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

