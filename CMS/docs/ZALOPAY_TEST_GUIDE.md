# Hướng dẫn Test Thanh toán ZaloPay

## 📋 Flow Thanh toán ZaloPay

### Cách hoạt động:

1. **Khách hàng chọn ZaloPay** trên trang checkout
2. **Nhấn "Thanh toán ZaloPay"** → Tạo order
3. **Hệ thống gọi ZaloPay API** → Nhận `order_url`
4. **Tự động redirect** đến trang ZaloPay (`order_url`)
5. **Trang ZaloPay hiển thị QR code** (tự động)
6. **Khách hàng quét QR** bằng app ZaloPay
7. **Thanh toán xong** → ZaloPay redirect về trang kết quả

### ⚠️ Lưu ý quan trọng:

**QR Code KHÔNG hiện trên website của bạn!**
- QR code được hiển thị trên **trang ZaloPay** (sau khi redirect)
- Bạn sẽ thấy QR code khi được redirect đến `order_url` từ ZaloPay
- Trang ZaloPay sẽ tự động hiển thị QR code để quét

---

## 🧪 Cách Test

### Bước 1: Kiểm tra Cấu hình

Trước khi test, đảm bảo đã cấu hình đầy đủ:

```bash
cd CMS/backend
node test-zalopay-config.js
```

Nếu thấy:
```
✅ Tất cả các biến môi trường đã được cấu hình
✅ Kết nối thành công!
```

→ Cấu hình đã đúng, có thể test tiếp.

### Bước 2: Test trên Website

