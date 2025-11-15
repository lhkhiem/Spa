# 🔧 Backend Fix: Lưu Phone vào Database

## Vấn đề
- Frontend đã gửi phone đúng cách trong request: `{email, name, phone: "0886939879"}`
- Backend không lưu phone vào database (tất cả rows đều `[null]`)
- Backend không trả về phone trong response

## Cần Fix Backend

### 1. Controller: `controllers/public/userController.ts`

Tìm function `updateProfile` và đảm bảo nó nhận và lưu phone:

```typescript
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Từ authenticate middleware
    const { email, name, phone, avatar } = req.body; // ✅ Đảm bảo có phone

    // Validate input
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Prepare update data
    const updateData: any = {
      email,
    };

    // Handle name field
    if (name) {
      // Split name into first_name and last_name (Vietnamese convention)
      const nameParts = name.trim().split(/\s+/);
      if (nameParts.length >= 2) {
        updateData.last_name = nameParts[0]; // First part is last name
        updateData.first_name = nameParts.slice(1).join(' '); // Rest is first name
      } else {
        updateData.first_name = name;
        updateData.last_name = '';
      }
    }

    // ✅ QUAN TRỌNG: Thêm phone vào updateData
    if (phone !== undefined) {
      updateData.phone = phone || null; // Allow null to clear phone
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    updateData.updated_at = new Date();

    // Update user in database
    const [updatedUser] = await db('users')
      .where({ id: userId })
      .update(updateData)
      .returning(['id', 'email', 'first_name', 'last_name', 'phone', 'avatar', 'role', 'email_verified', 'created_at', 'updated_at']);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ QUAN TRỌNG: Trả về phone trong response
    res.json({
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: `${updatedUser.last_name} ${updatedUser.first_name}`.trim(),
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        phone: updatedUser.phone, // ✅ Trả về phone
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        emailVerified: updatedUser.email_verified,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
```

### 2. Controller: `controllers/public/userController.ts` - GET Profile

Đảm bảo `getProfile` cũng trả về phone:

```typescript
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await db('users')
      .where({ id: userId })
      .first(['id', 'email', 'first_name', 'last_name', 'phone', 'avatar', 'role', 'email_verified', 'created_at', 'updated_at']);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ QUAN TRỌNG: Trả về phone trong response
    res.json({
      data: {
        id: user.id,
        email: user.email,
        name: `${user.last_name} ${user.first_name}`.trim(),
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone, // ✅ Trả về phone
        avatar: user.avatar,
        role: user.role,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};
```

### 3. Database Schema

Đảm bảo table `users` có cột `phone`:

```sql
-- Kiểm tra schema
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'phone';

-- Nếu chưa có, thêm cột:
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
```

## Checklist

- [ ] Backend nhận `phone` từ `req.body` trong `updateProfile`
- [ ] Backend lưu `phone` vào database: `updateData.phone = phone || null`
- [ ] Backend trả về `phone` trong response của `updateProfile`
- [ ] Backend trả về `phone` trong response của `getProfile`
- [ ] Database có cột `phone VARCHAR(20)` trong table `users`

## Test

1. Update profile với phone: `PUT /api/public/user/profile` với body `{email, name, phone: "0886939879"}`
2. Kiểm tra database: `SELECT id, email, phone FROM users WHERE id = ?`
3. Kiểm tra response: Response phải có `data.phone = "0886939879"`
4. GET profile: `GET /api/public/user/profile` phải trả về phone

## Lưu ý

- Frontend đã gửi phone đúng cách (verified qua logs)
- Frontend đã có workaround để hiển thị phone ngay cả khi backend không trả về
- Nhưng để phone được lưu vĩnh viễn, **backend PHẢI được fix**

