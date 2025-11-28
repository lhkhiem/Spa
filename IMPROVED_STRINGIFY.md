# Cải thiện stringifyIfObject function

## Vấn đề
Function `stringifyIfObject` có thể không xử lý đúng một số edge cases:
- Date objects
- Special objects
- Circular references
- Objects với toJSON methods

## Đã cải thiện
- ✅ Xử lý string đơn giản hơn (không cần parse JSON)
- ✅ Xử lý primitives (number, boolean) trước
- ✅ Try-catch khi stringify để tránh crash
- ✅ Fallback với toString() nếu stringify fail

## Build lại
```bash
cd /var/www/Spa/CMS/backend
npm run build
pm2 restart cms-backend
```

## Kiểm tra logs
Sau khi build, logs sẽ hiển thị:
- Types của content, seo, description trước khi insert
- Chi tiết lỗi nếu có

```bash
pm2 logs cms-backend | grep duplicateProduct
```
