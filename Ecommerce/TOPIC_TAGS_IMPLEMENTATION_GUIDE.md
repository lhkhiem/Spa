# 🎯 HƯỚNG DẪN: THÊM TOPIC/TAGS CHO COURSES - FRONTEND HAY BACKEND?

## ✅ TRẢ LỜI NGẮN GỌN

**CẢ HAI BÊN** - Nhưng **BACKEND TRƯỚC**, sau đó **FRONTEND**:

1. **BACKEND** (Bắt buộc): Thêm fields vào database và API
2. **FRONTEND** (Sau đó): Cập nhật interface và hiển thị UI

---

## 📋 PHÂN TÍCH CHI TIẾT

### 🔴 **BACKEND** - BẮT BUỘC PHẢI LÀM TRƯỚC

#### 1. **Database Schema**

**Cần thêm vào table `posts` (hoặc `education_resources`):**

```sql
-- Nếu dùng posts table
ALTER TABLE posts 
ADD COLUMN topics JSON,           -- Array of topics
ADD COLUMN tags JSON;             -- Array of tags

-- Hoặc nếu dùng junction tables (many-to-many)
CREATE TABLE post_topics (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  topic_id UUID REFERENCES topics(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE post_tags (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  tag_id UUID REFERENCES tags(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. **API Response**

**Cập nhật endpoint `/public/homepage/education-resources`:**

**Before:**
```json
{
  "data": [
    {
      "id": "...",
      "title": "Lash & Brow Tinting Training",
      "description": "...",
      "duration": "2 hours",
      "ceus": "2 CEUs",
      "level": "Beginner"
    }
  ]
}
```

**After:**
```json
{
  "data": [
    {
      "id": "...",
      "title": "Lash & Brow Tinting Training",
      "description": "...",
      "duration": "2 hours",
      "ceus": "2 CEUs",
      "level": "Beginner",
      "topics": [                    // ← THÊM
        "Professional Training",
        "Beauty Education"
      ],
      "tags": [                      // ← THÊM
        "Lash Services",
        "Brow Services",
        "CEU"
      ]
    }
  ]
}
```

#### 3. **Backend Controller/Service**

**Cập nhật để include topics và tags:**

```typescript
// Backend code (ví dụ)
export async function getEducationResources() {
  const resources = await db.query(`
    SELECT 
      p.*,
      COALESCE(
        json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL),
        '[]'::json
      ) as topics,
      COALESCE(
        json_agg(DISTINCT tag.name) FILTER (WHERE tag.name IS NOT NULL),
        '[]'::json
      ) as tags
    FROM posts p
    LEFT JOIN post_topics pt ON p.id = pt.post_id
    LEFT JOIN topics t ON pt.topic_id = t.id
    LEFT JOIN post_tags ptag ON p.id = ptag.post_id
    LEFT JOIN tags tag ON ptag.tag_id = tag.id
    WHERE p.post_type = 'course' 
      AND p.is_featured = true
      AND p.status = 'published'
    GROUP BY p.id
  `);
  
  return resources;
}
```

---

### 🟢 **FRONTEND** - LÀM SAU KHI BACKEND XONG

#### 1. **Cập nhật Interface**

**File: `lib/api/publicHomepage.ts`**

```typescript
export interface EducationResourceDTO {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  link_text: string | null;
  duration: string | null;
  ceus: string | null;
  level: string | null;
  resource_type: string | null;
  sort_order: number;
  topics?: string[];        // ← THÊM
  tags?: string[];          // ← THÊM
}
```

#### 2. **Cập nhật Component Interface**

**File: `components/home/EducationResources/EducationResources.tsx`**

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration?: string;
  ceus?: string;
  level?: string;
  topics?: string[];        // ← THÊM
  tags?: string[];          // ← THÊM
  link: string;
  linkText: string;
}
```

#### 3. **Mapping từ API**

```typescript
const mapped: Course[] = data.map((item: EducationResourceDTO) => ({
  id: item.id,
  title: item.title,
  description: item.description ?? '',
  image: item.image_url ?? '...',
  duration: item.duration ?? undefined,
  ceus: item.ceus ?? undefined,
  level: item.level ?? undefined,
  topics: item.topics ?? [],      // ← THÊM
  tags: item.tags ?? [],          // ← THÊM
  link: item.link_url ?? '/learning',
  linkText: item.link_text ?? 'Start Learning',
}));
```

