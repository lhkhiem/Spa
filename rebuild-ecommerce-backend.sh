#!/bin/bash

echo "=== Rebuilding Ecommerce Backend ==="
cd /var/www/Spa/Ecommerce/backend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    pm2 restart ecommerce-backend
    echo "✅ Restarted ecommerce-backend"
else
    echo "❌ Build failed"
    exit 1
fi


