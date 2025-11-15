# 🔧 TROUBLESHOOTING GUIDE

## Frontend không chạy được?

### ✅ Status Hiện Tại

- **Port:** 3000 đang LISTENING
- **Process:** Node đang chạy (PID: 12684)
- **Dependencies:** Đã cài đặt (410 packages)

---

## 🔍 Debugging Steps

### 1. Kiểm Tra Process

```powershell
# Xem process đang chạy
Get-Process -Name node

# Check port 3000
netstat -ano | findstr ":3000"
```

### 2. Kill Process và Restart

```powershell
# Stop tất cả Node processes
Get-Process -Name node | Stop-Process -Force

# Clear Next.js cache
cd D:\PROJECT\StudyProject\Cursor\ecommerce-template-01
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Start lại
npm run dev
```

### 3. Kiểm Tra Logs

Mở terminal và chạy:
```powershell
cd D:\PROJECT\StudyProject\Cursor\ecommerce-template-01
npm run dev
```

Quan sát output để xem có lỗi gì không.

### 4. Test với Port Khác

Next.js có thể đã switch sang port khác nếu 3000 bị occupied.

Check terminal output để biết chính xác port nào.

---

## 🐛 Common Issues

### Issue 1: ERR_CONNECTION_REFUSED

**Nguyên nhân:** Browser không kết nối được với localhost

**Giải pháp:**
```powershell
# 1. Kiểm tra firewall
netsh advfirewall show allprofiles

# 2. Allow localhost
netsh advfirewall firewall add rule name="Allow Localhost" dir=in action=allow protocol=TCP localport=3000

# 3. Test curl
curl http://localhost:3000
```

### Issue 2: Port Already in Use

**Nguyên nhân:** Port 3000 đang được sử dụng bởi process khác

**Giải pháp:**
```powershell
# Find process using port 3000
netstat -ano | findstr ":3000"

# Kill process
taskkill /PID <process_id> /F

# Or use different port
PORT=3001 npm run dev
```

### Issue 3: Build Errors

**Nguyên nhân:** TypeScript compilation errors

**Giải pháp:**
```powershell
# Check for TypeScript errors
npm run type-check

# Try clean build
Remove-Item -Recurse -Force .next
npm run build
npm run dev
```

### Issue 4: Module Not Found

**Nguyên nhân:** Dependencies chưa được cài đặt hoặc corrupted

**Giải pháp:**
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run dev
```

### Issue 5: Tailwind CSS Not Working

**Nguyên nhân:** PostCSS config issues

**Giải pháp:**
```powershell
# Verify postcss.config.js exists
# Verify tailwind.config.ts is correct
# Try rebuild
Remove-Item -Recurse -Force .next
npm run dev
```

---

## ✅ Verification Checklist

- [ ] Node.js installed (v18+)
- [ ] npm installed
- [ ] Dependencies installed (410 packages)
- [ ] No TypeScript errors
- [ ] Port 3000 available
- [ ] Firewall not blocking
- [ ] No antivirus interfering

---

## 🆘 Still Not Working?

### Nuclear Option

```powershell
# 1. Stop everything
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Clean everything
cd D:\PROJECT\StudyProject\Cursor\ecommerce-template-01
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# 3. Fresh install
npm install

# 4. Start
npm run dev
```

---

## 📞 Additional Help

### Check Node Version
```powershell
node --version  # Should be 18+
npm --version
```

### Check Next.js Version
```powershell
npx next --version
```

### View All Running Services
```powershell
netstat -ano | findstr "LISTENING"
```

---

*Last Updated: 2025-01-31*

