# ⚠️ DNS Records Cần Được Thêm

## 🔍 Vấn đề hiện tại

Kiểm tra DNS cho thấy:
- ✅ `api.banyco.vn` → `14.225.205.116` (OK)
- ✅ `admin.banyco.vn` → `14.225.205.116` (OK)
- ❌ `banyco.vn` → **KHÔNG CÓ A RECORD** (Vấn đề!)
- ❌ `www.banyco.vn` → CNAME trỏ về `banyco.vn` nhưng `banyco.vn` không có A record

## ✅ Giải pháp

### Bước 1: Thêm DNS Records

Vào DNS management panel và thêm các records sau:

#### 1. A Record cho banyco.vn (QUAN TRỌNG NHẤT)
- **NAME**: `@` hoặc `banyco.vn`
- **TYPE**: `A`
- **CONTENT**: `14.225.205.116`
- **TTL**: `1 hour`

#### 2. A Record cho www.banyco.vn (hoặc CNAME)
**Option A - A Record:**
- **NAME**: `www`
- **TYPE**: `A`
- **CONTENT**: `14.225.205.116`
- **TTL**: `1 hour`

**Option B - CNAME (nếu đã có A record cho banyco.vn):**
- **NAME**: `www`
- **TYPE**: `CNAME`
- **CONTENT**: `banyco.vn`
- **TTL**: `1 hour`

### Bước 2: Đợi DNS Propagate

Sau khi thêm DNS records, đợi **5-30 phút** để DNS propagate.

Kiểm tra DNS:
```bash
dig +short banyco.vn
# Should return: 14.225.205.116

dig +short www.banyco.vn
# Should return: 14.225.205.116 (nếu dùng A record)
# Hoặc: banyco.vn. (nếu dùng CNAME, sau đó resolve về 14.225.205.116)
```

### Bước 3: Setup SSL

Sau khi DNS đã propagate, chạy script tự động:

```bash
cd /var/www/Spa
sudo ./setup-ssl-banyco-vn-fix.sh
```

Script sẽ tự động:
- Kiểm tra DNS records
- Chỉ setup SSL cho các domain đã có DNS
- Hướng dẫn thêm domain còn thiếu sau

## 🚀 Giải pháp tạm thời

Nếu muốn setup SSL ngay cho các domain đã có DNS (api, admin), chạy:

```bash
sudo certbot --nginx \
  -d api.banyco.vn \
  -d admin.banyco.vn \
  --non-interactive \
  --agree-tos \
  --email sales@banyco.net
```

Sau đó, khi `banyco.vn` và `www.banyco.vn` DNS đã sẵn sàng, thêm vào:

```bash
sudo certbot --nginx \
  -d banyco.vn \
  -d www.banyco.vn \
  --non-interactive \
  --agree-tos \
  --email sales@banyco.net
```

## 📋 Tóm tắt DNS Records cần có

| Domain | Type | Content | Status |
|--------|------|---------|--------|
| `banyco.vn` | A | `14.225.205.116` | ❌ **CẦN THÊM** |
| `www.banyco.vn` | A hoặc CNAME | `14.225.205.116` hoặc `banyco.vn` | ❌ **CẦN THÊM** |
| `api.banyco.vn` | A | `14.225.205.116` | ✅ Đã có |
| `admin.banyco.vn` | A | `14.225.205.116` | ✅ Đã có |

## 🔍 Kiểm tra DNS sau khi thêm

```bash
# Kiểm tra từng domain
dig +short banyco.vn
dig +short www.banyco.vn
dig +short api.banyco.vn
dig +short admin.banyco.vn

# Hoặc kiểm tra chi tiết
dig banyco.vn
dig www.banyco.vn
```

Tất cả nên trả về `14.225.205.116` (hoặc CNAME resolve về IP này).



