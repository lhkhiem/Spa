# 🧪 Hướng dẫn Test ZaloPay - Bước tiếp theo

## ✅ Đã hoàn thành:
- Tạo ZaloPay order thành công
- QR code đã hiển thị
- Order đã được lưu với `zp_app_trans_id`

## 📱 Bước tiếp theo - Test thanh toán:

### 1. Quét QR code và thanh toán

1. **Mở app ZaloPay** trên điện thoại
2. **Quét QR code** trên trang ZaloPay
3. **Xác nhận thanh toán** (dùng tài khoản test)
4. **Hoàn tất thanh toán**

### 2. Kiểm tra Callback

Sau khi thanh toán, ZaloPay sẽ gọi callback. Kiểm tra logs:

```bash
# Xem logs callback
pm2 logs cms-backend | grep -A 20 "ZaloPay Callback"

# Hoặc xem tất cả logs
pm2 logs cms-backend --lines 100
```

**Kỳ vọng thấy:**
```
[ZaloPay Callback] Received: { app_trans_id, amount, zp_trans_id, return_code: 1 }
[ZaloPay Callback] Processing payment: { order_id, order_number, ... }
[ZaloPay Callback] Updated order: { order_id, payment_status: 'paid', rows_affected: 1 }
```

### 3. Kiểm tra Order Status

Sau callback, order status sẽ được update:
- `payment_status`: `pending` → `paid`
- `status`: `pending` → `processing`
- `zp_trans_id`: Được lưu từ callback

**Kiểm tra trong database hoặc CMS Admin:**
- Vào CMS Admin → Orders
- Tìm order với `zp_app_trans_id = 251128_ORDMIH17QOL64RH4`
- Kiểm tra `payment_status` và `status`

### 4. Kiểm tra Email Confirmation

Nếu email service enabled, khách hàng sẽ nhận email xác nhận:
- Subject: `Xác nhận đơn hàng ORD-MIH17QOL-64RH4 - Banyco`
- Nội dung: Thông tin đơn hàng, sản phẩm, địa chỉ giao hàng

**Kiểm tra logs:**
```bash
pm2 logs cms-backend | grep "Email sent successfully"
```

### 5. Kiểm tra Trang Result

Sau khi thanh toán, ZaloPay sẽ redirect về:
`https://banyco.vn/checkout/result?app_trans_id=251128_ORDMIH17QOL64RH4`

Trang này sẽ:
- Query order status từ ZaloPay
- Hiển thị trạng thái thanh toán (success/failed/pending)
- Polling mỗi 3 giây nếu chưa có kết quả

---

## 🔍 Troubleshooting

### Nếu callback không nhận được:

1. **Kiểm tra Callback URL:**
   - Phải là HTTPS
   - Phải accessible từ ZaloPay servers
   - Hiện tại: `https://api.banyco.vn/api/payments/zalopay/callback`

2. **Test callback URL:**
   ```bash
   curl -X POST https://api.banyco.vn/api/payments/zalopay/callback \
     -H "Content-Type: application/json" \
     -d '{"data":"{\"app_trans_id\":\"test\",\"return_code\":1}","mac":"test"}'
   ```

3. **Query order status manually:**
   ```bash
   curl "https://api.banyco.vn/api/payments/zalopay/query/251128_ORDMIH17QOL64RH4"
   ```

### Nếu order status không update:

1. **Kiểm tra callback logs** xem có lỗi không
2. **Kiểm tra database** xem order có `zp_app_trans_id` không
3. **Query order status manually** để force update

---

## ✅ Checklist Test

- [ ] QR code hiển thị trên trang ZaloPay
- [ ] Quét QR code bằng app ZaloPay
- [ ] Thanh toán thành công trên ZaloPay
- [ ] Callback được nhận (kiểm tra logs)
- [ ] Order status được update (pending → processing)
- [ ] Payment status được update (pending → paid)
- [ ] Email confirmation được gửi (nếu email enabled)
- [ ] Trang result hiển thị đúng trạng thái
- [ ] Order có `zp_trans_id` trong database

---

## 🚀 Sau khi test thành công:

1. **Chuyển sang Production:**
   - Đăng ký tài khoản ZaloPay Production
   - Lấy Production credentials
   - Cập nhật `.env` với Production credentials
   - Đổi `ZP_API_BASE` thành `https://openapi.zalopay.vn/v2`

2. **Cấu hình tài khoản ngân hàng:**
   - Liên kết tài khoản ngân hàng trong ZaloPay Dashboard
   - Cấu hình rút tiền

3. **Test lại với Production:**
   - Test với số tiền nhỏ trước
   - Kiểm tra callback hoạt động
   - Kiểm tra tiền có vào tài khoản không


