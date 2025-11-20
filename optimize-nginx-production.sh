#!/bin/bash

# Script tối ưu nginx config cho production
# Chạy với quyền root: sudo bash optimize-nginx-production.sh

if [ "$EUID" -ne 0 ]; then 
    echo "Vui lòng chạy script này với quyền root (sudo)"
    exit 1
fi

echo "=========================================="
echo "  TỐI ƯU NGINX CHO PRODUCTION"
echo "=========================================="
echo ""

# Backup configs
echo "Đang backup configs..."
cp /etc/nginx/sites-available/banyco-demo.pressup.vn /etc/nginx/sites-available/banyco-demo.pressup.vn.backup.$(date +%Y%m%d_%H%M%S)
cp /etc/nginx/sites-available/admin.banyco-demo.pressup.vn /etc/nginx/sites-available/admin.banyco-demo.pressup.vn.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Đã backup"
echo ""

# Tối ưu config cho main domain
cat > /etc/nginx/sites-available/banyco-demo.pressup.vn << 'NGINXEOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name banyco-demo.pressup.vn;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name banyco-demo.pressup.vn;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/banyco-demo.pressup.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/banyco-demo.pressup.vn/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Cache static files from Next.js
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable, max-age=31536000";
        expires 1y;
    }

    # Frontend - Ecommerce (Port 3000)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Production: không cần WebSocket cho HMR
        # proxy_read_timeout 86400;  # Chỉ cần cho dev
    }

    # Backend API (Port 3011)
    location /api/ {
        proxy_pass http://127.0.0.1:3011/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Production optimizations
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
    
    # Static files and uploads from backend (với cache)
    location /uploads/ {
        proxy_pass http://127.0.0.1:3011/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        
        # Cache uploads
        proxy_cache_valid 200 1h;
        add_header Cache-Control "public, max-age=3600";
        expires 1h;
    }
}
NGINXEOF

# Tối ưu config cho admin domain
cat > /etc/nginx/sites-available/admin.banyco-demo.pressup.vn << 'NGINXEOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name admin.banyco-demo.pressup.vn;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name admin.banyco-demo.pressup.vn;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/banyco-demo.pressup.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/banyco-demo.pressup.vn/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Cache static files from Next.js
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3013;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable, max-age=31536000";
        expires 1y;
    }

    # CMS Admin Frontend (Port 3013)
    location / {
        proxy_pass http://127.0.0.1:3013;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Production: không cần WebSocket cho HMR
    }

    # Backend API (shared with main site)
    location /api/ {
        proxy_pass http://127.0.0.1:3011/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
    
    # Static files and uploads from backend
    location /uploads/ {
        proxy_pass http://127.0.0.1:3011/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        
        # Cache uploads
        proxy_cache_valid 200 1h;
        add_header Cache-Control "public, max-age=3600";
        expires 1h;
    }
}
NGINXEOF

echo "✅ Đã tạo config tối ưu"
echo ""

# Test nginx config
echo "Đang kiểm tra cấu hình nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Cấu hình nginx hợp lệ"
    echo ""
    echo "Đang reload nginx..."
    systemctl reload nginx
    echo "✅ Nginx đã được reload với config tối ưu"
    echo ""
    echo "🎉 Tối ưu hoàn tất!"
    echo ""
    echo "Các tối ưu đã áp dụng:"
    echo "  ✅ Gzip compression"
    echo "  ✅ Cache cho static files (_next/static)"
    echo "  ✅ Cache cho uploads"
    echo "  ✅ Proxy buffering"
    echo "  ✅ Bỏ WebSocket HMR (không cần cho production)"
else
    echo "❌ Cấu hình nginx có lỗi. Kiểm tra lại!"
    exit 1
fi

