#!/bin/bash
# Script sửa các vấn đề bảo mật phát hiện

echo "🔧 Đang sửa các vấn đề bảo mật..."
echo ""

# 1. Thêm HTTP/HTTPS vào Firewall
echo "1️⃣  Thêm HTTP/HTTPS vào Firewall..."
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
echo "✅ Đã thêm HTTP/HTTPS"
echo ""

# 2. Cấu hình DDoS Protection
echo "2️⃣  Cấu hình DDoS Protection..."
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Vui lòng chạy với quyền sudo!"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

# Install iptables-persistent
apt-get update -qq
apt-get install -y iptables-persistent > /dev/null 2>&1

# Backup current rules
iptables-save > /etc/iptables/rules.v4.backup.$(date +%Y%m%d_%H%M%S)

# Drop invalid packets
iptables -A INPUT -m state --state INVALID -j DROP 2>/dev/null

# Allow established and related connections
iptables -I INPUT 1 -m state --state ESTABLISHED,RELATED -j ACCEPT 2>/dev/null

# Allow loopback
iptables -I INPUT 1 -i lo -j ACCEPT 2>/dev/null

# Limit connections per IP for HTTP
iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 20 --connlimit-mask 32 -j DROP 2>/dev/null

# Limit connections per IP for HTTPS
iptables -A INPUT -p tcp --dport 443 -m connlimit --connlimit-above 20 --connlimit-mask 32 -j DROP 2>/dev/null

# Limit new connections per IP for HTTP (10 per minute)
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --set 2>/dev/null
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --update --seconds 60 --hitcount 10 -j DROP 2>/dev/null

# Limit new connections per IP for HTTPS (10 per minute)
iptables -A INPUT -p tcp --dport 443 -m state --state NEW -m recent --set 2>/dev/null
iptables -A INPUT -p tcp --dport 443 -m state --state NEW -m recent --update --seconds 60 --hitcount 10 -j DROP 2>/dev/null

# Protect against SYN flood
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT 2>/dev/null
iptables -A INPUT -p tcp --syn -j DROP 2>/dev/null

# Protect against ping flood
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT 2>/dev/null
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP 2>/dev/null

# Save rules
iptables-save > /etc/iptables/rules.v4 2>/dev/null

# Load rules on boot
systemctl enable netfilter-persistent > /dev/null 2>&1

echo "✅ DDoS Protection đã được cấu hình"
echo ""

# 3. Hiển thị kết quả
echo "📊 Kiểm tra lại:"
echo ""
echo "Firewall:"
sudo ufw status | head -10
echo ""
echo "DDoS Protection:"
sudo iptables -L -n | grep -E "connlimit|recent" | head -5 || echo "Đang kiểm tra..."
echo ""

echo "✅ Hoàn tất!"
echo ""
echo "⚠️  Các bước tiếp theo (tùy chọn nhưng khuyến nghị):"
echo "   1. Cấu hình SSH Key Authentication"
echo "   2. Disable Root Login"
echo "   3. Setup Cloudflare"
echo ""
echo "Xem: NEXT_STEPS.md để biết chi tiết"
