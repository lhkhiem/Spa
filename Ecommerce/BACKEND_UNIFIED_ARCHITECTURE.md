# 🏗️ KIẾN TRÚC BACKEND THỐNG NHẤT: CRUD + API FRONTEND

## 🎯 MỤC TIÊU

Backend **DUY NHẤT** vừa xử lý:
1. ✅ **CRUD Operations** (Admin Panel) - Quản lý nội dung, sản phẩm, bài viết
2. ✅ **API Endpoints** (Frontend) - Customer account, orders, cart, authentication

**KHÔNG CẦN** tạo thêm backend riêng!

---

## 📋 KIẾN TRÚC HIỆN TẠI

### Backend: CMS Backend (Node/Express hoặc Strapi)

**Base URL:** `NEXT_PUBLIC_API_URL` (ví dụ: `http://localhost:5000/api`)

**Cấu trúc:**
```
backend/
├── src/
│   ├── controllers/
│   │   ├── public/          # Public API (Frontend)
│   │   │   ├── homepageController.ts
│   │   │   ├── postController.ts
│   │   │   ├── productController.ts
│   │   │   └── ...
│   │   └── admin/           # Admin CRUD (Admin Panel)
│   │       ├── productController.ts
│   │       ├── categoryController.ts
│   │       └── ...
│   ├── models/              # Database models
│   ├── routes/
│   │   ├── public/          # Public routes
│   │   └── admin/           # Admin routes
│   └── middleware/
│       ├── auth.ts          # JWT authentication
│       └── adminAuth.ts     # Admin authentication
```

---

## 🔄 MỞ RỘNG BACKEND

### 1. **Thêm Customer Account APIs**

#### Authentication Routes
```typescript
// routes/public/auth.ts
POST   /api/public/auth/login           - Customer login
POST   /api/public/auth/register        - Customer register
POST   /api/public/auth/logout          - Customer logout
POST   /api/public/auth/refresh         - Refresh token
GET    /api/public/auth/me              - Get current user
POST   /api/public/auth/forgot-password - Forgot password
POST   /api/public/auth/reset-password  - Reset password
```

#### User Profile Routes
```typescript
// routes/public/user.ts
GET    /api/public/user/profile         - Get profile
PUT    /api/public/user/profile         - Update profile
GET    /api/public/user/addresses       - Get addresses
POST   /api/public/user/addresses       - Add address
PUT    /api/public/user/addresses/:id   - Update address
DELETE /api/public/user/addresses/:id   - Delete address
GET    /api/public/user/wishlist        - Get wishlist
POST   /api/public/user/wishlist/add    - Add to wishlist
DELETE /api/public/user/wishlist/:id    - Remove from wishlist
```

#### Order Routes
```typescript
// routes/public/orders.ts
GET    /api/public/orders               - Get orders
GET    /api/public/orders/:id           - Get order detail
POST   /api/public/orders               - Create order
POST   /api/public/orders/:id/cancel    - Cancel order
```

#### Cart Routes
```typescript
// routes/public/cart.ts
GET    /api/public/cart                 - Get cart
POST   /api/public/cart/add             - Add to cart
PUT    /api/public/cart/update          - Update cart
DELETE /api/public/cart/remove/:id      - Remove from cart
DELETE /api/public/cart/clear           - Clear cart
POST   /api/public/cart/promo           - Apply promo code
```

---

### 2. **Database Schema**

#### Users Table (Customer Accounts)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(500),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Addresses Table
```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(255),
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  type VARCHAR(20) DEFAULT 'both' CHECK (type IN ('shipping', 'billing', 'both')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_is_default ON addresses(is_default);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  shipping_address_id UUID REFERENCES addresses(id),
  billing_address_id UUID REFERENCES addresses(id),
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

#### Cart Table
```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- For guest users
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, session_id)
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
```

#### Cart Items Table
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
```

#### Wishlist Table
```sql
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);
```

---

### 3. **Authentication Middleware**

#### JWT Authentication (Customer)
```typescript
// middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

#### Admin Authentication
```typescript
// middleware/adminAuth.ts
import { AuthRequest } from './auth';

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
```

---

### 4. **Controllers**

#### Auth Controller
```typescript
// controllers/public/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password_hash,
      first_name: firstName,
      last_name: lastName,
      phone,
      role: 'customer',
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

---

### 5. **Routes**

