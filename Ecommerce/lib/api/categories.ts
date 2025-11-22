import { buildApiUrl, buildFromApiOrigin } from '@/config/site';

export interface ProductCategorySummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  productCount: number;
}

const normalizeMediaUrl = (value: unknown): string | null => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  let url: string;
  
  if (value.startsWith('http://') || value.startsWith('https://')) {
    url = value;
  } else {
    url = buildFromApiOrigin(value);
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

export async function fetchProductCategories(): Promise<ProductCategorySummary[]> {
  try {
    const response = await fetch(buildApiUrl('/product-categories'), {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('[fetchProductCategories] Failed to load categories', response.statusText);
      return [];
    }

    const json = await response.json();
    const data = json?.data ?? [];

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description ?? null,
      imageUrl: normalizeMediaUrl(item.image_url),
      productCount: Number(item.product_count) || 0,
    }));
  } catch (error) {
    console.error('[fetchProductCategories] Error', error);
    return [];
  }
}

export async function fetchCategoryBySlug(
  slug: string
): Promise<ProductCategorySummary | null> {
  try {
    const response = await fetch(buildApiUrl(`/product-categories/slug/${slug}`), {
      next: { revalidate: 60 },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error('[fetchCategoryBySlug] Failed to fetch category', response.statusText);
      return null;
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      imageUrl: normalizeMediaUrl(data.image_url),
      productCount: Number(data.product_count) || 0,
    };
  } catch (error) {
    console.error('[fetchCategoryBySlug] Error', error);
    return null;
  }
}

