# Hệ Thống Quản Lý Slider - Hướng Dẫn

## Tổng Quan

Hệ thống quản lý slider cho phép bạn tạo và quản lý các banner/hero slider trên trang chủ với các tính năng:
- Quản lý nhiều slides
- Upload hình ảnh từ Media Library
- Text overlay (title, description, button)
- Điều hướng (navigation arrows)
- Pagination dots
- Auto-play với tùy chọn pause khi hover
- Sắp xếp thứ tự slides
- Bật/tắt slides

## Cấu Trúc Backend

### 1. Database Migration
- **File**: `backend/src/migrations/016_sliders.sql`
- **Table**: `sliders`
- **Fields**:
  - `id`: UUID (primary key)
  - `title`: Tiêu đề slider (required)
  - `description`: Mô tả (optional)
  - `button_text`: Text của nút (optional)
  - `button_link`: Link của nút (optional)
  - `image_id`: ID của asset từ media library (optional)
  - `image_url`: URL hình ảnh trực tiếp (optional)
  - `order_index`: Thứ tự hiển thị (default: 0)
  - `is_active`: Trạng thái active/inactive (default: true)

### 2. Model
- **File**: `backend/src/models/Slider.ts`
- Sequelize model cho Slider

### 3. Controller
- **File**: `backend/src/controllers/sliderController.ts`
- **Endpoints**:
  - `GET /api/sliders` - Lấy tất cả sliders (query: `active_only=true`)
  - `GET /api/sliders/:id` - Lấy slider theo ID
  - `POST /api/sliders` - Tạo slider mới
  - `PUT /api/sliders/:id` - Cập nhật slider
  - `DELETE /api/sliders/:id` - Xóa slider
  - `POST /api/sliders/reorder` - Sắp xếp lại thứ tự

### 4. Routes
- **File**: `backend/src/routes/sliders.ts`
- Đã được đăng ký trong `backend/src/app.ts` tại `/api/sliders`

## Cài Đặt

### 1. Chạy Migration

```bash
cd backend
npm run migrate
```

Hoặc chạy migration thủ công:
```bash
# Kết nối PostgreSQL và chạy file migration
psql -U your_user -d your_database -f src/migrations/016_sliders.sql
```

### 2. Khởi Động Backend

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại `http://localhost:3011`

## Sử Dụng Admin Panel

### 1. Truy Cập Slider Management

1. Đăng nhập vào admin panel: `http://localhost:3013`
2. Vào menu **Appearance** → **Sliders**
3. URL: `/dashboard/sliders`

### 2. Tạo Slider Mới

1. Click nút **"Add Slider"**
2. Điền thông tin:
   - **Title** (required): Tiêu đề hiển thị trên slider
   - **Description**: Mô tả ngắn (optional)
   - **Button Text**: Text của nút CTA (optional)
   - **Button Link**: Link khi click nút (optional)
   - **Background Image**: Chọn từ Media Library
   - **Order Index**: Thứ tự hiển thị (số nhỏ hơn hiển thị trước)
   - **Active**: Checkbox để bật/tắt slider
3. Click **"Save"**

### 3. Quản Lý Sliders

- **Edit**: Click icon ✏️ để chỉnh sửa
- **Delete**: Click icon 🗑️ để xóa
- **Activate/Deactivate**: Click icon 👁️ để bật/tắt
- **Reorder**: Click mũi tên ⬆️⬇️ để di chuyển thứ tự

## Sử Dụng Frontend Component

### 1. Component HeroSlider

**File**: `frontend/website-new/src/components/HeroSlider.tsx`

**Props**:
```typescript
interface HeroSliderProps {
  items: SliderItem[];           // Array of slider items
  autoPlay?: boolean;             // Auto-play (default: true)
  autoPlayInterval?: number;     // Interval in ms (default: 5000)
  showNavigation?: boolean;       // Show arrow buttons (default: true)
  showPagination?: boolean;       // Show dots (default: true)
  className?: string;            // Additional CSS classes
}
```

**Ví dụ sử dụng**:

```tsx
import { HeroSlider } from '@/components/HeroSlider';

function HomePage() {
  const sliders = [
    {
      id: '1',
      title: 'Premium Equipment & Tools',
      description: 'Industry-leading equipment for professionals',
      button_text: 'Explore Equipment',
      button_link: '/products',
      image_url: 'https://example.com/image.jpg',
    },
  ];

  return (
    <HeroSlider
      items={sliders}
      autoPlay={true}
      autoPlayInterval={5000}
      showNavigation={true}
      showPagination={true}
    />
  );
}
```

### 2. Component SliderDemo (Tự Động Fetch từ API)

**File**: `frontend/website-new/src/components/SliderDemo.tsx`

Component này tự động fetch sliders từ API và hiển thị:

```tsx
import { SliderDemo } from '@/components/SliderDemo';

function HomePage() {
  return (
    <div>
      <SliderDemo />
      {/* Rest of your page */}
    </div>
  );
}
```

**Environment Variables**:
- `NEXT_PUBLIC_API_URL`: URL của backend API (default: `http://localhost:3011`)

## Tính Năng Component

### HeroSlider Component Features:

1. **Auto-play**: Tự động chuyển slide sau mỗi 5 giây (có thể tùy chỉnh)
2. **Pause on Hover**: Tự động dừng khi hover vào slider
3. **Navigation Arrows**: Mũi tên trái/phải để điều hướng
4. **Pagination Dots**: Dots ở dưới để jump đến slide cụ thể
5. **Smooth Transitions**: Animation mượt mà khi chuyển slide
6. **Responsive**: Tự động điều chỉnh cho mobile/tablet/desktop
7. **Image Overlay**: Overlay tối để text dễ đọc hơn

## Styling

Component sử dụng TailwindCSS và có thể tùy chỉnh qua:
- `className` prop
- CSS variables cho theme (nếu có)
- Tailwind utility classes

## API Response Format

### GET /api/sliders
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Premium Equipment & Tools",
      "description": "Industry-leading equipment for professionals",
      "button_text": "Explore Equipment",
      "button_link": "/products",
      "image_id": "uuid",
      "image_url": "https://...",
      "asset": {
        "id": "uuid",
        "url": "/uploads/...",
        "cdn_url": "https://...",
        "sizes": {...}
      },
      "order_index": 0,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/sliders?active_only=true
Chỉ trả về các slider có `is_active = true`, đã được sắp xếp theo `order_index`.

## Troubleshooting

### Migration không chạy được
- Kiểm tra kết nối database
- Đảm bảo PostgreSQL đang chạy
- Kiểm tra quyền user trong database

### Slider không hiển thị trên frontend
- Kiểm tra `NEXT_PUBLIC_API_URL` environment variable
- Kiểm tra CORS settings trong backend
- Kiểm tra console để xem lỗi API

### Image không load
- Kiểm tra `image_url` hoặc `asset.cdn_url` có hợp lệ không
- Kiểm tra backend có serve static files tại `/uploads` không
- Kiểm tra media library có upload thành công không

## Next Steps

1. ✅ Chạy migration `016_sliders.sql`
2. ✅ Tạo slider đầu tiên trong admin panel
3. ✅ Tích hợp `HeroSlider` hoặc `SliderDemo` vào trang chủ
4. ✅ Test các tính năng: navigation, pagination, auto-play
5. ✅ Customize styling theo design system của bạn





