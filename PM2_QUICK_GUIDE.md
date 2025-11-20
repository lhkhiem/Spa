# Hướng dẫn nhanh: Quản lý PM2 cho Domain

## 📊 Tình trạng hiện tại

Bạn đang có:
- ✅ 2 processes đang chạy (cả 2 tên "cms")
- ⚠️ Đang chạy **dev mode** (`npm run dev`)
- ⚠️ Số lần restart cao (199 và 1035) - **Bình thường với dev mode**
- ⚠️ Thiếu Ecommerce trong PM2

## 🎯 Ý nghĩa các số trong PM2 list

| Cột | Ý nghĩa | Giá trị của bạn |
|-----|---------|-----------------|
| **id** | ID process trong PM2 | 0, 1 |
| **name** | Tên process | "cms" (cả 2 trùng) |
| **↺** | Số lần restart | 199, 1035 |
| **status** | Trạng thái | online ✅ |
| **cpu** | % CPU sử dụng | 0% |
| **memory** | Memory sử dụng | ~55MB |

### Giải thích số lần restart cao:
- **Dev mode** tự động restart khi code thay đổi → Bình thường
- **Production mode** restart > 10 lần → Cần kiểm tra

## 🚀 Cách sửa lại (3 bước)

### Bước 1: Build Production (nếu chưa build)
```bash
cd /var/www/Spa
bash build-production.sh
```

### Bước 2: Sửa lại PM2 config
```bash
cd /var/www/Spa
bash fix-pm2-setup.sh
```

Hoặc thủ công:
```bash
# Stop và xóa processes cũ
pm2 stop all
pm2 delete all

# Start với ecosystem config
pm2 start ecosystem.config.js

# Save
pm2 save
```

### Bước 3: Kiểm tra
```bash
pm2 list
# Sẽ thấy 3 processes với tên rõ ràng:
# - cms-backend
# - ecommerce-frontend  
# - cms-admin
```

## 📋 Các lệnh thường dùng

### Xem trạng thái
```bash
pm2 list              # Danh sách
pm2 status            # Chi tiết
pm2 logs              # Logs
```

### Quản lý
```bash
pm2 restart all       # Restart tất cả
pm2 restart cms-backend  # Restart một service
pm2 stop all          # Stop tất cả
pm2 start all         # Start tất cả
```

### Xem logs
```bash
pm2 logs                      # Tất cả
pm2 logs cms-backend          # Một service
pm2 logs --lines 50           # 50 dòng cuối
pm2 logs --err                # Chỉ errors
```

## 🎯 Mapping Domain

| Domain | PM2 Name | Port |
|--------|----------|------|
| `banyco-demo.pressup.vn` | `ecommerce-frontend` | 3000 |
| `admin.banyco-demo.pressup.vn` | `cms-admin` | 3013 |
| `api.banyco-demo.pressup.vn` | `cms-backend` | 3011 |

## ⚡ Quick Commands

```bash
# Restart theo domain
pm2 restart ecommerce-frontend  # banyco-demo.pressup.vn
pm2 restart cms-admin            # admin.banyco-demo.pressup.vn
pm2 restart cms-backend          # api.banyco-demo.pressup.vn

# Xem logs một service
pm2 logs cms-backend --lines 20

# Monitoring
pm2 monit
```

## ✅ Sau khi sửa xong

Bạn sẽ thấy:
```
┌────┬─────────────────────┬─────────┬─────────┬──────────┐
│ id │ name                │ status  │ cpu     │ memory   │
├────┼─────────────────────┼─────────┼─────────┼──────────┤
│ 0  │ cms-backend         │ online  │ 0%      │ 55MB     │
│ 1  │ ecommerce-frontend  │ online  │ 0%      │ 60MB     │
│ 2  │ cms-admin           │ online  │ 0%      │ 58MB     │
└────┴─────────────────────┴─────────┴─────────┴──────────┘
```

**Tên rõ ràng, dễ quản lý!** 🎉

