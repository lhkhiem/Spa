# Media Library Image Display Fix ✅

## Vấn đề

- ❌ Hình ảnh không hiển thị trong Media Library
- ❌ Có cây thư mục nhưng không có thumbnail
- ❌ URL hình ảnh bị sai format

## Nguyên nhân

1. **Frontend**: Dùng `${API_BASE_URL}${asset.thumb_url || asset.url}` 
   - `API_BASE_URL` đã có `/api` ở cuối → tạo ra URL sai
   - Không normalize URL đúng cách

2. **Backend**: Trả về `thumb_url` không đúng format
   - `sizes.thumb` có thể là object `{url: '...'}` hoặc string `'thumb.webp'`
   - Code chỉ xử lý một trường hợp

## Đã sửa

### 1. Frontend (`app/dashboard/media/page.tsx`)
- ✅ Thêm import `getThumbnailUrl` và `getAssetUrl`
- ✅ Sửa grid view: dùng `getThumbnailUrl(asset) || getAssetUrl(asset.url)`
- ✅ Sửa list view: dùng `getThumbnailUrl(asset) || getAssetUrl(asset.url)`
- ✅ Sửa preview modal: dùng `getAssetUrl(previewFile.original_url) || getAssetUrl(previewFile.url)`
- ✅ Sửa download link: dùng `getAssetUrl(asset.url)`
- ✅ Thêm error handler để fallback về original URL nếu thumbnail fail

### 2. Backend (`controllers/mediaController.ts`)
- ✅ Sửa logic extract thumbnail URL từ `sizes` object
- ✅ Xử lý cả 2 trường hợp:
  - `sizes.thumb` là object: `{url: '/path/to/thumb.webp'}`
  - `sizes.thumb` là string: `'thumb.webp'`
- ✅ Tương tự cho `medium` và `large`

### 3. Rebuild và Restart
- ✅ Rebuild admin frontend
- ✅ Rebuild backend
- ✅ Restart cả 2 services

## Kết quả

- ✅ Hình ảnh hiển thị được trong Media Library
- ✅ Thumbnail được load từ `sizes.thumb.url` hoặc fallback về `url`
- ✅ URL được normalize đúng cách
- ✅ Preview modal hiển thị đúng hình ảnh

## Test

1. Mở `https://admin.banyco.vn/dashboard/media`
2. Kiểm tra:
   - ✅ Cây thư mục hiển thị
   - ✅ Hình ảnh hiển thị trong grid/list view
   - ✅ Click vào hình để preview
   - ✅ Download hình ảnh

## Lưu ý

- Nếu vẫn không hiển thị, clear browser cache (Ctrl+Shift+R)
- Kiểm tra console có lỗi 404 không
- Kiểm tra Network tab xem request hình ảnh có thành công không



