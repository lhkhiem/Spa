# 📊 Hướng Dẫn Thống Kê Lưu Lượng Truy Cập

## ✅ Đã Tích Hợp

### 1. **Backend API** (CMS)
- ✅ Endpoint: `/api/public/tracking-scripts/active`
- ✅ Hỗ trợ filter theo page
- ✅ Tự động sắp xếp theo priority

### 2. **Frontend Integration** (Ecommerce)
- ✅ Component `TrackingScripts` tự động load scripts từ CMS
- ✅ Hỗ trợ cả position `head` và `body`
- ✅ Tối ưu với Next.js Script component
- ✅ Tích hợp vào root layout

---

## 🚀 Cách Sử Dụng

### Bước 1: Cấu Hình Google Analytics trong CMS

1. **Truy cập CMS Admin:**
   ```
   http://your-domain/dashboard/tracking-scripts
   ```

2. **Sửa script "Thống kê truy cập":**
   - Name: `Google Analytics`
   - Type: `Analytics`
   - Provider: `Google`
   - **Position: `Head`** (Khuyến nghị thay vì Body)
   - Load Strategy: `Sync` (vì đã có async trong code)
   - Script Code:
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XJGRHQTJEF"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XJGRHQTJEF');
   </script>
   ```
   - Pages: `all`
   - Priority: `0`
   - ✅ Active: **Checked**

3. **Bấm Update**

### Bước 2: Restart Frontend

```bash
cd /var/www/Spa/Ecommerce
pm2 restart ecommerce
```

### Bước 3: Kiểm Tra

1. **Mở website:**
   ```
   http://your-frontend-domain
   ```

2. **Mở Developer Tools (F12):**
   - Tab **Console**, gõ:
   ```javascript
   dataLayer
   ```
   - Nếu hiển thị array → ✅ Thành công!

3. **Kiểm tra Network:**
   - Tab **Network**
   - Filter: `google-analytics` hoặc `gtag`
   - Reload trang
   - Nếu thấy requests → ✅ Đang gửi dữ liệu!

4. **Kiểm tra Google Analytics:**
   - Vào: https://analytics.google.com
   - Reports → Realtime
   - Mở website → Sẽ thấy 1 active user

---

## 📈 Xem Thống Kê

### Google Analytics Dashboard

1. **Real-time:**
   - Xem lượt truy cập trực tiếp
   - Xem trang nào đang được xem
   - Xem vị trí địa lý

2. **Reports:**
   - **User Acquisition:** Nguồn traffic (organic, direct, social, etc.)
   - **Engagement:** Pageviews, average time, bounce rate
   - **Demographics:** Tuổi, giới tính, sở thích
   - **Technology:** Device, browser, OS
   - **Locations:** Country, city

3. **Custom Reports:**
   - Tạo báo cáo tùy chỉnh theo nhu cầu
   - Export data ra CSV/PDF

---

## 🎯 Thêm Tracking Scripts Khác

### Facebook Pixel

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

**Cấu hình:**
- Type: `Pixel`
- Provider: `Facebook`
- Position: `Head`
- Priority: `1`

### Google Tag Manager

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
<!-- End Google Tag Manager -->
```

**Cấu hình:**
- Type: `Tag Manager`
- Provider: `Google`
- Position: `Head`
- Priority: `0` (load trước)

---

## 🔧 Tùy Chỉnh

### Filter Theo Page

Nếu muốn script chỉ load ở một số trang:

**Ví dụ: Chỉ load ở trang sản phẩm**
- Pages: `products`

**Ví dụ: Load ở nhiều trang**
- Pages: `home, products, cart, checkout`

**Load ở tất cả trang:**
- Pages: `all`

### Priority (Thứ tự load)

- Priority `0`: Load đầu tiên
- Priority `1`: Load sau
- Priority `2`: Load cuối

Ví dụ:
1. Google Tag Manager: Priority `0`
2. Google Analytics: Priority `1`
3. Facebook Pixel: Priority `2`

---

## 🐛 Troubleshooting

### Script không load?

1. **Kiểm tra CMS:**
   - Script có Active không?
   - Pages có đúng không?

2. **Restart frontend:**
   ```bash
   pm2 restart ecommerce
   ```

3. **Clear cache:**
   ```bash
   # Clear Next.js cache
   cd /var/www/Spa/Ecommerce
   rm -rf .next
   npm run build
   pm2 restart ecommerce
   ```

### Google Analytics không hiển thị data?

1. **ID đúng chưa?**
   - Kiểm tra `G-XJGRHQTJEF` có phải ID thật không

2. **Chờ vài phút:**
   - Google Analytics cần vài phút để process data

3. **Kiểm tra Ad Blocker:**
   - Tắt Ad Blocker và thử lại

---

## 📝 Notes

- Scripts được cache trong 0 giây (`cache: 'no-store'`) để luôn fresh
- Hỗ trợ async/defer strategies
- Tự động clean và sanitize script code
- Tương thích với Next.js 13+ App Router
- Server-side rendering ready

---

## 🎉 Hoàn Thành!

Bây giờ bạn đã có:
- ✅ Hệ thống quản lý tracking scripts trong CMS
- ✅ Tự động inject scripts vào frontend
- ✅ Google Analytics tracking hoạt động
- ✅ Dễ dàng thêm scripts khác (Facebook Pixel, etc.)

**Truy cập Google Analytics để xem thống kê:**
👉 https://analytics.google.com

