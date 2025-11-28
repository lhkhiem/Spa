#!/bin/bash
# Script to update image URLs in database
# Run this script manually: bash /var/www/Spa/run-image-url-update.sh

set -e

cd /var/www/Spa

echo "=== Updating Image URLs in Database ==="
echo ""

# Database credentials from .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=spa_cms_user
DB_PASSWORD=spa_cms_password
DB_NAME=spa_cms_db

export PGPASSWORD=$DB_PASSWORD

echo "Connecting to database: $DB_NAME"
echo ""

# Check connection
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Cannot connect to database. Please check credentials."
    exit 1
fi

echo "✅ Database connection OK"
echo ""

# Show current status
echo "Current status:"
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
SELECT 
  'Assets with old URLs' as description,
  COUNT(*) as count
FROM assets 
WHERE url LIKE '%14.225.205.116%' OR url LIKE '%banyco-demo.pressup.vn%'
UNION ALL
SELECT 
  'Assets with new URLs',
  COUNT(*)
FROM assets 
WHERE url LIKE '%api.banyco.vn%' OR url LIKE '%/uploads/%';
"

echo ""
echo "Updating URLs..."
echo ""

# Run update script
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f update-image-urls.sql

echo ""
echo "✅ Update complete!"
echo ""

# Show updated status
echo "Updated status:"
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
SELECT 
  'Assets with old URLs' as description,
  COUNT(*) as count
FROM assets 
WHERE url LIKE '%14.225.205.116%' OR url LIKE '%banyco-demo.pressup.vn%'
UNION ALL
SELECT 
  'Assets with new URLs',
  COUNT(*)
FROM assets 
WHERE url LIKE '%api.banyco.vn%' OR url LIKE '%/uploads/%';
"

echo ""
echo "Next steps:"
echo "1. Restart backend: pm2 restart cms-backend"
echo "2. Clear browser cache"
echo "3. Check images on frontend"

unset PGPASSWORD



