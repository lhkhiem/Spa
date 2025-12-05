#!/bin/bash
# Script push code đơn giản

cd /var/www/Spa

echo "📦 Đang kiểm tra git status..."
git status

echo ""
echo "📝 Files đã thay đổi:"
git status --short | head -20

echo ""
read -p "Bạn có muốn add, commit và push? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Đã hủy"
    exit 0
fi

echo "📦 Đang add files..."
git add .

echo "💾 Đang commit..."
git commit -m "feat: Add security features and improvements

- Add rate limiting and security headers to backends
- Add anti-spam protection (honeypot, time validation)
- Add security scripts for VPS protection
- Remove hardcoded IP addresses
- Add security documentation"

echo "🚀 Đang push..."
git push

echo ""
echo "✅ Đã push code thành công!"
