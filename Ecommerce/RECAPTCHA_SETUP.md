# Hướng Dẫn Cấu Hình Google reCAPTCHA v3

## ⚠️ QUAN TRỌNG: reCAPTCHA là TÙY CHỌN

**Bạn KHÔNG BẮT BUỘC phải dùng reCAPTCHA!**

Hệ thống đã có **3 lớp bảo vệ chống spam** hoạt động độc lập:
1. ✅ **Honeypot field** - Field ẩn phát hiện bot
2. ✅ **Time-based validation** - Kiểm tra thời gian điền form
3. ✅ **Rate limiting** - Giới hạn số lần submit theo IP

**reCAPTCHA chỉ là lớp bảo vệ thứ 4 (tùy chọn)** để tăng cường bảo mật.

Nếu bạn không muốn dùng tài khoản Google, bạn có thể:
- **Bỏ qua reCAPTCHA hoàn toàn** - Hệ thống vẫn hoạt động tốt với 3 lớp bảo vệ trên
- **Dùng giải pháp thay thế** như hCaptcha hoặc Cloudflare Turnstile (xem phần dưới)

## Tổng Quan

Hệ thống đã được tích hợp Google reCAPTCHA v3 để bảo vệ các form khỏi spam. reCAPTCHA v3 hoạt động nền, không yêu cầu người dùng làm bất kỳ thao tác nào.

**reCAPTCHA là OPTIONAL** - Nếu không cấu hình, hệ thống sẽ tự động bỏ qua và chỉ dùng các biện pháp khác.

## Các Bước Cấu Hình

### 1. Đăng Ký reCAPTCHA với Google

1. Truy cập: https://www.google.com/recaptcha/admin/create
2. Đăng nhập bằng tài khoản Google
3. Điền thông tin:
   - **Label**: Tên dự án (ví dụ: "Banyco Spa Website")
   - **reCAPTCHA type**: Chọn **reCAPTCHA v3**
   - **Domains**: Thêm các domain của bạn:
     - `localhost` (cho development)
     - `banyco.vn`
     - `www.banyco.vn`
     - Các domain khác nếu có
4. Chấp nhận điều khoản và Submit

### 2. Lấy API Keys

Sau khi tạo, bạn sẽ nhận được 2 keys:
- **Site Key** (Public Key): Dùng cho frontend
- **Secret Key** (Private Key): Dùng cho backend

### 3. Cấu Hình Environment Variables

#### Frontend (.env.local hoặc .env)

Thêm vào file `.env.local` trong thư mục `Ecommerce/frontend/`:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
```

**Lưu ý**: 
- Key phải có prefix `NEXT_PUBLIC_` để Next.js expose ra client-side
- Không commit file `.env.local` vào git

#### Backend (.env)

Thêm vào file `.env` trong thư mục `Ecommerce/backend/`:

```env
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 4. Khởi Động Lại Services

Sau khi cấu hình:

```bash
# Frontend
cd Ecommerce/frontend
npm run dev

# Backend
cd Ecommerce/backend
npm run dev
```

## Cách Hoạt Động

1. **Frontend**: 
   - Tự động load reCAPTCHA script khi form được render
   - Khi user submit form, tự động execute reCAPTCHA và lấy token
   - Gửi token cùng với form data

2. **Backend**:
   - Nhận token từ frontend
   - Verify token với Google reCAPTCHA API
   - Kiểm tra score (0.0 - 1.0):
     - Score >= 0.5: Cho phép submit
     - Score < 0.5: Từ chối (có thể là bot)

## Tùy Chỉnh

### Thay Đổi Minimum Score

Trong file routes (ví dụ: `backend/src/routes/consultations.ts`):

```typescript
antiSpamMiddleware({
  recaptchaMinScore: 0.7, // Tăng từ 0.5 lên 0.7 (nghiêm ngặt hơn)
  // ...
})
```

**Khuyến nghị**:
- 0.5: Cân bằng giữa bảo mật và trải nghiệm
- 0.7: Nghiêm ngặt hơn, có thể chặn một số user hợp lệ
- 0.3: Dễ dãi hơn, có thể cho phép một số bot

### Tắt reCAPTCHA (Development)

Nếu không muốn dùng reCAPTCHA trong development:

