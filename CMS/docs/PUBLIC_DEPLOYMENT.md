# Triển khai qua IP public 116.100.161.72

## Backend (`backend`)

- Tạo file `.env` dựa theo ví dụ:
  ```env
  PORT=3011
  NODE_ENV=production
  PUBLIC_IP=116.100.161.72
  ADMIN_ORIGIN=http://116.100.161.72:3013
  WEBSITE_ORIGIN=http://116.100.161.72:3000

  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=spa_cms_db
  DB_USER=spa_cms_user
  DB_PASSWORD=spa_cms_password

  JWT_SECRET=điền_chuỗi_bảo_mật
  SESSION_SECRET=điền_chuỗi_bảo_mật
  UPLOAD_PATH=./storage/uploads
  ```
- Cài đặt và build:
  ```bash
  cd backend
  npm install
  npm run build
  npm start # hoặc pm2 start npm --name "cms-backend" -- start
  ```
- Kiểm tra ngoài mạng: `http://116.100.161.72:3011/api/health`.

## Frontend admin (`frontend/admin`)

- Tạo `.env.local`:
  ```env
  NEXT_PUBLIC_API_URL=http://116.100.161.72:3011
  NEXT_PUBLIC_BACKEND_URL=http://116.100.161.72:3011
  ```
- Build và chạy production:
  ```bash
  cd frontend/admin
  npm install
  npm run build
  npm start # port 3013
  ```

## Frontend client (port 3000)

- Đặt `NEXT_PUBLIC_API_URL=http://116.100.161.72:3011` trong file env của dự án client.
- Khởi chạy (ví dụ Next.js):
  ```bash
  npm install
  npm run dev # hoặc build/start theo môi trường thật
  ```

## Mạng và bảo mật

- NAT router 3011, 3013, 3000 -> máy chạy dự án.
- Mở firewall Windows/OS cho 3 port TCP trên.
- Duy trì tiến trình (PM2/Service) để backend và frontend luôn chạy.
- Nếu cần HTTPS, cấu hình reverse proxy (Nginx/Caddy) và chứng chỉ.









