# Menu Structure với 3 Levels

## 📊 Cấu trúc Menu Mới

Migration đã được update với sample data cho **đầy đủ 3 levels**:

### Level 1 (Root Items)
```
├─ Home
├─ Products ⬇️
├─ Blog
├─ About
└─ Contact
```

### Level 2 (Sub-menus)
```
Products ⬇️
├─ Electronics ⬇️
├─ Clothing ⬇️
├─ Home & Garden
└─ Sale
```

### Level 3 (Sub-sub-menus)
```
Electronics ⬇️
├─ Phones
├─ Laptops
├─ Tablets
└─ Accessories

Clothing ⬇️
├─ Men
├─ Women
└─ Kids
```

## 🌳 Complete Tree View

```
Header Menu
│
├─ Home (L1)
│
├─ Products (L1)
│  ├─ Electronics (L2)
│  │  ├─ Phones (L3)
│  │  ├─ Laptops (L3)
│  │  ├─ Tablets (L3)
│  │  └─ Accessories (L3)
│  │
│  ├─ Clothing (L2)
│  │  ├─ Men (L3)
│  │  ├─ Women (L3)
│  │  └─ Kids (L3)
│  │
│  ├─ Home & Garden (L2)
│  └─ Sale (L2)
│
├─ Blog (L1)
├─ About (L1)
└─ Contact (L1)
```

## 🎯 URL Structure

### Level 1
- `/` - Home
- `/products` - Products
- `/blog` - Blog
- `/about` - About
- `/contact` - Contact

### Level 2
- `/products/electronics` - Electronics
- `/products/clothing` - Clothing
- `/products/home-garden` - Home & Garden
- `/products/sale` - Sale

### Level 3
**Electronics:**
- `/products/electronics/phones` - Phones
- `/products/electronics/laptops` - Laptops
- `/products/electronics/tablets` - Tablets
- `/products/electronics/accessories` - Accessories

**Clothing:**
- `/products/clothing/men` - Men
- `/products/clothing/women` - Women
- `/products/clothing/kids` - Kids

## 📝 Item Types

- **Level 1**: All `custom` type
- **Level 2**: Mix of `category` and `custom`
  - Electronics: `category`
  - Clothing: `category`
  - Home & Garden: `category`
  - Sale: `custom` (special page)
- **Level 3**: All `category` type

## 🚀 Chạy Migration

### Option 1: Sử dụng Script
```bash
cd backend
node run-migration.js
```

### Option 2: Direct SQL (pgAdmin hoặc psql)
```bash
psql -U postgres -d spa_cms_db -f src/migrations/010_menu_system.sql
```

### Option 3: Qua Backend API (nếu có migrate endpoint)
```bash
curl -X POST http://localhost:3011/api/migrate
```

## ✅ Verification

Sau khi chạy migration, kiểm tra:

1. **Via Admin UI:**
   - Vào `http://localhost:3013/dashboard/menus`
   - Click "Edit Items" trên "Header Menu"
   - Kiểm tra có đầy đủ items với badges:
     - Level 2 badges (màu xanh)
     - Level 3 badges (màu tím)
   - Kiểm tra indentation đúng

2. **Via Database:**
```sql
SELECT 
  mi.title,
  ml.name as location,
  p1.title as level1_parent,
  p2.title as level2_parent
FROM menu_items mi
LEFT JOIN menu_locations ml ON mi.menu_location_id = ml.id
LEFT JOIN menu_items p1 ON mi.parent_id = p1.id
LEFT JOIN menu_items p2 ON p1.parent_id = p2.id
WHERE ml.slug = 'header'
ORDER BY mi.sort_order;
```

3. **Via API:**
```bash
curl http://localhost:3011/api/menu-items?location_id=<header_id>
```

## 🎨 UI Features để Test

### 1. Visual Indicators
- [x] Level 2 items có badge màu xanh "Level 2"
- [x] Level 3 items có badge màu tím "Level 3"
- [x] Indentation: L2 thụt 32px, L3 thụt 64px

### 2. Move Functionality
- [x] Move L3 → L1 (Phones → Top Level)
- [x] Move L3 → L2 (Phones → Clothing)
- [x] Move L2 → L3 (Electronics → Clothing/Men) - Should fail!
- [x] Move L1 → L3 (Blog → Electronics) 

### 3. Parent Dropdown
- [x] L3 items disabled (không thể làm parent)
- [x] Shows "(Max depth reached)"
- [x] Tree structure với └─ symbols

### 4. Validation
- [x] Try create L4 under "Phones" - Should show error
- [x] Try move item to create L4 - Should be disabled

## 📊 Expected Count

- **Total Items**: 19
  - Level 1: 5 items (Home, Products, Blog, About, Contact)
  - Level 2: 4 items (Electronics, Clothing, Home & Garden, Sale)
  - Level 3: 7 items (4 Electronics + 3 Clothing)

## 🔧 Troubleshooting

### Items không hiện
```sql
-- Check if migration ran
SELECT COUNT(*) FROM menu_items WHERE menu_location_id IN (
  SELECT id FROM menu_locations WHERE slug = 'header'
);
-- Should return 19
```

### Depth không đúng
```sql
-- Check parent relationships
SELECT 
  mi.title,
  CASE 
    WHEN mi.parent_id IS NULL THEN 1
    WHEN p1.parent_id IS NULL THEN 2
    ELSE 3
  END as depth
FROM menu_items mi
LEFT JOIN menu_items p1 ON mi.parent_id = p1.id
WHERE mi.menu_location_id IN (SELECT id FROM menu_locations WHERE slug = 'header')
ORDER BY depth, mi.sort_order;
```

### Re-run Migration
Nếu cần chạy lại từ đầu:
```sql
-- Delete all menu items and locations
DELETE FROM menu_items;
DELETE FROM menu_locations;

-- Then run migration again
```

## 💡 Next Steps

1. ✅ Chạy migration
2. ✅ Verify data trong database
3. ✅ Test UI với 3 levels
4. ✅ Test Move functionality
5. ✅ Test Create/Edit với depth validation
6. ✅ Build frontend menu component để hiển thị 3 levels

## 📚 Related Files

- Migration: `backend/src/migrations/010_menu_system.sql`
- Run Script: `backend/run-migration.js`
- Frontend: `frontend/admin/app/dashboard/menus/[id]/page.tsx`
- Documentation: 
  - `MENU_HIERARCHY_GUIDE.md`
  - `MENU_MOVE_FEATURE_GUIDE.md`






































