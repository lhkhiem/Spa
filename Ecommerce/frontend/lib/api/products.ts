import { buildApiUrl, buildFromApiOrigin } from '@/config/site';
import { API_ENDPOINTS } from './endpoints';
import { normalizeMediaUrl } from '@/lib/utils/domainUtils';

type QueryValue = string | number | undefined | null;

const buildQueryString = (params: Record<string, QueryValue>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

export interface ProductCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface ProductBrandRef {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariantOptionDTO {
  optionId: string | null;
  optionName: string;
  optionPosition: number;
  valueId: string | null;
  value: string;
  valueCode: string | null;
  valuePosition: number;
}

export interface ProductVariantAttributeDTO {
  id: string | null;
  name: string;
  value: string | null;
}

export interface ProductVariantDTO {
  id: string;
  sku: string | null;
  slug: string;
  summary: string | null;
  price: number;
  comparePrice: number | null;
  stock: number;
  status: string;
  titleOverride?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  thumbnailAssetId?: string | null;
  thumbnailUrl: string | null;
  specs?: unknown;
  optionValues: ProductVariantOptionDTO[];
  attributes: ProductVariantAttributeDTO[];
}

export interface ProductDTO {
  id: string;
  baseProductId: string;
  baseName: string;
  baseSlug: string;
  baseSku?: string | null;
  name: string;
  slug: string;
  sku?: string | null;
  description?: string | null;
  price: number;
  comparePrice?: number | null;
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  createdAt?: string;
  publishedAt?: string | null;
  thumbnailUrl: string | null;
  brand: ProductBrandRef | null;
  categories: ProductCategoryRef[];
  rating: number;
  reviewCount: number;
  variantCount: number;
  variantSummary?: string | null;
  optionValues?: ProductVariantOptionDTO[];
  isVariant?: boolean;
  variantId?: string | null;
}

export interface ProductDetailDTO extends Omit<ProductDTO, 'variantSummary' | 'optionValues' | 'isVariant' | 'variantId'> {
  content: unknown;
  variantCount: number;
  selectedVariantId: string | null;
  selectedVariantSlug: string | null;
  variants: ProductVariantDTO[];
  images: {
    id: string;
    sortOrder: number;
    url: string | null;
    width: number | null;
    height: number | null;
    format: string | null;
  }[];
  attributes: {
    id: string;
    name: string;
    value: string;
  }[];
  relatedProducts: ProductDTO[];
}

export interface ProductListResponse {
  data: ProductDTO[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface FetchProductsParams {
  page?: number;
  pageSize?: number;
  q?: string;
  sort?: string;
  category?: string; // comma separated slugs
  brand?: string; // comma separated slugs
  price?: string; // comma separated ranges
  availability?: string; // comma separated values
  special?: string; // comma separated values
}

interface ApiListResponse<T> {
  success?: boolean;
  data?: T;
  meta?: ProductListResponse['meta'];
}

interface ApiDetailResponse<T> {
  success?: boolean;
  data?: T;
}

export const fetchProducts = async (
  params: FetchProductsParams = {}
): Promise<ProductListResponse> => {
  const query = buildQueryString({
    page: params.page,
    pageSize: params.pageSize,
    q: params.q,
    sort: params.sort,
    category: params.category,
    brand: params.brand,
    price: params.price,
    availability: params.availability,
    special: params.special,
  });

  const url = buildApiUrl(`${API_ENDPOINTS.PRODUCTS.LIST}${query ? `?${query}` : ''}`);

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[fetchProducts] Failed to fetch products', response.statusText);
      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          pageSize: params.pageSize ?? 20,
          totalPages: 0,
        },
      };
    }

    const payload = (await response.json()) as ApiListResponse<ProductDTO[]>;
    const products = payload.data ?? [];

    return {
      data: products.map((product) => {
        const optionValues = Array.isArray(product.optionValues)
          ? product.optionValues.map((option) => ({
              optionId: option?.optionId ?? null,
              optionName: option?.optionName ?? '',
              optionPosition: option?.optionPosition ?? 0,
              valueId: option?.valueId ?? null,
              value: option?.value ?? '',
              valueCode: option?.valueCode ?? null,
              valuePosition: option?.valuePosition ?? 0,
            }))
          : [];

        return {
          ...product,
          thumbnailUrl: normalizeMediaUrl(product.thumbnailUrl),
          categories: product.categories ?? [],
          brand: product.brand ?? null,
          rating: product.rating ?? 0,
          reviewCount: product.reviewCount ?? 0,
          variantCount: Number(product.variantCount ?? 0),
          variantSummary: product.variantSummary ?? null,
          optionValues,
          isVariant: product.isVariant ?? false,
          variantId: product.variantId ?? null,
        };
      }),
      meta: payload.meta ?? {
        total: products.length,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? products.length,
        totalPages: 1,
      },
    };
  } catch (error) {
    console.error('[fetchProducts] Error', error);
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        pageSize: params.pageSize ?? 20,
        totalPages: 0,
      },
    };
  }
};

