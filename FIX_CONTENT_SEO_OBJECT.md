# Sửa lỗi Content/SEO Object trong Duplicate Product

## Vấn đề từ logs

### Lỗi 1: Invalid value khi duplicate
```
Error: Invalid value {
  usage: '...',
  summary: '...',
  highlights: [...]
}
```

**Nguyên nhân:**
- Trường `content` hoặc `seo` trong database là JSON/object
- Khi query từ database, PostgreSQL trả về object
- Khi insert lại, Sequelize cố gắng escape object như string → lỗi

### Lỗi 2: Cannot read properties of undefined (reading 'slug')
```
TypeError: Cannot read properties of undefined (reading 'slug')
at deleteProduct (/var/www/Spa/CMS/backend/dist/controllers/productController.js:562:44)
```

**Nguyên nhân:**
- `getProductResult[0]` có thể undefined
- Truy cập `deletedProduct.slug` mà không kiểm tra

## Đã sửa

### 1. Stringify content và seo nếu là objects
```typescript
// Stringify content and seo if they are objects
let contentValue = originalProduct.content;
if (contentValue && typeof contentValue === 'object') {
  contentValue = JSON.stringify(contentValue);
}

let seoValue = originalProduct.seo;
if (seoValue && typeof seoValue === 'object') {
  seoValue = JSON.stringify(seoValue);
}
```

### 2. Fix delete product - kiểm tra kỹ hơn
```typescript
if (!getProductResult || getProductResult.length === 0 || !getProductResult[0]) {
  return res.status(404).json({ error: 'Product not found' });
}

deletedProduct = getProductResult[0];
productSlug = deletedProduct?.slug || null;  // Optional chaining
```

## Build và test

```bash
cd /var/www/Spa/CMS/backend
npm run build
pm2 restart cms-backend
```

## Kiểm tra logs

```bash
pm2 logs cms-backend --lines 50
```

Sau khi sửa, không còn lỗi:
- ✅ `Invalid value` khi duplicate
- ✅ `Cannot read properties of undefined` khi delete
