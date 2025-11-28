#!/bin/bash

# Script build và restart backend
set -e

echo "=========================================="
echo "  BUILD & RESTART BACKEND"
echo "=========================================="
echo ""

cd /var/www/Spa/CMS/backend

echo "1. Building TypeScript..."
npm run build

if [ ! -d "dist" ]; then
    echo "✗ Build failed: dist/ directory not found"
    exit 1
fi

echo "✓ Build completed successfully"
echo ""

echo "2. Restarting PM2 services..."
pm2 restart cms-backend 2>/dev/null || {
    echo "⚠ PM2 service 'cms-backend' not found, trying to start..."
    pm2 start ecosystem.config.js --only cms-backend 2>/dev/null || {
        echo "⚠ Could not start PM2, please restart manually"
    }
}

echo ""
echo "3. Checking PM2 status..."
pm2 status

echo ""
echo "=========================================="
echo "  BUILD & RESTART COMPLETED"
echo "=========================================="
echo ""
echo "To check logs: pm2 logs cms-backend --lines 50"
