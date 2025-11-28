#!/bin/bash
# Script to fix CORS and environment variables

set -e

echo "=== Fixing CORS and Environment Variables ==="
echo ""

# Update Frontend .env.local
FRONTEND_ENV="/var/www/Spa/Ecommerce/.env.local"
if [ -f "$FRONTEND_ENV" ]; then
    echo "Updating Frontend .env.local..."
    # Backup
    cp "$FRONTEND_ENV" "${FRONTEND_ENV}.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Update API URLs
    sed -i 's|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=https://api.banyco.vn/api|' "$FRONTEND_ENV"
    sed -i 's|NEXT_PUBLIC_CMS_BASE_URL=.*|NEXT_PUBLIC_CMS_BASE_URL=https://api.banyco.vn/api|' "$FRONTEND_ENV"
    
    # Add domain variables if not exist
    if ! grep -q "^NEXT_PUBLIC_FRONTEND_DOMAIN=" "$FRONTEND_ENV"; then
        echo "NEXT_PUBLIC_FRONTEND_DOMAIN=banyco.vn" >> "$FRONTEND_ENV"
    else
        sed -i 's|NEXT_PUBLIC_FRONTEND_DOMAIN=.*|NEXT_PUBLIC_FRONTEND_DOMAIN=banyco.vn|' "$FRONTEND_ENV"
    fi
    
    if ! grep -q "^NEXT_PUBLIC_API_DOMAIN=" "$FRONTEND_ENV"; then
        echo "NEXT_PUBLIC_API_DOMAIN=api.banyco.vn" >> "$FRONTEND_ENV"
    else
        sed -i 's|NEXT_PUBLIC_API_DOMAIN=.*|NEXT_PUBLIC_API_DOMAIN=api.banyco.vn|' "$FRONTEND_ENV"
    fi
    
    # Remove old domain references
    sed -i '/banyco-demo\.pressup\.vn/d' "$FRONTEND_ENV" 2>/dev/null || true
    
    echo "✅ Frontend .env.local updated"
else
    echo "⚠️  Frontend .env.local not found, creating..."
    cat > "$FRONTEND_ENV" << EOF
NEXT_PUBLIC_API_URL=https://api.banyco.vn/api
NEXT_PUBLIC_CMS_BASE_URL=https://api.banyco.vn/api
NEXT_PUBLIC_FRONTEND_DOMAIN=banyco.vn
NEXT_PUBLIC_API_DOMAIN=api.banyco.vn
EOF
    echo "✅ Frontend .env.local created"
fi

echo ""

# Update Backend .env
BACKEND_ENV="/var/www/Spa/CMS/backend/.env"
if [ -f "$BACKEND_ENV" ]; then
    echo "Updating Backend .env..."
    # Backup
    cp "$BACKEND_ENV" "${BACKEND_ENV}.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Add or update domain variables
    if ! grep -q "^FRONTEND_DOMAIN=" "$BACKEND_ENV"; then
        echo "FRONTEND_DOMAIN=banyco.vn" >> "$BACKEND_ENV"
    else
        sed -i 's|FRONTEND_DOMAIN=.*|FRONTEND_DOMAIN=banyco.vn|' "$BACKEND_ENV"
    fi
    
    if ! grep -q "^API_DOMAIN=" "$BACKEND_ENV"; then
        echo "API_DOMAIN=api.banyco.vn" >> "$BACKEND_ENV"
    else
        sed -i 's|API_DOMAIN=.*|API_DOMAIN=api.banyco.vn|' "$BACKEND_ENV"
    fi
    
    if ! grep -q "^ADMIN_DOMAIN=" "$BACKEND_ENV"; then
        echo "ADMIN_DOMAIN=admin.banyco.vn" >> "$BACKEND_ENV"
    else
        sed -i 's|ADMIN_DOMAIN=.*|ADMIN_DOMAIN=admin.banyco.vn|' "$BACKEND_ENV"
    fi
    
    # Update PUBLIC_IP
    if ! grep -q "^PUBLIC_IP=" "$BACKEND_ENV"; then
        echo "PUBLIC_IP=14.225.205.116" >> "$BACKEND_ENV"
    else
        sed -i 's|PUBLIC_IP=.*|PUBLIC_IP=14.225.205.116|' "$BACKEND_ENV"
    fi
    
    # Remove old domain references
    sed -i '/banyco-demo\.pressup\.vn/d' "$BACKEND_ENV" 2>/dev/null || true
    
    echo "✅ Backend .env updated"
else
    echo "⚠️  Backend .env not found"
fi

echo ""
echo "✅ All environment variables updated!"
echo ""
echo "Next steps:"
echo "1. Rebuild frontend: cd /var/www/Spa/Ecommerce && npm run build"
echo "2. Restart services:"
echo "   pm2 restart cms-backend"
echo "   pm2 restart ecommerce-frontend"



