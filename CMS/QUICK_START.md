# 🚀 Quick Start Guide

## ✅ Services Running

Both backend and frontend services are now running!

### 🌐 Access URLs

- **Frontend Admin Panel:** http://localhost:3013
- **Backend API:** http://localhost:3011

### 📊 Port Information

| Service | Port | Status | PID |
|---------|------|--------|-----|
| Backend API | 3011 | ✅ Running | 23948 |
| Frontend Admin | 3013 | ✅ Running | 7876 |

## 🎯 Next Steps

### 1. Access Admin Panel
Open your browser and go to: **http://localhost:3013**

### 2. Login
- If you have an account, login with your credentials
- If not, you may need to register first

### 3. Explore Dashboard
Navigate through the admin panel:

#### **Content Management**
- 📝 Posts - Manage blog posts
- 📁 Topics - Content topics
- 🏷️ Tags - Content tags

#### **Products (E-Commerce)**
- 📦 All Products - Product catalog
- 📂 Categories - Product categories
- 🏷️ Brands - Product brands
- 📊 Inventory - Stock management

#### **E-Commerce Operations** (NEW!)
- 🧾 Orders - Manage orders
- ⭐ Reviews - Product reviews
- 🛒 Shopping Cart - Customer carts
- ❤️ Wishlists - Customer wishlists

#### **Media**
- 🖼️ Media Library - File management

#### **Appearance**
- 🍔 Menus - Navigation menus

#### **System**
- 👥 Users & Roles - User management
- 📜 Tracking Scripts - Analytics codes (NEW!)
- ⚙️ Settings - System settings

## 🛠️ Available Commands

### Backend
```bash
cd backend

# Development
npm run dev          # Run in development mode

# Production
npm run build        # Build TypeScript
npm start           # Run production server

# Database
npm run migrate      # Run migrations
npm run seed         # Seed sample data
npm run qa           # Quality assurance tests
```

### Frontend
```bash
cd frontend/admin

# Development
npm run dev          # Run in development mode (port 3013)

# Production
npm run build        # Build for production
npm start           # Run production server

# Linting
npm run lint         # Run ESLint
```

## 📚 API Endpoints

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Content
- `GET /api/posts` - List posts
- `GET /api/topics` - List topics
- `GET /api/tags` - List tags

### Products
- `GET /api/products` - List products
- `GET /api/product-categories` - List categories
- `GET /api/brands` - List brands

### E-Commerce
- `GET /api/orders` - List orders
- `GET /api/cart` - Shopping cart
- `GET /api/wishlist` - Wishlist
- `GET /api/reviews` - Product reviews

### Media
- `GET /api/assets` - List assets
- `GET /api/media` - Media library

### Navigation
- `GET /api/menu-locations` - Menu locations
- `GET /api/menu-items` - Menu items

### System
- `GET /api/tracking-scripts` - Tracking scripts
- `GET /api/settings` - System settings
- `GET /api/users` - User management

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password

# Server
PORT=3011
NODE_ENV=development

# Origins
ADMIN_ORIGIN=http://localhost:3013
WEBSITE_ORIGIN=http://localhost:3010

# Upload
UPLOAD_PATH=./storage/uploads

# JWT Secret (generate a secure random string)
JWT_SECRET=your_jwt_secret_here
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3011
```

## 🐛 Troubleshooting

### Backend Not Starting
1. Check if PostgreSQL is running
2. Verify database credentials in `.env`
3. Run migrations: `npm run migrate`
4. Check port 3011 is not in use

### Frontend Not Loading
1. Verify backend is running on port 3011
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Clear browser cache
4. Check port 3013 is not in use

### Database Issues
```bash
# Re-run migrations
cd backend
npm run migrate

# Seed sample data
npm run seed
```

### Port Conflicts
```bash
# Find process using port
netstat -ano | findstr :3011
netstat -ano | findstr :3013

# Kill process (Windows)
taskkill /PID <PID> /F
```

## 📖 Documentation

- **Frontend Models:** `frontend/admin/types/index.ts`
- **Backend Models:** `backend/src/models/`
- **Routes:** `backend/src/routes/`
- **Implementation Guide:** `FRONTEND_MODELS_IMPLEMENTATION.md`
- **Completeness Report:** `MODEL_COMPLETENESS_REPORT.md`

## 🎉 Features

### ✅ Implemented
- ✅ Full TypeScript type safety
- ✅ 21 backend models with frontend types
- ✅ 18 dashboard pages
- ✅ CRUD operations for all models
- ✅ Search & filtering
- ✅ Pagination
- ✅ Media management
- ✅ E-commerce functionality
- ✅ Order management
- ✅ Review management
- ✅ Tracking scripts management

### 🚧 Coming Soon
- ⚠️ Cart management page
- ⚠️ Wishlist management page
- ⚠️ Order detail view
- ⚠️ Advanced analytics
- ⚠️ Export functionality

## 💡 Tips

1. **First Time Setup:** Run `npm run migrate && npm run seed` to set up database
2. **Development:** Both services hot-reload on code changes
3. **Type Safety:** Use shared types from `frontend/admin/types/index.ts`
4. **API Testing:** Use Postman or similar to test endpoints
5. **Database:** Use pgAdmin or psql to inspect database

## 🔐 Default Accounts

If you seeded the database, you may have these accounts:
- Check your seed file for default credentials
- Or create a new account through registration

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review console logs for errors
3. Check network tab in browser DevTools
4. Review backend terminal output

---

**Happy Coding! 🎊**

