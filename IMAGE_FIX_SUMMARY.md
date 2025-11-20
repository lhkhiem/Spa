# Sửa lỗi Next.js Image - Unconfigured Hostname

## Vấn đề:
Next.js Image component báo lỗi: "hostname 'banyco-demo.pressup.vn' is not configured under images in your next.config.js"

## Nguyên nhân:
Next.js yêu cầu cấu hình rõ ràng các hostname được phép load ảnh từ bên ngoài để bảo mật.

## Giải pháp đã áp dụng:
Đã thêm các hostname sau vào `next.config.mjs` trong phần `images.remotePatterns`:
- `banyco-demo.pressup.vn` (HTTP và HTTPS)
- `admin.banyco-demo.pressup.vn` (HTTP và HTTPS)
- `api.banyco-demo.pressup.vn` (HTTP và HTTPS)

## Cần làm:
1. **Restart Next.js dev server**: Nếu đang chạy dev mode, cần restart lại để áp dụng thay đổi next.config.mjs
2. **Xóa cache browser**: Hard refresh (Ctrl+Shift+R)
3. **Kiểm tra lại trang posts**: Nếu vẫn lỗi, kiểm tra console để xem có hostname nào khác cần thêm không

## Lưu ý:
- Nếu đang dùng PM2, có thể cần kill và start lại process thay vì chỉ restart
- Next.js config changes thường yêu cầu full restart, không phải hot reload

