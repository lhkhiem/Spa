# 📚 MODELS DOCUMENTATION - HƯỚNG DẪN SỬ DỤNG

## ⚠️ QUAN TRỌNG

**All CLIENT models đã được tạo trong cms-pressup backend!**

**Location:** `D:\PROJECT\StudyProject\CMS\cms-pressup\`

---

## 📂 WHERE TO FIND CLIENT MODELS

### Backend Location
```
D:\PROJECT\StudyProject\CMS\cms-pressup\
├── backend/
│   ├── src/
│   │   ├── migrations/
│   │   │   └── 008_ecommerce_client_models.sql ⭐ RUN THIS FIRST
│   │   └── models/
│   │       ├── Address.ts ⭐ CLIENT
│   │       ├── Cart.ts ⭐ CLIENT
│   │       ├── ProductVariant.ts ⭐ CLIENT
│   │       ├── ProductTag.ts ⭐ CLIENT
│   │       ├── ProductReview.ts ⭐ CLIENT
│   │       ├── ProductDocument.ts ⭐ CLIENT
│   │       ├── ShippingMethod.ts ⭐ CLIENT
│   │       ├── PaymentMethod.ts ⭐ CLIENT
│   │       ├── PromoCode.ts ⭐ CLIENT
│   │       ├── Order.ts ⭐ CLIENT
│   │       ├── Wishlist.ts ⭐ CLIENT
│   │       ├── NewsletterSubscription.ts ⭐ CLIENT
│   │       └── HomepageContent.ts ⭐ CLIENT
│   └── docs/
│       └── CLIENT_MODELS.md ⭐
├── MODEL_CLASSIFICATION.md ⭐
├── MODELS_SUMMARY.md ⭐
├── GHI_CHU_MODELS_CLIENT.md ⭐
└── IMPLEMENTATION_GUIDE.md ⭐
```

---

## 🎯 CÁC MODELS ĐÃ TẠO

### 13 CLIENT Models (All Marked ⭐)

| # | Model | File | Purpose | Table |
|---|-------|------|---------|-------|
| 1 | Address | Address.ts | Shipping/billing addresses | addresses |
| 2 | Cart | Cart.ts | Shopping cart | carts, cart_items |
| 3 | ProductVariant | ProductVariant.ts | Variants (color, size) | product_variants |
| 4 | ProductTag | ProductTag.ts | Tags for search | product_tags |
| 5 | ProductReview | ProductReview.ts | Customer reviews | product_reviews |
| 6 | ProductDocument | ProductDocument.ts | Product docs | product_documents |
| 7 | ShippingMethod | ShippingMethod.ts | Shipping options | shipping_methods |
| 8 | PaymentMethod | PaymentMethod.ts | Payment options | payment_methods |
| 9 | PromoCode | PromoCode.ts | Discount codes | promo_codes |
| 10 | Order | Order.ts | Customer orders | orders, order_items |
| 11 | Wishlist | Wishlist.ts | Wishlist items | wishlists |
| 12 | NewsletterSubscription | NewsletterSubscription.ts | Newsletter signups | newsletter_subscriptions |
| 13 | HomepageContent | HomepageContent.ts | Homepage CMS | 3 tables |

**Tất cả đã được đánh dấu rõ ràng là CLIENT MODEL trong comments!**

---

## 🚀 CÁCH SỬ DỤNG

### Step 1: Run Migration

```bash
# Go to cms-pressup backend
cd D:\PROJECT\StudyProject\CMS\cms-pressup\backend

# Run migrations
npm run migrate
```

This will create all 20+ CLIENT tables in database.

---

### Step 2: Verify Tables

```sql
-- Check CLIENT tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'addresses', 
  'carts', 
  'cart_items', 
  'product_variants',
  'orders',
  'order_items',
  'wishlists',
  'product_reviews',
  'shipping_methods',
  'payment_methods',
  'promo_codes',
  'newsletter_subscriptions',
  'homepage_hero_sliders'
);
```

---

### Step 3: Use in Backend Code

```typescript
import { Cart, CartItem } from './models/Cart';
import { Order, OrderItem } from './models/Order';
import { Address } from './models/Address';

// Use in controllers
export const getCart = async (cartId: string) => {
  const result = await db.query(
    'SELECT * FROM carts WHERE id = $1',
    [cartId]
  );
  return result.rows[0] as Cart;
};
```

---

## 📋 TÀI LIỆU ĐỌC

### Start Here ⭐
1. **GHI_CHU_MODELS_CLIENT.md** - Danh sách đầy đủ + descriptions
2. **CLIENT_MODELS.md** - Technical documentation
3. **IMPLEMENTATION_GUIDE.md** - How to implement

### Reference
1. **MODEL_CLASSIFICATION.md** - CMS vs CLIENT
2. **MODELS_SUMMARY.md** - Complete summary
3. **BACKEND_INTEGRATION_ANALYSIS.md** - API specs

---

## ✅ STATUS

**Database Models:** ✅ Complete  
**TypeScript Models:** ✅ Complete  
**Documentation:** ✅ Complete  
**CLIENT Marking:** ✅ Complete  

**Ready for:** Backend Implementation

---

## 📞 QUESTIONS?

Check:
1. GHI_CHU_MODELS_CLIENT.md for quick reference
2. CLIENT_MODELS.md for technical details
3. IMPLEMENTATION_GUIDE.md for examples

---

**All CLIENT models clearly marked with ⭐**

