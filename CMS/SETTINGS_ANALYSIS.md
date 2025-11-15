# Phân tích Settings Page - Dashboard Settings

## 📊 Tổng quan

**URL:** `http://localhost:3013/dashboard/settings`

**Database Schema:**
- Table: `settings`
- Columns: `id`, `namespace`, `value` (JSONB), `updated_at`
- Unique constraint: `namespace` (mỗi namespace chỉ có 1 record)

**API Endpoints:**
- `GET /api/settings/:namespace` - Lấy settings theo namespace
- `PUT /api/settings/:namespace` - Lưu settings theo namespace
- `POST /api/settings/clear-cache` - Clear cache
- `POST /api/settings/reset-default` - Reset về mặc định

---

## ✅ Các chức năng ĐÃ CÓ CRUD đầy đủ

### 1. **General Settings** ✅
**Namespace:** `general`

**Trạng thái CRUD:**
- ✅ **CREATE**: Tự động tạo khi UPDATE lần đầu (UPSERT)
- ✅ **READ**: `GET /api/settings/general`
- ✅ **UPDATE**: `PUT /api/settings/general`
- ❌ **DELETE**: Không có (không cần)

**Fields trong Frontend:**
- `siteName` - Tên website
- `siteDescription` - Mô tả website
- `siteUrl` - URL website
- `adminEmail` - Email admin
- `businessInfo` - Thông tin doanh nghiệp:
  - `company` - Tên công ty
  - `taxCode` - Mã số thuế
  - `address` - Địa chỉ
  - `phone` - Số điện thoại
  - `email` - Email
- `socialLinks` - Links mạng xã hội:
  - `facebook`, `youtube`, `tiktok`, `linkedin`, `twitter`

**Default Values:**
```json
{
  "siteName": "PressUp CMS",
  "siteDescription": "A powerful content management system",
  "siteUrl": "https://example.com",
  "adminEmail": "admin@pressup.com",
  "businessInfo": { "company": "", "address": "", "taxCode": "", "phone": "", "email": "" },
  "socialLinks": { "facebook": "", "youtube": "", "tiktok": "", "linkedin": "", "twitter": "" }
}
```

---

### 2. **Appearance Settings** ✅
**Namespace:** `appearance`

**Trạng thái CRUD:**
- ✅ **CREATE**: Tự động tạo khi UPDATE lần đầu (UPSERT)
- ✅ **READ**: `GET /api/settings/appearance`
- ✅ **UPDATE**: `PUT /api/settings/appearance`
- ❌ **DELETE**: Không có (không cần)

**Fields trong Frontend:**
- `themeMode` - Chế độ theme: `light`, `dark`, `system`
- `primaryColor` - Màu chủ đạo (hex color)
- `logo_asset_id` - ID asset của logo
- `logo_url` - URL logo
- `favicon_asset_id` - ID asset của favicon
- `favicon_url` - URL favicon

**Default Values:**
```json
{
  "themeMode": "system",
  "primaryColor": "#8b5cf6",
  "logo_asset_id": null,
  "logo_url": "",
  "favicon_asset_id": null,
  "favicon_url": ""
}
```

**Đặc biệt:**
- Upload logo/favicon qua `/api/assets/upload`
- Live update theme và primary color khi thay đổi
- Lưu vào localStorage để cross-window updates

---

### 3. **Security Settings** ✅
**Namespace:** `security`

**Trạng thái CRUD:**
- ✅ **CREATE**: Tự động tạo khi UPDATE lần đầu (UPSERT)
- ✅ **READ**: `GET /api/settings/security`
- ✅ **UPDATE**: `PUT /api/settings/security`
- ❌ **DELETE**: Không có (không cần)

**Fields trong Frontend:**
- `twoFactorEnabled` - Bật 2FA (boolean)
- `sessionTimeout` - Timeout session (minutes)
- `passwordPolicy` - Chính sách mật khẩu:
  - `minLength` - Độ dài tối thiểu
  - `uppercase` - Yêu cầu chữ hoa
  - `numbers` - Yêu cầu số
  - `special` - Yêu cầu ký tự đặc biệt

**Default Values:**
```json
{
  "twoFactorEnabled": false,
  "sessionTimeout": 60,
  "passwordPolicy": { "minLength": 8, "uppercase": true, "numbers": true, "special": false }
}
```

**Vấn đề:**
- Frontend có UI nhưng chưa bind với state `security`
- Chưa có logic enable 2FA
- Chưa có validation password policy

---

### 4. **Advanced Settings** ✅
**Namespace:** `advanced`

**Trạng thái CRUD:**
- ✅ **CREATE**: Tự động tạo khi UPDATE lần đầu (UPSERT)
- ✅ **READ**: `GET /api/settings/advanced`
- ✅ **UPDATE**: `PUT /api/settings/advanced`
- ❌ **DELETE**: Không có (không cần)

