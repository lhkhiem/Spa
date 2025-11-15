# 📊 PHÂN TÍCH HỆ THỐNG TÀI KHOẢN: TÁCH RIÊNG HAY CHUNG?

## 🎯 MỤC ĐÍCH

Xác định xem **Customer Account** (tài khoản khách hàng) nên **tách riêng** hay **chung** với **CMS Account** (tài khoản quản trị CMS) để:
- Lấy thông tin khách hàng phục vụ mua hàng
- Hỗ trợ CSKH (Customer Service)
- Quản lý dữ liệu hiệu quả

---

## 📋 HIỆN TRẠNG HỆ THỐNG

### 1. Customer Account System (E-commerce Backend)

**Backend:** `NEXT_PUBLIC_API_URL` (ví dụ: `http://localhost:3011`)

**API Endpoints:**
```
POST   /auth/login              - Đăng nhập khách hàng
POST   /auth/register           - Đăng ký khách hàng
POST   /auth/logout             - Đăng xuất
POST   /auth/refresh            - Refresh token
GET    /auth/me                 - Lấy thông tin user hiện tại
GET    /user/profile            - Thông tin profile
PUT    /user/profile            - Cập nhật profile
GET    /user/addresses          - Danh sách địa chỉ
POST   /user/addresses          - Thêm địa chỉ
GET    /orders                  - Lịch sử đơn hàng
GET    /user/wishlist           - Danh sách yêu thích
```

**User Model:**
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';  // ⚠️ Có role 'admin'
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Mục đích:**
- ✅ Mua hàng online
- ✅ Quản lý đơn hàng
- ✅ Quản lý địa chỉ giao hàng
- ✅ Wishlist
- ✅ Lịch sử mua hàng
- ✅ CSKH: Xem thông tin khách hàng, đơn hàng

---

### 2. CMS Account System (CMS Backend)

**Backend:** `NEXT_PUBLIC_CMS_BASE_URL` (ví dụ: `http://localhost:1337`)

**Authentication:**
- Dùng **API Token** (Bearer token) trong header
- Token được lưu trong env: `CMS_API_TOKEN`
- Không có user login/logout flow

**API Endpoints:**
```
GET    /api/products            - Lấy sản phẩm từ CMS
GET    /api/posts               - Lấy bài viết
GET    /api/pages               - Lấy trang
GET    /api/menu-items          - Lấy menu
GET    /api/categories          - Lấy danh mục
```

**Mục đích:**
- ✅ Quản lý nội dung (Content Management)
- ✅ Quản lý sản phẩm trong CMS
- ✅ Quản lý bài viết, trang
- ✅ Quản lý menu, slider
- ✅ **KHÔNG** dùng cho khách hàng mua hàng

---

## 🔍 PHÂN TÍCH: TÁCH RIÊNG HAY CHUNG?

### ❌ **KHÔNG NÊN CHUNG** - Lý do:

#### 1. **Mục đích khác nhau**
- **Customer Account**: Phục vụ khách hàng mua hàng, cần thông tin: địa chỉ, đơn hàng, thanh toán
- **CMS Account**: Phục vụ admin/content manager quản lý nội dung, không cần thông tin mua hàng

#### 2. **Bảo mật khác nhau**
- **Customer Account**: 
  - JWT tokens (access + refresh)
  - Token expiration: 15 min (access), 7 days (refresh)
  - Auto-refresh mechanism
  - Cần bảo vệ thông tin cá nhân (GDPR)
  
- **CMS Account**:
  - API Token (long-lived)
  - Không có refresh mechanism
  - Quyền truy cập cao hơn (admin)

#### 3. **Dữ liệu khác nhau**
- **Customer Account** cần:
  - Thông tin cá nhân (email, phone, address)
  - Lịch sử đơn hàng
  - Payment methods
  - Shipping addresses
  - Wishlist
  - Order tracking
  
- **CMS Account** cần:
  - Quyền truy cập CMS
  - Permissions (read/write/delete)
  - Content management history
  - **KHÔNG** cần thông tin mua hàng

#### 4. **Backend khác nhau**
- **Customer Account**: E-commerce Backend (`/api/auth/*`, `/api/user/*`)
- **CMS Account**: CMS Backend (`/api/*` với API token)

#### 5. **User Experience**
- Khách hàng không cần truy cập CMS
- Admin không cần thông tin mua hàng của khách
- Tách riêng giúp UX rõ ràng hơn

---

## ✅ **KHUYẾN NGHỊ: TÁCH RIÊNG**

