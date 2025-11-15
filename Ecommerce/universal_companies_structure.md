# 🧩 Universal Companies – Website Structure & Features Overview

## 1. Global Layout
### Header
- Logo “Universal Companies” (link về trang chủ)
- Menu chính (multi-level dropdown): Implements & Supplies, Products, Equipment, Modalities, Brands, Save Now!
- Search bar (auto-suggest)
- Account menu (Login / My Account)
- Cart icon (floating mini-cart dropdown)
- Top banner: “Free shipping on $749+ | $4.99 shipping on $199+”

### Footer
- Customer Support: Contact, Shipping & Return, Good Karma Rewards
- Spa Business Resources: Learning, Spa Development, School Partnerships
- Company Information: About Us, Careers
- Shopping & Offers: Browse Catalogs, UCo Outlet, Financing
- Newsletter Signup + Social Media Icons (Instagram, Facebook, YouTube, TikTok, LinkedIn, Pinterest)
- Footer line: “© 2025 Universal Companies – Privacy Policy – Terms of Service”

---

## 2. Homepage
- Hero banner slider: hình ảnh sản phẩm spa, CTA như *Shop Now*, *Learn More*
- Feature sections:
  - “Shop Categories” (grid 3×3: Skin Care, Lash & Brow, Massage, Waxing, v.v.)
  - “Shop Popular Spa & Salon Brands” (carousel logos)
  - “Best Sellers” (product cards, rating stars, Add to Cart)
  - “The Spa Industry’s Top Distributor” (testimonial)
  - “Educational Resources” (2-column layout, CTA Browse Courses)

---

## 3. Category Pages (Waxing / Makeup)
- Header banner với CTA “Credit Key – Buy now, pay later”
- Subcategories (grid 2–3 cột): Waxing Products, Equipment, Education Resources
- Product listing grid
- Filter sidebar (checkboxes): Cruelty-Free, Vegan, Paraben-Free, v.v.
- Education section: liên kết đến e-learning portal

---

## 4. Product Listing Page (PLP)
- 3-column responsive grid
- Sidebar filters: Category, Brand, Type, Texture, Price Range, Tags
- Product cards: hình ảnh, tên, giá, rating, Add to Cart, Wishlist
- Pagination cuối trang

---

## 5. Product Detail Page (PDP)
- Hero area: gallery, tên sản phẩm, SKU, rating, giá, selector, Add to Cart
- Tabs: Description, Features, Special Instructions, Documents, Reviews/Q&A
- Cross-sell carousel “You Might Also Like”
- Customer Reviews: rating trung bình, filter, verified buyers

---

## 6. Shopping Cart Page
- Bảng sản phẩm: thumbnail, tên, SKU, quantity, price, total
- Shipping calculator + Checkout button
- Promo Credit Key
- Summary: “$199 Order = $4.99 Shipping | $749 Order = FREE Shipping”

---

## 7. About Us Page
- Hero: “Our business is good when your business is better.”
- Founder portraits
- “UCo Difference”: Full solutions provider, Label review, Education, Professionals
- “Giving Back”: Cancer research, Community care, Animal welfare
- Timeline (1982–Now)
- Newsletter CTA

---

## 8. UI Design System
- **Primary Colors:** Navy Blue (#003E5B), White, Light Gray
- **Accent Colors:** Lavender / Pink gradients
- **Typography:** Headings bold sans-serif; Body geometric sans
- **Components:** Buttons (rounded), Cards (shadow, hover scale), Icons (minimalist)

---

## 9. Functional Modules
| Module | Description | Integration |
|--------|-------------|--------------|
| Search Autocomplete | Gợi ý sản phẩm realtime | Algolia / ElasticSearch |
| Cart System | Thêm/xóa/cập nhật giỏ hàng | Redux / React Context |
| Filter Sidebar | Lọc nhiều điều kiện | Dynamic URL params |
| Product Reviews | Form đánh giá | MongoDB subdocument |
| Newsletter Signup | Thu email khách hàng | Mailchimp API |
| Rewards System | “Good Karma Rewards” | Placeholder API |
| E-learning | Free course portal | Embed / Redirect |
| Credit Key | Mua trước trả sau | Third-party widget |

---

## 10. Suggested Missing Screens
| Screen | Purpose | Design Direction |
|--------|----------|------------------|
| Login/Register | Đăng nhập người dùng | Form tối giản, floating label |
| Order History | Lịch sử đơn hàng | Table + filter |
| Wishlist | Danh sách sản phẩm yêu thích | Masonry grid |
| Blog / Learning Hub | Kiến thức Spa | Card layout |
| Contact Page | Hỗ trợ khách hàng | Map + Form liên hệ |

---

## 11. Frontend Tech Stack
- **Framework:** ReactJS / Next.js (SEO-friendly)
- **UI Library:** TailwindCSS / ChakraUI
- **State Management:** Redux Toolkit / Zustand
- **API Layer:** REST / GraphQL
- **Animation:** Framer Motion
- **Accessibility:** ARIA roles + Semantic HTML5
