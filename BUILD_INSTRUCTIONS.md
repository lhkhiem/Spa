# Hướng dẫn Build và Restart Backend

## Đã sửa các lỗi:

1. ✅ **Lỗi Duplicate Product (500 Error)**
   - Loại bỏ JOIN với `category_id` deprecated
   - Thêm error handling cho logging và metadata sync
   - Đảm bảo duplicate thành công ngay cả khi các thao tác phụ fail

2. ✅ **Lỗi Delete Product (báo lỗi nhưng vẫn xóa được)**
   - Lấy thông tin product trước khi xóa
   - Luôn trả về success nếu product đã xóa thành công
   - Cleanup operations không làm fail delete

3. ✅ **Lỗi TypeScript trong zalopay.ts**
   - Thêm interface `ZaloPayResponse`
   - Type assertion cho AxiosError

## Cách build và restart:

### Cách 1: Sử dụng script tự động (Khuyến nghị)

```bash
cd /var/www/Spa
bash build-and-restart.sh
```

### Cách 2: Build thủ công từng bước

#### Bước 1: Build Backend
```bash
cd /var/www/Spa/CMS/backend
npm run build
```

#### Bước 2: Kiểm tra build thành công
```bash
ls -la dist/controllers/productController.js
```

Nếu file tồn tại, build đã thành công.

#### Bước 3: Restart PM2
```bash
pm2 restart cms-backend
```

Hoặc nếu service chưa chạy:
```bash
cd /var/www/Spa
pm2 start ecosystem.config.js --only cms-backend
```

#### Bước 4: Kiểm tra status và logs
```bash
# Kiểm tra status
pm2 status

# Xem logs
pm2 logs cms-backend --lines 50

# Xem logs real-time
pm2 logs cms-backend
```

### Cách 3: Build tất cả (nếu cần)

```bash
cd /var/www/Spa
bash build-production.sh
pm2 restart all
```

## Kiểm tra sau khi build:

1. **Kiểm tra backend đã build:**
   ```bash
   ls -la /var/www/Spa/CMS/backend/dist/controllers/productController.js
   ```

2. **Kiểm tra PM2:**
   ```bash
   pm2 status
   ```
   Phải thấy `cms-backend` đang chạy (status: online)

3. **Test duplicate product:**
   - Vào: https://admin.banyco.vn/dashboard/products
   - Click nút duplicate (Copy icon) trên một product
   - ✅ Không còn lỗi 500
   - ✅ Product được duplicate thành công
   - ✅ Redirect đến trang edit của product mới

4. **Test delete product:**
   - Click nút delete (Trash icon) trên một product
   - ✅ Product được xóa thành công
   - ✅ Không hiển thị lỗi
   - ✅ Product biến mất khỏi danh sách

## Files đã thay đổi:

- `/var/www/Spa/CMS/backend/src/controllers/productController.ts`
  - `duplicateProduct()` - lines 707-962
  - `deleteProduct()` - lines 604-676

- `/var/www/Spa/CMS/backend/src/services/zalopay.ts`
  - Thêm interface `ZaloPayResponse`
  - Fix type assertion cho refund error handler

## Troubleshooting:

### Nếu build fail:
```bash
cd /var/www/Spa/CMS/backend
npm install  # Reinstall dependencies
npm run build
```

### Nếu PM2 không restart:
```bash
pm2 delete cms-backend
cd /var/www/Spa
pm2 start ecosystem.config.js --only cms-backend
```

### Nếu vẫn thấy lỗi duplicate:
1. Clear browser cache (Ctrl+Shift+R)
2. Kiểm tra logs: `pm2 logs cms-backend --lines 100`
3. Kiểm tra network tab trong browser console

### Nếu có lỗi TypeScript:
```bash
cd /var/www/Spa/CMS/backend
npx tsc --noEmit  # Check for TypeScript errors
```

## Lưu ý:

- Backend phải được build lại sau mỗi lần sửa TypeScript code
- Frontend không cần build lại vì không có thay đổi
- Nếu vẫn thấy lỗi, kiểm tra logs để xem chi tiết lỗi
