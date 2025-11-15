# PHÂN TÍCH KỸ THUẬT TÍCH HỢP BACKEND CHO ECOMMERCE TEMPLATE

## TỔNG QUAN DỰ ÁN

**Tech Stack Frontend:**
- Framework: Next.js 14.2.18 (App Router)
- State Management: Zustand 4.5.5
- HTTP Client: Axios 1.7.7
- Forms: React Hook Form + Zod
- UI: TailwindCSS + Custom Components
- Animation: Framer Motion

**API Base URL:** `http://localhost:5000/api` (configurable via env)

---

## 1. AUTHENTICATION & AUTHORIZATION

### 1.1 Endpoints Required

```
POST   /auth/login              - Đăng nhập
POST   /auth/register           - Đăng ký
POST   /auth/logout             - Đăng xuất
POST   /auth/refresh            - Refresh token
POST   /auth/verify-email       - Xác thực email
POST   /auth/forgot-password    - Quên mật khẩu
POST   /auth/reset-password     - Đặt lại mật khẩu
GET    /auth/me                 - Lấy thông tin user hiện tại
```

### 1.2 Data Models

**Login Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Register Request:**
```typescript
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}
```

**Login/Register Response:**
```typescript
{
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      avatar?: string;
      role: 'customer' | 'admin';
      emailVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
}
```

### 1.3 Authentication Flow

- **Token Storage:** localStorage (accessToken, refreshToken)
- **Auto Refresh:** Interceptor tự động refresh token khi 401
- **Auth Guard:** Protect routes khi chưa đăng nhập
- **Token Format:** `Bearer {accessToken}`

---

## 2. PRODUCT MANAGEMENT

### 2.1 Product Endpoints

```
GET    /products                         - Danh sách sản phẩm (có phân trang, filter, sort)
GET    /products/:slug                   - Chi tiết sản phẩm
GET    /products/search?q=               - Tìm kiếm sản phẩm
GET    /products/featured                - Sản phẩm nổi bật (Homepage)
GET    /products/best-sellers            - Sản phẩm bán chạy
GET    /products/new-arrivals            - Sản phẩm mới
GET    /products/:productId/related      - Sản phẩm liên quan
GET    /products/:productId/reviews      - Reviews sản phẩm
POST   /products/:productId/reviews      - Thêm review (cần auth)
```

### 2.2 Product List Query Parameters

```typescript
{
  page?: number;              // Mặc định: 1
  limit?: number;             // Mặc định: 24
  sort?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating';
  category?: string;          // Slug category
  brand?: string;             // Slug brand
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  featured?: boolean;
  search?: string;            // Tìm kiếm tên, mô tả
}
```

### 2.3 Product Response Model

```typescript
{
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  sku: string;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    order: number;
  }>;
  category: {
    id: string;
    slug: string;
    name: string;
  };
  brand?: {
    id: string;
    slug: string;
    name: string;
    logo?: string;
  };
  variants?: Array<{
    id: string;
    name: string;
    options: Array<{ name: string; value: string }>;
    price?: number;
    sku?: string;
    stock: number;
    image?: string;
  }>;
  stock: number;
  tags: string[];
  featured: boolean;
  rating?: number;
  reviewCount?: number;
  attributes?: Array<{ name: string; value: string }>;
  ingredients?: string;
  specialInstructions?: string;
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'image';
  }>;
  relatedProducts?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### 2.4 Product List Response

```typescript
{
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: {
      categories: Array<{ id: string; name: string; count: number }>;
      brands: Array<{ id: string; name: string; count: number }>;
      priceRanges: Array<{ id: string; label: string; count: number }>;
    };
  }
}
```

---

## 3. CATEGORY MANAGEMENT

### 3.1 Category Endpoints

```
GET    /categories                    - Danh sách tất cả categories
GET    /categories/tree               - Category tree (hierarchical)
GET    /categories/:slug              - Chi tiết category
GET    /categories/:slug/products     - Products trong category (có filter, sort)
```

### 3.2 Category Response Model

```typescript
{
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  parentId?: string | null;
  children?: Category[];
  productCount: number;
  featured: boolean;
  order: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}
