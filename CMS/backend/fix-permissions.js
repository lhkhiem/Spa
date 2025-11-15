const { Client } = require('pg');
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD || 'lhkhiem1990';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;
let dbName = process.env.DB_NAME;
if (!dbName && process.env.DATABASE_URL) {
  const urlParts = process.env.DATABASE_URL.split('/');
  dbName = urlParts[urlParts.length - 1]?.split('?')[0];
}
dbName = dbName || 'spa_cms_db' || 'cms_pressup' || 'postgres';
const dbUser = process.env.DB_USER || 'spa_cms_user';

const connectionString = process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const client = new Client({ connectionString });

async function fixPermissions() {
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // First, check what user we're connected as
    const currentUserResult = await client.query('SELECT current_user');
    const currentUser = currentUserResult.rows[0].current_user;
    console.log(`📋 Current database user: ${currentUser}`);
    console.log(`📋 Target user for permissions: ${dbUser}`);
    
    // Grant all permissions on junction tables
    const tables = [
      'education_resource_topics',
      'education_resource_tags'
    ];
    
    for (const table of tables) {
      try {
        // Check if table exists
        const checkTable = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `, [table]);
        
        if (!checkTable.rows[0].exists) {
          console.log(`⚠️  Table ${table} does not exist, skipping...`);
          continue;
        }
        
        // Grant permissions to target user
        await client.query(`GRANT ALL PRIVILEGES ON TABLE ${table} TO ${dbUser}`);
        console.log(`✅ Granted ALL privileges on ${table} to ${dbUser}`);
        
        // Also grant to PUBLIC (all users) as fallback
        try {
          await client.query(`GRANT ALL PRIVILEGES ON TABLE ${table} TO PUBLIC`);
          console.log(`✅ Also granted privileges on ${table} to PUBLIC`);
        } catch (pubError) {
          console.log(`ℹ️  Could not grant to PUBLIC: ${pubError.message}`);
        }
        
      } catch (error) {
        console.error(`❌ Error granting permissions on ${table}:`, error.message);
        if (error.code === '42501') {
          console.error(`   ⚠️  Need superuser privileges. Try running as postgres user.`);
        }
      }
    }
    
    // Also ensure user has permissions on main table
    try {
      await client.query(`GRANT ALL PRIVILEGES ON TABLE education_resources TO ${dbUser}`);
      await client.query(`GRANT ALL PRIVILEGES ON TABLE education_resources TO PUBLIC`);
      console.log(`✅ Granted ALL privileges on education_resources to ${dbUser} and PUBLIC`);
    } catch (error) {
      console.log(`ℹ️  Permissions on education_resources: ${error.message}`);
    }
    
    // Grant on topics and tags tables too
    try {
      await client.query(`GRANT ALL PRIVILEGES ON TABLE topics TO ${dbUser}`);
      await client.query(`GRANT ALL PRIVILEGES ON TABLE topics TO PUBLIC`);
      await client.query(`GRANT ALL PRIVILEGES ON TABLE tags TO ${dbUser}`);
      await client.query(`GRANT ALL PRIVILEGES ON TABLE tags TO PUBLIC`);
      console.log(`✅ Granted privileges on topics and tags tables to ${dbUser} and PUBLIC`);
    } catch (error) {
      console.log(`ℹ️  Permissions on topics/tags: ${error.message}`);
    }
    
    // Grant on addresses table (customer ecommerce)
    try {
      await client.query(`GRANT ALL PRIVILEGES ON TABLE addresses TO ${dbUser}`);
      await client.query(`GRANT ALL PRIVILEGES ON TABLE addresses TO PUBLIC`);
      console.log(`✅ Granted privileges on addresses table to ${dbUser} and PUBLIC`);
    } catch (error) {
      console.log(`ℹ️  Permissions on addresses: ${error.message}`);
    }
    
    // Grant sequence privileges
    try {
      await client.query(`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${dbUser}`);
      await client.query(`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO PUBLIC`);
      console.log(`✅ Granted sequence privileges to ${dbUser} and PUBLIC`);
    } catch (seqError) {
      console.log(`ℹ️  Sequence privileges: ${seqError.message}`);
    }
    
    console.log('\n✅ Permission fix completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === '42501') {
      console.error('⚠️  Insufficient privileges. You may need to run this as a superuser (postgres).');
      console.error('   Try: psql -U postgres -d', dbName, '-f fix-permissions.sql');
    }
  } finally {
    await client.end();
  }
}

fixPermissions();

