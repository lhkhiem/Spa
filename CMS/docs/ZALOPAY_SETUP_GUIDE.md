# Hướng dẫn Cấu hình Tài khoản ZaloPay để Nhận Tiền

## 📋 Tổng quan

ZaloPay là cổng thanh toán trực tuyến của Việt Nam. Để nhận tiền qua ZaloPay, bạn cần:
1. **Đăng ký tài khoản ZaloPay Merchant** (tài khoản nhận tiền)
2. **Lấy thông tin API** từ ZaloPay Dashboard
3. **Cấu hình trong hệ thống** (environment variables)

---

## 🔐 Bước 1: Đăng ký Tài khoản ZaloPay Merchant

### 1.1. Đăng ký tài khoản

1. Truy cập: https://developers.zalopay.vn/
2. Đăng ký tài khoản ZaloPay Developer
3. Đăng nhập vào ZaloPay Developer Portal

### 1.2. Tạo ứng dụng (App)

1. Vào **"Ứng dụng"** → **"Tạo ứng dụng mới"**
2. Điền thông tin:
   - **Tên ứng dụng**: Tên website/shop của bạn
   - **Mô tả**: Mô tả ngắn về ứng dụng
   - **Loại ứng dụng**: Chọn "Thanh toán trực tuyến"
   - **Website**: URL website của bạn
3. Lưu lại và chờ ZaloPay duyệt (thường 1-3 ngày)

### 1.3. Lấy thông tin API

Sau khi ứng dụng được duyệt, vào **"Ứng dụng"** → Chọn app của bạn → **"Thông tin ứng dụng"**:

Bạn sẽ thấy:
- **App ID**: Số ID của ứng dụng (ví dụ: `2553`)
- **Key1**: Key để tạo MAC cho create/query/refund
- **Key2 (Callback Key)**: Key để verify MAC từ callback

**Lưu ý quan trọng:**
- **Sandbox**: Dùng để test, không cần duyệt, có thể test ngay
- **Production**: Cần duyệt từ ZaloPay, phải có giấy phép kinh doanh

---

## 🔧 Bước 2: Cấu hình trong Hệ thống

### 2.1. Cấu hình Environment Variables

Thêm vào file `CMS/backend/.env`:

```bash
# ZaloPay Configuration
ZP_APP_ID=2553                    # App ID từ ZaloPay Dashboard
ZP_KEY1=your_key1_hmac            # Key1 từ ZaloPay Dashboard
ZP_CALLBACK_KEY=your_callback_key # Key2 (Callback Key) từ ZaloPay Dashboard

# ZaloPay API Endpoints
# Sandbox (dùng để test)
ZP_API_BASE=https://sb-openapi.zalopay.vn/v2
# Production (sau khi được duyệt)
# ZP_API_BASE=https://openapi.zalopay.vn/v2

ZP_ORDER_CREATE_PATH=/create
ZP_ORDER_QUERY_PATH=/query
ZP_REFUND_PATH=/refund
ZP_REFUND_QUERY_PATH=/refund/query

# ZaloPay Callback & Redirect URLs
# Callback URL: ZaloPay sẽ gọi URL này sau khi thanh toán
ZP_CALLBACK_URL=https://your-domain.com/api/payments/zalopay/callback
# Redirect URL: URL khách hàng sẽ được redirect sau khi thanh toán
ZP_REDIRECT_URL=https://your-domain.com/checkout/result

# Frontend URL (dùng cho redirect URL nếu không set ZP_REDIRECT_URL)
WEBSITE_ORIGIN=http://localhost:3000
```

### 2.2. Cấu hình Callback URL trong ZaloPay Dashboard

1. Vào ZaloPay Dashboard → **"Ứng dụng"** → Chọn app của bạn
2. Vào **"Cấu hình"** → **"Callback URL"**
3. Nhập URL: `https://your-domain.com/api/payments/zalopay/callback`
4. Lưu lại

**Lưu ý:**
- Callback URL phải là **HTTPS** (không dùng HTTP)
- Nếu test local, dùng **ngrok** để expose local server:
  ```bash
  ngrok http 3011
  # Copy HTTPS URL: https://xxxx.ngrok.io
  # Set ZP_CALLBACK_URL=https://xxxx.ngrok.io/api/payments/zalopay/callback
  ```

---

## 💳 Bước 3: Cấu hình Tài khoản Nhận Tiền

### 3.1. Liên kết Tài khoản Ngân hàng

1. Vào ZaloPay Dashboard → **"Tài khoản"** → **"Tài khoản ngân hàng"**
2. Thêm tài khoản ngân hàng của bạn:
   - Số tài khoản
   - Tên chủ tài khoản
   - Ngân hàng
3. Xác thực tài khoản (ZaloPay sẽ gửi mã OTP)

### 3.2. Cấu hình Rút Tiền

1. Vào **"Tài khoản"** → **"Rút tiền"**
2. Cấu hình:
   - Tài khoản nhận tiền mặc định
   - Số tiền tối thiểu để rút
   - Tần suất rút tiền (hàng ngày/tuần/tháng)

**Lưu ý:**
- Tiền từ giao dịch sẽ được chuyển vào tài khoản ZaloPay Merchant
- Bạn có thể rút tiền về tài khoản ngân hàng đã liên kết
- Phí rút tiền: Tham khảo bảng phí của ZaloPay

---

## 🔄 Flow Thanh toán ZaloPay