```

### 3.3 Category Products Response

Tương tự Product List Response, có thêm thông tin category.

---

## 4. BRAND MANAGEMENT

### 4.1 Brand Endpoints

```
GET    /brands                        - Danh sách tất cả brands
GET    /brands/:slug                  - Chi tiết brand
GET    /brands/:slug/products         - Products của brand (có filter, sort)
```

### 4.2 Brand Response Model

```typescript
{
  id: string;
  slug: string;
  name: string;
  logo?: string;
  description?: string;
  productCount: number;
  category?: string;
}
```

---

## 5. SHOPPING CART

### 5.1 Cart Endpoints

```
GET    /cart                          - Lấy giỏ hàng hiện tại
POST   /cart/add                      - Thêm sản phẩm vào giỏ
PUT    /cart/update                   - Cập nhật số lượng
DELETE /cart/remove                   - Xóa sản phẩm khỏi giỏ
DELETE /cart/clear                    - Xóa toàn bộ giỏ hàng
POST   /cart/promo                    - Áp dụng mã giảm giá
```

### 5.2 Cart Add/Update Request

```typescript
{
  productId: string;
  variantId?: string;
  quantity: number;
}
```

### 5.3 Cart Response Model

```typescript
{
  items: Array<{
    id: string;
    productId: string;
    variantId?: string;
    quantity: number;
    product: {
      id: string;
      slug: string;
      name: string;
      price: number;
      salePrice?: number;
      images: Array<{ url: string; alt?: string }>;
    };
    variant?: {
      id: string;
      name: string;
      price?: number;
    };
    addedAt: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
  promoCode?: string;
}
```

### 5.4 Cart Behavior

- **Storage:** Backend session + localStorage sync
- **Guest Cart:** Hỗ trợ guest checkout (dùng session ID)
- **Merge Cart:** Tự động merge khi login
- **Persistence:** Giữ cart giữa các phiên

---

## 6. ORDER MANAGEMENT

### 6.1 Order Endpoints

```
GET    /orders                        - Danh sách orders của user (cần auth)
GET    /orders/:orderId               - Chi tiết order
POST   /orders                        - Tạo order mới
PATCH  /orders/:orderId/cancel        - Hủy order
```

### 6.2 Create Order Request

```typescript
{
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  shippingAddressId: string;
  billingAddressId: string;
  shippingMethodId: string;
  paymentMethodId: string;
  promoCode?: string;
  notes?: string;
}
```

### 6.3 Order Response Model

```typescript
{
  id: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    variantId?: string;
    variantName?: string;
    sku: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    // Address model
  };
  billingAddress: {
    // Address model
  };
  shippingMethod: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  promoCode?: string;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 7. USER PROFILE & ADDRESSES

### 7.1 User Endpoints

```
GET    /user/profile                      - Lấy profile
PUT    /user/profile                      - Cập nhật profile
GET    /user/addresses                    - Danh sách addresses
POST   /user/addresses                    - Thêm address mới
PUT    /user/addresses/:addressId         - Cập nhật address
DELETE /user/addresses/:addressId         - Xóa address
GET    /user/wishlist                     - Danh sách wishlist
POST   /user/wishlist/add                 - Thêm vào wishlist
DELETE /user/wishlist/remove              - Xóa khỏi wishlist
```

### 7.2 Address Model

```typescript
{
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type: 'shipping' | 'billing' | 'both';
}
```

---

## 8. SEARCH & SUGGESTIONS

### 8.1 Search Endpoints

```
GET    /search/products?q=               - Tìm kiếm sản phẩm
GET    /search/suggestions?q=            - Search suggestions (autocomplete)
```

### 8.2 Search Response

```typescript
{
  data: {
    products: Product[];
    suggestions: Array<{
      type: 'product' | 'category' | 'brand';
      text: string;
      href: string;
    }>;
  }
}
```

---

## 9. CONTENT MANAGEMENT (Homepage)

### 9.1 Homepage Data Endpoints

```
GET    /homepage/hero-sliders            - Hero slider data
GET    /homepage/featured-categories     - Categories nổi bật
GET    /homepage/best-sellers            - Best sellers cho homepage
GET    /homepage/testimonials            - Testimonials
GET    /homepage/education-resources     - Education content
```

### 9.2 Hero Slider Model

```typescript
{
  id: number;
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  active: boolean;
}
```

---

## 10. CHECKOUT PROCESS

### 10.1 Shipping Methods

```typescript
[
  {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
    minOrderValue?: number;
    freeThreshold?: number;
  }
]
```

### 10.2 Payment Methods

```typescript
[
  {
    id: string;
    type: 'credit_card' | 'paypal' | 'bank_transfer';
    name: string;
    description?: string;
  }
]
```

### 10.3 Checkout Flow

1. **Validate Cart** - Kiểm tra tồn kho
2. **Calculate Totals** - Tính toán shipping, tax, discount
3. **Get Shipping Methods** - Lấy danh sách shipping options
4. **Submit Order** - Tạo order
5. **Process Payment** - Xử lý thanh toán (tích hợp payment gateway)
6. **Confirm Order** - Xác nhận order thành công

---

## 11. SPECIAL FEATURES

### 11.1 Newsletter Subscription

```
POST   /newsletter/subscribe
```

**Request:**
```typescript
{
  email: string;
  firstName?: string;
  lastName?: string;
}
```

### 11.2 Promo Codes

```
POST   /promo/validate
```

**Request:**
```typescript
{
  code: string;
  subtotal: number;
}
```

**Response:**
```typescript
{
  valid: boolean;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  message?: string;
}
```

---

## 12. RESPONSE FORMAT STANDARDS

### 12.1 Success Response

```typescript
{
  success: true;
  data: any;           // Actual data
  message?: string;    // Optional message
}
```

### 12.2 Error Response

```typescript
{
  success: false;
  error: {
    code: string;      // Error code
    message: string;   // User-friendly message
    details?: any;     // Additional error details
  }
}
```

### 12.3 HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## 13. API IMPLEMENTATION NOTES

### 13.1 Required Headers

```
Content-Type: application/json
Authorization: Bearer {accessToken} (nếu cần auth)
```

### 13.2 Pagination

- Default page size: 24
- Max page size: 96
- Page numbers start from 1

### 13.3 Filtering & Sorting

- Multiple filters: AND logic
- Case-insensitive search
- Sort options: featured, newest, price-asc, price-desc, name-asc, rating

### 13.4 Image Handling

- All images should be CDN URLs
- Support multiple image sizes
- Optimize images for web

### 13.5 Cache Strategy

- Product data: Cache 5 minutes
- Category/Brand data: Cache 1 hour
- User data: Cache 1 minute

---

## 14. SECURITY REQUIREMENTS

### 14.1 Authentication

- JWT tokens (access + refresh)
- Token expiration: 15 minutes (access), 7 days (refresh)
- Secure cookie storage for refresh tokens
- CSRF protection

### 14.2 Rate Limiting

- Public APIs: 100 requests/minute
- Authenticated APIs: 500 requests/minute
- Checkout: 10 requests/minute

### 14.3 Data Validation

- Input sanitization
- SQL injection prevention
- XSS protection
- Request size limits

### 14.4 Payment Security

- PCI DSS compliance
- Token-based payment processing
- No storage of sensitive card data
- HTTPS only

---

## 15. TESTING REQUIREMENTS

### 15.1 Test Coverage

- Unit tests: > 80%
- Integration tests: Critical paths
- E2E tests: Checkout flow, auth flow

### 15.2 Test Data

- Seed database with realistic data
- Test products, categories, brands
- Test user accounts with various roles

---

## 16. MONITORING & LOGGING

### 16.1 Required Logs

- API request/response logs
- Error logs with stack traces
- Performance logs
- Security event logs

### 16.2 Metrics

- Response times
- Error rates
- Request volumes
- Conversion rates

---

## 17. INTEGRATION PRIORITY

### Phase 1 (Critical - Core Functionality)
1. Authentication & Authorization
2. Product Listing & Detail
3. Shopping Cart
4. Checkout & Orders

### Phase 2 (Important - Enhanced Experience)
5. Categories & Brands
6. Search & Filters
7. User Profile & Addresses
8. Reviews & Ratings

### Phase 3 (Nice to Have - Content)
9. Homepage Content Management
10. Newsletter
11. Wishlist
12. Promo Codes

---

## 18. ENVIRONMENT VARIABLES

### Backend .env

```env
# Database
DATABASE_URL=

# JWT
JWT_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API
PORT=5000
API_PREFIX=/api

# Payment
PAYMENT_GATEWAY_API_KEY=
PAYMENT_GATEWAY_SECRET=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# File Upload
AWS_BUCKET=
AWS_REGION=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
```

### Frontend .env.local

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 19. DEPLOYMENT CONSIDERATIONS

### 19.1 CORS Configuration

```
Allowed Origins: http://localhost:3000, https://yourdomain.com
Allowed Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Allowed Headers: Content-Type, Authorization
```

### 19.2 Database

- PostgreSQL or MongoDB recommended
- Database migrations version control
- Backup strategy

### 19.3 CDN

- Static assets (images, files)
- Cache headers configuration
- Image optimization pipeline

---

## 20. DOCUMENTATION REQUIREMENTS

### API Documentation

- Swagger/OpenAPI specification
- Postman collection
- Code examples for each endpoint
- Authentication guide
- Error handling guide

---

## KẾT LUẬN

Tài liệu này cung cấp đầy đủ thông tin kỹ thuật để tích hợp Backend cho Ecommerce Template. Backend developer cần implement theo các specifications trên để đảm bảo tính tương thích hoàn toàn với Frontend hiện tại.

**Contact:** Frontend Team for clarifications


