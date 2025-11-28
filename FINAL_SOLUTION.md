# Giải pháp cuối cùng - Normalize ngay từ database

## Vấn đề
Object với `usage`, `summary`, `highlights` vẫn lọt qua dù đã stringify nhiều lần. Có thể vấn đề là:
- PostgreSQL trả về JSONB fields như objects
- Object này được dùng trực tiếp từ query result
- Cần normalize ngay khi lấy từ database

## Giải pháp mới
1. **Normalize ngay khi lấy từ database**: Sau khi query, normalize TẤT CẢ các fields là objects
2. **Xử lý aggressive hơn**: Stringify bất kỳ object nào (trừ Date, Buffer)
3. **Double-check trước khi insert**: Kiểm tra lại một lần nữa

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

Sẽ thấy:
- `Normalized X from object to JSON string` - nếu có object được normalize
- `Stringified X` - nếu có object được stringify ở bước cuối
- `ERROR: Still found object` - nếu vẫn còn object (không nên có)

## Kết quả mong đợi
- Tất cả objects được normalize ngay từ database
- Không còn object nào lọt qua
- Logs chi tiết để debug
