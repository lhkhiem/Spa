# 📧 Hệ Thống Gửi Email - Hướng Dẫn Cấu Hình

## ✅ Đã Triển Khai

Hệ thống gửi email đã được tích hợp vào CMS với các tính năng:

1. ✅ **Email Service** - Service quản lý SMTP configuration và gửi email
2. ✅ **Email Templates** - Templates HTML đẹp cho các loại email
3. ✅ **Contact Form Integration** - Tự động gửi email khi có contact form submission
4. ✅ **Test Email API** - API để test cấu hình email

---

## 🔧 Cấu Hình Email

### Bước 1: Cấu hình SMTP trong CMS Admin

1. Đăng nhập vào **CMS Admin**
2. Vào **Settings** → **Email**
3. Điền thông tin SMTP:

```
SMTP Host: smtp.gmail.com (hoặc SMTP server của bạn)
SMTP Port: 587 (hoặc 465 cho SSL)
Encryption: TLS (hoặc SSL)
From Email: your-email@example.com (Email người gửi)
From Name: Your Company Name (Tên hiển thị)
Username: your-email@example.com (Tài khoản đăng nhập SMTP)
Password: your-app-password (Mật khẩu SMTP)
Enabled: ✅ (bật)
```

**Giải thích các trường:**

- **SMTP Host**: Địa chỉ server SMTP (ví dụ: smtp.gmail.com)
- **SMTP Port**: Cổng kết nối (587 cho TLS, 465 cho SSL)
- **Encryption**: Phương thức mã hóa (TLS hoặc SSL)
- **From Email**: Email người gửi (sẽ hiển thị trong "From" của email)
- **From Name**: Tên hiển thị người gửi (ví dụ: "Your Company Name")
- **Username**: **Tài khoản đăng nhập SMTP** - Thường là email address của bạn (xem chi tiết bên dưới)
- **Password**: Mật khẩu đăng nhập SMTP (có thể là App Password, không phải mật khẩu thông thường)
- **Enabled**: Bật/tắt tính năng gửi email

### Bước 2: Ví dụ Cấu Hình cho Gmail

**Lưu ý:** Gmail yêu cầu sử dụng **App Password** thay vì mật khẩu thông thường.

1. Bật 2-Step Verification trong Google Account
2. Tạo App Password:
   - Vào: https://myaccount.google.com/apppasswords
   - Chọn "Mail" và "Other (Custom name)"
   - Nhập tên: "CMS Email Service"
   - Copy App Password (16 ký tự)

3. Cấu hình trong CMS:
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
Encryption: TLS
From Email: your-email@gmail.com
From Name: Your Company Name
Username: your-email@gmail.com  ← Đây là email Gmail của bạn (giống From Email)
Password: xxxx xxxx xxxx xxxx   ← App Password (16 ký tự, có thể có dấu cách)
Enabled: ✅
```

**Giải thích Username cho Gmail:**
- **Username** = Email Gmail của bạn (ví dụ: `your-email@gmail.com`)
- **Password** = App Password (không phải mật khẩu Gmail thông thường)
- **From Email** = Có thể giống hoặc khác Username (nhưng thường giống nhau)

### Bước 3: Ví dụ Cấu Hình cho Outlook/Office 365

```
SMTP Host: smtp.office365.com
SMTP Port: 587
Encryption: TLS
From Email: your-email@outlook.com
From Name: Your Company Name
Username: your-email@outlook.com  ← Email Outlook/Office 365 của bạn
Password: your-password            ← Mật khẩu email của bạn
Enabled: ✅
```

**Giải thích Username cho Outlook/Office 365:**
- **Username** = Email Outlook/Office 365 của bạn (ví dụ: `your-email@outlook.com` hoặc `your-email@company.com`)
- **Password** = Mật khẩu email của bạn
- **From Email** = Thường giống Username

### Bước 4: Ví dụ Cấu Hình cho SendGrid

```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
Encryption: TLS
From Email: your-email@example.com  ← Email đã verify trong SendGrid
From Name: Your Company Name
Username: apikey                     ← Luôn là "apikey" (không phải email)
Password: SG.xxxxxxxxxxxxxxxxxxxxx   ← API Key từ SendGrid
Enabled: ✅
```

**Giải thích Username cho SendGrid:**
- **Username** = Luôn là `apikey` (không phải email của bạn)
- **Password** = API Key từ SendGrid (bắt đầu bằng `SG.`)
- **From Email** = Email đã được verify trong SendGrid account

**Cách lấy SendGrid API Key:**
1. Đăng nhập SendGrid
2. Vào Settings → API Keys
3. Tạo API Key mới với quyền "Mail Send"
4. Copy API Key (chỉ hiển thị 1 lần)

---

## 🧪 Test Email Configuration

### Test qua API

1. **Test Connection:**
```bash
GET /api/email/test
Authorization: Bearer <admin-token>
```

2. **Send Test Email:**
```bash
POST /api/email/test-send
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "to": "test@example.com"
}
```

### Test qua CMS Admin UI

1. Vào **Settings** → **Email**
2. Click **Test Connection** để kiểm tra cấu hình
3. Click **Send Test Email** để gửi email test

---

## 📨 Email Templates

### 1. Contact Form - Admin Notification

Khi khách hàng submit contact form, admin sẽ nhận email với:
- Thông tin khách hàng (name, email, phone)
- Subject và message
- Reply-to được set là email khách hàng

**Template:** `getContactNotificationTemplate()`

### 2. Contact Form - Customer Confirmation

Khách hàng sẽ nhận email xác nhận với:
- Lời cảm ơn
- Chi tiết inquiry đã submit
- Thông tin về thời gian phản hồi

**Template:** `getContactConfirmationTemplate()`

---

## 🔄 Tích Hợp Tự Động

### Contact Form

Email được gửi tự động khi:
- Khách hàng submit contact form
- Email được enable trong settings
- Admin email được cấu hình trong General Settings

**Flow:**
1. Khách hàng submit form → `POST /api/contacts`
2. Contact message được lưu vào database
3. Email service gửi 2 email:
   - **Admin notification** → Admin email (từ General Settings)
   - **Customer confirmation** → Email khách hàng

**Lưu ý:** Email gửi không đồng bộ (non-blocking), không làm chậm response.

---

## 📝 Code Examples

### Gửi Email Tùy Chỉnh

```typescript
import { emailService } from '../services/email';