#### Public Routes (Frontend)
```typescript
// routes/public/index.ts
import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import * as authController from '../../controllers/public/authController';
import * as userController from '../../controllers/public/userController';
import * as orderController from '../../controllers/public/orderController';
import * as cartController from '../../controllers/public/cartController';

const router = Router();

// Auth routes (no auth required)
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

// Auth routes (auth required)
router.get('/auth/me', authenticate, authController.me);
router.post('/auth/logout', authenticate, authController.logout);

// User routes (auth required)
router.get('/user/profile', authenticate, userController.getProfile);
router.put('/user/profile', authenticate, userController.updateProfile);
router.get('/user/addresses', authenticate, userController.getAddresses);
router.post('/user/addresses', authenticate, userController.addAddress);
router.put('/user/addresses/:id', authenticate, userController.updateAddress);
router.delete('/user/addresses/:id', authenticate, userController.deleteAddress);
router.get('/user/wishlist', authenticate, userController.getWishlist);
router.post('/user/wishlist/add', authenticate, userController.addToWishlist);
router.delete('/user/wishlist/:id', authenticate, userController.removeFromWishlist);

// Order routes (auth required)
router.get('/orders', authenticate, orderController.getOrders);
router.get('/orders/:id', authenticate, orderController.getOrder);
router.post('/orders', authenticate, orderController.createOrder);
router.post('/orders/:id/cancel', authenticate, orderController.cancelOrder);

// Cart routes (auth optional - support guest)
router.get('/cart', authenticate, cartController.getCart);
router.post('/cart/add', authenticate, cartController.addToCart);
router.put('/cart/update', authenticate, cartController.updateCart);
router.delete('/cart/remove/:id', authenticate, cartController.removeFromCart);
router.delete('/cart/clear', authenticate, cartController.clearCart);
router.post('/cart/promo', authenticate, cartController.applyPromo);

export default router;
```

#### Admin Routes (Admin Panel)
```typescript
// routes/admin/index.ts
import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/adminAuth';
import * as productController from '../../controllers/admin/productController';
import * as orderController from '../../controllers/admin/orderController';
import * as userController from '../../controllers/admin/userController';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Product CRUD
router.get('/products', productController.list);
router.get('/products/:id', productController.get);
router.post('/products', productController.create);
router.put('/products/:id', productController.update);
router.delete('/products/:id', productController.delete);

// Order management
router.get('/orders', orderController.list);
router.get('/orders/:id', orderController.get);
router.put('/orders/:id', orderController.update);
router.put('/orders/:id/status', orderController.updateStatus);

// User management
router.get('/users', userController.list);
router.get('/users/:id', userController.get);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

export default router;
```

---

### 6. **App Setup**

```typescript
// app.ts
import express from 'express';
import cors from 'cors';
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';

const app = express();

app.use(cors());
app.use(express.json());

// Public API routes (Frontend)
app.use('/api/public', publicRoutes);

// Admin API routes (Admin Panel)
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 🎯 KẾT QUẢ

### ✅ Backend DUY NHẤT xử lý:

1. **CRUD Operations (Admin Panel)**
   - `/api/admin/products` - CRUD sản phẩm
   - `/api/admin/orders` - Quản lý đơn hàng
   - `/api/admin/users` - Quản lý users
   - `/api/admin/posts` - CRUD bài viết
   - `/api/admin/categories` - CRUD danh mục

2. **API Endpoints (Frontend)**
   - `/api/public/auth/*` - Authentication
   - `/api/public/user/*` - User profile, addresses, wishlist
   - `/api/public/orders/*` - Orders
   - `/api/public/cart/*` - Shopping cart
   - `/api/public/products` - Products (public)
   - `/api/public/posts` - Posts (public)

---

## 📝 ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret

# Server
PORT=5000
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🔐 AUTHENTICATION FLOW

### Customer Authentication
1. Customer đăng nhập → `/api/public/auth/login`
2. Backend trả về `accessToken` + `refreshToken`
3. Frontend lưu tokens vào localStorage
4. Frontend gửi `accessToken` trong header: `Authorization: Bearer {token}`
5. Khi token hết hạn → Frontend gọi `/api/public/auth/refresh`
6. Backend trả về `accessToken` mới

### Admin Authentication
1. Admin đăng nhập → `/api/admin/auth/login` (hoặc CMS admin panel)
2. Backend trả về admin token
3. Admin panel sử dụng token để CRUD

---

## ✅ LỢI ÍCH

1. ✅ **Backend duy nhất** - Dễ maintain, không cần sync data
2. ✅ **Database chung** - Users, orders, products trong 1 database
3. ✅ **Authentication thống nhất** - JWT cho cả customer và admin
4. ✅ **API rõ ràng** - `/api/public/*` cho frontend, `/api/admin/*` cho admin
5. ✅ **Dễ mở rộng** - Thêm endpoints mới dễ dàng

---

## 🎯 NEXT STEPS

1. ✅ Tạo database tables (users, addresses, orders, cart, wishlist)
2. ✅ Tạo models (User, Address, Order, Cart, Wishlist)
3. ✅ Tạo controllers (auth, user, order, cart)
4. ✅ Tạo routes (public, admin)
5. ✅ Tạo middleware (auth, adminAuth)
6. ✅ Test API endpoints
7. ✅ Integrate với frontend

---

*Last Updated: 2025-01-31*

