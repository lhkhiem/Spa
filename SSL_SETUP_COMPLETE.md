# ✅ SSL Setup Hoàn Thành

## 🎉 Kết quả

SSL certificates đã được cài đặt thành công cho:
- ✅ `https://banyco.vn`
- ✅ `https://api.banyco.vn`
- ✅ `https://admin.banyco.vn`

Certificate sẽ tự động renew trước khi hết hạn (2026-02-22).

## 📋 Các bước tiếp theo

### 1. Cập nhật Environment Variables

**Backend** (`CMS/backend/.env`):
```env
FRONTEND_DOMAIN=banyco.vn
API_DOMAIN=api.banyco.vn
ADMIN_DOMAIN=admin.banyco.vn
```

**Frontend Ecommerce** (`Ecommerce/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://api.banyco.vn/api
NEXT_PUBLIC_CMS_BASE_URL=https://api.banyco.vn/api
NEXT_PUBLIC_FRONTEND_DOMAIN=banyco.vn
NEXT_PUBLIC_API_DOMAIN=api.banyco.vn
```

**CMS Admin** (`CMS/frontend/admin/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://api.banyco.vn/api
NEXT_PUBLIC_BACKEND_URL=https://api.banyco.vn/api
```

### 2. Restart Services

```bash
pm2 restart cms-backend
pm2 restart ecommerce-frontend
pm2 restart cms-admin
```

### 3. Thêm www.banyco.vn (Tùy chọn)

Nếu muốn thêm `www.banyco.vn` vào certificate:

**Bước 1: Thêm A record trong DNS management**
- **NAME**: `www`
- **TYPE**: `A` (không phải CNAME)
- **CONTENT**: `14.225.205.116`
- **TTL**: `1 hour`

**Bước 2: Đợi 10-15 phút** để DNS propagate

**Bước 3: Chạy script để thêm www vào certificate**
```bash
cd /var/www/Spa
sudo ./add-www-banyco-vn.sh
```

Hoặc chạy thủ công:
```bash
sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand
```

## 🔍 Kiểm tra

### 1. Kiểm tra HTTPS hoạt động

```bash
curl -I https://banyco.vn
curl -I https://api.banyco.vn/api/health
curl -I https://admin.banyco.vn
```

Tất cả nên trả về HTTP 200 hoặc 301/302 redirect.

### 2. Kiểm tra SSL Certificate

```bash
echo | openssl s_client -servername banyco.vn -connect banyco.vn:443 2>/dev/null | openssl x509 -noout -dates
```

### 3. Kiểm tra từ browser

Mở browser và truy cập:
- `https://banyco.vn` - Should load frontend
- `https://api.banyco.vn/api/health` - Should return JSON
- `https://admin.banyco.vn` - Should load CMS admin login

## 📝 Lưu ý

1. **Certificate Auto-Renewal**: Certbot đã setup tự động renew. Không cần làm gì thêm.

2. **Nginx Configs**: Certbot đã tự động cập nhật nginx configs với SSL paths.

3. **HTTP Redirect**: Tất cả HTTP requests sẽ tự động redirect sang HTTPS.

4. **Environment Variables**: Nhớ cập nhật và restart services sau khi thay đổi.

## 🐛 Troubleshooting

### Nếu website không load qua HTTPS:

1. **Kiểm tra nginx đang chạy:**
   ```bash
   sudo systemctl status nginx
   ```

2. **Kiểm tra nginx config:**
   ```bash
   sudo nginx -t
   ```

3. **Kiểm tra firewall:**
   ```bash
   sudo ufw status
   # Nếu cần, mở port 443:
   sudo ufw allow 443/tcp
   ```

4. **Xem nginx error log:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

### Nếu có lỗi CORS:

- Kiểm tra backend `.env` có đúng domain config
- Restart backend: `pm2 restart cms-backend`

## ✅ Hoàn thành

Sau khi hoàn thành tất cả các bước, bạn sẽ có:
- ✅ HTTPS cho tất cả domains
- ✅ Auto-renewal certificates
- ✅ Environment variables đã cấu hình
- ✅ Services đã restart với config mới



