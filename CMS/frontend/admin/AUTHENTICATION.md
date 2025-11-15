# Authentication & Route Guards

## Overview

The application implements a comprehensive authentication system with both **server-side** and **client-side** route guards to ensure secure access control.

## Architecture

### 1. Server-Side Protection (Middleware)
**File**: `middleware.ts`

The Next.js middleware intercepts all requests before they reach the page components:

- **Protected Routes**: All routes except `/login` and `/`
- **Cookie-Based Auth**: Checks for `token` cookie set by backend
- **Auto-Redirect**:
  - Unauthenticated users → `/login?redirect={attempted-url}`
  - Authenticated users on `/login` → `/dashboard`

### 2. Client-Side Protection (AuthGuard)
**File**: `components/auth-guard.tsx`

A React component that wraps protected pages to verify authentication on the client:

- **Session Verification**: Calls `/api/auth/verify` to validate token
- **Loading State**: Shows spinner while checking auth
- **Auto-Redirect**: Sends to `/login` if no valid session
- **Hydration**: Populates auth store with user data from cookie

### 3. Authentication Store
**File**: `store/authStore.ts`

Zustand-based state management for auth:

- **login(email, password)**: Authenticates user, receives cookie from backend
- **logout()**: Clears session cookie and user state
- **hydrate()**: Restores user session from existing cookie
- **user**: Current authenticated user object

## Flow Diagrams

### Login Flow
```
1. User visits /dashboard (not logged in)
2. Middleware checks cookie → None found
3. Redirect to /login?redirect=/dashboard
4. User enters credentials
5. AuthStore.login() → Backend sets cookie
6. Redirect to /dashboard (original destination)
7. Middleware checks cookie → Valid
8. AuthGuard verifies session → Valid
9. Dashboard renders
```

### Logout Flow
```
1. User clicks logout button
2. AuthStore.logout() → Backend clears cookie
3. State cleared in store
4. Redirect to /login
5. Middleware enforces no access to protected routes
```

### Session Persistence
```
1. User refreshes page or opens new tab
2. Middleware checks cookie → Valid
3. AuthGuard calls hydrate()
4. Backend verifies cookie and returns user
5. Store populated with user data
6. Page renders with user context
```

## Implementation

### Protecting a Route

All routes under `/dashboard` are automatically protected via the layout:

```tsx
// app/dashboard/layout.tsx
export default function DashboardSectionLayout({ children }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
```

### Accessing User Data

```tsx
import { useAuthStore } from '@/store/authStore';

export default function MyPage() {
  const { user } = useAuthStore();
  
  return <div>Welcome {user?.name}</div>;
}
```

### Manual Logout

```tsx
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const { logout } = useAuthStore();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

## Security Features

1. **HTTP-Only Cookies**: Token stored in cookie inaccessible to JavaScript
2. **Secure Flag**: Cookie only sent over HTTPS in production
3. **SameSite**: CSRF protection via cookie SameSite attribute
4. **Dual Layer**: Both middleware and client-side verification
5. **Session Validation**: Each request to protected endpoints verified by backend
6. **Auto-Cleanup**: Cookie and state cleared on logout

## Configuration

### Backend Cookie Settings
File: `backend/src/controllers/authController.ts`

```typescript
res.cookie('token', token, {
  httpOnly: true,        // Cannot be accessed by JavaScript
  sameSite: 'lax',      // CSRF protection
  secure: NODE_ENV === 'production', // HTTPS only in prod
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  path: '/',
});
```

### Frontend CORS Settings
File: `store/authStore.ts`

```typescript
axios.post('/api/auth/login', data, {
  withCredentials: true  // Send cookies with request
});
```

## Troubleshooting

### User redirected to login despite having valid session
- Check browser cookies for `token`
- Verify cookie domain matches frontend domain
- Check browser console for CORS errors
- Ensure `withCredentials: true` on API calls

### Login successful but immediately logged out
- Verify cookie is being set (check Network tab)
- Check cookie expiration
- Ensure backend CORS allows credentials

### Redirect loop between login and dashboard
- Check middleware logic for public routes
- Verify cookie name matches (`token`)
- Check for middleware matcher conflicts

## Best Practices

1. **Always use AuthGuard** for protected layouts/pages
2. **Never store sensitive tokens** in localStorage
3. **Use useAuthStore** for consistent auth state
4. **Call hydrate()** on app initialization
5. **Handle logout** properly to clear all state
6. **Test both flows**: authenticated and unauthenticated access

## Testing

### Manual Testing
1. Access `/dashboard` without logging in → Should redirect to `/login`
2. Login with valid credentials → Should redirect to `/dashboard`
3. Refresh page while logged in → Should stay logged in
4. Click logout → Should redirect to `/login` and clear session
5. Try accessing `/dashboard` after logout → Should redirect to `/login`

### Credentials for Testing
```
Email: admin@pressup.com
Password: admin123
```


