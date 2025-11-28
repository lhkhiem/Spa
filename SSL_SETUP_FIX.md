# Fix SSL Setup cho banyco.vn

## 🔍 Vấn đề

Certbot báo lỗi DNS cho `www.banyco.vn`:
```
Domain: www.banyco.vn
Type:   dns
Detail: DNS problem: NXDOMAIN looking up A for www.banyco.vn
```

## ✅ Giải pháp

### Cách 1: Setup SSL cho 3 domain trước (Khuyến nghị)

Chạy lệnh này để setup SSL cho các domain đã chắc chắn có DNS:

```bash
sudo certbot --nginx \
  -d banyco.vn \
  -d api.banyco.vn \
  -d admin.banyco.vn \
  --non-interactive \
  --agree-tos \
  --email sales@banyco.net
```

Sau đó, khi `www.banyco.vn` DNS đã sẵn sàng, thêm vào certificate:

```bash
sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand
```

### Cách 2: Sử dụng script tự động

```bash
cd /var/www/Spa
sudo ./setup-ssl-banyco-vn.sh
```

Script sẽ:
1. Kiểm tra DNS records
2. Cho bạn chọn setup 3 domain hoặc 4 domain
3. Tự động chạy certbot

### Cách 3: Thêm DNS record cho www.banyco.vn

Nếu chưa có DNS record cho `www.banyco.vn`, thêm vào DNS:

**Trong DNS management panel:**
- **Type**: A record
- **NAME**: `www`
- **CONTENT**: `14.225.205.116`
- **TTL**: `1 hour`

Sau đó đợi 5-30 phút để DNS propagate, rồi chạy lại certbot:

```bash
sudo certbot --nginx \
  -d banyco.vn \
  -d www.banyco.vn \
  -d api.banyco.vn \
  -d admin.banyco.vn \
  --non-interactive \
  --agree-tos \
  --email sales@banyco.net
```

## 🔍 Kiểm tra DNS

Kiểm tra DNS records hiện tại:

```bash
dig +short banyco.vn
dig +short www.banyco.vn
dig +short api.banyco.vn
dig +short admin.banyco.vn
```

Tất cả nên trả về: `14.225.205.116`

## 📝 Lưu ý

1. **DNS Propagation**: Có thể mất 5-30 phút để DNS propagate
2. **www subdomain**: Không bắt buộc, có thể bỏ qua nếu không cần
3. **Certificate renewal**: Certbot sẽ tự động renew certificates

## ✅ Sau khi setup SSL thành công

1. **Kiểm tra HTTPS:**
   ```bash
   curl -I https://banyco.vn
   curl -I https://api.banyco.vn/api/health
   curl -I https://admin.banyco.vn
   ```

2. **Cập nhật environment variables** (nếu chưa làm):
   - Backend: `FRONTEND_DOMAIN=banyco.vn`, `API_DOMAIN=api.banyco.vn`, `ADMIN_DOMAIN=admin.banyco.vn`
   - Frontend: `NEXT_PUBLIC_API_URL=https://api.banyco.vn/api`

3. **Restart services:**
   ```bash
   pm2 restart cms-backend
   pm2 restart ecommerce-frontend
   pm2 restart cms-admin
   ```

## 🐛 Troubleshooting

### Nếu certbot vẫn fail:

1. **Kiểm tra nginx đang chạy:**
   ```bash
   sudo systemctl status nginx
   ```

2. **Kiểm tra port 80 mở:**
   ```bash
   sudo netstat -tlnp | grep :80
   ```

3. **Kiểm tra firewall:**
   ```bash
   sudo ufw status
   # Nếu cần, mở port 80 và 443:
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

4. **Xem log chi tiết:**
   ```bash
   sudo certbot --nginx -d banyco.vn -v
   ```



