#!/bin/bash

# Script để cập nhật nginx config cho SSL
# Chạy với quyền root: sudo bash update-nginx-ssl.sh

if [ "$EUID" -ne 0 ]; then 
    echo "Vui lòng chạy script này với quyền root (sudo)"
    exit 1
fi

echo "=== Cập nhật Nginx config cho SSL ==="

# Backup configs
echo "Đang backup configs..."
cp /etc/nginx/sites-available/banyco-demo.pressup.vn /etc/nginx/sites-available/banyco-demo.pressup.vn.backup
cp /etc/nginx/sites-available/admin.banyco-demo.pressup.vn /etc/nginx/sites-available/admin.banyco-demo.pressup.vn.backup
cp /etc/nginx/sites-available/api.banyco-demo.pressup.vn /etc/nginx/sites-available/api.banyco-demo.pressup.vn.backup

echo "✅ Đã backup configs"
echo ""

# Kiểm tra SSL certificates
if [ ! -d "/etc/letsencrypt/live/banyco-demo.pressup.vn" ]; then
    echo "❌ SSL certificates chưa được tạo. Chạy: sudo bash setup-ssl.sh"
    exit 1
fi

echo "✅ SSL certificates đã tồn tại"
echo ""

# Tạo config mới với SSL
echo "Đang tạo config mới..."

# Main domain
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
        
        # WebSocket support for Next.js HMR
        proxy_read_timeout 86400;
    }

    # Backend API (Port 3011)
    location /api/ {
        proxy_pass http://127.0.0.1:3011/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers are handled by backend
        # Increase timeout for API requests
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
    
    # Static files and uploads from backend
    location /uploads/ {
        proxy_pass http://127.0.0.1:3011/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
NGINXEOF

# Admin subdomain
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
        
        # WebSocket support for Next.js HMR
        proxy_read_timeout 86400;
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
    }
    
    # Static files and uploads from backend
    location /uploads/ {
        proxy_pass http://127.0.0.1:3011/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
NGINXEOF

# API subdomain
cat > /etc/nginx/sites-available/api.banyco-demo.pressup.vn << 'NGINXEOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.banyco-demo.pressup.vn;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name api.banyco-demo.pressup.vn;

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

    location / {
        proxy_pass http://127.0.0.1:3011;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

echo "✅ Đã tạo config mới"
echo ""

# Test nginx config
echo "Đang kiểm tra cấu hình nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Cấu hình nginx hợp lệ"
    echo ""
    echo "Đang reload nginx..."
    systemctl reload nginx
    echo "✅ Nginx đã được reload"
    echo ""
    echo "🎉 SSL đã được cấu hình thành công!"
    echo ""
    echo "Các domain hiện đã hỗ trợ HTTPS:"
    echo "  - https://banyco-demo.pressup.vn"
    echo "  - https://admin.banyco-demo.pressup.vn"
    echo "  - https://api.banyco-demo.pressup.vn"
else
    echo "❌ Cấu hình nginx có lỗi. Kiểm tra lại!"
    exit 1
fi

