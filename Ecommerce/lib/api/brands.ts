import { buildApiUrl, buildFromApiOrigin } from '@/config/site';
import { API_ENDPOINTS } from './endpoints';
import { normalizeMediaUrl } from '@/lib/utils/domainUtils';

export interface BrandSummaryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  is_featured?: boolean;
  product_count?: number;
  primary_category?: string | null;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

export const fetchBrands = async (options?: { featured_only?: boolean }): Promise<BrandSummaryDTO[]> => {
  const url = buildApiUrl(API_ENDPOINTS.BRANDS.LIST);
  const searchParams = new URLSearchParams();
  
  if (options?.featured_only) {
    searchParams.append('featured_only', 'true');
  }
  
  const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  try {
    const response = await fetch(fullUrl, { next: { revalidate: 300 } });
    if (!response.ok) {
      console.error('[fetchBrands] Failed', response.statusText);
      return [];
    }

    const payload = (await response.json()) as ApiResponse<BrandSummaryDTO[]>;
    return (payload.data ?? []).map((brand) => ({
      ...brand,
      logoUrl: normalizeMediaUrl((brand as any).logo_url ?? brand.logoUrl),
      product_count: Number((brand as any).product_count) || 0,
      primary_category: (brand as any).primary_category || null,
    }));
  } catch (error) {
    console.error('[fetchBrands] Error', error);
    return [];
  }
};

export const fetchBrandBySlug = async (slug: string): Promise<BrandSummaryDTO | null> => {
  // Try slug endpoint first
  const slugUrl = buildApiUrl(`/brands/slug/${slug}`);
  
  try {
    const slugResponse = await fetch(slugUrl, { next: { revalidate: 300 } });
    if (slugResponse.ok) {
      const payload = (await slugResponse.json()) as ApiResponse<BrandSummaryDTO>;
      if (payload.data) {
        return {
          ...payload.data,
          logoUrl: normalizeMediaUrl((payload.data as any).logo_url ?? payload.data.logoUrl),
          product_count: Number((payload.data as any).product_count) || 0,
          primary_category: (payload.data as any).primary_category || null,
        };
      }
    }
  } catch (error) {
    console.error('[fetchBrandBySlug] Slug endpoint failed, trying detail endpoint', error);
  }

  // Fallback to detail endpoint
  const url = buildApiUrl(API_ENDPOINTS.BRANDS.DETAIL(slug));

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error('[fetchBrandBySlug] Failed', response.statusText);
      return null;
    }

    const payload = (await response.json()) as ApiResponse<BrandSummaryDTO>;
    if (!payload.data) {
      return null;
    }

    return {
      ...payload.data,
      logoUrl: normalizeMediaUrl((payload.data as any).logo_url ?? payload.data.logoUrl),
      product_count: Number((payload.data as any).product_count) || 0,
      primary_category: (payload.data as any).primary_category || null,
    };
  } catch (error) {
    console.error('[fetchBrandBySlug] Error', error);
    return null;
  }
};



