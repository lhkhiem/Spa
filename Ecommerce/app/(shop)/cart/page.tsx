'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button/Button';
import { useCartStore } from '@/lib/stores/cartStore';
import { formatPrice } from '@/lib/utils/formatters';

export default function CartPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );
  const shipping = 0;
  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );
  const total = subtotal + shipping;

  const handleQuantityChange = (productId: string, variantId: string | undefined, quantity: number) => {
    updateQuantity(productId, quantity, variantId);
  };

  const handleRemoveItem = (productId: string, variantId?: string) => {
    removeItem(productId, variantId);
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng.');
  };

  if (!isHydrated) {
    return (
      <div className="container-custom py-12">
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <div className="mb-4 text-6xl animate-pulse">🛒</div>
          <h1 className="mb-3 text-2xl font-semibold text-gray-900">Đang tải giỏ hàng...</h1>
          <p className="text-gray-500">Vui lòng chờ trong giây lát.</p>
        </div>
      </div>
    );
  }

  const handleClearCart = () => {
    if (items.length === 0) {
      return;
    }

    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?');
    if (confirmed) {
      clearCart();
      toast.success('Giỏ hàng đã được làm trống.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-12">
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <div className="mb-4 text-6xl">🛒</div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h1>
          <p className="mb-6 text-gray-600">
            Hãy khám phá các sản phẩm nổi bật và thêm vào giỏ hàng ngay hôm nay.
          </p>
          <Button href="/products" size="lg">
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Giỏ hàng ({totalItems})</h1>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {items.map((item) => {
            const key = `${item.productId}-${item.variantId ?? 'default'}`;
            const imageUrl = item.image || '/images/placeholder-product.jpg';
            const lineTotal = item.price * item.quantity;

            return (
              <div
                key={key}
                className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:items-start"
              >
                <div className="relative h-28 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-28 sm:w-28">
                  <Image
                    src={imageUrl}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                      {item.variantId && (
                        <p className="text-xs uppercase text-gray-500">Biến thể: {item.variantId}</p>
                      )}
                      <div className="mt-1 text-sm text-gray-600">
                        Đơn giá:{' '}
                        <span className="font-medium text-gray-900">{formatPrice(item.price)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.productId, item.variantId)}
                      className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 className="h-4 w-4" />
                      Xóa
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Số lượng:</span>
                      <div className="flex items-center rounded-full border border-gray-300">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900"
                          aria-label="Giảm số lượng"
                        >
                          <FiMinus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900"
                          aria-label="Tăng số lượng"
                        >
                          <FiPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right sm:text-left">
                      <p className="text-sm uppercase text-gray-500">Thành tiền</p>
                      <p className="text-lg font-semibold text-gray-900">{formatPrice(lineTotal)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              href="/products"
              variant="ghost"
              className="px-0 text-sm font-medium text-brand-purple-600 hover:text-brand-purple-700"
            >
              ← Tiếp tục mua sắm
            </Button>
            <button
              type="button"
              onClick={handleClearCart}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Tóm tắt đơn hàng</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phí vận chuyển</span>
                <span className="text-gray-500">Sẽ tính ở bước sau</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
                <span>Tổng cộng</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Button
              fullWidth
              size="lg"
              className="mt-6"
              onClick={() => router.push('/checkout')}
            >
              Tiến hành thanh toán
            </Button>
            <p className="mt-3 text-xs text-gray-500">
              Bằng việc tiếp tục, bạn đồng ý với điều khoản mua sắm và chính sách đổi trả của chúng tôi.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
