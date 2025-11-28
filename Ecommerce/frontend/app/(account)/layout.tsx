'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop/ScrollToTop';
import { useAuthStore } from '@/lib/stores/authStore';
import { FiLayout, FiPackage, FiUser, FiMapPin, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuthStore();

  // Protect account pages - redirect to login if not authenticated
  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        // Check if token exists in localStorage (for SSR/hydration delay)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            toast.error('Vui lòng đăng nhập để truy cập trang này');
            router.push('/login?redirect=' + encodeURIComponent(pathname));
            return;
          }
        }
      }
    };

    // Small delay to allow hydration
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, pathname, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đăng xuất thành công!');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { href: '/account', label: 'Dashboard', icon: FiLayout },
    { href: '/account/orders', label: 'Đơn hàng', icon: FiPackage },
    { href: '/account/profile', label: 'Thông tin', icon: FiUser },
    { href: '/account/addresses', label: 'Địa chỉ', icon: FiMapPin },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-[120px]">
        <div className="container-custom py-8">
          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-64 flex-shrink-0">
              <nav className="card p-4">
                <div className="mb-6 border-b border-gray-200 pb-4">
                  <h2 className="mb-1 text-lg font-semibold text-gray-900">
                    Tài khoản của tôi
                  </h2>
                  {user && (
                    <p className="text-sm text-gray-600">
                      {user.firstName} {user.lastName}
                    </p>
                  )}
                </div>
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                            isActive
                              ? 'bg-brand-purple-50 text-brand-purple-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-red-600 transition-colors hover:bg-red-50"
                  >
                    <FiLogOut className="h-5 w-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}
