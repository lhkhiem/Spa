# 🎯 Menu Management System - Complete Guide

## 📚 Overview

Hệ thống quản lý menu hoàn chỉnh cho phép bạn tạo và quản lý navigation menus cho website với các tính năng:

- ✅ **Multiple Menu Locations**: Header, Footer, Top Bar, Mobile, v.v.
- ✅ **Drag & Drop Ordering**: Sắp xếp menu items bằng kéo thả
- ✅ **Nested Menus**: Menu đa cấp không giới hạn
- ✅ **Flexible Link Types**: Custom URLs, Categories, Products, Posts, Pages
- ✅ **Active/Inactive Control**: Bật/tắt menu locations và items
- ✅ **Target Control**: Open in same tab hoặc new tab

---

## 🗄️ Database Structure

### Tables Created

**`menu_locations`** - Các vị trí menu (header, footer, etc.)
- `id` (UUID)
- `name` (VARCHAR) - Display name
- `slug` (VARCHAR) - Unique identifier
- `description` (TEXT)
- `is_active` (BOOLEAN)

**`menu_items`** - Các menu items
- `id` (UUID)
- `menu_location_id` (UUID FK)
- `parent_id` (UUID FK) - For nested menus
- `title` (VARCHAR) - Display text
- `url` (VARCHAR) - Link URL
- `type` (VARCHAR) - 'custom', 'category', 'product', 'post', 'page'
- `entity_id` (UUID) - Reference to category/product/post
- `target` (VARCHAR) - '_self' or '_blank'
- `icon` (VARCHAR) - Optional icon
- `css_classes` (TEXT) - Custom CSS classes
- `sort_order` (INTEGER) - For ordering
- `is_active` (BOOLEAN)

### Sample Data

4 default menu locations được tạo sẵn:
- **Header Menu** (slug: `header`)
- **Footer Menu** (slug: `footer`)
- **Top Bar Menu** (slug: `top-bar`)
- **Mobile Menu** (slug: `mobile`)

---

## 🔌 Backend API Endpoints

### Menu Locations

```
GET    /api/menu-locations          # Get all locations
GET    /api/menu-locations/:id      # Get single location
POST   /api/menu-locations          # Create location
PUT    /api/menu-locations/:id      # Update location (full)
PATCH  /api/menu-locations/:id      # Update location (partial)
DELETE /api/menu-locations/:id      # Delete location
```

### Menu Items

```
GET    /api/menu-items?location_id=xxx  # Get items by location
GET    /api/menu-items/:id              # Get single item
POST   /api/menu-items                  # Create item
PUT    /api/menu-items/:id              # Update item (full)
PATCH  /api/menu-items/:id              # Update item (partial)
DELETE /api/menu-items/:id              # Delete item
POST   /api/menu-items/bulk/update-order # Bulk update order (drag & drop)
```

---

## 🎨 Admin UI Usage

### Access Menu Management

1. Đăng nhập vào Admin Dashboard
2. Vào **Appearance > Menus** trong sidebar
3. Bạn sẽ thấy danh sách các Menu Locations

### Manage Menu Locations

**Tạo Menu Location mới:**
1. Click "New Menu Location"
2. Nhập Name, Slug, Description
3. Save

**Edit Menu Items:**
1. Click "Edit Items" trên menu location card
2. Bạn sẽ vào Menu Editor

### Menu Editor - Drag & Drop

**Add Menu Item:**
1. Click "Add Item"
2. Fill in:
   - Title (bắt buộc)
   - URL (tùy chọn)
   - Type: custom, category, product, post
   - Target: _self hoặc _blank
   - Active/Inactive
3. Save

**Reorder Menu Items:**
1. Drag & drop items để sắp xếp
2. Click "Save Order" để lưu

**Edit/Delete:**
- Click icon Edit để chỉnh sửa
- Click icon Delete để xóa

---

## 🌐 Frontend Integration

### Usage Examples

#### Example 1: Header Menu (Horizontal)

```tsx
import { HorizontalMenu } from '@/components/Menu';

function Header() {
  return (
    <header>
      <HorizontalMenu location="header" className="main-nav" />
    </header>
  );
}
```

#### Example 2: Sidebar Menu (Vertical)

```tsx
import { Menu } from '@/components/Menu';

function Sidebar() {
  return (
    <aside>
      <Menu location="footer" className="sidebar-nav" />
    </aside>
  );
}
```

#### Example 3: Footer Menu

```tsx
import { HorizontalMenu } from '@/components/Menu';

function Footer() {
  return (
    <footer>
      <HorizontalMenu location="footer" />
    </footer>
  );
}
```

---

