# Test ZaloPay mà không cần liên kết ngân hàng

## 🔍 Vấn đề

ZaloPay Sandbox vẫn yêu cầu **liên kết tài khoản ngân hàng** để có thể quét QR và thanh toán test. Đây là yêu cầu bắt buộc của ZaloPay để mô phỏng giao dịch thực tế.

## ✅ Giải pháp: Test Callback trực tiếp

Thay vì quét QR code và thanh toán, bạn có thể **test callback trực tiếp** để kiểm tra:
- ✅ Callback handler hoạt động đúng
- ✅ Order status được update
- ✅ Email confirmation được gửi
- ✅ Database được cập nhật

---

## 🧪 Cách 1: Test Callback bằng cURL

### Bước 1: Tạo đơn hàng với ZaloPay

1. Vào website → Checkout
2. Chọn ZaloPay
3. Nhấn "Thanh toán ZaloPay"
4. Copy `app_trans_id` từ response hoặc logs

### Bước 2: Simulate Callback

```bash
# Lấy app_trans_id từ order vừa tạo
APP_TRANS_ID="251129_ORDMIIF9UEUMKZVN"  # Thay bằng app_trans_id thực tế

# Tạo callback data (giả lập từ ZaloPay)
curl -X POST https://api.banyco.vn/api/payments/zalopay/callback \
  -H "Content-Type: application/json" \
  -d '{
    "data": "{\"app_id\":2554,\"app_trans_id\":\"'$APP_TRANS_ID'\",\"app_user\":\"0886939879\",\"amount\":1000,\"app_time\":1764307736928,\"embed_data\":\"{}\",\"item\":\"[]\",\"zp_trans_id\":123456789,\"server_time\":1764307800000,\"channel\":38,\"return_code\":1}",
    "mac": "test_mac_here"
  }'
```

**Lưu ý:** MAC cần được tính đúng. Xem script bên dưới để tạo MAC hợp lệ.

---

## 🧪 Cách 2: Dùng Script Test (Khuyến nghị)

Tạo script để test callback với MAC đúng:

### File: `CMS/backend/src/scripts/testZaloPayCallback.ts`

```typescript
import axios from 'axios';
import { hmacSHA256Hex } from '../utils/hmac';

async function testZaloPayCallback() {
  const app_trans_id = process.argv[2]; // Lấy từ command line
  const orderId = process.argv[3]; // Order ID trong database

  if (!app_trans_id || !orderId) {
    console.error('Usage: ts-node testZaloPayCallback.ts <app_trans_id> <order_id>');
    process.exit(1);
  }

  const callbackKey = process.env.ZP_CALLBACK_KEY;
  if (!callbackKey) {
    console.error('ZP_CALLBACK_KEY not found in .env');
    process.exit(1);
  }

  // Tạo callback data (giả lập từ ZaloPay)
  const callbackData = {
    app_id: Number(process.env.ZP_APP_ID) || 2554,
    app_trans_id: app_trans_id,
    app_user: '0886939879', // Test user
    amount: 1000, // Test amount
    app_time: Date.now(),
    embed_data: '{}',
    item: '[]',
    zp_trans_id: Math.floor(Math.random() * 1000000000), // Random transaction ID
    server_time: Date.now(),
    channel: 38, // ZaloPay channel
    return_code: 1, // Success
  };

  // Tạo MAC
  const dataString = JSON.stringify(callbackData);
  const mac = hmacSHA256Hex(callbackKey, dataString);

  // Gửi callback
  const callbackUrl = process.env.ZP_CALLBACK_URL || 'http://localhost:3011/api/payments/zalopay/callback';
  
  try {
    const response = await axios.post(callbackUrl, {
      data: dataString,
      mac: mac,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('✅ Callback sent successfully');
    console.log('Response:', response.data);
  } catch (error: any) {
    console.error('❌ Callback failed:', error.response?.data || error.message);
  }
}

testZaloPayCallback();
```

### Cách chạy:

```bash
cd CMS/backend
ts-node src/scripts/testZaloPayCallback.ts "251129_ORDMIIF9UEUMKZVN" "order-uuid-here"
```

---

## 🧪 Cách 3: Test bằng Query Order Status

Nếu không muốn test callback, có thể test bằng cách query order status:

```bash
# Query order status từ ZaloPay
curl "https://api.banyco.vn/api/payments/zalopay/query/251129_ORDMIIF9UEUMKZVN"
```

Endpoint này sẽ:
- Query order status từ ZaloPay
- Update order trong database nếu status thay đổi
- Gửi email confirmation nếu cần

---

## 🧪 Cách 4: Test với ZaloPay Web Sandbox (Nếu có)

Một số trường hợp ZaloPay cung cấp Web Sandbox để test mà không cần app:

1. Đăng nhập ZaloPay Developer Portal
2. Vào phần "Sandbox Testing" hoặc "Test Payment"
3. Nhập thông tin giao dịch để test

---

## 📝 Checklist Test không cần quét QR

- [ ] Tạo đơn hàng với ZaloPay thành công
- [ ] Lấy được `app_trans_id` từ order
- [ ] Test callback bằng script (Cách 2)
- [ ] Kiểm tra order status được update
- [ ] Kiểm tra email confirmation được gửi
- [ ] Kiểm tra database có `zp_trans_id` không
- [ ] Test query order status endpoint

---

## ⚠️ Lưu ý

1. **MAC phải đúng:** Callback sẽ bị reject nếu MAC không khớp
2. **Amount phải khớp:** Amount trong callback phải khớp với order.total
3. **app_trans_id phải tồn tại:** Order phải có `zp_app_trans_id` trong database
4. **Test trên môi trường thật:** Nếu test local, cần dùng ngrok để expose callback URL

---

## 🔄 So sánh các cách test

| Cách | Ưu điểm | Nhược điểm |
|------|---------|------------|
| **Quét QR** | Test flow đầy đủ | Cần liên kết ngân hàng |
| **Test Callback** | Không cần ngân hàng, test nhanh | Không test flow quét QR |
| **Query Status** | Đơn giản, không cần setup | Phụ thuộc vào ZaloPay API |
| **Web Sandbox** | Test đầy đủ flow | Có thể không có sẵn |

---

## 🎯 Kết luận

**Để test ZaloPay mà không cần liên kết ngân hàng:**

1. ✅ Dùng **Cách 2 (Script Test)** để test callback trực tiếp
2. ✅ Dùng **Cách 3 (Query Status)** để test query endpoint
3. ✅ Kiểm tra logs và database để verify

**Sau khi code hoạt động đúng, mới cần:**
- Liên kết ngân hàng trong app Sandbox
- Test flow đầy đủ với quét QR
- Chuyển sang Production

