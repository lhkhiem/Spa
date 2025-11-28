# Order Management - Các chức năng cần triển khai

## ✅ Đã hoàn thành

### Nhóm 1: Quản lý Order Status (Hoàn thành)
- ✅ Update Order Status (pending → processing → shipped → delivered → cancelled)
- ✅ Update Payment Status (pending → paid → failed → refunded)
- ✅ Add/Update Tracking Number
- ✅ Cancel Order với restore stock tự động
- ✅ Soft Delete (Ẩn đơn hàng) thay vì hard delete

---

## 📋 Các chức năng cần triển khai

### 1. Refund Order (Hoàn tiền)
**Mô tả:** Cho phép admin hoàn tiền cho đơn hàng đã thanh toán

**Yêu cầu:**
- Chỉ cho phép refund khi `payment_status = 'paid'`
- Cập nhật `payment_status = 'refunded'`
- Restore stock cho tất cả items trong đơn
- Ghi stock movement với type `'return'`
- Ghi activity log
- Có thể tích hợp với ZaloPay refund API (nếu dùng ZaloPay)

**UI:**
- Nút "Hoàn tiền" trong order detail page
- Confirm dialog với thông tin chi tiết
- Hiển thị lịch sử refund nếu có

**Backend:**
- Endpoint: `POST /api/orders/:id/refund`
- Body: `{ reason?: string, amount?: number }`
- Logic: Update payment_status, restore stock, log activity

---

### 2. Export Orders (Xuất dữ liệu)
**Mô tả:** Xuất danh sách đơn hàng ra file CSV/Excel

**Yêu cầu:**
- Export với filters hiện tại (status, date range, search)
- Các cột: Order Number, Customer, Date, Status, Payment Status, Total
- Format: CSV hoặc Excel (.xlsx)
- Download file trực tiếp

**UI:**
- Nút "Export" trong orders list page
- Dialog chọn format (CSV/Excel)
- Dialog chọn cột muốn export
- Progress indicator khi đang export

**Backend:**
- Endpoint: `GET /api/orders/export?format=csv|excel&...filters`
- Sử dụng thư viện như `csv-writer` hoặc `exceljs`
- Stream response để download

---

### 3. Print Invoice (In hóa đơn)
**Mô tả:** In hóa đơn cho đơn hàng

**Yêu cầu:**
- Template hóa đơn đẹp, chuyên nghiệp
- Bao gồm: Thông tin công ty, thông tin khách hàng, chi tiết sản phẩm, tổng tiền
- Có thể in trực tiếp hoặc lưu PDF
- Responsive cho mobile/desktop

**UI:**
- Nút "In hóa đơn" trong order detail page
- Mở popup/modal với preview hóa đơn
- Nút Print và Download PDF

**Backend:**
- Endpoint: `GET /api/orders/:id/invoice`
- Có thể dùng `react-to-print` hoặc `jsPDF` cho frontend
- Hoặc generate PDF từ backend với `pdfkit` hoặc `puppeteer`

---

### 4. Send Email to Customer (Gửi email)
**Mô tả:** Gửi email thông báo cho khách hàng về trạng thái đơn hàng

**Yêu cầu:**
- Email templates cho các trường hợp:
  - Order confirmed
  - Order shipped (với tracking number)
  - Order delivered
  - Order cancelled
  - Payment failed
- Custom email content (admin có thể chỉnh sửa)
- Gửi email tự động khi status thay đổi (optional)

**UI:**
- Nút "Gửi email" trong order detail page
- Dialog chọn loại email
- Preview email trước khi gửi
- Lịch sử email đã gửi

**Backend:**
- Endpoint: `POST /api/orders/:id/send-email`
- Body: `{ type: 'confirmed'|'shipped'|'delivered'|'cancelled', custom_message?: string }`
- Sử dụng email service hiện có (nếu có) hoặc tích hợp SendGrid/Mailgun

---

### 5. Order Notes/Comments (Ghi chú)
**Mô tả:** Cho phép admin ghi chú nội bộ cho đơn hàng

**Yêu cầu:**
- Mỗi đơn có thể có nhiều notes
- Notes có timestamp và người tạo
- Hiển thị trong order detail page
- Có thể edit/delete notes (chỉ người tạo hoặc admin)

**UI:**
- Section "Ghi chú" trong order detail page
- Form để thêm note mới
- List các notes với timestamp
- Có thể edit/delete note

**Backend:**
- Table mới: `order_notes` (id, order_id, user_id, note, created_at, updated_at)
- Endpoints:
  - `GET /api/orders/:id/notes`
  - `POST /api/orders/:id/notes`
  - `PUT /api/orders/:id/notes/:noteId`
  - `DELETE /api/orders/:id/notes/:noteId`

