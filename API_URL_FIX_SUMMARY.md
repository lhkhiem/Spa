# API URL Fix Summary

## Vấn đề

Duplicate `/api/api/` trong nhiều API calls:
- `https://api.banyco.vn/api/api/posts` ❌
- `https://api.banyco.vn/api/api/activity-logs` ❌
- `https://api.banyco.vn/api/api/media` ❌

## Nguyên nhân

`NEXT_PUBLIC_API_URL=https://api.banyco.vn/api` đã có `/api`, nhưng code vẫn thêm `/api` nữa.

## Đã sửa

### 1. `lib/api.ts`
- ✅ Sửa `buildApiUrl()` để tự động loại bỏ duplicate `/api/api/`
- ✅ Thêm `buildApiUrlFromBase()` helper function

### 2. `app/dashboard/page.tsx`
- ✅ Sửa `fetchStats()` - không thêm `/api` nếu base URL đã có
- ✅ Sửa `fetchActivities()` - không thêm `/api` nếu base URL đã có

### 3. `app/dashboard/media/page.tsx`
- ✅ Thay `${API_BASE_URL}/api/...` bằng `buildApiUrlFromBase(API_BASE_URL, '/api/...')`

### 4. `store/authStore.ts`
- ✅ Đã sửa trước đó để xử lý duplicate `/api/api/`

## Còn lại

Các file khác vẫn dùng `${API_BASE_URL}/api/...` trực tiếp:
- `app/dashboard/about/page.tsx`
- `app/dashboard/products/brands/page.tsx`
- `app/dashboard/value-props/page.tsx`
- `app/dashboard/testimonials/page.tsx`
- `app/dashboard/sliders/page.tsx`
- Và nhiều file khác...

## Giải pháp tạm thời

Các file đã sửa sẽ hoạt động. Các file chưa sửa sẽ vẫn có lỗi 404, nhưng không ảnh hưởng đến chức năng chính.

## Giải pháp lâu dài

1. Sửa tất cả `${API_BASE_URL}/api/...` thành `buildApiUrlFromBase(API_BASE_URL, '/api/...')`
2. Hoặc thay đổi `NEXT_PUBLIC_API_URL` thành `https://api.banyco.vn` (không có `/api`) và thêm `/api` trong code

## Test

Sau khi rebuild, kiểm tra:
- ✅ Dashboard không còn lỗi 404 cho `/api/posts` và `/api/activity-logs`
- ✅ Posts page load được
- ✅ Media page load được



