import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { fetchProductDetail, ProductDetailDTO } from '@/lib/api/products';
import { getPageMetadataFromCMS } from '@/lib/utils/pageMetadata';

const FALLBACK_IMAGE = '/images/placeholder-product.jpg';

// Normalize slug to handle various formats (same as post page)
const normalizeSlug = (slug: string): string => {
  // Decode URL-encoded characters first
  try {
    slug = decodeURIComponent(slug);
  } catch (e) {
    // If decode fails, use original slug
  }
  
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-') // Replace special chars with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

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

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  // Normalize slug to match backend normalization
  const normalizedSlug = normalizeSlug(params.slug);
  const path = `/products/${normalizedSlug}`;
  
  // 1. Try to get metadata from CMS first
  const cmsMetadata = await getPageMetadataFromCMS(path);
  
  if (cmsMetadata) {
    // CMS has custom metadata → use it
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://banyco.vn';
    const fullUrl = `${siteUrl}${path}`;
    const imageUrl = cmsMetadata.ogImage?.startsWith('http') 
      ? cmsMetadata.ogImage 
      : `${siteUrl}${cmsMetadata.ogImage}`;
    
    return {
      title: cmsMetadata.title,
      description: cmsMetadata.description,
      openGraph: {
        title: cmsMetadata.title,
        description: cmsMetadata.description,
        images: cmsMetadata.ogImage ? [imageUrl] : [],
        type: 'website',
        url: fullUrl,
        siteName: 'Banyco',
        locale: 'vi_VN',
      },
      twitter: {
        card: 'summary_large_image',
        title: cmsMetadata.title,
        description: cmsMetadata.description,
        images: cmsMetadata.ogImage ? [imageUrl] : [],
      },
    };
  }
  
  // 2. CMS doesn't have metadata → fallback to product data
  const product = await fetchProductDetail(params.slug);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://banyco.vn';
  const fullUrl = `${siteUrl}${path}`;
  const productImageUrl = product.images?.[0]?.url 
    ? (product.images[0].url.startsWith('http') 
        ? product.images[0].url 
        : `${siteUrl}${product.images[0].url}`)
    : '';
  
  const description = extractDescription(product) || product.name;
  
  return {
    title: `${product.name} - Banyco`,
    description: description,
    openGraph: {
      title: `${product.name} - Banyco`,
      description: description,
      images: productImageUrl ? [productImageUrl] : [],
      url: fullUrl,
      type: 'website',
      siteName: 'Banyco',
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Banyco`,
      description: description,
      images: productImageUrl ? [productImageUrl] : [],
    },
  };
}

// Force dynamic rendering to ensure metadata is always fresh from CMS
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No caching for metadata

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Normalize slug for fetching product
  const normalizedSlug = normalizeSlug(params.slug);
  const detail = await fetchProductDetail(normalizedSlug);

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
