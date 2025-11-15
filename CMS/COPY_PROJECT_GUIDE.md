# 📦 Hướng dẫn Copy Dự án sang Repo Mới

## Phương pháp 1: Sử dụng Script (Khuyến nghị)

### Windows (PowerShell):
```powershell
.\copy-project.ps1 -DestinationPath "C:\path\to\new\repo"
```

### Linux/Mac:
```bash
chmod +x copy-project.sh
./copy-project.sh /path/to/new/repo
```

## Phương pháp 2: Copy thủ công

### Bước 1: Tạo thư mục mới
```bash
mkdir new-repo-name
cd new-repo-name
```

### Bước 2: Copy toàn bộ files (trừ .git và node_modules)
```bash
# Windows
xcopy /E /I /EXCLUDE:exclude.txt ..\cms-pressup\* .

# Linux/Mac
rsync -av --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='dist' ../cms-pressup/ .
```

### Bước 3: Khởi tạo Git mới
```bash
git init
git add .
git commit -m "Initial commit"
```

### Bước 4: Kết nối với repo mới
```bash
git remote add origin <your-new-repo-url>
git branch -M main
git push -u origin main
```

## Phương pháp 3: Clone và thay đổi remote

### Bước 1: Clone repo hiện tại
```bash
git clone https://github.com/truongnn001/cms-pressup.git new-repo-name
cd new-repo-name
```

### Bước 2: Xóa remote cũ và thêm remote mới
```bash
git remote remove origin
git remote add origin <your-new-repo-url>
```

### Bước 3: Push lên repo mới
```bash
git push -u origin main
```

## Phương pháp 4: Export toàn bộ code (không có git history)

### Bước 1: Tạo archive
```bash
# Windows
tar -czf project-backup.tar.gz --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='dist' .

# Linux/Mac
tar -czf project-backup.tar.gz --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='dist' .
```

### Bước 2: Giải nén ở repo mới
```bash
mkdir new-repo
cd new-repo
tar -xzf ../project-backup.tar.gz
git init
git add .
git commit -m "Initial commit"
```

## ⚠️ Lưu ý quan trọng

### Files cần loại trừ khi copy:
- `.git/` - Git history
- `node_modules/` - Dependencies (sẽ cài lại)
- `.next/` - Next.js build files
- `dist/` - Build output
- `.env` và `.env.local` - Environment variables (cần tạo mới)
- `backend/storage/uploads/*` - Uploaded files
- `*.log` - Log files

### Files cần giữ lại:
- `package.json` - Dependencies list
- Source code (`src/`, `app/`, etc.)
- Config files (`tsconfig.json`, `next.config.ts`, etc.)
- Migration files
- Documentation

### Sau khi copy, cần làm:

1. **Cài đặt dependencies:**
```bash
# Backend
cd backend
npm install

# Frontend Admin
cd frontend/admin
npm install
```

2. **Tạo file .env:**
```bash
# Copy từ .env.example nếu có
# Hoặc tạo mới với các biến môi trường cần thiết
```

3. **Chạy migrations:**
```bash
cd backend
npm run migrate
# hoặc
node src/migrations/run-migrations.js
```

4. **Kiểm tra database connection:**
- Cập nhật `DATABASE_URL` trong `.env`
- Đảm bảo database đã được tạo

## 📋 Checklist sau khi copy

- [ ] Dependencies đã được cài đặt
- [ ] File `.env` đã được tạo và cấu hình
- [ ] Database connection đã được test
- [ ] Migrations đã được chạy
- [ ] Backend server chạy được (`npm run dev`)
- [ ] Frontend admin chạy được (`npm run dev`)
- [ ] Git đã được khởi tạo và push lên repo mới

---

*Nếu gặp vấn đề, kiểm tra lại các file config và environment variables.*

