# 📧 Hướng Dẫn: SMTP Username là gì?

## ❓ SMTP Username là gì?

**SMTP Username** là tài khoản đăng nhập để kết nối với SMTP server và gửi email. Đây là thông tin xác thực (authentication) để SMTP server biết bạn là ai.

---

## 📋 Username cho các SMTP Provider phổ biến

### 1. Gmail

**Username:** Email Gmail của bạn

```
Username: your-email@gmail.com
Password: App Password (16 ký tự)
```

**Ví dụ:**
```
Username: hoangkhiem.tech@gmail.com
Password: abcd efgh ijkl mnop
```

**Lưu ý:**
- Phải sử dụng **App Password**, không dùng mật khẩu Gmail thông thường
- Username = From Email (thường giống nhau)

---

### 2. Outlook / Office 365

**Username:** Email Outlook/Office 365 của bạn

```
Username: your-email@outlook.com
Password: Mật khẩu email của bạn
```

**Ví dụ:**
```
Username: contact@company.com
Password: your-email-password
```

**Lưu ý:**
- Username = Email address của bạn
- Có thể là `@outlook.com`, `@hotmail.com`, hoặc domain công ty

---

### 3. SendGrid

**Username:** Luôn là `apikey` (không phải email)

```
Username: apikey
Password: API Key từ SendGrid (bắt đầu bằng SG.)
```

**Ví dụ:**
```
Username: apikey
Password: SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Lưu ý:**
- Username **LUÔN** là `apikey` (chữ thường)
- Password là API Key từ SendGrid
- From Email phải là email đã verify trong SendGrid

---

### 4. Mailgun

**Username:** Email đã verify trong Mailgun

```
Username: postmaster@your-domain.com
Password: SMTP Password từ Mailgun
```

**Ví dụ:**
```
Username: postmaster@mg.yourdomain.com
Password: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Lưu ý:**
- Username thường là `postmaster@mg.yourdomain.com`
- Password là SMTP Password (không phải API Key)

---

### 5. Amazon SES

**Username:** SMTP Username từ AWS

```
Username: AKIAIOSFODNN7EXAMPLE
Password: SMTP Password từ AWS
```

**Ví dụ:**
```
Username: AKIAIOSFODNN7EXAMPLE
Password: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**Lưu ý:**
- Username là SMTP Username (không phải Access Key ID)
- Tạo trong AWS Console → SES → SMTP Settings

---

### 6. Zoho Mail

**Username:** Email Zoho của bạn

```
Username: your-email@zoho.com
Password: Mật khẩu email hoặc App Password
```

**Ví dụ:**
```
Username: contact@yourdomain.com
Password: your-password
```

---

### 7. Custom SMTP Server

**Username:** Do provider cung cấp

```
Username: Tùy vào provider (có thể là email hoặc username)
Password: Mật khẩu do provider cung cấp
```

**Ví dụ:**
```
Username: support@yourdomain.com
Password: your-smtp-password
```

---

## 🔍 Cách tìm Username đúng

### Bước 1: Xác định SMTP Provider

Bạn đang dùng email từ đâu?
- Gmail → Username = Email Gmail
- Outlook → Username = Email Outlook
- SendGrid → Username = `apikey`
- Mailgun → Username = `postmaster@mg.yourdomain.com`
- Custom → Xem tài liệu của provider

### Bước 2: Kiểm tra tài liệu

Mỗi SMTP provider có tài liệu về SMTP settings:
- Gmail: https://support.google.com/mail/answer/7126229
- SendGrid: https://docs.sendgrid.com/for-developers/sending-email/getting-started-smtp
- Mailgun: https://documentation.mailgun.com/en/latest/user_manual.html#sending-via-smtp

### Bước 3: Test thử

Sau khi cấu hình, sử dụng **Test Email** trong CMS để kiểm tra:
- Nếu thành công → Username đúng
- Nếu lỗi authentication → Kiểm tra lại Username và Password

---

## ⚠️ Lưu ý quan trọng

1. **Username ≠ From Email**
   - Username: Dùng để đăng nhập SMTP server
   - From Email: Email hiển thị trong "From" của email gửi đi
   - Thường giống nhau, nhưng có thể khác

2. **Password không phải mật khẩu email**
   - Gmail: Dùng App Password (không phải mật khẩu Gmail)
   - SendGrid: Dùng API Key (không phải mật khẩu account)
   - Một số provider: Dùng SMTP Password riêng

3. **Case sensitive**
   - Một số provider phân biệt chữ hoa/thường
   - SendGrid: `apikey` (chữ thường)
   - Gmail: Email thường không phân biệt

---

## ✅ Checklist

Trước khi cấu hình, chuẩn bị:

- [ ] Xác định SMTP provider bạn đang dùng
- [ ] Tìm Username đúng cho provider đó
- [ ] Chuẩn bị Password (App Password, API Key, hoặc SMTP Password)
- [ ] Verify email (nếu cần - như SendGrid, Mailgun)
- [ ] Test connection sau khi cấu hình

---

## 🆘 Vẫn không biết Username là gì?

1. **Kiểm tra email từ provider:**
   - Provider thường gửi email hướng dẫn khi bạn đăng ký
   - Tìm email có subject "SMTP Settings" hoặc "Email Configuration"

2. **Xem trong dashboard:**
   - Đăng nhập vào dashboard của provider
   - Tìm mục "SMTP Settings" hoặc "Email Settings"
   - Username thường được hiển thị ở đó

3. **Liên hệ support:**
   - Nếu vẫn không tìm thấy, liên hệ support của provider
   - Họ sẽ cung cấp Username và Password chính xác

---

## 📞 Ví dụ thực tế

**Tình huống:** Bạn có email `contact@company.com` trên Gmail Workspace

**Cấu hình:**
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
Encryption: TLS
From Email: contact@company.com
From Name: Company Name
Username: contact@company.com  ← Email Gmail của bạn
Password: abcd efgh ijkl mnop  ← App Password từ Google
Enabled: ✅
```

**Giải thích:**
- Username = Email Gmail của bạn (`contact@company.com`)
- Password = App Password (tạo từ Google Account)
- From Email = Có thể giống Username






