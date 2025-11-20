# Setup CMS Admin Domain

## Option 1: Subdomain (Recommended) - admin.banyco-demo.pressup.vn

### Bước 1: Cấu hình DNS
Thêm A record cho subdomain:
```
Type: A
Host: admin
Value: 14.225.205.116 (IP server của bạn)
TTL: 300
```

### Bước 2: Deploy Nginx config cho CMS
```bash
sudo cp /var/www/Spa/nginx-cms-admin.conf /etc/nginx/sites-available/admin.banyco-demo.pressup.vn
sudo ln -sf /etc/nginx/sites-available/admin.banyco-demo.pressup.vn /etc/nginx/sites-enabled/admin.banyco-demo.pressup.vn
sudo nginx -t
sudo systemctl reload nginx
```

### Bước 3: Update CMS Frontend env
```bash
cd /var/www/Spa/CMS/frontend/admin
cat > .env.local << 'ENVEOF'
NEXT_PUBLIC_API_URL=http://admin.banyco-demo.pressup.vn/api
ENVEOF
```

### Bước 4: Restart CMS Frontend
```bash
# Kill old process
pkill -f "next dev.*3013"

# Start new
cd /var/www/Spa/CMS/frontend/admin
npm run dev &
```

### Bước 5: Restart Backend (để load CORS mới)
```bash
# Kill
pkill -f "ts-node.*backend"

# Start
cd /var/www/Spa/CMS/backend
npm run dev &
```

### Test:
- CMS Admin: http://admin.banyco-demo.pressup.vn
- API from CMS: http://admin.banyco-demo.pressup.vn/api/health

---

## Option 2: Same domain with different port

Nếu không muốn tạo subdomain, có thể truy cập:
- Website: http://banyco-demo.pressup.vn (port 3000)
- CMS Admin: http://14.225.205.116:3013 (direct port access)

---

## Summary of All Domains:

### Production (Domain):
- **Website:** http://banyco-demo.pressup.vn
- **API:** http://banyco-demo.pressup.vn/api
- **CMS Admin:** http://admin.banyco-demo.pressup.vn (sau khi setup DNS)

### Development (Localhost):
- **Website:** http://localhost:3000
- **API:** http://localhost:3011/api
- **CMS Admin:** http://localhost:3013

