# ⚠️ Vấn đề ZaloPay Sandbox - "Chưa thể kết nối đến hệ thống"

## 🔍 Nguyên nhân

Lỗi "Chưa thể kết nối đến hệ thống" khi quét QR code bằng app ZaloPay có thể do:

1. **Sandbox credentials công khai đã hết hạn**
   - Credentials từ documentation có thể không còn hoạt động
   - ZaloPay có thể đã thay đổi Sandbox system

2. **Cần đăng ký Sandbox account riêng**
   - ZaloPay yêu cầu đăng ký Sandbox account để test
   - Credentials công khai chỉ dùng để demo, không dùng để test thật

3. **App ZaloPay không kết nối được**
   - Network issue
   - ZaloPay service issue

---

## ✅ Giải pháp

### Option 1: Đăng ký Sandbox Account (Khuyến nghị)

1. **Truy cập:** https://developers.zalopay.vn/
2. **Đăng ký tài khoản** (miễn phí, không cần duyệt)
3. **Tạo ứng dụng Sandbox:**
   - Vào "Ứng dụng" → "Tạo ứng dụng mới"
   - Chọn "Sandbox" hoặc "Dùng thử"
   - Điền thông tin cơ bản
4. **Lấy Sandbox credentials:**
   - App ID
   - Key1
   - Key2 (Callback Key)
5. **Cập nhật `.env`:**
   ```bash
   ZP_APP_ID=<sandbox_app_id>
   ZP_KEY1=<sandbox_key1>
   ZP_CALLBACK_KEY=<sandbox_key2>
   ```
6. **Restart backend:**
   ```bash
   pm2 restart cms-backend
   ```

### Option 2: Test với Production (Sau khi đăng ký)

Nếu đã có tài khoản Production:
1. Lấy Production credentials
2. Cập nhật `.env` với Production credentials
3. Đổi `ZP_API_BASE` thành `https://openapi.zalopay.vn/v2`
4. Test với số tiền nhỏ

### Option 3: Simulate Callback (Để test flow)

Nếu không thể test với app ZaloPay, có thể simulate callback để test flow:

```bash
# Simulate successful payment callback
curl -X POST https://api.banyco.vn/api/payments/zalopay/callback \
  -H "Content-Type: application/json" \
  -d '{
    "data": "{\"app_trans_id\":\"251128_ORDMIH17QOL64RH4\",\"amount\":324000,\"return_code\":1,\"zp_trans_id\":123456789}",
    "mac": "<calculated_mac>",
    "type": 1
  }'
```

**Lưu ý:** Cần tính MAC đúng với Key2 để verify.

---

## 🔧 Kiểm tra hiện tại

### 1. Kiểm tra Sandbox credentials có hoạt động không:

```bash
# Test create order với Sandbox
curl -X POST https://sb-openapi.zalopay.vn/v2/create \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": 554,
    "app_user": "0900000000",
    "app_trans_id": "251128_TEST123",
    "app_time": 1732704000000,
    "amount": 1000,
    "description": "Test",
    "embed_data": "{}",
    "item": "[]",
    "callback_url": "https://api.banyco.vn/api/payments/zalopay/callback",
    "mac": "<calculated_mac>"
  }'
```

### 2. Kiểm tra Callback URL:

```bash
curl -I https://api.banyco.vn/api/payments/zalopay/callback
```

Nếu trả về 404, cần kiểm tra routing.

---

## 📝 Bước tiếp theo

1. **Đăng ký Sandbox account** tại https://developers.zalopay.vn/
2. **Lấy Sandbox credentials** từ dashboard
3. **Cập nhật `.env`** với credentials mới
4. **Test lại** với Sandbox credentials mới

Hoặc:

1. **Đăng ký Production account** (nếu có giấy phép kinh doanh)
2. **Lấy Production credentials**
3. **Cập nhật `.env`** với Production credentials
4. **Test với số tiền nhỏ**

---

## ⚠️ Lưu ý

- Sandbox credentials công khai có thể không còn hoạt động
- Nên đăng ký Sandbox account riêng để test
- Production cần giấy phép kinh doanh và được ZaloPay duyệt


