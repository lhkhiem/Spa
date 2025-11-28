#!/bin/bash
# Script to setup SSL certificates - Fixed version
# Setup SSL for domains that have DNS records ready

set -e

echo "=== Setting up SSL certificates for banyco.vn domains ==="
echo ""

# Check DNS
echo "Checking DNS records..."
BANYCO_IP=$(dig +short banyco.vn | grep -E '^[0-9]' | head -1)
API_IP=$(dig +short api.banyco.vn | grep -E '^[0-9]' | head -1)
ADMIN_IP=$(dig +short admin.banyco.vn | grep -E '^[0-9]' | head -1)
WWW_IP=$(dig +short www.banyco.vn | grep -E '^[0-9]' | head -1)

echo "banyco.vn: ${BANYCO_IP:-NOT FOUND}"
echo "api.banyco.vn: ${API_IP:-NOT FOUND}"
echo "admin.banyco.vn: ${ADMIN_IP:-NOT FOUND}"
echo "www.banyco.vn: ${WWW_IP:-NOT FOUND}"
echo ""

# Check which domains are ready
READY_DOMAINS=()
if [ ! -z "$API_IP" ]; then
    READY_DOMAINS+=("api.banyco.vn")
fi
if [ ! -z "$ADMIN_IP" ]; then
    READY_DOMAINS+=("admin.banyco.vn")
fi
if [ ! -z "$BANYCO_IP" ]; then
    READY_DOMAINS+=("banyco.vn")
    if [ ! -z "$WWW_IP" ]; then
        READY_DOMAINS+=("www.banyco.vn")
    fi
fi

if [ ${#READY_DOMAINS[@]} -eq 0 ]; then
    echo "❌ No domains have DNS records ready!"
    echo "Please add DNS A records first:"
    echo "  - banyco.vn -> 14.225.205.116"
    echo "  - api.banyco.vn -> 14.225.205.116"
    echo "  - admin.banyco.vn -> 14.225.205.116"
    echo "  - www.banyco.vn -> 14.225.205.116 (or CNAME to banyco.vn)"
    exit 1
fi

echo "✅ Domains ready for SSL: ${READY_DOMAINS[*]}"
echo ""

# Build certbot command
CERTBOT_CMD="sudo certbot --nginx"
for domain in "${READY_DOMAINS[@]}"; do
    CERTBOT_CMD="$CERTBOT_CMD -d $domain"
done
CERTBOT_CMD="$CERTBOT_CMD --non-interactive --agree-tos --email sales@banyco.net"

echo "Running: $CERTBOT_CMD"
echo ""

# Execute
eval $CERTBOT_CMD

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSL certificates installed successfully!"
    echo ""
    
    # Check which domains are missing
    MISSING_DOMAINS=()
    if [ -z "$BANYCO_IP" ]; then
        MISSING_DOMAINS+=("banyco.vn")
    fi
    if [ -z "$WWW_IP" ] && [ ! -z "$BANYCO_IP" ]; then
        MISSING_DOMAINS+=("www.banyco.vn")
    fi
    
    if [ ${#MISSING_DOMAINS[@]} -gt 0 ]; then
        echo "⚠️  Missing DNS records for: ${MISSING_DOMAINS[*]}"
        echo "After adding DNS records and waiting for propagation, run:"
        echo "  sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand"
    fi
else
    echo "❌ SSL setup failed!"
    exit 1
fi



