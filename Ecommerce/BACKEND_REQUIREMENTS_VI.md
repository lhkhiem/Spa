# PHÂN TÍCH REQUIREMENTS BACKEND CHO ECOMMERCE

## TỔNG QUAN DỰ ÁN

Dự án **Universal Companies Ecommerce** là một website thương mại điện tử bán sản phẩm spa & salon chuyên nghiệp.

**Tech Stack:**
- Frontend: Next.js 14, React 18, TypeScript, TailwindCSS
- State Management: Zustand
- HTTP Client: Axios
- Form Validation: React Hook Form + Zod

---

## PHẦN 1: PHÂN TÍCH CÁC PAGE & FUNCTIONALITY

### 1.1 TRANG CHỦ (Homepage) - `app/(main)/page.tsx`

**Components:**
1. **HeroSlider** - Banner quảng cáo tự động
2. **ValueProps** - Giá trị cốt lõi (Free shipping, Professional quality, etc.)
3. **CategoryGrid** - Grid hiển thị categories nổi bật
4. **BestSellers** - Top 6 sản phẩm bán chạy
5. **BrandShowcase** - Showcase các brand đối tác
6. **Testimonials** - Đánh giá khách hàng
7. **EducationResources** - Tài nguyên học tập

**Backend Requirements:**

```
GET /homepage/hero-sliders          - Lấy danh sách banner quảng cáo
GET /homepage/categories            - Categories nổi bật cho grid
GET /products/best-sellers?limit=6  - Top 6 best sellers
GET /brands?featured=true           - Danh sách brand featured
GET /homepage/testimonials          - Testimonials
GET /homepage/education-resources   - Education content
```

---

### 1.2 TRANG SẢN PHẨM (Products Listing) - `app/(shop)/products/page.tsx`

**Features:**
- Hiển thị grid sản phẩm
- Filter: Category, Brand, Price, Availability, Special Offers
- Sort: Featured, Newest, Price (ASC/DESC), Name, Rating
- Search bar
- Pagination
- Mobile filter sidebar

**Backend Requirements:**

```
GET /products
Query Parameters:
- page: number
- limit: number (mặc định 24)
- sort: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating'
- category: string
- brand: string
- minPrice: number
- maxPrice: number
- inStock: boolean
- onSale: boolean
- search: string

Response phải có:
- products: Product[]
- pagination: { page, limit, total, totalPages }
- filters: { categories, brands, priceRanges }
```

---

### 1.3 TRANG CHI TIẾT SẢN PHẨM - `app/(shop)/products/[slug]/page.tsx`

**Features:**
- Image gallery với thumbnails
- Product info, price, SKU
- Variant selection (colors, sizes)
- Quantity selector
- Add to cart button
- Add to wishlist
- Tabs: Details, Reviews
- Related products

**Backend Requirements:**

```
GET /products/:slug                 - Chi tiết sản phẩm
GET /products/:productId/related    - Sản phẩm liên quan
GET /products/:productId/reviews    - Reviews của sản phẩm
POST /products/:productId/reviews   - Thêm review (cần auth)

Dữ liệu trả về phải có:
- Product details: name, price, salePrice, images, variants, stock, attributes, ingredients
- Rating & review count
- Reviews với phân trang
```

---

### 1.4 TRANG DANH MỤC - `app/(shop)/categories/[slug]/page.tsx`

**Features:**
- Filter products theo category
- Các filter tương tự Products page
- Sort & search

**Backend Requirements:**

```
GET /categories/:slug/products
Query Parameters: giống Products page

Response phải có category info + product list
```

---

### 1.5 TRANG BRANDS - `app/(shop)/brands/page.tsx`

**Features:**
- Grid hiển thị tất cả brands
- Category filter
- Brand card với logo, description, product count

**Backend Requirements:**

```
GET /brands                         - Tất cả brands
GET /brands?category=               - Filter theo category

Response: Brand[] với productCount
```

---

### 1.6 TRANG GIỎ HÀNG - `app/(shop)/cart/page.tsx`

