#!/bin/bash

# Script to fix duplicate /api/api/ in all files
# This replaces ${API_BASE_URL}/api/... with buildApiUrl('/api/...')

cd /var/www/Spa/CMS/frontend/admin

# Files to fix
files=(
  "app/dashboard/value-props/page.tsx"
  "app/dashboard/sliders/page.tsx"
  "app/dashboard/testimonials/page.tsx"
  "app/dashboard/media-library/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    # Replace import
    sed -i "s/import { API_BASE_URL/import { buildApiUrl/g" "$file"
    sed -i "s/, API_BASE_URL }/, buildApiUrl }/g" "$file"
    sed -i "s/API_BASE_URL, /buildApiUrl, /g" "$file"
    
    # Replace usage - need to be careful with template strings
    # This is a simple replacement, may need manual review
    sed -i "s|\${API_BASE_URL}/api/|buildApiUrl('/api/|g" "$file"
    sed -i "s|API_BASE_URL}/api/|buildApiUrl('/api/|g" "$file"
    
    # Fix closing parentheses
    sed -i "s|buildApiUrl('/api/\([^']*\)'|buildApiUrl('/api/\1')|g" "$file"
  fi
done

echo "✅ Done! Please review the changes."



