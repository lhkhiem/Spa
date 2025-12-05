#!/bin/bash
# Cài đặt và cấu hình Fail2ban để tự động block IP tấn công
# Chạy: sudo bash setup-fail2ban.sh

echo "🔒 Đang cài đặt Fail2ban..."

# Set non-interactive mode để bỏ qua các dialog
export DEBIAN_FRONTEND=noninteractive

# Update package list
apt-get update

# Install Fail2ban (tự động bỏ qua dialog)
apt-get install -y fail2ban

# Backup default config
if [ ! -f /etc/fail2ban/jail.local ]; then
  cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
fi

# Tạo config tùy chỉnh
cat > /etc/fail2ban/jail.local << 'JAIL_EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = admin@banyco.vn
sendername = Fail2Ban
action = %(action_)s

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200

[nginx-http-auth]
enabled = true
port = http,https
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 5

[nginx-limit-req]
enabled = true
port = http,https
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10

[nginx-botsearch]
enabled = true
port = http,https
filter = nginx-botsearch
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
JAIL_EOF

# Tạo filter cho Nginx limit request
cat > /etc/fail2ban/filter.d/nginx-limit-req.conf << 'FILTER_EOF'
[Definition]
failregex = limiting requests, excess:.* by zone.*client: <HOST>
ignoreregex =
FILTER_EOF

# Tạo filter cho bot detection
cat > /etc/fail2ban/filter.d/nginx-botsearch.conf << 'FILTER_EOF'
[Definition]
failregex = ^<HOST>.*"(GET|POST|HEAD).*HTTP.*" (404|403|400|500)
ignoreregex =
FILTER_EOF

# Restart Fail2ban
systemctl restart fail2ban
systemctl enable fail2ban

# Show status
echo ""
echo "📊 Trạng thái Fail2ban:"
fail2ban-client status

echo ""
echo "✅ Fail2ban đã được cài đặt và cấu hình thành công!"
echo "📝 Xem logs: tail -f /var/log/fail2ban.log"
echo "📝 Xem banned IPs: fail2ban-client status sshd"
