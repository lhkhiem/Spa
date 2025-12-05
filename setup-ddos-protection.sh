#!/bin/bash
# Cấu hình DDoS protection với iptables
# Chạy: sudo bash setup-ddos-protection.sh

echo "🔒 Đang cấu hình DDoS Protection..."

# Kiểm tra quyền root
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Vui lòng chạy với quyền sudo!"
  exit 1
fi

# Set non-interactive mode để bỏ qua các dialog
export DEBIAN_FRONTEND=noninteractive

# Install iptables-persistent để lưu rules
apt-get update
apt-get install -y iptables-persistent

# Backup current rules
iptables-save > /etc/iptables/rules.v4.backup.$(date +%Y%m%d_%H%M%S)

# Drop invalid packets
echo "✅ Drop invalid packets..."
iptables -A INPUT -m state --state INVALID -j DROP

# Allow established and related connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Limit connections per IP for HTTP
echo "✅ Limit connections per IP (HTTP)..."
iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 20 --connlimit-mask 32 -j DROP

# Limit connections per IP for HTTPS
echo "✅ Limit connections per IP (HTTPS)..."
iptables -A INPUT -p tcp --dport 443 -m connlimit --connlimit-above 20 --connlimit-mask 32 -j DROP

# Limit new connections per IP for HTTP (10 per minute)
echo "✅ Limit new connections (HTTP)..."
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --update --seconds 60 --hitcount 10 -j DROP

# Limit new connections per IP for HTTPS (10 per minute)
echo "✅ Limit new connections (HTTPS)..."
iptables -A INPUT -p tcp --dport 443 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 443 -m state --state NEW -m recent --update --seconds 60 --hitcount 10 -j DROP

# Protect against SYN flood
echo "✅ Protect against SYN flood..."
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# Protect against ping flood
echo "✅ Protect against ping flood..."
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP

# Save rules
echo "✅ Lưu rules..."
iptables-save > /etc/iptables/rules.v4

# Load rules on boot
systemctl enable netfilter-persistent

echo ""
echo "✅ DDoS Protection đã được cấu hình thành công!"
echo "📝 Xem rules: iptables -L -n -v"
echo "⚠️  LƯU Ý: Rules sẽ được load tự động khi reboot"
