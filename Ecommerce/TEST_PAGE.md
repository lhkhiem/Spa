# 🔧 TEST PAGE - Kiểm tra Tailwind CSS

## Vấn đề hiện tại

Frontend đang chạy nhưng bị **vỡ định dạng**. Có thể do:
1. Tailwind CSS không được compile đúng
2. PostCSS config issue
3. Build cache issue
4. CSS không được load

---

## ✅ Đã làm

1. ✅ Cleared `.next` cache
2. ✅ Restarted dev server
3. ✅ Dependencies installed
4. ✅ Configs checked

---

## 🧪 Test Steps

### 1. Kiểm tra Browser Console

Mở Developer Tools (F12) và check:
- Console tab: Có lỗi JavaScript?
- Network tab: CSS files load được không?
- Elements tab: Styles được apply không?

### 2. Kiểm tra Tailwind

Trong browser console, chạy:
```javascript
window.getComputedStyle(document.body).color
```

Nếu CSS load thì sẽ trả về color value.

### 3. Hard Refresh

- Windows/Linux: `Ctrl + Shift + R` hoặc `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### 4. Kiểm tra Terminal

Xem terminal có lỗi build không.

---

## 🔍 Debug Commands

### Check if Tailwind is working:

Tạo file test: `app/test/page.tsx`

```typescript
export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-white">
        Test: Tailwind Working!
      </h1>
    </div>
  );
}
```

Access: http://localhost:3000/test

Nếu background xanh và text trắng → Tailwind OK
Nếu vẫn trắng → Tailwind NOT working

---

## 🛠️ Fix Commands

### Nuclear Option:

```powershell
# 1. Stop everything
Get-Process -Name node | Stop-Process -Force

# 2. Clean everything
cd D:\PROJECT\StudyProject\Cursor\ecommerce-template-01
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 3. Fresh install
npm install

# 4. Start
npm run dev
```

---

## 📊 Checklist

- [ ] Browser console checked
- [ ] Network tab checked  
- [ ] Hard refresh tried
- [ ] Test page created
- [ ] Terminal logs checked
- [ ] Tailwind config verified

---

*Last Updated: 2025-01-31*

