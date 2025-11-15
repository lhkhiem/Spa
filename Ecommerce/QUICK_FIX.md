# ⚡ QUICK FIX - Vỡ Layout

## 🎯 Vấn Đề

Frontend chạy nhưng **bị vỡ định dạng** → có thể Tailwind CSS không load.

---

## ✅ Test Ngay

### 1. Test Tailwind CSS

Truy cập: **http://localhost:3000/test**

**Kỳ vọng:**
- Nền xanh dương đậm
- Chữ trắng "✅ Test: Tailwind CSS Working!"

**Nếu vẫn trắng:** Tailwind KHÔNG working → có vấn đề config

---

## 🛠️ Nếu Tailwind KHÔNG Working

### Option 1: Restart Server

```powershell
# Stop
Ctrl+C trong terminal

# Start lại
npm run dev
```

### Option 2: Full Rebuild

```powershell
# Stop server
Get-Process -Name node | Stop-Process -Force

# Clear cache
Remove-Item -Recurse -Force .next

# Start lại
npm run dev
```

### Option 3: Nuclear Reset

```powershell
# Stop
Get-Process -Name node | Stop-Process -Force

# Clean
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Fresh install
npm install

# Start
npm run dev
```

---

## 🔍 Check Browser

### Mở Developer Tools (F12)

**Console Tab:**
- Có lỗi màu đỏ?
- Có warning?

**Network Tab:**
- Filter: CSS
- Có file `.css` load được?

**Elements Tab:**
- Inspect một element
- Check styles bên phải có Tailwind classes?

---

## 📊 Common Issues & Fixes

### Issue 1: Blank Page
**Fix:** Hard refresh (Ctrl+Shift+R)

### Issue 2: CSS Not Loading
**Fix:** Check Network tab, verify CSS files loading

### Issue 3: Build Errors
**Fix:** Check terminal logs

### Issue 4: Tailwind Classes Not Applied
**Fix:** Rebuild `.next` cache

---

## ⏭️ Next Steps

1. ✅ Test http://localhost:3000/test
2. ⏳ Nếu OK → có vấn đề với component khác
3. ⏳ Nếu FAIL → rebuild/reset

---

**Test page đã tạo:** `app/test/page.tsx`

*Last Updated: 2025-01-31*