## 🎯 Menu Item Types

### 1. Custom URL

```json
{
  "title": "About Us",
  "url": "/about",
  "type": "custom",
  "target": "_self"
}
```

### 2. Category Link

```json
{
  "title": "Electronics",
  "type": "category",
  "entity_id": "category-uuid-here",
  "url": "/products/electronics"
}
```

### 3. Product Link

```json
{
  "title": "iPhone 15",
  "type": "product",
  "entity_id": "product-uuid-here",
  "url": "/products/iphone-15"
}
```

### 4. External Link

```json
{
  "title": "Our Blog",
  "url": "https://blog.example.com",
  "type": "custom",
  "target": "_blank"
}
```

---

## 🔧 Advanced Features

### Nested Menus (Dropdown)

Menu items có thể có `parent_id` để tạo menu con:

```
Products (parent)
├── Electronics (child of Products)
│   ├── Phones (child of Electronics)
│   └── Laptops
└── Fashion
    ├── Men
    └── Women
```

### Bulk Order Update

API endpoint đặc biệt cho drag & drop:

```typescript
POST /api/menu-items/bulk/update-order
Body: {
  items: [
    { id: "uuid1", sort_order: 0, parent_id: null },
    { id: "uuid2", sort_order: 1, parent_id: null },
    { id: "uuid3", sort_order: 0, parent_id: "uuid2" }
  ]
}
```

---

## 📝 Best Practices

### 1. Menu Location Naming

- Dùng slug dễ nhớ: `header`, `footer`, `mobile`
- Không dùng khoảng trắng trong slug
- Slug phải unique

### 2. Menu Organization

- Giữ menu ngắn gọn (5-7 items chính)
- Dùng nested menus cho sub-categories
- Sắp xếp theo mức độ quan trọng

### 3. Performance

- Menu được cache ở frontend
- Chỉ load active menus
- Filter inactive items

### 4. SEO

- Dùng descriptive titles
- Set proper rel attributes cho external links
- Avoid deep nesting (max 3 levels)

---

## 🚀 Getting Started

### Step 1: Check Database

Migration đã chạy thành công:
```bash
# Tables created:
# - menu_locations
# - menu_items
```

### Step 2: Access Admin

1. Go to http://localhost:3013/dashboard/menus
2. You should see 4 default menu locations
3. Click "Edit Items" on "Header Menu"

### Step 3: Add Menu Items

1. Click "Add Item"
2. Create menu items:
   - Home (/)
   - Products (/products)
   - Blog (/blog)
   - Contact (/contact)
3. Save Order

### Step 4: Use in Frontend

```tsx
// In your Header component
<HorizontalMenu location="header" />
```

---

## 🐛 Troubleshooting

### Menu không hiển thị

- ✅ Check `is_active` = true cho location
- ✅ Check `is_active` = true cho items
- ✅ Verify API endpoint returns data
- ✅ Check browser console for errors

### Drag & Drop không hoạt động

- ✅ Verify @dnd-kit packages installed
- ✅ Check browser console for errors
- ✅ Make sure items have unique IDs

### Order không save

- ✅ Check API response
- ✅ Verify auth token
- ✅ Check network tab for errors

---

## 📦 Files Created

### Backend

- `backend/src/migrations/010_menu_system.sql`
- `backend/src/models/MenuLocation.ts`
- `backend/src/models/MenuItem.ts`
- `backend/src/controllers/menuLocationController.ts`
- `backend/src/controllers/menuItemController.ts`
- `backend/src/routes/menuLocations.ts`
- `backend/src/routes/menuItems.ts`

### Frontend Admin

- `frontend/admin/app/dashboard/menus/page.tsx`
- `frontend/admin/app/dashboard/menus/[id]/page.tsx`

### Frontend Website

- `frontend/website-new/src/components/Menu.tsx`

---

## 🎉 Features Summary

✅ **Complete CRUD** for menu locations and items
✅ **Drag & Drop** reordering with @dnd-kit
✅ **Nested menus** with unlimited levels
✅ **Multiple menu locations** (header, footer, etc.)
✅ **Flexible link types** (custom, category, product, post)
✅ **Active/Inactive** control at both location and item level
✅ **Beautiful admin UI** with Tailwind CSS
✅ **RESTful API** with proper error handling
✅ **Frontend components** ready to use

---

## 📞 Support

Nếu có vấn đề, check:
1. Backend logs: `backend/` terminal
2. Frontend console: Browser DevTools
3. Database: `psql -U cms_user -d cms_db`
4. API endpoints: http://localhost:3011/api/menu-locations

Enjoy your new Menu Management System! 🚀






































