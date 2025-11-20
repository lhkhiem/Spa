# Tóm tắt kiểm tra Nginx và Subdomain

## ✅ Các subdomain đã được cấu hình:
1. **admin.banyco-demo.pressup.vn** - CMS Admin Frontend (Port 3013)
2. **api.banyco-demo.pressup.vn** - Backend API (Port 3011)  
3. **banyco-demo.pressup.vn** - Ecommerce Frontend (Port 3000)

## ✅ Trạng thái Nginx:
- Nginx đang chạy: ✅
- Các file config đã được enable: ✅
- Syntax nginx config: ✅ OK

## ✅ Trạng thái Services:
- Backend API (Port 3011): ✅ Đang chạy và phản hồi
- Admin Frontend (Port 3013): ✅ Đang chạy và phản hồi
- Ecommerce Frontend (Port 3000): ✅ Đang chạy và phản hồi

## ✅ Kiểm tra truy cập qua domain:
- http://admin.banyco-demo.pressup.vn: ✅ Hoạt động (redirect đến /login)
- http://api.banyco-demo.pressup.vn/api/health: ✅ Hoạt động (200 OK)
- http://banyco-demo.pressup.vn: ✅ Hoạt động (200 OK)

## ⚠️ Vấn đề đã phát hiện và sửa:
1. **File .env.local có NEXT_PUBLIC_API_URL với /api ở cuối**
   - Đã sửa: `http://admin.banyco-demo.pressup.vn/api` → `http://admin.banyco-demo.pressup.vn`
   - Lý do: Code đã tự động thêm `/api/auth/login`, nên base URL không cần có `/api`

## 📋 Cấu hình Nginx hiện tại:

### admin.banyco-demo.pressup.vn
- Frontend: proxy đến http://127.0.0.1:3013
- API: proxy `/api/` đến http://127.0.0.1:3011/api/
- Uploads: proxy `/uploads/` đến http://127.0.0.1:3011/uploads/

### api.banyco-demo.pressup.vn
- Root: proxy đến http://127.0.0.1:3011

### banyco-demo.pressup.vn
- Frontend: proxy đến http://127.0.0.1:3000
- API: proxy `/api/` đến http://127.0.0.1:3011/api/
- Uploads: proxy `/uploads/` đến http://127.0.0.1:3011/uploads/

## 🔄 Cần restart:
Frontend đã được restart. Nếu vẫn gặp vấn đề, cần:
1. Xóa cache browser
2. Hard refresh (Ctrl+Shift+R)
3. Kiểm tra lại .env.local đã được cập nhật đúng

