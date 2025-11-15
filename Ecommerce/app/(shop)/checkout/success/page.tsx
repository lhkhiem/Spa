import Link from 'next/link';
import Button from '@/components/ui/Button/Button';
import { FiCheckCircle, FiMail, FiPackage } from 'react-icons/fi';

export const metadata = {
  title: 'Order Confirmed - Universal Companies',
  description: 'Thank you for your order!',
};

type CheckoutSuccessPageProps = {
  searchParams?: {
    orderNumber?: string;
  };
};

export default function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const fallbackOrder = 'UC-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const orderNumber = searchParams?.orderNumber
    ? decodeURIComponent(searchParams.orderNumber)
    : fallbackOrder;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl">
          {/* Success Icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <FiCheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h2 className="mb-2 text-xl font-bold text-gray-900">Order Number</h2>
              <p className="text-2xl font-mono font-semibold text-brand-purple-600">
                {orderNumber}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <FiMail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Check your email</h3>
                  <p className="text-sm text-gray-600">
                    We've sent a confirmation email with your order details and tracking
                    information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                  <FiPackage className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Track your order</h3>
                  <p className="text-sm text-gray-600">
                    You can track your order status in your account dashboard or through the link
                    in your confirmation email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-8 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">What happens next?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-purple-600 text-xs text-white">
                  1
                </span>
                <p className="text-gray-700">
                  We'll process your order and prepare it for shipping
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-purple-600 text-xs text-white">
                  2
                </span>
                <p className="text-gray-700">
                  You'll receive a shipping confirmation email with tracking details
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-purple-600 text-xs text-white">
                  3
                </span>
                <p className="text-gray-700">
                  Your order will arrive within 5-7 business days (or 2-3 for express shipping)
                </p>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/account" className="flex-1">
              <Button variant="outline" fullWidth>
                View Order Status
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button fullWidth>Continue Shopping</Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Need help?{' '}
              <Link href="/contact" className="text-brand-purple-600 hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
