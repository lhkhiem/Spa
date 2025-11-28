#!/bin/bash
# Script to setup SSL certificates - Final version
# Uses public DNS servers (what Let's Encrypt uses)

set -e

echo "=== Setting up SSL certificates for banyco.vn domains ==="
echo ""

# Check DNS from public DNS servers (Google and Cloudflare)
# Let's Encrypt uses public DNS, so we check those
echo "Checking DNS records from public DNS servers..."
echo ""

BANYCO_GOOGLE=$(dig @8.8.8.8 +short banyco.vn | grep -E '^[0-9]' | head -1)
BANYCO_CF=$(dig @1.1.1.1 +short banyco.vn | grep -E '^[0-9]' | head -1)
API_GOOGLE=$(dig @8.8.8.8 +short api.banyco.vn | grep -E '^[0-9]' | head -1)
ADMIN_GOOGLE=$(dig @8.8.8.8 +short admin.banyco.vn | grep -E '^[0-9]' | head -1)
WWW_GOOGLE=$(dig @8.8.8.8 +short www.banyco.vn | grep -E '^[0-9]' | head -1)

echo "From Google DNS (8.8.8.8):"
echo "  banyco.vn: ${BANYCO_GOOGLE:-NOT FOUND}"
echo "  www.banyco.vn: ${WWW_GOOGLE:-NOT FOUND}"
echo "  api.banyco.vn: ${API_GOOGLE:-NOT FOUND}"
echo "  admin.banyco.vn: ${ADMIN_GOOGLE:-NOT FOUND}"
echo ""

# Check if all domains are ready from public DNS
ALL_READY=true

if [ -z "$BANYCO_GOOGLE" ] && [ -z "$BANYCO_CF" ]; then
    echo "❌ banyco.vn DNS not ready from public DNS servers"
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

# www.banyco.vn can be CNAME, so check if it resolves
if [ -z "$WWW_GOOGLE" ]; then
    # Check if it's a CNAME that resolves
    WWW_CNAME=$(dig @8.8.8.8 +short www.banyco.vn | head -1)
    if [[ "$WWW_CNAME" == *"banyco.vn"* ]] && ([ ! -z "$BANYCO_GOOGLE" ] || [ ! -z "$BANYCO_CF" ]); then
        echo "✅ www.banyco.vn DNS ready (CNAME to banyco.vn)"
    else
        echo "⚠️  www.banyco.vn DNS not ready (but may work if banyco.vn works)"
    fi
else
    echo "✅ www.banyco.vn DNS ready"
fi

echo ""

if [ "$ALL_READY" = false ]; then
    echo "❌ Some DNS records are not ready from public DNS servers!"
    echo "Please wait 5-30 minutes for DNS propagation, then try again."
    exit 1
fi

# All domains are ready, proceed with SSL setup
echo "✅ All domains are ready from public DNS servers!"
echo "Let's Encrypt should be able to verify these domains."
echo ""
echo "Setting up SSL for: banyco.vn, www.banyco.vn, api.banyco.vn, admin.banyco.vn"
echo ""

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
    echo "✅ SSL certificates installed successfully!"
    echo ""
    echo "You can now access:"
    echo "  - https://banyco.vn"
    echo "  - https://www.banyco.vn"
    echo "  - https://api.banyco.vn"
    echo "  - https://admin.banyco.vn"
    echo ""
    echo "Next steps:"
    echo "1. Update environment variables (see DOMAIN_CONFIG_GUIDE.md)"
    echo "2. Restart services: pm2 restart cms-backend ecommerce-frontend cms-admin"
    exit 0
else
    echo ""
    echo "❌ SSL setup failed!"
    echo ""
    echo "Possible reasons:"
    echo "  1. Let's Encrypt servers haven't seen DNS yet (wait 10-15 minutes)"
    echo "  2. Port 80 is not accessible from internet"
    echo "  3. Nginx configuration issue"
    echo ""
    echo "Try again in 10-15 minutes, or check:"
    echo "  - sudo systemctl status nginx"
    echo "  - sudo netstat -tlnp | grep :80"
    echo "  - sudo ufw status"
    exit 1
fi



