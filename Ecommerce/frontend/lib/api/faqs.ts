import { getApiUrl } from '@/config/site';

export interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  questions: FAQQuestion[];
}

interface FAQsResponse {
  success: boolean;
  data?: FAQCategory[];
  error?: string;
}

/**
 * Fetch FAQs from Ecommerce backend.
 * Data is managed in CMS and exposed via Ecommerce backend.
 */
export async function fetchFAQs(): Promise<FAQCategory[]> {
  try {
    const apiBase = getApiUrl();
    const res = await fetch(`${apiBase}/public/faqs?active_only=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('[fetchFAQs] HTTP error:', res.status, res.statusText);
      return [];
    }

    const payload = (await res.json()) as FAQsResponse;
    if (!payload.success || !payload.data) {
      console.error('[fetchFAQs] API error:', payload.error);
      return [];
    }

    return payload.data;
  } catch (error: any) {
    console.error('[fetchFAQs] Failed to load FAQs:', {
      message: error?.message,
      stack: error?.stack,
    });
    return [];
  }
}


