# Hướng dẫn Cập nhật CORS Configuration

## ✅ Code đã được refactor

CORS configuration trong `CMS/backend/src/app.ts` đã được refactor để:
- ✅ Chỉ dùng biến môi trường (không hardcode domain)
- ✅ Tự động build allowed origins từ domain config
- ✅ Hỗ trợ cả HTTP và HTTPS cho mỗi domain
- ✅ Tự động thêm www subdomain

## 🔧 Cập nhật Environment Variables

### Cách 1: Dùng script tự động (Khuyến nghị)

```bash
cd /var/www/Spa
sudo ./update-cors-config.sh
```

Script sẽ:
- Backup file .env
- Cập nhật domain variables
- Loại bỏ domain cũ
- Comment out old ADMIN_ORIGIN/WEBSITE_ORIGIN nếu có

### Cách 2: Cập nhật thủ công

Mở file `CMS/backend/.env` và cập nhật:

```env
# Domain Configuration (no protocol, no port)
FRONTEND_DOMAIN=banyco.vn
API_DOMAIN=api.banyco.vn
ADMIN_DOMAIN=admin.banyco.vn

# Public IP (optional, for direct IP access)
PUBLIC_IP=14.225.205.116

# Comment out or remove old domains
# ADMIN_ORIGIN=https://admin.banyco-demo.pressup.vn
# WEBSITE_ORIGIN=https://banyco-demo.pressup.vn
```

## 📋 CORS sẽ tự động cho phép

Sau khi cập nhật .env, CORS sẽ tự động cho phép:

### Development
- `http://localhost:3000`
- `http://localhost:3010`
- `http://localhost:3013`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3010`
- `http://127.0.0.1:3013`
- `http://14.225.205.116:3000`
- `http://14.225.205.116:3011`
- `http://14.225.205.116:3013`

### Production (từ biến môi trường)
- `http://banyco.vn`
- `https://banyco.vn`
- `http://www.banyco.vn`
- `https://www.banyco.vn`
- `http://api.banyco.vn`
- `https://api.banyco.vn`
- `http://admin.banyco.vn`
- `https://admin.banyco.vn`

## 🔄 Restart Backend

Sau khi cập nhật .env:

```bash
pm2 restart cms-backend
```

## 🔍 Kiểm tra CORS

### 1. Kiểm tra từ browser console

Mở browser và truy cập `https://banyco.vn`, mở console và kiểm tra không có lỗi CORS.

### 2. Kiểm tra từ curl

```bash
# Test từ frontend domain
curl -H "Origin: https://banyco.vn" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.banyco.vn/api/health \
     -v

# Should return 200 OK with CORS headers
```

### 3. Kiểm tra backend logs

```bash
pm2 logs cms-backend | grep CORS
```

Nếu có origin bị chặn, sẽ thấy log: `[CORS] Origin not allowed: ...`

## 🐛 Troubleshooting

### Nếu vẫn có lỗi CORS:

1. **Kiểm tra .env có đúng domain:**
   ```bash
   grep -E "^(FRONTEND_DOMAIN|API_DOMAIN|ADMIN_DOMAIN)=" CMS/backend/.env
   ```

2. **Kiểm tra backend đã restart:**
   ```bash
   pm2 status cms-backend
   ```

3. **Kiểm tra allowed origins trong code:**
   - Code đã tự động build từ biến môi trường
   - Không cần sửa code, chỉ cần cập nhật .env

4. **Xem CORS logs:**
   ```bash
   pm2 logs cms-backend --lines 50 | grep -i cors
   ```

### Nếu muốn thêm domain tạm thời:

Có thể thêm vào .env:
```env
ADMIN_ORIGIN=https://admin.banyco-demo.pressup.vn
WEBSITE_ORIGIN=https://banyco-demo.pressup.vn
```

Code sẽ tự động thêm vào allowed origins (legacy support).

## ✅ Sau khi hoàn thành

1. ✅ CORS chỉ dùng domain mới (banyco.vn)
2. ✅ Domain cũ đã được loại bỏ
3. ✅ Backend đã restart với config mới
4. ✅ Không còn lỗi CORS



