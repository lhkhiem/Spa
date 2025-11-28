#!/bin/bash
# Script to update CORS environment variables for banyco.vn

set -e

echo "=== Updating CORS Environment Variables ==="
echo ""

BACKEND_ENV="/var/www/Spa/CMS/backend/.env"

if [ ! -f "$BACKEND_ENV" ]; then
    echo "❌ Backend .env file not found at: $BACKEND_ENV"
    echo "Please create it first or update the path."
    exit 1
fi

echo "Backend .env file: $BACKEND_ENV"
echo ""

# Backup .env file
BACKUP_FILE="${BACKEND_ENV}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$BACKEND_ENV" "$BACKUP_FILE"
echo "✅ Backup created: $BACKUP_FILE"
echo ""

# Update or add domain variables
echo "Updating domain configuration..."
echo ""

# Function to update or add env variable
update_env_var() {
    local key=$1
    local value=$2
    local file=$3
    
    if grep -q "^${key}=" "$file"; then
        # Update existing
        sed -i "s|^${key}=.*|${key}=${value}|" "$file"
        echo "  ✅ Updated: ${key}=${value}"
    else
        # Add new
        echo "${key}=${value}" >> "$file"
        echo "  ✅ Added: ${key}=${value}"
    fi
}

# Update domain variables
update_env_var "FRONTEND_DOMAIN" "banyco.vn" "$BACKEND_ENV"
update_env_var "API_DOMAIN" "api.banyco.vn" "$BACKEND_ENV"
update_env_var "ADMIN_DOMAIN" "admin.banyco.vn" "$BACKEND_ENV"

# Remove old domain references (if any)
echo ""
echo "Removing old domain references..."
sed -i '/banyco-demo\.pressup\.vn/d' "$BACKEND_ENV" 2>/dev/null || true
sed -i '/pressup\.vn/d' "$BACKEND_ENV" 2>/dev/null || true

echo ""
echo "✅ Environment variables updated!"
echo ""
echo "Current domain configuration:"
grep -E "^(FRONTEND_DOMAIN|API_DOMAIN|ADMIN_DOMAIN)=" "$BACKEND_ENV" || echo "  (not found)"
echo ""
echo "Next steps:"
echo "1. Restart backend: pm2 restart cms-backend"
echo "2. Check CORS is working: curl -H 'Origin: https://banyco.vn' https://api.banyco.vn/api/health"



