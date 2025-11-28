#!/bin/bash
# Script to add dynamic = 'force-dynamic' to all pages that need it

set -e

echo "=== Fixing Build Errors ==="
echo ""

cd /var/www/Spa/Ecommerce

# List of pages that need dynamic = 'force-dynamic'
PAGES=(
  "app/(main)/about/page.tsx"
  "app/(main)/careers/page.tsx"
  "app/(main)/catalogs/page.tsx"
  "app/(main)/categories/page.tsx"
  "app/(main)/contact/page.tsx"
  "app/(main)/faqs/page.tsx"
  "app/(main)/financing/page.tsx"
  "app/(main)/forgot-password/page.tsx"
  "app/(main)/learning/business-management/page.tsx"
  "app/(main)/learning/certifications/page.tsx"
  "app/(main)/learning/page.tsx"
  "app/(main)/learning/product-training/page.tsx"
  "app/(main)/learning/webinars/page.tsx"
  "app/(main)/modalities/page.tsx"
  "app/(main)/order-lookup/page.tsx"
  "app/(main)/partnerships/page.tsx"
  "app/(main)/privacy/page.tsx"
  "app/(main)/register/page.tsx"
  "app/(main)/rewards/page.tsx"
  "app/(main)/services/page.tsx"
  "app/(main)/shipping/page.tsx"
  "app/(main)/spa-development/page.tsx"
  "app/(main)/terms/page.tsx"
  "app/(shop)/brands/page.tsx"
  "app/(shop)/cart/page.tsx"
  "app/(shop)/checkout/page.tsx"
  "app/(shop)/deals/page.tsx"
  "app/(shop)/equipment/page.tsx"
  "app/(shop)/outlet/page.tsx"
  "app/(shop)/products/page.tsx"
  "app/test/page.tsx"
)

echo "Adding dynamic = 'force-dynamic' to pages..."
echo ""

for page in "${PAGES[@]}"; do
  if [ -f "$page" ]; then
    # Check if already has dynamic export
    if ! grep -q "export const dynamic" "$page"; then
      # Add after first line (usually 'use client' or import)
      sed -i "1a\\
// Disable static generation for this page\\
export const dynamic = 'force-dynamic';\\
" "$page"
      echo "  ✅ Added to $page"
    else
      echo "  ⏭️  Already has dynamic: $page"
    fi
  else
    echo "  ⚠️  File not found: $page"
  fi
done

echo ""
echo "✅ Done! Now try building again:"
echo "  npm run build"



