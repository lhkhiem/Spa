-- Fix permissions for addresses table
-- Run this as postgres superuser: psql -U postgres -d spa_cms_db -f fix-addresses-permissions.sql

-- Grant permissions on addresses table to PUBLIC (all users)
GRANT ALL PRIVILEGES ON TABLE addresses TO PUBLIC;

-- Grant sequence privileges to PUBLIC (if any sequences are used)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO PUBLIC;

-- Also grant to specific users if they exist
DO $$
BEGIN
    -- Grant to postgres user
    IF EXISTS (SELECT FROM pg_user WHERE usename = 'postgres') THEN
        GRANT ALL PRIVILEGES ON TABLE addresses TO postgres;
        RAISE NOTICE 'Granted permissions to postgres user';
    END IF;
    
    -- Grant to spa_cms_user if exists
    IF EXISTS (SELECT FROM pg_user WHERE usename = 'spa_cms_user') THEN
        GRANT ALL PRIVILEGES ON TABLE addresses TO spa_cms_user;
        RAISE NOTICE 'Granted permissions to spa_cms_user';
    END IF;
END $$;

