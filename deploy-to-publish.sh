#!/bin/bash

# Script deploy toàn bộ SPA sang /var/www/publish/spa/
# Dùng mỗi lần fix code và muốn deploy lên production

set -e

ROOT="/var/www/Spa"
PUBLISH="/var/www/publish/spa"

echo "=== Deploy SPA to $PUBLISH ==="
echo ""

# Gọi rebuild-deploy-all.sh (đã có sẵn logic build + copy + restart PM2)
cd "$ROOT"
bash rebuild-deploy-all.sh

echo ""
echo "✅ Deploy hoàn tất!"
echo ""
echo "Các project đã được build và copy sang:"
echo "  - $PUBLISH/cms-backend"
echo "  - $PUBLISH/cms-admin"
echo "  - $PUBLISH/ecommerce-backend"
echo "  - $PUBLISH/ecommerce-frontend"
echo ""
echo "PM2 services đã được restart tự động."


