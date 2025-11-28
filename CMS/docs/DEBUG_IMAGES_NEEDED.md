# Hình ảnh cần thiết để Debug ZaloPay

## 📸 Các hình ảnh cần cung cấp

### 1. Browser DevTools Console (Quan trọng nhất)

**Cách mở:**
- Nhấn `F12` hoặc `Ctrl+Shift+I` (Windows/Linux) hoặc `Cmd+Option+I` (Mac)
- Chọn tab **"Console"**

**Cần chụp:**
- Tất cả các messages trong Console (errors, warnings, logs)
- Đặc biệt chú ý:
  - `[Checkout Result] Query error:` messages
  - `[Payments API] Query ZaloPay order error:` messages
  - Bất kỳ error nào liên quan đến API calls

**Ví dụ cần thấy:**
```
[Checkout Result] Query error: ...
[Payments API] Query ZaloPay order error: ...
```

---

### 2. Browser DevTools Network Tab (Rất quan trọng)

**Cách mở:**
- Nhấn `F12` → Tab **"Network"**
- Refresh trang `/checkout/result`

**Cần chụp:**
- Tìm request đến `/api/payments/zalopay/query/...`
- Click vào request đó
- Chụp:
  - **Headers tab**: Request URL, Request Headers
  - **Response tab**: Response body (JSON)
  - **Preview tab**: Formatted response

**Cần thấy:**
- Request URL: `https://api.banyco.vn/api/payments/zalopay/query/251129_ORDMIIHWO1F8A4HW`
- Response status: 200, 400, 500, etc.
- Response body: `{"success": true, "data": {...}}`

---

### 3. Backend Logs (Tôi có thể tự check, nhưng nếu có thì tốt)

**Cách lấy:**
```bash
pm2 logs cms-backend --lines 200 | grep -E "ZaloPay|251129_ORDMIIHWO1F8A4HW"
```

**Cần thấy:**
- `[ZaloPay Callback] Received:` với `return_code`, `amount`, `mac_valid`
- `[ZaloPay Callback] Processing payment:` với payment status
- `[ZaloPay Callback] Updated order:` với `rows_affected`
- `[Payments] Query -` messages

---

### 4. Database Query Result (Nếu có thể)

**Cách lấy:**
```bash
cd /var/www/Spa/CMS/backend
npx ts-node src/scripts/findZaloPayOrder.ts "251129_ORDMIIHWO1F8A4HW"
```

**Cần thấy:**
- Order payment_status: `failed` hay `paid`?
- Order status: `pending` hay `processing`?
- ZP Trans ID: có giá trị không?

---

## 🎯 Thứ tự ưu tiên

1. **Browser DevTools Console** - Quan trọng nhất
2. **Browser DevTools Network Tab** - Quan trọng thứ hai
3. **Backend Logs** - Nếu có thể
4. **Database Query** - Nếu có thể

---

## 📝 Hướng dẫn chụp màn hình

### Console:
1. Mở DevTools (F12)
2. Chọn tab "Console"
3. Clear console (icon 🚫 hoặc `Ctrl+L`)
4. Refresh trang `/checkout/result`
5. Chụp toàn bộ console output

### Network:
1. Mở DevTools (F12)
2. Chọn tab "Network"
3. Clear network log (icon 🚫)
4. Refresh trang `/checkout/result`
5. Tìm request `zalopay/query`
6. Click vào request
7. Chụp cả 3 tabs: Headers, Response, Preview

---

## ✅ Checklist

- [ ] Console tab với tất cả messages
- [ ] Network tab với request `/api/payments/zalopay/query/...`
- [ ] Response body từ Network tab
- [ ] Backend logs (nếu có)
- [ ] Database query result (nếu có)

