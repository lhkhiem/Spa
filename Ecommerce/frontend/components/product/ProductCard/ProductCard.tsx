import Link from 'next/link';
import { formatPrice } from '@/lib/utils/formatters';
import Badge from '@/components/ui/Badge/Badge';
import AddToCartButton from '@/components/product/AddToCartButton/AddToCartButton';
import SafeImage from '@/components/ui/SafeImage/SafeImage';

interface ProductCardProps {
  product: {
    id: string;
    productId: string;
    variantId?: string;
    slug: string;
    name: string;
    price: number;
    salePrice?: number;
    image: string;
    rating?: number;
    reviewCount?: number;
    badge?: string;
    inStock: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="card card-hover group relative flex h-full flex-col overflow-hidden p-0">
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-2 top-2 z-10">
          <Badge variant="error">{product.badge}</Badge>
        </div>
      )}

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute right-2 top-2 z-10">
          <Badge variant="success">-{discount}%</Badge>
        </div>
      )}

      {/* Product Image - Perfect Square */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          <SafeImage
            src={product.image || '/images/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Product Info - Fixed Height for Alignment */}
      <div className="flex flex-1 flex-col p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 h-[2.5rem] text-xs font-medium leading-tight text-gray-900 hover:text-brand-purple-600">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating !== undefined && product.rating > 0 && (
          <div className="mb-2 flex items-center text-xs text-gray-600">
            <span className="mr-1">⭐ {product.rating.toFixed(1)}</span>
            {product.reviewCount && product.reviewCount > 0 && <span>({product.reviewCount})</span>}
          </div>
        )}

        {/* Spacer to push content to bottom */}
        <div className="flex-1"></div>

        {/* Price */}
        <div className="mb-2 flex items-baseline space-x-2">
          {product.salePrice ? (
            <>
              <span className="text-sm font-bold text-brand-purple-600">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {!product.inStock && (
          <p className="mb-2 text-xs text-error">Hết hàng</p>
        )}

        {/* Add to Cart Button */}
        <AddToCartButton
          productId={product.productId}
          variantId={product.variantId}
          name={product.name}
          price={product.salePrice ?? product.price}
          image={product.image}
          disabled={!product.inStock}
          variant="primary"
          size="sm"
          fullWidth
        />
      </div>
    </div>
  );
}
