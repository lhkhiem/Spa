# Deployment Guide

## Environment Configuration

### Frontend Admin (.env.local)

Copy `frontend/admin/env.example` to `frontend/admin/.env.local` and configure:

```env
# Production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com

# Local Development (uncomment)
# NEXT_PUBLIC_API_URL=http://localhost:3011
# NEXT_PUBLIC_BACKEND_URL=http://localhost:3011
```

### Backend (.env)

Configure backend environment in `backend/.env`:

```env
# Server
PORT=3011
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cms_db
DB_USER=cms_user
DB_PASSWORD=your_secure_password

# CORS Origins
ADMIN_ORIGIN=https://admin.yourdomain.com
WEBSITE_ORIGIN=https://yourdomain.com

# JWT
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key
```

## Deployment Steps

### 1. Backend

```bash
cd backend
npm install
npm run build
npm start
```

Or with PM2:

```bash
pm2 start npm --name "cms-backend" -- start
```

### 2. Frontend Admin

```bash
cd frontend/admin
npm install
npm run build
npm start
```

Or with PM2:

```bash
pm2 start npm --name "cms-admin" -- start
```

## Production Checklist

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] HTTPS/SSL certificates installed
- [ ] CORS origins configured correctly
- [ ] File upload directory permissions set
- [ ] Backend health check passes (`/api/health`)
- [ ] Admin login works
- [ ] Media uploads work
- [ ] All API endpoints accessible

## Troubleshooting

### API Connection Issues

Check that `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_BACKEND_URL` match your backend domain.

### CORS Errors

Verify `ADMIN_ORIGIN` and `WEBSITE_ORIGIN` in backend `.env` match your frontend domains.

### File Upload Failures

Ensure `backend/storage/uploads` and `backend/storage/temp` directories exist and are writable.

















