# ZaloPay: Thanh toán thành công nhưng Website báo thất bại

## 🔍 Vấn đề

Giao dịch ZaloPay thành công trên app ZaloPay (có mã giao dịch, trạng thái "Thành công"), nhưng website lại báo "Thanh toán thất bại".

## ✅ Nguyên nhân

Có 2 nguyên nhân chính:

### 1. Callback không được nhận hoặc xử lý sai

**Triệu chứng:**
- Giao dịch thành công trên ZaloPay
- Website báo thất bại
- Logs không thấy callback được nhận

**Nguyên nhân:**
- Callback URL không accessible từ ZaloPay servers
- Callback bị reject do MAC không đúng
- Callback được nhận nhưng xử lý sai

### 2. Query Order Status trả về lỗi

**Triệu chứng:**
- Response từ query endpoint: `"Chữ ký không hợp lệ" (-402)`
- Order không tìm thấy trong database

**Nguyên nhân:**
- MAC signature không đúng khi query
- app_trans_id không khớp với database
- Key1 không đúng

---

## 🔧 Giải pháp

### Bước 1: Kiểm tra Callback

```bash
# Xem logs callback
pm2 logs cms-backend | grep "ZaloPay Callback"

# Kiểm tra callback URL có accessible không
curl -X POST https://api.banyco.vn/api/payments/zalopay/callback \
  -H "Content-Type: application/json" \
  -d '{"data":"test","mac":"test"}'
```

**Nếu callback không được nhận:**
- Kiểm tra Callback URL trong ZaloPay Dashboard
- Đảm bảo URL là HTTPS và accessible
- Kiểm tra firewall/security groups

### Bước 2: Kiểm tra Query Endpoint

```bash
# Query order status
curl "https://api.banyco.vn/api/payments/zalopay/query/251129_ORDMIIGF5X81LSBY"
```

**Nếu trả về "Chữ ký không hợp lệ":**
- Kiểm tra Key1 có đúng không
- Kiểm tra MAC calculation có đúng format không
- Xem logs để debug MAC input

### Bước 3: Kiểm tra Database

```sql
-- Tìm order với app_trans_id
SELECT id, order_number, zp_app_trans_id, payment_status, status 
FROM orders 
WHERE zp_app_trans_id LIKE '251129%' 
ORDER BY created_at DESC;
```

**Nếu order không tìm thấy:**
- Order có thể chưa được lưu với `zp_app_trans_id`
- app_trans_id có thể khác với database

### Bước 4: Test Callback thủ công

Nếu callback không được nhận, có thể test callback thủ công:

```bash
cd CMS/backend
npx ts-node src/scripts/testZaloPayCallback.ts "251129_ORDMIIGF5X81LSBY"
```

---

## 🐛 Debug Steps

### 1. Kiểm tra Logs

```bash
# Xem tất cả logs liên quan đến ZaloPay
pm2 logs cms-backend | grep -i zalopay

# Xem logs callback
pm2 logs cms-backend | grep "ZaloPay Callback"

# Xem logs query
pm2 logs cms-backend | grep "Query order"
```

### 2. Kiểm tra Callback URL

- Vào ZaloPay Dashboard → Ứng dụng → Cấu hình
- Kiểm tra Callback URL: `https://api.banyco.vn/api/payments/zalopay/callback`
- Đảm bảo URL là HTTPS và accessible

### 3. Kiểm tra MAC Verification

Callback handler verify MAC bằng `ZP_CALLBACK_KEY` (Key2):
- Đảm bảo `ZP_CALLBACK_KEY` đúng với Key2 từ ZaloPay Dashboard
- Kiểm tra MAC calculation trong callback handler

### 4. Kiểm tra Query MAC

Query endpoint tính MAC bằng `ZP_KEY1`:
- Format: `app_id|app_trans_id|time` (tất cả là string)
- Đảm bảo `ZP_KEY1` đúng với Key1 từ ZaloPay Dashboard

---

## ✅ Checklist

- [ ] Callback URL đúng trong ZaloPay Dashboard
- [ ] Callback URL accessible từ bên ngoài (HTTPS)
- [ ] `ZP_CALLBACK_KEY` đúng với Key2
- [ ] `ZP_KEY1` đúng với Key1
- [ ] Order có `zp_app_trans_id` trong database
- [ ] Callback được nhận (kiểm tra logs)
- [ ] Query endpoint hoạt động (không báo "Chữ ký không hợp lệ")
- [ ] Order status được update sau callback

---

## 🚀 Giải pháp tạm thời

Nếu callback không hoạt động, có thể:

1. **Query order status thủ công:**
   ```bash
   curl "https://api.banyco.vn/api/payments/zalopay/query/251129_ORDMIIGF5X81LSBY"
   ```

2. **Update order thủ công trong database:**
   ```sql
   UPDATE orders 
   SET payment_status = 'paid', 
       status = 'processing',
       zp_trans_id = '251128000005440'
   WHERE zp_app_trans_id = '251129_ORDMIIGF5X81LSBY';
   ```

3. **Test callback thủ công:**
   ```bash
   npx ts-node src/scripts/testZaloPayCallback.ts "251129_ORDMIIGF5X81LSBY"
   ```

---

## 📝 Lưu ý

1. **Callback là bắt buộc:** ZaloPay sẽ gửi callback sau khi thanh toán thành công
2. **Query là backup:** Query endpoint chỉ dùng để kiểm tra nếu callback bị miss
3. **MAC phải đúng:** Cả callback và query đều cần MAC đúng
4. **HTTPS required:** Callback URL phải là HTTPS

---

## 🔗 Tài liệu liên quan

- [ZaloPay Callback Setup](./ZALOPAY_CALLBACK_SETUP.md)
- [ZaloPay Debug Guide](./ZALOPAY_DEBUG.md)
- [ZaloPay Test Without Bank](./ZALOPAY_TEST_WITHOUT_BANK.md)

