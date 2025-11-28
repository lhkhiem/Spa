# 🔧 Cấu hình Callback URL trong ZaloPay Dashboard

## ⚠️ Vấn đề

Lỗi "Chưa thể kết nối đến hệ thống" khi quét QR code có thể do:
- **Callback URL chưa được cấu hình** trong ZaloPay Dashboard
- ZaloPay Sandbox yêu cầu cấu hình callback URL trước khi test

---

## 📝 Hướng dẫn Cấu hình Callback URL

### Bước 1: Đăng nhập ZaloPay Dashboard

1. Truy cập: **https://developers.zalopay.vn/**
2. Đăng nhập với tài khoản đã tạo ứng dụng (App ID: 2554)
3. Vào **"Ứng dụng"** → Chọn app của bạn

### Bước 2: Cấu hình Callback URL

1. Vào **"Cấu hình"** hoặc **"Settings"**
2. Tìm mục **"Callback URL"** hoặc **"IPN URL"**
3. Nhập Callback URL:
   ```
   https://api.banyco.vn/api/payments/zalopay/callback
   ```
4. **Lưu lại**

### Bước 3: Kiểm tra

1. Đảm bảo Callback URL là **HTTPS**
2. Đảm bảo Callback URL **accessible** từ internet
3. Test callback URL:
   ```bash
   curl -I https://api.banyco.vn/api/payments/zalopay/callback
   ```

---

## 🔍 Kiểm tra Callback URL có hoạt động không

### Test 1: Kiểm tra endpoint có tồn tại

```bash
curl -X POST https://api.banyco.vn/api/payments/zalopay/callback \
  -H "Content-Type: application/json" \
  -d '{"data":"test","mac":"test"}'
```

**Kỳ vọng:** Trả về JSON với `return_code: 2` (vì data/mac không hợp lệ, nhưng endpoint hoạt động)

### Test 2: Kiểm tra từ ZaloPay servers

ZaloPay sẽ test callback URL khi bạn cấu hình. Nếu có lỗi, ZaloPay sẽ báo.

---

## ⚠️ Lưu ý

1. **Callback URL phải là HTTPS** (không dùng HTTP)
2. **Callback URL phải accessible** từ ZaloPay servers (không phải localhost)
3. **Nếu test local**, dùng ngrok:
   ```bash
   ngrok http 3011
   # Set ZP_CALLBACK_URL=https://xxxx.ngrok.io/api/payments/zalopay/callback
   # Cấu hình callback URL trong ZaloPay Dashboard: https://xxxx.ngrok.io/api/payments/zalopay/callback
   ```

---

## 🧪 Sau khi cấu hình Callback URL

1. **Test lại tạo đơn hàng** với ZaloPay
2. **Quét QR code** bằng app ZaloPay
3. **Kiểm tra callback** có được nhận không:
   ```bash
   pm2 logs cms-backend | grep "ZaloPay Callback"
   ```

---

## 📞 Nếu vẫn lỗi

1. **Kiểm tra ZaloPay Dashboard:**
   - Callback URL đã được lưu chưa?
   - Có thông báo lỗi gì không?

2. **Kiểm tra logs backend:**
   ```bash
   pm2 logs cms-backend --lines 100
   ```

3. **Liên hệ ZaloPay Support:**
   - Email: hotro@zalopay.vn
   - Phone: 1900 54 54 36


