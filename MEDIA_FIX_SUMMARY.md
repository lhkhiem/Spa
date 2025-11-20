# Sửa lỗi Media - Mất hết hình ảnh

## Vấn đề:
- Media library không load được (Network Error)
- Hình ảnh không hiển thị
- API `/api/media/folders` báo lỗi

## Nguyên nhân:
1. **BACKEND_URL không được set**: `.env.local` chỉ có `NEXT_PUBLIC_API_URL` nhưng không có `NEXT_PUBLIC_BACKEND_URL`
2. **MediaPicker dùng BACKEND_URL**: Component MediaPicker cần `BACKEND_URL` để gọi API media
3. **Files vẫn còn**: Files vẫn tồn tại trong `storage/uploads/`, chỉ là không load được

## Giải pháp đã áp dụng:

### 1. Thêm NEXT_PUBLIC_BACKEND_URL vào .env.local:
```bash
NEXT_PUBLIC_BACKEND_URL=https://admin.banyco-demo.pressup.vn
```

### 2. Kiểm tra:
- Files vẫn còn trong storage: ✅
- API endpoint hoạt động: ✅ (cần authentication)
- BACKEND_URL được set: ✅ (đã thêm)

## Cần làm thêm:

1. **Restart frontend** để load env mới:
   ```bash
   pm2 restart cms
   ```

2. **Kiểm tra lại Media Library**:
   - Đăng nhập vào admin panel
   - Vào Media Library
   - Kiểm tra xem có load được không

3. **Nếu vẫn lỗi**, kiểm tra:
   - Console browser để xem BACKEND_URL có đúng không
   - Network tab để xem request URL
   - Authentication token có được gửi không

## Lưu ý:
- Media API yêu cầu authentication (cần đăng nhập)
- BACKEND_URL khác với API_URL: BACKEND_URL không có `/api` suffix
- Files vẫn còn, chỉ cần fix URL để load lại

