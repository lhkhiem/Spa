# Hướng dẫn Debug trong Browser Window bên trong

## ✅ Có thể quan sát được!

Bạn có thể mở DevTools và xem Console logs ngay cả khi test trong browser window bên trong.

---

## 🖥️ Cách 1: Mở DevTools trong Browser Window bên trong

### Nếu là iframe hoặc popup window:

1. **Click chuột phải** vào bên trong browser window
2. Chọn **"Inspect"** hoặc **"Kiểm tra"**
3. DevTools sẽ mở cho window đó

### Nếu là tab mới:

1. **Click vào tab** của browser window bên trong
2. Nhấn **`F12`** hoặc **`Ctrl+Shift+I`**
3. DevTools sẽ mở cho tab đó

---

## 🖥️ Cách 2: Mở DevTools từ Browser chính

### Nếu browser window bên trong là popup:

1. **Focus vào popup window** (click vào nó)
2. Nhấn **`F12`** trong popup window
3. DevTools sẽ mở cho popup đó

### Nếu là iframe:

1. **Click chuột phải** vào iframe
2. Chọn **"Inspect"**
3. Hoặc trong DevTools của page chính:
   - Mở DevTools (`F12`)
   - Tab **"Elements"**
   - Tìm `<iframe>` tag
   - Click chuột phải → **"Inspect"**

---

## 🖥️ Cách 3: Dùng Browser Extension

### Chrome DevTools cho iframe:

1. Cài extension: **"Chrome DevTools for iframes"**
2. Extension sẽ tự động detect iframes
3. Có thể switch giữa main page và iframe

---

## 🎯 Cách tốt nhất: Test trực tiếp trên Browser chính

Thay vì test trong browser window bên trong, bạn có thể:

1. **Copy URL** từ browser window bên trong
2. **Paste vào tab mới** của browser chính
3. **Mở DevTools** (`F12`) trong tab mới
4. Test và xem logs dễ dàng hơn

---

## 📋 Checklist Debug

- [ ] Mở DevTools trong browser window bên trong (F12 hoặc Inspect)
- [ ] Chọn tab "Console"
- [ ] Clear console (Ctrl+L)
- [ ] Test thanh toán
- [ ] Xem logs sau khi redirect

---

## ⚠️ Lưu ý

1. **Mỗi window/tab có DevTools riêng:** Phải mở DevTools cho đúng window bạn đang test
2. **Iframe có context riêng:** Có thể cần switch context trong DevTools
3. **Popup có thể bị block:** Nếu popup bị block, thử allow popups

---

## 🔍 Nếu không mở được DevTools

1. **Thử click chuột phải** → Inspect
2. **Thử F12** trong window đó
3. **Thử Ctrl+Shift+I** (Windows/Linux) hoặc **Cmd+Option+I** (Mac)
4. **Copy URL** và mở trong tab mới

