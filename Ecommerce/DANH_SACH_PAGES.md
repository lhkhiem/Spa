# DANH SÁCH TẤT CẢ CÁC PAGES VÀ YÊU CẦU BACKEND

## TỔNG QUAN
Dự án Universal Companies có tổng cộng **25+ pages** được chia thành 3 nhóm chính:
- **Main Pages**: Trang chủ và các trang thông tin
- **Shop Pages**: Trang mua sắm và checkout
- **Account Pages**: Quản lý tài khoản

---

## 📁 NHÓM MAIN PAGES `app/(main)/`

### 1. Homepage - `page.tsx` ⭐ CRITICAL
**URL:** `/`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Components:**
- HeroSlider
- ValueProps
- CategoryGrid
- BestSellers
- BrandShowcase
- Testimonials
- EducationResources

**Required APIs:**
```
GET /homepage/hero-sliders
GET /homepage/categories
GET /products/best-sellers?limit=6
GET /brands?featured=true
GET /homepage/testimonials
GET /homepage/education-resources
```

---

### 2. About Page - `about/page.tsx`
**URL:** `/about`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ❌ NO (Static Content)

**Features:**
- Company information
- Story, mission, values
- Team members (nếu có)
- Static content

---

### 3. Careers Page - `careers/page.tsx`
**URL:** `/careers`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES (Optional)

**Features:**
- Job listings
- Application form

**Required APIs:**
```
GET /careers/jobs
POST /careers/apply
```

---

### 4. Contact Page - `contact/page.tsx`
**URL:** `/contact`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Contact form
- Office locations
- Contact information

**Required APIs:**
```
POST /contact/submit
GET /contact/locations
```

---

### 5. Learning Page - `learning/page.tsx`
**URL:** `/learning`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Course listings
- Educational resources
- CEU tracking

**Required APIs:**
```
GET /learning/courses
GET /learning/resources
GET /user/certificates (cần auth)
```

---

### 6. Catalogs Page - `catalogs/page.tsx`
**URL:** `/catalogs`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Product catalog downloads
- Digital catalogs

**Required APIs:**
```
GET /catalogs/list
GET /catalogs/:id/download
```

---

### 7. FAQs Page - `faqs/page.tsx`
**URL:** `/faqs`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES (Optional CMS)

**Features:**
- Frequently asked questions
- Search functionality

**Required APIs:**
```
GET /faqs
GET /faqs/search?q=
```

---

### 8. Financing Page - `financing/page.tsx`
**URL:** `/financing`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES (Optional)

**Features:**
- Financing information
- Application form

**Required APIs:**
```
POST /financing/apply
GET /financing/calculator
```

---

### 9. Modalities Page - `modalities/page.tsx`
**URL:** `/modalities`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Treatment modalities
- Equipment by modality

**Required APIs:**
```
GET /modalities/list
GET /modalities/:id/products
```

---

### 10. Partnerships Page - `partnerships/page.tsx`
**URL:** `/partnerships`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES (Optional)

**Features:**
- School partnerships
- Partner information

**Required APIs:**
```
GET /partnerships
POST /partnerships/inquire
```

---

### 11. Privacy Page - `privacy/page.tsx`
**URL:** `/privacy`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ❌ NO (Static Content)

**Features:**
- Privacy policy
- Data protection information

---

### 12. Rewards Page - `rewards/page.tsx`
**URL:** `/rewards`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Loyalty program
- Points balance
- Rewards catalog

**Required APIs:**
```
GET /rewards/info
GET /rewards/catalog
GET /user/rewards (cần auth)
GET /user/points (cần auth)
```

---

### 13. Services Page - `services/page.tsx`
**URL:** `/services`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES (Optional)

**Features:**
- Spa development services
- Consultation booking

**Required APIs:**
```
GET /services/list
POST /services/consultation
```

---

### 14. Shipping Page - `shipping/page.tsx`
**URL:** `/shipping`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ❌ NO (Static Content)

