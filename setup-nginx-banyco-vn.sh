#!/bin/bash
# Script to setup nginx configs for banyco.vn domains

set -e

echo "=== Setting up nginx configs for banyco.vn domains ==="

# Copy config files
echo "1. Copying nginx config files..."
sudo cp /var/www/Spa/nginx-banyco-vn.conf /etc/nginx/sites-available/banyco.vn
sudo cp /var/www/Spa/nginx-api-banyco-vn.conf /etc/nginx/sites-available/api.banyco.vn
sudo cp /var/www/Spa/nginx-admin-banyco-vn.conf /etc/nginx/sites-available/admin.banyco.vn

# Create symlinks
echo "2. Creating symlinks..."
sudo ln -sf /etc/nginx/sites-available/banyco.vn /etc/nginx/sites-enabled/banyco.vn
sudo ln -sf /etc/nginx/sites-available/api.banyco.vn /etc/nginx/sites-enabled/api.banyco.vn
sudo ln -sf /etc/nginx/sites-available/admin.banyco.vn /etc/nginx/sites-enabled/admin.banyco.vn

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
    echo "1. Make sure DNS records are pointing to this server:"
    echo "   - A record: banyco.vn -> $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
    echo "   - A record: www.banyco.vn -> $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
    echo "   - A record: api.banyco.vn -> $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
    echo "   - A record: admin.banyco.vn -> $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
    echo ""
    echo "2. After DNS propagation, setup SSL certificates:"
    echo "   sudo certbot --nginx -d banyco.vn -d www.banyco.vn -d api.banyco.vn -d admin.banyco.vn"
    echo ""
    echo "3. Update environment variables:"
    echo "   - Backend .env: FRONTEND_DOMAIN=banyco.vn, API_DOMAIN=api.banyco.vn, ADMIN_DOMAIN=admin.banyco.vn"
    echo "   - Frontend .env.local: NEXT_PUBLIC_API_URL=https://api.banyco.vn/api"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi



