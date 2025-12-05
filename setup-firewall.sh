#!/bin/bash
# Cấu hình UFW Firewall để bảo vệ VPS
# Chạy: sudo bash setup-firewall.sh

echo "🔒 Đang cấu hình Firewall..."

# Reset UFW
ufw --force reset

# Default policies - Deny all incoming, allow all outgoing
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (QUAN TRỌNG - không block SSH!)
echo "✅ Cho phép SSH (port 22)..."
ufw allow 22/tcp comment 'SSH - QUAN TRỌNG: Không xóa!'

# Allow HTTP/HTTPS
echo "✅ Cho phép HTTP/HTTPS..."
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Rate limiting cho SSH
echo "✅ Cấu hình rate limiting cho SSH..."
ufw limit 22/tcp comment 'SSH Rate Limit'

# Enable UFW
echo "✅ Kích hoạt Firewall..."
ufw --force enable

# Show status
echo ""
echo "📊 Trạng thái Firewall:"
ufw status verbose

echo ""
echo "✅ Firewall đã được cấu hình thành công!"
echo "⚠️  LƯU Ý: Đảm bảo SSH (port 22) vẫn hoạt động trước khi đóng terminal!"
