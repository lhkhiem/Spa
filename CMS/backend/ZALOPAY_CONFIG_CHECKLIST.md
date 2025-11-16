# Checklist Kiểm tra Cấu hình ZaloPay Sandbox

## ✅ Checklist Cấu hình

### 1. Kiểm tra File .env

Đảm bảo file `CMS/backend/.env` có các biến sau (dòng 14-38):

```bash
# ZaloPay Configuration
ZP_APP_ID=your_app_id                    # Ví dụ: 2553
ZP_KEY1=your_key1_hmac                   # Key1 từ ZaloPay Dashboard
ZP_CALLBACK_KEY=your_callback_key        # Key2 (Callback Key) từ ZaloPay Dashboard

# ZaloPay API Endpoints (Sandbox)
ZP_API_BASE=https://sb-openapi.zalopay.vn/v2
ZP_ORDER_CREATE_PATH=/create
ZP_ORDER_QUERY_PATH=/query

# ZaloPay Callback & Redirect URLs
ZP_CALLBACK_URL=https://your-domain.com/api/payments/zalopay/callback
ZP_REDIRECT_URL=https://your-domain.com/checkout/result
WEBSITE_ORIGIN=http://localhost:3000
```

### 2. Kiểm tra Giá trị

- [ ] `ZP_APP_ID`: Phải là số dương (ví dụ: `2553`)
- [ ] `ZP_KEY1`: Phải có giá trị (thường là chuỗi dài)
- [ ] `ZP_CALLBACK_KEY`: Phải có giá trị (thường là chuỗi dài)
- [ ] `ZP_CALLBACK_URL`: Phải là URL đầy đủ với HTTPS
- [ ] `ZP_API_BASE`: Phải là `https://sb-openapi.zalopay.vn/v2` (sandbox)

### 3. Lưu ý về Callback URL

**Nếu test local:**
- Dùng ngrok để expose local server:
  ```bash
  ngrok http 3011
  ```
- Copy HTTPS URL (ví dụ: `https://xxxx.ngrok.io`)
- Set `ZP_CALLBACK_URL=https://xxxx.ngrok.io/api/payments/zalopay/callback`

**Nếu đã deploy:**
- Set `ZP_CALLBACK_URL=https://your-domain.com/api/payments/zalopay/callback`
- Đảm bảo URL này accessible từ internet

### 4. Chạy Script Test

Sau khi cấu hình xong, chạy script test:

```bash
cd CMS/backend
node test-zalopay-config.js
```

Script sẽ:
- ✅ Kiểm tra tất cả biến môi trường
- ✅ Test kết nối đến ZaloPay API
- ✅ Tạo test order để verify cấu hình
- ✅ Hiển thị kết quả chi tiết

### 5. Kết quả Mong đợi

Nếu cấu hình đúng, bạn sẽ thấy:

```
✅ Tất cả các biến môi trường đã được cấu hình
✅ Kết nối thành công!
✅ order_url: ✅ Có
✅ zp_trans_token: ✅ Có
✅ Cấu hình ZaloPay sandbox đã đúng và có thể sử dụng
```

## 🔧 Troubleshooting

### Lỗi: "Missing environment variables"

**Nguyên nhân:** File `.env` không được load hoặc thiếu biến

**Giải pháp:**
1. Kiểm tra file `.env` có trong thư mục `CMS/backend/` không
2. Kiểm tra tên biến có đúng không (phân biệt hoa thường)
3. Đảm bảo không có khoảng trắng thừa
4. Restart backend server sau khi sửa `.env`

### Lỗi: "Invalid ZP_APP_ID"

**Nguyên nhân:** `ZP_APP_ID` không phải là số

**Giải pháp:**
- Đảm bảo `ZP_APP_ID` là số (ví dụ: `2553`, không phải `"2553"`)

### Lỗi: "ZaloPay API error"

**Nguyên nhân:** 
- APP_ID, KEY1 không đúng
- Callback URL không được cấu hình trong ZaloPay Dashboard

**Giải pháp:**
1. Kiểm tra lại APP_ID, KEY1 từ ZaloPay Dashboard
2. Đảm bảo Callback URL đã được cấu hình trong ZaloPay Dashboard
3. Kiểm tra tài khoản ZaloPay sandbox có active không

### Lỗi: "Network error" hoặc "Timeout"

**Nguyên nhân:** Không kết nối được đến ZaloPay API

**Giải pháp:**
1. Kiểm tra kết nối internet
2. Kiểm tra firewall có chặn không
3. Kiểm tra `ZP_API_BASE` có đúng không

## 📝 Lấy Thông tin từ ZaloPay Dashboard

1. Truy cập: https://developers.zalopay.vn/
2. Đăng nhập vào tài khoản
3. Vào **"Ứng dụng"** → Chọn app sandbox của bạn
4. Vào **"Thông tin ứng dụng"**:
   - **App ID**: Copy vào `ZP_APP_ID`
   - **Key1**: Copy vào `ZP_KEY1`
   - **Key2 (Callback Key)**: Copy vào `ZP_CALLBACK_KEY`
5. Vào **"Cấu hình"** → **"Callback URL"**:
   - Nhập Callback URL của bạn
   - Lưu lại

## 🚀 Sau khi Test Thành công

1. ✅ Cấu hình đã đúng
2. ✅ Có thể test thanh toán ZaloPay
3. ✅ Flow thanh toán sẽ hoạt động:
   - Tạo order → Gọi ZaloPay API → Redirect đến QR code → Thanh toán → Callback → Cập nhật order

## 📚 Tài liệu Tham khảo

- [Hướng dẫn Cấu hình ZaloPay](./docs/ZALOPAY_SETUP_GUIDE.md)
- [Tài liệu Tích hợp ZaloPay](./docs/ZALOPAY_INTEGRATION.md)




