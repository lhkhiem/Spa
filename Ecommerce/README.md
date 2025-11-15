# Universal Companies Frontend

A modern e-commerce frontend for Universal Companies built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **API Client:** Axios
- **Form Handling:** React Hook Form + Zod
- **Icons:** React Icons
- **Animations:** Framer Motion
- **Carousel:** Swiper
- **Notifications:** React Hot Toast

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (main)/            # Main layout group
│   ├── (shop)/            # Shop flow layout
│   ├── (account)/         # Account layout
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── product/          # Product components
│   ├── cart/             # Cart components
│   └── ui/               # UI components
├── lib/                   # Core libraries
│   ├── api/              # API client & endpoints
│   ├── stores/           # Zustand stores
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── config/                # Configuration files
│   ├── site.ts           # Site config
│   └── navigation.ts     # Navigation structure
└── public/                # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (default: http://localhost:5000/api)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Banyco
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🎨 Design System

### Colors
- **Primary:** Purple (`#6B46C1`)
- **Success:** Green (`#10B981`)
- **Warning:** Orange (`#F59E0B`)
- **Error:** Red (`#EF4444`)
- **Info:** Blue (`#3B82F6`)

### Typography
- **Font Family:** Inter
- **Sizes:** Display (48px), H1 (36px), H2 (30px), H3 (24px), H4 (20px), Body (16px)

### Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1023px
- **Desktop:** 1024px - 1279px
- **Large Desktop:** 1280px+

## 🔗 API Integration

The frontend communicates with a Node.js backend via REST API. All API endpoints are defined in `lib/api/endpoints.ts`.

### Key Endpoints:
- `/products` - Product listing
- `/products/:slug` - Product details
- `/categories` - Categories
- `/cart` - Shopping cart
- `/orders` - Order management
- `/auth` - Authentication

## 📦 Component Library

### UI Components
- Button (Primary, Secondary, Outline)
- Input, Select, Checkbox, Radio
- Modal, Drawer
- Tabs, Accordion
- Card, Badge
- Spinner, Skeleton
- Toast notifications
- Pagination

### Layout Components
- Header (with mega menu)
- Footer
- Navigation (desktop & mobile)
- Breadcrumbs

### Product Components
- ProductCard
- ProductGrid
- ProductGallery
- ProductFilters
- ProductReviews

### Cart Components
- CartDrawer
- CartItem
- CartSummary
- Checkout flow

## 🗂️ State Management

Using Zustand for global state:

- **Cart Store:** Shopping cart items and calculations
- **Auth Store:** User authentication state
- **Wishlist Store:** Saved products
- **UI Store:** Modals, drawers, toasts

## 🔐 Authentication

The app supports:
- Login / Register
- Password reset
- Email verification
- Token refresh (automatic)

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Deploy to Vercel
```bash
vercel
```

## 📄 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_SITE_URL` | Frontend site URL | Yes |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | No |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe public key | No |

## 🧪 Testing

(Testing setup to be added)

## 📚 Documentation

### Frontend Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Backend Integration Documentation

Tài liệu phân tích kỹ thuật đầy đủ cho việc tích hợp Backend:

**🚀 [START HERE](./START_HERE.md)** ⭐⭐⭐⭐⭐  
**Begin here! Quick navigation và summary của tất cả documentation**

**📑 [INDEX ALL FILES](./INDEX_ALL_FILES.md)** - Navigation guide cho tất cả files

**🎉 [CONGRATULATIONS.md](./CONGRATULATIONS.md)** - Welcome & overview

**📋 Documentation Files:**
- **[TOMOFSUM.md](./TOMOFSUM.md)** ⭐ - Executive summary (ĐỌC FILE NÀY ĐẦU TIÊN!)
- 📖 **[README_BACKEND.md](./README_BACKEND.md)** - Quick start guide và roadmap
- 🔧 **[BACKEND_INTEGRATION_ANALYSIS.md](./BACKEND_INTEGRATION_ANALYSIS.md)** - Technical API specifications (English)
- 📋 **[BACKEND_REQUIREMENTS_VI.md](./BACKEND_REQUIREMENTS_VI.md)** - Requirements và business logic (Tiếng Việt)
- 📄 **[PHAN_TICH_TONG_QUAN.md](./PHAN_TICH_TONG_QUAN.md)** - Tổng quan project structure
- 📝 **[DANH_SACH_PAGES.md](./DANH_SACH_PAGES.md)** - Danh sách tất cả pages và APIs

**📦 Backend Models:**
- **[README_MODELS.md](./README_MODELS.md)** ⭐⭐⭐ - **CLIENT MODELS đã tạo trong cms-pressup!**

## 👥 Team

Universal Companies Development Team

## 📄 License

Proprietary - All rights reserved
