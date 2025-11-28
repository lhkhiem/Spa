#!/bin/bash
set -e

echo "=========================================="
echo "  AUTO BUILD & RESTART"
echo "=========================================="
echo ""

cd /var/www/Spa/CMS/backend

echo "1. Building TypeScript..."
npm run build

if [ ! -d "dist" ]; then
    echo "✗ Build failed: dist/ directory not found"
    exit 1
fi

echo "✓ Build completed"
echo ""

echo "2. Restarting PM2..."
pm2 restart cms-backend

echo ""
echo "3. Waiting for service to start..."
sleep 3

echo ""
echo "4. Checking PM2 status..."
pm2 status | grep cms-backend

echo ""
echo "=========================================="
echo "  BUILD & RESTART COMPLETED"
echo "=========================================="
echo ""
echo "Check logs: pm2 logs cms-backend --lines 30"
