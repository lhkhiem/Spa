#!/bin/bash
# Script to setup SSL certificates without www first
# Then add www later

set -e

echo "=== Setting up SSL certificates for banyco.vn domains (without www) ==="
echo ""

# Check DNS from public DNS servers
echo "Checking DNS records from public DNS servers..."
echo ""

BANYCO_GOOGLE=$(dig @8.8.8.8 +short banyco.vn | grep -E '^[0-9]' | head -1)
API_GOOGLE=$(dig @8.8.8.8 +short api.banyco.vn | grep -E '^[0-9]' | head -1)
ADMIN_GOOGLE=$(dig @8.8.8.8 +short admin.banyco.vn | grep -E '^[0-9]' | head -1)

echo "From Google DNS (8.8.8.8):"
echo "  banyco.vn: ${BANYCO_GOOGLE:-NOT FOUND}"
echo "  api.banyco.vn: ${API_GOOGLE:-NOT FOUND}"
echo "  admin.banyco.vn: ${ADMIN_GOOGLE:-NOT FOUND}"
echo ""

# Check if domains are ready
ALL_READY=true

if [ -z "$BANYCO_GOOGLE" ]; then
    echo "❌ banyco.vn DNS not ready"
    ALL_READY=false
else
    echo "✅ banyco.vn DNS ready"
fi

if [ -z "$API_GOOGLE" ]; then
    echo "❌ api.banyco.vn DNS not ready"
    ALL_READY=false
else
    echo "✅ api.banyco.vn DNS ready"
fi

if [ -z "$ADMIN_GOOGLE" ]; then
    echo "❌ admin.banyco.vn DNS not ready"
    ALL_READY=false
else
    echo "✅ admin.banyco.vn DNS ready"
fi

echo ""

if [ "$ALL_READY" = false ]; then
    echo "❌ Some DNS records are not ready!"
    exit 1
fi

# Setup SSL for 3 domains first (without www)
echo "✅ All domains are ready!"
echo "Setting up SSL for: banyco.vn, api.banyco.vn, admin.banyco.vn"
echo ""

sudo certbot --nginx \
  -d banyco.vn \
  -d api.banyco.vn \
  -d admin.banyco.vn \
  --non-interactive \
  --agree-tos \
  --email sales@banyco.net

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSL certificates installed successfully for 3 domains!"
    echo ""
    echo "Next: Add www.banyco.vn to the certificate"
    echo ""
    echo "Option 1: Add A record for www.banyco.vn (recommended)"
    echo "  - Go to DNS management"
    echo "  - Add A record: www -> 14.225.205.116"
    echo "  - Wait 10-15 minutes for DNS propagation"
    echo "  - Then run: sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand"
    echo ""
    echo "Option 2: Try adding www now (if CNAME resolves correctly)"
    echo "  Run: sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand"
    echo ""
    echo "You can now access:"
    echo "  - https://banyco.vn"
    echo "  - https://api.banyco.vn"
    echo "  - https://admin.banyco.vn"
    exit 0
else
    echo ""
    echo "❌ SSL setup failed!"
    exit 1
fi



