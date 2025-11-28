# Hướng dẫn Cấu hình Domain bằng Biến Môi Trường

Dự án đã được refactor để sử dụng biến môi trường thay vì hardcode domain trong code. Điều này giúp dễ dàng chuyển đổi giữa các môi trường (development, staging, production) và thay đổi domain mà không cần sửa code.

## 📋 Các Biến Môi Trường Cần Cấu Hình

### Backend (`CMS/backend/.env`)

```env
# Domain Configuration (không có protocol, không có port)
FRONTEND_DOMAIN=banyco.vn
API_DOMAIN=banyco.vn          # Có thể giống FRONTEND_DOMAIN hoặc tách riêng (api.banyco.vn)
ADMIN_DOMAIN=admin.banyco.vn  # Subdomain cho CMS Admin

# Hoặc sử dụng full URLs (legacy support)
# ADMIN_ORIGIN=https://admin.banyco.vn
# WEBSITE_ORIGIN=https://banyco.vn
```

### Frontend Ecommerce (`Ecommerce/.env.local`)

```env
# API URL (full URL với protocol)
NEXT_PUBLIC_API_URL=https://banyco.vn/api
NEXT_PUBLIC_CMS_BASE_URL=https://banyco.vn/api

# Domain Configuration (cho domain utilities)
NEXT_PUBLIC_FRONTEND_DOMAIN=banyco.vn
NEXT_PUBLIC_API_DOMAIN=banyco.vn
```

### CMS Admin Frontend (`CMS/frontend/admin/.env.local`)

```env
# API URL (full URL với protocol)
NEXT_PUBLIC_API_URL=https://banyco.vn/api
NEXT_PUBLIC_BACKEND_URL=https://banyco.vn/api
```

## 🔄 Cách Hoạt Động

### Backend

1. **Helper Functions** (`CMS/backend/src/utils/domainUtils.ts`):
   - `getApiDomain()` - Lấy domain API từ biến môi trường
   - `getFrontendDomain()` - Lấy domain frontend
   - `getAdminDomain()` - Lấy domain admin
   - `normalizeMediaUrl()` - Chuẩn hóa URL media (thay IP bằng domain, convert HTTP → HTTPS)

2. **CORS Configuration** (`CMS/backend/src/app.ts`):
   - Tự động build `allowedOrigins` từ các biến môi trường
   - Hỗ trợ cả HTTP và HTTPS cho mỗi domain
   - Tự động thêm www subdomain nếu có

### Frontend

1. **Helper Functions** (`Ecommerce/lib/utils/domainUtils.ts`):
   - `getApiDomain()` - Lấy domain API từ biến môi trường
   - `getFrontendDomain()` - Lấy domain frontend
   - `normalizeMediaUrl()` - Chuẩn hóa URL media

2. **API Files**:
   - Tất cả các file API (`products.ts`, `publicHomepage.ts`, `brands.ts`, `categories.ts`, `posts.ts`) đã được refactor để sử dụng `normalizeMediaUrl()` từ `domainUtils`

## 📝 Ví Dụ Cấu Hình

### Development (Localhost)

**Backend:**
```env
FRONTEND_DOMAIN=localhost:3000
API_DOMAIN=localhost:3011
ADMIN_DOMAIN=localhost:3013
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3011/api
NEXT_PUBLIC_FRONTEND_DOMAIN=localhost
NEXT_PUBLIC_API_DOMAIN=localhost
```

### Production (Domain chính)

**Backend:**
```env
FRONTEND_DOMAIN=banyco.vn
API_DOMAIN=banyco.vn
ADMIN_DOMAIN=admin.banyco.vn
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://banyco.vn/api
NEXT_PUBLIC_FRONTEND_DOMAIN=banyco.vn
NEXT_PUBLIC_API_DOMAIN=banyco.vn
```

### Production với Subdomain riêng cho API

**Backend:**
```env
FRONTEND_DOMAIN=banyco.vn
API_DOMAIN=api.banyco.vn
ADMIN_DOMAIN=admin.banyco.vn
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://api.banyco.vn/api
NEXT_PUBLIC_FRONTEND_DOMAIN=banyco.vn
NEXT_PUBLIC_API_DOMAIN=api.banyco.vn
```

## ✅ Lợi Ích

1. **Không còn hardcode domain** - Tất cả domain được cấu hình qua biến môi trường
2. **Dễ dàng chuyển đổi môi trường** - Chỉ cần thay đổi file `.env`
3. **Tự động xử lý HTTPS** - Tự động convert HTTP → HTTPS cho production domains
4. **Tự động thay IP bằng domain** - Fix Mixed Content issues
5. **CORS tự động** - Tự động build allowed origins từ domain config

## 🔍 Kiểm Tra

Sau khi cấu hình, kiểm tra:

1. **Backend CORS**: Xem log khi có request từ domain mới
2. **Media URLs**: Kiểm tra URL ảnh có đúng domain không
3. **API Calls**: Kiểm tra API calls từ frontend có hoạt động không

## 📚 Files Đã Được Refactor

### Backend
- ✅ `CMS/backend/src/utils/domainUtils.ts` (mới)
- ✅ `CMS/backend/src/app.ts` (CORS)
- ✅ `CMS/backend/src/controllers/public/productController.ts`
- ✅ `CMS/backend/src/controllers/public/homepageController.ts`

### Frontend
- ✅ `Ecommerce/lib/utils/domainUtils.ts` (mới)
- ✅ `Ecommerce/lib/api/products.ts`
- ✅ `Ecommerce/lib/api/publicHomepage.ts`
- ✅ `Ecommerce/lib/api/brands.ts`
- ✅ `Ecommerce/lib/api/categories.ts`
- ✅ `Ecommerce/lib/api/posts.ts`

## 🚀 Next Steps

1. Cập nhật file `.env` của backend với domain mới
2. Cập nhật file `.env.local` của frontend với domain mới
3. Restart services:
   ```bash
   pm2 restart cms-backend
   pm2 restart ecommerce-frontend
   pm2 restart cms-admin
   ```
4. Kiểm tra lại website hoạt động đúng với domain mới



