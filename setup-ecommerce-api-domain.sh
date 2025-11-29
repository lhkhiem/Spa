#!/bin/bash
# Script to setup nginx config for ecommerce-api.banyco.vn domain

set -e

echo "=== Setting up nginx config for ecommerce-api.banyco.vn domain ==="

# Copy config file
echo "1. Copying nginx config file..."
sudo cp /var/www/Spa/nginx-ecommerce-api-banyco-vn.conf /etc/nginx/sites-available/ecommerce-api.banyco.vn

# Create symlink
echo "2. Creating symlink..."
sudo ln -sf /etc/nginx/sites-available/ecommerce-api.banyco.vn /etc/nginx/sites-enabled/ecommerce-api.banyco.vn

# Test nginx config
echo "3. Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration test passed!"
    echo ""
    echo "4. Reloading nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully!"
    echo ""
    echo "=== Setup completed ==="
    echo ""
    echo "Next steps:"
    echo "1. Make sure DNS record is pointing to this server:"
    echo "   - A record: ecommerce-api.banyco.vn -> $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
    echo ""
    echo "2. After DNS propagation, setup SSL certificate:"
    echo "   sudo certbot --nginx -d ecommerce-api.banyco.vn"
    echo ""
    echo "3. Update Ecommerce Frontend .env.local:"
    echo "   NEXT_PUBLIC_API_URL=https://ecommerce-api.banyco.vn/api"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi




