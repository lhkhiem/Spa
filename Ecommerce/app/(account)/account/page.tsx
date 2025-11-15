'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiPackage, FiUser, FiMapPin, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import Button from '@/components/ui/Button/Button';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import { useAuthStore } from '@/lib/stores/authStore';
import { fetchOrders } from '@/lib/api/orders';
import { fetchAddresses } from '@/lib/api/addresses';
import { Order } from '@/lib/types/order';
import { Address } from '@/lib/types/user';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, addressesData] = await Promise.all([
          fetchOrders().catch(() => []),
          fetchAddresses().catch(() => []),
        ]);
        setRecentOrders(ordersData.slice(0, 3)); // Get latest 3 orders
        setAddresses(addressesData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đăng xuất thành công!');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Account', href: '/account' },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="card p-6">
        {/* Welcome Section */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Chào mừng trở lại, {user?.lastName} {user?.firstName}!
          </h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-3">
                <FiPackage className="h-6 w-6 text-brand-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : recentOrders.length}
                </p>
                <p className="text-sm text-gray-600">Đơn hàng gần đây</p>
              </div>
            </div>
            <Link
              href="/account/orders"
              className="mt-4 block text-sm font-medium text-brand-purple-600 hover:text-brand-purple-700"
            >
              Xem tất cả đơn hàng →
            </Link>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-3">
                <FiMapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : addresses.length}
                </p>
                <p className="text-sm text-gray-600">Địa chỉ đã lưu</p>
              </div>
            </div>
            <Link
              href="/account/addresses"
              className="mt-4 block text-sm font-medium text-brand-purple-600 hover:text-brand-purple-700"
            >
              Quản lý địa chỉ →
            </Link>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3">
                <FiUser className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">Tài khoản</p>
              </div>
            </div>
            <Link
              href="/account/profile"
              className="mt-4 block text-sm font-medium text-brand-purple-600 hover:text-brand-purple-700"
            >
              Cập nhật thông tin →
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Đơn hàng gần đây</h2>
            <Link
              href="/account/orders"
              className="text-sm font-medium text-brand-purple-600 hover:text-brand-purple-700"
            >
              Xem tất cả
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple-600 border-t-transparent"></div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
              <FiShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-4 text-gray-600">Bạn chưa có đơn hàng nào</p>
              <Button href="/products">Bắt đầu mua sắm</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Đơn hàng #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(order.total)}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status === 'delivered'
                          ? 'Đã giao'
                          : order.status === 'shipped'
                          ? 'Đã gửi'
                          : order.status === 'processing'
                          ? 'Đang xử lý'
                          : 'Chờ xử lý'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/account/profile"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="rounded-full bg-purple-100 p-3">
              <FiUser className="h-5 w-5 text-brand-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Thông tin cá nhân</h3>
              <p className="text-sm text-gray-600">Cập nhật thông tin tài khoản</p>
            </div>
          </Link>

          <Link
            href="/account/addresses"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="rounded-full bg-blue-100 p-3">
              <FiMapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Địa chỉ</h3>
              <p className="text-sm text-gray-600">Quản lý địa chỉ giao hàng</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
