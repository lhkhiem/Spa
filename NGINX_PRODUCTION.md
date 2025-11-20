# Nginx và Production Mode

## Câu trả lời ngắn gọn:
**KHÔNG CẦN restart nginx** khi chuyển sang production mode. Nginx chỉ proxy pass đến các port, không phụ thuộc vào dev/production mode của ứng dụng.

## Tuy nhiên, nên tối ưu nginx cho production:

### Các tối ưu nên có:
1. ✅ **Gzip compression** - Giảm bandwidth
2. ✅ **Cache static files** - Cache `/_next/static/` từ Next.js
3. ✅ **Cache uploads** - Cache `/uploads/` từ backend
4. ✅ **Proxy buffering** - Tối ưu proxy performance
5. ✅ **Bỏ WebSocket HMR** - Không cần cho production (chỉ cần cho dev)

### Cách tối ưu:

#### Tự động (Khuyến nghị):
```bash
sudo bash /var/www/Spa/optimize-nginx-production.sh
```

Script này sẽ:
- Backup configs hiện tại
- Tạo config tối ưu với caching và compression
- Test và reload nginx

#### Thủ công:
Chỉ cần reload nginx sau khi build production:
```bash
sudo nginx -t  # Test config
sudo systemctl reload nginx  # Reload (không cần restart)
```

## Lưu ý:

### Nginx không cần thay đổi khi:
- ✅ Chuyển từ dev mode sang production mode
- ✅ Build lại ứng dụng
- ✅ Restart PM2 services

### Nginx chỉ cần reload khi:
- ⚠️ Thay đổi cấu hình nginx
- ⚠️ Thêm/đổi domain
- ⚠️ Thay đổi SSL certificates

### Kiểm tra nginx:
```bash
# Status
sudo systemctl status nginx

# Test config
sudo nginx -t

# Reload (không downtime)
sudo systemctl reload nginx

# Restart (có downtime ngắn)
sudo systemctl restart nginx
```

## Workflow Production:

1. **Build ứng dụng:**
   ```bash
   bash build-production.sh
   ```

2. **Start production mode:**
   ```bash
   bash start-production.sh
   ```

3. **Tối ưu nginx (tùy chọn, nhưng khuyến nghị):**
   ```bash
   sudo bash optimize-nginx-production.sh
   ```

4. **Kiểm tra:**
   ```bash
   pm2 status
   curl https://banyco-demo.pressup.vn/api/health
   ```

**Kết luận:** Nginx đã chạy tốt, chỉ cần tối ưu thêm cho production (không bắt buộc nhưng nên làm).

