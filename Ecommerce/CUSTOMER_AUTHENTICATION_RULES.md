# 🔐 Customer Authentication Rules

## ✅ Đã hoàn thành

### 1. **Trang Đăng Ký (Register)**
- ✅ **URL:** `/register`
- ✅ **Trạng thái:** Hoàn thành và tích hợp API
- ✅ **Chức năng:**
  - Cho phép khách hàng đăng ký tài khoản mới
  - Form validation (email, password, firstName, lastName, phone)
  - Xác nhận mật khẩu
  - Đồng ý với Terms & Privacy
  - Tự động đăng nhập sau khi đăng ký thành công
  - Redirect về `/account` sau khi đăng ký

### 2. **Trang Đăng Nhập (Login)**
- ✅ **URL:** `/login`
- ✅ **Trạng thái:** Hoàn thành và tích hợp API
- ✅ **Chức năng:**
  - Cho phép khách hàng đăng nhập với email và password
  - Form validation
  - Link đến "Quên mật khẩu"
  - Link đến "Đăng ký" nếu chưa có tài khoản
  - Redirect về trang được yêu cầu sau khi login (nếu có `redirect` parameter)
  - Tự động redirect về `/account` nếu đã đăng nhập

### 3. **Trang Quên Mật Khẩu (Forgot Password)**
- ✅ **URL:** `/forgot-password`
- ✅ **Trạng thái:** Hoàn thành và tích hợp API
- ✅ **Chức năng:**
  - Gửi email reset password
  - Hiển thị thông báo thành công
  - Link quay lại login

### 4. **Bảo Vệ Trang Account**
- ✅ **Account Layout Protection:**
  - Kiểm tra authentication khi truy cập các trang account
  - Redirect về `/login?redirect=<pathname>` nếu chưa đăng nhập
  - Hiển thị loading state khi kiểm tra authentication
  - Toast notification khi cần đăng nhập

### 5. **Header Navigation**
- ✅ **Account/Login Link:**
  - Hiển thị link `/account` nếu đã đăng nhập
  - Hiển thị link `/login` nếu chưa đăng nhập
  - Tooltip hiển thị "Tài khoản" hoặc "Đăng nhập"

### 6. **Authentication Flow**
- ✅ **Login Flow:**
  1. User nhập email và password
  2. Gọi API `/api/public/auth/login`
  3. Nhận accessToken và refreshToken
  4. Lưu tokens vào localStorage và authStore
  5. Redirect về trang được yêu cầu hoặc `/account`

- ✅ **Register Flow:**
  1. User nhập thông tin (firstName, lastName, email, password, phone)
  2. Xác nhận mật khẩu
  3. Đồng ý với Terms & Privacy
  4. Gọi API `/api/public/auth/register`
  5. Tự động đăng nhập sau khi đăng ký thành công
  6. Redirect về `/account`

- ✅ **Logout Flow:**
  1. Gọi API `/api/public/auth/logout`
  2. Xóa tokens từ localStorage
  3. Clear authStore
  4. Redirect về trang chủ

### 7. **Auto Token Refresh**
- ✅ **API Client Interceptor:**
  - Tự động refresh token khi nhận 401 error
  - Retry request với token mới
  - Redirect về login nếu refresh token fail

## 📋 Quy Tắc Customer

### ✅ Rule 1: Khi chưa có tài khoản cho phép đăng ký
- **Trạng thái:** ✅ Đã hoàn thành
- **Implementation:**
  - Trang `/register` có thể truy cập mà không cần authentication
  - Form đăng ký đầy đủ với validation
  - API endpoint: `POST /api/public/auth/register`
  - Tự động đăng nhập sau khi đăng ký thành công

### ✅ Rule 2: Có trang để khách hàng login đăng nhập
- **Trạng thái:** ✅ Đã hoàn thành
- **Implementation:**
  - Trang `/login` có thể truy cập mà không cần authentication
  - Form đăng nhập với email và password
  - API endpoint: `POST /api/public/auth/login`
  - Link đến "Quên mật khẩu" và "Đăng ký"
  - Redirect về trang được yêu cầu sau khi login

### ✅ Rule 3: Bảo vệ các trang Account
- **Trạng thái:** ✅ Đã hoàn thành
- **Implementation:**
  - Account Layout kiểm tra authentication
  - Redirect về login nếu chưa đăng nhập
  - Lưu `redirect` parameter để quay lại trang được yêu cầu
  - Toast notification khi cần đăng nhập

### ✅ Rule 4: Header Navigation
- **Trạng thái:** ✅ Đã hoàn thành
- **Implementation:**
  - Hiển thị link `/account` nếu đã đăng nhập
  - Hiển thị link `/login` nếu chưa đăng nhập
  - Cập nhật real-time khi authentication status thay đổi

