import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';
import { fetchCategoryBySlug } from '@/lib/api/categories';
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

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const category = await fetchCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const productsResponse = await fetchProducts({
    pageSize: 60,
    category: slug,
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
    const productId = product.baseProductId ?? product.id;
    const variantId = isVariant ? product.id : undefined;

    return {
      id: product.id,
      productId,
      variantId,
      slug: product.slug,
      name: product.name,
      price: formatPrice(primaryPrice),
      salePrice: salePrice !== undefined ? formatPrice(salePrice) : undefined,
      image: resolveImageUrl(product.thumbnailUrl),
      rating: Number(product.rating ?? 0),
      reviewCount: Number(product.reviewCount ?? 0),
      badge: product.isBestSeller ? 'Best Seller' : product.isFeatured ? 'Featured' : undefined,
      inStock: Number(product.stock ?? 0) > 0,
      category: slug,
      brand: product.brand?.name ?? '',
      tags: product.categories?.map((c) => c.name) ?? [],
    };
  });

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: category.name },
  ];

  return (
    <CategoryPageClient
      categoryName={category.name}
      categorySlug={slug}
      breadcrumbItems={breadcrumbItems}
      initialProducts={mappedProducts}
    />
  );
}
