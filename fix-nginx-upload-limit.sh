#!/bin/bash

# Script to fix nginx upload limit for admin.banyco-demo.pressup.vn

NGINX_CONFIG="/etc/nginx/sites-available/admin.banyco-demo.pressup.vn"
TEMPLATE_FILE="/var/www/Spa/nginx-cms-admin-https.conf"

echo "=== Fixing Nginx Upload Limit ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run this script with sudo:"
    echo "  sudo bash /var/www/Spa/fix-nginx-upload-limit.sh"
    exit 1
fi

# Backup current config
if [ -f "$NGINX_CONFIG" ]; then
    BACKUP_FILE="${NGINX_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$NGINX_CONFIG" "$BACKUP_FILE"
    echo "✓ Backed up current config to: $BACKUP_FILE"
fi

# Copy template to nginx config
if [ -f "$TEMPLATE_FILE" ]; then
    cp "$TEMPLATE_FILE" "$NGINX_CONFIG"
    echo "✓ Updated nginx config from template"
else
    echo "✗ Template file not found: $TEMPLATE_FILE"
    exit 1
fi

# Test nginx config
echo ""
echo "Testing nginx configuration..."
if nginx -t; then
    echo "✓ Nginx configuration is valid"
    
    # Reload nginx
    echo ""
    echo "Reloading nginx..."
    if systemctl reload nginx; then
        echo "✓ Nginx reloaded successfully"
        echo ""
        echo "=== Done ==="
        echo "Upload limit has been increased to 100MB"
    else
        echo "✗ Failed to reload nginx"
        echo "Restoring backup..."
        if [ -f "$BACKUP_FILE" ]; then
            cp "$BACKUP_FILE" "$NGINX_CONFIG"
            systemctl reload nginx
            echo "✓ Backup restored"
        fi
        exit 1
    fi
else
    echo "✗ Nginx configuration test failed"
    echo "Restoring backup..."
    if [ -f "$BACKUP_FILE" ]; then
        cp "$BACKUP_FILE" "$NGINX_CONFIG"
        echo "✓ Backup restored"
    fi
    exit 1
fi


