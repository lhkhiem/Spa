#!/bin/bash
# Script to update image URLs in database from old domain to new domain

set -e

echo "=== Updating Image URLs in Database ==="
echo ""

cd /var/www/Spa/CMS/backend

# Get database connection string
if [ -f .env ]; then
    source .env
    DB_URL="${DATABASE_URL:-postgresql://${DB_USER:-postgres}:${DB_PASSWORD}@${DB_HOST:-localhost}:${DB_PORT:-5432}/${DB_NAME:-cms}}"
else
    echo "❌ .env file not found"
    exit 1
fi

echo "Connecting to database..."
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql not found. Installing postgresql-client..."
    sudo apt-get update && sudo apt-get install -y postgresql-client
fi

# Run SQL script
echo "Updating image URLs..."
psql "$DB_URL" -f /var/www/Spa/update-image-urls.sql

echo ""
echo "✅ Image URLs updated!"
echo ""
echo "Summary:"
psql "$DB_URL" -c "
SELECT 
  'Assets' as table_name, 
  COUNT(*) FILTER (WHERE url LIKE '%api.banyco.vn%' OR url LIKE '%/uploads/%') as updated_count,
  COUNT(*) as total_count
FROM assets
UNION ALL
SELECT 
  'Education Resources', 
  COUNT(*) FILTER (WHERE image_url LIKE '%api.banyco.vn%' OR image_url LIKE '%/uploads/%'),
  COUNT(*)
FROM education_resources
UNION ALL
SELECT 
  'About Sections', 
  COUNT(*) FILTER (WHERE image_url LIKE '%api.banyco.vn%' OR image_url LIKE '%/uploads/%'),
  COUNT(*)
FROM about_sections;
"

echo ""
echo "Next steps:"
echo "1. Restart backend: pm2 restart cms-backend"
echo "2. Clear browser cache"
echo "3. Check images on frontend"



