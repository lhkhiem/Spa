'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button/Button';
import { FiCheckCircle, FiMail, FiPackage, FiPhone } from 'react-icons/fi';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Lấy order number từ URL params
    const orderNum = searchParams?.get('orderNumber');
    if (orderNum) {
      setOrderNumber(decodeURIComponent(orderNum));
    } else {
      // Lấy order data từ sessionStorage nếu có
      if (typeof window !== 'undefined') {
        const lastOrder = sessionStorage.getItem('lastOrder');
        if (lastOrder) {
          try {
            const order = JSON.parse(lastOrder);
            setOrderData(order);
            if (order.order_number) {
              setOrderNumber(order.order_number);
              return;
            }
          } catch (e) {
            console.error('Failed to parse order data:', e);
          }
        }
      }
      // Fallback nếu không có order number
      setOrderNumber('UC-' + Math.random().toString(36).substring(2, 9).toUpperCase());
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl">
          {/* Success Icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <FiCheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Đặt hàng thành công!</h1>
            <p className="text-lg text-gray-600">
              Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được đặt thành công.
            </p>
          </div>

          {/* Order Details */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h2 className="mb-2 text-xl font-bold text-gray-900">Mã đơn hàng</h2>
              <p className="text-2xl font-mono font-semibold text-brand-purple-600">
                {orderNumber || 'Đang tải...'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <FiMail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Kiểm tra email</h3>
                  <p className="text-sm text-gray-600">
                    Chúng tôi đã gửi email xác nhận với chi tiết đơn hàng và thông tin theo dõi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                  <FiPackage className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tra cứu đơn hàng</h3>
                  <p className="text-sm text-gray-600">
                    Bạn có thể tra cứu trạng thái đơn hàng bằng số điện thoại đã sử dụng khi đặt hàng 
                    hoặc qua link trong email xác nhận.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <FiPhone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sử dụng số điện thoại</h3>
                  <p className="text-sm text-gray-600">
                    Nhập số điện thoại bạn đã sử dụng khi đặt hàng để xem chi tiết và trạng thái đơn hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-8 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Tiếp theo sẽ như thế nào?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-purple-600 text-xs text-white">
                  1
                </span>
                <p className="text-gray-700">
                  Chúng tôi sẽ xử lý đơn hàng và chuẩn bị giao hàng
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-purple-600 text-xs text-white">
                  2
                </span>
                <p className="text-gray-700">
                  Bạn sẽ nhận được email xác nhận giao hàng với thông tin theo dõi
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-purple-600 text-xs text-white">
                  3
                </span>
                <p className="text-gray-700">
                  Đơn hàng sẽ được giao trong vòng 5-7 ngày làm việc (hoặc 2-3 ngày với giao hàng nhanh)
                </p>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/order-lookup" className="flex-1">
              <Button variant="outline" fullWidth>
                Tra cứu đơn hàng
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button fullWidth>Tiếp tục mua sắm</Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Cần hỗ trợ?{' '}
              <Link href="/contact" className="text-brand-purple-600 hover:underline">
                Liên hệ đội ngũ hỗ trợ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 text-5xl animate-pulse">📦</div>
            <h1 className="text-xl font-semibold text-gray-900">Đang tải...</h1>
          </div>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
