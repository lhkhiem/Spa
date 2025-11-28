# Cần build lại ngay!

## Vấn đề
Code đã được sửa nhưng chưa được build lại, nên lỗi vẫn còn trong production.

## Cách build

```bash
cd /var/www/Spa/CMS/backend
npm run build
pm2 restart cms-backend
```

## Kiểm tra build thành công

```bash
# Kiểm tra file đã được build
ls -la dist/controllers/productController.js

# Kiểm tra PM2
pm2 status

# Xem logs
pm2 logs cms-backend --lines 20
```

## Sau khi build

Test lại duplicate sản phẩm có content/seo là object. Lỗi "Invalid value" sẽ được fix.
