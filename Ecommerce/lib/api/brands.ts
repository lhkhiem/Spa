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
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }

  return buildFromApiOrigin(cleaned);
};

export const fetchBrands = async (): Promise<BrandSummaryDTO[]> => {
  const url = buildApiUrl(API_ENDPOINTS.BRANDS.LIST);

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) {
      console.error('[fetchBrands] Failed', response.statusText);
      return [];
    }

    const payload = (await response.json()) as ApiResponse<BrandSummaryDTO[]>;
    return (payload.data ?? []).map((brand) => ({
      ...brand,
      logoUrl: normalizeMediaUrl((brand as any).logo_url ?? brand.logoUrl),
    }));
  } catch (error) {
    console.error('[fetchBrands] Error', error);
    return [];
  }
};

export const fetchBrandBySlug = async (slug: string): Promise<BrandSummaryDTO | null> => {
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
    };
  } catch (error) {
    console.error('[fetchBrandBySlug] Error', error);
    return null;
  }
};



