# Fix Login CMS - Tóm Tắt

## Vấn đề
Khi truy cập website qua IP public (14.225.205.116:3000), login không hoạt động do:
1. Frontend config API URL là `http://localhost:3011/api` - chỉ hoạt động khi truy cập localhost
2. Backend CORS chỉ cho phép `http://localhost:3000`
3. Backend route `/api/public/auth` bị disable

## Các thay đổi đã thực hiện

### 1. Frontend - Ecommerce/.env.local
**Trước:**
```
NEXT_PUBLIC_API_URL=http://localhost:3011/api
NEXT_PUBLIC_CMS_BASE_URL=http://localhost:3011/api
```

**Sau:**
```
NEXT_PUBLIC_API_URL=http://14.225.205.116:3011/api
NEXT_PUBLIC_CMS_BASE_URL=http://14.225.205.116:3011/api
```

### 2. Backend - CMS/backend/.env
**Trước:**
```
WEBSITE_ORIGIN=http://localhost:3000
```

**Sau:**
```
WEBSITE_ORIGIN=http://14.225.205.116:3000
BASE_URL=http://14.225.205.116:3011
API_BASE_URL=http://14.225.205.116:3011
```

### 3. Backend - CMS/backend/src/app.ts
**Enable public auth routes:**
```typescript
// Import
import publicAuthRoutes from './routes/publicAuth'; // Customer authentication

// Routes
app.use('/api/public/auth', publicAuthRoutes); // Customer authentication
```

## Test credentials
- Email: `testuser@gmail.com`
- Password: `password123`

## Truy cập
- Frontend: http://14.225.205.116:3000/login
- Backend API: http://14.225.205.116:3011/api

## Lưu ý quan trọng

### Khi deploy production
Thay đổi IP trong các file sau:
1. `/var/www/Spa/Ecommerce/.env.local` - Update NEXT_PUBLIC_API_URL
2. `/var/www/Spa/CMS/backend/.env` - Update WEBSITE_ORIGIN, BASE_URL, API_BASE_URL

### Khi phát triển local
Nếu muốn dev trên localhost, đổi lại các URL về localhost trong 2 file trên.

### Restart services sau khi thay đổi .env
```bash
# Restart Backend
cd /var/www/Spa/CMS/backend
pkill -f "ts-node.*backend"
nohup npm run dev > backend.log 2>&1 &

# Restart Frontend
cd /var/www/Spa/Ecommerce
pkill -f "next.*Ecommerce"
rm -rf .next  # Clear cache
nohup npm run dev > frontend.log 2>&1 &
```

## CORS Configuration
Backend hiện cho phép CORS từ:
- http://14.225.205.116:3000 (Website)
- http://14.225.205.116:3011 (API)
- http://14.225.205.116:3013 (Admin)
- http://localhost:3000, 3010, 3013 (Development)

## Backup files
- `/var/www/Spa/Ecommerce/.env.local.backup` (nếu cần rollback)
