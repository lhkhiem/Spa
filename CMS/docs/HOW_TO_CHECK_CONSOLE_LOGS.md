# Hướng dẫn Kiểm tra Console Logs

## 📋 Các bước để xem Console Logs

### Bước 1: Mở Console TRƯỚC KHI test thanh toán

1. **Mở website:** `https://banyco.vn`
2. **Mở Developer Tools:**
   - Nhấn `F12` hoặc
   - `Ctrl+Shift+I` (Windows/Linux) hoặc
   - `Cmd+Option+I` (Mac)
3. **Chọn tab "Console":**
   - Click vào tab **"Console"** ở thanh trên cùng của DevTools
4. **Clear Console:**
   - Click icon 🚫 (Clear console) hoặc nhấn `Ctrl+L`
   - Để xóa logs cũ, chỉ thấy logs mới

### Bước 2: Giữ Console mở trong suốt quá trình test

- **KHÔNG đóng Console** khi test
- Console sẽ tự động hiển thị logs khi code chạy

### Bước 3: Test thanh toán

1. **Thêm sản phẩm vào giỏ hàng**
2. **Vào Checkout**
3. **Chọn ZaloPay**
4. **Nhấn "Thanh toán ZaloPay"**
5. **Thanh toán trên ZaloPay**
6. **ZaloPay redirect về `/checkout/result`**

### Bước 4: Xem Console Logs

Sau khi ZaloPay redirect về `/checkout/result`, bạn sẽ thấy logs trong Console:

```
[Checkout Result] ===== Component RENDERED =====
[Checkout Result] Window location: https://banyco.vn/checkout/result?apptransid=...
[Checkout Result] URL search params: ?apptransid=...&status=1
[Checkout Result] SearchParams available: true
[Checkout Result] Page loaded, checking URL params...
[Checkout Result] URL params: { apptransid: "...", status: "1", ... }
[Checkout Result] Using app_trans_id: ...
[Checkout Result] Querying ZaloPay order status for: ...
[Checkout Result] Query response: { ... }
```

---

## 🎯 Tóm tắt: Console ở bước nào?

**Bước 1: Mở Console TRƯỚC KHI test** (quan trọng nhất!)
- Mở website → F12 → Tab Console → Clear console

**Bước 2-3: Test thanh toán**
- Giữ Console mở
- Thực hiện thanh toán

**Bước 4: Xem logs**
- Sau khi redirect về `/checkout/result`
- Logs sẽ tự động xuất hiện trong Console

---

## ⚠️ Lưu ý

1. **Phải mở Console TRƯỚC:** Nếu mở sau khi redirect, có thể bỏ lỡ logs đầu tiên
2. **Clear console:** Để dễ đọc logs mới
3. **Giữ Console mở:** Không đóng trong suốt quá trình test

---

## 📸 Nếu không thấy logs

1. **Kiểm tra tab Console:** Đảm bảo đang ở tab "Console" (không phải Network, Elements, etc.)
2. **Kiểm tra filter:** Đảm bảo không có filter nào đang bật (xem thanh Filter)
3. **Thử Incognito mode:** Mở Incognito/Private window để tránh cache
4. **Hard refresh:** `Ctrl+Shift+R` (Windows/Linux) hoặc `Cmd+Shift+R` (Mac)

---

## 🔍 Logs cần tìm

Tìm các logs bắt đầu với:
- `[Checkout Result]` - Logs từ component
- `[Payments API]` - Logs từ API calls
- `[Checkout Result] Query error:` - Lỗi khi query API

