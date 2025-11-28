'use client';

import { useState, useEffect } from 'react';

// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiPackage, FiCalendar, FiDollarSign, FiTruck, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import Button from '@/components/ui/Button/Button';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import { fetchOrder } from '@/lib/api/orders';
import { Order } from '@/lib/types/order';
import toast from 'react-hot-toast';

const getStatusColor = (status: Order['status']) => {
  const colors: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  return colors[status];
};

const getStatusText = (status: Order['status']) => {
  const texts: Record<Order['status'], string> = {
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
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh', // UTC+7
  }).format(date);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      try {
        const data = await fetchOrder(orderId);
        setOrder(data);
      } catch (error: any) {
        console.error('Failed to fetch order:', error);
        if (error.response?.status === 401) {
          toast.error('Vui lòng đăng nhập để xem đơn hàng');
        } else if (error.response?.status === 404) {
          toast.error('Đơn hàng không tồn tại');
        } else {
          toast.error('Không thể tải thông tin đơn hàng');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Tài khoản', href: '/account' },
    { label: 'Đơn hàng', href: '/account/orders' },
    { label: order?.orderNumber || 'Chi tiết đơn hàng', href: '#' },
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

  if (!order) {
    return (
      <div className="card p-6">
        <div className="py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Đơn hàng không tồn tại</h2>
          <Button href="/account/orders">Quay lại danh sách đơn hàng</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="space-y-6">
        {/* Order Header */}
        <div className="card p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">Đơn hàng #{order.orderNumber}</h1>
              <p className="text-sm text-gray-600">
                Đặt hàng vào {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm">
                <FiTruck className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Mã vận đơn:</span>
                <span className="font-mono text-brand-purple-600">{order.trackingNumber}</span>
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="card p-6">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Sản phẩm</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 pb-4 last:border-0">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.productImage || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200'}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.productName}</h3>
                  {item.variantName && (
                    <p className="text-sm text-gray-600">Variant: {item.variantName}</p>
                  )}
                  {item.sku && (
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                  )}
                  <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.total)}
                  </p>
                  <p className="text-sm text-gray-600">{formatPrice(item.price)} mỗi sản phẩm</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Billing */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
              <FiMapPin className="h-5 w-5" />
              Địa chỉ giao hàng
            </h2>
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-semibold">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && (
                <p className="mt-2 flex items-center gap-1">
                  <FiPhone className="h-4 w-4" />
                  {order.shippingAddress.phone}
                </p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Thông tin thanh toán</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Phương thức:</span> {order.paymentMethod}
              </p>
              {order.billingAddress && (
                <div className="mt-4">
                  <p className="mb-2 font-medium">Địa chỉ thanh toán:</p>
                  <p>
                    {order.billingAddress.firstName} {order.billingAddress.lastName}
                  </p>
                  <p>{order.billingAddress.addressLine1}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Tóm tắt đơn hàng</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tạm tính</span>
              <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="text-gray-900">{formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Thuế</span>
              <span className="text-gray-900">{formatPrice(order.tax)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                <span className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button href="/account/orders" variant="outline">
            Quay lại danh sách
          </Button>
          {order.status === 'delivered' && (
            <Button>Mua lại</Button>
          )}
        </div>
      </div>
    </div>
  );
}


