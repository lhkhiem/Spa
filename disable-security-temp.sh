#!/bin/bash
# Tạm thời tắt các bảo vệ để website hoạt động lại
# CHẠY: sudo bash disable-security-temp.sh

echo "⚠️  ĐANG TẠM THỜI TẮT BẢO VỆ..."
echo ""

# 1. Tắt Fail2ban tạm thời
echo "1️⃣  Tắt Fail2ban..."
sudo systemctl stop fail2ban
echo "✅ Fail2ban đã tắt"
echo ""

# 2. Xóa iptables rules (DDoS protection)
echo "2️⃣  Xóa DDoS protection rules..."
sudo iptables -F INPUT
sudo iptables -P INPUT ACCEPT
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
echo "✅ DDoS rules đã được xóa"
echo ""

# 3. Kiểm tra Firewall
echo "3️⃣  Kiểm tra Firewall..."
echo "Firewall status:"
sudo ufw status
echo ""
echo "⚠️  Nếu website vẫn không vào được, tắt firewall:"
echo "    sudo ufw disable"
echo ""

# 4. Unblock tất cả IPs trong Fail2ban
echo "4️⃣  Unblock tất cả IPs trong Fail2ban..."
sudo fail2ban-client unban --all 2>/dev/null || echo "Fail2ban đã tắt"
echo ""

# 5. Kiểm tra ports đang listen
echo "5️⃣  Kiểm tra ports đang listen..."
sudo netstat -tulpn | grep -E ":80|:443|:3000|:3011|:3012|:3013" || ss -tulpn | grep -E ":80|:443|:3000|:3011|:3012|:3013"
echo ""

echo "✅ Đã tắt các bảo vệ tạm thời"
echo ""
echo "🔍 KIỂM TRA NGAY:"
echo "   curl -I http://localhost:80"
echo "   curl -I http://localhost:443"
echo ""
echo "⚠️  LƯU Ý: Sau khi website hoạt động lại, cần cấu hình lại đúng cách!"
echo "   Xem: FIX_ISSUES.md"
