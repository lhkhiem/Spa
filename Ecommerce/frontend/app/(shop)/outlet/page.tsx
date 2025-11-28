import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import ProductCard from '@/components/product/ProductCard/ProductCard';
import { fetchProducts } from '@/lib/api/products';
import { buildFromApiOrigin } from '@/config/site';
import type { ProductDTO } from '@/lib/api/products';

const FALLBACK_IMAGE = '/images/placeholder-product.jpg';

const formatPrice = (value: any) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const resolveImageUrl = (value: any) => {
  if (!value || typeof value !== 'string') {
    return FALLBACK_IMAGE;
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return buildFromApiOrigin(value);
};

export default async function OutletPage() {
  // Fetch outlet/clearance products (products with significant discounts)
  const productsResponse = await fetchProducts({
    pageSize: 20,
    special: 'on-sale',
    sort: 'featured',
  });

  // Filter for products with significant discounts (outlet items)
  const clearanceItems = productsResponse.data
    .filter((product: ProductDTO) => {
      if (!product.comparePrice) return false;
      const hasDiscount = product.comparePrice > product.price;
      if (!hasDiscount) return false;

      const discountPercent = ((product.comparePrice - product.price) / product.comparePrice) * 100;
      return discountPercent >= 30; // At least 30% off for outlet items
    })
    .slice(0, 4)
    .map((product: ProductDTO) => {
      const hasDiscount =
        product.comparePrice !== null &&
        product.comparePrice !== undefined &&
        product.comparePrice > product.price;

      const primaryPrice = hasDiscount ? product.comparePrice ?? product.price : product.price;
      const salePrice = hasDiscount ? product.price : undefined;

      const isVariant = product.isVariant ?? false;
      const productId = isVariant && product.variantId ? product.variantId : product.id;

      const discountPercent = hasDiscount
        ? Math.round(((primaryPrice - (salePrice ?? primaryPrice)) / primaryPrice) * 100)
        : 0;

      let badge: string | undefined;
      if (discountPercent >= 50) {
        badge = `${discountPercent}% GIẢM`;
      } else if (discountPercent >= 30) {
        badge = 'Xả kho';
      } else {
        badge = 'Giảm giá';
      }

      return {
        id: productId,
        productId: product.baseProductId ?? product.id,
        variantId: isVariant ? product.variantId : undefined,
        slug: product.slug,
        name: product.name,
        price: formatPrice(primaryPrice),
        salePrice: salePrice ? formatPrice(salePrice) : undefined,
        image: resolveImageUrl(product.thumbnailUrl),
        rating: product.rating ?? 0,
        reviewCount: product.reviewCount ?? 0,
        badge,
        inStock: product.stock > 0,
      };
    });

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'UCo Outlet', href: '/outlet' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">UCo Outlet</h1>
            <p className="max-w-2xl text-lg text-red-50">
              Tiết kiệm lớn với các sản phẩm xả kho, trưng bày và ngừng sản xuất. Số lượng có hạn –
              mua ngay kẻo hết!
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        <FadeInSection>
          <div className="mb-8 rounded-xl bg-yellow-50 border-2 border-yellow-200 p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900">Lưu ý quan trọng</h3>
                <p className="mt-1 text-sm text-yellow-800">
                  Tất cả sản phẩm Outlet là bán cuối, không đổi trả. Sản phẩm có thể là hàng trưng
                  bày, ngừng sản xuất hoặc thay đổi bao bì. Tất cả đều được kiểm tra và đảm bảo hoạt
                  động tốt.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        <div className="mb-12">
          <FadeInSection>
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Sản phẩm xả kho nổi bật</h2>
          </FadeInSection>
          {clearanceItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {clearanceItems.map((product, index) => (
                <FadeInSection key={product.id} delay={index * 100}>
                  <ProductCard product={{ ...product, variantId: product.variantId ?? undefined }} />
                </FadeInSection>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-12 text-center">
              <p className="text-gray-600">
                Hiện chưa có sản phẩm Outlet. Vui lòng quay lại sau để săn deal!
              </p>
            </div>
          )}
        </div>

        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Nhận thông báo ưu đãi Outlet</h2>
            <p className="mb-6 text-lg text-purple-100">
              Đăng ký nhận email thông báo để cập nhật khi có sản phẩm xả kho mới.
            </p>
            <div className="mx-auto flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 rounded-lg px-4 py-3 text-gray-900"
              />
              <button className="rounded-lg bg-white px-6 py-3 font-semibold text-brand-purple-600 hover:bg-purple-50">
                Đăng ký
              </button>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
