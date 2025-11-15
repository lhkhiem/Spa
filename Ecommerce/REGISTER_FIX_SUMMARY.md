# 🔧 Register Page Fix Summary

## 🐛 Vấn Đề Đã Phát Hiện

### 1. **Conflict Tên Function**
- ❌ **Vấn đề:** `register` từ `useForm()` conflict với `register` từ `@/lib/api/auth`
- ✅ **Giải pháp:** Rename import thành `registerUser` từ `@/lib/api/auth`

### 2. **Duplicate `/api` Prefix**
- ❌ **Vấn đề:** 
  - Base URL: `http://localhost:3011/api` (đã có `/api`)
  - Endpoints: `/api/public/auth/register` (có prefix `/api`)
  - Full URL: `http://localhost:3011/api/api/public/auth/register` ❌ (duplicate)
- ✅ **Giải pháp:** Loại bỏ prefix `/api` từ endpoints vì baseURL đã có `/api`
  - Endpoints: `/public/auth/register`
  - Full URL: `http://localhost:3011/api/public/auth/register` ✅

## ✅ Đã Sửa

### 1. **Register Page** (`app/(main)/register/page.tsx`)
- ✅ Rename import: `register as registerUser` từ `@/lib/api/auth`
- ✅ Cải thiện error handling với detailed logging
- ✅ Hiển thị error messages rõ ràng hơn
- ✅ Handle network errors và server errors riêng biệt

### 2. **API Endpoints** (`lib/api/endpoints.ts`)
- ✅ Loại bỏ prefix `/api` từ tất cả customer endpoints:
  - Auth: `/public/auth/*` (thay vì `/api/public/auth/*`)
  - Cart: `/public/cart/*` (thay vì `/api/public/cart/*`)
  - Orders: `/public/orders/*` (thay vì `/api/public/orders/*`)
  - User: `/public/user/*` (thay vì `/api/public/user/*`)

### 3. **API Client** (`lib/api/client.ts`)
- ✅ Sửa refresh token endpoint: `/public/auth/refresh` (thay vì `/api/public/auth/refresh`)

### 4. **Auth API** (`lib/api/auth.ts`)
- ✅ Thêm detailed logging cho register và login functions
- ✅ Log API endpoint, baseURL, và full URL để debug
- ✅ Log request data và response data
- ✅ Improved error handling

## 📋 API URL Structure

### Base URL
- **Default:** `http://localhost:3011/api`
- **From ENV:** `NEXT_PUBLIC_API_URL` (nếu có)
- **Config:** `config/site.ts` → `getApiUrl()`

### Endpoints (không có prefix `/api`)
- **Auth:** `/public/auth/login`, `/public/auth/register`, etc.
- **Cart:** `/public/cart`, `/public/cart/add`, etc.
- **Orders:** `/public/orders`, `/public/orders/:id`, etc.
- **User:** `/public/user/profile`, `/public/user/addresses`, etc.

### Full URL
- **Example:** `http://localhost:3011/api/public/auth/register`
- **Format:** `${baseURL}${endpoint}` = `http://localhost:3011/api` + `/public/auth/register`

## 🔍 Debugging

### Logging
Register và login functions bây giờ log:
- Request data (email, firstName, lastName, phone)
- API endpoint
- API base URL
- Response data
- Error details (message, response, status, URL)

### Error Messages
- **Network Error:** "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
- **Server Error:** Hiển thị message từ server
- **Validation Error:** Hiển thị validation errors từ server
- **Generic Error:** "Đăng ký thất bại. Vui lòng thử lại."

## 🧪 Testing

### Test Cases
1. **Register với đầy đủ thông tin:**
   - Email: `test@example.com`
   - Password: `password123`
   - FirstName: `Test`
   - LastName: `User`
   - Phone: `0901234567`

2. **Register với thông tin thiếu:**
   - Kiểm tra validation errors
   - Kiểm tra error messages

3. **Register với email đã tồn tại:**
   - Kiểm tra error message từ server
   - Kiểm tra toast notification

4. **Network Error:**
   - Tắt backend server
   - Kiểm tra error message
   - Kiểm tra toast notification

## 📝 Next Steps

1. **Kiểm tra Backend:**
   - Đảm bảo backend server đang chạy
   - Đảm bảo endpoint `/api/public/auth/register` tồn tại
   - Đảm bảo CORS được cấu hình đúng

2. **Kiểm tra Environment Variables:**
   - `NEXT_PUBLIC_API_URL` (nếu có)
   - `NEXT_PUBLIC_API_PORT` (nếu có)

3. **Test Register:**
   - Mở browser console
   - Thử register với thông tin hợp lệ
   - Kiểm tra logs trong console
   - Kiểm tra network tab trong DevTools

## 🔗 Related Files

- `app/(main)/register/page.tsx` - Register page
- `lib/api/auth.ts` - Auth API functions
- `lib/api/endpoints.ts` - API endpoints
- `lib/api/client.ts` - API client configuration
- `config/site.ts` - API URL configuration

## 🎯 Expected Behavior

1. **User điền form đăng ký**
2. **Submit form**
3. **API call:** `POST http://localhost:3011/api/public/auth/register`
4. **Request body:**
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "firstName": "Test",
     "lastName": "User",
     "phone": "0901234567"
   }
   ```
5. **Response:**
   ```json
   {
     "data": {
       "user": {
         "id": "user-id",
         "email": "test@example.com",
         "firstName": "Test",
         "lastName": "User"
       },
       "accessToken": "token",
       "refreshToken": "refresh-token"
     }
   }
   ```
6. **Auto login và redirect về `/account`**

## ⚠️ Common Issues

### 1. Backend Not Running
- **Error:** Network error, "Không thể kết nối đến server"
- **Solution:** Start backend server

### 2. Wrong API URL
- **Error:** 404 Not Found
- **Solution:** Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`

### 3. CORS Error
- **Error:** CORS policy error
- **Solution:** Cấu hình CORS trong backend

### 4. Validation Error
- **Error:** 400 Bad Request với validation errors
- **Solution:** Kiểm tra form data và validation rules

### 5. Email Already Exists
- **Error:** 409 Conflict hoặc 400 Bad Request
- **Solution:** Sử dụng email khác hoặc login với email đã tồn tại

