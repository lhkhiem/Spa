# Fix www.banyco.vn DNS cho SSL

## 🔍 Vấn đề

Let's Encrypt không thể verify `www.banyco.vn` vì:
- `www.banyco.vn` đang là **CNAME** trỏ về `banyco.vn`
- Let's Encrypt cần **A record** trực tiếp cho `www.banyco.vn`

## ✅ Giải pháp

### Option 1: Thêm A record cho www.banyco.vn (Khuyến nghị)

**Trong DNS management panel:**
1. Thêm A record mới:
   - **NAME**: `www`
   - **TYPE**: `A` (không phải CNAME)
   - **CONTENT**: `14.225.205.116`
   - **TTL**: `1 hour`

2. Xóa CNAME record cũ (nếu có)

3. Đợi 10-15 phút để DNS propagate

4. Sau đó thêm www vào certificate:
   ```bash
   sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand
   ```

### Option 2: Setup SSL cho 3 domain trước (Không có www)

Chạy script này để setup SSL cho 3 domain đã chắc chắn:

```bash
cd /var/www/Spa
sudo ./setup-ssl-banyco-vn-no-www.sh
```

Script sẽ setup SSL cho:
- `banyco.vn`
- `api.banyco.vn`
- `admin.banyco.vn`

Sau đó, khi đã thêm A record cho `www.banyco.vn`, thêm vào certificate:
```bash
sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand
```

### Option 3: Thử thêm www ngay (Nếu CNAME resolve đúng)

Nếu CNAME đang resolve đúng, có thể thử:

```bash
sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand
```

Nhưng thường sẽ fail vì Let's Encrypt cần A record.

## 📋 Tóm tắt

1. **Setup SSL cho 3 domain trước** (không có www):
   ```bash
   sudo ./setup-ssl-banyco-vn-no-www.sh
   ```

2. **Thêm A record cho www.banyco.vn** trong DNS management

3. **Đợi 10-15 phút** để DNS propagate

4. **Thêm www vào certificate**:
   ```bash
   sudo certbot --nginx -d banyco.vn -d www.banyco.vn --expand
   ```

## 🔍 Kiểm tra DNS

Sau khi thêm A record, kiểm tra:

```bash
dig +short www.banyco.vn
# Should return: 14.225.205.116 (not banyco.vn.)

dig www.banyco.vn
# Should show A record, not CNAME
```

## ✅ Sau khi hoàn thành

Bạn sẽ có SSL cho:
- ✅ `https://banyco.vn`
- ✅ `https://www.banyco.vn` (sau khi thêm A record)
- ✅ `https://api.banyco.vn`
- ✅ `https://admin.banyco.vn`



