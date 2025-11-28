# Fix CORS Errors - Hướng dẫn

## 🔍 Vấn đề

Frontend đang gọi API từ domain cũ (`banyco-demo.pressup.vn`) nên bị lỗi CORS. Cần cập nhật environment variables.

## ✅ Giải pháp

### Chạy script tự động

```bash
cd /var/www/Spa
./fix-cors-and-env.sh
```

Script sẽ:
1. Cập nhật `Ecommerce/.env.local` với API URL mới
2. Cập nhật `CMS/backend/.env` với domain config mới
3. Loại bỏ domain cũ

### Hoặc cập nhật thủ công

#### 1. Frontend (`Ecommerce/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://api.banyco.vn/api
NEXT_PUBLIC_CMS_BASE_URL=https://api.banyco.vn/api
NEXT_PUBLIC_FRONTEND_DOMAIN=banyco.vn
NEXT_PUBLIC_API_DOMAIN=api.banyco.vn
```

#### 2. Backend (`CMS/backend/.env`)

```env
FRONTEND_DOMAIN=banyco.vn
API_DOMAIN=api.banyco.vn
ADMIN_DOMAIN=admin.banyco.vn
PUBLIC_IP=14.225.205.116
```

## 🔄 Sau khi cập nhật

### 1. Rebuild Frontend

```bash
cd /var/www/Spa/Ecommerce
npm run build
```

### 2. Restart Services

```bash
pm2 restart cms-backend
pm2 restart ecommerce-frontend
```

## 🔍 Kiểm tra

### 1. Kiểm tra API hoạt động

```bash
curl https://api.banyco.vn/api/health
```

### 2. Kiểm tra CORS từ browser

Mở `https://banyco.vn` và kiểm tra console không còn lỗi CORS.

### 3. Kiểm tra backend logs

```bash
pm2 logs cms-backend | grep CORS
```

Nếu có origin bị chặn, sẽ thấy log: `[CORS] Origin not allowed: ...`

## 📝 Lưu ý

- Frontend cần rebuild sau khi thay đổi .env.local
- Backend cần restart sau khi thay đổi .env
- CORS sẽ tự động cho phép các domain từ biến môi trường



