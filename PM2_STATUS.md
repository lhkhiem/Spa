# Trạng thái PM2 hiện tại

## ✅ Đã hoàn thành

1. **Build Production:**
   - ✅ CMS Backend đã build
   - ✅ CMS Admin Frontend đã build
   - ⚠️ Ecommerce Frontend đang build (có một số lỗi TypeScript cần sửa)

2. **PM2 Configuration:**
   - ✅ Đã tạo `ecosystem.config.js` với 3 services rõ ràng:
     - `cms-backend` (port 3011)
     - `ecommerce-frontend` (port 3000)
     - `cms-admin` (port 3013)
   - ✅ Đã stop và xóa processes cũ
   - ✅ Đã start với config mới
   - ✅ Đã save PM2 config

3. **Services đang chạy:**
   - ✅ `cms-backend`: Online, 0 restarts
   - ✅ `cms-admin`: Online, 0 restarts
   - ⚠️ `ecommerce-frontend`: Errored (chờ build hoàn thành)

## ⚠️ Cần xử lý

1. **Ecommerce Build:**
   - Đang có một số lỗi TypeScript cần sửa
   - Sau khi build thành công, restart `ecommerce-frontend` sẽ hoạt động

2. **Auto-start:**
   - Cần chạy lệnh sau để setup auto-start:
   ```bash
   sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pressup-cms --hp /home/pressup-cms
   ```

## 📋 Các lệnh hữu ích

```bash
# Xem trạng thái
pm2 list

# Restart một service
pm2 restart ecommerce-frontend

# Xem logs
pm2 logs ecommerce-frontend

# Xem tất cả logs
pm2 logs

# Monitoring
pm2 monit
```

## 🎯 Mapping Domain

| Domain | PM2 Name | Port | Status |
|--------|----------|------|--------|
| `banyco-demo.pressup.vn` | `ecommerce-frontend` | 3000 | ⚠️ Chờ build |
| `admin.banyco-demo.pressup.vn` | `cms-admin` | 3013 | ✅ Online |
| `api.banyco-demo.pressup.vn` | `cms-backend` | 3011 | ✅ Online |