**Fields trong Frontend:**
- `apiBaseUrl` - URL API base
- `cacheStrategy` - Chiến lược cache: `memory`, `redis`, `none`

**Default Values:**
```json
{
  "apiBaseUrl": "http://localhost:3011",
  "cacheStrategy": "memory"
}
```

**Vấn đề:**
- Frontend có UI nhưng chưa bind với state `advanced`
- Input fields không có value/onChange

---

### 5. **SEO Settings** ✅
**Namespace:** `seo`

**Trạng thái CRUD:**
- ✅ **CREATE**: Tự động tạo khi UPDATE lần đầu (UPSERT)
- ✅ **READ**: `GET /api/settings/seo`
- ✅ **UPDATE**: `PUT /api/settings/seo`
- ❌ **DELETE**: Không có (không cần)

**Fields trong Frontend:**
- `home` - SEO cho trang chủ:
  - `title` - Tiêu đề
  - `description` - Meta description
  - `headScript` - Script trong `<head>`
  - `bodyScript` - Script trong `<body>`
  - `slug` - Slug URL
- `pages` - Array các trang SEO (chưa có UI)

**Default Values:**
```json
{
  "home": { "title": "Home - PressUp", "description": "", "headScript": "", "bodyScript": "", "slug": "/" },
  "pages": []
}
```

---

## ❌ Các chức năng CHƯA CÓ CRUD

### 1. **Email Settings** ❌
**Namespace:** `email` (chưa có)

**Trạng thái CRUD:**
- ❌ **CREATE**: Chưa có
- ❌ **READ**: Chưa có
- ❌ **UPDATE**: Chưa có
- ❌ **DELETE**: Chưa có

**UI hiện tại:**
- Có form với các fields:
  - SMTP Host
  - SMTP Port
  - Encryption (TLS/SSL/None)
  - From Email
  - From Name
- Nhưng **KHÔNG có state management**
- Nhưng **KHÔNG có API endpoint**

**Cần làm:**
1. Thêm state `email` trong frontend
2. Thêm default values cho `email` namespace
3. Thêm `fetchNs('email', setEmail)` trong useEffect
4. Bind input fields với state
5. Thêm logic save email settings

---

### 2. **Notifications Settings** ❌
**Namespace:** `notifications` (chưa có)

**Trạng thái CRUD:**
- ❌ **CREATE**: Chưa có
- ❌ **READ**: Chưa có
- ❌ **UPDATE**: Chưa có
- ❌ **DELETE**: Chưa có

**UI hiện tại:**
- Có checkboxes cho:
  - New post published
  - New user registration
  - New comment
  - System updates
- Nhưng **KHÔNG có state management**
- Nhưng **KHÔNG có API endpoint**

**Cần làm:**
1. Thêm state `notifications` trong frontend
2. Thêm default values cho `notifications` namespace
3. Thêm `fetchNs('notifications', setNotifications)` trong useEffect
4. Bind checkboxes với state
5. Thêm logic save notifications settings

---

## 📋 Tổng kết

### Đã có CRUD đầy đủ (5/7):
1. ✅ General Settings
2. ✅ Appearance Settings
3. ✅ Security Settings (cần fix UI binding)
4. ✅ Advanced Settings (cần fix UI binding)
5. ✅ SEO Settings

### Chưa có CRUD (2/7):
1. ❌ Email Settings
2. ❌ Notifications Settings

---

## 🔧 Cần sửa/bổ sung

### Priority 1: Hoàn thiện Email & Notifications
1. Thêm state management cho Email và Notifications
2. Thêm default values cho 2 namespace này
3. Bind UI với state
4. Test CRUD operations

### Priority 2: Fix UI binding
1. Security Settings: Bind inputs với state
2. Advanced Settings: Bind inputs với state
3. Thêm validation cho các fields

### Priority 3: Cải thiện
1. Thêm DELETE endpoint (nếu cần)
2. Thêm validation cho email/SMTP settings
3. Thêm test email functionality
4. Thêm preview cho notifications

---

## 📝 Code Structure

**Backend:**
- `backend/src/controllers/settingsController.ts` - Controller xử lý settings
- `backend/src/routes/settings.ts` - Routes cho settings API
- `backend/src/migrations/005_settings.sql` - Database schema

**Frontend:**
- `frontend/admin/app/dashboard/settings/page.tsx` - Settings page UI

**Database:**
- Table: `settings`
- Structure: Key-value với namespace (JSONB values)

---

## 🚀 Next Steps

1. **Implement Email Settings CRUD**
   - Thêm state `email`
   - Thêm default values
   - Bind UI với state
   - Test save/load

2. **Implement Notifications Settings CRUD**
   - Thêm state `notifications`
   - Thêm default values
   - Bind UI với state
   - Test save/load

3. **Fix Security & Advanced Settings**
   - Bind inputs với state hiện có
   - Test save/load

4. **Add Validation**
   - Email format validation
   - SMTP connection test
   - Password policy enforcement




