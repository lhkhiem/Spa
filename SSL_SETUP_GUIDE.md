# Hướng dẫn Setup SSL (HTTPS) cho Domain

## Yêu cầu:
- Domain đã trỏ về IP server (14.225.205.116)
- Port 80 và 443 phải mở
- Certbot đã được cài đặt (✅ đã có)

## Các bước thực hiện:

### Bước 1: Tạo SSL Certificates
```bash
sudo bash /var/www/Spa/setup-ssl.sh
```

Hoặc chạy thủ công:
```bash
sudo certbot certonly --nginx \
  -d banyco-demo.pressup.vn \
  -d admin.banyco-demo.pressup.vn \
  -d api.banyco-demo.pressup.vn \
  --non-interactive \
  --agree-tos \
  --email admin@pressup.vn \
  --expand
```

**Lưu ý:** 
- Thay `admin@pressup.vn` bằng email của bạn
- Certbot sẽ tự động xác thực domain qua HTTP challenge
- Đảm bảo nginx đang chạy và domain đã trỏ đúng IP

### Bước 2: Cập nhật Nginx Config
```bash
sudo bash /var/www/Spa/update-nginx-ssl.sh
```

Script này sẽ:
- Backup configs hiện tại
- Tạo config mới với SSL
- Redirect HTTP -> HTTPS
- Thêm security headers
- Test và reload nginx

### Bước 3: Kiểm tra
Sau khi hoàn thành, kiểm tra:
- https://banyco-demo.pressup.vn
- https://admin.banyco-demo.pressup.vn
- https://api.banyco-demo.pressup.vn

## Auto-renewal (Tự động gia hạn)
Certbot tự động setup cron job để gia hạn certificates. Kiểm tra:
```bash
sudo certbot renew --dry-run
```

## Troubleshooting

### Nếu certbot báo lỗi "Failed to connect"
- Kiểm tra firewall: `sudo ufw status`
- Đảm bảo port 80 và 443 mở: `sudo ufw allow 80 && sudo ufw allow 443`

### Nếu nginx không start sau khi cấu hình SSL
- Kiểm tra log: `sudo tail -f /var/log/nginx/error.log`
- Test config: `sudo nginx -t`
- Restore backup nếu cần: `sudo cp /etc/nginx/sites-available/*.backup /etc/nginx/sites-available/`

### Nếu domain không resolve
- Kiểm tra DNS: `dig banyco-demo.pressup.vn`
- Đảm bảo A record trỏ về 14.225.205.116