### Cấu trúc đề xuất:

```
┌─────────────────────────────────────┐
│   CUSTOMER ACCOUNT SYSTEM           │
│   (E-commerce Backend)              │
├─────────────────────────────────────┤
│ • Authentication: /auth/*           │
│ • User Profile: /user/*             │
│ • Orders: /orders/*                 │
│ • Addresses: /user/addresses        │
│ • Wishlist: /user/wishlist          │
│                                     │
│ Purpose:                            │
│ - Mua hàng                          │
│ - Quản lý đơn hàng                  │
│ - CSKH                              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   CMS ACCOUNT SYSTEM                │
│   (CMS Backend)                     │
├─────────────────────────────────────┤
│ • API Token Authentication          │
│ • Content Management                │
│ • Products (CMS)                    │
│ • Posts, Pages, Menu                │
│                                     │
│ Purpose:                            │
│ - Quản lý nội dung                  │
│ - Admin panel                       │
│ - Content editing                   │
└─────────────────────────────────────┘
```

---

## 🎯 IMPLEMENTATION PLAN

### ⚠️ **KIẾN TRÚC MỚI: BACKEND THỐNG NHẤT**

**Backend DUY NHẤT** vừa xử lý:
1. ✅ **CRUD Operations** (Admin Panel) - `/api/admin/*`
2. ✅ **API Endpoints** (Frontend) - `/api/public/*`

**Xem chi tiết:** `BACKEND_UNIFIED_ARCHITECTURE.md`

---

### 1. Customer Account (Trong Backend Thống Nhất)

**Frontend:**
- `lib/stores/authStore.ts` - Quản lý auth state
- `lib/api/client.ts` - API client với JWT tokens
- `app/(account)/account/page.tsx` - Account dashboard

**Backend APIs:**
```
POST   /api/public/auth/login
POST   /api/public/auth/register
POST   /api/public/auth/logout
POST   /api/public/auth/refresh
GET    /api/public/auth/me
GET    /api/public/user/profile
PUT    /api/public/user/profile
GET    /api/public/user/addresses
POST   /api/public/user/addresses
PUT    /api/public/user/addresses/:id
DELETE /api/public/user/addresses/:id
GET    /api/public/orders
GET    /api/public/orders/:id
POST   /api/public/orders
GET    /api/public/user/wishlist
POST   /api/public/user/wishlist/add
DELETE /api/public/user/wishlist/:id
```

**Database Tables:**
```sql
users
  - id
  - email
  - password_hash
  - first_name
  - last_name
  - phone
  - role: 'customer' | 'admin'  -- ⚠️ Có thể cần tách role
  - email_verified
  - created_at
  - updated_at

addresses
  - id
  - user_id
  - first_name
  - last_name
  - address_line1
  - city
  - state
  - postal_code
  - country
  - phone
  - is_default

orders
  - id
  - user_id
  - order_number
  - status
  - total
  - shipping_address_id
  - billing_address_id
  - created_at
```

---

### 2. CMS Account (Trong Backend Thống Nhất)

**Frontend:**
- `lib/cms.ts` - CMS API client với API token (đọc content)
- `lib/api/client.ts` - API client với JWT (customer account)

**Backend:**
- **Backend DUY NHẤT** xử lý cả CMS và Customer Account
- Admin Panel: `/api/admin/*` - CRUD operations
- Public API: `/api/public/*` - Frontend API
- CMS Content: `/api/public/*` - Public content (posts, products, etc.)

**Lưu ý:**
- Admin đăng nhập vào Admin Panel để CRUD content
- Customer đăng nhập vào Frontend để mua hàng
- Frontend dùng API token để đọc content (không cần auth)
- Frontend dùng JWT để authentication (customer account)

---

## 🔐 VẤN ĐỀ VỚI ROLE 'admin' TRONG CUSTOMER ACCOUNT

### Hiện tại:
```typescript
role: 'customer' | 'admin'
```

### Vấn đề:
- Role `'admin'` trong customer account có thể gây nhầm lẫn
- Admin của e-commerce (quản lý đơn hàng, khách hàng) ≠ Admin của CMS (quản lý nội dung)

### Giải pháp:

#### Option 1: Tách role rõ ràng
```typescript
// Customer Account
role: 'customer' | 'ecommerce_admin' | 'super_admin'

// CMS Account (riêng biệt)
cms_role: 'editor' | 'admin' | 'super_admin'
```

