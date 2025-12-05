#!/bin/bash
# Script kiểm tra bảo mật sau khi cài đặt

echo "🔍 Đang kiểm tra bảo mật..."
echo ""

# 1. Check Firewall
echo "1️⃣  Kiểm tra Firewall:"
if command -v ufw &> /dev/null; then
  sudo ufw status | head -5
else
  echo "❌ UFW chưa được cài đặt"
fi
echo ""

# 2. Check Fail2ban
echo "2️⃣  Kiểm tra Fail2ban:"
if systemctl is-active --quiet fail2ban 2>/dev/null; then
  echo "✅ Fail2ban đang chạy"
  sudo fail2ban-client status 2>/dev/null | head -3
else
  echo "❌ Fail2ban chưa được cài đặt hoặc chưa chạy"
fi
echo ""

# 3. Check iptables rules
echo "3️⃣  Kiểm tra DDoS Protection (iptables):"
if sudo iptables -L -n 2>/dev/null | grep -q "connlimit"; then
  echo "✅ DDoS protection rules đã được cấu hình"
  sudo iptables -L -n 2>/dev/null | grep -E "connlimit|recent" | head -5
else
  echo "❌ DDoS protection chưa được cấu hình"
fi
echo ""

# 4. Check Security Headers
echo "4️⃣  Kiểm tra Security Headers:"
echo "Chạy: curl -I https://api.banyco.vn/api/health"
echo "Hoặc: curl -I http://localhost:3011/api/health"
echo ""

# 5. Check SSH config
echo "5️⃣  Kiểm tra SSH Security:"
if sudo grep -q "PermitRootLogin no" /etc/ssh/sshd_config 2>/dev/null; then
  echo "✅ Root login đã bị disable"
else
  echo "⚠️  Root login vẫn được phép (nên disable)"
fi

if sudo grep -q "PasswordAuthentication no" /etc/ssh/sshd_config 2>/dev/null; then
  echo "✅ Password authentication đã bị disable (dùng SSH key)"
else
  echo "⚠️  Password authentication vẫn được phép (nên dùng SSH key)"
fi
echo ""

# 6. Check Rate Limiting in Code
echo "6️⃣  Kiểm tra Rate Limiting (Code):"
if grep -q "rateLimitStore" /var/www/Spa/CMS/backend/src/app.ts 2>/dev/null; then
  echo "✅ CMS Backend: Rate limiting đã được implement"
else
  echo "❌ CMS Backend: Rate limiting chưa có"
fi

if grep -q "rateLimitStore" /var/www/Spa/Ecommerce/backend/src/app.ts 2>/dev/null; then
  echo "✅ Ecommerce Backend: Rate limiting đã được implement"
else
  echo "❌ Ecommerce Backend: Rate limiting chưa có"
fi
echo ""

echo "✅ Kiểm tra hoàn tất!"
echo ""
echo "📝 Xem chi tiết:"
echo "   - SECURITY_CHECKLIST.md"
echo "   - NEXT_STEPS.md"
echo "   - SECURITY_GUIDE.md"
