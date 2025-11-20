# Sửa lỗi trang Posts không load

## Vấn đề:
Trang posts hiển thị "Loading posts..." nhưng không load được dữ liệu.

## Nguyên nhân:
1. Next.js đang cache response từ API
2. Fetch API có thể bị block bởi CORS hoặc cache

## Giải pháp đã áp dụng:
1. **Tắt cache trong fetch**: Thay đổi từ `next: { revalidate: 60 }` sang `cache: 'no-store'` để đảm bảo luôn lấy dữ liệu mới nhất
2. **Thêm headers**: Thêm `Content-Type: application/json` header

## Kiểm tra:
- API endpoint: `http://banyco-demo.pressup.vn/api/public/posts` ✅ Hoạt động
- Response format: `{ success: true, data: [...], total: ... }` ✅ Đúng format
- CORS: ✅ Đã được cấu hình đúng

## Cần làm thêm:
1. Xóa cache browser (Ctrl+Shift+R hoặc Cmd+Shift+R)
2. Kiểm tra console browser để xem có lỗi gì không
3. Nếu vẫn không hoạt động, kiểm tra network tab trong DevTools

