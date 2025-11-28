#!/bin/bash
# Script to setup SSL for api and admin first (most reliable)
# Then add banyco.vn later when DNS is ready

set -e

echo "=== Setting up SSL certificates for api.banyco.vn and admin.banyco.vn ==="
echo ""

# Check DNS from multiple public DNS servers
echo "Checking DNS records..."
echo ""

API_GOOGLE=$(dig @8.8.8.8 +short api.banyco.vn | grep -E '^[0-9]' | head -1)
API_CF=$(dig @1.1.1.1 +short api.banyco.vn | grep -E '^[0-9]' | head -1)
ADMIN_GOOGLE=$(dig @8.8.8.8 +short admin.banyco.vn | grep -E '^[0-9]' | head -1)
ADMIN_CF=$(dig @1.1.1.1 +short admin.banyco.vn | grep -E '^[0-9]' | head -1)

echo "api.banyco.vn:"
echo "  Google DNS: ${API_GOOGLE:-NOT FOUND}"
echo "  Cloudflare DNS: ${API_CF:-NOT FOUND}"
echo ""

echo "admin.banyco.vn:"
echo "  Google DNS: ${ADMIN_GOOGLE:-NOT FOUND}"
echo "  Cloudflare DNS: ${ADMIN_CF:-NOT FOUND}"
echo ""

# Check if domains are ready
ALL_READY=true

if [ -z "$API_GOOGLE" ] && [ -z "$API_CF" ]; then
    echo "❌ api.banyco.vn DNS not ready"
    ALL_READY=false
else
    echo "✅ api.banyco.vn DNS ready"
fi

if [ -z "$ADMIN_GOOGLE" ] && [ -z "$ADMIN_CF" ]; then
    echo "❌ admin.banyco.vn DNS not ready"
    ALL_READY=false
else
    echo "✅ admin.banyco.vn DNS ready"
fi

echo ""

if [ "$ALL_READY" = false ]; then
    echo "❌ DNS records are not ready!"
    echo "Please wait for DNS propagation and try again."
    exit 1
fi

# Setup SSL for api and admin
echo "✅ Both domains are ready!"
echo "Setting up SSL for: api.banyco.vn, admin.banyco.vn"
echo ""

sudo certbot --nginx \
  -d api.banyco.vn \
  -d admin.banyco.vn \
  --non-interactive \
  --agree-tos \
  --email sales@banyco.net

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSL certificates installed successfully!"
    echo ""
    echo "You can now access:"
    echo "  - https://api.banyco.vn"
    echo "  - https://admin.banyco.vn"
    echo ""
    echo "Next steps:"
    echo "1. Wait for banyco.vn DNS to propagate (check with: dig @8.8.8.8 banyco.vn)"
    echo "2. When DNS is ready, add banyco.vn to certificate:"
    echo "   sudo certbot --nginx -d banyco.vn --non-interactive --agree-tos --email sales@banyco.net"
    echo ""
    echo "3. After adding www A record, add www to certificate:"
    echo "   sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand"
    exit 0
else
    echo ""
    echo "❌ SSL setup failed!"
    exit 1
fi



