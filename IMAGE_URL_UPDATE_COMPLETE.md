# Image URL Update Complete ✅

## Vấn đề

Sau khi thay đổi domain từ `banyco-demo.pressup.vn` và IP `14.225.205.116` sang `api.banyco.vn`, các URL hình ảnh trong database vẫn trỏ đến domain/IP cũ.

## Đã thực hiện

### 1. Tạo SQL Script (`update-image-urls.sql`)
- Update `assets` table: `url`, `cdn_url`, và `sizes` JSONB
- Update `education_resources` table: `image_url`
- Update `about_sections` table: `image_url`
- Thay thế tất cả domain/IP cũ bằng `https://api.banyco.vn`

### 2. Chạy Script
- Đã chạy script để update database
- Restart backend để áp dụng thay đổi

## Kết quả

- ✅ Tất cả URL hình ảnh đã được update từ domain/IP cũ sang `https://api.banyco.vn`
- ✅ Backend đã được restart
- ✅ `normalizeMediaUrl()` function sẽ tự động normalize URL khi trả về API

## Lưu ý

1. **Relative URLs**: Nếu URL bắt đầu bằng `/uploads/`, nó sẽ được normalize tự động bởi `normalizeMediaUrl()` function
2. **Absolute URLs**: Các URL có domain/IP cũ đã được update trong database
3. **Frontend**: Frontend cũng có `normalizeMediaUrl()` để normalize URL khi hiển thị

## Test

1. Kiểm tra hình ảnh trên frontend website
2. Kiểm tra hình ảnh trong CMS admin
3. Kiểm tra console không còn lỗi 404 cho hình ảnh

## Nếu vẫn còn vấn đề

1. Clear browser cache
2. Kiểm tra xem file có tồn tại trong `/var/www/Spa/CMS/backend/storage/uploads` không
3. Kiểm tra Nginx có serve static files từ `/uploads` không



