# 🚀 Hướng Dẫn Nhanh - Bảo Mật VPS

## ⚡ Chạy Ngay (3 Bước)

```bash
cd /var/www/Spa

# 1. Firewall
sudo bash setup-firewall.sh

# 2. Fail2ban
sudo bash setup-fail2ban.sh

# 3. DDoS Protection
sudo bash setup-ddos-protection.sh
```

## ⚠️ Lưu Ý Quan Trọng

### 1. Kernel Upgrade Dialog
Nếu gặp dialog về kernel upgrade:
- **Nhấn Tab** để chọn `<Ok>`
- **Nhấn Enter** để tiếp tục
- Hoặc chạy với: `DEBIAN_FRONTEND=noninteractive sudo bash setup-fail2ban.sh`

### 2. SSH Access
- ⚠️ **Đảm bảo SSH (port 22) vẫn hoạt động** trước khi đóng terminal
- Nếu bị lock out, cần truy cập qua console của VPS provider

### 3. Thứ Tự Chạy
1. **Firewall** trước (quan trọng nhất)
2. **Fail2ban** sau
3. **DDoS Protection** cuối cùng

## ✅ Kiểm Tra Sau Khi Chạy

```bash
# Kiểm tra Firewall
sudo ufw status verbose

# Kiểm tra Fail2ban
sudo fail2ban-client status

# Kiểm tra iptables
sudo iptables -L -n -v | head -20
```

## 🆘 Nếu Gặp Lỗi

### Dialog Kernel Upgrade
```bash
# Chạy với non-interactive mode
DEBIAN_FRONTEND=noninteractive sudo bash setup-fail2ban.sh
DEBIAN_FRONTEND=noninteractive sudo bash setup-ddos-protection.sh
```

### Bị Lock Out SSH
1. Truy cập qua console của VPS provider
2. Unblock IP: `sudo fail2ban-client set sshd unbanip <YOUR_IP>`
3. Hoặc tạm thời disable fail2ban: `sudo systemctl stop fail2ban`

## 📝 Chi Tiết

Xem file `SECURITY_GUIDE.md` để biết chi tiết đầy đủ.
