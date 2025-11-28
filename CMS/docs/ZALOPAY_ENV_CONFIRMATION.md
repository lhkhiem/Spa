# Xác nhận Môi trường ZaloPay

## ✅ Kết quả kiểm tra

**Bạn đang sử dụng: ZALOPAY SANDBOX (Môi trường Test)**

---

## 📊 So sánh Sandbox vs Production

| Tiêu chí | **SANDBOX** (Hiện tại) | **PRODUCTION** |
|---------|----------------------|----------------|
| **API Base URL** | `https://sb-openapi.zalopay.vn/v2` | `https://openapi.zalopay.vn/v2` |
| **Dấu hiệu** | Có prefix **"sb-"** | Không có "sb-" |
| **App ID** | 2554 (Sandbox) | Số khác (Production) |
| **Trong Dashboard** | Có nhãn **"SB"** hoặc **"Sandbox"** | Không có nhãn |
| **Mục đích** | Test, không tính phí | Giao dịch thật |
| **QR Code** | Chỉ quét bằng **app Sandbox** | Quét bằng **app Production** |
| **Tiền** | Không tính phí thật | Tính phí thật |

---

## 🔍 Cách kiểm tra

### 1. Kiểm tra file `.env`:
```bash
grep ZP_API_BASE CMS/backend/.env
```

**Kết quả hiện tại:**
```
ZP_API_BASE=https://sb-openapi.zalopay.vn/v2  ← SANDBOX
```

### 2. Kiểm tra trong code:
File: `CMS/backend/src/services/zalopay.ts`
- Line 147: `const base = (process.env.ZP_API_BASE || 'https://sb-openapi.zalopay.vn/v2')`
- Default cũng là Sandbox

### 3. Kiểm tra trong ZaloPay Dashboard:
- App có nhãn **"SB"** hoặc **"Sandbox"** → SANDBOX
- App không có nhãn → PRODUCTION

---

## ⚠️ Lưu ý quan trọng

### Khi dùng SANDBOX:
- ✅ Dùng để test, không tính phí
- ✅ Có thể test nhiều lần
- ⚠️ QR code chỉ quét được bằng **app ZaloPay Sandbox**
- ⚠️ Không thể quét bằng app ZaloPay Production

### Khi chuyển sang PRODUCTION:
1. Đăng ký và được ZaloPay duyệt tài khoản Production
2. Lấy App ID, Key1, Key2 từ Production Dashboard
3. Cập nhật `.env`:
   ```bash
   ZP_API_BASE=https://openapi.zalopay.vn/v2  # Bỏ "sb-"
   ZP_APP_ID=<Production App ID>
   ZP_KEY1=<Production Key1>
   ZP_CALLBACK_KEY=<Production Key2>
   ```
4. Restart backend: `pm2 restart cms-backend`

---

## 📝 Kết luận

**Hiện tại bạn đang dùng SANDBOX để test.**

Nếu muốn chuyển sang Production, cần:
- Được ZaloPay duyệt tài khoản Production
- Cập nhật credentials trong `.env`
- Đổi `ZP_API_BASE` từ `sb-openapi` sang `openapi`

