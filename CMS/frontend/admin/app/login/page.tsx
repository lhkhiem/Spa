'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, user, hydrate } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [mounted, setMounted] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        await hydrate();
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          // Already authenticated, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        // Not authenticated, stay on login page
      }
    };
    
    checkExistingAuth();
  }, [hydrate, router]);

  // Avoid SSR hydration mismatch due to password-manager/browser extensions injecting attributes
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      await login(email, password);
      
      // Check if there's a redirect URL in the query params
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      
      // After successful login, redirect to intended page or dashboard
      router.push(redirectUrl);
      router.refresh(); // Force a refresh to ensure middleware picks up the new auth state
    } catch (err: any) {
      setLocalError(err?.response?.data?.error || 'Email hoặc mật khẩu không hợp lệ');
      console.error('Login error:', err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <Image src="/logo.png" alt="PressUp Agency" fill className="object-contain" priority />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">Bảng điều khiển CMS</h1>
          <p className="text-muted-foreground text-center mb-6">Đăng nhập vào tài khoản của bạn</p>

          {(error || localError) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Địa chỉ Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="abc@example.com" className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" autoComplete="username" required suppressHydrationWarning />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Mật khẩu</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" autoComplete="current-password" required suppressHydrationWarning />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold py-2 px-4 rounded-lg transition duration-200">
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Thông tin đăng nhập mặc định:
              <br />
              Email: <code className="bg-muted px-2 py-1 rounded text-xs text-foreground">admin@pressup.com</code>
              <br />
              Mật khẩu: <code className="bg-muted px-2 py-1 rounded text-xs text-foreground">admin123</code>
            </p>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-6">© 2024 Banyco CMS. Bảo lưu mọi quyền.</p>
      </div>
    </div>
  );
}