**Features:**
- Danh sách sản phẩm trong cart
- Update quantity
- Remove items
- Order summary (subtotal, shipping, tax, total)
- Promo code input

**Backend Requirements:**

```
GET /cart                           - Lấy giỏ hàng (cần auth hoặc session)
POST /cart/add                      - Thêm sản phẩm
PUT /cart/update                    - Cập nhật quantity
DELETE /cart/remove                 - Xóa sản phẩm
POST /cart/promo                    - Áp dụng promo code
DELETE /cart/clear                  - Xóa toàn bộ

Response phải tính đúng:
- Subtotal
- Shipping (FREE nếu > $749)
- Tax
- Discount (nếu có promo)
- Total
```

---

### 1.7 TRANG CHECKOUT - `app/(shop)/checkout/page.tsx`

**Features:**
- Contact Information
- Shipping Information (form đầy đủ)
- Shipping Method selection
- Payment Information (card details)
- Billing address
- Order summary sidebar

**Backend Requirements:**

```
GET /orders/shipping-methods        - Danh sách shipping options
POST /orders                        - Tạo order mới
POST /orders/:orderId/payment       - Xử lý thanh toán

Validation:
- Kiểm tra tồn kho
- Validate shipping address
- Calculate tax theo location
- Verify promo code
```

---

### 1.8 TRANG ACCOUNT - `app/(account)/account/page.tsx`

**Features:**
- Recent Orders
- Account Details
- Addresses management
- Wishlist

**Backend Requirements:**

```
GET /user/profile                   - Profile info
PUT /user/profile                   - Update profile
GET /user/addresses                 - Danh sách addresses
POST /user/addresses                - Thêm address
PUT /user/addresses/:id             - Update address
DELETE /user/addresses/:id          - Xóa address
GET /orders                         - Orders của user
GET /user/wishlist                  - Wishlist
POST /user/wishlist/add             - Add to wishlist
DELETE /user/wishlist/remove        - Remove from wishlist
```

---

## PHẦN 2: DATA MODELS CHI TIẾT

### 2.1 PRODUCT MODEL

```typescript
Product {
  id: string                  // UUID hoặc auto-increment
  slug: string                // URL-friendly name
  name: string                // Tên sản phẩm
  description: string         // Mô tả đầy đủ
  shortDescription?: string   // Mô tả ngắn
  price: number               // Giá gốc
  salePrice?: number          // Giá khuyến mãi
  sku: string                 // Mã SKU
  images: [                   // Array images
    {
      id: string
      url: string              // CDN URL
      alt: string
      order: number
    }
  ]
  category: {                 // Category info
    id: string
    slug: string
    name: string
  }
  brand?: {                   // Brand info (optional)
    id: string
    slug: string
    name: string
    logo?: string
  }
  variants?: [                // Product variants
    {
      id: string
      name: string            // "Color", "Size", etc.
      options: [
        { name: string, value: string }
      ]
      price?: number          // Override price
      sku?: string
      stock: number
      image?: string
    }
  ]
  stock: number               // Tồn kho
  tags: string[]              // Tags để search
  featured: boolean           // Nổi bật
  rating?: number             // Rating trung bình (1-5)
  reviewCount?: number        // Số lượng reviews
  attributes?: [              // Thuộc tính sản phẩm
    { name: string, value: string }
  ]
  ingredients?: string        // Thành phần (cho spa products)
  specialInstructions?: string
  documents?: [               // Files đính kèm
    {
      id: string
      name: string
      url: string
      type: 'pdf' | 'doc' | 'image'
    }
  ]
  createdAt: string           // ISO date
  updatedAt: string           // ISO date
}
```

---

### 2.2 CATEGORY MODEL

```typescript
Category {
  id: string
  slug: string                // URL slug
  name: string                // Tên hiển thị
  description: string
  image: string               // Image URL
  parentId?: string           // Parent category ID (hierarchical)
  children?: Category[]       // Sub-categories
  productCount: number        // Số sản phẩm
  featured: boolean           // Nổi bật trên homepage
  order: number               // Thứ tự hiển thị
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  createdAt: string
  updatedAt: string
}
```

