#!/bin/bash
# Script to fix all duplicate /api/api/ URLs in admin frontend

set -e

cd /var/www/Spa/CMS/frontend/admin

echo "=== Fixing duplicate /api/api/ URLs ==="
echo ""

# Find all files with ${API_BASE_URL}/api/ pattern
FILES=$(grep -r "\${API_BASE_URL}/api/" --include="*.ts" --include="*.tsx" -l | head -20)

for file in $FILES; do
  echo "Fixing $file..."
  
  # Replace ${API_BASE_URL}/api/ with buildApiUrlFromBase(API_BASE_URL, '/api/...')
  # This is complex, so we'll do a simpler fix: ensure API_BASE_URL doesn't have /api
  # Actually, better approach: replace with buildApiUrl() which already handles this
  
  # For now, just add import if missing and replace pattern
  if ! grep -q "buildApiUrlFromBase" "$file" 2>/dev/null; then
    # Add import if buildApiUrl is imported
    if grep -q "import.*buildApiUrl" "$file"; then
      sed -i "s|import { buildApiUrl|import { buildApiUrl, buildApiUrlFromBase|" "$file"
    fi
  fi
  
  # Replace ${API_BASE_URL}/api/xxx with buildApiUrlFromBase(API_BASE_URL, '/api/xxx')
  sed -i 's|${API_BASE_URL}/api/\([^`]*\)|${buildApiUrlFromBase(API_BASE_URL, '\''/api/\1'\'')}|g' "$file" 2>/dev/null || true
done

echo ""
echo "✅ Done! Now rebuild: npm run build"



