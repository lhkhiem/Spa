#!/bin/bash
# Script to setup SSL for banyco.vn, api.banyco.vn, admin.banyco.vn
# www.banyco.vn will be added later

set -e

echo "=== Setting up SSL certificates for 3 domains ==="
echo ""

# Check DNS from multiple public DNS servers
echo "Checking DNS records from multiple DNS servers..."
echo ""

BANYCO_GOOGLE=$(dig @8.8.8.8 +short banyco.vn | grep -E '^[0-9]' | head -1)
BANYCO_CF=$(dig @1.1.1.1 +short banyco.vn | grep -E '^[0-9]' | head -1)
BANYCO_OPENDNS=$(dig @208.67.222.222 +short banyco.vn | grep -E '^[0-9]' | head -1)

API_GOOGLE=$(dig @8.8.8.8 +short api.banyco.vn | grep -E '^[0-9]' | head -1)
ADMIN_GOOGLE=$(dig @8.8.8.8 +short admin.banyco.vn | grep -E '^[0-9]' | head -1)

echo "banyco.vn:"
echo "  Google DNS (8.8.8.8): ${BANYCO_GOOGLE:-NOT FOUND}"
echo "  Cloudflare DNS (1.1.1.1): ${BANYCO_CF:-NOT FOUND}"
echo "  OpenDNS (208.67.222.222): ${BANYCO_OPENDNS:-NOT FOUND}"
echo ""

echo "api.banyco.vn: ${API_GOOGLE:-NOT FOUND}"
echo "admin.banyco.vn: ${ADMIN_GOOGLE:-NOT FOUND}"
echo ""

# Check if domains are ready (need at least 2 DNS servers to confirm)
BANYCO_READY=false
if [ ! -z "$BANYCO_GOOGLE" ] || [ ! -z "$BANYCO_CF" ] || [ ! -z "$BANYCO_OPENDNS" ]; then
    COUNT=0
    [ ! -z "$BANYCO_GOOGLE" ] && COUNT=$((COUNT+1))
    [ ! -z "$BANYCO_CF" ] && COUNT=$((COUNT+1))
    [ ! -z "$BANYCO_OPENDNS" ] && COUNT=$((COUNT+1))
    
    if [ $COUNT -ge 2 ]; then
        BANYCO_READY=true
        echo "✅ banyco.vn DNS ready (found in $COUNT/3 DNS servers)"
    else
        echo "⚠️  banyco.vn DNS found but only in $COUNT/3 DNS servers (may need to wait)"
    fi
else
    echo "❌ banyco.vn DNS not ready"
fi

if [ -z "$API_GOOGLE" ]; then
    echo "❌ api.banyco.vn DNS not ready"
else
    echo "✅ api.banyco.vn DNS ready"
fi

if [ -z "$ADMIN_GOOGLE" ]; then
    echo "❌ admin.banyco.vn DNS not ready"
else
    echo "✅ admin.banyco.vn DNS ready"
fi

echo ""

# Check if all domains are ready
if [ "$BANYCO_READY" = false ] || [ -z "$API_GOOGLE" ] || [ -z "$ADMIN_GOOGLE" ]; then
    echo "❌ Some DNS records are not ready!"
    echo ""
    if [ "$BANYCO_READY" = false ]; then
        echo "banyco.vn DNS is still propagating. Wait 10-15 minutes and try again."
    fi
    exit 1
fi

# All domains are ready, proceed with SSL setup
echo "✅ All 3 domains are ready!"
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
    echo "✅ SSL certificates installed successfully!"
    echo ""
    echo "You can now access:"
    echo "  - https://banyco.vn"
    echo "  - https://api.banyco.vn"
    echo "  - https://admin.banyco.vn"
    echo ""
    echo "Next step: Add www.banyco.vn"
    echo "1. Add A record for www.banyco.vn in DNS management (www -> 14.225.205.116)"
    echo "2. Wait 10-15 minutes for DNS propagation"
    echo "3. Run: sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand"
    exit 0
else
    echo ""
    echo "❌ SSL setup failed!"
    echo ""
    echo "This might be because:"
    echo "  1. Let's Encrypt servers haven't seen DNS yet (wait 10-15 minutes)"
    echo "  2. Port 80 is not accessible from internet"
    echo ""
    echo "Try again in 10-15 minutes, or setup api and admin first:"
    echo "  sudo ./setup-ssl-api-admin-first.sh"
    exit 1
fi



