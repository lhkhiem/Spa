import { buildApiUrl, buildFromApiOrigin } from '@/config/site';
import { API_ENDPOINTS } from './endpoints';

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

const normalizeMediaUrl = (raw: unknown): string | null => {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const cleaned = raw.replace(/\\/g, '/');
  let url: string;
  
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    url = cleaned;
  } else {
    url = buildFromApiOrigin(cleaned);
  }
  
  // Always replace IP address with domain name (which has HTTPS via reverse proxy)
  // This fixes Mixed Content issues both on client and server side
  const ipPattern = /https?:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?/;
  const ipMatch = url.match(ipPattern);
  if (ipMatch) {
    // Replace IP with api subdomain (which has HTTPS via reverse proxy)
    // Don't include port because nginx reverse proxy handles it
    url = url.replace(ipMatch[0], 'https://api.banyco-demo.pressup.vn');
  }
  
  // Fix Mixed Content issues when page is loaded over HTTPS
  // Convert HTTP to HTTPS for production domains
  if (url.startsWith('http://')) {
    const isProductionDomain = url.includes('banyco-demo.pressup.vn') || 
                               url.includes('pressup.vn') ||
                               url.includes('api.banyco-demo.pressup.vn');
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
    
    // Convert to HTTPS for production domains, or if page is loaded over HTTPS
    if (isProductionDomain || (!isLocalhost && typeof window !== 'undefined' && window.location.protocol === 'https:')) {
      url = url.replace('http://', 'https://');
    }
  }
  
  return url;
};

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



