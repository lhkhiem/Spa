# 🔧 Test ZaloPay Không Cần Ngrok

## ❌ Vấn đề

Bạn không thể chạy `ngrok http 3011` để expose local server.

## ✅ Giải pháp

### Cách 1: Cài đặt Ngrok (Khuyến nghị)

#### Windows:

1. **Tải ngrok:**
   - Truy cập: https://ngrok.com/download
   - Tải file `ngrok.exe` cho Windows

2. **Cài đặt:**
   - Giải nén file `ngrok.exe`
   - Copy vào thư mục (ví dụ: `C:\ngrok\`)
   - Thêm vào PATH hoặc dùng đường dẫn đầy đủ

3. **Đăng ký tài khoản (miễn phí):**
   - Truy cập: https://dashboard.ngrok.com/signup
   - Đăng ký tài khoản
   - Lấy authtoken từ dashboard

4. **Cấu hình:**
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN
   ```

5. **Chạy:**
   ```bash
   ngrok http 3011
   ```

#### Hoặc dùng npx (không cần cài đặt):

```bash
npx ngrok http 3011
```

### Cách 2: Dùng LocalTunnel (Thay thế ngrok)

1. **Cài đặt:**
   ```bash
   npm install -g localtunnel
   ```

2. **Chạy:**
   ```bash
   lt --port 3011
   ```

3. **Copy URL** (ví dụ: `https://xxxx.loca.lt`)
4. **Set trong .env:**
   ```bash
   ZP_CALLBACK_URL=https://xxxx.loca.lt/api/payments/zalopay/callback
   ```

### Cách 3: Test với Production URL (Nếu đã deploy)

Nếu bạn đã deploy backend lên server:

1. **Set trong .env:**
   ```bash
   ZP_CALLBACK_URL=https://your-domain.com/api/payments/zalopay/callback
   ```

2. **Cấu hình trong ZaloPay Dashboard:**
   - Vào "Cấu hình" → "Callback URL"
   - Nhập: `https://your-domain.com/api/payments/zalopay/callback`
   - Lưu lại

### Cách 4: Test với Localhost (Nếu ZaloPay Sandbox hỗ trợ)

Một số trường hợp ZaloPay sandbox có thể test với localhost:

1. **Set trong .env:**
   ```bash
   ZP_CALLBACK_URL=http://localhost:3011/api/payments/zalopay/callback
   ```

2. **Cấu hình trong ZaloPay Dashboard:**
   - Vào "Cấu hình" → "Callback URL"
   - Nhập: `http://localhost:3011/api/payments/zalopay/callback`
   - Lưu lại

**Lưu ý:** Cách này có thể không hoạt động vì ZaloPay cần gọi callback từ server của họ về localhost của bạn.

### Cách 5: Dùng Cloudflare Tunnel (Miễn phí)

1. **Cài đặt cloudflared:**
   - Tải từ: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
   - Hoặc dùng: `winget install --id Cloudflare.cloudflared`

2. **Chạy:**
   ```bash
   cloudflared tunnel --url http://localhost:3011
   ```

3. **Copy URL** và set trong `.env`

## 🎯 Khuyến nghị

**Nếu chỉ test nhanh:**
- Dùng `npx ngrok http 3011` (không cần cài đặt)

**Nếu test thường xuyên:**
- Cài đặt ngrok và đăng ký tài khoản miễn phí

**Nếu đã có server:**
- Dùng production URL

## 📝 Hướng dẫn Chi tiết: Dùng npx ngrok

### Bước 1: Chạy ngrok

```bash
npx ngrok http 3011
```

Bạn sẽ thấy:
```
Forwarding  https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:3011
```

### Bước 2: Copy HTTPS URL

Copy URL (ví dụ: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`)

### Bước 3: Cập nhật .env

Mở file `CMS/backend/.env` và set:

```bash
ZP_CALLBACK_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/payments/zalopay/callback
```

### Bước 4: Cấu hình trong ZaloPay Dashboard

1. Vào ZaloPay Dashboard
2. Vào "Cấu hình" → "Callback URL"
3. Nhập: `https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/payments/zalopay/callback`
4. Lưu lại

### Bước 5: Restart Backend

```bash
cd CMS/backend
npm run dev
```

### Bước 6: Test

1. Mở website → Checkout → Chọn ZaloPay
2. Nhấn "Thanh toán ZaloPay"
3. Kiểm tra xem có redirect đến ZaloPay không

## ⚠️ Lưu ý

- **Ngrok free:** URL sẽ thay đổi mỗi lần chạy (trừ khi đăng ký tài khoản)
- **Ngrok free:** Có giới hạn số lượng requests
- **Nếu dùng ngrok free:** Phải cập nhật lại Callback URL trong ZaloPay Dashboard mỗi lần chạy ngrok mới

## 🐛 Troubleshooting

### Lỗi: "ngrok: command not found"

**Giải pháp:** Dùng `npx ngrok http 3011` thay vì `ngrok http 3011`

### Lỗi: "ngrok session expired"

**Giải pháp:** 
- Đăng ký tài khoản ngrok miễn phí
- Chạy: `ngrok config add-authtoken YOUR_AUTHTOKEN`

### Lỗi: "Port 3011 already in use"

**Giải pháp:**
- Kiểm tra backend server có đang chạy không
- Hoặc dùng port khác: `npx ngrok http 3012`




