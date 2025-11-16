# ZaloPay Payment Gateway Integration Guide

Tài liệu tích hợp ZaloPay Payment Gateway vào hệ thống.

## 📋 Tổng quan

Tích hợp ZaloPay cho phép khách hàng thanh toán trực tuyến qua ứng dụng ZaloPay bằng cách quét mã QR.

**⚠️ Lưu ý quan trọng:**
- **QR Code được ZaloPay tự động tạo** trong `order_url` - không cần tạo QR code riêng
- **Tài khoản nhận tiền** được cấu hình trong ZaloPay Merchant Dashboard, không phải trong code
- Xem thêm: [Hướng dẫn Cấu hình Tài khoản ZaloPay](./ZALOPAY_SETUP_GUIDE.md)

### Flow thanh toán:

1. **Khách hàng chọn ZaloPay** trên trang checkout
2. **Tạo đơn hàng** → Backend tạo order với `payment_method = 'zalopay'`
3. **Tạo payment order** → Backend gọi ZaloPay API để tạo payment order
4. **Redirect đến ZaloPay** → Frontend redirect khách hàng đến `order_url` từ ZaloPay
5. **Khách hàng thanh toán** → Hoàn tất thanh toán trên ZaloPay
6. **Callback (IPN)** → ZaloPay gọi callback URL với kết quả thanh toán
7. **Query order** → Frontend query order status sau khi khách hàng quay lại
8. **Hiển thị kết quả** → Frontend hiển thị trang result với trạng thái thanh toán

---

## 🔧 Cấu hình Backend

### 1. Environment Variables

Thêm vào `CMS/backend/.env`:

```bash
# ZaloPay Configuration
ZP_APP_ID=your_app_id
ZP_KEY1=your_key1_hmac                  # HMAC key for create/query/refund
ZP_CALLBACK_KEY=your_callback_key       # Key2 for IPN verification

# ZaloPay API Endpoints (Sandbox)
ZP_API_BASE=https://sb-openapi.zalopay.vn/v2
ZP_ORDER_CREATE_PATH=/create
ZP_ORDER_QUERY_PATH=/query
ZP_REFUND_PATH=/refund
ZP_REFUND_QUERY_PATH=/refund/query

# ZaloPay Callback & Redirect URLs
ZP_CALLBACK_URL=https://your-domain.com/api/payments/zalopay/callback
ZP_REDIRECT_URL=https://your-domain.com/checkout/result
WEBSITE_ORIGIN=http://localhost:3000    # Frontend URL
```

**Lưu ý:**
- **Sandbox**: Sử dụng `https://sb-openapi.zalopay.vn/v2`
- **Production**: Sử dụng `https://openapi.zalopay.vn/v2`
- `ZP_CALLBACK_URL` phải là HTTPS và accessible từ ZaloPay servers
- `ZP_REDIRECT_URL` là URL khách hàng sẽ được redirect sau khi thanh toán

### 2. Database Migration

Chạy migration để thêm ZaloPay fields vào `orders` table:

```bash
cd CMS/backend
node run-migration-036.js
```

Migration sẽ thêm các columns:
- `zp_app_trans_id` - ZaloPay transaction ID (format: `yymmdd_orderId`)
- `zp_trans_token` - ZaloPay transaction token
- `zp_order_url` - URL để redirect khách hàng
- `zp_trans_id` - ZaloPay transaction ID từ callback

### 3. API Endpoints

#### POST `/api/payments/zalopay/create`

Tạo ZaloPay payment order.

**Request:**
```json
{
  "orderId": "uuid-of-order",
  "amount": 100000,  // VND (optional, will use order total if not provided)
  "description": "Đơn hàng ORD-123456",
  "appUser": "0886939879",  // Phone or email
  "items": [
    {
      "itemid": "product-id",
      "itemname": "Product Name",
      "itemquantity": 1,
      "itemprice": 100000
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "app_trans_id": "241115_ORDER-123",
    "order_url": "https://zalopay.vn/pay/...",
    "zp_trans_token": "...",
    "return_code": 1,
    "return_message": "Success",
    "order_id": "uuid",
    "order_number": "ORD-123456"
  }
}
```

#### POST `/api/payments/zalopay/callback`

ZaloPay IPN callback endpoint (được ZaloPay gọi tự động).

**Request from ZaloPay:**
```json
{
  "data": "{\"app_trans_id\":\"241115_ORDER-123\",\"amount\":100000,...}",
  "mac": "hmac_signature",
  "type": 1
}
```

**Response:**
```json
{
  "return_code": 1,
  "return_message": "Success"
}
```

#### GET `/api/payments/zalopay/query/:appTransId`

