# 🚀 Quick Start: Test ZaloPay (Không cần cài ngrok)

## ✅ Bạn đã có npx - Có thể dùng ngrok ngay!

Vì bạn đã có `npx` (version 9.8.1), bạn có thể chạy ngrok mà không cần cài đặt.

## 📝 Các bước Test ZaloPay

### Bước 1: Chạy Backend Server

Mở terminal 1:
```bash
cd CMS/backend
npm run dev
```

Đảm bảo backend đang chạy trên port 3011.

### Bước 2: Chạy Ngrok (Dùng npx)

Mở terminal 2 (terminal mới):

**Windows:**
```bash
cd CMS/backend
npx ngrok http 3011
```

**Hoặc chạy file batch:**
```bash
cd CMS/backend
START_NGROK.bat
```

Bạn sẽ thấy output như sau:
```
ngrok

Session Status                online
Account                       (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:3011

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### Bước 3: Copy HTTPS URL

Copy URL từ dòng "Forwarding" (ví dụ: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`)

### Bước 4: Cập nhật file .env

Mở file `CMS/backend/.env` và thêm/sửa:

```bash
# ZaloPay Configuration
ZP_APP_ID=your_app_id
ZP_KEY1=your_key1
ZP_CALLBACK_KEY=your_callback_key
ZP_CALLBACK_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/payments/zalopay/callback
ZP_REDIRECT_URL=http://localhost:3000/checkout/result
ZP_API_BASE=https://sb-openapi.zalopay.vn/v2
WEBSITE_ORIGIN=http://localhost:3000
```

**Lưu ý:** Thay `https://xxxx-xx-xx-xx-xx.ngrok-free.app` bằng URL thật từ ngrok.

### Bước 5: Cấu hình trong ZaloPay Dashboard

1. Truy cập: https://developers.zalopay.vn/
2. Đăng nhập → Vào "Ứng dụng" → Chọn app sandbox
3. Vào "Cấu hình" → "Callback URL"
4. Nhập: `https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/payments/zalopay/callback`
5. Lưu lại

### Bước 6: Restart Backend Server

Quay lại terminal 1 (backend server):
1. Dừng server (Ctrl+C)
2. Khởi động lại:
   ```bash
   npm run dev
   ```

### Bước 7: Kiểm tra Cấu hình

Chạy script kiểm tra:
```bash
cd CMS/backend
node check-zalopay-env.js
```

Nếu thấy "✅ Tất cả các biến bắt buộc đã được cấu hình!" → OK!

### Bước 8: Test Thanh toán

1. Mở website (http://localhost:3000)
2. Thêm sản phẩm vào giỏ
3. Vào Checkout → Chọn ZaloPay
4. Nhấn "Thanh toán ZaloPay"
5. Kiểm tra:
   - ✅ Không còn lỗi 500
   - ✅ Redirect đến trang ZaloPay
   - ✅ Thấy QR code trên trang ZaloPay

## ⚠️ Lưu ý Quan trọng

1. **Ngrok phải chạy liên tục** khi test
   - Nếu tắt ngrok, callback sẽ không hoạt động
   - Giữ terminal ngrok mở trong khi test

2. **URL ngrok thay đổi mỗi lần chạy** (nếu dùng free)
   - Mỗi lần chạy `npx ngrok http 3011`, URL sẽ khác
   - Phải cập nhật lại `ZP_CALLBACK_URL` trong `.env`
   - Phải cập nhật lại Callback URL trong ZaloPay Dashboard
   - Phải restart backend server

3. **Để có URL cố định:**
   - Đăng ký tài khoản ngrok (miễn phí)
   - Chạy: `ngrok config add-authtoken YOUR_AUTHTOKEN`
   - Dùng: `npx ngrok http 3011 --domain=your-domain.ngrok-free.app`

## 🎯 Tóm tắt

1. ✅ Chạy backend: `npm run dev` (terminal 1)
2. ✅ Chạy ngrok: `npx ngrok http 3011` (terminal 2)
3. ✅ Copy URL từ ngrok
4. ✅ Cập nhật `.env` với URL ngrok
5. ✅ Cấu hình Callback URL trong ZaloPay Dashboard
6. ✅ Restart backend
7. ✅ Test thanh toán

## 🐛 Nếu vẫn lỗi

1. **Kiểm tra backend có chạy không:**
   - Mở: http://localhost:3011/api/health
   - Phải thấy response

2. **Kiểm tra ngrok có chạy không:**
   - Mở: http://127.0.0.1:4040 (ngrok web interface)
   - Xem requests có đến không

3. **Kiểm tra Callback URL:**
   - Trong ZaloPay Dashboard, Callback URL phải đúng
   - Trong `.env`, `ZP_CALLBACK_URL` phải đúng

4. **Kiểm tra logs:**
   - Xem backend console có lỗi gì không
   - Xem ngrok web interface (http://127.0.0.1:4040) có requests không




