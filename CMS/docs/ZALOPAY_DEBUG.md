# 🔍 Debug ZaloPay Integration

## Lỗi hiện tại: -401 "Dữ liệu yêu cầu không hợp lệ"

### Đã sửa:
1. ✅ `app_user` - Đảm bảo là phone hoặc email, không phải UUID
2. ✅ `app_trans_id` - Đảm bảo không quá 40 ký tự, dùng order_number thay vì UUID
3. ✅ `amount` - Đảm bảo là integer
4. ✅ `description` - Sanitize ký tự đặc biệt
5. ✅ Thêm logging chi tiết

### Cách debug:

1. **Test lại tạo đơn hàng với ZaloPay**

2. **Xem logs chi tiết:**
```bash
pm2 logs cms-backend | grep -A 20 "ZaloPay"
```

3. **Kiểm tra request body được gửi lên ZaloPay:**
Logs sẽ hiển thị:
- `app_id`
- `app_user`
- `app_trans_id`
- `amount`
- `description`
- `callback_url`
- `embed_data`
- `item`
- `mac_input` (để verify MAC calculation)

4. **Các vấn đề có thể gặp:**

#### a) Callback URL không hợp lệ
- Kiểm tra `ZP_CALLBACK_URL` trong `.env`
- Phải là HTTPS
- Phải accessible từ ZaloPay servers
- Format: `https://api.banyco.vn/api/payments/zalopay/callback`

#### b) app_user không hợp lệ
- Phải là phone (10-11 số) hoặc email
- Không được là UUID
- Đã được fix trong code

#### c) app_trans_id quá dài
- Format: `yymmdd_<orderId>`
- Max 40 ký tự
- Đã được fix để dùng order_number thay vì UUID

#### d) Description có ký tự đặc biệt
- Đã được sanitize trong code
- Max 255 ký tự

#### e) MAC calculation sai
- Kiểm tra `ZP_KEY1` trong `.env`
- Format: `app_id|app_trans_id|app_user|amount|app_time|embed_data|item`
- Logs sẽ hiển thị `mac_input` để verify

### Test lại:

1. Tạo đơn hàng mới với ZaloPay
2. Xem logs:
```bash
pm2 logs cms-backend --lines 100 | grep -A 30 "Creating order request"
```
3. Copy logs và gửi để phân tích tiếp

### Nếu vẫn lỗi:

Kiểm tra ZaloPay Sandbox documentation:
- https://docs.zalopay.vn/docs/specs/order-create
- Đảm bảo tất cả fields đúng format
- Kiểm tra Sandbox credentials có đúng không


