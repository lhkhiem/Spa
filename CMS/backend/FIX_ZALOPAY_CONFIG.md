# 🔧 Sửa Lỗi "ZaloPay configuration error"

## ❌ Lỗi hiện tại

Bạn đang gặp lỗi: **"ZaloPay configuration error"** hoặc **500 Internal Server Error** khi thanh toán ZaloPay.

**Nguyên nhân:** Thiếu các biến môi trường ZaloPay trong file `.env`

## ✅ Cách sửa

### Bước 1: Kiểm tra file .env

Đảm bảo file `CMS/backend/.env` tồn tại và có các biến sau:

```bash
# ZaloPay Configuration
ZP_APP_ID=your_app_id
ZP_KEY1=your_key1_here
ZP_CALLBACK_KEY=your_callback_key_here
ZP_CALLBACK_URL=https://your-domain.com/api/payments/zalopay/callback
ZP_REDIRECT_URL=https://your-domain.com/checkout/result
ZP_API_BASE=https://sb-openapi.zalopay.vn/v2
WEBSITE_ORIGIN=http://localhost:3000
```

### Bước 2: Lấy thông tin từ ZaloPay Dashboard

1. **Truy cập:** https://developers.zalopay.vn/
2. **Đăng nhập** vào tài khoản ZaloPay Developer
3. **Vào "Ứng dụng"** → Chọn app sandbox của bạn
4. **Vào "Thông tin ứng dụng":**
   - **App ID** → Copy vào `ZP_APP_ID`
   - **Key1** → Copy vào `ZP_KEY1`
   - **Key2 (Callback Key)** → Copy vào `ZP_CALLBACK_KEY`

### Bước 3: Cấu hình Callback URL

1. **Vào "Cấu hình"** → **"Callback URL"**
2. **Nhập Callback URL:**
   - Nếu test local: Dùng ngrok
     ```bash
     ngrok http 3011
     # Copy HTTPS URL: https://xxxx.ngrok.io
     # Set: ZP_CALLBACK_URL=https://xxxx.ngrok.io/api/payments/zalopay/callback
     ```
   - Nếu đã deploy: `https://your-domain.com/api/payments/zalopay/callback`
3. **Lưu lại** trong ZaloPay Dashboard

### Bước 4: Thêm vào file .env

Mở file `CMS/backend/.env` và thêm (hoặc sửa) các dòng sau:

```bash
# ZaloPay Sandbox Configuration
ZP_APP_ID=2553
ZP_KEY1=your_key1_from_zalopay_dashboard
ZP_CALLBACK_KEY=your_callback_key_from_zalopay_dashboard
ZP_CALLBACK_URL=https://xxxx.ngrok.io/api/payments/zalopay/callback
ZP_REDIRECT_URL=http://localhost:3000/checkout/result
ZP_API_BASE=https://sb-openapi.zalopay.vn/v2
WEBSITE_ORIGIN=http://localhost:3000
```

**Lưu ý:**
- Thay `your_key1_from_zalopay_dashboard` bằng Key1 thật từ ZaloPay
- Thay `your_callback_key_from_zalopay_dashboard` bằng Key2 thật từ ZaloPay
- Nếu test local, dùng ngrok URL cho `ZP_CALLBACK_URL`

### Bước 5: Restart Backend Server

Sau khi sửa file `.env`, **bắt buộc phải restart backend server:**

1. Dừng backend server (Ctrl+C)
2. Khởi động lại:
   ```bash
   cd CMS/backend
   npm run dev
   ```

### Bước 6: Kiểm tra lại

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

## 🧪 Test lại

1. **Mở website** → Thêm sản phẩm vào giỏ
2. **Vào Checkout** → Chọn ZaloPay
3. **Nhấn "Thanh toán ZaloPay"**
4. **Kiểm tra:**
   - Không còn lỗi 500
   - Redirect đến trang ZaloPay
   - Thấy QR code trên trang ZaloPay

## 🐛 Nếu vẫn lỗi

### Lỗi: "ZaloPay configuration missing"

**Nguyên nhân:** File `.env` không được load

**Giải pháp:**
1. Kiểm tra file `.env` có trong thư mục `CMS/backend/` không
2. Kiểm tra tên file đúng là `.env` (không phải `.env.txt`)
3. Restart backend server

### Lỗi: "Invalid ZP_APP_ID"

**Nguyên nhân:** `ZP_APP_ID` không phải là số

**Giải pháp:**
- Đảm bảo `ZP_APP_ID` là số (ví dụ: `2553`, không phải `"2553"`)

### Lỗi: "ZaloPay API error"

**Nguyên nhân:** APP_ID hoặc KEY1 không đúng

**Giải pháp:**
1. Kiểm tra lại APP_ID, KEY1 từ ZaloPay Dashboard
2. Đảm bảo không có khoảng trắng thừa
3. Kiểm tra tài khoản ZaloPay sandbox có active không

## 📝 Checklist

- [ ] File `.env` có trong `CMS/backend/`
- [ ] Đã thêm tất cả biến ZaloPay vào `.env`
- [ ] Đã lấy APP_ID, KEY1, KEY2 từ ZaloPay Dashboard
- [ ] Đã cấu hình Callback URL trong ZaloPay Dashboard
- [ ] Đã restart backend server
- [ ] Chạy `check-zalopay-env.js` thấy "✅ Tất cả các biến bắt buộc đã được cấu hình!"
- [ ] Test lại thanh toán ZaloPay

## 📚 Tài liệu tham khảo

- [Hướng dẫn Cấu hình ZaloPay](./docs/ZALOPAY_SETUP_GUIDE.md)
- [Hướng dẫn Test ZaloPay](./docs/ZALOPAY_TEST_GUIDE.md)




