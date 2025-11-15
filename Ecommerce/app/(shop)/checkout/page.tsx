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
import { handleApiError } from '@/lib/api/client';
import { formatCurrency } from '@/lib/utils/formatters';
import { FiCreditCard, FiLock, FiTruck } from 'react-icons/fi';

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
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    // Payment Information
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    // Billing same as shipping
    billingSameAsShipping: true,
  });
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.email,
        firstName: prev.firstName || user.firstName,
        lastName: prev.lastName || user.lastName,
      }));
    }
  }, [user]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout' },
  ];

  const subtotal = getTotalPrice();
  const standardShippingCost = useMemo(() => (subtotal > 749 ? 0 : 49.99), [subtotal]);
  const expressShippingCost = 99.99;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    setIsProcessing(true);

    const shippingAddress = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company || undefined,
      addressLine1: formData.address,
      addressLine2: formData.apartment || undefined,
      city: formData.city,
      state: formData.state,
      postalCode: formData.zipCode,
      country: formData.country,
      phone: formData.phone,
      email: formData.email,
    };

    const billingAddress = formData.billingSameAsShipping
      ? { ...shippingAddress }
      : { ...shippingAddress };

    const payload: CreateOrderPayload = {
      customer_id: isAuthenticated && user ? user.id : undefined,
      customer_email: formData.email,
      customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      shipping_method: shippingMethod,
      payment_method: 'card',
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        variant_info: item.variantId ? { variantId: item.variantId } : null,
      })),
      notes: formData.company ? `Company: ${formData.company}` : '',
    };

    try {
      const order = await createOrder(payload);
      toast.success('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
      clearCart();

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lastOrder', JSON.stringify(order));
      }

      router.push(`/checkout/success?orderNumber=${encodeURIComponent(order.order_number)}`);
    } catch (error) {
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
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="mb-8 text-gray-600">Add some products to checkout</p>
            <Button href="/products">Continue Shopping</Button>
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
              {/* Contact Information */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Contact Information</h2>
                <div className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Shipping Information */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Input
                    label="Company (optional)"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="Apartment, suite, etc. (optional)"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Shipping Method</h2>
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
                          <span className="font-medium text-gray-900">Standard Shipping</span>
                        </div>
                        <span className="text-sm text-gray-600">5-7 business days</span>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {standardShippingCost === 0 ? 'FREE' : formatCurrency(standardShippingCost)}
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
                          <span className="font-medium text-gray-900">Express Shipping</span>
                        </div>
                        <span className="text-sm text-gray-600">2-3 business days</span>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(expressShippingCost)}
                    </span>
                  </label>
                </div>

                {subtotal > 749 && (
                  <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                    🎉 You qualify for FREE standard shipping!
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiLock className="text-green-600" />
                    <span>Secure Payment</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />

                  <Input
                    label="Name on Card"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                    />
                    <Input
                      label="CVV"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      type="password"
                      maxLength={4}
                      required
                    />
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="billingSameAsShipping"
                      checked={formData.billingSameAsShipping}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-purple-600 focus:ring-2 focus:ring-brand-purple-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Billing address same as shipping address
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isProcessing}
                className="font-semibold"
              >
                {isProcessing ? 'Processing Payment...' : `Pay ${formatCurrency(total)}`}
              </Button>

              <p className="text-center text-sm text-gray-600">
                By placing your order, you agree to our{' '}
                <Link href="/terms" className="text-brand-purple-600 hover:underline">
                  Terms & Conditions
                </Link>
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Order Summary</h2>

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
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
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
                    <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-brand-purple-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiLock className="text-green-600" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiTruck className="text-blue-600" />
                  <span>Free shipping on orders over $749</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiCreditCard className="text-purple-600" />
                  <span>Money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
