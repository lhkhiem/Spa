# Hướng dẫn Tải và Sử dụng ZaloPay Sandbox App

## 📱 Tải ZaloPay Sandbox App

### Bước 1: Truy cập trang Downloads

1. Truy cập: **https://developers.zalopay.vn/downloads/**
2. Hoặc vào ZaloPay Developer Portal → **Downloads**

### Bước 2: Tải app theo hệ điều hành

#### Android:

1. Tìm mục **"Ứng dụng ZaloPay Sandbox"**
2. Nhấn **"Download"** cho Android
3. Tải file APK về máy
4. Cài đặt file APK (cho phép cài đặt từ nguồn không xác định nếu cần)

#### iOS:

1. Tìm mục **"Ứng dụng ZaloPay Sandbox"**
2. Nhấn **"Download"** cho iOS
3. Cài đặt app trên iPhone/iPad
4. **Thiết lập tin tưởng ứng dụng:**
   - Vào **Cài đặt** → **Cài đặt chung** → **Quản lý thiết bị**
   - Tìm **ZION COMPANY LIMITED**
   - Nhấn **"Tin cậy ZION COMPANY LIMITED"**

### Bước 3: Đăng nhập và Định danh

1. **Mở app ZaloPay Sandbox**
2. **Đăng nhập:**
   - Dùng tài khoản Zalo đã đăng ký với ZaloPay Developer
   - Tài khoản phải là tài khoản đã đăng ký trên https://developers.zalopay.vn/

3. **Định danh (KYC) và Liên kết Ngân hàng:**
   - Sau khi đăng nhập, app sẽ yêu cầu định danh
   - **ZaloPay Sandbox yêu cầu liên kết tài khoản ngân hàng** để có thể quét QR và thanh toán test
   - Đây là yêu cầu bắt buộc của ZaloPay để mô phỏng giao dịch thực tế
   - **Lưu ý:** Nếu không muốn liên kết ngân hàng, có thể test callback trực tiếp (xem [ZALOPAY_TEST_WITHOUT_BANK.md](./ZALOPAY_TEST_WITHOUT_BANK.md))

## 🧪 Sử dụng App để Test Thanh toán

### Flow Test:

1. **Tạo đơn hàng trên website:**
   - Vào trang checkout
   - Chọn phương thức thanh toán ZaloPay
   - Nhấn "Thanh toán ZaloPay"

2. **Redirect đến trang ZaloPay:**
   - Website sẽ tự động redirect đến `order_url` từ ZaloPay
   - Trang ZaloPay Sandbox sẽ hiển thị QR code

3. **Quét QR code bằng app Sandbox:**
   - **Mở app ZaloPay Sandbox** (KHÔNG phải app ZaloPay production)
   - Chọn chức năng "Quét mã QR"
   - Quét QR code trên trang ZaloPay
   - Xác nhận thanh toán trong app

4. **Kiểm tra kết quả:**
   - Sau khi thanh toán, ZaloPay sẽ redirect về trang kết quả
   - Kiểm tra trạng thái đơn hàng đã được cập nhật chưa
   - Kiểm tra callback có được nhận không (xem backend logs)

## ⚠️ Lưu ý quan trọng

1. **App Sandbox ≠ App Production:**
   - App ZaloPay Sandbox là app riêng biệt
   - KHÔNG thể dùng app ZaloPay production để quét QR code từ Sandbox
   - Phải dùng app Sandbox để test

2. **Tài khoản:**
   - Phải dùng tài khoản Zalo đã đăng ký với ZaloPay Developer
   - Tài khoản phải được định danh (KYC) trên app

3. **QR Code:**
   - QR code từ Sandbox chỉ có thể quét bằng app Sandbox
   - QR code từ Production chỉ có thể quét bằng app Production

4. **Test vs Production:**
   - Sandbox: Dùng để test, không tính phí thật
   - Production: Giao dịch thật, tính phí thật

## 🐛 Troubleshooting

### Không tìm thấy app trên trang Downloads

**Giải pháp:**
- Kiểm tra bạn đã đăng nhập vào ZaloPay Developer Portal chưa
- Thử truy cập trực tiếp: https://developers.zalopay.vn/downloads/
- Liên hệ ZaloPay support nếu vẫn không thấy

### Không cài đặt được app (Android)

**Giải pháp:**
- Cho phép cài đặt từ nguồn không xác định:
  - Vào **Cài đặt** → **Bảo mật** → Bật **"Nguồn không xác định"**
- Hoặc dùng ADB để cài đặt

### Không tin tưởng được app (iOS)

**Giải pháp:**
- Vào **Cài đặt** → **Cài đặt chung** → **Quản lý thiết bị**
- Tìm **ZION COMPANY LIMITED** → **Tin cậy**
- Nếu không thấy, thử cài đặt lại app

### Không đăng nhập được

**Giải pháp:**
- Đảm bảo tài khoản Zalo đã đăng ký với ZaloPay Developer
- Đăng ký tại: https://developers.zalopay.vn/
- Thử đăng nhập lại

### Quét QR code nhưng báo "QR không hợp lệ"

**Nguyên nhân:**
- Đang dùng app ZaloPay production thay vì app Sandbox
- QR code đã hết hạn
- QR code không phải từ Sandbox

**Giải pháp:**
- Đảm bảo đang dùng **app ZaloPay Sandbox**
- Tạo đơn hàng mới để có QR code mới
- Kiểm tra bạn đang test với Sandbox (không phải Production)

### Yêu cầu liên kết ngân hàng khi quét QR

**Nguyên nhân:**
- ZaloPay Sandbox yêu cầu liên kết tài khoản ngân hàng để có thể thanh toán test
- Đây là yêu cầu bắt buộc của ZaloPay

**Giải pháp:**
1. **Liên kết ngân hàng trong app Sandbox:**
   - Thực hiện các bước liên kết ngân hàng theo hướng dẫn trong app
   - Có thể dùng thông tin thẻ test do ZaloPay cung cấp (nếu có)

2. **Test callback trực tiếp (không cần quét QR):**
   - Xem hướng dẫn chi tiết: [ZALOPAY_TEST_WITHOUT_BANK.md](./ZALOPAY_TEST_WITHOUT_BANK.md)
   - Dùng script `testZaloPayCallback.ts` để test callback mà không cần quét QR
   - Test query order status endpoint

## 📚 Tài liệu liên quan

- [ZaloPay Developer Portal](https://developers.zalopay.vn/)
- [ZaloPay Downloads](https://developers.zalopay.vn/downloads/)
- [ZaloPay Integration Guide](./ZALOPAY_INTEGRATION.md)
- [ZaloPay Test Guide](./ZALOPAY_TEST_GUIDE.md)
- [ZaloPay QR Invalid Fix](./ZALOPAY_QR_INVALID_FIX.md)


