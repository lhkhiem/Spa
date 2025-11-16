# 📝 Tạo File .env cho ZaloPay

## ❌ Vấn đề

File `.env` không tồn tại trong thư mục `CMS/backend/`, nên backend không đọc được các biến môi trường.

## ✅ Giải pháp: Tạo file .env

### Bước 1: Tạo file .env

Tạo file mới tên `.env` trong thư mục `CMS/backend/`

### Bước 2: Copy nội dung sau vào file .env

Dựa trên thông tin từ editor của bạn, copy nội dung sau:

```bash
# ZaloPay Sandbox Configuration
ZP_APP_ID=554
ZP_KEY1=8NdU5pG5R2spGHGhy099HN10hD8IQJBn
ZP_CALLBACK_KEY=uUfsWgfLkRLzq6W2uNXTCxrfxs51auny

# ZaloPay Callback URL (Thay xxxx bằng URL ngrok thật của bạn)
ZP_CALLBACK_URL=https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback

# ZaloPay Redirect URL
ZP_REDIRECT_URL=http://localhost:3000/checkout/result

# ZaloPay API Base (Sandbox)
ZP_API_BASE=https://sb-openapi.zalopay.vn/v2

# Frontend URL
WEBSITE_ORIGIN=http://localhost:3000
```

### Bước 3: Cập nhật ZP_CALLBACK_URL

**QUAN TRỌNG:** Thay `https://xxxx.ngrok.io` bằng URL ngrok thật của bạn:

Từ ngrok của bạn, URL là:
```
https://fatigueless-limitary-eulalia.ngrok-free.dev
```

Vậy `ZP_CALLBACK_URL` phải là:
```bash
ZP_CALLBACK_URL=https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback
```

### Bước 4: Lưu file

Lưu file với tên chính xác là `.env` (không có extension, không phải `.env.txt`)

### Bước 5: Kiểm tra

Chạy script kiểm tra:
```bash
cd CMS/backend
node test-env-loading.js
```

Nếu thấy:
```
✅ Tất cả các biến đã được load đúng!
```

→ File .env đã được tạo đúng!

### Bước 6: Restart Backend

**BẮT BUỘC** phải restart backend:

1. Dừng backend server (Ctrl+C)
2. Khởi động lại:
   ```bash
   cd CMS/backend
   npm run dev
   ```

### Bước 7: Cấu hình trong ZaloPay Dashboard

1. Truy cập: https://developers.zalopay.vn/
2. Đăng nhập → Vào "Ứng dụng" → Chọn app sandbox
3. Vào "Cấu hình" → "Callback URL"
4. Nhập:
   ```
   https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback
   ```
5. Lưu lại

## 📝 Lưu ý về Format

**Đúng:**
```bash
ZP_APP_ID=554
ZP_KEY1=8NdU5pG5R2spGHGhy099HN10hD8IQJBn
```

**Sai:**
```bash
ZP_APP_ID = 554          # ❌ Có khoảng trắng
ZP_APP_ID="554"          # ❌ Có dấu ngoặc kép
```

## ✅ Checklist

- [ ] File `.env` đã được tạo trong `CMS/backend/`
- [ ] Tên file đúng là `.env` (không có extension)
- [ ] Đã copy nội dung vào file
- [ ] `ZP_CALLBACK_URL` đã được cập nhật với URL ngrok thật
- [ ] Đã lưu file
- [ ] Chạy `test-env-loading.js` thấy "✅ Tất cả các biến đã được load đúng!"
- [ ] Đã restart backend server
- [ ] Đã cấu hình Callback URL trong ZaloPay Dashboard

## 🎯 Tóm tắt

1. ✅ Tạo file `.env` trong `CMS/backend/`
2. ✅ Copy nội dung với các giá trị từ ZaloPay Dashboard
3. ✅ Cập nhật `ZP_CALLBACK_URL` với URL ngrok: `https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback`
4. ✅ Lưu file
5. ✅ Restart backend
6. ✅ Test lại




