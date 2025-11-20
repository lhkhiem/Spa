#!/bin/bash

echo "=== Nginx Configuration Deployment Script ==="
echo ""
echo "This script will update Nginx configuration for banyco-demo.pressup.vn"
echo ""

CONFIG_FILE="/var/www/Spa/nginx-banyco-demo.conf"
NGINX_AVAILABLE="/etc/nginx/sites-available/banyco-demo.pressup.vn"
NGINX_ENABLED="/etc/nginx/sites-enabled/banyco-demo.pressup.vn"

echo "Step 1: Copy config to Nginx sites-available"
echo "Run: sudo cp $CONFIG_FILE $NGINX_AVAILABLE"
echo ""

echo "Step 2: Enable site (if not already enabled)"
echo "Run: sudo ln -sf $NGINX_AVAILABLE $NGINX_ENABLED"
echo ""

echo "Step 3: Test Nginx configuration"
echo "Run: sudo nginx -t"
echo ""

echo "Step 4: Reload Nginx"
echo "Run: sudo systemctl reload nginx"
echo ""

echo "Step 5: Check status"
echo "Run: sudo systemctl status nginx"
echo ""

echo "=== Full command sequence: ==="
echo ""
cat << 'CMD'
sudo cp /var/www/Spa/nginx-banyco-demo.conf /etc/nginx/sites-available/banyco-demo.pressup.vn
sudo ln -sf /etc/nginx/sites-available/banyco-demo.pressup.vn /etc/nginx/sites-enabled/banyco-demo.pressup.vn
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx
CMD

echo ""
echo "After deployment, test:"
echo "- Frontend: http://banyco-demo.pressup.vn"
echo "- API Health: http://banyco-demo.pressup.vn/api/health"
echo "- CMS Admin: http://localhost:3013 (or setup subdomain)"

