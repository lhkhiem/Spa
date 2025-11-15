# 🚀 Migration Guide - Next.js → Vite React

Hướng dẫn thay thế `frontend/website` (Next.js) bằng `frontend/website-new` (Vite + React).

## ✅ Đã Hoàn Thành

- ✅ Tạo Vite + React + TypeScript project
- ✅ Migrate 50+ UI components từ meatdeli_shop
- ✅ Setup Tailwind CSS v4
- ✅ Setup routing với Wouter
- ✅ Setup React Query cho data fetching
- ✅ Tạo API service layer (thay tRPC bằng Axios)
- ✅ Tạo Header & Footer components
- ✅ Tạo pages mẫu (Home, Blog, Blog Post, 404)
- ✅ Build thành công (no errors)

## 📦 What's Included

**UI Components (50+):**
- Tất cả Shadcn UI components từ meatdeli_shop
- Fully typed với TypeScript
- Accessible (Radix UI)
- Customizable với Tailwind

**Features:**
- 🌙 Dark mode support (ThemeContext)
- 📱 Responsive design
- 🎨 Modern UI với Tailwind CSS v4
- ⚡ Fast development với Vite HMR
- 🔄 React Query caching & refetching
- 🛣️ Client-side routing với Wouter

## 🔄 Steps to Replace

### Option 1: Rename (Recommended)

```powershell
# Stop Next.js dev server nếu đang chạy
cd D:\PROJECT\StudyProject\Cursor\cms-pressup\frontend

# Backup website cũ
Rename-Item -Path website -NewName website-nextjs-old

# Rename website-new → website
Rename-Item -Path website-new -NewName website
```

### Option 2: Delete Old & Rename

```powershell
cd D:\PROJECT\StudyProject\Cursor\cms-pressup\frontend

# Xóa website cũ (careful!)
Remove-Item -Path website -Recurse -Force

# Rename website-new → website
Rename-Item -Path website-new -NewName website
```

### Option 3: Keep Both (Testing)

Giữ cả hai để test song song:
- Old Next.js: `http://localhost:3010` (nếu đổi port)
- New Vite: `http://localhost:3010` (config trong website-new)

## 🚀 Running the New Frontend

```bash
cd D:\PROJECT\StudyProject\Cursor\cms-pressup\frontend\website

# Development
npm run dev
# → http://localhost:3010

# Production build
npm run build

# Preview production build
npm run preview
```

## 🔌 Backend Integration

Frontend đã được config để connect với backend API:

**vite.config.ts:**
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000',  // CMS Backend
    changeOrigin: true,
  },
}
```

**Đảm bảo backend đang chạy:**
```bash
cd D:\PROJECT\StudyProject\Cursor\cms-pressup\backend
npm run dev
# → Backend API at http://localhost:5000
```

## 📝 API Endpoints Used

Frontend đang call các endpoints:

```typescript
// Posts
GET /api/posts              // List all published posts
GET /api/posts/:slug        // Single post by slug

// Products
GET /api/products           // List all products
GET /api/products/:slug     // Single product by slug

// Categories
GET /api/product-categories // List all categories

// Settings
GET /api/settings           // Site settings
```

**⚠️ Lưu ý:** Đảm bảo backend có các endpoints này!

## 🎨 Customization

### Update Site Branding

**Header (`src/components/Header.tsx`):**
```typescript
<Link href="/" className="...">
  <span>📰 PressUp</span>  // ← Change logo/name
</Link>
```

**Footer (`src/components/Footer.tsx`):**
```typescript
<h3>PressUp CMS</h3>  // ← Change name
```

### Update Routes

**App.tsx:**
```typescript
<Route path="/" component={Home} />
<Route path="/blog" component={BlogList} />
// Add your routes here
```

### Update Theme Colors

**src/index.css:**
```css
:root {
  --primary: var(--color-blue-700);  // Change primary color
  --radius: 0.65rem;                 // Border radius
  /* ... */
}
```

### Add New Pages

```bash
# Create new page
# src/pages/Contact.tsx

# Add route in App.tsx
<Route path="/contact" component={Contact} />
```

## 🛠️ Development Tips

### Adding New API Endpoints

**1. Add to `src/services/api.ts`:**
```typescript
export const contactAPI = {
  send: (data) => api.post('/contact', data),
};
```

**2. Create hook in `src/hooks/useAPI.ts`:**
```typescript
export const useContactMutation = () => {
  return useMutation({
    mutationFn: (data) => contactAPI.send(data),
  });
};
```

**3. Use in component:**
```typescript
const { mutate, isPending } = useContactMutation();
```

### Adding UI Components

```bash
# Using Shadcn CLI
npx shadcn@latest add dialog
npx shadcn@latest add form
# etc.
```

### Dark Mode Toggle

```typescript
import { useTheme } from '@/contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}
```

## 📊 Project Comparison

| Feature | Old (Next.js) | New (Vite + React) |
|---------|--------------|-------------------|
| Framework | Next.js 16 | React 19 + Vite 7 |
| Routing | App Router | Wouter |
| Styling | Tailwind v3 | Tailwind v4 |
| Components | Basic | 50+ Shadcn UI |
| State | - | React Query |
| Dark Mode | - | ✅ Built-in |
| Type Safety | TypeScript | TypeScript |
| Dev Server | Slow | ⚡ Fast (Vite) |
| Build Time | ~10s | ~2s |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3010
npx kill-port 3010

# Or change port in vite.config.ts
server: {
  port: 3011,
}
```

### API Not Working
1. Check backend is running: `http://localhost:5000/api/posts`
2. Check proxy config in `vite.config.ts`
3. Check CORS settings in backend

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check types
npm run build
```

## 📚 Next Steps

1. ✅ **Test the new frontend** - `npm run dev`
2. ✅ **Update API endpoints** nếu cần
3. ✅ **Customize branding** (logo, colors, content)
4. ✅ **Add more pages** cho CMS của bạn
5. ✅ **Deploy** khi ready

## 🎯 Production Deployment

```bash
# Build for production
npm run build

# Output: dist/
# - index.html
# - assets/

# Deploy to static hosting (Vercel, Netlify, etc.)
# Or serve with backend
```

## 💡 Benefits of New Stack

- ⚡ **Faster dev experience** - Vite HMR instant
- 🎨 **Better UI** - 50+ components ready to use
- 🔄 **Better data fetching** - React Query caching
- 🌙 **Dark mode** - Built-in support
- 📦 **Smaller bundle** - Optimized build
- 🛠️ **Easier to maintain** - Simpler architecture

---

## 🆘 Need Help?

Check these files:
- `README.md` - Full documentation
- `src/App.tsx` - Routing
- `src/services/api.ts` - API config
- `vite.config.ts` - Vite config

Happy coding! 🚀

