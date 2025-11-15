'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiPackage, FiPhone, FiCalendar, FiDollarSign, FiTruck } from 'react-icons/fi';
import { buildApiUrl } from '@/config/site';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  subtotal?: number;
  tax_amount?: number;
  shipping_cost?: number;
  discount_amount?: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  tracking_number?: string;
  shipping_address?: any;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export default function OrderLookupPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      // Normalize phone number (remove spaces, dashes, etc.)
      const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
      // Note: buildApiUrl already includes /api prefix, so don't add /api again
      const apiUrl = buildApiUrl(`orders/phone/${encodeURIComponent(normalizedPhone)}`);
      
      console.log('🔍 Looking up orders for phone:', normalizedPhone);
      console.log('📡 API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        
        if (response.status === 404) {
          setOrders([]);
          // Ưu tiên hiển thị message từ backend (tiếng Việt)
          setError(errorData.message || errorData.error || 'Không tìm thấy đơn hàng nào với số điện thoại này');
        } else {
          // Ưu tiên hiển thị message từ backend (tiếng Việt)
          const errorMessage = errorData.message || errorData.error || 'Lỗi khi tìm kiếm đơn hàng. Vui lòng thử lại sau.';
          throw new Error(errorMessage);
        }
        return;
      }

      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (data.success && data.data) {
        setOrders(data.data);
        if (data.data.length === 0) {
          setError('Không tìm thấy đơn hàng nào với số điện thoại này');
        } else {
          setError(null); // Clear error if orders found
        }
      } else if (data.data && Array.isArray(data.data)) {
        // Handle case where data is returned directly as array
        setOrders(data.data);
        if (data.data.length === 0) {
          setError('Không tìm thấy đơn hàng nào với số điện thoại này');
        } else {
          setError(null);
        }
      } else {
        setOrders([]);
        setError(data.message || 'Không tìm thấy đơn hàng nào với số điện thoại này');
      }
    } catch (err: any) {
      console.error('❌ Failed to lookup orders:', err);
      // Hiển thị message từ backend hoặc fallback message tiếng Việt
      setError(err.message || 'Lỗi khi tìm kiếm đơn hàng. Vui lòng thử lại sau.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đã giao hàng',
      delivered: 'Đã nhận hàng',
      cancelled: 'Đã hủy',
    };
    return statusLabels[status] || status;
  };

  const getPaymentStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thanh toán thất bại',
      refunded: 'Đã hoàn tiền',
    };
    return statusLabels[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodLabels: Record<string, string> = {
      cod: 'Ship COD (Thanh toán khi nhận hàng)',
      zalopay: 'ZaloPay (Thanh toán trực tuyến)',
      card: 'Thẻ tín dụng/Ghi nợ',
    };
    return methodLabels[method] || method;
  };

  const getShippingMethodLabel = (method: string) => {
    const methodLabels: Record<string, string> = {
      standard: 'Giao hàng tiêu chuẩn (5-7 ngày)',
      express: 'Giao hàng nhanh (2-3 ngày)',
    };
    return methodLabels[method] || method;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">Tra cứu đơn hàng</h1>
          <p className="text-gray-600">
            Nhập số điện thoại đã sử dụng khi đặt hàng để xem trạng thái đơn hàng
          </p>
        </div>

        {/* Search Form */}
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại (ví dụ: 0901234567)"
                    className="w-full rounded-lg border border-gray-300 bg-white px-12 py-4 text-lg focus:border-brand-purple-500 focus:outline-none focus:ring-2 focus:ring-brand-purple-500"
                    disabled={loading}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-brand-purple-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-brand-purple-700 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Đang tìm...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiSearch className="h-5 w-5" />
                    Tìm kiếm
                  </span>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">
                {error}
              </div>
            )}
          </form>

          {/* Orders List */}
          {searched && !loading && orders.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Tìm thấy {orders.length} đơn hàng
              </h2>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                >
                  {/* Order Header */}
                  <div className="border-b border-gray-200 bg-gray-50 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <FiPackage className="h-5 w-5 text-brand-purple-600" />
                          <span className="font-semibold text-gray-900">
                            Đơn hàng: {order.order_number}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Ngày đặt: {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Tổng tiền:</span>
                          <p className="text-lg font-bold text-brand-purple-600">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h3 className="mb-4 font-semibold text-gray-900">Chi tiết đơn hàng:</h3>
                    
                    {/* Items List */}
                    {order.items && order.items.length > 0 ? (
                      <div className="mb-6 space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.product_name}</p>
                              {item.sku && (
                                <p className="mt-1 text-sm text-gray-500">SKU: {item.sku}</p>
                              )}
                              <p className="mt-1 text-sm text-gray-600">
                                Số lượng: {item.quantity} × {formatCurrency(item.unit_price)}
                              </p>
                            </div>
                            <div className="ml-4 text-right">
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(item.total_price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mb-6 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-600">
                        Không có sản phẩm nào trong đơn hàng này
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="space-y-2">
                        {order.subtotal !== undefined && order.subtotal !== null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tạm tính:</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(order.subtotal)}
                            </span>
                          </div>
                        )}
                        {order.discount_amount !== undefined && order.discount_amount !== null && order.discount_amount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Giảm giá:</span>
                            <span className="font-medium text-red-600">
                              -{formatCurrency(order.discount_amount)}
                            </span>
                          </div>
                        )}
                        {order.shipping_cost !== undefined && order.shipping_cost !== null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Phí vận chuyển:</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(order.shipping_cost)}
                            </span>
                          </div>
                        )}
                        {order.tax_amount !== undefined && order.tax_amount !== null && order.tax_amount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Thuế VAT:</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(order.tax_amount)}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-gray-300 pt-2">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">Tổng tiền:</span>
                            <span className="text-lg font-bold text-brand-purple-600">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Shipping Info */}
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <h3 className="mb-4 font-semibold text-gray-900">Thông tin thanh toán và vận chuyển:</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Payment Information */}
                      <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">Thông tin thanh toán:</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Trạng thái:</span>
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusColor(
                              order.payment_status
                            )}`}>
                              {getPaymentStatusLabel(order.payment_status)}
                            </span>
                          </div>
                          {order.payment_method && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Phương thức:</span>
                              <span className="text-sm font-medium text-gray-900">
                                {getPaymentMethodLabel(order.payment_method)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Shipping Information */}
                      <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">Thông tin vận chuyển:</p>
                        <div className="space-y-2">
                          {order.shipping_method && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Phương thức:</span>
                              <span className="text-sm font-medium text-gray-900">
                                {getShippingMethodLabel(order.shipping_method)}
                              </span>
                            </div>
                          )}
                          {order.shipping_cost !== undefined && order.shipping_cost !== null && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Phí vận chuyển:</span>
                              <span className="text-sm font-medium text-gray-900">
                                {order.shipping_cost === 0 ? 'Miễn phí' : formatCurrency(order.shipping_cost)}
                              </span>
                            </div>
                          )}
                          {order.tracking_number && (
                            <div className="flex items-center gap-2">
                              <FiTruck className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                Mã vận đơn: {order.tracking_number}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm font-medium text-gray-600">Thông tin khách hàng:</p>
                        <p className="text-gray-900">{order.customer_name}</p>
                        <p className="text-sm text-gray-600">{order.customer_email}</p>
                        <p className="text-sm text-gray-600">{order.customer_phone}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-medium text-gray-600">Thời gian:</p>
                        {order.shipped_at && (
                          <p className="text-sm text-gray-600">
                            Ngày giao: {formatDate(order.shipped_at)}
                          </p>
                        )}
                        {order.delivered_at && (
                          <p className="text-sm text-green-600">
                            Đã nhận: {formatDate(order.delivered_at)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {searched && !loading && orders.length === 0 && !error && (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <FiPackage className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Không tìm thấy đơn hàng
              </h3>
              <p className="text-gray-600">
                Không có đơn hàng nào được tìm thấy với số điện thoại này.
              </p>
            </div>
          )}

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-brand-purple-600 hover:text-brand-purple-700"
            >
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