// Check if email is enabled
if (emailService.isEnabled()) {
  await emailService.sendEmail({
    to: 'customer@example.com',
    subject: 'Your Subject',
    html: '<h1>Your HTML Content</h1>',
    text: 'Plain text version',
    replyTo: 'support@example.com',
  });
}
```

### Tạo Email Template Mới

```typescript
// src/utils/emailTemplates.ts
export function getMyCustomTemplate(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My Template</title>
</head>
<body>
  <h1>Hello ${data.name}</h1>
  <p>Your custom content here</p>
</body>
</html>
  `.trim();
}
```

---

## ⚙️ Settings Structure

Email settings được lưu trong database table `settings` với namespace `email`:

```json
{
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "encryption": "tls",
  "fromEmail": "your-email@example.com",
  "fromName": "Your Company Name",
  "username": "your-email@example.com",  ← Tài khoản đăng nhập SMTP
  "password": "your-password",            ← Mật khẩu SMTP
  "enabled": true
}
```

## 📋 Tóm Tắt: SMTP Username là gì?

**SMTP Username** là tài khoản đăng nhập để kết nối với SMTP server. Tùy vào loại SMTP provider:

| Provider | Username | Ví dụ |
|----------|----------|-------|
| **Gmail** | Email Gmail của bạn | `your-email@gmail.com` |
| **Outlook/Office 365** | Email Outlook của bạn | `your-email@outlook.com` |
| **SendGrid** | Luôn là `apikey` | `apikey` |
| **Mailgun** | Email đã verify | `postmaster@your-domain.com` |
| **Amazon SES** | SMTP Username từ AWS | `AKIAIOSFODNN7EXAMPLE` |
| **Custom SMTP** | Username do provider cung cấp | Tùy vào provider |

**Lưu ý quan trọng:**
- Đối với hầu hết email providers (Gmail, Outlook), **Username = Email address** của bạn
- Đối với một số service như SendGrid, **Username = "apikey"** (không phải email)
- **Username** có thể khác **From Email** (nhưng thường giống nhau)
- Nếu không chắc, hãy kiểm tra tài liệu của SMTP provider bạn đang sử dụng

---

## 🐛 Troubleshooting

### Email không được gửi

1. **Kiểm tra Settings:**
   - `enabled` phải là `true`
   - Tất cả fields phải được điền đầy đủ

2. **Kiểm tra SMTP Credentials:**
   - Username/password đúng
   - Port và encryption đúng
   - Firewall không chặn port

3. **Kiểm tra Logs:**
   - Xem console logs để biết lỗi chi tiết
   - Test connection qua API `/api/email/test`

### Gmail: "Less secure app access"

Gmail không còn hỗ trợ "Less secure app access". Phải sử dụng **App Password**.

### Port bị chặn

- Port 587 (TLS) thường không bị chặn
- Port 465 (SSL) có thể bị chặn bởi firewall
- Thử đổi port hoặc liên hệ hosting provider

---

## 📚 API Endpoints

### Test Email Configuration
```
GET /api/email/test
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Email configuration is valid and connection successful"
}
```

### Send Test Email
```
POST /api/email/test-send
Authorization: Bearer <token>
Content-Type: application/json

{
  "to": "test@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully to test@example.com"
}
```

---

## ✅ Checklist

- [x] Cài đặt nodemailer
- [x] Tạo Email Service
- [x] Tạo Email Templates
- [x] Tích hợp vào Contact Form
- [x] Tạo Test Email API
- [ ] Cấu hình SMTP trong CMS Admin
- [ ] Test email configuration
- [ ] Test gửi email thực tế

---

## 🚀 Next Steps

1. **Cấu hình SMTP** trong CMS Admin Settings
2. **Test email configuration** qua API hoặc Admin UI
3. **Submit contact form** để test email tự động
4. **Kiểm tra inbox** để xác nhận email được gửi

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Console logs trong backend
2. Email service logs
3. SMTP server logs (nếu có quyền truy cập)

