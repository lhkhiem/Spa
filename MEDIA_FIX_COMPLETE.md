# Media Library Fix Complete ✅

## Vấn đề

- ❌ `ReferenceError: buildApiUrlFromBase is not defined`
- ❌ Media library không load được
- ❌ Không có ảnh hiển thị

## Nguyên nhân

1. **Thiếu import**: File `media/page.tsx` dùng `buildApiUrlFromBase` nhưng chưa import
2. **Syntax error**: Một số chỗ dùng template string sai (backtick thay vì gọi function)

## Đã sửa

### 1. Thêm Import
```typescript
import { API_BASE_URL, buildApiUrlFromBase } from '@/lib/api';
```

### 2. Sửa tất cả API calls
- ✅ `fetchFolders()` - sửa thành `buildApiUrlFromBase(API_BASE_URL, '/api/media/folders')`
- ✅ `fetchMedia()` - sửa thành `buildApiUrlFromBase(API_BASE_URL, '/api/media?...')`
- ✅ `uploadMedia()` - sửa thành `buildApiUrlFromBase(API_BASE_URL, '/api/media/upload')`
- ✅ `uploadMediaFromUrl()` - sửa thành `buildApiUrlFromBase(API_BASE_URL, '/api/media/upload/by-url')`
- ✅ `createFolder()` - sửa thành `buildApiUrlFromBase(API_BASE_URL, '/api/media/folders')`
- ✅ `renameFolder()` - sửa thành `buildApiUrlFromBase(API_BASE_URL, '/api/media/folders/${folderId}')`
- ✅ `deleteFolder()` - sửa thành `buildApiUrlFromBase(API_BASE_URL, '/api/media/folders/${folderId}')`
- ✅ `renameFile()` - sửa thành `buildApiUrlFromBase(API_BASE_URL, '/api/media/${fileId}/rename')`
- ✅ `deleteFiles()` - sửa thành `buildApiUrlFromBase(API_BASE_URL, '/api/media/${id}')`
- ✅ `moveFiles()` - sửa thành `buildApiUrlFromBase(API_BASE_URL, '/api/media/${id}')`

### 3. Rebuild và Restart
- ✅ Rebuild admin frontend
- ✅ Restart cms-admin service

## Kết quả

- ✅ Không còn lỗi `ReferenceError`
- ✅ Media library có thể load được
- ✅ Tất cả API calls dùng URL đúng (không còn duplicate `/api/api/`)

## Test

1. Mở `https://admin.banyco.vn/dashboard/media`
2. Kiểm tra console không còn lỗi
3. Media library nên load được files và folders
4. Có thể upload, delete, rename files