---

### 6. Order History/Timeline (Lịch sử)
**Mô tả:** Hiển thị lịch sử thay đổi của đơn hàng

**Yêu cầu:**
- Track tất cả thay đổi: status, payment_status, tracking_number, notes
- Hiển thị ai thay đổi, khi nào, giá trị cũ → mới
- Timeline view với timestamp

**UI:**
- Section "Lịch sử" trong order detail page
- Timeline view với các events
- Filter theo loại thay đổi

**Backend:**
- Sử dụng `activity_logs` table hiện có
- Filter: `reference_type = 'order' AND reference_id = :order_id`
- Format response với timeline structure

---

### 7. Advanced Filters (Lọc nâng cao)
**Mô tả:** Thêm các filter nâng cao cho orders list

**Yêu cầu:**
- Date Range: Filter theo khoảng thời gian (created_at, shipped_at, delivered_at)
- Payment Method: Filter theo phương thức thanh toán
- Customer: Tìm theo tên, email, phone
- Amount Range: Filter theo tổng tiền (min-max)
- Multiple Status: Chọn nhiều status cùng lúc
- Saved Filters: Lưu filter thường dùng

**UI:**
- Advanced filter panel (có thể collapse/expand)
- Date picker cho date range
- Multi-select cho status
- Input cho amount range
- Nút "Lưu filter" và "Áp dụng filter"

**Backend:**
- Update `GET /api/orders` với các query params mới:
  - `date_from`, `date_to`
  - `payment_method`
  - `customer_search`
  - `amount_min`, `amount_max`
  - `status[]` (array)

---

### 8. Bulk Actions (Thao tác hàng loạt)
**Mô tả:** Cho phép cập nhật nhiều đơn hàng cùng lúc

**Yêu cầu:**
- Select multiple orders (checkbox)
- Bulk actions:
  - Update status
  - Update payment status
  - Add tracking number
  - Export selected
  - Archive (soft delete)
- Confirm dialog với số lượng đơn sẽ bị ảnh hưởng

**UI:**
- Checkbox ở đầu mỗi row
- "Select All" checkbox ở header
- Bulk action toolbar (hiện khi có items được chọn)
- Dropdown chọn action
- Confirm dialog

**Backend:**
- Endpoint: `POST /api/orders/bulk-update`
- Body: `{ order_ids: string[], action: 'update_status'|'update_payment'|'add_tracking'|'archive', data: {...} }`
- Validate và xử lý từng order
- Return kết quả: success count, failed count, errors

---

### 9. Restore Deleted Orders (Khôi phục đơn đã ẩn)
**Mô tả:** Khôi phục đơn hàng đã bị ẩn (soft delete)

**Yêu cầu:**
- Hiển thị danh sách đơn đã ẩn (với filter `?include_deleted=true`)
- Nút "Khôi phục" cho mỗi đơn
- Set `deleted_at = NULL`
- Ghi activity log

**UI:**
- Tab/Filter "Đơn đã ẩn" trong orders list
- Nút "Khôi phục" thay vì "Xóa"
- Confirm dialog

**Backend:**
- Endpoint: `POST /api/orders/:id/restore`
- Update: `UPDATE orders SET deleted_at = NULL WHERE id = :id`
- Log activity

---

## 📝 Ghi chú kỹ thuật

### Database
- Đã có: `orders`, `order_items`, `activity_logs`, `stock_movements`
- Cần thêm: `order_notes` (cho chức năng #5)

### API Patterns
- Tất cả endpoints cần authentication (admin only)
- Sử dụng consistent error handling
- Log tất cả actions vào `activity_logs`

### UI/UX
- Sử dụng consistent design system
- Toast notifications cho feedback
- Loading states cho async operations
- Confirm dialogs cho destructive actions

---

## 🎯 Ưu tiên triển khai

1. **High Priority:**
   - #7 Advanced Filters (rất hữu ích cho admin)
   - #4 Send Email (quan trọng cho customer service)
   - #9 Restore Deleted Orders (cần thiết sau khi có soft delete)

2. **Medium Priority:**
   - #1 Refund Order
   - #2 Export Orders
   - #5 Order Notes

3. **Low Priority:**
   - #3 Print Invoice (có thể dùng browser print tạm thời)
   - #6 Order History (có thể dùng activity_logs hiện có)
   - #8 Bulk Actions (tiện nhưng không bắt buộc)

---

**Tạo bởi:** AI Assistant  
**Ngày:** 2025-11-28  
**Trạng thái:** Planning Phase