1. **Mở website** (http://localhost:3000)
2. **Thêm sản phẩm vào giỏ hàng**
3. **Vào trang Checkout** (`/checkout`)
4. **Điền thông tin:**
   - Họ và tên
   - Email
   - Số điện thoại
   - Địa chỉ
5. **Chọn phương thức thanh toán:**
   - ✅ Chọn **"ZaloPay (Thanh toán trực tuyến)"**
6. **Nhấn nút "Thanh toán ZaloPay"**

### Bước 3: Kiểm tra Flow

Sau khi nhấn "Thanh toán ZaloPay":

#### ✅ Nếu thành công:

1. **Thấy toast "Đang chuyển đến ZaloPay..."**
2. **Tự động redirect** đến trang ZaloPay
3. **Trang ZaloPay hiển thị:**
   - QR code lớn ở giữa màn hình
   - Số tiền cần thanh toán
   - Mô tả đơn hàng
   - Nút "Quét mã QR" hoặc hướng dẫn

#### ❌ Nếu có lỗi:

**Lỗi 1: "ZaloPay configuration missing"**
- Kiểm tra file `.env` có đủ biến không
- Restart backend server

**Lỗi 2: "ZaloPay API error"**
- Kiểm tra APP_ID, KEY1 có đúng không
- Kiểm tra tài khoản ZaloPay sandbox có active không

**Lỗi 3: Không redirect được**
- Mở Console (F12) xem có lỗi gì không
- Kiểm tra `order_url` có được trả về không

### Bước 4: Test Thanh toán

1. **Mở app ZaloPay** trên điện thoại
2. **Quét QR code** trên trang ZaloPay
3. **Xác nhận thanh toán** trong app
4. **Sau khi thanh toán:**
   - ZaloPay sẽ redirect về trang `/checkout/result`
   - Trang sẽ tự động query trạng thái thanh toán
   - Hiển thị "Thanh toán thành công!" nếu thành công

---

## 🔍 Debug - Kiểm tra từng bước

### 1. Kiểm tra Console (F12)

Mở Developer Tools (F12) → Console tab:

**Khi nhấn "Thanh toán ZaloPay":**
- Xem có lỗi gì không
- Xem request đến `/api/payments/zalopay/create` có thành công không

**Response mong đợi:**
```json
{
  "success": true,
  "data": {
    "app_trans_id": "241115_ORDER-123",
    "order_url": "https://zalopay.vn/pay/...",
    "return_code": 1
  }
}
```

### 2. Kiểm tra Network Tab

Mở Developer Tools (F12) → Network tab:

**Request 1: POST `/api/orders`**
- Status: 201 Created
- Response: Order object với `payment_method: "zalopay"`

**Request 2: POST `/api/payments/zalopay/create`**
- Status: 200 OK
- Response: Có `order_url` trong data

**Sau đó:**
- Redirect đến `order_url` (trang ZaloPay)

### 3. Kiểm tra Backend Logs

Xem console của backend server:

**Nếu thành công:**
```
[Payments] Create ZaloPay order: success
```

**Nếu có lỗi:**
```
[Payments] Create ZaloPay order error: ...
[ZaloPay] Create order error: ...
```

---

## 📱 Test với ZaloPay Sandbox

### Tài khoản Test:

1. **Đăng ký tài khoản ZaloPay sandbox:**
   - Truy cập: https://developers.zalopay.vn/
   - Đăng ký tài khoản sandbox

2. **Lấy thông tin API:**
   - Vào Dashboard → Ứng dụng → Chọn app sandbox
   - Copy APP_ID, KEY1, KEY2

3. **Cấu hình trong `.env`:**
   ```bash
   ZP_APP_ID=your_sandbox_app_id
   ZP_KEY1=your_sandbox_key1
   ZP_CALLBACK_KEY=your_sandbox_key2
   ZP_API_BASE=https://sb-openapi.zalopay.vn/v2
   ```

4. **Test thanh toán:**
   - Dùng app ZaloPay với tài khoản test
   - ZaloPay cung cấp số tiền test để thanh toán
   - Giao dịch test không tính phí thật

---

## ✅ Checklist Test

- [ ] Cấu hình ZaloPay đã đầy đủ (chạy `test-zalopay-config.js`)
- [ ] Backend server đang chạy
- [ ] Frontend đang chạy
- [ ] Có sản phẩm trong giỏ hàng
- [ ] Chọn ZaloPay trên checkout
- [ ] Nhấn "Thanh toán ZaloPay"
- [ ] Redirect đến trang ZaloPay thành công
- [ ] Thấy QR code trên trang ZaloPay
- [ ] Quét QR code bằng app ZaloPay
- [ ] Thanh toán thành công
- [ ] Redirect về trang kết quả
- [ ] Hiển thị "Thanh toán thành công!"

---

## 🐛 Troubleshooting

### Không redirect đến ZaloPay

**Nguyên nhân:**
- `order_url` không có trong response
- Lỗi khi gọi ZaloPay API

**Giải pháp:**
1. Kiểm tra Console (F12) xem có lỗi gì
2. Kiểm tra Network tab xem response từ `/api/payments/zalopay/create`
3. Kiểm tra backend logs

### Không thấy QR code trên trang ZaloPay

**Nguyên nhân:**
- Trang ZaloPay không load được
- `order_url` không đúng

**Giải pháp:**
1. Kiểm tra `order_url` có đúng không
2. Thử mở `order_url` trực tiếp trong browser
3. Kiểm tra tài khoản ZaloPay sandbox có active không

### Thanh toán xong nhưng không cập nhật trạng thái

**Nguyên nhân:**
- Callback không được gọi
- Callback URL không accessible

**Giải pháp:**
1. Kiểm tra Callback URL có đúng trong ZaloPay Dashboard không
2. Nếu test local, dùng ngrok để expose callback URL
3. Kiểm tra backend logs xem có nhận được callback không

---

## 📝 Lưu ý

1. **QR Code hiện ở trang ZaloPay**, không phải trên website của bạn
2. **Trang ZaloPay tự động hiển thị QR code** sau khi redirect
3. **Không cần tạo QR code riêng** trong code
4. **Test với sandbox** trước khi chuyển sang production

---

## 🎯 Kết luận

**Để test thanh toán ZaloPay:**

1. ✅ Cấu hình đầy đủ trong `.env`
2. ✅ Chạy `test-zalopay-config.js` để verify
3. ✅ Đặt hàng và chọn ZaloPay
4. ✅ Sẽ được redirect đến trang ZaloPay
5. ✅ **QR code sẽ hiện trên trang ZaloPay** (không phải trên website của bạn)
6. ✅ Quét QR code bằng app ZaloPay để thanh toán

**QR code KHÔNG hiện trên website của bạn - nó hiện trên trang ZaloPay sau khi redirect!**




