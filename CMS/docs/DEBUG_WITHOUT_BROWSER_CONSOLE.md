# Debug ZaloPay mà không cần Browser Console

## ❌ Tôi không thể xem Browser Preview trong Cursor IDE

Tôi **KHÔNG thể** tự động quan sát browser preview trong Cursor IDE. Tôi chỉ có thể:
- ✅ Đọc files
- ✅ Chạy terminal commands
- ✅ Xem backend logs
- ✅ Xem frontend build logs
- ❌ **KHÔNG thể** xem browser preview trực tiếp

---

## ✅ Các cách Debug thay thế

### Cách 1: Xem Backend Logs (Tốt nhất)

Backend logs sẽ hiển thị tất cả thông tin về callback và query:

```bash
# Xem logs real-time
pm2 logs cms-backend

# Xem logs với filter
pm2 logs cms-backend | grep "ZaloPay\|Checkout Result\|251129"

# Xem logs gần đây
pm2 logs cms-backend --lines 200 | grep "ZaloPay"
```

**Logs sẽ hiển thị:**
- Callback được nhận hay không
- Order được update hay không
- Query endpoint response
- Errors nếu có

### Cách 2: Test API trực tiếp

Test query endpoint trực tiếp từ terminal:

```bash
# Test query endpoint
curl "https://api.banyco.vn/api/payments/zalopay/query/251129_ORDMIIJFUZ2UEPX0"

# Hoặc với jq để format
curl -s "https://api.banyco.vn/api/payments/zalopay/query/251129_ORDMIIJFUZ2UEPX0" | jq '.'
```

### Cách 3: Kiểm tra Database

Kiểm tra order status trong database:

```bash
cd /var/www/Spa/CMS/backend
npx ts-node src/scripts/findZaloPayOrder.ts "app_trans_id"
```

### Cách 4: Chụp màn hình và gửi

Nếu test trong Cursor IDE preview:
1. Chụp màn hình Console (nếu có thể mở DevTools)
2. Chụp màn hình Network tab
3. Gửi cho tôi để phân tích

---

## 🎯 Cách Debug hiệu quả nhất

### Bước 1: Test thanh toán

1. Tạo đơn hàng với ZaloPay
2. Thanh toán trên ZaloPay
3. Lấy `app_trans_id` từ URL redirect

### Bước 2: Kiểm tra Backend Logs

```bash
# Xem logs callback
pm2 logs cms-backend --lines 500 | grep -A 20 "ZaloPay Callback.*Received"

# Xem logs query
pm2 logs cms-backend --lines 500 | grep -A 10 "Query.*order"
```

### Bước 3: Test Query Endpoint

```bash
# Thay app_trans_id bằng ID thực tế
curl "https://api.banyco.vn/api/payments/zalopay/query/APP_TRANS_ID"
```

### Bước 4: Kiểm tra Database

```bash
cd /var/www/Spa/CMS/backend
npx ts-node src/scripts/findZaloPayOrder.ts "APP_TRANS_ID"
```

---

## 📋 Checklist Debug

- [ ] Test thanh toán và lấy `app_trans_id`
- [ ] Xem backend logs: `pm2 logs cms-backend | grep ZaloPay`
- [ ] Test query endpoint: `curl .../query/APP_TRANS_ID`
- [ ] Kiểm tra database: `findZaloPayOrder.ts`
- [ ] Fix order nếu cần: `fixZaloPayOrder.ts`

---

## 🔍 Thông tin cần cung cấp

Nếu test trong Cursor IDE preview, vui lòng cung cấp:

1. **Backend logs:**
   ```bash
   pm2 logs cms-backend --lines 200 | grep -E "ZaloPay|251129"
   ```

2. **Query endpoint response:**
   ```bash
   curl "https://api.banyco.vn/api/payments/zalopay/query/APP_TRANS_ID"
   ```

3. **Database status:**
   ```bash
   npx ts-node src/scripts/findZaloPayOrder.ts "APP_TRANS_ID"
   ```

4. **Screenshot** (nếu có thể mở DevTools trong preview)

---

## 💡 Khuyến nghị

**Tốt nhất:** Test trên browser thật (Chrome/Firefox) thay vì preview trong IDE:
- Mở browser thật
- Test thanh toán
- Mở DevTools (F12)
- Xem Console và Network tabs
- Dễ debug hơn nhiều!

