# CORS Fix Complete ✅

## Vấn đề đã sửa

1. ✅ **Frontend (`banyco.vn`) không kết nối được API**
   - CORS đã được cấu hình đúng
   - Backend cho phép `https://banyco.vn`

2. ✅ **Admin (`admin.banyco.vn`) không kết nối được API**
   - Admin frontend đã được cập nhật từ `admin.banyco-demo.pressup.vn` → `api.banyco.vn`
   - CORS đã được cấu hình đúng
   - Backend cho phép `https://admin.banyco.vn`

## Đã thực hiện

### 1. Cập nhật Environment Variables

**Backend (`CMS/backend/.env`):**
```env
FRONTEND_DOMAIN=banyco.vn
API_DOMAIN=api.banyco.vn
ADMIN_DOMAIN=admin.banyco.vn
```

**Frontend (`Ecommerce/.env.local`):**
```env
NEXT_PUBLIC_API_URL=https://api.banyco.vn/api
NEXT_PUBLIC_CMS_BASE_URL=https://api.banyco.vn/api
NEXT_PUBLIC_FRONTEND_DOMAIN=banyco.vn
NEXT_PUBLIC_API_DOMAIN=api.banyco.vn
```

**Admin (`CMS/frontend/admin/.env.local`):**
```env
NEXT_PUBLIC_API_URL=https://api.banyco.vn/api
NEXT_PUBLIC_BACKEND_URL=https://api.banyco.vn/api
```

### 2. Rebuild và Restart Services

```bash
# Backend
cd /var/www/Spa/CMS/backend
npm run build
pm2 restart cms-backend

# Admin Frontend
cd /var/www/Spa/CMS/frontend/admin
npm run build
pm2 restart cms-admin
```

### 3. Kiểm tra CORS

✅ `https://banyco.vn` → `https://api.banyco.vn` - CORS OK
✅ `https://admin.banyco.vn` → `https://api.banyco.vn` - CORS OK

## Kết quả

- ✅ Frontend có thể gọi API từ `api.banyco.vn`
- ✅ Admin có thể gọi API từ `api.banyco.vn`
- ✅ CORS headers được trả về đúng
- ✅ Tất cả services đang chạy

## Lưu ý

- Nếu vẫn thấy lỗi CORS, hãy clear browser cache và hard refresh (Ctrl+Shift+R)
- Admin frontend cần rebuild sau khi thay đổi `.env.local`
- Backend cần rebuild sau khi thay đổi CORS config



