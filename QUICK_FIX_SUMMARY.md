# Tóm tắt nhanh - Kiểm tra và sửa lỗi

## 1. Kiểm tra SEO Settings

### Cách nhanh nhất - Dùng script:
```bash
cd /var/www/Spa/CMS/backend
node check-seo.js
```

### Hoặc dùng psql:
```bash
psql -h localhost -U spa_cms_user -d spa_cms_db -c "SELECT jsonb_pretty(value) FROM settings WHERE namespace = 'seo';"
```

## 2. Kiểm tra lỗi duplicate product

### Xem logs chi tiết:
```bash
pm2 logs cms-backend | grep -A 10 duplicateProduct
```

### Kiểm tra code đã được build chưa:
```bash
cd /var/www/Spa/CMS/backend
grep -n "Normalized\|stringifyIfObject" dist/controllers/productController.js
```

Nếu không có output → Code chưa được build lại!

## 3. Build lại nếu cần

```bash
cd /var/www/Spa/CMS/backend
npm run build
pm2 restart cms-backend
```

## 4. Test lại

1. **Kiểm tra SEO trước:**
   ```bash
   node check-seo.js
   ```
   Ghi lại số static pages.

2. **Duplicate một product**

3. **Kiểm tra SEO sau:**
   ```bash
   node check-seo.js
   ```
   Số static pages phải giữ nguyên.

4. **Kiểm tra logs:**
   ```bash
   pm2 logs cms-backend | grep -E "duplicateProduct|syncProductMetadata"
   ```

## 5. Nếu vẫn có lỗi

### Lỗi duplicate:
- Kiểm tra logs để xem object nào còn sót lại
- Xem có log "Normalized X from object" không

### SEO bị xóa:
- Kiểm tra logs có "WARNING: Lost static pages" không
- Nếu có → Code đã throw error và không save (tốt!)
- Nếu không có warning nhưng vẫn bị xóa → Có vấn đề khác
