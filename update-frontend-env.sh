#!/bin/bash
# Script to update frontend environment variables

set -e

echo "=== Updating Frontend Environment Variables ==="
echo ""

FRONTEND_ENV="/var/www/Spa/Ecommerce/.env.local"

if [ ! -f "$FRONTEND_ENV" ]; then
    echo "❌ Frontend .env.local file not found at: $FRONTEND_ENV"
    echo "Creating new file..."
    touch "$FRONTEND_ENV"
fi

# Backup
BACKUP_FILE="${FRONTEND_ENV}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$FRONTEND_ENV" "$BACKUP_FILE"
echo "✅ Backup created: $BACKUP_FILE"
echo ""

# Function to update or add env variable
update_env_var() {
    local key=$1
    local value=$2
    local file=$3
    
    if grep -q "^${key}=" "$file"; then
        sed -i "s|^${key}=.*|${key}=${value}|" "$file"
        echo "  ✅ Updated: ${key}=${value}"
    else
        echo "${key}=${value}" >> "$file"
        echo "  ✅ Added: ${key}=${value}"
    fi
}

# Update API URLs
echo "Updating API URLs..."
update_env_var "NEXT_PUBLIC_API_URL" "https://api.banyco.vn/api" "$FRONTEND_ENV"
update_env_var "NEXT_PUBLIC_CMS_BASE_URL" "https://api.banyco.vn/api" "$FRONTEND_ENV"

# Update domain variables
echo ""
echo "Updating domain configuration..."
update_env_var "NEXT_PUBLIC_FRONTEND_DOMAIN" "banyco.vn" "$FRONTEND_ENV"
update_env_var "NEXT_PUBLIC_API_DOMAIN" "api.banyco.vn" "$FRONTEND_ENV"

# Remove old domain references
echo ""
echo "Removing old domain references..."
sed -i '/banyco-demo\.pressup\.vn/d' "$FRONTEND_ENV" 2>/dev/null || true

echo ""
echo "✅ Frontend environment variables updated!"
echo ""
echo "Current configuration:"
grep -E "^(NEXT_PUBLIC_API_URL|NEXT_PUBLIC_CMS_BASE_URL|NEXT_PUBLIC_FRONTEND_DOMAIN|NEXT_PUBLIC_API_DOMAIN)=" "$FRONTEND_ENV" || echo "  (not found)"
echo ""
echo "Next steps:"
echo "1. Rebuild frontend: cd Ecommerce && npm run build"
echo "2. Restart frontend: pm2 restart ecommerce-frontend"



