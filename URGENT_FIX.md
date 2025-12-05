# 🚨 SỬA LỖI KHẨN CẤP - Website Không Vào Được

## ⚡ SỬA NGAY

### Bước 1: Tắt Các Bảo Vệ Tạm Thời

```bash
cd /var/www/Spa
sudo bash disable-security-temp.sh
```

Script này sẽ:
- ✅ Tắt Fail2ban tạm thời
- ✅ Xóa iptables rules (DDoS protection)
- ✅ Unblock tất cả IPs
- ✅ Kiểm tra firewall

### Bước 2: Nếu Vẫn Không Vào Được

**Tắt Firewall hoàn toàn:**

```bash
sudo ufw disable
```

**Kiểm tra website:**

```bash
# Test local
curl -I http://localhost
curl -I https://localhost

# Test từ bên ngoài
curl -I http://your-server-ip
curl -I https://your-server-ip
```

### Bước 3: Kiểm Tra Services

```bash
# Kiểm tra Nginx/Apache
sudo systemctl status nginx
# hoặc
sudo systemctl status apache2

# Kiểm tra Node.js apps
pm2 list
# hoặc
ps aux | grep node
```

## 🔍 NGUYÊN NHÂN CÓ THỂ

1. **Firewall block HTTP/HTTPS** - Chưa thêm ports 80/443
2. **Fail2ban block IP** - IP của bạn bị block
3. **DDoS rules quá strict** - iptables block connections
4. **Rate limiting quá strict** - Code block requests

## ✅ SAU KHI WEBSITE HOẠT ĐỘNG LẠI

### 1. Kiểm Tra Logs

```bash
# Fail2ban logs
sudo tail -50 /var/log/fail2ban.log

# Firewall logs
sudo tail -50 /var/log/ufw.log

# Application logs
tail -50 /var/www/Spa/CMS/backend/logs/app.log
```

### 2. Cấu Hình Lại Đúng Cách

Sau khi website hoạt động, cấu hình lại từ từ:

**Bước 1: Firewall (An toàn)**
```bash
# Chỉ thêm HTTP/HTTPS, không reset
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

**Bước 2: Fail2ban (Cẩn thận)**
```bash
# Whitelist IP của bạn trước
sudo nano /etc/fail2ban/jail.local
# Thêm vào [sshd]:
# ignoreip = 127.0.0.1/8 ::1 YOUR_IP_HERE

sudo systemctl restart fail2ban
```

**Bước 3: DDoS Protection (Sau cùng)**
```bash
# Chỉ chạy sau khi đã test kỹ
sudo bash setup-ddos-protection.sh
```

## 🆘 NẾU VẪN KHÔNG ĐƯỢC

### Rollback Hoàn Toàn

```bash
# 1. Tắt tất cả
sudo ufw disable
sudo systemctl stop fail2ban
sudo iptables -F

# 2. Kiểm tra website
curl -I http://localhost

# 3. Nếu vẫn không được, kiểm tra:
# - Nginx/Apache có chạy không?
# - Node.js apps có chạy không?
# - Ports có bị chiếm không?
```

### Kiểm Tra Services

```bash
# Restart Nginx
sudo systemctl restart nginx

# Restart Node.js apps
pm2 restart all
# hoặc
cd /var/www/Spa/CMS/backend && npm start
cd /var/www/Spa/Ecommerce/backend && npm start
```

## 📞 LIÊN HỆ

Nếu vẫn không giải quyết được, cần:
1. Kiểm tra logs chi tiết
2. Kiểm tra cấu hình Nginx/Apache
3. Kiểm tra Node.js apps có chạy không

## ✅ CHECKLIST KHẨN CẤP

- [ ] Đã chạy `disable-security-temp.sh`
- [ ] Website đã hoạt động lại
- [ ] Đã kiểm tra logs để tìm nguyên nhân
- [ ] Đã cấu hình lại đúng cách (sau khi website hoạt động)