1. Không set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` trong frontend
2. Không set `RECAPTCHA_SECRET_KEY` trong backend

Hệ thống sẽ tự động bỏ qua reCAPTCHA và chỉ dùng các biện pháp khác (honeypot, rate limiting, time validation).

## Kiểm Tra

### Test reCAPTCHA Hoạt Động

1. Mở browser console
2. Submit form
3. Kiểm tra Network tab:
   - Request đến `/api/consultations` hoặc `/api/newsletter/subscribe`
   - Body phải có field `recaptchaToken`

### Test reCAPTCHA Verification

1. Submit form với token hợp lệ → Thành công
2. Submit form không có token (nếu requireRecaptcha = true) → Lỗi 400
3. Submit form với token giả → Lỗi 400

## Troubleshooting

### Lỗi: "reCAPTCHA not loaded"

**Nguyên nhân**: Script reCAPTCHA chưa load xong

**Giải pháp**: 
- Kiểm tra internet connection
- Kiểm tra domain có được thêm vào reCAPTCHA admin không
- Kiểm tra Site Key có đúng không

### Lỗi: "reCAPTCHA verification failed"

**Nguyên nhân**: 
- Secret Key sai
- Token đã hết hạn (token chỉ valid trong vài phút)
- Domain không match

**Giải pháp**:
- Kiểm tra Secret Key trong backend .env
- Đảm bảo domain trong reCAPTCHA admin match với domain thực tế

### Score Quá Thấp

**Nguyên nhân**: User có hành vi giống bot (VPN, automation tools, etc.)

**Giải pháp**:
- Giảm `recaptchaMinScore` xuống 0.3-0.4
- Hoặc cho phép user retry

## Bảo Mật

- **KHÔNG** commit Secret Key vào git
- **KHÔNG** expose Secret Key ra client-side
- Site Key có thể public (được expose trong HTML)
- Secret Key phải được giữ bí mật

## Giải Pháp Thay Thế (Không Cần Google Account)

Nếu bạn không muốn dùng Google reCAPTCHA, có các lựa chọn sau:

### 1. Không Dùng CAPTCHA (Khuyến Nghị)

**Hệ thống đã đủ mạnh với 3 lớp bảo vệ:**
- Honeypot field
- Time-based validation  
- Rate limiting

**Chỉ cần:**
- Không set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` trong frontend
- Không set `RECAPTCHA_SECRET_KEY` trong backend

Hệ thống sẽ tự động bỏ qua reCAPTCHA và chỉ dùng các biện pháp khác.

### 2. Cloudflare Turnstile (Miễn Phí, Không Cần Google)

**Ưu điểm:**
- ✅ Miễn phí, không giới hạn
- ✅ Không cần tài khoản Google
- ✅ Privacy-friendly
- ✅ Dễ tích hợp

**Cách dùng:**
1. Đăng ký tại: https://www.cloudflare.com/products/turnstile/
2. Tạo site và lấy Site Key + Secret Key
3. Tích hợp tương tự như reCAPTCHA

### 3. hCaptcha (Miễn Phí, Không Cần Google)

**Ưu điểm:**
- ✅ Miễn phí
- ✅ Không cần tài khoản Google
- ✅ Privacy-focused
- ✅ Có thể kiếm tiền từ bot traffic

**Cách dùng:**
1. Đăng ký tại: https://www.hcaptcha.com/
2. Tạo site và lấy Site Key + Secret Key
3. Tích hợp tương tự như reCAPTCHA

## So Sánh Các Giải Pháp

| Giải Pháp | Miễn Phí | Cần Google | Privacy | Độ Khó |
|-----------|----------|------------|---------|--------|
| **Không dùng CAPTCHA** | ✅ | ❌ | ✅✅✅ | Dễ |
| **Cloudflare Turnstile** | ✅ | ❌ | ✅✅✅ | Trung bình |
| **hCaptcha** | ✅ | ❌ | ✅✅ | Trung bình |
| **Google reCAPTCHA** | ✅ | ✅ | ✅ | Dễ |

## Khuyến Nghị

**Cho hầu hết các trường hợp:**
- **Không cần CAPTCHA** - 3 lớp bảo vệ hiện tại đã đủ mạnh
- Chỉ thêm CAPTCHA nếu bạn gặp vấn đề spam nghiêm trọng

**Nếu cần CAPTCHA:**
- **Cloudflare Turnstile** - Tốt nhất về privacy và không cần Google
- **hCaptcha** - Lựa chọn tốt thứ 2
- **Google reCAPTCHA** - Chỉ nếu bạn đã có tài khoản Google

## Tài Liệu Tham Khảo

- [Google reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
- [hCaptcha](https://www.hcaptcha.com/)
