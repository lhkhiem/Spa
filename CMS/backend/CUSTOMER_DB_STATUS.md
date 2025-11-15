# 📊 Customer Ecommerce Database Status

## ✅ Database đã sẵn sàng!

### 📋 Required Tables

| Table | Status | Description |
|-------|--------|-------------|
| `users` | ✅ EXISTS | Customer accounts |
| `addresses` | ✅ EXISTS | Customer shipping/billing addresses |
| `orders` | ✅ EXISTS | Customer orders |
| `order_items` | ✅ EXISTS | Order line items |
| `cart_items` | ✅ EXISTS | Shopping cart items |
| `wishlist_items` | ✅ EXISTS | Customer wishlist |
| `products` | ✅ EXISTS | Products catalog |

### 👤 Users Table Structure

**Required Columns:**
- ✅ `id` (UUID, Primary Key)
- ✅ `email` (VARCHAR, Unique)
- ✅ `password_hash` (VARCHAR)
- ✅ `name` (VARCHAR)
- ✅ `role` (VARCHAR) - Supports 'customer' role
- ✅ `status` (VARCHAR) - 'active'/'inactive'

**Customer Profile Columns:**
- ✅ `first_name` (VARCHAR) - Added in migration 034
- ✅ `last_name` (VARCHAR) - Added in migration 034
- ✅ `phone` (VARCHAR) - Added in migration 034
- ✅ `avatar` (VARCHAR) - Added in migration 034

### 📍 Addresses Table Structure

**Columns:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users.id)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `company` (VARCHAR, Optional)
- `address_line1` (VARCHAR)
- `address_line2` (VARCHAR, Optional)
- `city` (VARCHAR)
- `state` (VARCHAR)
- `postal_code` (VARCHAR)
- `country` (VARCHAR, Default: 'United States')
- `phone` (VARCHAR, Optional)
- `is_default` (BOOLEAN, Default: false)
- `type` (VARCHAR, Default: 'both') - 'shipping' | 'billing' | 'both'
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_addresses_user_id` - Fast lookup by user
- `idx_addresses_is_default` - Fast lookup of default addresses
- `idx_addresses_type` - Fast lookup by address type

### 🛒 Cart Items Table

- Supports both authenticated users (`user_id`) and guest users (`session_id`)
- Stores product snapshots with `snapshot_price`
- Indexed for performance

### 📦 Orders Table

- Stores customer information (id, email, name)
- Addresses stored as JSONB (shipping_address, billing_address)
- Full financial breakdown (subtotal, tax, shipping, discount, total)
- Payment and shipping tracking
- Status management (pending, processing, shipped, delivered, cancelled)

### ❤️ Wishlist Items Table

- One product per user (UNIQUE constraint)
- Indexed for fast lookups

## 🔄 Migrations Applied

1. ✅ `033_customer_addresses.sql` - Created addresses table
2. ✅ `034_add_customer_fields_to_users.sql` - Added customer profile fields to users table

## 🎯 API Endpoints Ready

All backend APIs are ready for customer ecommerce:

- ✅ `/api/public/auth/*` - Authentication (register, login, refresh, logout)
- ✅ `/api/public/user/*` - Profile, addresses, wishlist
- ✅ `/api/public/orders/*` - Order management
- ✅ `/api/public/cart/*` - Shopping cart
- ✅ `/api/public/products` - Products catalog
- ✅ `/api/public/posts` - Blog posts
- ✅ `/api/public/homepage` - Homepage content

## ✨ Next Steps

Database is fully ready! Frontend ecommerce can now:
1. Register and authenticate customers
2. Manage customer profiles and addresses
3. Add products to cart (guest and authenticated)
4. Create and track orders
5. Manage wishlist

---

*Last Updated: 2025-01-31*