---

### 2.3 CART MODEL

```typescript
Cart {
  items: [
    {
      id: string
      productId: string
      variantId?: string       // Nếu có variant
      quantity: number
      product: {
        id: string
        slug: string
        name: string
        price: number
        salePrice?: number
        images: [{ url: string, alt?: string }]
      }
      variant?: {
        id: string
        name: string
        price?: number
      }
      addedAt: string
    }
  ]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  itemCount: number            // Tổng số items
  promoCode?: string
}
```

---

### 2.4 ORDER MODEL

```typescript
Order {
  id: string
  orderNumber: string          // Unique order number
  userId: string
  items: [
    {
      id: string
      productId: string
      productName: string
      productImage: string
      variantId?: string
      variantName?: string
      sku: string
      quantity: number
      price: number            // Price tại thời điểm order
      total: number            // price * quantity
    }
  ]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingAddress: Address
  billingAddress: Address
  shippingMethod: string
  paymentMethod: string
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  promoCode?: string
  notes?: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}
```

---

### 2.5 USER MODEL

```typescript
User {
  id: string
  email: string
  password: string             // Hashed
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: 'customer' | 'admin'
  emailVerified: boolean
  addresses?: Address[]
  createdAt: string
  updatedAt: string
}

Address {
  id: string
  userId: string
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
  type: 'shipping' | 'billing' | 'both'
}
```

---

## PHẦN 3: BUSINESS LOGIC

### 3.1 SHOPPING CART LOGIC

```javascript
// Tính toán cart totals
function calculateCart(cartItems, shippingMethod, promoCode, taxRate) {
  // Subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);
  
  // Shipping
  let shipping = 0;
  if (shippingMethod.freeThreshold && subtotal >= shippingMethod.freeThreshold) {
    shipping = 0;  // FREE SHIPPING
  } else {
    shipping = shippingMethod.price;
  }
  
  // Tax (8% mặc định)
  const tax = subtotal * taxRate;
  
  // Discount từ promo code
  let discount = 0;
  if (promoCode) {
    if (promoCode.discountType === 'percentage') {
      discount = subtotal * (promoCode.discountValue / 100);
    } else {
      discount = promoCode.discountValue;
    }
  }
  
  // Total
  const total = subtotal + shipping + tax - discount;
  
  return {
    subtotal,
    shipping,
    tax,
    discount,
    total,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };
}
```

---

### 3.2 PRODUCT FILTER LOGIC

```javascript
// Backend filter logic
function filterProducts(products, filters) {
  let filtered = products;
  
  // Search
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Category
  if (filters.category) {
    filtered = filtered.filter(p => p.category.slug === filters.category);
  }
  
  // Brand
  if (filters.brand) {
    filtered = filtered.filter(p => p.brand?.slug === filters.brand);
  }
  
  // Price range
  if (filters.minPrice) {
    filtered = filtered.filter(p => {
      const price = p.salePrice || p.price;
      return price >= filters.minPrice;
    });
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(p => {
      const price = p.salePrice || p.price;
      return price <= filters.maxPrice;
    });
  }
  
  // Stock
  if (filters.inStock !== undefined) {
    filtered = filtered.filter(p => filters.inStock ? p.stock > 0 : p.stock === 0);
  }
  
  // On sale
  if (filters.onSale) {
    filtered = filtered.filter(p => p.salePrice != null);
  }
  
  return filtered;
}
```

---

### 3.3 PRODUCT SORT LOGIC

```javascript
function sortProducts(products, sortBy) {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
    case 'price-asc':
      return sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      
    case 'price-desc':
      return sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      
    case 'featured':
    default:
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }
}
```

---

## PHẦN 4: AUTHENTICATION FLOW

### 4.1 REGISTER FLOW