export const fetchProductDetail = async (
  slug: string
): Promise<ProductDetailDTO | null> => {
  if (!slug) {
    return null;
  }

  const url = buildApiUrl(API_ENDPOINTS.PRODUCTS.DETAIL(slug));

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[fetchProductDetail] Failed', response.statusText);
      return null;
    }

    const payload = (await response.json()) as ApiDetailResponse<ProductDetailDTO>;
    if (!payload.data) {
      return null;
    }

    const detail = payload.data;

    const variants: ProductVariantDTO[] = Array.isArray(detail.variants)
      ? detail.variants.map((variant) => {
          const optionValues = Array.isArray(variant.optionValues)
            ? variant.optionValues.map((option) => ({
                optionId: option?.optionId ?? null,
                optionName: option?.optionName ?? '',
                optionPosition: option?.optionPosition ?? 0,
                valueId: option?.valueId ?? null,
                value: option?.value ?? '',
                valueCode: option?.valueCode ?? null,
                valuePosition: option?.valuePosition ?? 0,
              }))
            : [];

          const attributes = Array.isArray(variant.attributes)
            ? variant.attributes.map((attribute) => ({
                id: attribute?.id ?? null,
                name: attribute?.name ?? '',
                value: attribute?.value ?? null,
              }))
            : [];

          return {
            ...variant,
            slug: variant.slug ?? variant.sku ?? '',
            summary: variant.summary ?? null,
            price: Number(variant.price),
            comparePrice:
              variant.comparePrice !== null && variant.comparePrice !== undefined
                ? Number(variant.comparePrice)
                : null,
            stock: Number.isFinite(Number(variant.stock))
              ? Number(variant.stock)
              : 0,
            thumbnailUrl: normalizeMediaUrl(variant.thumbnailUrl),
            optionValues,
            attributes,
          };
        })
      : [];

    return {
      ...detail,
      thumbnailUrl: normalizeMediaUrl(detail.thumbnailUrl),
      variantCount: Number(detail.variantCount ?? 0),
      selectedVariantId: detail.selectedVariantId ?? null,
      selectedVariantSlug: detail.selectedVariantSlug ?? null,
      variants,
      images:
        detail.images?.map((image) => ({
          ...image,
          url: normalizeMediaUrl(image.url),
        })) ?? [],
      relatedProducts:
        detail.relatedProducts?.map((product) => ({
          ...product,
          thumbnailUrl: normalizeMediaUrl(product.thumbnailUrl),
          variantCount: Number(product.variantCount ?? 0),
          variantSummary: product.variantSummary ?? null,
          optionValues: Array.isArray(product.optionValues)
            ? product.optionValues.map((option) => ({
                optionId: option?.optionId ?? null,
                optionName: option?.optionName ?? '',
                optionPosition: option?.optionPosition ?? 0,
                valueId: option?.valueId ?? null,
                value: option?.value ?? '',
                valueCode: option?.valueCode ?? null,
                valuePosition: option?.valuePosition ?? 0,
              }))
            : [],
        })) ?? [],
    };
  } catch (error) {
    console.error('[fetchProductDetail] Error', error);
    return null;
  }
};