#### 4. **Hiển thị trong UI**

```tsx
<div className="p-6">
  {/* Existing: CEUs, Duration, Level */}
  <div className="mb-3 flex items-center space-x-2 text-xs text-gray-600">
    {course.ceus && (
      <span className="rounded-full bg-brand-purple-100 px-2 py-1 text-brand-purple-700">
        {course.ceus}
      </span>
    )}
    {course.duration && <span>{course.duration}</span>}
    {course.duration && course.level && <span>•</span>}
    {course.level && <span>{course.level}</span>}
  </div>

  {/* Title */}
  <h4 className="mb-2 font-semibold text-gray-900 group-hover:text-brand-purple-600">
    {course.title}
  </h4>

  {/* Description */}
  <p className="text-sm text-gray-600">{course.description}</p>

  {/* THÊM: Topics/Tags */}
  {course.topics && course.topics.length > 0 && (
    <div className="mt-3 flex flex-wrap gap-2">
      {course.topics.map((topic, idx) => (
        <span
          key={idx}
          className="rounded-full bg-purple-50 px-2 py-1 text-xs text-brand-purple-700"
        >
          {topic}
        </span>
      ))}
    </div>
  )}

  {/* Link */}
  <div className="mt-4 flex items-center text-brand-purple-600">
    <span className="text-sm font-medium">{course.linkText}</span>
    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </div>
</div>
```

---

## 🎯 QUY TRÌNH THỰC HIỆN

### **Bước 1: BACKEND** ⚠️ BẮT BUỘC

1. ✅ Thêm columns vào database (topics, tags)
2. ✅ Cập nhật API endpoint để return topics/tags
3. ✅ Test API response có đúng format không
4. ✅ Document API changes

### **Bước 2: FRONTEND** (Sau khi backend xong)

1. ✅ Cập nhật TypeScript interfaces
2. ✅ Cập nhật mapping logic
3. ✅ Thêm UI để hiển thị topics/tags
4. ✅ Test hiển thị đúng

---

## 📊 SO SÁNH

| Task | Backend | Frontend | Ghi chú |
|------|---------|----------|---------|
| **Database Schema** | ✅ Bắt buộc | ❌ | Thêm columns/tables |
| **API Response** | ✅ Bắt buộc | ❌ | Return topics/tags |
| **Data Processing** | ✅ Bắt buộc | ❌ | Query, join, aggregate |
| **TypeScript Interface** | ❌ | ✅ | Định nghĩa types |
| **UI Display** | ❌ | ✅ | Render tags/badges |
| **Styling** | ❌ | ✅ | CSS/Tailwind |

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. **Backend phải làm trước**
- Frontend không thể hiển thị dữ liệu nếu backend chưa có
- Phải test API trước khi update frontend

### 2. **Nếu backend chưa sẵn sàng**
- Frontend có thể **tạm thời** hardcode để design UI
- Nhưng **phải** update lại khi backend xong

### 3. **Data Structure**
- Quyết định: `topics` và `tags` là **array** hay **string**?
- Nếu array: `["Topic 1", "Topic 2"]`
- Nếu string: `"Topic 1, Topic 2"` (phải split)

---

## ✅ KẾT LUẬN

### **Làm ở đâu?**

1. **BACKEND** (Bắt buộc):
   - ✅ Database schema
   - ✅ API endpoints
   - ✅ Data processing

2. **FRONTEND** (Sau backend):
   - ✅ TypeScript interfaces
   - ✅ UI components
   - ✅ Styling

### **Thứ tự thực hiện:**

```
BACKEND (Database + API) 
    ↓
Test API Response
    ↓
FRONTEND (Interface + UI)
    ↓
Test End-to-End
```

---

## 🎯 KHUYẾN NGHỊ

**Nếu bạn làm BACKEND:**
- Thêm `topics` và `tags` vào database
- Update API endpoint `/public/homepage/education-resources`
- Return dữ liệu dạng array: `["Topic 1", "Topic 2"]`

**Nếu bạn làm FRONTEND:**
- Đợi backend xong
- Hoặc tạm thời hardcode để design UI
- Update lại khi backend có API

---

*Last Updated: 2025-01-31*






