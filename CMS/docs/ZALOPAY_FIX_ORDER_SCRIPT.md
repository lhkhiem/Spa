# Script để Fix ZaloPay Order Payment Status

## 🔧 Scripts đã tạo

### 1. Tìm Order: `findZaloPayOrder.ts`

Tìm order bằng `app_trans_id` hoặc `order_number`:

```bash
cd CMS/backend
npx ts-node src/scripts/findZaloPayOrder.ts "251129_ORDMIIHO8DZN9Q2K"
# hoặc
npx ts-node src/scripts/findZaloPayOrder.ts "ORD-MIIHO8DZ-N9Q2K"
```

**Output:**
- Hiển thị thông tin order nếu tìm thấy
- Nếu không tìm thấy, hiển thị 10 orders ZaloPay gần đây nhất

### 2. Fix Order: `fixZaloPayOrder.ts`

Cập nhật order payment status từ `failed` → `paid`:

```bash
cd CMS/backend
npx ts-node src/scripts/fixZaloPayOrder.ts "251129_ORDMIIHO8DZN9Q2K"
```

**Chức năng:**
- Tìm order bằng `app_trans_id`
- Update `payment_status` từ `failed` → `paid`
- Update `status` từ `pending` → `processing` (nếu đang pending)
- Verify và hiển thị kết quả

---

## 🚀 Cách sử dụng

### Bước 1: Tìm Order

```bash
cd /var/www/Spa/CMS/backend
npx ts-node src/scripts/findZaloPayOrder.ts "app_trans_id_or_order_number"
```

### Bước 2: Fix Order

```bash
npx ts-node src/scripts/fixZaloPayOrder.ts "app_trans_id"
```

### Bước 3: Verify

Kiểm tra lại order trong CMS Admin hoặc query lại:

```bash
curl "https://api.banyco.vn/api/payments/zalopay/query/app_trans_id"
```

---

## 📝 Lưu ý

1. **Chỉ dùng cho Sandbox testing:** Script này chỉ nên dùng để fix orders trong Sandbox
2. **Production:** Trong Production, nên để callback tự động xử lý
3. **Verify trước:** Luôn verify order tồn tại trước khi fix

---

## 🔗 Tài liệu liên quan

- [ZaloPay Amount Mismatch Fix](./ZALOPAY_AMOUNT_MISMATCH_FIX.md)
- [ZaloPay Payment Success But Website Failed](./ZALOPAY_PAYMENT_SUCCESS_BUT_WEBSITE_FAILED.md)

