# 🔧 Sửa Lỗi: Backend không đọc được biến từ .env

## ❌ Vấn đề

Backend báo lỗi: "ZaloPay configuration missing: ZP_APP_ID, ZP_KEY1, ZP_CALLBACK_URL"

Mặc dù file `.env` đã có các biến này.

## ✅ Giải pháp

### Bước 1: Kiểm tra file .env

Đảm bảo file `CMS/backend/.env` có đúng format:

```bash
# ZaloPay Sandbox Configuration
ZP_APP_ID=554
ZP_KEY1=8NdU5pG5R2spGHGhy099HN10hD8IQJBn
ZP_CALLBACK_KEY=uUfsWgfLkRLzq6W2uNXTCxrfxs51auny
ZP_CALLBACK_URL=https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback
ZP_REDIRECT_URL=http://localhost:3000/checkout/result
ZP_API_BASE=https://sb-openapi.zalopay.vn/v2
WEBSITE_ORIGIN=http://localhost:3000
```

**Lưu ý quan trọng:**
- ❌ **KHÔNG** có khoảng trắng trước/sau dấu `=`
- ❌ **KHÔNG** có dấu ngoặc kép `"` quanh giá trị
- ✅ Đúng format: `ZP_APP_ID=554` (không phải `ZP_APP_ID = 554` hoặc `ZP_APP_ID="554"`)

### Bước 2: Cập nhật ZP_CALLBACK_URL

Thay `https://xxxx.ngrok.io` bằng URL ngrok thật của bạn:

```bash
ZP_CALLBACK_URL=https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback
```

### Bước 3: Kiểm tra file .env có được load không

Chạy script kiểm tra:
```bash
cd CMS/backend
node check-zalopay-env.js
```

Nếu vẫn báo "Missing", có thể:
1. File `.env` không ở đúng thư mục (`CMS/backend/.env`)
2. File `.env` có tên sai (ví dụ: `.env.txt`)
3. File `.env` có format sai

### Bước 4: Restart Backend Server

**BẮT BUỘC** phải restart backend sau khi sửa `.env`:

1. Dừng backend server (Ctrl+C)
2. Khởi động lại:
   ```bash
   cd CMS/backend
   npm run dev
   ```

### Bước 5: Kiểm tra lại

Sau khi restart, kiểm tra:
```bash
cd CMS/backend
node check-zalopay-env.js
```

Nếu thấy "✅ Tất cả các biến bắt buộc đã được cấu hình!" → OK!

## 🐛 Troubleshooting

### Vấn đề 1: File .env không được load

**Kiểm tra:**
1. File `.env` có trong thư mục `CMS/backend/` không?
2. Tên file đúng là `.env` (không phải `.env.txt` hoặc `env`)
3. File có quyền đọc không?

**Giải pháp:**
- Đảm bảo file `.env` ở đúng vị trí: `CMS/backend/.env`
- Kiểm tra tên file (phải là `.env`, không có extension)

### Vấn đề 2: Format file .env sai

**Kiểm tra:**
- Không có khoảng trắng thừa
- Không có dấu ngoặc kép
- Mỗi biến trên một dòng

**Ví dụ đúng:**
```bash
ZP_APP_ID=554
ZP_KEY1=8NdU5pG5R2spGHGhy099HN10hD8IQJBn
```

**Ví dụ sai:**
```bash
ZP_APP_ID = 554          # ❌ Có khoảng trắng
ZP_APP_ID="554"          # ❌ Có dấu ngoặc kép
ZP_APP_ID=554 ZP_KEY1=... # ❌ Nhiều biến trên một dòng
```

### Vấn đề 3: Backend không restart

**Giải pháp:**
- **BẮT BUỘC** phải restart backend sau khi sửa `.env`
- Backend chỉ load `.env` khi khởi động

## 📝 Checklist

- [ ] File `.env` có trong `CMS/backend/`
- [ ] Tên file đúng là `.env` (không có extension)
- [ ] Format đúng (không có khoảng trắng thừa, không có dấu ngoặc kép)
- [ ] `ZP_CALLBACK_URL` đã được cập nhật với URL ngrok thật
- [ ] Đã restart backend server
- [ ] Chạy `check-zalopay-env.js` thấy "✅ Tất cả các biến bắt buộc đã được cấu hình!"

## 🎯 Tóm tắt

1. ✅ Kiểm tra file `.env` có đúng format không
2. ✅ Cập nhật `ZP_CALLBACK_URL` với URL ngrok thật: `https://fatigueless-limitary-eulalia.ngrok-free.dev/api/payments/zalopay/callback`
3. ✅ **RESTART backend server** (quan trọng!)
4. ✅ Kiểm tra lại với `check-zalopay-env.js`
5. ✅ Test thanh toán ZaloPay




