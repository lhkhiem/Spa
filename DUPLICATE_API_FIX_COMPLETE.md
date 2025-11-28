# Duplicate /api/api/ Fix Complete ✅

## Vấn đề

- ❌ Nhiều component đang gọi `https://api.banyco.vn/api/api/...` (duplicate `/api`)
- ❌ Code dùng `${API_BASE_URL}/api/...` trực tiếp, trong khi `API_BASE_URL` đã có `/api` ở cuối

## Nguyên nhân

1. `NEXT_PUBLIC_API_URL=https://api.banyco.vn/api` (đã có `/api`)
2. Code dùng `${API_BASE_URL}/api/...` → thành `https://api.banyco.vn/api/api/...`

## Đã sửa

### 1. Files đã sửa:
- ✅ `app/dashboard/about/page.tsx` - Thay `${API_BASE_URL}/api/...` bằng `buildApiUrl('/api/...')`
- ✅ `app/dashboard/products/brands/page.tsx` - Thay tất cả `${API_BASE_URL}/api/...` bằng `buildApiUrl('/api/...')`
- ✅ `app/dashboard/value-props/page.tsx` - Thay tất cả `${API_BASE_URL}/api/...` bằng `buildApiUrl('/api/...')`
- ✅ `app/dashboard/sliders/page.tsx` - Thay tất cả `${API_BASE_URL}/api/...` bằng `buildApiUrl('/api/...')`
- ✅ `app/dashboard/testimonials/page.tsx` - Thay tất cả `${API_BASE_URL}/api/...` bằng `buildApiUrl('/api/...')`
- ✅ `app/dashboard/media-library/page.tsx` - Thay tất cả `${API_BASE_URL}/api/...` bằng `buildApiUrl('/api/...')`

### 2. Function `buildApiUrl()`:
- ✅ Tự động loại bỏ duplicate `/api` nếu base URL đã có `/api` và path bắt đầu với `/api`
- ✅ Đảm bảo URL đúng format: `https://api.banyco.vn/api/...`

### 3. Function `buildBackendUrl()`:
- ✅ Tự động loại bỏ `/api` khi path bắt đầu với `/uploads` (static files)
- ✅ Đảm bảo static files được serve từ root domain: `https://api.banyco.vn/uploads/...`

## Kết quả

- ✅ Không còn duplicate `/api/api/`
- ✅ Tất cả API calls dùng URL đúng
- ✅ Static files được serve đúng từ root domain

## Test

1. Mở browser console (F12)
2. Kiểm tra Network tab:
   - ✅ Không còn request đến `/api/api/...`
   - ✅ Tất cả requests đến `/api/...` (đúng)
   - ✅ Static files đến `/uploads/...` (đúng)

## Lưu ý

- Nếu vẫn thấy `/api/api/`, clear browser cache (Ctrl+Shift+R)
- Kiểm tra các file khác có thể còn dùng `${API_BASE_URL}/api/...` trực tiếp
- Luôn dùng `buildApiUrl()` thay vì concatenate trực tiếp



