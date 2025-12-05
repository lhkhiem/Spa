# Hướng Dẫn Sử Dụng Script Rebuild & Deploy Production

## 📋 Tổng Quan

Có 4 script để rebuild và deploy từng project riêng biệt đến thư mục `/var/www/publish/spa/`:

1. `rebuild-deploy-cms-admin.sh` - CMS Admin Frontend
2. `rebuild-deploy-cms-backend.sh` - CMS Backend
3. `rebuild-deploy-ecommerce-backend.sh` - Ecommerce Backend
4. `rebuild-deploy-ecommerce-frontend.sh` - Ecommerce Frontend

---

## 🚀 Cách Sử Dụng

### Bước 1: Di chuyển đến thư mục dự án

```bash
cd /var/www/Spa
```

### Bước 2: Set quyền thực thi (chỉ cần làm 1 lần)

```bash
chmod +x rebuild-deploy-*.sh
```

Hoặc set quyền cho từng file:

```bash
chmod +x rebuild-deploy-cms-admin.sh
chmod +x rebuild-deploy-cms-backend.sh
chmod +x rebuild-deploy-ecommerce-backend.sh
chmod +x rebuild-deploy-ecommerce-frontend.sh
```

### Bước 3: Chạy script

#### Deploy CMS Admin Frontend:
```bash
./rebuild-deploy-cms-admin.sh
```

#### Deploy CMS Backend:
```bash
./rebuild-deploy-cms-backend.sh
```

#### Deploy Ecommerce Backend:
```bash
./rebuild-deploy-ecommerce-backend.sh
```

#### Deploy Ecommerce Frontend:
```bash
./rebuild-deploy-ecommerce-frontend.sh
```

---

## 📝 Chi Tiết Từng Script

### 1. rebuild-deploy-cms-admin.sh

**Chức năng:**
- Build Next.js application từ `CMS/frontend/admin`
- Copy `.next`, `public`, và config files
- Install production dependencies
- Restart PM2 service `cms-admin` (nếu đang chạy)

**Output:**
- Source: `/var/www/Spa/CMS/frontend/admin`
- Destination: `/var/www/publish/spa/cms-admin`

**Ví dụ output:**
```
=== Rebuild and Deploy CMS Admin Frontend ===
Source: /var/www/Spa/CMS/frontend/admin
Destination: /var/www/publish/spa/cms-admin

[1/4] Building CMS Admin Frontend...
✓ Build successful

[2/4] Copying files to production...
  ✓ Copied .next
  ✓ Copied public
  ✓ Copied package files

[3/4] Installing production dependencies...
✓ Dependencies installed

[4/4] Restarting PM2 service...
✓ Service restarted

=== Deployment Complete! ===
```

---

### 2. rebuild-deploy-cms-backend.sh

**Chức năng:**
- Build TypeScript backend từ `CMS/backend`
- Copy `dist`, `package.json`, và config files
- Install production dependencies
- Restart PM2 service `cms-backend` (nếu đang chạy)

**Output:**
- Source: `/var/www/Spa/CMS/backend`
- Destination: `/var/www/publish/spa/cms-backend`

**Lưu ý:**
- File `.env` sẽ được copy thành `.env.example` (cần cập nhật thủ công)
- Thư mục `storage/uploads` không được copy (quản lý riêng)

---

### 3. rebuild-deploy-ecommerce-backend.sh

**Chức năng:**
- Build TypeScript backend từ `Ecommerce/backend`
- Copy `dist`, `package.json`, và config files
- Tự động tạo symlink `storage/uploads` → `cms-backend/storage/uploads`
- Install production dependencies
- Restart PM2 service `ecommerce-backend` (nếu đang chạy)

**Output:**
- Source: `/var/www/Spa/Ecommerce/backend`
- Destination: `/var/www/publish/spa/ecommerce-backend`

**Lưu ý:**
- Symlink sẽ tự động được tạo nếu CMS backend storage tồn tại

---

### 4. rebuild-deploy-ecommerce-frontend.sh

**Chức năng:**
- Build Next.js application từ `Ecommerce/frontend`
- Copy `.next`, `public`, và config files
- Install production dependencies
- Restart PM2 service `ecommerce-frontend` (nếu đang chạy)

