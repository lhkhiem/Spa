# Admin Login Fix - Đã sửa

## Vấn đề

1. **Duplicate `/api/api/` trong URL**
   - `NEXT_PUBLIC_API_URL=https://api.banyco.vn/api` (đã có `/api`)
   - Code vẫn thêm `/api` → `https://api.banyco.vn/api/api/auth/login` ❌

2. **Lỗi 401 khi verify session**
   - Bình thường khi chưa login
   - Sẽ OK sau khi login thành công

3. **Lỗi 404 cho `/api/settings/appearance`**
   - Cũng do duplicate `/api/api/`

## Đã sửa

### 1. Sửa `authStore.ts`
- Kiểm tra URL đã có `/api` chưa trước khi thêm path
- Nếu có → chỉ thêm `/auth/login`
- Nếu chưa → thêm `/api/auth/login`

### 2. Sửa `lib/api.ts` - `buildApiUrl()`
- Tự động loại bỏ duplicate `/api/api/`
- Nếu base URL đã có `/api` và path bắt đầu bằng `/api`, sẽ bỏ `/api` trong path

## Cách test

1. Mở `https://admin.banyco.vn/login`
2. Đăng nhập:
   - Email: `admin@pressup.com`
   - Password: `admin123`
3. Kiểm tra console không còn lỗi 404
4. Kiểm tra có thể vào dashboard

## Lưu ý

- Lỗi 401 khi chưa login là bình thường
- Sau khi login, cookie sẽ được set và các API calls sẽ hoạt động
- Nếu vẫn lỗi, clear browser cache và hard refresh (Ctrl+Shift+R)