**Features:**
- Shipping policies
- Return policies
- Shipping rates

---

### 15. Spa Development Page - `spa-development/page.tsx`
**URL:** `/spa-development`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES (Optional)

**Features:**
- Spa setup services
- Equipment recommendations

**Required APIs:**
```
GET /spa-development/packages
POST /spa-development/inquire
```

---

### 16. Terms Page - `terms/page.tsx`
**URL:** `/terms`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ❌ NO (Static Content)

**Features:**
- Terms & conditions
- Legal information

---

---

## 🛒 NHÓM SHOP PAGES `app/(shop)/`

### 17. Products List Page - `products/page.tsx` ⭐ CRITICAL
**URL:** `/products`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Product grid with pagination
- Advanced filters (Category, Brand, Price, Availability, Special Offers)
- Sort options (Featured, Newest, Price, Name, Rating)
- Search functionality
- Mobile responsive filters

**Required APIs:**
```
GET /products
Query Parameters:
- page: number
- limit: number (default 24)
- sort: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating'
- category: string
- brand: string
- minPrice: number
- maxPrice: number
- inStock: boolean
- onSale: boolean
- featured: boolean
- search: string

Response:
- products: Product[]
- pagination: { page, limit, total, totalPages }
- filters: { categories, brands, priceRanges }
```

---

### 18. Product Detail Page - `products/[slug]/page.tsx` ⭐ CRITICAL
**URL:** `/products/:slug`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Image gallery với thumbnails
- Product info, price, SKU
- Variant selection (colors, sizes)
- Quantity selector
- Add to cart button
- Add to wishlist
- Tabs: Details, Reviews
- Related products

**Required APIs:**
```
GET /products/:slug
GET /products/:productId/related
GET /products/:productId/reviews
POST /products/:productId/reviews (cần auth)
POST /cart/add
POST /user/wishlist/add (cần auth)
```

---

### 19. Category Page - `categories/[slug]/page.tsx` ⭐ IMPORTANT
**URL:** `/categories/:slug`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Filter products by category
- Same filters as products page
- Breadcrumb navigation

**Required APIs:**
```
GET /categories/:slug/products
(với same query params như products page)
```

---

### 20. Brands List Page - `brands/page.tsx` ⭐ IMPORTANT
**URL:** `/brands`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Grid hiển thị tất cả brands
- Category filter
- Brand card với logo, description, product count

**Required APIs:**
```
GET /brands
GET /brands?category=:category
```

---

### 21. Brand Detail Page - `brands/[slug]/page.tsx`
**URL:** `/brands/:slug`  
**Status:** ⏳ Pending  
**Backend Required:** ⏳ YES

**Features:**
- Brand information
- Products của brand
- Filters

**Required APIs:**
```
GET /brands/:slug
GET /brands/:slug/products
```

---

### 22. Cart Page - `cart/page.tsx` ⭐ CRITICAL
**URL:** `/cart`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- View cart items
- Update quantities
- Remove items
- Apply promo codes
- Order summary

**Required APIs:**
```
GET /cart
POST /cart/add
PUT /cart/update
DELETE /cart/remove
POST /cart/promo
DELETE /cart/clear
```

---

### 23. Checkout Page - `checkout/page.tsx` ⭐ CRITICAL
**URL:** `/checkout`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Contact information form
- Shipping address form
- Shipping method selection
- Payment information (card details)
- Billing address
- Order review

**Required APIs:**
```
GET /orders/shipping-methods
POST /orders
POST /orders/:orderId/payment
POST /user/addresses (save address)
```

---

### 24. Checkout Success Page - `checkout/success/page.tsx`
**URL:** `/checkout/success`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Order confirmation
- Order details
- Email confirmation notice
- Tracking information

**Required APIs:**
```
GET /orders/:orderId
POST /orders/:orderId/send-confirmation
```

---

### 25. Deals Page - `deals/page.tsx`
**URL:** `/deals`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Special deals & offers
- Flash sales
- Promotional banners
- Newsletter signup
- Deal categories