#### Option 2: Giữ nguyên nhưng phân quyền rõ ràng
```typescript
// Customer Account
role: 'customer' | 'admin'

// Admin trong customer account chỉ có quyền:
// - Xem/quản lý đơn hàng
// - Xem/quản lý khách hàng
// - CSKH
// - KHÔNG có quyền quản lý CMS
```

---

## 📊 SO SÁNH (KIẾN TRÚC MỚI: BACKEND THỐNG NHẤT)

| Tiêu chí | Customer Account | CMS Account |
|----------|-----------------|-------------|
| **Backend** | **Backend DUY NHẤT** | **Backend DUY NHẤT** |
| **API Routes** | `/api/public/*` | `/api/admin/*` (CRUD), `/api/public/*` (đọc content) |
| **Authentication** | JWT (access + refresh) | API Token (đọc content), JWT (admin CRUD) |
| **Users** | Khách hàng mua hàng | Admin/Editor quản lý nội dung |
| **Data** | Orders, Addresses, Profile | Posts, Pages, Menu, Products (CMS) |
| **Purpose** | Mua hàng, CSKH | Quản lý nội dung |
| **Frontend** | `authStore`, login/logout | API token từ env (đọc), Admin panel (CRUD) |
| **Security** | Token expiration, refresh | Long-lived token (đọc), JWT (admin) |
| **Database** | **Chung database** | **Chung database** |

---

## ✅ KẾT LUẬN (KIẾN TRÚC MỚI)

### **BACKEND THỐNG NHẤT** - Lợi ích:

1. ✅ **Backend duy nhất** - Dễ maintain, không cần sync data
2. ✅ **Database chung** - Users, orders, products trong 1 database
3. ✅ **Authentication thống nhất** - JWT cho cả customer và admin
4. ✅ **API rõ ràng** - `/api/public/*` cho frontend, `/api/admin/*` cho admin
5. ✅ **Dễ mở rộng** - Thêm endpoints mới dễ dàng
6. ✅ **Giảm complexity** - Không cần quản lý nhiều backend
7. ✅ **Deployment đơn giản** - Chỉ cần deploy 1 backend

### **Lưu ý:**

- ✅ Role `'admin'` trong customer account có thể quản lý orders, customers
- ✅ Admin đăng nhập vào Admin Panel để CRUD content (`/api/admin/*`)
- ✅ Customer đăng nhập vào Frontend để mua hàng (`/api/public/*`)
- ✅ Frontend dùng API token để đọc content (không cần auth)
- ✅ Frontend dùng JWT để authentication (customer account)

### **Xem chi tiết:**

- 📄 `BACKEND_UNIFIED_ARCHITECTURE.md` - Kiến trúc backend thống nhất
- 📄 Database schema, controllers, routes, middleware
- 📄 Authentication flow, API endpoints

---

## 🎯 NEXT STEPS (KIẾN TRÚC MỚI)

### Backend Implementation:

1. ⚠️ **Tạo database tables** (users, addresses, orders, cart, wishlist)
   - Xem schema trong `BACKEND_UNIFIED_ARCHITECTURE.md`

2. ⚠️ **Tạo models** (User, Address, Order, Cart, Wishlist)
   - Sequelize models trong `src/models/`

3. ⚠️ **Tạo controllers** (auth, user, order, cart)
   - Public controllers trong `src/controllers/public/`
   - Admin controllers trong `src/controllers/admin/`

4. ⚠️ **Tạo routes** (public, admin)
   - Public routes trong `src/routes/public/`
   - Admin routes trong `src/routes/admin/`

5. ⚠️ **Tạo middleware** (auth, adminAuth)
   - JWT authentication middleware
   - Admin authorization middleware

6. ⚠️ **Test API endpoints**
   - Test authentication flow
   - Test CRUD operations
   - Test API integration với frontend

### Frontend Integration:

1. ✅ **Frontend đã sẵn sàng** - `lib/api/client.ts`, `lib/stores/authStore.ts`
2. ⚠️ **Cập nhật API endpoints** - Đổi từ `/auth/*` sang `/api/public/auth/*`
3. ⚠️ **Test authentication** - Login, register, logout flow
4. ⚠️ **Test API calls** - Profile, addresses, orders, cart

### Xem chi tiết:

- 📄 `BACKEND_UNIFIED_ARCHITECTURE.md` - Kiến trúc backend thống nhất
- 📄 Database schema, controllers, routes, middleware
- 📄 Authentication flow, API endpoints

---

*Last Updated: 2025-01-31*