```
1. User điền form: email, password, firstName, lastName, phone
2. Frontend validate với Zod
3. POST /auth/register
4. Backend tạo user, hash password
5. Backend tạo verification token, gửi email
6. Response trả về: user + tokens
7. Frontend lưu tokens vào localStorage
8. Frontend redirect to /account
```

---

### 4.2 LOGIN FLOW

```
1. User điền email + password
2. POST /auth/login
3. Backend verify credentials
4. Backend generate JWT tokens (access + refresh)
5. Response trả về: user + tokens
6. Frontend lưu tokens vào localStorage
7. Frontend set auth state trong Zustand
8. Interceptor tự động thêm Bearer token vào headers
```

---

### 4.3 AUTO REFRESH TOKEN FLOW

```
// Axios interceptor
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/auth/refresh', { refreshToken });
      
      // Update tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      
      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

---

## PHẦN 5: PAYMENT INTEGRATION

### 5.1 PAYMENT GATEWAY

**Recommended:** Stripe hoặc Square

```
POST /orders/:orderId/payment
{
  orderId: string
  paymentMethod: {
    type: 'card'
    card: {
      number: string
      expiryMonth: string
      expiryYear: string
      cvv: string
      name: string
    }
  }
}

Response:
{
  success: boolean
  transactionId: string
  paymentStatus: 'paid' | 'failed'
  message: string
}
```

---

## PHẦN 6: FILE UPLOAD

### 6.1 IMAGE UPLOAD

**Recommended:** AWS S3 hoặc Cloudinary

```typescript
POST /upload/image
Content-Type: multipart/form-data

Body: FormData with image file

Response:
{
  success: true
  data: {
    id: string
    url: string
    thumbnailUrl: string
    size: number
    width: number
    height: number
  }
}
```

---

## PHẦN 7: MONITORING & LOGGING

### 7.1 REQUIRED LOGS

```javascript
// API Access Log
{
  timestamp: string
  method: string
  url: string
  userId?: string
  ip: string
  userAgent: string
  statusCode: number
  responseTime: number
}

// Error Log
{
  timestamp: string
  level: 'error' | 'warn'
  message: string
  stack?: string
  context: {
    userId?: string
    request?: { method, url, body }
  }
}

// Business Event Log
{
  timestamp: string
  event: 'order_created' | 'payment_completed' | 'product_viewed'
  userId: string
  data: any
}
```

---

## PHẦN 8: SECURITY CHECKLIST

- [ ] JWT tokens với rotation
- [ ] Password hashing (bcrypt, argon2)
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] Input validation & sanitization
- [ ] HTTPS only
- [ ] Secure cookie flags
- [ ] PCI DSS compliance cho payment
- [ ] GDPR compliance
- [ ] Audit logging

---

## PHẦN 9: PERFORMANCE OPTIMIZATION

- [ ] Database indexing
- [ ] Query optimization
- [ ] Caching (Redis)
- [ ] Image CDN
- [ ] API response compression
- [ ] Pagination cho large datasets
- [ ] Lazy loading
- [ ] Connection pooling

---

## PHẦN 10: TESTING REQUIREMENTS

### 10.1 Unit Tests

- Business logic functions
- Helper utilities
- Data transformations

### 10.2 Integration Tests

- API endpoints
- Database operations
- Authentication flows
- Cart operations
- Order creation

### 10.3 E2E Tests

- Complete checkout flow
- User registration & login
- Add to cart → Checkout → Payment
- Product search & filters

---

## KẾT LUẬN

Tài liệu này bao gồm toàn bộ requirements để implement Backend cho Universal Companies Ecommerce. Backend developer cần:

1. Implement tất cả endpoints theo specification
2. Follow data models chính xác
3. Implement business logic đúng yêu cầu
4. Đảm bảo security best practices
5. Viết tests đầy đủ
6. Document API với Swagger/OpenAPI
7. Setup monitoring & logging
8. Optimize performance

**Priority:** Implement theo phases trong file BACKEND_INTEGRATION_ANALYSIS.md

**Questions:** Liên hệ Frontend Team


