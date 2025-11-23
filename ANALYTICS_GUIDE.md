# 📊 Self-Hosted Analytics System - Hướng Dẫn Sử Dụng

## ✅ Hệ Thống Đã Hoàn Thành

### Components:
1. ✅ **Database:** `analytics_events` table + `analytics_daily_summary` table
2. ✅ **Backend API:** Track pageviews & Get statistics
3. ✅ **Frontend Tracking:** Automatic tracking on every pageview
4. ✅ **CMS Dashboard:** Real-time analytics dashboard

---

## 📈 Features Tương Tự Google Analytics

### ✅ Metrics Cơ Bản:
- **Pageviews:** Tổng số lượt xem trang
- **Unique Visitors:** Số người duy nhất (dùng localStorage cookie)
- **Sessions:** Số phiên truy cập (30 phút timeout)
- **Bounce Rate:** Tỷ lệ thoát (user chỉ xem 1 trang)
- **Avg Session Duration:** Thời gian trung bình trên site
- **Pages per Session:** Số trang xem trung bình mỗi session

### ✅ Traffic Analysis:
- **Traffic Sources:** Direct, Organic, Referral, Social, Email, Paid
- **Referrers:** Website nào dẫn đến
- **UTM Tracking:** utm_source, utm_medium, utm_campaign, utm_term, utm_content
- **Top Pages:** Pages được xem nhiều nhất

### ✅ Technology:
- **Devices:** Desktop, Mobile, Tablet
- **Browsers:** Chrome, Firefox, Safari, Edge, etc.
- **Operating Systems:** Windows, macOS, Linux, Android, iOS
- **Screen Resolutions:** 1920x1080, 1366x768, etc.

### ✅ Real-time:
- **Active Users:** Users trong 5 phút qua (Google là 30 phút)
- **Active Pages:** Pages đang được xem
- **Auto-refresh:** 30 giây (có thể tắt/bật)

---

## 🔧 API Endpoints

### 1. Track Pageview (Public - No Auth Required)
```bash
POST /api/analytics/track

Body:
{
  "page_url": "https://banyco-demo.pressup.vn/products",
  "page_title": "Products Page",
  "page_path": "/products",
  "referrer": "https://google.com",
  "visitor_id": "visitor_xxx",
  "session_id": "session_xxx",
  "user_agent": "Mozilla/5.0...",
  "screen_width": 1920,
  "screen_height": 1080,
  "viewport_width": 1400,
  "viewport_height": 900,
  "utm_source": "google",
  "utm_medium": "organic",
  "time_on_page": 45  // optional, in seconds
}

Response:
{
  "success": true,
  "id": "uuid"
}
```

### 2. Get Analytics Stats (Admin - Auth Required)
```bash
GET /api/analytics/stats?period=7d

Query Params:
- period: '1d' | '7d' | '30d' | '90d'
- OR start_date: '2025-01-01' & end_date: '2025-01-31'

Response:
{
  "success": true,
  "data": {
    "overview": {
      "total_pageviews": 1234,
      "unique_visitors": 567,
      "total_sessions": 890,
      "avg_session_duration": 180,  // seconds
      "avg_pages_per_session": 2.5,
      "bounce_rate": 45.5,  // percentage
      "active_users": 3  // last 5 minutes
    },
    "trend": {
      "pageviews_change": 12.5,  // percentage vs previous period
      "visitors_change": 8.3,
      "sessions_change": 10.1
    },
    "top_pages": [...],
    "traffic_sources": [...],
    "devices": [...],
    "browsers": [...],
    "realtime": {...}
  }
}
```

### 3. Get Realtime Stats (Admin - Auth Required)
```bash
GET /api/analytics/realtime

Response:
{
  "success": true,
  "data": {
    "active_users": 3,
    "active_pages": [
      {"page_path": "/products", "users": 2},
      {"page_path": "/", "users": 1}
    ],
    "pageviews_by_minute": [...]
  }
}
```

---

## 🎯 Cách Sử Dụng

### 1. Xem Dashboard:
```
1. Đăng nhập CMS Admin: https://cms-admin.pressup.vn
2. Vào menu: Analytics
3. Xem real-time stats!
```

