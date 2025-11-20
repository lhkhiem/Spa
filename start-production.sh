#!/bin/bash

# Script để start production mode với PM2
# Chạy: bash start-production.sh

set -e

echo "=========================================="
echo "  START PRODUCTION MODE"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if builds exist
if [ ! -d "/var/www/Spa/CMS/backend/dist" ]; then
    print_warning "Backend not built. Run: bash build-production.sh"
    exit 1
fi

if [ ! -d "/var/www/Spa/Ecommerce/.next" ]; then
    print_warning "Ecommerce not built. Run: bash build-production.sh"
    exit 1
fi

if [ ! -d "/var/www/Spa/CMS/frontend/admin/.next" ]; then
    print_warning "CMS Admin not built. Run: bash build-production.sh"
    exit 1
fi

# Stop existing processes
echo "Stopping existing processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Start Backend
echo ""
echo "Starting CMS Backend..."
cd /var/www/Spa/CMS/backend
pm2 start npm --name "cms-backend" -- start
print_status "Backend started on port 3011"

# Start Ecommerce Frontend
echo ""
echo "Starting Ecommerce Frontend..."
cd /var/www/Spa/Ecommerce
pm2 start npm --name "ecommerce-frontend" -- start
print_status "Ecommerce started on port 3000"

# Start CMS Admin Frontend
echo ""
echo "Starting CMS Admin Frontend..."
cd /var/www/Spa/CMS/frontend/admin
pm2 start npm --name "cms-admin" -- start
print_status "CMS Admin started on port 3013"

# Save PM2 configuration
pm2 save

echo ""
echo "=========================================="
echo "  PRODUCTION MODE STARTED!"
echo "=========================================="
echo ""
pm2 status
echo ""
echo "View logs: pm2 logs"
echo "Restart: pm2 restart all"
echo "Stop: pm2 stop all"