Query ZaloPay order status (dùng để retry/backfill nếu callback bị miss).

**Response:**
```json
{
  "success": true,
  "data": {
    "return_code": 1,
    "return_message": "Success",
    "zp_trans_id": 123456789,
    "amount": 100000
  }
}
```

---

## 🎨 Frontend Integration

### 1. Checkout Page

Trang checkout (`Ecommerce/app/(shop)/checkout/page.tsx`) đã được tích hợp:

- Khi khách hàng chọn **ZaloPay**, sau khi tạo order:
  1. Gọi `createZaloPayOrder()` để tạo payment order
  2. Redirect khách hàng đến `order_url` từ ZaloPay
  3. Lưu `app_trans_id` vào `sessionStorage` để query sau

### 2. Result Page

Trang result (`Ecommerce/app/(shop)/checkout/result/page.tsx`):

- Tự động query order status sau khi khách hàng quay lại
- Polling mỗi 3 giây nếu chưa có kết quả
- Hiển thị trạng thái: **Success**, **Failed**, hoặc **Pending**
- Timeout sau 60 giây nếu vẫn chưa có kết quả

### 3. API Client

File `Ecommerce/lib/api/payments.ts` cung cấp:

- `createZaloPayOrder()` - Tạo payment order
- `queryZaloPayOrder()` - Query order status

---

## 🔐 Security

### HMAC Calculation

**Create Order MAC:**
```
mac = HMAC_SHA256(KEY1, app_id|app_trans_id|app_user|amount|app_time|embed_data|item)
```

**Callback (IPN) MAC:**
```
mac = HMAC_SHA256(CALLBACK_KEY, data)
```

### App Trans ID Format

ZaloPay yêu cầu `app_trans_id` phải có prefix `yymmdd` theo **Vietnam timezone (GMT+7)**:

```
app_trans_id = yymmdd_orderId
```

Ví dụ: `241115_ORDER-123456`

---

## 🧪 Testing

### Sandbox Testing

1. Đăng ký ZaloPay sandbox account (xem [Hướng dẫn Cấu hình](./ZALOPAY_SETUP_GUIDE.md))
2. Lấy `APP_ID`, `KEY1`, `CALLBACK_KEY` từ ZaloPay dashboard
3. Cấu hình `.env` với sandbox endpoints
4. Test flow thanh toán với sandbox account

### QR Code

**QR Code được ZaloPay tự động tạo:**
- Khi gọi API `/create`, ZaloPay trả về `order_url`
- `order_url` chứa trang thanh toán với QR code
- Khách hàng redirect đến `order_url` → ZaloPay hiển thị QR code
- Khách hàng quét QR code bằng app ZaloPay để thanh toán
- **Không cần tạo QR code riêng trong code**

### Callback Testing

Sử dụng ngrok để expose local callback URL:

```bash
ngrok http 3011
# Copy HTTPS URL: https://xxxx.ngrok.io
# Set ZP_CALLBACK_URL=https://xxxx.ngrok.io/api/payments/zalopay/callback
```

---

## 📝 Important Notes

1. **Amount**: ZaloPay yêu cầu amount là số nguyên VND (không có decimal)
2. **Timezone**: `app_trans_id` prefix phải dùng Vietnam timezone (GMT+7)
3. **Callback URL**: Phải là HTTPS và accessible từ ZaloPay servers
4. **MAC Verification**: Luôn verify MAC từ callback để đảm bảo security
5. **Retry Logic**: Implement query order nếu callback bị miss
6. **Idempotency**: Sử dụng `app_trans_id` để retry create order safely

---

## 🐛 Troubleshooting

### Callback không nhận được

1. Kiểm tra callback URL có đúng không
2. Verify callback URL có accessible từ internet (dùng ngrok nếu local)
3. Check logs để xem có lỗi MAC verification không
4. Dùng query endpoint để backfill order status

### Order status không update

1. Check callback endpoint có trả về `return_code: 1` không
2. Verify MAC verification có đúng không
3. Check database để xem order có được update không
4. Query order status manually để verify

### Amount mismatch

- Đảm bảo amount là số nguyên VND
- Check conversion từ order total (nếu order.total là thousands, cần nhân 1000)

---

## 📚 References

- [ZaloPay Create Order](https://docs.zalopay.vn/docs/specs/order-create)
- [ZaloPay Callback API](https://docs.zalopay.vn/docs/specs/callback-api/)
- [ZaloPay Query Order](https://docs.zalopay.vn/docs/specs/order-query/)
- [Secure Data Transmission](https://docs.zalopay.vn/docs/developer-tools/security/secure-data-transmission/)


