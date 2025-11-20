# Domain Setup Guide - banyco-demo.pressup.vn

## 1. Frontend Environment Variables

### Ecommerce Frontend (.env.local)
Tạo/cập nhật file: `/var/www/Spa/Ecommerce/.env.local`

```bash
# For localhost development
NEXT_PUBLIC_API_URL=http://localhost:3011/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# For production domain (uncomment when deploying)
# NEXT_PUBLIC_API_URL=http://banyco-demo.pressup.vn/api
# NEXT_PUBLIC_SITE_URL=http://banyco-demo.pressup.vn
```

### CMS Admin Frontend (.env.local)
Tạo/cập nhật file: `/var/www/Spa/CMS/frontend/admin/.env.local`

```bash
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:3011/api

# For production
# NEXT_PUBLIC_API_URL=http://banyco-demo.pressup.vn/api
```

## 2. Backend Environment Variables

Cập nhật file: `/var/www/Spa/CMS/backend/.env`

Thêm vào cuối file:
```bash
# Domain configuration
WEBSITE_ORIGIN=http://banyco-demo.pressup.vn
ADMIN_ORIGIN=http://localhost:3013
```

## 3. Nginx Configuration

Đảm bảo Nginx proxy đúng:

```nginx
# Ecommerce Frontend - Port 3000
server {
    listen 80;
    server_name banyco-demo.pressup.vn;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API Backend - Port 3011
    location /api/ {
        proxy_pass http://localhost:3011/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4. Restart Services

```bash
# Restart backend
cd /var/www/Spa/CMS/backend
pm2 restart spa-backend

# Restart frontend
cd /var/www/Spa/Ecommerce
pm2 restart spa-frontend

# Hoặc nếu dùng npm
npm run dev
```

## 5. Testing

### Localhost:
- Frontend: http://localhost:3000
- API: http://localhost:3011/api/health
- CMS: http://localhost:3013

### Domain:
- Frontend: http://banyco-demo.pressup.vn
- API: http://banyco-demo.pressup.vn/api/health

## 6. Dynamic Configuration (Recommended)

Frontend đã được cấu hình để tự động detect:
- Khi truy cập qua `localhost` → dùng `localhost:3011` API
- Khi truy cập qua domain → dùng `{same-domain}/api`

Điều này được xử lý trong `config/site.ts`:
```typescript
const resolveApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3011/api`; // Will use same hostname
  }
  return 'http://localhost:3011/api';
};
```

