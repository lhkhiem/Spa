# Sửa lỗi Duplicate cho sản phẩm cụ thể

## Vấn đề
Sản phẩm "Máy Massage Cầm Tay Banyco Bio N91" (SKU: `N91 10001000`) không thể duplicate được, trong khi các sản phẩm khác hoạt động bình thường.

## Nguyên nhân có thể
1. **SKU có khoảng trắng**: SKU `N91 10001000` có khoảng trắng, có thể gây vấn đề khi generate SKU mới
2. **Infinite loop**: Vòng lặp while(true) có thể bị infinite nếu SKU đã tồn tại nhiều lần
3. **Constraint violation**: Có thể có unique constraint trên SKU hoặc slug
4. **Null values**: Một số trường có thể null và gây lỗi khi insert

## Đã sửa

### 1. Cải thiện xử lý SKU
- ✅ Normalize SKU: loại bỏ khoảng trắng thừa, chuẩn hóa format
- ✅ Thêm max retries (100 lần) để tránh infinite loop
- ✅ Fallback: nếu không generate được unique SKU, dùng timestamp-based SKU

### 2. Cải thiện error handling
- ✅ Thêm logging chi tiết ở mỗi bước
- ✅ Xử lý constraint violations cụ thể (unique, foreign key)
- ✅ Thông báo lỗi rõ ràng hơn cho user
- ✅ Xử lý null values tốt hơn

### 3. Cải thiện slug generation
- ✅ Thêm max retries để tránh infinite loop
- ✅ Error message rõ ràng nếu không generate được

## Code changes

**File:** `CMS/backend/src/controllers/productController.ts`

**Key improvements:**
1. SKU normalization: `String(originalProduct.sku).trim().replace(/\s+/g, ' ')`
2. Max retries cho slug và SKU generation
3. Timestamp-based fallback cho SKU
4. Chi tiết logging để debug
5. Better error messages

## Cách build và test

### 1. Build backend
```bash
cd /var/www/Spa/CMS/backend
npm run build
```

### 2. Restart PM2
```bash
pm2 restart cms-backend
```

### 3. Kiểm tra logs
```bash
pm2 logs cms-backend --lines 100
```

### 4. Test duplicate sản phẩm
1. Vào: https://admin.banyco.vn/dashboard/products
2. Tìm sản phẩm "Máy Massage Cầm Tay Banyco Bio N91"
3. Click nút duplicate (Copy icon)
4. Kiểm tra:
   - ✅ Không còn lỗi
   - ✅ Product được duplicate thành công
   - ✅ SKU mới được generate đúng (ví dụ: `N91 10001000-COPY`)

### 5. Kiểm tra logs nếu vẫn có lỗi
```bash
pm2 logs cms-backend | grep duplicateProduct
```

Logs sẽ hiển thị:
- Product ID đang duplicate
- Original product name và SKU
- Generated slug và SKU
- Lỗi cụ thể nếu có

## Troubleshooting

### Nếu vẫn không duplicate được:

1. **Kiểm tra logs:**
   ```bash
   pm2 logs cms-backend --lines 200 | grep -A 10 duplicateProduct
   ```

2. **Kiểm tra SKU đã tồn tại:**
   ```sql
   SELECT id, name, sku FROM products WHERE sku LIKE 'N91 10001000%';
   ```

3. **Kiểm tra slug đã tồn tại:**
   ```sql
   SELECT id, name, slug FROM products WHERE slug LIKE 'may-massage-cam-tay-banyco-bio-n91%';
   ```

4. **Kiểm tra constraints:**
   ```sql
   \d products  -- PostgreSQL
   SHOW CREATE TABLE products;  -- MySQL
   ```

### Nếu SKU đã tồn tại nhiều lần:
- Code sẽ tự động thêm số: `N91 10001000-COPY1`, `N91 10001000-COPY2`, etc.
- Nếu vẫn không được, sẽ dùng timestamp: `N91 10001000-COPY-1234567890`

## Expected behavior

Sau khi sửa:
- ✅ Sản phẩm "Máy Massage Cầm Tay Banyco Bio N91" có thể duplicate được
- ✅ SKU được generate đúng: `N91 10001000-COPY` (hoặc với số nếu đã tồn tại)
- ✅ Slug được generate đúng: `may-massage-cam-tay-banyco-bio-n91-copy`
- ✅ Logs chi tiết để debug nếu có vấn đề

## Notes

- Code đã xử lý các edge cases:
  - SKU có khoảng trắng
  - SKU đã tồn tại nhiều lần
  - Slug đã tồn tại nhiều lần
  - Null values trong các trường
  - Constraint violations

- Logging chi tiết giúp debug dễ dàng hơn
