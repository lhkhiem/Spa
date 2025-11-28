# Sửa lỗi Attribute Value Object

## Vấn đề
Lỗi "Invalid value" với object có `usage`, `summary`, `highlights` có thể đến từ `product_attributes.value` field, không phải từ `content` hoặc `seo`.

## Đã sửa
- ✅ Thêm stringify cho `attr.value` khi copy attributes
- ✅ Sử dụng helper function `stringifyIfObject()` đã có sẵn

## Build lại
```bash
cd /var/www/Spa/CMS/backend
npm run build
pm2 restart cms-backend
```

## Test
Sau khi build, test duplicate sản phẩm có attributes với value là object.
