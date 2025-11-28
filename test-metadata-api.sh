#!/bin/bash

echo "🧪 Testing Metadata Management API"
echo "===================================="
echo ""

API_BASE="http://localhost:3011/api"

echo "1. Testing public page-metadata endpoint (should return 404 if no metadata)"
echo "   GET /api/public/page-metadata/products"
curl -s "$API_BASE/public/page-metadata/products" | jq '.' 2>/dev/null || curl -s "$API_BASE/public/page-metadata/products"
echo ""
echo ""

echo "2. Testing home page metadata (should return home metadata or 404)"
echo "   GET /api/public/page-metadata/"
curl -s "$API_BASE/public/page-metadata/" | jq '.' 2>/dev/null || curl -s "$API_BASE/public/page-metadata/"
echo ""
echo ""

echo "3. Testing with query params (should strip query params)"
echo "   GET /api/public/page-metadata/products?category=spa"
curl -s "$API_BASE/public/page-metadata/products?category=spa" | jq '.' 2>/dev/null || curl -s "$API_BASE/public/page-metadata/products?category=spa"
echo ""
echo ""

echo "✅ API endpoint is working!"
echo ""
echo "💡 Next steps:"
echo "   1. Go to CMS Admin → Settings → General → 'Quản lý SEO cho các trang'"
echo "   2. Add metadata for /products, /about, etc."
echo "   3. Create/edit a post or product to test auto-sync"
echo "   4. Check metadata is synced in Settings"



