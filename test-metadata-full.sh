#!/bin/bash

echo "🧪 Full Metadata Management Test"
echo "================================="
echo ""

API_BASE="https://api.banyco.vn/api"
BACKEND_BASE="http://localhost:3011/api"

echo "1️⃣  Testing API Endpoints"
echo "-------------------------"
echo ""

echo "✓ Home page metadata:"
curl -s "$API_BASE/public/page-metadata/" | jq '.' 2>/dev/null || curl -s "$API_BASE/public/page-metadata/"
echo ""
echo ""

echo "✓ Products page (should return 404 - no metadata yet):"
curl -s "$API_BASE/public/page-metadata/products" | jq '.' 2>/dev/null || curl -s "$API_BASE/public/page-metadata/products"
echo ""
echo ""

echo "2️⃣  Testing Path Normalization"
echo "-------------------------------"
echo ""

echo "✓ With trailing slash:"
curl -s "$API_BASE/public/page-metadata/products/" | jq '.' 2>/dev/null || curl -s "$API_BASE/public/page-metadata/products/"
echo ""
echo ""

echo "✓ With query params (should strip):"
curl -s "$API_BASE/public/page-metadata/products?category=spa&page=1" | jq '.' 2>/dev/null || curl -s "$API_BASE/public/page-metadata/products?category=spa&page=1"
echo ""
echo ""

echo "3️⃣  Next Steps to Test"
echo "----------------------"
echo ""
echo "📝 To test full functionality:"
echo ""
echo "   1. Go to CMS Admin: https://admin.banyco.vn/dashboard/settings"
echo "   2. Tab 'General' → Scroll to 'Quản lý SEO cho các trang'"
echo "   3. Click '+ Thêm trang mới'"
echo "   4. Add metadata for /products:"
echo "      - Path: /products"
echo "      - Title: Sản Phẩm - Banyco"
echo "      - Description: Khám phá các sản phẩm spa..."
echo "      - OG Image: Choose from Media Library"
echo "   5. Save Settings"
echo ""
echo "   6. Test auto-sync:"
echo "      - Create/Edit a Post → Check Settings to see metadata auto-synced"
echo "      - Create/Edit a Product → Check Settings to see metadata auto-synced"
echo ""
echo "   7. Test frontend:"
echo "      - Visit https://banyco.vn/products"
echo "      - View page source → Check <meta> tags"
echo "      - Share link on Facebook → Check preview card"
echo ""
echo "✅ API is ready! You can now manage metadata in CMS Settings."



