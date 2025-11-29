import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import ProductCard from '@/components/product/ProductCard/ProductCard';
import NewsletterForm from '@/components/newsletter/NewsletterForm';
import { fetchProducts } from '@/lib/api/products';
import { buildFromApiOrigin } from '@/config/site';
import type { ProductDTO } from '@/lib/api/products';

const FALLBACK_IMAGE = '/images/placeholder-product.jpg';

import { formatPrice } from '@/lib/utils/formatters';

const resolveImageUrl = (value: any) => {
  if (!value || typeof value !== 'string') {
    return FALLBACK_IMAGE;
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return buildFromApiOrigin(value);
};

// TODO: Replace hardcoded mockup data with API calls
// These should be fetched from CMS/backend API (e.g., /api/deal-categories, /api/promotional-banners)
// For now, keeping empty arrays to avoid displaying mockup data
const dealCategories: Array<{ id: string; name: string; count: number }> = [];

const banners: Array<{
  title: string;
  description: string;
  cta: string;
  href: string;
  bgColor: string;
}> = [];

export default async function DealsPage() {
  // Fetch products on sale
  const productsResponse = await fetchProducts({
    pageSize: 8,
    special: 'on-sale',
    sort: 'featured',
  });

  const featuredDeals = productsResponse.data.slice(0, 8).map((product: ProductDTO) => {
    const hasDiscount =
      product.comparePrice !== null &&
      product.comparePrice !== undefined &&
      product.comparePrice > product.price;

    const primaryPrice = hasDiscount ? product.comparePrice ?? product.price : product.price;
    const salePrice = hasDiscount ? product.price : undefined;

    const isVariant = product.isVariant ?? false;
    const productId = isVariant && product.variantId ? product.variantId : product.id;

    let badge: string | undefined;
    if (product.isBestSeller) {
      badge = 'Bán chạy';
    } else if (hasDiscount) {
      badge = 'Giảm giá';
    } else if (product.isFeatured) {
      badge = 'Nổi bật';
    }

    return {
      id: productId,
      productId: product.baseProductId ?? product.id,
      variantId: isVariant ? product.variantId : undefined,
      slug: product.slug,
      name: product.name,
      price: Math.round(primaryPrice), // VNĐ - integer only
      salePrice: salePrice ? Math.round(salePrice) : undefined,
      image: resolveImageUrl(product.thumbnailUrl),
      rating: product.rating ?? 0,
      reviewCount: product.reviewCount ?? 0,
      badge,
      inStock: product.stock > 0,
    };
  });

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Ưu đãi', href: '/deals' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-pink-600 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Ưu đãi</h1>
            <p className="mb-8 max-w-2xl text-lg text-red-100">
              Khám phá ưu đãi hấp dẫn cho sản phẩm spa và salon chuyên nghiệp. Ưu đãi có thời hạn,
              xả kho và combo độc quyền – tất cả trong một nơi.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                Xem tất cả ưu đãi
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-red-600"
              >
                Đăng ký nhận thông báo ưu đãi
              </Button>
            </div>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        {/* Promotional Banners */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {banners.map((banner, index) => (
            <FadeInSection key={index} delay={index * 100}>
              <Link
                href={banner.href}
                className={`group block rounded-2xl bg-gradient-to-br ${banner.bgColor} p-6 text-white shadow-lg transition-all hover:shadow-2xl`}
              >
                <h3 className="mb-2 text-xl font-bold">{banner.title}</h3>
                <p className="mb-4 text-sm opacity-90">{banner.description}</p>
                <span className="inline-flex items-center font-semibold">
                  {banner.cta}
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            </FadeInSection>
          ))}
        </div>

        {/* Deal Categories */}
        <FadeInSection>
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Duyệt theo danh mục</h2>
            <div className="flex flex-wrap gap-3">
              {dealCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?special=on-sale&category=${category.id}`}
                  className="rounded-full bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-md transition-all hover:bg-brand-purple-600 hover:text-white hover:shadow-lg"
                >
                  {category.name} ({category.count})
                </Link>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Featured Deals */}
        <div className="mb-12">
          <FadeInSection>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Ưu đãi tốt nhất hôm nay</h2>
              <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600">
                ⏰ Sắp kết thúc
              </div>
            </div>
          </FadeInSection>
          {featuredDeals.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredDeals.map((product, index) => (
                <FadeInSection key={product.id} delay={index * 50}>
                  <ProductCard product={{ ...product, variantId: product.variantId ?? undefined }} />
                </FadeInSection>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-12 text-center">
              <p className="text-gray-600">Hiện chưa có ưu đãi. Vui lòng quay lại sau!</p>
            </div>
          )}
        </div>

        {/* Deal of the Week */}
        {featuredDeals.length > 0 && (
          <FadeInSection>
            <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-purple-700 shadow-2xl">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={featuredDeals[0]?.image ?? FALLBACK_IMAGE}
                    alt="Ưu đãi của tuần"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 text-white md:p-12">
                  <div className="mb-4 inline-block rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-purple-900">
                    ƯU ĐÃI CỦA TUẦN
                  </div>
                  <h2 className="mb-4 text-3xl font-bold">{featuredDeals[0]?.name}</h2>
                  <p className="mb-6 text-lg text-purple-100">
                    Số lượng có hạn – mua ngay kẻo lỡ!
                  </p>
                  <div className="mb-6">
                    {featuredDeals[0]?.salePrice && (
                      <>
                        <span className="mr-4 text-4xl font-bold">
                          ${featuredDeals[0].salePrice}
                        </span>
                        <span className="text-xl text-purple-300 line-through">
                          ${featuredDeals[0].price}
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    href={`/products/${featuredDeals[0]?.slug}`}
                    size="lg"
                    className="bg-yellow-400 text-purple-900 hover:bg-yellow-300"
                  >
                    Nhận ưu đãi
                  </Button>
                </div>
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Newsletter Signup */}
        <FadeInSection>
          <div className="rounded-2xl bg-white p-8 text-center shadow-lg md:p-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Đừng bỏ lỡ ưu đãi</h2>
            <p className="mb-6 text-gray-600">
              Đăng ký nhận bản tin để cập nhật ưu đãi độc quyền, flash sale và sản phẩm mới.
            </p>
            <NewsletterForm
              source="deals-page"
              className="mx-auto flex max-w-md gap-2"
              inputClassName="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-purple-500 focus:outline-none focus:ring-2 focus:ring-brand-purple-500/20"
              buttonClassName="px-6 py-3 bg-brand-purple-600 text-white rounded-lg hover:bg-brand-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              placeholder="Nhập email của bạn"
              buttonText="Đăng ký"
            />
            <p className="mt-4 text-sm text-gray-500">
              Bằng việc đăng ký, bạn đồng ý nhận email marketing. Có thể hủy bất kỳ lúc nào.
            </p>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
