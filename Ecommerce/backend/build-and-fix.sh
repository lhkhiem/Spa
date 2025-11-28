#!/bin/bash
set -e

echo "=========================================="
echo "  BUILD & FIX - PRODUCT & SEO"
echo "=========================================="
echo ""

cd /var/www/Spa/CMS/backend

echo "1. Building TypeScript..."
npm run build

if [ ! -d "dist" ]; then
    echo "✗ Build failed"
    exit 1
fi

echo "✓ Build completed"
echo ""

echo "2. Restarting PM2..."
pm2 restart cms-backend

echo ""
echo "3. Waiting 3 seconds..."
sleep 3

echo ""
echo "4. PM2 Status:"
pm2 status | grep cms-backend

echo ""
echo "=========================================="
echo "  COMPLETED"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Check SEO: node check-seo.js"
echo "  2. Test duplicate product"
echo "  3. Check logs: pm2 logs cms-backend | grep -E 'duplicateProduct|syncProductMetadata'"
