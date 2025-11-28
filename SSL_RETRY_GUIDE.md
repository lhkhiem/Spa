# Hướng dẫn Retry SSL Setup

## ✅ DNS đã sẵn sàng

Kiểm tra cho thấy DNS records đã có:
- ✅ `banyco.vn` → `14.225.205.116` (có từ Google DNS và Cloudflare)
- ✅ `www.banyco.vn` → CNAME → `banyco.vn` → `14.225.205.116`
- ✅ `api.banyco.vn` → `14.225.205.116`
- ✅ `admin.banyco.vn` → `14.225.205.116`

## 🔄 Thử lại SSL Setup

### Option 1: Thử lại với script tự động (Khuyến nghị)

```bash
cd /var/www/Spa
sudo ./setup-ssl-banyco-vn-retry.sh
```

Script sẽ:
- Kiểm tra DNS từ nhiều nguồn (Google, Cloudflare, Local)
- Tự động setup SSL cho tất cả 4 domain
- Báo lỗi nếu có vấn đề

### Option 2: Setup từng domain (Nếu Option 1 fail)

Nếu Let's Encrypt vẫn chưa thấy DNS, thử setup từng domain:

**Bước 1: Setup SSL cho api và admin (chắc chắn có DNS):**
```bash
sudo certbot --nginx \
  -d api.banyco.vn \
  -d admin.banyco.vn \
  --non-interactive \
  --agree-tos \
  --email sales@banyco.net
```

**Bước 2: Đợi 10-15 phút, rồi thêm banyco.vn và www:**
```bash
sudo certbot --nginx \
  -d banyco.vn \
  -d www.banyco.vn \
  --non-interactive \
  --agree-tos \
  --email sales@banyco.net
```

### Option 3: Sử dụng DNS challenge (Nếu HTTP challenge fail)

Nếu HTTP challenge vẫn fail, có thể dùng DNS challenge:

```bash
sudo certbot certonly --manual --preferred-challenges dns \
  -d banyco.vn \
  -d www.banyco.vn \
  -d api.banyco.vn \
  -d admin.banyco.vn \
  --email sales@banyco.net
```

Certbot sẽ yêu cầu thêm TXT record vào DNS. Sau đó chạy:
```bash
sudo certbot --nginx -d banyco.vn -d www.banyco.vn -d api.banyco.vn -d admin.banyco.vn
```

## 🔍 Kiểm tra vấn đề

### 1. Kiểm tra Port 80 có mở không

```bash
sudo netstat -tlnp | grep :80
# Should show nginx listening on port 80
```

### 2. Kiểm tra Firewall

```bash
sudo ufw status
# Nếu cần, mở port 80 và 443:
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 3. Kiểm tra Nginx đang chạy

```bash
sudo systemctl status nginx
```

### 4. Test HTTP access từ bên ngoài

```bash
curl -I http://banyco.vn
# Should return HTTP 301 redirect to HTTPS
```

### 5. Xem log chi tiết

```bash
sudo certbot --nginx -d banyco.vn -v
# -v flag để xem log chi tiết
```

## ⏰ Đợi DNS Propagation

Nếu vẫn fail, có thể Let's Encrypt servers chưa thấy DNS. Đợi thêm:
- **5-15 phút**: Thường đủ cho hầu hết các trường hợp
- **30 phút**: Đảm bảo DNS đã propagate đầy đủ
- **1 giờ**: Trường hợp hiếm, DNS propagation chậm

Sau đó thử lại:
```bash
sudo ./setup-ssl-banyco-vn-retry.sh
```

## 📝 Lưu ý

1. **DNS Propagation**: Có thể mất thời gian để Let's Encrypt servers thấy DNS
2. **Rate Limit**: Let's Encrypt có rate limit, không nên thử quá nhiều lần trong thời gian ngắn
3. **Port 80**: Phải accessible từ internet để HTTP challenge hoạt động

## ✅ Sau khi SSL setup thành công

1. **Kiểm tra HTTPS:**
   ```bash
   curl -I https://banyco.vn
   curl -I https://api.banyco.vn/api/health
   curl -I https://admin.banyco.vn
   ```

2. **Cập nhật environment variables:**
   - Backend: `FRONTEND_DOMAIN=banyco.vn`, `API_DOMAIN=api.banyco.vn`, `ADMIN_DOMAIN=admin.banyco.vn`
   - Frontend: `NEXT_PUBLIC_API_URL=https://api.banyco.vn/api`

3. **Restart services:**
   ```bash
   pm2 restart cms-backend
   pm2 restart ecommerce-frontend
   pm2 restart cms-admin
   ```



