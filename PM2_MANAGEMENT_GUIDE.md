# Hướng dẫn Quản lý PM2 cho Domain trên VPS

## 📊 Phân tích tình trạng hiện tại

### Vấn đề phát hiện:
1. **2 processes cùng tên "cms"** - Khó phân biệt
   - Process 0: Backend (cwd: `/var/www/Spa/CMS/backend/src`)
   - Process 1: CMS Admin Frontend (cwd: `/var/www/Spa/CMS/frontend/admin`)
   
2. **Đang chạy dev mode** (`npm run dev`) - Không phù hợp production
   - Dev mode tự động restart khi code thay đổi
   - Số lần restart cao (199 và 1035) là bình thường với dev mode

3. **Thiếu Ecommerce Frontend** trong PM2
   - Ecommerce đang chạy ngoài PM2 (process riêng)

## 🔧 Giải pháp

### Bước 1: Tạo Ecosystem Config

File `ecosystem.config.js` đã được tạo tại `/var/www/Spa/ecosystem.config.js` với:
- ✅ Tên rõ ràng: `cms-backend`, `ecommerce-frontend`, `cms-admin`
- ✅ Production mode
- ✅ Logging riêng cho từng service
- ✅ Auto-restart với giới hạn
- ✅ Memory limit

### Bước 2: Sửa lại cấu hình PM2

**Cách 1: Sử dụng script tự động (Khuyến nghị)**
```bash
cd /var/www/Spa
bash fix-pm2-setup.sh
```

Script này sẽ:
- Kiểm tra build files
- Hỏi có muốn build không (nếu chưa build)
- Stop và xóa processes cũ
- Start lại với ecosystem.config.js
- Save PM2 config

**Cách 2: Thủ công**
```bash
# 1. Stop và xóa processes cũ
pm2 stop all
pm2 delete all

# 2. Start với ecosystem config
cd /var/www/Spa
pm2 start ecosystem.config.js

# 3. Save config
pm2 save
```

## 📋 Các lệnh PM2 cơ bản

### Xem trạng thái
```bash
pm2 list                    # Danh sách tất cả processes
pm2 status                  # Trạng thái chi tiết
pm2 describe cms-backend    # Thông tin một process
```

### Quản lý processes
```bash
# Restart
pm2 restart cms-backend
pm2 restart ecommerce-frontend
pm2 restart cms-admin
pm2 restart all

# Stop
pm2 stop cms-backend
pm2 stop all

# Start
pm2 start cms-backend
pm2 start all

# Delete (xóa khỏi PM2)
pm2 delete cms-backend
pm2 delete all

# Reload (zero-downtime)
pm2 reload cms-backend
pm2 reload all
```

### Xem logs
```bash
pm2 logs                    # Tất cả logs
pm2 logs cms-backend        # Logs một service
pm2 logs --lines 50          # 50 dòng cuối
pm2 logs --err              # Chỉ error logs
pm2 flush                   # Xóa logs
```

### Monitoring
```bash
pm2 monit                   # Dashboard monitoring
pm2 info cms-backend        # Thông tin chi tiết
```

## 🎯 Mapping Domain với Services

| Domain | Service | Port | PM2 Name |
|--------|---------|------|----------|
| `banyco-demo.pressup.vn` | Ecommerce Frontend | 3000 | `ecommerce-frontend` |
| `admin.banyco-demo.pressup.vn` | CMS Admin | 3013 | `cms-admin` |
| `api.banyco-demo.pressup.vn` | Backend API | 3011 | `cms-backend` |

### Restart theo domain
```bash
# Restart Ecommerce website
pm2 restart ecommerce-frontend

# Restart CMS Admin
pm2 restart cms-admin

# Restart Backend API
pm2 restart cms-backend
```

## 🔄 Workflow thường dùng

### Deploy code mới
```bash
# 1. Pull code
cd /var/www/Spa
git pull

# 2. Build (nếu cần)
bash build-production.sh

# 3. Restart services
pm2 restart all

# 4. Kiểm tra
pm2 status
pm2 logs --lines 20
```

### Update một service
```bash
# Ví dụ: Update backend
cd /var/www/Spa/CMS/backend
git pull
npm install
npm run build
pm2 restart cms-backend
pm2 logs cms-backend --lines 20
```

### Kiểm tra health
```bash
# Backend
curl http://localhost:3011/api/health

# Ecommerce
curl http://localhost:3000

# CMS Admin
curl http://localhost:3013
```

## ⚙️ Auto-start khi reboot

```bash
# Setup auto-start
pm2 startup

# Chạy command được hiển thị (với sudo)
# Ví dụ: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u pressup-cms --hp /home/pressup-cms

# Save current processes
pm2 save
```

## 🐛 Troubleshooting

### Service không start
```bash
# Xem logs
pm2 logs <service-name> --err --lines 50

# Kiểm tra port
lsof -i :3000
lsof -i :3011
lsof -i :3013

# Kiểm tra process
pm2 describe <service-name>
```

### Service restart liên tục
```bash
# Xem error logs
pm2 logs <service-name> --err

# Kiểm tra memory
pm2 monit

# Kiểm tra cấu hình
pm2 describe <service-name>
```

### Reset PM2
```bash
# Xóa tất cả
pm2 delete all

# Start lại từ ecosystem config
pm2 start ecosystem.config.js
pm2 save
```

## 📝 Lưu ý quan trọng

1. **Dev vs Production Mode:**
   - Dev mode (`npm run dev`): Tự động restart khi code thay đổi, số lần restart cao là bình thường
   - Production mode (`npm start`): Chạy từ build files, ổn định hơn

2. **Số lần restart cao:**
   - Với dev mode: Bình thường (do hot reload)
   - Với production mode: Cần kiểm tra logs nếu > 10 lần

3. **Memory usage:**
   - Backend: ~50-60MB
   - Frontend: ~50-100MB mỗi service
   - Nếu > 500MB: Cần kiểm tra memory leak

4. **Logs:**
   - Error logs: `/var/log/pm2/*-error.log`
   - Output logs: `/var/log/pm2/*-out.log`
   - Hoặc: `~/.pm2/logs/`

## ✅ Checklist sau khi setup

- [ ] Tất cả 3 services đang chạy: `pm2 list`
- [ ] Tên services rõ ràng (không trùng)
- [ ] Production mode (không phải dev)
- [ ] Auto-start đã setup: `pm2 startup`
- [ ] Config đã save: `pm2 save`
- [ ] Logs đang được ghi: `pm2 logs --lines 5`
- [ ] Health check OK: `curl http://localhost:3011/api/health`

