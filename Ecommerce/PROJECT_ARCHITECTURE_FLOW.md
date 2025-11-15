# Kiến Trúc Dự Án & Luồng Xử Lý Dữ Liệu

## Tổng Quan Thư Mục
- `cms-pressup/backend/`: Dịch vụ CMS (Node + Express). Chứa toàn bộ logic CRUD cho admin, model Sequelize, migration và controller phục vụ công khai.
  - `src/config/database.ts`: Cấu hình kết nối Postgres dùng chung cho mọi controller.
  - `src/models/`: Định nghĩa model Sequelize (sản phẩm, danh mục, thương hiệu, bài viết...).
  - `src/controllers/public/`: Các endpoint chỉ đọc dành cho website khách (`homepageController`, `postController`, ...).
  - `src/routes/`: Khai báo router; các route public nằm ở `publicHomepage.ts`, `publicPosts.ts`, ...
  - `src/app.ts`: Khởi tạo Express, mount `/api/public/...` song song với API admin và đảm bảo thư mục uploads.
  - `src/migrations/`: Các migration SQL (schema + seed) được chạy qua script trong `scripts/`.
- `ecommerce-template-01/app/`: App router Next.js cho storefront (home, shop, account...).
- `ecommerce-template-01/components/`: Component giao diện chia theo tính năng (`home`, `product`, `layout`, `ui`).
- `ecommerce-template-01/lib/`:
  - `api/client.ts`: Axios client cấu hình sẵn `siteConfig.apiUrl`.
  - `api/publicHomepage.ts`: Hàm helper có kiểu để gọi endpoint public của CMS.
  - `stores/`: Zustand store cho auth, cart...
  - `types/`: Kiểu TypeScript dùng chung (product, cart, order,...).
- `config/site.ts`: Cấu hình site và API base URL (`NEXT_PUBLIC_API_URL`).

## Luồng Dữ Liệu Khi Chạy
1. **Tạo nội dung**  
   Admin thao tác trong CMS (slider, sản phẩm, testimonial...). Dữ liệu được lưu vào Postgres thông qua Sequelize trong `cms-pressup/backend`.

2. **Lớp Public API**  
   - Controller trong `src/controllers/public` đọc Postgres bằng truy vấn SQL (`QueryTypes.SELECT`).  
   - Route như `src/routes/publicHomepage.ts` phơi bày endpoint:
     - `/api/public/homepage/hero-sliders`
     - `/api/public/homepage/best-sellers`
     - `/api/public/homepage/featured-categories`
     - `/api/public/homepage/featured-brands`
     - `/api/public/homepage/value-props`
     - `/api/public/homepage/testimonials`
     - `/api/public/homepage/education-resources`
   - `app.ts` mount các route này dưới `/api/public/...` cùng với API admin.

3. **Frontend sử dụng**  
   - `lib/api/publicHomepage.ts` gói các endpoint thành helper (Axios) có kiểu dữ liệu rõ ràng.
   - Các component trang chủ (`HeroSlider`, `BestSellers`, `CategoryGrid`, `BrandShowcase`, `ValueProps`, `EducationResources`, `Testimonials`) gọi helper trong `useEffect`, đổ dữ liệu vào state và giữ fallback khi API lỗi.
   - Base URL của API được định nghĩa trong `config/site.ts` (`NEXT_PUBLIC_API_URL`), chỉ cần chỉnh `.env` khi đổi môi trường.

4. **State & Render**  
   - Component chạy phía client (`'use client'`), tự xử lý trạng thái tải bằng dữ liệu fallback, log lỗi nếu request thất bại.
   - `ProductCard`, component layout và UI dùng chung giúp giao diện thống nhất.

## Ví Dụ Vòng Đời Request
_Phần “Best Sellers” trên trang chủ_
1. Admin đánh dấu sản phẩm `is_best_seller = TRUE` (đã hỗ trợ qua migration/seed).
2. `GET /api/public/homepage/best-sellers` (controller `getBestSellerProducts`) trả về danh sách sản phẩm cùng ảnh.
3. `fetchBestSellers()` trong `lib/api/publicHomepage.ts` gọi Axios để lấy dữ liệu.
4. `components/home/BestSellers/BestSellers.tsx` map dữ liệu sang `ProductCard` và render lại.

## Biến Môi Trường
- Frontend:  
  - `NEXT_PUBLIC_API_URL` → trỏ tới CMS backend (ví dụ `http://localhost:5000/api`).
- CMS backend:  
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` → cấu hình Postgres.  
  - `ADMIN_ORIGIN`, `WEBSITE_ORIGIN` → cấu hình CORS cho admin UI và website khách.

## Quy Trình Phát Triển
1. Khởi chạy Postgres và chạy migration (`cms-pressup/backend`).
2. Chạy CMS backend (`npm run dev` trong `cms-pressup/backend`).
3. Chạy storefront (`npm run dev` trong `ecommerce-template-01`).
4. CMS ghi dữ liệu → endpoint public cung cấp → frontend hiển thị qua Axios helper.

Kiến trúc này cho phép backend CMS và website khách dùng chung database/model nhưng vẫn tách biệt rõ giữa API quản trị và API chỉ đọc cho storefront.

