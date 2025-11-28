#!/bin/bash
# Script to add www.banyco.vn to existing SSL certificate

set -e

echo "=== Adding www.banyco.vn to SSL certificate ==="
echo ""

# Check DNS for www.banyco.vn
echo "Checking DNS for www.banyco.vn..."
echo ""

WWW_GOOGLE=$(dig @8.8.8.8 +short www.banyco.vn | grep -E '^[0-9]' | head -1)
WWW_CF=$(dig @1.1.1.1 +short www.banyco.vn | grep -E '^[0-9]' | head -1)

echo "From Google DNS (8.8.8.8): ${WWW_GOOGLE:-NOT FOUND}"
echo "From Cloudflare DNS (1.1.1.1): ${WWW_CF:-NOT FOUND}"
echo ""

if [ -z "$WWW_GOOGLE" ] && [ -z "$WWW_CF" ]; then
    echo "❌ www.banyco.vn DNS not ready!"
    echo ""
    echo "Please:"
    echo "1. Add A record for www.banyco.vn in DNS management:"
    echo "   - NAME: www"
    echo "   - TYPE: A"
    echo "   - CONTENT: 14.225.205.116"
    echo ""
    echo "2. Wait 10-15 minutes for DNS propagation"
    echo ""
    echo "3. Run this script again"
    exit 1
fi

echo "✅ www.banyco.vn DNS ready!"
echo ""
echo "Adding www.banyco.vn to existing certificate..."
echo ""

sudo certbot --nginx \
  -d banyco.vn \
  -d www.banyco.vn \
  --expand \
  --non-interactive \
  --agree-tos \
  --email sales@banyco.net

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ www.banyco.vn added to certificate successfully!"
    echo ""
    echo "You can now access:"
    echo "  - https://banyco.vn"
    echo "  - https://www.banyco.vn"
    echo "  - https://api.banyco.vn"
    echo "  - https://admin.banyco.vn"
    exit 0
else
    echo ""
    echo "❌ Failed to add www.banyco.vn!"
    echo "Make sure DNS is propagated and try again."
    exit 1
fi



