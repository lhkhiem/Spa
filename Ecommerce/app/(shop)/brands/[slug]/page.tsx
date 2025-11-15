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
    title: 'Category',
    options: [
      { id: 'waxing', label: 'Waxing' },
      { id: 'skin-care', label: 'Skin Care' },
      { id: 'lash-brow', label: 'Lash & Brow' },
      { id: 'massage', label: 'Massage' },
      { id: 'manicure-pedicure', label: 'Manicure & Pedicure' },
      { id: 'makeup', label: 'Makeup' },
    ],
  },
  {
    id: 'price',
    title: 'Price Range',
    options: [
      { id: '0-25', label: 'Under $25' },
      { id: '25-50', label: '$25 - $50' },
      { id: '50-100', label: '$50 - $100' },
      { id: '100+', label: '$100+' },
    ],
  },
  {
    id: 'availability',
    title: 'Availability',
    options: [
      { id: 'in-stock', label: 'In Stock' },
      { id: 'out-of-stock', label: 'Out of Stock' },
    ],
  },
  {
    id: 'special',
    title: 'Special Offers',
    options: [
      { id: 'on-sale', label: 'On Sale' },
      { id: 'new', label: 'New Arrivals' },
      { id: 'best-seller', label: 'Best Sellers' },
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
      badge = 'Best Seller';
    } else if (hasDiscount) {
      badge = 'Sale';
    } else if (product.isFeatured) {
      badge = 'Featured';
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
    { label: 'Home', href: '/' },
    { label: 'Brands', href: '/brands' },
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
