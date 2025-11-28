#!/bin/bash
# Script to update CORS configuration - remove old domains, add new ones

set -e

echo "=== Updating CORS Configuration ==="
echo ""

BACKEND_ENV="/var/www/Spa/CMS/backend/.env"

if [ ! -f "$BACKEND_ENV" ]; then
    echo "❌ Backend .env file not found at: $BACKEND_ENV"
    exit 1
fi

# Backup
BACKUP_FILE="${BACKEND_ENV}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$BACKEND_ENV" "$BACKUP_FILE"
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

# Update domain variables
echo "Updating domain configuration..."
update_env_var "FRONTEND_DOMAIN" "banyco.vn" "$BACKEND_ENV"
update_env_var "API_DOMAIN" "api.banyco.vn" "$BACKEND_ENV"
update_env_var "ADMIN_DOMAIN" "admin.banyco.vn" "$BACKEND_ENV"

# Remove old domain references
echo ""
echo "Removing old domain references..."
sed -i '/banyco-demo\.pressup\.vn/d' "$BACKEND_ENV" 2>/dev/null || true

# Comment out or remove old ADMIN_ORIGIN/WEBSITE_ORIGIN if they point to old domains
if grep -q "ADMIN_ORIGIN.*banyco-demo\|ADMIN_ORIGIN.*pressup" "$BACKEND_ENV" 2>/dev/null; then
    sed -i 's|^\(ADMIN_ORIGIN.*banyco-demo.*\)|# \1|' "$BACKEND_ENV"
    sed -i 's|^\(ADMIN_ORIGIN.*pressup.*\)|# \1|' "$BACKEND_ENV"
    echo "  ✅ Commented out old ADMIN_ORIGIN"
fi

if grep -q "WEBSITE_ORIGIN.*banyco-demo\|WEBSITE_ORIGIN.*pressup" "$BACKEND_ENV" 2>/dev/null; then
    sed -i 's|^\(WEBSITE_ORIGIN.*banyco-demo.*\)|# \1|' "$BACKEND_ENV"
    sed -i 's|^\(WEBSITE_ORIGIN.*pressup.*\)|# \1|' "$BACKEND_ENV"
    echo "  ✅ Commented out old WEBSITE_ORIGIN"
fi

echo ""
echo "✅ CORS configuration updated!"
echo ""
echo "Current domain configuration:"
grep -E "^(FRONTEND_DOMAIN|API_DOMAIN|ADMIN_DOMAIN)=" "$BACKEND_ENV" || echo "  (not found)"
echo ""
echo "Next steps:"
echo "1. Restart backend: pm2 restart cms-backend"
echo "2. Check CORS logs in backend console"



