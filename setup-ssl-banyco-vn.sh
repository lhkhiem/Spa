#!/bin/bash
# Script to setup SSL certificates for banyco.vn domains

set -e

echo "=== Setting up SSL certificates for banyco.vn domains ==="
echo ""

# Check DNS first
echo "Checking DNS records..."
echo "banyco.vn: $(dig +short banyco.vn | head -1)"
echo "api.banyco.vn: $(dig +short api.banyco.vn | head -1)"
echo "admin.banyco.vn: $(dig +short admin.banyco.vn | head -1)"
echo "www.banyco.vn: $(dig +short www.banyco.vn | head -1)"
echo ""

# Option 1: Setup SSL for 3 domains first (without www)
echo "Option 1: Setup SSL for banyco.vn, api.banyco.vn, admin.banyco.vn (without www)"
echo "This will work if www.banyco.vn DNS is not ready yet."
echo ""
read -p "Continue with Option 1? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Setting up SSL for 3 domains..."
    sudo certbot --nginx \
      -d banyco.vn \
      -d api.banyco.vn \
      -d admin.banyco.vn \
      --non-interactive \
      --agree-tos \
      --email sales@banyco.net
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SSL certificates installed successfully!"
        echo ""
        echo "To add www.banyco.vn later, run:"
        echo "sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand"
        exit 0
    else
        echo "❌ SSL setup failed!"
        exit 1
    fi
fi

# Option 2: Try with www (if DNS is ready)
echo ""
echo "Option 2: Setup SSL for all 4 domains (including www.banyco.vn)"
echo "Make sure www.banyco.vn DNS record exists and has propagated."
echo ""
read -p "Continue with Option 2? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Setting up SSL for all 4 domains..."
    sudo certbot --nginx \
      -d banyco.vn \
      -d www.banyco.vn \
      -d api.banyco.vn \
      -d admin.banyco.vn \
      --non-interactive \
      --agree-tos \
      --email sales@banyco.net
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SSL certificates installed successfully for all domains!"
        exit 0
    else
        echo "❌ SSL setup failed! Try Option 1 instead."
        exit 1
    fi
fi

echo "Setup cancelled."



