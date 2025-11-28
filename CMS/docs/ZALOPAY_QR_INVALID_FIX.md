# Hướng dẫn xử lý lỗi "QR không hợp lệ" với ZaloPay Sandbox

## 🔍 Vấn đề

Khi quét QR code từ ZaloPay Sandbox bằng app ZaloPay production, bạn có thể gặp lỗi **"QR không hợp lệ"** hoặc **"Chưa thể kết nối đến hệ thống"**.

## ✅ Nguyên nhân

**ZaloPay Sandbox QR code KHÔNG thể quét bằng app ZaloPay production!**

- ZaloPay Sandbox sử dụng môi trường test riêng biệt
- QR code từ Sandbox chỉ có thể quét bằng:
  - **App ZaloPay Sandbox** (app riêng cho test)
  - Hoặc **ZaloPay Web Sandbox** (trên trình duyệt)

## 📱 Tải ZaloPay Sandbox App

### Cách tải ZaloPay Sandbox App:

1. **Truy cập trang Downloads:**
   - Link: https://developers.zalopay.vn/downloads/
   - Hoặc vào ZaloPay Developer Portal → Downloads

2. **Tải app theo hệ điều hành:**

   **Android:**
   - Tìm mục "Ứng dụng ZaloPay Sandbox"
   - Nhấn "Download" cho Android
   - Cài đặt file APK

   **iOS:**
   - Tìm mục "Ứng dụng ZaloPay Sandbox"
   - Nhấn "Download" cho iOS
   - Sau khi cài đặt, cần thiết lập tin tưởng:
     - Vào **Cài đặt** → **Cài đặt chung** → **Quản lý thiết bị**
     - Tìm **ZION COMPANY LIMITED** → **Tin cậy ZION COMPANY LIMITED**

3. **Đăng nhập:**
   - Dùng tài khoản Zalo đã đăng ký với ZaloPay Developer
   - Sau khi đăng nhập, cần định danh (KYC) trên app để sử dụng thanh toán test

### Lưu ý:
- App ZaloPay Sandbox là app riêng, khác với app ZaloPay production
- Phải dùng app Sandbox để quét QR code từ Sandbox
- Tài khoản đăng nhập phải là tài khoản đã đăng ký với ZaloPay Developer

## 🔧 Giải pháp

### Cách 1: Dùng App ZaloPay Sandbox (Khuyến nghị)

1. **Tải và cài đặt app ZaloPay Sandbox:**
   - Link: https://developers.zalopay.vn/downloads/
   - Cài đặt theo hướng dẫn ở trên

2. **Đăng nhập và định danh:**
   - Đăng nhập bằng tài khoản Zalo đã đăng ký với ZaloPay Developer
   - Thực hiện định danh (KYC) trên app

3. **Test thanh toán:**
   - Khi tạo đơn hàng với ZaloPay, bạn sẽ được redirect đến `order_url`
   - Trên trang ZaloPay Sandbox, QR code sẽ hiển thị
   - **Mở app ZaloPay Sandbox** (KHÔNG phải app production)
   - Quét QR code bằng app Sandbox
   - Xác nhận thanh toán trong app

### Cách 2: Test trên ZaloPay Web Sandbox (Nếu không có app)

1. Khi tạo đơn hàng với ZaloPay, bạn sẽ được redirect đến `order_url`
2. Trên trang ZaloPay Sandbox, QR code sẽ hiển thị
3. **KHÔNG quét QR code bằng app ZaloPay production**
4. Thay vào đó, sử dụng **ZaloPay Web Sandbox** để test:
   - Đăng nhập vào ZaloPay Sandbox Dashboard
   - Vào phần "Test Payment" hoặc "Sandbox Testing"
   - Nhập thông tin giao dịch để test

### Cách 2: Sử dụng ZaloPay Production (Sau khi test xong)

Sau khi test thành công với Sandbox, chuyển sang ZaloPay Production:

1. **Cập nhật `.env`** với credentials Production:
   ```bash
   ZP_APP_ID=<production_app_id>
   ZP_KEY1=<production_key1>
   ZP_CALLBACK_KEY=<production_key2>
   ZP_API_BASE=https://openapi.zalopay.vn/v2  # Production API
   ```

2. **Restart backend**:
   ```bash
   pm2 restart cms-backend
   ```

3. **Test lại** với QR code từ Production - lúc này có thể quét bằng app ZaloPay production

## 📝 Lưu ý quan trọng

1. **Sandbox QR code ≠ Production QR code**
   - Sandbox: Chỉ test, không thể quét bằng app production
   - Production: Có thể quét bằng app ZaloPay thật

2. **Callback URL**
   - Sandbox: Có thể dùng ngrok hoặc public URL
   - Production: Phải là HTTPS và accessible từ ZaloPay servers

3. **Test Flow**
   - ✅ Test tạo order → Kiểm tra `order_url` có được trả về
   - ✅ Test redirect → Kiểm tra QR code có hiển thị trên trang ZaloPay
   - ✅ Test callback → Kiểm tra callback có được nhận (dùng ngrok nếu local)
   - ❌ KHÔNG test quét QR bằng app production khi dùng Sandbox

## 🎯 Kết luận

**Lỗi "QR không hợp lệ" khi quét Sandbox QR code bằng app ZaloPay production là BÌNH THƯỜNG!**

- Đây không phải lỗi code
- Đây là hạn chế của ZaloPay Sandbox
- Để test đầy đủ, cần:
  1. Test với Sandbox (không quét QR)
  2. Hoặc chuyển sang Production để test quét QR thật

---

**Tài liệu liên quan:**
- [ZaloPay Integration Guide](./ZALOPAY_INTEGRATION.md)
- [ZaloPay Setup Guide](./ZALOPAY_SETUP_GUIDE.md)
- [ZaloPay Test Guide](./ZALOPAY_TEST_GUIDE.md)

