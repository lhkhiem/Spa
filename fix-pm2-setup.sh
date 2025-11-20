#!/bin/bash

# Script để sửa lại cấu hình PM2 với tên rõ ràng
# Chạy: bash fix-pm2-setup.sh

set -e

echo "=========================================="
echo "  SỬA LẠI CẤU HÌNH PM2"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Kiểm tra xem có đang chạy dev mode không
echo "Kiểm tra processes hiện tại..."
pm2 list

echo ""
read -p "Bạn có muốn chuyển sang production mode? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Hủy bỏ."
    exit 0
fi

# Kiểm tra build
if [ ! -d "/var/www/Spa/CMS/backend/dist" ]; then
    print_warning "Backend chưa được build. Bạn có muốn build không? (y/n)"
    read -p "" -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Đang build backend..."
        cd /var/www/Spa/CMS/backend
        npm run build
    else
        print_error "Cần build backend trước khi chạy production mode"
        exit 1
    fi
fi

if [ ! -d "/var/www/Spa/Ecommerce/.next" ]; then
    print_warning "Ecommerce chưa được build. Bạn có muốn build không? (y/n)"
    read -p "" -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Đang build Ecommerce..."
        cd /var/www/Spa/Ecommerce
        NODE_ENV=production npm run build
    else
        print_error "Cần build Ecommerce trước khi chạy production mode"
        exit 1
    fi
fi

if [ ! -d "/var/www/Spa/CMS/frontend/admin/.next" ]; then
    print_warning "CMS Admin chưa được build. Bạn có muốn build không? (y/n)"
    read -p "" -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Đang build CMS Admin..."
        cd /var/www/Spa/CMS/frontend/admin
        NODE_ENV=production npm run build
    else
        print_error "Cần build CMS Admin trước khi chạy production mode"
        exit 1
    fi
fi

# Stop và xóa processes cũ
echo ""
echo "Đang dừng processes cũ..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Start với ecosystem config
echo ""
echo "Đang start với ecosystem.config.js..."
cd /var/www/Spa
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

echo ""
echo "=========================================="
echo "  HOÀN TẤT!"
echo "=========================================="
echo ""
pm2 list
echo ""
print_status "PM2 đã được cấu hình lại với tên rõ ràng:"
echo "  - cms-backend (Port 3011)"
echo "  - ecommerce-frontend (Port 3000)"
echo "  - cms-admin (Port 3013)"
echo ""
echo "Xem logs: pm2 logs"
echo "Xem status: pm2 status"

