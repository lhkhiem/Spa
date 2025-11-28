# Fix cuối cùng cho Attributes

## Vấn đề
Lỗi vẫn còn ở dòng 696 trong file compiled, có thể do:
1. `attr.name` cũng có thể là object
2. Cần thêm error handling tốt hơn
3. Cần logging để debug

## Đã sửa
- ✅ Stringify cả `attr.name` và `attr.value` nếu là objects
- ✅ Thêm try-catch cho từng attribute để không fail toàn bộ
- ✅ Thêm logging chi tiết để debug

## Build lại
```bash
cd /var/www/Spa/CMS/backend
npm run build
pm2 restart cms-backend
```

## Kiểm tra logs
```bash
pm2 logs cms-backend | grep duplicateProduct
```

Sau khi build, logs sẽ hiển thị chi tiết về từng attribute được copy, giúp xác định chính xác attribute nào gây lỗi.
