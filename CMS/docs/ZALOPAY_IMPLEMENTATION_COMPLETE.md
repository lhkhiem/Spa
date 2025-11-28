# ✅ Hoàn thiện Tích hợp ZaloPay - Sandbox

## 📋 Tổng quan

Đã hoàn thiện tích hợp ZaloPay với Sandbox credentials để test. Tất cả các chức năng đã được implement và sẵn sàng test.

---

## ✅ Đã hoàn thành

### 1. Email Template cho Order Confirmation
- ✅ File: `CMS/backend/src/utils/emailTemplates.ts`
- ✅ Function: `getOrderConfirmationTemplate()`
- ✅ Template HTML đẹp với thông tin đầy đủ:
  - Thông tin đơn hàng (mã, ngày, tổng tiền)
  - Chi tiết sản phẩm
  - Địa chỉ giao hàng
  - Link tra cứu đơn hàng

### 2. Cải thiện Callback Handler
- ✅ File: `CMS/backend/src/routes/payments.ts`
- ✅ Validation amount (kiểm tra amount khớp với order.total)
- ✅ Idempotency check (tránh update nhiều lần)
- ✅ Update order status đúng logic (pending → processing khi paid)
- ✅ Gửi email confirmation khi thanh toán thành công
- ✅ Logging chi tiết cho debugging

### 3. Cải thiện Query Endpoint
- ✅ File: `CMS/backend/src/routes/payments.ts`
- ✅ Update order status đầy đủ
- ✅ Gửi email confirmation nếu callback bị miss
- ✅ Validation amount

### 4. Cấu hình Sandbox
- ✅ File: `CMS/backend/.env`
- ✅ ZaloPay Sandbox credentials:
  - App ID: `554`
  - Key1: `8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn`
  - Callback Key: `uUfsWgfLkRLzq6W2uNXTCxrfxs51auny`
- ✅ API Base: `https://sb-openapi.zalopay.vn/v2`
- ✅ Callback URL: `https://api.banyco.vn/api/payments/zalopay/callback`
- ✅ Redirect URL: `https://banyco.vn/checkout/result`

---

## 🧪 Hướng dẫn Test

### Bước 1: Kiểm tra cấu hình

```bash
# Kiểm tra backend đang chạy
pm2 status cms-backend

# Kiểm tra logs
pm2 logs cms-backend --lines 50
```

### Bước 2: Test tạo đơn hàng với ZaloPay

1. Truy cập: `https://banyco.vn/checkout`
2. Điền thông tin đơn hàng
3. Chọn **"ZaloPay (Thanh toán trực tuyến)"**
4. Nhấn **"Thanh toán ZaloPay"**
5. Kiểm tra:
   - Đơn hàng được tạo trong database
   - Redirect đến ZaloPay Sandbox
   - QR code hiển thị trên trang ZaloPay

### Bước 3: Test thanh toán

1. Mở app ZaloPay trên điện thoại
2. Quét QR code trên trang ZaloPay
3. Xác nhận thanh toán (dùng tài khoản test)
4. Kiểm tra:
   - ZaloPay redirect về `/checkout/result`
   - Trang result hiển thị trạng thái thanh toán
   - Order status được update trong database
   - Email confirmation được gửi (nếu email service enabled)

### Bước 4: Kiểm tra Callback

```bash
# Xem logs callback
pm2 logs cms-backend | grep "ZaloPay Callback"

# Kiểm tra order trong database
# Order có payment_status = 'paid' và status = 'processing'
```

### Bước 5: Test Query Endpoint (nếu callback bị miss)

```bash
# Query order status
curl "https://api.banyco.vn/api/payments/zalopay/query/241115_ORDER-ID"
```

---

## 🔍 Kiểm tra Logs

### Logs quan trọng:

1. **Tạo ZaloPay order:**
   ```
   [Payments] Create ZaloPay order: success
   ```

2. **Callback từ ZaloPay:**
   ```
   [ZaloPay Callback] Received: { app_trans_id, amount, zp_trans_id, return_code }
   [ZaloPay Callback] Processing payment: { order_id, order_number, ... }
   [ZaloPay Callback] Updated order: { order_id, payment_status, rows_affected }
   ```

3. **Email confirmation:**
   ```
   [EmailService] Email sent successfully: { messageId }
   ```

---

## ⚠️ Lưu ý

### Sandbox vs Production

- **Sandbox (hiện tại):**
  - Dùng để test
  - Không có tiền thật
  - Không cần đăng ký
  - API: `https://sb-openapi.zalopay.vn/v2`

- **Production (sau khi test thành công):**
  - Cần đăng ký và được ZaloPay duyệt
  - Cần giấy phép kinh doanh
  - Có tiền thật
  - API: `https://openapi.zalopay.vn/v2`
  - Cập nhật credentials trong `.env`

### Callback URL

- Callback URL phải là **HTTPS** và accessible từ ZaloPay servers
- Hiện tại: `https://api.banyco.vn/api/payments/zalopay/callback`
- Nếu test local, dùng ngrok:
  ```bash
  ngrok http 3011
  # Set ZP_CALLBACK_URL=https://xxxx.ngrok.io/api/payments/zalopay/callback
  ```

---

## 📝 Checklist Test

- [ ] Tạo đơn hàng với ZaloPay thành công
- [ ] Redirect đến ZaloPay Sandbox
- [ ] QR code hiển thị trên trang ZaloPay
- [ ] Quét QR và thanh toán thành công
- [ ] Callback được nhận và xử lý
- [ ] Order status được update (pending → processing)
- [ ] Payment status được update (pending → paid)
- [ ] Email confirmation được gửi (nếu email enabled)
- [ ] Trang result hiển thị đúng trạng thái
- [ ] Query endpoint hoạt động đúng

---

## 🚀 Chuyển sang Production

Khi test thành công với Sandbox, chuyển sang Production:

1. **Đăng ký tài khoản ZaloPay Production:**
   - Truy cập: https://developers.zalopay.vn/
   - Tạo ứng dụng Production
   - Chờ ZaloPay duyệt (1-3 ngày)

2. **Lấy Production Credentials:**
   - App ID (Production)
   - Key1 (Production)
   - Key2 / Callback Key (Production)

3. **Cập nhật .env:**
   ```bash
   ZP_APP_ID=<production_app_id>
   ZP_KEY1=<production_key1>
   ZP_CALLBACK_KEY=<production_callback_key>
   ZP_API_BASE=https://openapi.zalopay.vn/v2
   ```

4. **Restart backend:**
   ```bash
   pm2 restart cms-backend
   ```

---

## 📚 Tài liệu tham khảo

- [ZaloPay Integration Guide](./ZALOPAY_INTEGRATION.md)
- [ZaloPay Setup Guide](./ZALOPAY_SETUP_GUIDE.md)
- [ZaloPay Test Guide](./ZALOPAY_TEST_GUIDE.md)

---

## ✅ Kết luận

Tất cả các chức năng đã được hoàn thiện:
- ✅ Email template cho order confirmation
- ✅ Callback handler với validation và idempotency
- ✅ Query endpoint với update status đầy đủ
- ✅ Cấu hình Sandbox credentials
- ✅ Sẵn sàng test với Sandbox

**Bước tiếp theo:** Test flow thanh toán với Sandbox. Nếu thành công, chuyển sang Production credentials.


