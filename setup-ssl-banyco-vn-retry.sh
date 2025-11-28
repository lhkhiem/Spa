#!/bin/bash
# Script to setup SSL certificates - Retry with all domains
# DNS records are now ready

set -e

echo "=== Setting up SSL certificates for banyco.vn domains ==="
echo ""

# Check DNS from multiple sources
echo "Checking DNS records from different DNS servers..."
echo ""

echo "From Google DNS (8.8.8.8):"
BANYCO_GOOGLE=$(dig @8.8.8.8 +short banyco.vn | grep -E '^[0-9]' | head -1)
echo "  banyco.vn: ${BANYCO_GOOGLE:-NOT FOUND}"

echo "From Cloudflare DNS (1.1.1.1):"
BANYCO_CF=$(dig @1.1.1.1 +short banyco.vn | grep -E '^[0-9]' | head -1)
echo "  banyco.vn: ${BANYCO_CF:-NOT FOUND}"

echo ""
echo "Local DNS:"
BANYCO_LOCAL=$(dig +short banyco.vn | grep -E '^[0-9]' | head -1)
API_LOCAL=$(dig +short api.banyco.vn | grep -E '^[0-9]' | head -1)
ADMIN_LOCAL=$(dig +short admin.banyco.vn | grep -E '^[0-9]' | head -1)
WWW_LOCAL=$(dig +short www.banyco.vn | grep -E '^[0-9]' | head -1)

echo "  banyco.vn: ${BANYCO_LOCAL:-NOT FOUND}"
echo "  www.banyco.vn: ${WWW_LOCAL:-NOT FOUND}"
echo "  api.banyco.vn: ${API_LOCAL:-NOT FOUND}"
echo "  admin.banyco.vn: ${ADMIN_LOCAL:-NOT FOUND}"
echo ""

# Check if DNS is ready from public DNS servers (more reliable than local)
# Let's Encrypt uses public DNS servers, so we check those
ALL_READY=true

# Check banyco.vn from public DNS
if [ -z "$BANYCO_GOOGLE" ] && [ -z "$BANYCO_CF" ]; then
    echo "⚠️  banyco.vn DNS not ready from public DNS servers"
    ALL_READY=false
else
    echo "✅ banyco.vn DNS ready from public DNS servers"
fi

# Check other domains (use local DNS as fallback, but prefer public)
if [ -z "$API_LOCAL" ]; then
    API_PUBLIC=$(dig @8.8.8.8 +short api.banyco.vn | grep -E '^[0-9]' | head -1)
    if [ -z "$API_PUBLIC" ]; then
        echo "⚠️  api.banyco.vn DNS not ready"
        ALL_READY=false
    else
        echo "✅ api.banyco.vn DNS ready"
    fi
else
    echo "✅ api.banyco.vn DNS ready"
fi

if [ -z "$ADMIN_LOCAL" ]; then
    ADMIN_PUBLIC=$(dig @8.8.8.8 +short admin.banyco.vn | grep -E '^[0-9]' | head -1)
    if [ -z "$ADMIN_PUBLIC" ]; then
        echo "⚠️  admin.banyco.vn DNS not ready"
        ALL_READY=false
    else
        echo "✅ admin.banyco.vn DNS ready"
    fi
else
    echo "✅ admin.banyco.vn DNS ready"
fi

if [ "$ALL_READY" = false ]; then
    echo ""
    echo "❌ Some DNS records are not ready yet!"
    echo "Please wait 5-30 minutes for DNS propagation, then try again."
    exit 1
fi

# If DNS is ready from public DNS servers, proceed
# Let's Encrypt uses public DNS, so this is what matters
if [ ! -z "$BANYCO_GOOGLE" ] || [ ! -z "$BANYCO_CF" ]; then
    echo "✅ DNS records are propagating. Attempting SSL setup..."
    echo ""
    
    # Try setup SSL for all 4 domains
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
        exit 0
    else
        echo ""
        echo "❌ SSL setup failed!"
        echo ""
        echo "This might be because:"
        echo "  1. DNS hasn't fully propagated to Let's Encrypt servers yet"
        echo "  2. Port 80 is not accessible from internet"
        echo "  3. Nginx configuration issue"
        echo ""
        echo "Try again in 10-15 minutes, or setup SSL for individual domains:"
        echo "  sudo certbot --nginx -d api.banyco.vn -d admin.banyco.vn"
        exit 1
    fi
else
    echo "❌ DNS not ready from public DNS servers yet."
    echo "Please wait for DNS propagation (5-30 minutes) and try again."
    exit 1
fi