**Required APIs:**
```
GET /deals
GET /deals/categories
POST /newsletter/subscribe
```

---

### 26. Equipment Page - `equipment/page.tsx`
**URL:** `/equipment`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Equipment categories
- Featured equipment
- Equipment by type
- Benefits section

**Required APIs:**
```
GET /products?category=equipment
GET /categories/equipment
```

---

### 27. Outlet Page - `outlet/page.tsx`
**URL:** `/outlet`  
**Status:** ⏳ Pending  
**Backend Required:** ⏳ YES

**Features:**
- Clearance items
- Discounted products
- Overstock deals

**Required APIs:**
```
GET /outlet/products
GET /products?outlet=true
```

---

---

## 👤 NHÓM ACCOUNT PAGES `app/(account)/`

### 28. Account Dashboard - `account/page.tsx` ⭐ IMPORTANT
**URL:** `/account`  
**Status:** ✅ Frontend Complete  
**Backend Required:** ⏳ YES

**Features:**
- Recent orders
- Account details
- Quick stats

**Required APIs:**
```
GET /user/profile (cần auth)
GET /orders?limit=5 (cần auth)
```

---

## 🔐 AUTHENTICATION PAGES (Cần thêm)

### 29. Login Page
**URL:** `/login`  
**Status:** ❌ Not Implemented  
**Backend Required:** ⏳ YES

**Required APIs:**
```
POST /auth/login
POST /auth/refresh
GET /auth/me
```

---

### 30. Register Page
**URL:** `/register`  
**Status:** ❌ Not Implemented  
**Backend Required:** ⏳ YES

**Required APIs:**
```
POST /auth/register
POST /auth/verify-email
```

---

### 31. Forgot Password Page
**URL:** `/forgot-password`  
**Status:** ❌ Not Implemented  
**Backend Required:** ⏳ YES

**Required APIs:**
```
POST /auth/forgot-password
POST /auth/reset-password
```

---

## 📊 TÓM TẮT THEO ĐỘ QUAN TRỌNG

### ⭐ CRITICAL (Must Have)
1. Homepage
2. Products List
3. Product Detail
4. Cart
5. Checkout
6. Category Page

### ⭐ IMPORTANT (Should Have)
7. Brands List
8. Account Dashboard
9. Login/Register Pages

### ⏳ NICE TO HAVE (Optional)
10. Deals Page
11. Equipment Page
12. Learning/Careers/Partnerships
13. Contact Form
14. Newsletter
15. FAQs

### ❌ STATIC (No Backend)
16. About, Terms, Privacy, Shipping

---

## 🎯 IMPLEMENTATION PRIORITY

### Phase 1: Core E-commerce (Week 1-2)
- ✅ Authentication (Login/Register)
- ✅ Product Listing & Detail
- ✅ Shopping Cart
- ✅ Checkout Flow
- ✅ Orders Management

### Phase 2: Enhanced Shopping (Week 3-4)
- ✅ Categories & Brands
- ✅ Search & Filters
- ✅ User Profile
- ✅ Addresses Management
- ✅ Order Tracking

### Phase 3: Content & Features (Week 5-6)
- ✅ Homepage Content
- ✅ Reviews & Ratings
- ✅ Wishlist
- ✅ Newsletter
- ✅ Promo Codes

### Phase 4: Advanced Features (Week 7-8)
- ✅ Learning/Certifications
- ✅ Rewards Program
- ✅ Admin Dashboard (nếu cần)
- ✅ Analytics Integration

---

## 📝 STATISTICS

**Total Pages:** 31+  
**Critical Pages:** 6  
**Important Pages:** 9  
**Static Pages:** 4  
**Pending Implementation:** 5  
**Backend Required:** ~25 APIs + Authentication

---

**Last Updated:** December 2024  
**Status:** Frontend 90% Complete | Backend 0% Complete  
**Next Steps:** Implement Backend APIs theo priority


