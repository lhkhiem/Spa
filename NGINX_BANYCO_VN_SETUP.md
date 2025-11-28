# Hướng dẫn Setup Nginx cho banyco.vn

## ✅ Đã tạo các file config

1. **banyco.vn** (Main domain - Frontend + API)
   - File: `/var/www/Spa/nginx-banyco-vn.conf`
   - Port 3000: Frontend Ecommerce
   - Port 3011: Backend API (via `/api/`)

2. **api.banyco.vn** (API subdomain)
   - File: `/var/www/Spa/nginx-api-banyco-vn.conf`
   - Port 3011: Backend API

3. **admin.banyco.vn** (Admin subdomain)
   - File: `/var/www/Spa/nginx-admin-banyco-vn.conf`
   - Port 3013: CMS Admin Frontend
   - Port 3011: Backend API (via `/api/`)

## 🚀 Cách chạy setup

```bash
cd /var/www/Spa
sudo ./setup-nginx-banyco-vn.sh
```

Script sẽ:
1. Copy config files vào `/etc/nginx/sites-available/`
2. Tạo symlinks trong `/etc/nginx/sites-enabled/`
3. Test nginx configuration
4. Reload nginx nếu test thành công

## 📋 Các bước tiếp theo

### 1. Kiểm tra DNS Records

Đảm bảo các DNS records đã được cấu hình:

```
A record: banyco.vn -> 14.225.205.116
A record: www.banyco.vn -> 14.225.205.116
A record: api.banyco.vn -> 14.225.205.116
A record: admin.banyco.vn -> 14.225.205.116
```

Kiểm tra DNS:
```bash
dig banyco.vn
dig api.banyco.vn
dig admin.banyco.vn
```

### 2. Setup SSL Certificates

Sau khi DNS đã propagate (thường 5-30 phút), chạy certbot:

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

Certbot sẽ tự động:
- Tạo SSL certificates
- Cập nhật nginx configs với SSL paths
- Reload nginx

### 3. Cập nhật Environment Variables

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

### 4. Restart Services

```bash
pm2 restart cms-backend
pm2 restart ecommerce-frontend
pm2 restart cms-admin
```

## 🔍 Kiểm tra

Sau khi setup xong, kiểm tra:

1. **HTTP redirects to HTTPS:**
   ```bash
   curl -I http://banyco.vn
   # Should return 301 redirect to https://
   ```

2. **HTTPS works:**
   ```bash
   curl -I https://banyco.vn
   curl -I https://api.banyco.vn/api/health
   curl -I https://admin.banyco.vn
   ```

3. **Frontend loads:**
   - Mở browser: `https://banyco.vn`
   - Kiểm tra console không có lỗi CORS

4. **API works:**
   - Mở browser: `https://api.banyco.vn/api/health`
   - Should return JSON response

5. **Admin works:**
   - Mở browser: `https://admin.banyco.vn`
   - Should load CMS admin login page

## 📝 Cấu trúc Nginx Configs

### banyco.vn
- **Port 80**: Redirect to HTTPS + Let's Encrypt challenge
- **Port 443**: 
  - `/` → Frontend (port 3000)
  - `/api/` → Backend API (port 3011)
  - `/uploads/` → Static files (port 3011)

### api.banyco.vn
- **Port 80**: Redirect to HTTPS + Let's Encrypt challenge
- **Port 443**: 
  - `/` → Backend API (port 3011)
  - `/uploads/` → Static files (port 3011)

### admin.banyco.vn
- **Port 80**: Redirect to HTTPS + Let's Encrypt challenge
- **Port 443**: 
  - `/` → CMS Admin Frontend (port 3013)
  - `/api/` → Backend API (port 3011)
  - `/uploads/` → Static files (port 3011)

## ⚠️ Lưu ý

1. **SSL certificates**: Chỉ setup sau khi DNS đã propagate
2. **Environment variables**: Cần restart services sau khi cập nhật
3. **CORS**: Backend sẽ tự động build allowed origins từ domain config
4. **Upload size**: Đã set limit 100MB cho admin và API

## 🐛 Troubleshooting

### Nginx test fails
```bash
sudo nginx -t
# Check error messages and fix config files
```

### DNS not resolving
```bash
# Wait for DNS propagation (5-30 minutes)
# Check with: dig banyco.vn
```

### SSL certificate fails
```bash
# Make sure DNS is pointing correctly
# Make sure port 80 is accessible
# Check nginx is running: sudo systemctl status nginx
```

### CORS errors
- Check backend `.env` has correct domain config
- Check frontend `.env.local` has correct API URL
- Restart backend: `pm2 restart cms-backend`



