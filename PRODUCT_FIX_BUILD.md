# Hướng dẫn Build lại sau khi sửa lỗi Product Duplicate & Delete

## Đã sửa

### 1. Lỗi Duplicate Product (500 Internal Server Error)
- ✅ Loại bỏ JOIN với `category_id` deprecated trong query
- ✅ Thêm error handling để logging/metadata sync không làm fail duplicate
- ✅ Thêm metadata sync cho product đã duplicate
- ✅ Thêm null checks và default values

### 2. Lỗi Delete Product (báo lỗi nhưng vẫn xóa được)
- ✅ Lấy thông tin product trước khi xóa
- ✅ Đảm bảo luôn trả về success nếu product đã xóa thành công
- ✅ Cleanup operations (metadata, logging) không làm fail delete

## Cách build lại cho production

### Option 1: Sử dụng script tự động
```bash
cd /var/www/Spa
bash rebuild-backend.sh
```

### Option 2: Build thủ công

#### 1. Build Backend
```bash
cd /var/www/Spa/CMS/backend
npm run build
```

#### 2. Restart PM2 services
```bash
pm2 restart cms-backend
```

#### 3. Kiểm tra logs
```bash
pm2 logs cms-backend --lines 50
```

### Option 3: Build tất cả (Backend + Frontend)
```bash
cd /var/www/Spa
bash build-production.sh
```

Sau đó restart tất cả services:
```bash
pm2 restart all
```

## Kiểm tra sau khi build

1. **Kiểm tra backend đã build:**
   ```bash
   ls -la /var/www/Spa/CMS/backend/dist/controllers/productController.js
   ```

2. **Kiểm tra PM2 status:**
   ```bash
   pm2 status
   ```

3. **Test duplicate product:**
   - Vào admin panel: https://admin.banyco.vn/dashboard/products
   - Click nút duplicate (Copy icon) trên một product
   - Không còn lỗi 500, product được duplicate thành công

4. **Test delete product:**
   - Click nút delete (Trash icon) trên một product
   - Product được xóa thành công, không hiển thị lỗi

## Files đã thay đổi

- `/var/www/Spa/CMS/backend/src/controllers/productController.ts`
  - Function `duplicateProduct()` - lines 846-931
  - Function `deleteProduct()` - lines 604-676

## Lưu ý

- Backend cần được build lại (TypeScript → JavaScript)
- Frontend không cần build lại vì không có thay đổi
- Nếu vẫn thấy lỗi, clear browser cache (Ctrl+Shift+R)
