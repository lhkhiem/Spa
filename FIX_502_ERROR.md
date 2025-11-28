# Fix 502 Bad Gateway Error

## 🔍 Vấn đề

Frontend service (`ecommerce-frontend`) đang ở trạng thái **errored** vì:
- ❌ Không có production build trong thư mục `.next`
- ❌ Service không thể start vì thiếu build files
- ❌ Port 3000 không có service nào đang chạy

## ✅ Giải pháp

### Chạy script tự động (Khuyến nghị)

```bash
cd /var/www/Spa
./rebuild-frontend.sh
```

Script sẽ:
1. Stop và xóa process cũ
2. Install dependencies (nếu cần)
3. Build frontend (`npm run build`)
4. Start lại với PM2
5. Kiểm tra status

### Hoặc làm thủ công

```bash
cd /var/www/Spa/Ecommerce

# 1. Stop frontend
pm2 stop ecommerce-frontend
pm2 delete ecommerce-frontend

# 2. Build frontend
npm run build

# 3. Start lại
pm2 start npm --name "ecommerce-frontend" -- start

# 4. Kiểm tra
pm2 status ecommerce-frontend
pm2 logs ecommerce-frontend
```

## 🔍 Kiểm tra sau khi rebuild

### 1. Kiểm tra PM2 status

```bash
pm2 status
```

`ecommerce-frontend` nên ở trạng thái **online**.

### 2. Kiểm tra local connection

```bash
curl -I http://127.0.0.1:3000
```

Nên trả về HTTP 200.

### 3. Kiểm tra từ browser

Mở `https://banyco.vn` - không còn lỗi 502.

### 4. Kiểm tra logs nếu vẫn có vấn đề

```bash
pm2 logs ecommerce-frontend --lines 50
```

## 📝 Lưu ý

1. **Build time**: Build có thể mất 2-5 phút tùy vào kích thước project
2. **Memory**: Đảm bảo server có đủ RAM (ít nhất 2GB free)
3. **Environment variables**: Đảm bảo `.env.local` đã được cập nhật với domain mới

## 🐛 Troubleshooting

### Nếu build fail:

1. **Kiểm tra dependencies:**
   ```bash
   cd /var/www/Spa/Ecommerce
   npm install
   ```

2. **Kiểm tra Node version:**
   ```bash
   node --version
   # Should be Node 18+ for Next.js 14
   ```

3. **Xem build errors:**
   ```bash
   npm run build 2>&1 | tee build.log
   ```

### Nếu vẫn 502 sau khi rebuild:

1. **Kiểm tra nginx config:**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

2. **Kiểm tra port 3000:**
   ```bash
   netstat -tlnp | grep 3000
   ```

3. **Kiểm tra firewall:**
   ```bash
   sudo ufw status
   ```

## ✅ Sau khi fix

Website sẽ hoạt động tại:
- ✅ `https://banyco.vn` - Frontend
- ✅ `https://api.banyco.vn` - API
- ✅ `https://admin.banyco.vn` - CMS Admin



