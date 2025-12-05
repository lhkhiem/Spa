'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { createOrder, CreateOrderPayload } from '@/lib/api/orders';
import { createZaloPayOrder } from '@/lib/api/payments';
import { handleApiError } from '@/lib/api/client';
import { formatCurrency } from '@/lib/utils/formatters';
import { FiCreditCard, FiLock, FiTruck, FiDollarSign } from 'react-icons/fi';
import { HiQrCode } from 'react-icons/hi2';

export default function CheckoutPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Information
    email: '',
    fullName: '', // Họ và tên (gộp firstName và lastName)
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'zalopay'>('cod');

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.email,
        fullName: prev.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      }));
    }
  }, [user]);

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giỏ hàng', href: '/cart' },
    { label: 'Thanh toán' },
  ];

  const subtotal = getTotalPrice();
  // Tính phí giao hàng: COD luôn có phí, ZaloPay miễn phí
  const standardShippingCost = useMemo(() => {
    // COD: luôn có phí (trừ khi đơn > 749 thì miễn phí)
    // ZaloPay: miễn phí
    if (paymentMethod === 'zalopay') return 0;
    return subtotal > 749 ? 0 : 50; // 50 VND cho COD
  }, [subtotal, paymentMethod]);
  
  const expressShippingCost = useMemo(() => {
    // COD: phí express
    // ZaloPay: miễn phí
    if (paymentMethod === 'zalopay') return 0;
    return 100; // 100 VND cho COD express
  }, [paymentMethod]);
  
  const shipping = useMemo(
    () => (shippingMethod === 'express' ? expressShippingCost : standardShippingCost),
    [shippingMethod, expressShippingCost, standardShippingCost]
  );
  const tax = useMemo(() => subtotal * 0.08, [subtotal]);
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Parse fullName thành firstName và lastName (từ cuối là tên, phần còn lại là họ)
  const parseFullName = (fullName: string): { firstName: string; lastName: string } => {
    const trimmed = fullName.trim();
    if (!trimmed) {
      return { firstName: '', lastName: '' };
    }
    
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) {
      // Chỉ có 1 từ -> coi là tên
      return { firstName: parts[0], lastName: '' };
    } else if (parts.length === 2) {
      // 2 từ -> họ và tên
      return { firstName: parts[0], lastName: parts[1] };
    } else {
      // Nhiều hơn 2 từ -> từ cuối là tên, phần còn lại là họ
      const lastName = parts[parts.length - 1];
      const firstName = parts.slice(0, parts.length - 1).join(' ');
      return { firstName, lastName };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống.');
      return;
    }
    setIsProcessing(true);

    // Parse fullName thành firstName và lastName
    const { firstName, lastName } = parseFullName(formData.fullName);

    const shippingAddress = {
      firstName,
      lastName,
      company: formData.company || undefined,
      addressLine1: formData.address,
      addressLine2: formData.apartment || undefined,
      city: formData.city,
      state: formData.state,
      postalCode: formData.zipCode,
      country: formData.country,
      phone: formData.phone, // Required by OrderAddressPayload
      email: formData.email,
    };

    const billingAddress = { ...shippingAddress }; // Billing same as shipping

    const payload: CreateOrderPayload = {
      customer_id: isAuthenticated && user ? user.id : undefined,
      customer_email: formData.email,
      customer_name: formData.fullName.trim(),
      customer_phone: formData.phone, // Required for phone-based order lookup
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      shipping_method: shippingMethod,
      payment_method: paymentMethod, // 'cod' hoặc 'zalopay'
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        variant_info: item.variantId ? { variantId: item.variantId } : null,
      })),
      notes: formData.company ? `Company: ${formData.company}` : '',
      subtotal: subtotal,
      shipping_cost: shipping,
      tax_amount: tax,
    };

    try {
      console.log('[Checkout] Creating order with payload:', {
        customer_email: payload.customer_email,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        payment_method: payload.payment_method,
        items_count: payload.items.length,
        total: total,
      });
      
      const order = await createOrder(payload);
      
      console.log('[Checkout] Order created successfully:', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
      });
      
      // If ZaloPay payment, create payment order and redirect
      if (paymentMethod === 'zalopay') {
        try {
          toast.loading('Đang chuyển đến ZaloPay...');
          
          // ZaloPay requires amount as integer VND (no decimals)
          // order.total is already in VND, just round to integer
          const zalopayResponse = await createZaloPayOrder({
            orderId: order.id,
            amount: Math.round(order.total), // VND integer
            description: `Đơn hàng ${order.orderNumber}`,
            appUser: formData.phone || formData.email || order.id,
            items: items.map((item) => ({
              itemid: item.productId,
              itemname: item.name,
              itemquantity: item.quantity,
              itemprice: Math.round(item.price), // VND integer
            })),
          });

          if (zalopayResponse.success && zalopayResponse.data?.order_url) {
            // Save order info for result page
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('lastOrder', JSON.stringify(order));
              sessionStorage.setItem('zalopayAppTransId', zalopayResponse.data.app_trans_id);
            }
            
            toast.dismiss();
            // Redirect to ZaloPay payment page
            window.location.href = zalopayResponse.data.order_url;
            return; // Don't continue processing
          } else {
            throw new Error(zalopayResponse.error || zalopayResponse.message || 'Không thể tạo thanh toán ZaloPay');
          }
        } catch (zalopayError: any) {
          toast.dismiss();
          toast.error(handleApiError(zalopayError));
          setIsProcessing(false);
          return;
        }
      }

      // For COD or other payment methods, go to success page
      toast.success('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
      clearCart();

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lastOrder', JSON.stringify(order));
      }

      // Redirect to success page with order number
      router.push(`/checkout/success?orderNumber=${encodeURIComponent(order.orderNumber)}`);
    } catch (error) {
      console.error('[Checkout] Error creating order:', error);
      console.error('[Checkout] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast.dismiss();
      toast.error(handleApiError(error));
      setIsProcessing(false);
    }
  };

  if (!isHydrated && !isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-4 text-5xl animate-pulse">🧾</div>
            <h1 className="text-xl font-semibold text-gray-900">Đang tải thông tin thanh toán...</h1>
            <p className="text-gray-500">Vui lòng chờ trong giây lát.</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h1>
            <p className="mb-8 text-gray-600">Thêm sản phẩm vào giỏ hàng để thanh toán</p>
            <Button href="/products">Tiếp tục mua sắm</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Thông tin giao hàng</h2>
                <div className="space-y-4">
                  <Input
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Ví dụ: Nguyễn Văn A"
                  />

                  <Input
                    label="Công ty (tùy chọn)"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="Căn hộ, số nhà, v.v. (tùy chọn)"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Input
                      label="Thành phố"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Tỉnh/Thành phố"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Mã bưu điện"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      required
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0901234567"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Phương thức giao hàng</h2>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-brand-purple-600 bg-purple-50 p-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                        className="h-4 w-4 text-brand-purple-600"
                      />
                      <div className="ml-3">
                        <div className="flex items-center gap-2">
                          <FiTruck className="text-brand-purple-600" />
                          <span className="font-medium text-gray-900">Giao hàng tiêu chuẩn</span>
                        </div>
                        <span className="text-sm text-gray-600">5-7 ngày làm việc</span>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {standardShippingCost === 0 ? 'MIỄN PHÍ' : formatCurrency(standardShippingCost)}
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-gray-300 p-4 hover:border-gray-400">
                    <div className="flex items-center">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="h-4 w-4 text-brand-purple-600"
                    />
                      <div className="ml-3">
                        <div className="flex items-center gap-2">
                          <FiTruck className="text-gray-600" />
                          <span className="font-medium text-gray-900">Giao hàng nhanh</span>
                        </div>
                        <span className="text-sm text-gray-600">2-3 ngày làm việc</span>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(expressShippingCost)}
                    </span>
                  </label>
                </div>

                {paymentMethod === 'cod' && subtotal > 749 && (
                  <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                    🎉 Đơn hàng trên 749.000₫ được miễn phí vận chuyển (COD)!
                  </div>
                )}
                {paymentMethod === 'zalopay' && (
                  <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                    ✓ ZaloPay: Miễn phí vận chuyển cho mọi đơn hàng
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Phương thức thanh toán</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiLock className="text-green-600" />
                    <span>Thanh toán bảo mật</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Ship COD Option */}
                  <label className={`flex cursor-pointer items-start justify-between rounded-lg border-2 p-4 transition-colors ${
                    paymentMethod === 'cod' 
                      ? 'border-brand-purple-600 bg-purple-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 h-4 w-4 text-brand-purple-600"
                      />
                      <div className="ml-3">
                        <div className="flex items-center gap-2">
                          <FiDollarSign className={paymentMethod === 'cod' ? 'text-brand-purple-600' : 'text-gray-600'} />
                          <span className="font-medium text-gray-900">Ship COD (Thanh toán khi nhận hàng)</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          Bạn sẽ thanh toán khi nhận được hàng. Phí giao hàng sẽ được cộng vào tổng tiền.
                        </p>
                        {paymentMethod === 'cod' && shipping > 0 && (
                          <p className="mt-2 text-sm font-medium text-brand-purple-600">
                            Phí giao hàng: {formatCurrency(shipping)}
                          </p>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* ZaloPay Option */}
                  <label className={`flex cursor-pointer items-start justify-between rounded-lg border-2 p-4 transition-colors ${
                    paymentMethod === 'zalopay' 
                      ? 'border-brand-purple-600 bg-purple-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="zalopay"
                        checked={paymentMethod === 'zalopay'}
                        onChange={() => setPaymentMethod('zalopay')}
                        className="mt-1 h-4 w-4 text-brand-purple-600"
                      />
                      <div className="ml-3">
                        <div className="flex items-center gap-2">
                          <HiQrCode className={paymentMethod === 'zalopay' ? 'text-brand-purple-600' : 'text-gray-600'} />
                          <span className="font-medium text-gray-900">ZaloPay (Thanh toán trực tuyến)</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          Thanh toán nhanh chóng qua ứng dụng ZaloPay bằng cách quét mã QR. Miễn phí vận chuyển.
                        </p>
                        {paymentMethod === 'zalopay' && (
                          <p className="mt-2 text-sm font-medium text-green-600">
                            ✓ Miễn phí vận chuyển
                          </p>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'zalopay' && (
                  <div className="mt-4 rounded-lg bg-blue-50 p-4">
                    <p className="text-sm text-blue-800">
                      💡 Sau khi đặt hàng, bạn sẽ được chuyển đến trang thanh toán ZaloPay để quét mã QR.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isProcessing}
                className="font-semibold"
              >
                {isProcessing 
                  ? (paymentMethod === 'zalopay' ? 'Đang chuyển đến ZaloPay...' : 'Đang xử lý đơn hàng...')
                  : paymentMethod === 'cod' 
                    ? `Đặt hàng - ${formatCurrency(total)}`
                    : `Thanh toán ZaloPay - ${formatCurrency(total)}`
                }
              </Button>

              <p className="text-center text-sm text-gray-600">
                Bằng việc đặt hàng, bạn đồng ý với{' '}
                <Link href="/terms" className="text-brand-purple-600 hover:underline">
                  Điều khoản & Điều kiện
                </Link>
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Tóm tắt đơn hàng</h2>

              {/* Cart Items */}
              <div className="mb-6 space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.productId}-${item.variantId || index}`} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs text-white">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính ({getTotalItems()} sản phẩm)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium text-gray-900">
                      {shipping === 0 ? 'MIỄN PHÍ' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thuế</span>
                    <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-lg font-bold text-brand-purple-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiLock className="text-green-600" />
                  <span>Mã hóa SSL 256-bit bảo mật</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiTruck className="text-blue-600" />
                  <span>Miễn phí vận chuyển cho đơn hàng trên 749.000₫</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiCreditCard className="text-purple-600" />
                  <span>Đảm bảo hoàn tiền</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
