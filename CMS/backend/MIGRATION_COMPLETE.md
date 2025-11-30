# Page Metadata Migration - Hoàn thành ✅

## Đã hoàn thành:

1. ✅ Tạo table `page_metadata` - Mỗi page metadata là một row riêng
2. ✅ Refactor tất cả functions để dùng table mới:
   - `syncProductMetadataToCMS` - Tự động sync khi thêm/sửa product
   - `removeMetadataFromCMS` - Tự động xóa khi xóa product/post
   - `syncPostMetadataToCMS` - Tự động sync khi thêm/sửa post
   - `pageMetadataController` - Đọc metadata từ table mới
3. ✅ Tạo API endpoints mới: `/api/page-metadata`
4. ✅ Tự động sync khi save SEO từ CMS frontend

## Cách hoạt động:

### Khi thêm Product:
- Tự động tạo/update metadata trong `page_metadata` table
- Path: `/products/{slug}`
- `auto_generated = true`

### Khi xóa Product:
- Tự động xóa metadata từ `page_metadata` table
- Chỉ xóa metadata của product đó, không ảnh hưởng pages khác

### Khi thêm Post:
- Tự động tạo/update metadata trong `page_metadata` table
- Path: `/posts/{slug}`
- `auto_generated = true`

### Khi save SEO từ CMS:
- Tự động sync vào `page_metadata` table
- Preserve `auto_generated` flag (không override auto-generated metadata)

## Lợi ích:

- ✅ Không còn race conditions
- ✅ Không còn mất data
- ✅ Dễ query và debug
- ✅ Performance tốt hơn với indexes
- ✅ Logic đơn giản, dễ maintain

## Test:

1. Tạo một product mới → Kiểm tra `page_metadata` table có row mới
2. Xóa product → Kiểm tra row tương ứng bị xóa
3. Tạo static page trong CMS SEO → Kiểm tra row mới được tạo
4. Xóa static page → Kiểm tra row bị xóa

## Database Structure:

```sql
CREATE TABLE page_metadata (
  id UUID PRIMARY KEY,
  path VARCHAR(500) UNIQUE NOT NULL,
  title VARCHAR(500),
  description TEXT,
  og_image VARCHAR(1000),
  keywords TEXT[],
  enabled BOOLEAN DEFAULT TRUE,
  auto_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```








