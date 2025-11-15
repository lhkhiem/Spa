import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { fetchProductDetail, ProductDetailDTO } from '@/lib/api/products';

const FALLBACK_IMAGE = '/images/placeholder-product.jpg';

const extractDescription = (product: ProductDetailDTO): string | null => {
  if (product.description) {
    return product.description;
  }

  if (product.content && typeof product.content === 'object' && 'meta' in product.content) {
    const meta = (product.content as Record<string, any>).meta;
    if (meta && typeof meta.description === 'string') {
      return meta.description;
    }
  }

  return null;
};

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const detail = await fetchProductDetail(params.slug);

  if (!detail) {
    notFound();
  }

  const breadcrumb = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ];

  if (detail.categories?.length) {
    const firstCategory = detail.categories[0];
    breadcrumb.push({
      label: firstCategory.name,
      href: `/categories/${firstCategory.slug}`,
    });
  }

  breadcrumb.push({
    label: detail.name,
    href: `/products/${detail.slug}`,
  });

  const images = (detail.images ?? []).map((image) => ({
    id: image.id,
    url: image.url ?? detail.thumbnailUrl ?? FALLBACK_IMAGE,
    width: image.width ?? null,
    height: image.height ?? null,
    format: image.format ?? null,
  }));

  if (!images.length && detail.thumbnailUrl) {
    images.push({
      id: 'thumbnail',
      url: detail.thumbnailUrl,
      width: null,
      height: null,
      format: null,
    });
  }

  const relatedProducts = (detail.relatedProducts ?? []).map((related) => ({
    id: related.id,
    slug: related.slug,
    name: related.name,
    price: related.price,
    comparePrice:
      related.comparePrice !== null && related.comparePrice !== undefined
        ? related.comparePrice
        : null,
    thumbnailUrl: related.thumbnailUrl ?? FALLBACK_IMAGE,
    rating: related.rating ?? 0,
    reviewCount: related.reviewCount ?? 0,
    isFeatured: related.isFeatured ?? false,
    isBestSeller: related.isBestSeller ?? false,
    inStock: Number((related as any).stock ?? 0) > 0,
  }));

  // Ghi chú: Chuẩn hóa dữ liệu server → client để client component chỉ lo hiển thị
  const productForClient = {
    id: detail.id,
    slug: detail.slug,
    name: detail.name,
    sku: detail.sku ?? null,
    baseName: detail.baseName ?? detail.name,
    baseSlug: detail.baseSlug ?? detail.slug,
    baseSku: detail.baseSku ?? null,
    description: extractDescription(detail),
    richContent: detail.content,
    price: detail.price,
    comparePrice: detail.comparePrice ?? null,
    stock: detail.stock ?? 0,
    rating: detail.rating ?? 0,
    reviewCount: detail.reviewCount ?? 0,
    brandName: detail.brand?.name ?? null,
    breadcrumb,
    images,
    attributes: detail.attributes ?? [],
    variantCount: detail.variantCount ?? 0,
    selectedVariantId: detail.selectedVariantId ?? null,
    selectedVariantSlug: detail.selectedVariantSlug ?? null,
    variants:
      detail.variants?.map((variant) => ({
        id: variant.id,
        sku: variant.sku ?? null,
        slug: variant.slug ?? variant.sku ?? `${detail.slug}-${variant.id}`,
        summary: variant.summary ?? null,
        price: Number(variant.price),
        comparePrice:
          variant.comparePrice !== null && variant.comparePrice !== undefined
            ? Number(variant.comparePrice)
            : null,
        stock: Number.isFinite(Number(variant.stock)) ? Number(variant.stock) : 0,
        status: variant.status ?? 'active',
        optionValues: variant.optionValues ?? [],
        attributes: variant.attributes ?? [],
        titleOverride: variant.titleOverride ?? null,
        shortDescription: variant.shortDescription ?? null,
        longDescription: variant.longDescription ?? null,
        thumbnailUrl: variant.thumbnailUrl ?? null,
      })) ?? [],
    relatedProducts,
  };

  return <ProductDetailClient product={productForClient} />;
}
