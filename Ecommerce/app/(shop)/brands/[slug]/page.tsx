import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import BrandPageClient from './BrandPageClient';
import { fetchBrandBySlug } from '@/lib/api/brands';
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

const filterGroups = [
  {
    id: 'category',
    title: 'Danh mục',
    options: [
      { id: 'waxing', label: 'Wax' },
      { id: 'skin-care', label: 'Chăm sóc da' },
      { id: 'lash-brow', label: 'Mi & Chân mày' },
      { id: 'massage', label: 'Massage' },
      { id: 'manicure-pedicure', label: 'Móng tay & Móng chân' },
      { id: 'makeup', label: 'Trang điểm' },
    ],
  },
  {
    id: 'price',
    title: 'Khoảng giá',
    options: [
      { id: '0-25', label: 'Dưới $25' },
      { id: '25-50', label: '$25 - $50' },
      { id: '50-100', label: '$50 - $100' },
      { id: '100+', label: 'Trên $100' },
    ],
  },
  {
    id: 'availability',
    title: 'Tình trạng',
    options: [
      { id: 'in-stock', label: 'Còn hàng' },
      { id: 'out-of-stock', label: 'Hết hàng' },
    ],
  },
  {
    id: 'special',
    title: 'Ưu đãi đặc biệt',
    options: [
      { id: 'on-sale', label: 'Đang giảm giá' },
      { id: 'new', label: 'Hàng mới về' },
      { id: 'best-seller', label: 'Bán chạy' },
    ],
  },
];

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const brand = await fetchBrandBySlug(slug);
  if (!brand) {
    notFound();
  }

  const productsResponse = await fetchProducts({
    pageSize: 100,
    brand: slug,
    sort: 'featured',
  });

  const mappedProducts = productsResponse.data.map((product: ProductDTO) => {
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

    const categorySlug = product.categories?.[0]?.slug ?? 'uncategorized';
    const brandSlug = product.brand?.slug ?? 'unknown';

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
      category: categorySlug,
      brand: brandSlug,
      tags: [],
    };
  });

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Thương hiệu', href: '/brands' },
    { label: brand.name },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">{brand.name}</h1>
          {brand.description && (
            <p className="text-gray-600">{brand.description}</p>
          )}
        </div>

        <BrandPageClient products={mappedProducts} filterGroups={filterGroups} />
      </div>
    </div>
  );
}
