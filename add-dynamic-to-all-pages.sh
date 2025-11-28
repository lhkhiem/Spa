#!/bin/bash
# Script to add dynamic = 'force-dynamic' to all pages that don't have it

set -e

cd /var/www/Spa/Ecommerce

echo "=== Adding dynamic = 'force-dynamic' to pages ==="
echo ""

# Find all page.tsx files
PAGES=$(find app -name "page.tsx" -type f)

COUNT=0
for page in $PAGES; do
  # Skip if already has dynamic export
  if grep -q "export const dynamic" "$page"; then
    continue
  fi
  
  # Skip if it's a server component that needs static generation
  # (check if it has async function and no 'use client')
  if ! grep -q "'use client'" "$page" && grep -q "export default async function" "$page"; then
    # This is a server component that might need static generation
    # Only add dynamic if it's likely to fail (has API calls)
    if grep -q "fetch\|await\|api" "$page"; then
      # Add dynamic after imports
      sed -i "/^import/a\\
\\
// Disable static generation (has dynamic data)\\
export const dynamic = 'force-dynamic';\\
" "$page"
      echo "  ✅ Added to $page"
      COUNT=$((COUNT+1))
    fi
    continue
  fi
  
  # For client components, add dynamic
  if grep -q "'use client'" "$page"; then
    # Add after 'use client'
    sed -i "/^'use client'/a\\
\\
// Disable static generation for client component\\
export const dynamic = 'force-dynamic';\\
" "$page"
    echo "  ✅ Added to $page"
    COUNT=$((COUNT+1))
  else
    # Server component without async - add after imports
    sed -i "/^import.*from/a\\
\\
// Disable static generation\\
export const dynamic = 'force-dynamic';\\
" "$page" 2>/dev/null || sed -i "1a\\
\\
// Disable static generation\\
export const dynamic = 'force-dynamic';\\
" "$page"
    echo "  ✅ Added to $page"
    COUNT=$((COUNT+1))
  fi
done

echo ""
echo "✅ Added dynamic = 'force-dynamic' to $COUNT pages"
echo ""
echo "Now try building: npm run build"