**Output:**
- Source: `/var/www/Spa/Ecommerce/frontend`
- Destination: `/var/www/publish/spa/ecommerce-frontend`

---

## 🔧 Các Lệnh Hữu Ích

### Kiểm tra trạng thái PM2:
```bash
pm2 list
```

### Xem logs của service:
```bash
# CMS Admin
pm2 logs cms-admin --lines 50

# CMS Backend
pm2 logs cms-backend --lines 50

# Ecommerce Backend
pm2 logs ecommerce-backend --lines 50

# Ecommerce Frontend
pm2 logs ecommerce-frontend --lines 50
```

### Restart service thủ công:
```bash
pm2 restart cms-admin
pm2 restart cms-backend
pm2 restart ecommerce-backend
pm2 restart ecommerce-frontend
```

### Start service thủ công (nếu chưa chạy):
```bash
cd /var/www/publish/spa/cms-admin && npm start
cd /var/www/publish/spa/cms-backend && npm start
cd /var/www/publish/spa/ecommerce-backend && npm start
cd /var/www/publish/spa/ecommerce-frontend && npm start
```

### Kiểm tra file đã deploy:
```bash
ls -lh /var/www/publish/spa/cms-admin/
ls -lh /var/www/publish/spa/cms-backend/
ls -lh /var/www/publish/spa/ecommerce-backend/
ls -lh /var/www/publish/spa/ecommerce-frontend/
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **File .env**: 
   - Script sẽ copy `.env` thành `.env.example`
   - Cần cập nhật file `.env` thực tế trong thư mục publish trước khi chạy

2. **Dependencies**: 
   - Script sẽ tự động install dependencies nếu chưa có
   - Production dependencies sẽ được install trong thư mục publish

3. **PM2 Service**:
   - Script sẽ tự động restart service nếu đang chạy
   - Nếu service chưa chạy, script sẽ bỏ qua và hiển thị cảnh báo

4. **Storage/Uploads**:
   - CMS Backend: `storage/uploads` không được copy (quản lý riêng)
   - Ecommerce Backend: Tự động tạo symlink đến CMS backend storage

5. **Build Errors**:
   - Nếu build thất bại, script sẽ dừng và hiển thị lỗi
   - Kiểm tra logs để xem chi tiết lỗi

---

## 🔄 Quy Trình Deploy Đầy Đủ

### Deploy tất cả 4 projects (theo thứ tự):

```bash
cd /var/www/Spa

# 1. Deploy CMS Backend trước (vì ecommerce-backend cần symlink)
./rebuild-deploy-cms-backend.sh

# 2. Deploy Ecommerce Backend (sẽ tạo symlink đến CMS storage)
./rebuild-deploy-ecommerce-backend.sh

# 3. Deploy CMS Admin
./rebuild-deploy-cms-admin.sh

# 4. Deploy Ecommerce Frontend
./rebuild-deploy-ecommerce-frontend.sh
```

### Hoặc deploy từng project riêng khi cần:

```bash
# Chỉ deploy frontend
./rebuild-deploy-ecommerce-frontend.sh

# Chỉ deploy backend
./rebuild-deploy-ecommerce-backend.sh
```

---

## 🐛 Xử Lý Lỗi

### Lỗi "Permission denied":
```bash
chmod +x rebuild-deploy-*.sh
```

### Lỗi "Build failed":
- Kiểm tra dependencies: `npm install` trong thư mục source
- Kiểm tra lỗi TypeScript/Next.js
- Xem logs chi tiết trong terminal

### Lỗi "Service not found":
- Service chưa được start trong PM2
- Start thủ công: `cd /var/www/publish/spa/[project] && npm start`
- Hoặc dùng PM2: `pm2 start ecosystem.config.js`

### Lỗi "dist/.next not found":
- Build đã thất bại
- Kiểm tra lại quá trình build
- Chạy `npm run build` thủ công để xem lỗi

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Logs của PM2: `pm2 logs [service-name]`
2. Logs của build: Xem output trong terminal
3. Quyền truy cập thư mục: `ls -la /var/www/publish/spa/`
4. Trạng thái services: `pm2 list`


