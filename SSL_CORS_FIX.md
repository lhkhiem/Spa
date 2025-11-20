# Sửa lỗi sau khi cấu hình SSL

## Vấn đề:
Sau khi cấu hình SSL, có lỗi "không kết nối được db" và CORS errors.

## Nguyên nhân:
1. **CORS**: Backend chưa có HTTPS origins trong allowedOrigins
2. **Database**: Thực ra database vẫn hoạt động tốt, lỗi chủ yếu là CORS

## Giải pháp đã áp dụng:

### 1. Cập nhật CORS trong backend (`CMS/backend/src/app.ts`):
- ✅ Thêm `https://api.banyco-demo.pressup.vn` vào allowedOrigins
- ✅ Thêm logging để debug CORS issues
- ✅ Đã có sẵn các HTTPS origins khác

### 2. Cập nhật .env (`CMS/backend/.env`):
- ✅ Thêm `ADMIN_ORIGIN=https://admin.banyco-demo.pressup.vn`
- ✅ Thêm `WEBSITE_ORIGIN=https://banyco-demo.pressup.vn`

### 3. Restart backend:
- ✅ Đã restart với `--update-env` để load env mới

## Kiểm tra:

### Database connection:
```bash
curl http://localhost:3011/api/health/db
# Kết quả: {"ok":true} ✅
```

### CORS origins hiện tại:
- ✅ `https://banyco-demo.pressup.vn`
- ✅ `https://admin.banyco-demo.pressup.vn`
- ✅ `https://api.banyco-demo.pressup.vn`
- ✅ Các HTTP origins vẫn được giữ để backward compatibility

## Cần làm thêm:

1. **Cập nhật frontend .env để dùng HTTPS**:
   - Ecommerce: `/var/www/Spa/Ecommerce/.env.local`
   - CMS Admin: `/var/www/Spa/CMS/frontend/admin/.env.local`

2. **Kiểm tra lại website**:
   - Truy cập https://banyco-demo.pressup.vn
   - Kiểm tra console browser xem còn CORS errors không

3. **Nếu vẫn có lỗi**:
   - Kiểm tra log: `pm2 logs cms --lines 50`
   - Xem CORS warnings trong log để biết origin nào bị block

