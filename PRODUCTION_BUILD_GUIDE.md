# Hướng dẫn Build Production

## Tổng quan
Project có 3 phần cần build:
1. **CMS Backend** (TypeScript/Express) - Port 3011
2. **Ecommerce Frontend** (Next.js) - Port 3000
3. **CMS Admin Frontend** (Next.js) - Port 3013

## Cách 1: Build tự động (Khuyến nghị)

### Bước 1: Build tất cả
```bash
cd /var/www/Spa
bash build-production.sh
```

Script này sẽ:
- ✅ Build backend TypeScript → `CMS/backend/dist/`
- ✅ Build Ecommerce Next.js → `Ecommerce/.next/`
- ✅ Build CMS Admin Next.js → `CMS/frontend/admin/.next/`
- ✅ Kiểm tra và báo lỗi nếu có

### Bước 2: Start production mode
```bash
bash start-production.sh
```

Script này sẽ:
- ✅ Stop các process cũ
- ✅ Start backend với `npm start`
- ✅ Start Ecommerce với `npm start`
- ✅ Start CMS Admin với `npm start`
- ✅ Quản lý bằng PM2

## Cách 2: Build thủ công

### 1. Build Backend
```bash
cd /var/www/Spa/CMS/backend
npm install  # Nếu chưa install
npm run build
# Output: dist/ directory
```

### 2. Build Ecommerce Frontend
```bash
cd /var/www/Spa/Ecommerce
npm install  # Nếu chưa install
NODE_ENV=production npm run build
# Output: .next/ directory
```

### 3. Build CMS Admin Frontend
```bash
cd /var/www/Spa/CMS/frontend/admin
npm install  # Nếu chưa install
NODE_ENV=production npm run build
# Output: .next/ directory
```

## Start Production Mode

### Với PM2 (Khuyến nghị)
```bash
# Backend
cd /var/www/Spa/CMS/backend
pm2 start npm --name "cms-backend" -- start

# Ecommerce
cd /var/www/Spa/Ecommerce
pm2 start npm --name "ecommerce-frontend" -- start

# CMS Admin
cd /var/www/Spa/CMS/frontend/admin
pm2 start npm --name "cms-admin" -- start

# Save PM2 config
pm2 save
```

### Hoặc chạy trực tiếp
```bash
# Backend
cd /var/www/Spa/CMS/backend
npm start

# Ecommerce (terminal mới)
cd /var/www/Spa/Ecommerce
npm start

# CMS Admin (terminal mới)
cd /var/www/Spa/CMS/frontend/admin
npm start
```

## Kiểm tra

### Kiểm tra services
```bash
pm2 status
pm2 logs
```

### Kiểm tra ports
```bash
# Backend
curl http://localhost:3011/api/health

# Ecommerce
curl http://localhost:3000

# CMS Admin
curl http://localhost:3013
```

## Lưu ý

### Environment Variables
Đảm bảo các file `.env` và `.env.local` đã được cấu hình đúng:
- `CMS/backend/.env` - Database, JWT secrets, etc.
- `Ecommerce/.env.local` - `NEXT_PUBLIC_API_URL`
- `CMS/frontend/admin/.env.local` - `NEXT_PUBLIC_API_URL`

### Production Optimizations
- Next.js tự động optimize trong production build
- Backend TypeScript được compile sang JavaScript
- Static assets được optimize và minify

### Troubleshooting

#### Build fails
- Kiểm tra Node.js version: `node --version` (nên >= 18)
- Xóa `node_modules` và `package-lock.json`, chạy lại `npm install`
- Kiểm tra disk space: `df -h`

#### Port already in use
```bash
# Tìm process đang dùng port
lsof -i :3000
lsof -i :3011
lsof -i :3013

# Kill process
kill -9 <PID>
```

#### PM2 issues
```bash
# Xóa tất cả processes
pm2 delete all

# Restart
pm2 restart all

# View logs
pm2 logs --lines 50
```

