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

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return buildFromApiOrigin(value);
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

