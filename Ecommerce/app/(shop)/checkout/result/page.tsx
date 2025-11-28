'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Disable static generation for this page (uses useSearchParams)
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Button from '@/components/ui/Button/Button';
import { FiCheckCircle, FiXCircle, FiLoader, FiPackage, FiPhone } from 'react-icons/fi';
import { queryZaloPayOrder } from '@/lib/api/payments';
import { buildApiUrl } from '@/config/site';
import { useCartStore } from '@/lib/stores/cartStore';

function CheckoutResultContent() {
  // Log immediately - even before hooks
  if (typeof window !== 'undefined') {
    console.log('[Checkout Result] ===== COMPONENT RENDERED =====');
    console.log('[Checkout Result] Window location:', window.location.href);
    console.log('[Checkout Result] URL search:', window.location.search);
  }
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [appTransId, setAppTransId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const pollingRef = useRef(true);
  const statusRef = useRef<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cartClearedRef = useRef(false); // Track if cart has been cleared

  // Update refs when state changes
  useEffect(() => {
    statusRef.current = status;
    console.log('[Checkout Result] Status changed to:', status);
  }, [status]);

  useEffect(() => {
    console.log('[Checkout Result] Page loaded, checking URL params...');
    
    // Get app_trans_id from URL params or sessionStorage
    // ZaloPay redirects with 'apptransid' (no underscore), but we also check 'app_trans_id'
    const appTransIdParam = searchParams?.get('apptransid') || searchParams?.get('app_trans_id');
    const statusParam = searchParams?.get('status'); // ZaloPay redirects with status=1 for success
    
    console.log('[Checkout Result] URL params:', {
      apptransid: searchParams?.get('apptransid'),
      app_trans_id: searchParams?.get('app_trans_id'),
      status: statusParam,
      allParams: Object.fromEntries(searchParams?.entries() || []),
    });
    
    let transId = appTransIdParam || '';

    if (!transId && typeof window !== 'undefined') {
      transId = sessionStorage.getItem('zalopayAppTransId') || '';
      console.log('[Checkout Result] Got app_trans_id from sessionStorage:', transId);
    }

    if (!transId) {
      console.error('[Checkout Result] No app_trans_id found in URL or sessionStorage');
      setStatus('failed');
      setMessage('Không tìm thấy thông tin giao dịch. Vui lòng liên hệ hỗ trợ.');
      pollingRef.current = false;
      return;
    }

    console.log('[Checkout Result] Using app_trans_id:', transId);
    setAppTransId(transId);

    // Get order info from sessionStorage
    if (typeof window !== 'undefined') {
      const lastOrder = sessionStorage.getItem('lastOrder');
      if (lastOrder) {
        try {
          const order = JSON.parse(lastOrder);
          if (order.order_number) {
            setOrderNumber(order.order_number);
          }
        } catch (e) {
          console.error('Failed to parse order data:', e);
        }
      }
    }

    // Query order status
    const queryOrderStatus = async () => {
      // Don't query if already stopped polling
      if (!pollingRef.current) {
        console.log('[Checkout Result] Polling stopped, skipping query');
        return;
      }

      console.log('[Checkout Result] Querying ZaloPay order status for:', transId);

      try {
        const response = await queryZaloPayOrder(transId);
        console.log('[Checkout Result] Query response:', response);
        
        if (response.success && response.data) {
          const returnCode = response.data.return_code;
          console.log('[Checkout Result] Return code:', returnCode);
          
          if (returnCode === 1) {
            // Success
            console.log('[Checkout Result] Payment successful!');
            pollingRef.current = false;
            setStatus('success');
            setMessage('Thanh toán thành công! Cảm ơn bạn đã mua sắm.');
            
            // Clear cart (only once)
            if (!cartClearedRef.current) {
              console.log('[Checkout Result] Clearing cart...');
              clearCart();
              cartClearedRef.current = true;
            }
            
            // Clear session storage
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('zalopayAppTransId');
              sessionStorage.removeItem('lastOrder'); // Also clear lastOrder after successful payment
            }

            // Clear intervals
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          } else {
            // Failed or pending
            console.log('[Checkout Result] Payment not successful, return_code:', returnCode);
            if (response.data.sub_return_code === -1 || returnCode !== 1) {
              console.log('[Checkout Result] Setting status to failed');
              pollingRef.current = false;
              setStatus('failed');
              setMessage(response.data.return_message || response.data.sub_return_message || 'Thanh toán thất bại. Vui lòng thử lại.');

              // Clear intervals
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            } else {
              // Still pending, continue polling
              console.log('[Checkout Result] Still pending, continue polling');
              setStatus('pending');
              setMessage('Đang chờ xác nhận thanh toán...');
            }
          }
        } else {
          // Keep polling if query failed
          console.log('[Checkout Result] Query response invalid, keep polling');
          setStatus('pending');
          setMessage('Đang kiểm tra trạng thái thanh toán...');
        }
      } catch (error: any) {
        console.error('[Checkout Result] Query error:', error);
        console.error('[Checkout Result] Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        // Keep polling on error
        setStatus('pending');
        setMessage('Đang kiểm tra trạng thái thanh toán...');
      }
    };

    // Initial query
    queryOrderStatus();

    // Poll every 3 seconds if still pending
    pollIntervalRef.current = setInterval(() => {
      if (pollingRef.current && statusRef.current === 'pending') {
        queryOrderStatus();
      } else {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }
    }, 3000);

    // Stop polling after 60 seconds
    timeoutRef.current = setTimeout(() => {
      if (statusRef.current === 'pending' && pollingRef.current) {
        pollingRef.current = false;
        setStatus('failed');
        setMessage('Không thể xác nhận thanh toán. Vui lòng tra cứu đơn hàng hoặc liên hệ hỗ trợ.');
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }, 60000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl">
          {/* Status Icon */}
          <div className="mb-8 text-center">
            {status === 'loading' || status === 'pending' ? (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <FiLoader className="h-12 w-12 animate-spin text-blue-600" />
              </div>
            ) : status === 'success' ? (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <FiCheckCircle className="h-12 w-12 text-green-600" />
              </div>
            ) : (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <FiXCircle className="h-12 w-12 text-red-600" />
              </div>
            )}
            
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {status === 'loading' || status === 'pending' 
                ? 'Đang xử lý thanh toán...' 
                : status === 'success' 
                  ? 'Thanh toán thành công!' 
                  : 'Thanh toán thất bại'}
            </h1>
            <p className="text-lg text-gray-600">
              {message || 'Vui lòng chờ trong giây lát...'}
            </p>
          </div>

          {/* Order Details */}
          {orderNumber && (
            <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
              <div className="mb-6 border-b border-gray-200 pb-6">
                <h2 className="mb-2 text-xl font-bold text-gray-900">Mã đơn hàng</h2>
                <p className="text-2xl font-mono font-semibold text-brand-purple-600">
                  {orderNumber}
                </p>
              </div>

              {status === 'success' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                      <FiPackage className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Đơn hàng đã được xác nhận</h3>
                      <p className="text-sm text-gray-600">
                        Đơn hàng của bạn đã được thanh toán thành công và đang được xử lý.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                      <FiPhone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Tra cứu đơn hàng</h3>
                      <p className="text-sm text-gray-600">
                        Sử dụng số điện thoại đã đăng ký để tra cứu trạng thái đơn hàng.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {status === 'success' && (
              <>
                <Link href="/order-lookup" className="flex-1">
                  <Button variant="outline" fullWidth>
                    Tra cứu đơn hàng
                  </Button>
                </Link>
                <Link href="/products" className="flex-1">
                  <Button fullWidth>Tiếp tục mua sắm</Button>
                </Link>
              </>
            )}
            {status === 'failed' && (
              <>
                <Link href="/order-lookup" className="flex-1">
                  <Button variant="outline" fullWidth>
                    Tra cứu đơn hàng
                  </Button>
                </Link>
                <Link href="/checkout" className="flex-1">
                  <Button fullWidth>Thử lại thanh toán</Button>
                </Link>
              </>
            )}
            {(status === 'loading' || status === 'pending') && (
              <Link href="/order-lookup" className="flex-1">
                <Button variant="outline" fullWidth>
                  Tra cứu đơn hàng
                </Button>
              </Link>
            )}
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

export default function CheckoutResultPage() {
  // Log when page component loads
  if (typeof window !== 'undefined') {
    console.log('[Checkout Result Page] Page component loaded');
    console.log('[Checkout Result Page] URL:', window.location.href);
  }
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 text-5xl animate-pulse">💳</div>
            <h1 className="text-xl font-semibold text-gray-900">Đang xử lý...</h1>
          </div>
        </div>
      </div>
    }>
      <CheckoutResultContent />
    </Suspense>
  );
}


