# Xử lý Trường hợp Thanh toán Thành công nhưng Đơn hàng Không thành công

## Vấn đề

Trong một số trường hợp hiếm, thanh toán ZaloPay có thể thành công (tiền đã bị trừ) nhưng đơn hàng không được cập nhật thành công trong database. Điều này có thể xảy ra do:

1. **Database update thất bại** sau khi callback thành công
2. **Network timeout** giữa ZaloPay và server
3. **Database connection issues** tại thời điểm update
4. **Transaction rollback** do lỗi khác trong quá trình xử lý

## Giải pháp đã triển khai

### 1. Cải thiện Error Handling trong Callback

Callback handler (`/api/payments/zalopay/callback`) đã được cải thiện với:

- **Try-catch wrapper** cho database update
- **Chi tiết logging** khi update thất bại
- **Alert logging** để dễ dàng phát hiện vấn đề

```typescript
// Nếu payment thành công nhưng update thất bại, log critical error
if (updateError && isSuccess) {
  console.error('[ZaloPay Callback] CRITICAL: Payment succeeded but order update failed', {
    order_id: order.id,
    zp_trans_id,
    error: updateError.message,
    note: 'Manual intervention required!'
  });
}
```

### 2. Script Tự động Fix Stuck Orders

Script `fixStuckZaloPayOrders.ts` để tìm và sửa các đơn hàng bị stuck:

```bash
# Dry run (chỉ xem, không sửa)
npx ts-node CMS/backend/src/scripts/fixStuckZaloPayOrders.ts --dry-run

# Thực sự fix
npx ts-node CMS/backend/src/scripts/fixStuckZaloPayOrders.ts

# Tự động refund nếu không thể fix
npx ts-node CMS/backend/src/scripts/fixStuckZaloPayOrders.ts --refund
```

Script sẽ:
- Tìm các orders có `zp_trans_id` nhưng `payment_status != 'paid'`
- Query ZaloPay để xác nhận payment status
- Update order nếu payment thực sự thành công
- Đề xuất refund nếu không thể fix

### 3. Refund Mechanism

#### API Endpoint: `POST /api/payments/zalopay/refund`

Hoàn tiền cho đơn hàng đã thanh toán:

```json
{
  "orderId": "uuid-or-order-number",
  "amount": 100000,  // Optional, mặc định là full amount
  "description": "Hoàn tiền đơn hàng ORD-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "m_refund_id": "REFUND_1234567890_abc123",
    "refund_amount": 100000,
    "order_id": "uuid",
    "order_number": "ORD-123"
  }
}
```

#### Query Refund Status: `GET /api/payments/zalopay/refund/query/:mRefundId`

Kiểm tra trạng thái refund:

```bash
GET /api/payments/zalopay/refund/query/REFUND_1234567890_abc123
```

### 4. Monitoring và Alerting

#### Log Patterns để Monitor

Tìm trong logs các pattern sau:

```bash
# Tìm critical errors
pm2 logs cms-backend | grep "CRITICAL.*Payment succeeded but order update failed"

# Tìm stuck orders
pm2 logs cms-backend | grep "ZaloPay Callback.*rows_affected: 0"

# Tìm orders với zp_trans_id nhưng chưa paid
pm2 logs cms-backend | grep "zp_trans_id.*payment_status.*pending"
```

#### Scheduled Check (Cron Job)

Có thể setup cron job để chạy script fix tự động:

```bash
# Chạy mỗi giờ
0 * * * * cd /var/www/Spa/CMS/backend && npx ts-node src/scripts/fixStuckZaloPayOrders.ts >> /var/log/zalopay-fix.log 2>&1
```

## Quy trình Xử lý khi Phát hiện Vấn đề

### Bước 1: Xác định Vấn đề

```bash
# Tìm orders bị stuck
cd /var/www/Spa/CMS/backend
npx ts-node src/scripts/fixStuckZaloPayOrders.ts --dry-run
```

### Bước 2: Tự động Fix (nếu có thể)

```bash
# Fix tự động
npx ts-node src/scripts/fixStuckZaloPayOrders.ts
```

### Bước 3: Manual Fix (nếu tự động không được)

Sử dụng script `fixZaloPayOrder.ts`:

```bash
npx ts-node src/scripts/fixZaloPayOrder.ts <order_id_or_number>
```

### Bước 4: Refund (nếu không thể fix)

Nếu order không thể được fix (ví dụ: order đã bị xóa, database corruption, etc.), refund cho khách hàng:

```bash
# Via API
curl -X POST https://api.banyco.vn/api/payments/zalopay/refund \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-123",
    "description": "Hoàn tiền do lỗi hệ thống"
  }'
```

Hoặc sử dụng script refund (cần implement):

```bash
npx ts-node src/scripts/refundZaloPayOrder.ts <order_id_or_number>
```

## Best Practices

1. **Monitor logs thường xuyên** để phát hiện sớm
2. **Chạy fix script định kỳ** (cron job)
3. **Document mọi refund** để audit
4. **Thông báo khách hàng** khi refund
5. **Kiểm tra lại sau refund** để đảm bảo tiền đã được hoàn

## Database Schema

Orders table có các fields liên quan:

- `zp_app_trans_id`: ZaloPay app transaction ID (từ create order)
- `zp_trans_id`: ZaloPay transaction ID (từ callback, xác nhận payment thành công)
- `payment_status`: 'pending' | 'paid' | 'failed' | 'refunded'
- `payment_transaction_id`: Transaction ID để tracking

## Troubleshooting

### Order có zp_trans_id nhưng payment_status = 'pending'

**Nguyên nhân:** Callback thành công nhưng database update thất bại

**Giải pháp:**
```bash
npx ts-node src/scripts/fixZaloPayOrder.ts <order_id>
```

### Order không có zp_trans_id nhưng khách hàng báo đã thanh toán

**Nguyên nhân:** Callback bị miss hoặc không được gửi

**Giải pháp:**
1. Query ZaloPay để check status: `GET /api/payments/zalopay/query/:appTransId`
2. Nếu payment thành công, fix order: `npx ts-node src/scripts/fixZaloPayOrder.ts <order_id>`

### Không thể fix order (order đã bị xóa, etc.)

**Giải pháp:** Refund cho khách hàng

```bash
curl -X POST https://api.banyco.vn/api/payments/zalopay/refund \
  -H "Content-Type: application/json" \
  -d '{"orderId": "ORD-123"}'
```

## Liên hệ

Nếu gặp vấn đề không thể giải quyết, liên hệ:
- Backend team để check logs chi tiết
- ZaloPay support nếu có vấn đề với refund API

