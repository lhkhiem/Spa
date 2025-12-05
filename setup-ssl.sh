#!/bin/bash

# Script để setup SSL cho các domain
# Chạy với quyền root: sudo bash setup-ssl.sh

echo "=== Setup SSL cho các domain ==="
echo ""

# Kiểm tra quyền root
if [ "$EUID" -ne 0 ]; then 
    echo "Vui lòng chạy script này với quyền root (sudo)"
    exit 1
fi

# Domain cần setup SSL (Production domains only)
DOMAINS=(
    "banyco.vn"
    "www.banyco.vn"
    "ecommerce-api.banyco.vn"
    "api.banyco.vn"
    "admin.banyco.vn"
)

echo "Các domain sẽ được cấu hình SSL:"
for domain in "${DOMAINS[@]}"; do
    echo "  - $domain"
done
echo ""

# Tạo SSL certificates
echo "Đang tạo SSL certificates..."
certbot certonly --nginx -d banyco.vn -d www.banyco.vn -d ecommerce-api.banyco.vn -d api.banyco.vn -d admin.banyco.vn --non-interactive --agree-tos --email admin@pressup.vn --expand

if [ $? -eq 0 ]; then
    echo "✅ SSL certificates đã được tạo thành công!"
    echo ""
    echo "Bây giờ cần cập nhật nginx config để sử dụng SSL."
    echo "Chạy: sudo bash update-nginx-ssl.sh"
else
    echo "❌ Có lỗi khi tạo SSL certificates"
    exit 1
fi

