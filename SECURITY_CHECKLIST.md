# ✅ Checklist Bảo Mật - Kiểm Tra Sau Khi Cài Đặt

## 🔍 KIỂM TRA NGAY

### 1. Kiểm Tra Firewall ✅

```bash
sudo ufw status verbose
```

**Kết quả mong đợi:**
- ✅ Status: active
- ✅ Port 22 (SSH): ALLOW
- ✅ Port 80 (HTTP): ALLOW
- ✅ Port 443 (HTTPS): ALLOW
- ✅ Default: deny (incoming), allow (outgoing)

### 2. Kiểm Tra Fail2ban ✅

```bash
sudo fail2ban-client status
```

**Kết quả mong đợi:**
- ✅ Status: Running
- ✅ Jails: sshd, nginx-http-auth, nginx-limit-req, nginx-botsearch

**Xem chi tiết:**
```bash
sudo fail2ban-client status sshd
```

### 3. Kiểm Tra DDoS Protection ✅

```bash
sudo iptables -L -n -v | head -30
```

**Kết quả mong đợi:**
- ✅ Có rules cho connlimit
- ✅ Có rules cho recent (rate limiting)
- ✅ Có rules chống SYN flood

### 4. Kiểm Tra Code Rate Limiting ✅

```bash
# Test API endpoint
curl -I https://api.banyco.vn/api/health
```

**Kiểm tra headers:**
- ✅ `X-RateLimit-Limit`
- ✅ `X-RateLimit-Remaining`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ❌ Không có `X-Powered-By`
- ❌ Không có `Server`

## 📋 CHECKLIST HOÀN CHỈNH

### Code Level
- [x] Rate limiting đã được implement
- [x] Security headers đã được set
- [x] IP không bị hardcode
- [x] Anti-spam đã có
- [x] Input validation đã có

### VPS Level
- [ ] Firewall (UFW) đã được cấu hình
- [ ] Fail2ban đã được cài đặt
- [ ] DDoS protection (iptables) đã được cấu hình
- [ ] SSH key authentication (khuyến nghị)
- [ ] Cloudflare/CDN đã được setup (khuyến nghị)

### Monitoring
- [ ] Logs được monitor
- [ ] Alert system đã được setup
- [ ] Backup đã được cấu hình

## 🚀 CÁC BƯỚC TIẾP THEO

### 1. Cấu Hình SSH Key Authentication (Quan Trọng)

**Tại sao:** Bảo mật hơn password, chống brute force tốt hơn

```bash
# Trên máy local của bạn
ssh-keygen -t rsa -b 4096

# Copy key lên server
ssh-copy-id user@your-server-ip

# Trên server, disable password authentication
sudo nano /etc/ssh/sshd_config
# Tìm và sửa:
# PasswordAuthentication no
# PubkeyAuthentication yes

# Restart SSH
sudo systemctl restart sshd
```

**⚠️ LƯU Ý:** Đảm bảo SSH key hoạt động trước khi disable password!

### 2. Cấu Hình Cloudflare (Khuyến Nghị)

**Lợi ích:**
- ✅ Ẩn IP thật của VPS
- ✅ DDoS protection từ Cloudflare
- ✅ WAF (Web Application Firewall)
- ✅ Rate limiting từ Cloudflare
- ✅ SSL/TLS tự động

**Các bước:**
1. Đăng ký Cloudflare (miễn phí)
2. Thêm domain vào Cloudflare
3. Thay đổi nameservers
4. Enable các tính năng bảo mật:
   - DDoS Protection: ON
   - WAF: ON
   - Rate Limiting: ON
   - Bot Fight Mode: ON

### 3. Cấu Hình Monitoring & Alerts

**Cài đặt monitoring tools:**

```bash
# Cài đặt htop để monitor resources
sudo apt-get install -y htop

# Cài đặt logwatch để xem logs
sudo apt-get install -y logwatch

# Cấu hình logwatch
sudo nano /etc/logwatch/conf/logwatch.conf
```

**Monitor logs thường xuyên:**
```bash
# Fail2ban logs
sudo tail -f /var/log/fail2ban.log

# SSH logs
sudo tail -f /var/log/auth.log | grep sshd

# Firewall logs
sudo tail -f /var/log/ufw.log

# Application logs
tail -f /var/www/Spa/CMS/backend/logs/app.log | grep -i "rate\|block\|attack"
```

### 4. Cấu Hình Backup Tự Động

**Backup database:**
```bash
# Tạo script backup
cat > /var/www/Spa/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
pg_dump -U spa_cms_user spa_cms_db > $BACKUP_DIR/db_$DATE.sql

# Xóa backup cũ hơn 7 ngày
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
EOF

chmod +x /var/www/Spa/backup-db.sh

# Thêm vào crontab (chạy hàng ngày lúc 2h sáng)
crontab -e
# Thêm dòng:
# 0 2 * * * /var/www/Spa/backup-db.sh
```

### 5. Cập Nhật Hệ Thống Định Kỳ

```bash
# Tạo script update
cat > /var/www/Spa/update-system.sh << 'EOF'
#!/bin/bash
# Update system packages
apt-get update
apt-get upgrade -y

# Update Node.js dependencies
cd /var/www/Spa/CMS/backend && npm update
cd /var/www/Spa/Ecommerce/backend && npm update

echo "✅ System updated at $(date)"
EOF

chmod +x /var/www/Spa/update-system.sh

# Chạy hàng tuần
# Crontab: 0 3 * * 0 /var/www/Spa/update-system.sh
```

## 🔒 BẢO MẬT BỔ SUNG

### 1. Disable Root Login

```bash
sudo nano /etc/ssh/sshd_config
# Tìm và sửa:
# PermitRootLogin no

sudo systemctl restart sshd
```

### 2. Thay Đổi SSH Port (Tùy Chọn)

```bash
sudo nano /etc/ssh/sshd_config
# Tìm và sửa:
# Port 2222  # Thay đổi từ 22 sang port khác

# Cập nhật firewall
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp

sudo systemctl restart sshd
```

### 3. Cấu Hình Automatic Security Updates

```bash
sudo apt-get install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 4. Giới Hạn Số Lượng User Login

```bash
sudo nano /etc/security/limits.conf
# Thêm:
# * soft nofile 65535
# * hard nofile 65535
```

## 📊 MONITORING HÀNG NGÀY

### Commands Hữu Ích

```bash
# Xem IPs bị block bởi Fail2ban
sudo fail2ban-client status sshd | grep "Banned IP"

# Xem connections hiện tại
sudo netstat -an | grep :80 | wc -l
sudo netstat -an | grep :443 | wc -l

# Xem top IPs đang kết nối
sudo netstat -an | grep :80 | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -10

# Xem failed login attempts
sudo grep "Failed password" /var/log/auth.log | tail -20

# Xem rate limit violations
sudo tail -f /var/www/Spa/CMS/backend/logs/app.log | grep "RateLimit"
```

## 🎯 KẾT LUẬN

Sau khi hoàn thành checklist trên, hệ thống của bạn sẽ được bảo vệ ở **3 lớp**:

1. **Code Level** ✅ - Rate limiting, security headers
2. **VPS Level** ✅ - Firewall, Fail2ban, DDoS protection  
3. **Network Level** (Cloudflare) - DDoS, WAF, Ẩn IP

**Hệ thống đã an toàn! 🛡️**
