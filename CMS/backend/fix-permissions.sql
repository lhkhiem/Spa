-- Fix permissions for education_resource_topics and education_resource_tags tables
-- Run this as postgres superuser: psql -U postgres -d cms_pressup -f fix-permissions.sql
-- Or: psql -U postgres -d cms_db -f fix-permissions.sql

-- Grant permissions on junction tables to PUBLIC (all users)
GRANT ALL PRIVILEGES ON TABLE education_resource_topics TO PUBLIC;
GRANT ALL PRIVILEGES ON TABLE education_resource_tags TO PUBLIC;

-- Grant permissions on main tables to PUBLIC
GRANT ALL PRIVILEGES ON TABLE education_resources TO PUBLIC;
GRANT ALL PRIVILEGES ON TABLE topics TO PUBLIC;
GRANT ALL PRIVILEGES ON TABLE tags TO PUBLIC;
GRANT ALL PRIVILEGES ON TABLE addresses TO PUBLIC;

-- Grant sequence privileges to PUBLIC
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO PUBLIC;

-- Also grant to specific users if they exist
DO $$
BEGIN
    -- Grant to postgres user
    IF EXISTS (SELECT FROM pg_user WHERE usename = 'postgres') THEN
        GRANT ALL PRIVILEGES ON TABLE education_resource_topics TO postgres;
        GRANT ALL PRIVILEGES ON TABLE education_resource_tags TO postgres;
        GRANT ALL PRIVILEGES ON TABLE education_resources TO postgres;
        GRANT ALL PRIVILEGES ON TABLE topics TO postgres;
        GRANT ALL PRIVILEGES ON TABLE tags TO postgres;
        GRANT ALL PRIVILEGES ON TABLE addresses TO postgres;
        RAISE NOTICE 'Granted permissions to postgres user';
    END IF;
    
    -- Grant to cms_user if exists
    IF EXISTS (SELECT FROM pg_user WHERE usename = 'cms_user') THEN
        GRANT ALL PRIVILEGES ON TABLE education_resource_topics TO cms_user;
        GRANT ALL PRIVILEGES ON TABLE education_resource_tags TO cms_user;
        GRANT ALL PRIVILEGES ON TABLE education_resources TO cms_user;
        GRANT ALL PRIVILEGES ON TABLE topics TO cms_user;
        GRANT ALL PRIVILEGES ON TABLE tags TO cms_user;
        GRANT ALL PRIVILEGES ON TABLE addresses TO cms_user;
        RAISE NOTICE 'Granted permissions to cms_user';
    END IF;
END $$;

