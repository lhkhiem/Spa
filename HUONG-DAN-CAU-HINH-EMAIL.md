# Hướng Dẫn Cấu Hình Email trong CMS

## Thông tin từ cPanel

Dựa trên cấu hình email bạn cung cấp:
- **Email:** info@banyco.vn
- **Outgoing Server (SMTP):** mail49.vietnix.vn
- **SMTP Port:** 465
- **Encryption:** SSL/TLS (Recommended)
- **Authentication:** Required

## Cách nhập vào CMS

### Bước 1: Truy cập Settings
1. Đăng nhập vào CMS Admin: `https://admin.banyco.vn`
2. Vào **Dashboard** → **Settings** (hoặc click vào icon Settings ở sidebar)
3. Chọn tab **Email**

### Bước 2: Điền thông tin SMTP

Điền các trường sau theo đúng thông tin:

#### ✅ Enable Email
- **Bật toggle "Enable Email"** (chuyển sang màu xanh)

#### ✅ SMTP Host
```
mail49.vietnix.vn
```

#### ✅ SMTP Port
```
465
```
**Lưu ý:** Port 465 yêu cầu SSL encryption

#### ✅ Encryption
Chọn: **SSL**
**Lưuý:** Vì bạn dùng port 465, phải chọn **SSL** (không phải TLS)

#### ✅ SMTP Username
```
info@banyco.vn
```

#### ✅ SMTP Password
```
[Nhập mật khẩu email của bạn]
```
**Lưu ý:** Đây là mật khẩu của tài khoản email `info@banyco.vn`, không phải mật khẩu cPanel

#### ✅ From Email
```
info@banyco.vn
```
**Lưu ý:** Phải trùng với username

#### ✅ From Name
```
Banyco
```
hoặc
```
Banyco CMS
```
hoặc tên công ty của bạn

### Bước 3: Lưu cấu hình
1. Click nút **"Save Changes"** ở góc trên bên phải
2. Đợi thông báo "Settings saved"

## Tóm tắt cấu hình

| Trường | Giá trị |
|--------|---------|
| **Enable Email** | ✅ Bật (ON) |
| **SMTP Host** | `mail49.vietnix.vn` |
| **SMTP Port** | `465` |
| **Encryption** | `SSL` |
| **SMTP Username** | `info@banyco.vn` |
| **SMTP Password** | `[Mật khẩu email của bạn]` |
| **From Email** | `info@banyco.vn` |
| **From Name** | `Banyco` |

## Kiểm tra cấu hình

Sau khi lưu, bạn có thể test bằng cách:
1. Gửi email test từ CMS (nếu có tính năng test)
2. Tạo một đơn hàng test để xem email có được gửi tự động không

## Lưu ý quan trọng

1. **Port 465 = SSL**: Khi dùng port 465, bạn **PHẢI** chọn **SSL** trong dropdown Encryption, không phải TLS
2. **Port 587 = TLS**: Nếu muốn dùng TLS, bạn cần đổi port thành 587 (nhưng cPanel của bạn khuyến nghị dùng 465 với SSL)
3. **Username và From Email**: Nên giống nhau (`info@banyco.vn`)
4. **Password**: Là mật khẩu của tài khoản email, không phải mật khẩu cPanel

## Troubleshooting

### Nếu email không gửi được:

1. **Kiểm tra Enable Email đã bật chưa**
2. **Kiểm tra Password có đúng không**
3. **Kiểm tra Encryption**: Port 465 phải dùng SSL
4. **Kiểm tra logs**: Xem logs của CMS backend để biết lỗi cụ thể
   ```bash
   pm2 logs cms-backend --lines 50 | grep -i email
   ```

### Lỗi thường gặp:

- **"Authentication failed"**: Kiểm tra lại username và password
- **"Connection timeout"**: Kiểm tra SMTP Host và Port
- **"SSL/TLS error"**: Đảm bảo Encryption đúng với Port (465 = SSL, 587 = TLS)

## Sau khi cấu hình xong

Sau khi cấu hình đúng, hệ thống sẽ tự động gửi email khi:
- Có đơn hàng mới
- Đơn hàng thay đổi trạng thái
- Các sự kiện khác được cấu hình trong hệ thống




