'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiPackage, FiCalendar, FiDollarSign, FiEye, FiTruck } from 'react-icons/fi';
import Button from '@/components/ui/Button/Button';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import { fetchOrders, cancelOrder } from '@/lib/api/orders';
import { Order, OrderStatus } from '@/lib/types/order';
import toast from 'react-hot-toast';

const getStatusColor = (status: OrderStatus) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status];
};

const getStatusText = (status: OrderStatus) => {
  const texts: Record<OrderStatus, string> = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đã gửi hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
    refunded: 'Đã hoàn tiền',
  };
  return texts[status] || status;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error: any) {
        console.error('Failed to fetch orders:', error);
        if (error.response?.status === 401) {
          toast.error('Vui lòng đăng nhập để xem đơn hàng');
        } else {
          toast.error('Không thể tải danh sách đơn hàng');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Account', href: '/account' },
    { label: 'Orders', href: '/account/orders' },
  ];

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} className="mb-6" />
      
      <div className="card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <FiPackage className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Chưa có đơn hàng nào
            </h3>
            <p className="mb-6 text-gray-600">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <Button href="/products" size="lg">
              Mua sắm ngay
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
              >
                {/* Order Header */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Mã đơn hàng</p>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                      </div>
                      <div className="h-8 w-px bg-gray-300"></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCalendar className="h-4 w-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="h-8 w-px bg-gray-300"></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiPackage className="h-4 w-4" />
                        <span>{order.items.length} sản phẩm</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Tổng tiền</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={item.productImage || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200'}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            Số lượng: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      href={`/account/orders/${order.id}`}
                      variant="outline"
                      size="sm"
                    >
                      <FiEye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Mua lại
                      </Button>
                    )}
                    {order.status === 'pending' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={async () => {
                          if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                            return;
                          }
                          try {
                            await cancelOrder(order.id);
                            setOrders(orders.map((o) => 
                              o.id === order.id ? { ...o, status: 'cancelled' } : o
                            ));
                            toast.success('Hủy đơn hàng thành công!');
                          } catch (error: any) {
                            console.error('Cancel order error:', error);
                            const errorMessage = error?.response?.data?.message || error?.message || 'Hủy đơn hàng thất bại. Vui lòng thử lại.';
                            toast.error(errorMessage);
                          }
                        }}
                      >
                        Hủy đơn
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


