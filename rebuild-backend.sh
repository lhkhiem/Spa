#!/bin/bash

# Script rebuild backend sau khi sửa code
# Chạy: bash rebuild-backend.sh

set -e

echo "=========================================="
echo "  REBUILD BACKEND - PRODUCT FIX"
echo "=========================================="
echo ""

cd /var/www/Spa/CMS/backend

echo "Building TypeScript..."
npm run build

if [ -d "dist" ]; then
    echo "✓ Backend build completed successfully"
    echo ""
    echo "Restarting PM2 services..."
    pm2 restart cms-backend || echo "PM2 service not found, please restart manually"
    echo ""
    echo "✓ Done! Backend has been rebuilt and restarted"
else
    echo "✗ Build failed: dist/ directory not found"
    exit 1
fi
