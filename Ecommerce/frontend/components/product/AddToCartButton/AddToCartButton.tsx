'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiShoppingCart } from 'react-icons/fi';
import Button from '@/components/ui/Button/Button';
import { useCartStore } from '@/lib/stores/cartStore';

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  image?: string | null;
  quantity?: number;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showIcon?: boolean;
}

export default function AddToCartButton({
  productId,
  variantId,
  name,
  price,
  image,
  quantity = 1,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showIcon = true,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      addItem({
        productId,
        variantId,
        quantity,
        price,
        name,
        image: image ?? '/images/placeholder-product.jpg',
      });

      toast.success('Đã thêm vào giỏ hàng', {
        duration: 2500,
        position: 'top-right',
        icon: '🛒',
        style: { minWidth: '220px' },
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isAdding}
      disabled={disabled}
      onClick={handleAddToCart}
      className="flex items-center justify-center"
    >
      {!isAdding && showIcon && <FiShoppingCart className="mr-2 h-4 w-4" />}
      {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
    </Button>
  );
}
