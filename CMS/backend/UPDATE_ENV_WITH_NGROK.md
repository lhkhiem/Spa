# ✅ Ngrok đã chạy thành công!

## 📋 Thông tin từ Ngrok của bạn:

- **Forwarding URL:** `https://fatigueless-limitary-eulalia.ngrok-free.dev`
- **Local:** `http://localhost:3011`
- **Web Interface:** `http://127.0.0.1:4040`

## 🔧 Các bước tiếp theo:

### Bước 1: Cập nhật file .env

Mở file `CMS/backend/.env` và thêm/sửa các dòng sau:

```bash
# ZaloPay Configuration
ZP_APP_ID=your_app_id
ZP_KEY1=your_key1
ZP_CALLBACK_KEY=your_callback_key

# ZaloPay Callback URL (Dùng URL từ ngrok)
ZP_CALLBACK_URL=https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback

# ZaloPay Redirect URL
ZP_REDIRECT_URL=http://localhost:3000/checkout/result

# ZaloPay API Base (Sandbox)
ZP_API_BASE=https://sb-openapi.zalopay.vn/v2

# Frontend URL
WEBSITE_ORIGIN=http://localhost:3000
```

**Lưu ý quan trọng:**
- Thay `your_app_id`, `your_key1`, `your_callback_key` bằng giá trị thật từ ZaloPay Dashboard
- URL ngrok: `https://fatigueless-limitary-eulalia.ngrok-free.dev` (đã copy từ ngrok của bạn)

### Bước 2: Cấu hình trong ZaloPay Dashboard

1. **Truy cập:** https://developers.zalopay.vn/
2. **Đăng nhập** → Vào **"Ứng dụng"** → Chọn app sandbox của bạn
3. **Vào "Cấu hình"** → **"Callback URL"**
4. **Nhập Callback URL:**
   ```
   https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback
   ```
5. **Lưu lại**

### Bước 3: Restart Backend Server

1. Quay lại terminal chạy backend (terminal 1)
2. Dừng server: **Ctrl+C**
3. Khởi động lại:
   ```bash
   cd CMS/backend
   npm run dev
   ```

### Bước 4: Kiểm tra Cấu hình

Chạy script kiểm tra:
```bash
cd CMS/backend
node check-zalopay-env.js
```

Nếu thấy:
```
✅ Tất cả các biến bắt buộc đã được cấu hình!
```

→ Cấu hình đã đúng!

### Bước 5: Test Thanh toán

1. **Mở website:** http://localhost:3000
2. **Thêm sản phẩm vào giỏ hàng**
3. **Vào Checkout** → Điền thông tin
4. **Chọn "ZaloPay (Thanh toán trực tuyến)"**
5. **Nhấn "Thanh toán ZaloPay"**

**Kết quả mong đợi:**
- ✅ Không còn lỗi 500
- ✅ Redirect đến trang ZaloPay
- ✅ Thấy QR code trên trang ZaloPay

## ⚠️ Lưu ý Quan trọng

1. **Giữ ngrok chạy:**
   - Đừng tắt terminal ngrok
   - Ngrok phải chạy liên tục khi test
   - Nếu tắt ngrok, callback sẽ không hoạt động

2. **URL ngrok thay đổi:**
   - Mỗi lần chạy `npx ngrok http 3011` mới, URL sẽ khác
   - Nếu URL thay đổi, phải:
     - Cập nhật lại `ZP_CALLBACK_URL` trong `.env`
     - Cập nhật lại Callback URL trong ZaloPay Dashboard
     - Restart backend server

3. **Kiểm tra ngrok web interface:**
   - Mở: http://127.0.0.1:4040
   - Xem requests có đến không
   - Debug nếu có lỗi

## 🐛 Nếu vẫn lỗi

1. **Kiểm tra backend logs:**
   - Xem console backend có lỗi gì không
   - Kiểm tra có log "[Payments] Create ZaloPay order error" không

2. **Kiểm tra ngrok:**
   - Mở http://127.0.0.1:4040
   - Xem có requests đến `/api/payments/zalopay/create` không

3. **Kiểm tra Callback URL:**
   - Trong ZaloPay Dashboard, Callback URL phải đúng
   - Trong `.env`, `ZP_CALLBACK_URL` phải đúng

## ✅ Checklist

- [ ] Ngrok đang chạy (terminal ngrok mở)
- [ ] Backend server đang chạy (terminal backend mở)
- [ ] Đã cập nhật `.env` với URL ngrok
- [ ] Đã cấu hình Callback URL trong ZaloPay Dashboard
- [ ] Đã restart backend server
- [ ] Chạy `check-zalopay-env.js` thấy "✅ Tất cả các biến bắt buộc đã được cấu hình!"
- [ ] Test thanh toán ZaloPay

## 🎯 Tóm tắt

**URL ngrok của bạn:**
```
https://fatigueless-limitary-eulalia.ngrok-free.dev
```

**Callback URL cần set:**
```
https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback
```

**Set trong 2 nơi:**
1. File `.env`: `ZP_CALLBACK_URL=https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback`
2. ZaloPay Dashboard: Callback URL = `https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback`

Sau đó restart backend và test lại!