### Cách hoạt động:

1. **Khách hàng chọn ZaloPay** trên trang checkout
2. **Hệ thống tạo order** trong database
3. **Gọi ZaloPay API** để tạo payment order:
   - ZaloPay tạo **QR code tự động** trong `order_url`
   - Không cần tạo QR code riêng
4. **Redirect khách hàng** đến `order_url` từ ZaloPay
5. **Khách hàng quét QR code** bằng app ZaloPay:
   - QR code được hiển thị trên trang ZaloPay
   - Khách hàng mở app ZaloPay → Quét QR → Xác nhận thanh toán
6. **ZaloPay gọi callback** đến server của bạn
7. **Cập nhật trạng thái order** trong database
8. **Redirect khách hàng** về trang kết quả

### QR Code:

- **QR code được ZaloPay tự động tạo** trong `order_url`
- **Không cần tạo QR code riêng** trong code
- QR code chứa thông tin:
  - Số tiền
  - Mô tả đơn hàng
  - Thông tin merchant (từ App ID)
  - Transaction ID

---

## 🧪 Testing với Sandbox

### 1. Đăng ký Sandbox Account

1. Truy cập: https://developers.zalopay.vn/
2. Đăng ký tài khoản Sandbox (không cần duyệt)
3. Tạo ứng dụng Sandbox

### 2. Lấy Sandbox Credentials

Vào **"Ứng dụng"** → Chọn app Sandbox → **"Thông tin ứng dụng"**:
- App ID
- Key1
- Key2 (Callback Key)

### 3. Test Thanh toán

1. Cấu hình `.env` với Sandbox credentials
2. Set `ZP_API_BASE=https://sb-openapi.zalopay.vn/v2`
3. Test flow thanh toán:
   - Tạo order
   - Redirect đến ZaloPay
   - Quét QR code bằng app ZaloPay (dùng tài khoản test)
   - Kiểm tra callback

### 4. Tài khoản Test

- Dùng app ZaloPay với tài khoản test
- ZaloPay cung cấp số tiền test để thanh toán
- Giao dịch test không tính phí

---

## 📝 Checklist Cấu hình

- [ ] Đăng ký tài khoản ZaloPay Developer
- [ ] Tạo ứng dụng trong ZaloPay Dashboard
- [ ] Lấy App ID, Key1, Key2
- [ ] Cấu hình Callback URL trong ZaloPay Dashboard
- [ ] Thêm environment variables vào `.env`
- [ ] Liên kết tài khoản ngân hàng
- [ ] Test với Sandbox
- [ ] Chuyển sang Production (sau khi được duyệt)

---

## 🐛 Troubleshooting

### Lỗi: "ZaloPay configuration missing"

**Nguyên nhân:** Thiếu environment variables

**Giải pháp:**
1. Kiểm tra file `.env` có đủ các biến:
   - `ZP_APP_ID`
   - `ZP_KEY1`
   - `ZP_CALLBACK_KEY`
   - `ZP_CALLBACK_URL`
2. Restart backend server sau khi thêm env variables

### Lỗi: "Invalid MAC" trong callback

**Nguyên nhân:** Key2 (Callback Key) không đúng

**Giải pháp:**
1. Kiểm tra `ZP_CALLBACK_KEY` có đúng Key2 từ ZaloPay Dashboard không
2. Đảm bảo không có khoảng trắng thừa

### Callback không nhận được

**Nguyên nhân:** Callback URL không accessible

**Giải pháp:**
1. Kiểm tra Callback URL có đúng trong ZaloPay Dashboard không
2. Đảm bảo Callback URL là HTTPS
3. Nếu test local, dùng ngrok:
   ```bash
   ngrok http 3011
   # Set ZP_CALLBACK_URL=https://xxxx.ngrok.io/api/payments/zalopay/callback
   ```

### QR Code không hiển thị

**Nguyên nhân:** `order_url` không đúng hoặc không có

**Giải pháp:**
1. Kiểm tra response từ ZaloPay API có `order_url` không
2. Kiểm tra `return_code` có bằng 1 không
3. Kiểm tra logs để xem lỗi từ ZaloPay API

---

## 📚 Tài liệu Tham khảo

- [ZaloPay Developer Portal](https://developers.zalopay.vn/)
- [ZaloPay API Documentation](https://docs.zalopay.vn/)
- [ZaloPay Create Order API](https://docs.zalopay.vn/docs/specs/order-create)
- [ZaloPay Callback API](https://docs.zalopay.vn/docs/specs/callback-api/)

---

## ⚠️ Lưu ý Quan trọng

1. **Sandbox vs Production:**
   - Sandbox: Dùng để test, không cần duyệt
   - Production: Cần duyệt từ ZaloPay, phải có giấy phép kinh doanh

2. **Security:**
   - **KHÔNG** commit file `.env` lên Git
   - **KHÔNG** chia sẻ Key1, Key2 với người khác
   - Luôn verify MAC từ callback để đảm bảo security

3. **Phí giao dịch:**
   - Tham khảo bảng phí của ZaloPay
   - Phí được trừ trực tiếp từ số tiền nhận được

4. **Thời gian xử lý:**
   - Giao dịch thường được xử lý ngay lập tức
   - Tiền sẽ được chuyển vào tài khoản ZaloPay Merchant
   - Có thể rút tiền về tài khoản ngân hàng (theo cấu hình)