## 🔄 Authentication Flow Diagram

```
1. User chưa đăng nhập
   ↓
2. Truy cập /account
   ↓
3. Account Layout kiểm tra authentication
   ↓
4. Redirect về /login?redirect=/account
   ↓
5. User đăng nhập
   ↓
6. Login thành công
   ↓
7. Lưu tokens
   ↓
8. Redirect về /account (hoặc trang được yêu cầu)
```

## 📝 API Endpoints

### Authentication
- `POST /api/public/auth/register` - Đăng ký tài khoản mới
- `POST /api/public/auth/login` - Đăng nhập
- `POST /api/public/auth/logout` - Đăng xuất
- `POST /api/public/auth/refresh` - Refresh token
- `POST /api/public/auth/forgot-password` - Quên mật khẩu
- `POST /api/public/auth/reset-password` - Reset mật khẩu
- `GET /api/public/auth/me` - Lấy thông tin user hiện tại

### User Profile (Cần Authentication)
- `GET /api/public/user/profile` - Lấy thông tin profile
- `PUT /api/public/user/profile` - Cập nhật profile
- `GET /api/public/user/addresses` - Lấy danh sách địa chỉ
- `POST /api/public/user/addresses` - Thêm địa chỉ mới
- `PUT /api/public/user/addresses/:id` - Cập nhật địa chỉ
- `DELETE /api/public/user/addresses/:id` - Xóa địa chỉ

### Orders (Cần Authentication)
- `GET /api/public/orders` - Lấy danh sách đơn hàng
- `GET /api/public/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/public/orders` - Tạo đơn hàng mới
- `POST /api/public/orders/:id/cancel` - Hủy đơn hàng

## 🎯 Test Cases

### Test Case 1: Đăng Ký Tài Khoản Mới
1. Truy cập `/register`
2. Điền form đăng ký
3. Submit form
4. ✅ Kiểm tra: Tự động đăng nhập và redirect về `/account`

### Test Case 2: Đăng Nhập
1. Truy cập `/login`
2. Điền email và password
3. Submit form
4. ✅ Kiểm tra: Đăng nhập thành công và redirect về `/account`

### Test Case 3: Truy Cập Account Khi Chưa Đăng Nhập
1. Xóa tokens từ localStorage
2. Truy cập `/account`
3. ✅ Kiểm tra: Redirect về `/login?redirect=/account`

### Test Case 4: Đăng Nhập Sau Khi Redirect
1. Truy cập `/account` khi chưa đăng nhập
2. Redirect về `/login?redirect=/account`
3. Đăng nhập thành công
4. ✅ Kiểm tra: Redirect về `/account` (trang được yêu cầu)

### Test Case 5: Header Navigation
1. Chưa đăng nhập: ✅ Kiểm tra: Header hiển thị link `/login`
2. Đăng nhập thành công: ✅ Kiểm tra: Header hiển thị link `/account`

## 🔒 Security Features

1. **Token Storage:**
   - Access token và refresh token lưu trong localStorage
   - Tokens được tự động thêm vào request headers

2. **Auto Token Refresh:**
   - Tự động refresh token khi nhận 401 error
   - Retry request với token mới
   - Redirect về login nếu refresh token fail

3. **Protected Routes:**
   - Tất cả các trang account được bảo vệ
   - Redirect về login nếu chưa đăng nhập
   - Lưu redirect parameter để quay lại trang được yêu cầu

4. **Form Validation:**
   - Email validation
   - Password validation (minimum 6 characters)
   - Required fields validation
   - Password confirmation validation

## 📊 Status Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Register Page | ✅ Complete | Tích hợp API, tự động đăng nhập |
| Login Page | ✅ Complete | Tích hợp API, redirect support |
| Forgot Password | ✅ Complete | Tích hợp API |
| Account Protection | ✅ Complete | Auto redirect về login |
| Header Navigation | ✅ Complete | Dynamic login/account link |
| Token Refresh | ✅ Complete | Auto refresh khi 401 |
| Form Validation | ✅ Complete | Client-side validation |

## 🎉 Kết Luận

Tất cả các quy tắc Customer đã được hoàn thành:

1. ✅ **Khi chưa có tài khoản cho phép đăng ký** - Trang `/register` hoàn chỉnh với API integration
2. ✅ **Có trang để khách hàng login đăng nhập** - Trang `/login` hoàn chỉnh với API integration
3. ✅ **Bảo vệ các trang Account** - Auto redirect về login nếu chưa đăng nhập
4. ✅ **Header Navigation** - Dynamic login/account link dựa trên authentication status

Tất cả các trang authentication và account đã được tích hợp đầy đủ với backend API và sẵn sàng sử dụng.

