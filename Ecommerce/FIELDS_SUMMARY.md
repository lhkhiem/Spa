# ✅ Tổng Kết Các Custom Fields

## 📊 5 Trường Custom cho Posts

### 1. `duration` ⏱️
- **Dùng cho:** `post_type = 'course'`
- **Ví dụ:** `"2 hours"`
- **Mục đích:** Thời lượng khóa học

### 2. `ceus` 🎓
- **Dùng cho:** `post_type = 'course'`
- **Ví dụ:** `"2 CEUs"`
- **Mục đích:** Chứng chỉ chuyên môn

### 3. `level` 📍
- **Dùng cho:** `post_type = 'course'`
- **Ví dụ:** `"Beginner"`, `"Advanced"`
- **Mục đích:** Cấp độ khóa học

### 4. `read_time` 📖
- **Dùng cho:** `post_type = 'blog'` hoặc `'article'`
- **Ví dụ:** `"5 min read"`
- **Mục đích:** Thời gian đọc bài viết

### 5. `is_featured` ⭐
- **Dùng cho:** TẤT CẢ post types
- **Ví dụ:** `true` hoặc `false`
- **Mục đích:** Đánh dấu nội dung nổi bật

---

## 🎯 Usage Matrix

| Field | Course | Blog | Article |
|-------|--------|------|---------|
| `duration` | ✅ | ❌ | ❌ |
| `ceus` | ✅ | ❌ | ❌ |
| `level` | ✅ | ❌ | ❌ |
| `read_time` | ❌ | ✅ | ✅ |
| `is_featured` | ✅ | ✅ | ✅ |

---

✅ **Đã commit và push!**


