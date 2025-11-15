# 📚 Post Type vs Post Topics - Giải Thích

## 🎯 Trả Lời Ngắn Gọn

**Chúng KHÁC NHAU và BỔ SUNG cho nhau!**

---

## 📊 So Sánh Nhanh

| | `post_type` | `post_topics` |
|---|---|---|
| **Là gì?** | Column trong `posts` | Junction table (many-to-many) |
| **Values** | 'course', 'blog', 'article', 'page' | Dynamic topics từ admin |
| **Quan hệ** | 1 post = 1 type | 1 post = nhiều topics |
| **Mục đích** | "Loại content gì?" | "Chủ đề nào?" |

---

## 💡 Ví Dụ

### Post: "Lash & Brow Tinting Training"

```json
{
  "title": "Lash & Brow Tinting Training + Certificate",
  "post_type": "course",  // ← ĐÂY LÀ COURSE (loại content)
  "topics": [              // ← COVER NHỮNG CHỦ ĐỀ NÀY
    "Professional Training",
    "Beauty Education",
    "Spa & Salon"
  ]
}
```

### Post: "Building a Lash & Brow Bar"

```json
{
  "title": "Building a Lash & Brow Bar Clients Can't Resist",
  "post_type": "blog",    // ← ĐÂY LÀ BLOG POST (loại content)
  "topics": [              // ← COVER NHỮNG CHỦ ĐỀ NÀY
    "Business Tips",
    "Lash & Brow",
    "Marketing"
  ]
}
```

---

## 🎯 Khi Nào Dùng?

### `post_type` - "WHAT KIND?"
- ✅ Filter: "Show all courses"
- ✅ Logic khác nhau: Courses có `duration`, Blogs có `read_time`
- ✅ Display khác nhau: Course card vs Blog card

### `post_topics` - "WHAT TOPICS?"
- ✅ Browse: "Show all posts about Makeup"
- ✅ Related: Posts cùng topics
- ✅ Categories: Taxonomy navigation

---

## ✅ Kết Luận

- **`post_type`** = Loại content (Course? Blog? Article?)
- **`post_topics`** = Chủ đề content (Makeup? Training? Business?)

**Chúng hoạt động cùng nhau!**

---

*Xem chi tiết: `D:\PROJECT\StudyProject\Cursor\cms-pressup\POST_TYPE_VS_POST_TOPICS.md`*


