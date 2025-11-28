#!/bin/bash
# Script to rebuild and restart frontend (with ESLint fix)

set -e

echo "=== Rebuilding and Restarting Frontend ==="
echo ""

cd /var/www/Spa/Ecommerce

echo "1. Stopping frontend..."
pm2 stop ecommerce-frontend 2>/dev/null || true
pm2 delete ecommerce-frontend 2>/dev/null || true

echo "2. Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check errors above."
    exit 1
fi

echo ""
echo "3. Starting frontend with PM2..."
pm2 start npm --name "ecommerce-frontend" -- start

echo ""
echo "4. Waiting for frontend to start..."
sleep 5

echo ""
echo "5. Checking status..."
pm2 status ecommerce-frontend

echo ""
echo "6. Testing local connection..."
if curl -s http://127.0.0.1:3000 > /dev/null; then
    echo "✅ Frontend is running on port 3000"
else
    echo "⚠️  Frontend may still be starting, check logs: pm2 logs ecommerce-frontend"
fi

echo ""
echo "✅ Frontend rebuild and restart completed!"
echo ""
echo "Check logs: pm2 logs ecommerce-frontend"