### 2. Tracking Tự Động:
- Frontend đã có `AnalyticsTracker` component
- Tự động track mỗi khi user:
  - Vào trang mới
  - Rời khỏi trang (ghi time_on_page)
- Không cần config gì thêm!

### 3. Filter Theo Thời Gian:
- **Today:** Traffic hôm nay
- **Last 7 Days:** Trend tuần (mặc định)
- **Last 30 Days:** Trend tháng
- **Last 90 Days:** Long-term trend

### 4. Auto-Refresh:
- Toggle ON: Tự động refresh mỗi 30 giây
- Toggle OFF: Chỉ refresh khi reload trang

---

## 🔍 Tracking Details

### Visitor ID:
- Lưu trong `localStorage`: `analytics_visitor_id`
- Tồn tại mãi mãi (until user clears cache)
- Unique per browser/device

### Session ID:
- Lưu trong `sessionStorage`: `analytics_session_id`
- Hết hạn sau 30 phút không hoạt động
- Hết hạn khi đóng browser
- Unique per session

### Traffic Source Detection:
- **Direct:** Không có referrer
- **Organic:** Từ Google, Bing, DuckDuckGo
- **Social:** Từ Facebook, Instagram, Twitter, LinkedIn
- **Referral:** Từ website khác
- **Email:** UTM có "email" hoặc "newsletter"
- **Paid:** UTM có source khác Google/Bing

### Device Detection:
- **Desktop:** Default
- **Mobile:** UA contains "mobile" or "android" (not tablet)
- **Tablet:** UA contains "tablet" or "ipad"

---

## 📊 Dashboard Features

### Overview Cards:
1. **Page Views** - Total pageviews with trend
2. **Unique Visitors** - Unique visitors with trend
3. **Avg Session** - Average session duration
4. **Active Now** - Real-time active users (last 5 min) with live indicator

### Secondary Stats:
- Total Sessions
- Bounce Rate
- Pages/Session

### Top Pages:
- List of most viewed pages
- Shows pageviews & unique visitors per page

### Traffic Sources:
- Visual bars showing traffic distribution
- Percentage breakdown

### Devices:
- Desktop vs Mobile vs Tablet
- Visual percentage bars

### Top Browsers:
- Chrome, Firefox, Safari, Edge, etc.
- Count per browser

### Realtime Section (Only shown if active users > 0):
- Live indicator
- Active users count
- Pages being viewed right now
- Updates every 30 seconds

---

## 🛠️ Maintenance

### Clean Old Data:
```sql
-- Delete events older than 90 days
DELETE FROM analytics_events 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Update daily summary
SELECT update_analytics_daily_summary();
```

### Performance:
- Indexes được tạo sẵn cho queries nhanh
- Daily summary table giảm load cho historical queries
- Auto-vacuum PostgreSQL sẽ maintain performance

---

## 🎯 Custom Events (Tương Lai)

Có thể extend để track custom events:

```javascript
// Track button click
trackEvent('button_click', {
  button_name: 'Add to Cart',
  product_id: '123'
});

// Track form submission
trackEvent('form_submit', {
  form_name: 'Contact Form'
});

// Track video play
trackEvent('video_play', {
  video_title: 'Product Demo'
});
```

---

## ✅ So Sánh: Google vs Self-Hosted

| Feature | Google Analytics | Self-Hosted (CMS) |
|---------|------------------|-------------------|
| Setup | Easy | Done ✅ |
| Real-time | 30 min delay | 5 min (faster!) |
| Data Ownership | Google | You ✅ |
| Privacy | Shared with Google | 100% Private ✅ |
| Cost | Free | Free ✅ |
| Customization | Limited | Full control ✅ |
| Demographics | Yes | No |
| Advanced ML | Yes | No |
| Custom Events | Yes | Can add ✅ |

---

## 🎊 Hoàn Thành!

Bạn giờ có:
1. ✅ Google Analytics (advanced features)
2. ✅ Self-Hosted Analytics trong CMS (full control)
3. ✅ Best of both worlds!

**Vào CMS Dashboard → Analytics để xem thống kê ngay!** 🚀

