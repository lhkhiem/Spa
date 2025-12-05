import { getApiUrl } from '@/config/site';
import { normalizeMediaUrl } from '@/lib/utils/domainUtils';

export interface AppearanceSettings {
  logo_asset_id: string | null;
  favicon_asset_id: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  topBannerText: string | null;
}

interface AppearanceSettingsResponse {
  success: boolean;
  data?: AppearanceSettings;
  error?: string;
}

export interface GeneralSettings {
  businessInfo: {
    company?: string;
    address?: string;
    taxCode?: string;
    phone?: string;
    email?: string;
  };
  workingHours: {
    mondayFriday?: string;
    saturday?: string;
    sunday?: string;
    phoneHours?: string;
    emailResponse?: string;
  };
}

interface GeneralSettingsResponse {
  success: boolean;
  data?: GeneralSettings;
  error?: string;
}

/**
 * Fetch storefront appearance settings (logo + favicon) from Ecommerce backend.
 * Data is managed in CMS via the shared `settings` table (namespace: appearance).
 */
export async function fetchAppearanceSettings(): Promise<AppearanceSettings | null> {
  try {
    const apiBase = getApiUrl();
    const res = await fetch(`${apiBase}/public/settings/appearance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('[fetchAppearanceSettings] HTTP error:', res.status, res.statusText);
      return null;
    }

    const payload = (await res.json()) as AppearanceSettingsResponse;
    if (!payload.success || !payload.data) {
      console.error('[fetchAppearanceSettings] API error:', payload.error);
      return null;
    }

    const data = payload.data;

    return {
      ...data,
      logoUrl: data.logoUrl || normalizeMediaUrl(data.logo_url),
      faviconUrl: data.faviconUrl || normalizeMediaUrl(data.favicon_url),
    };
  } catch (error: any) {
    console.error('[fetchAppearanceSettings] Failed to load appearance settings:', {
      message: error?.message,
      stack: error?.stack,
    });
    return null;
  }
}

/**
 * Fetch general settings (business info, working hours) from Ecommerce backend.
 * Data is managed in CMS via the shared `settings` table (namespace: general).
 */
export async function fetchGeneralSettings(): Promise<GeneralSettings | null> {
  try {
    const apiBase = getApiUrl();
    const res = await fetch(`${apiBase}/public/settings/general`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('[fetchGeneralSettings] HTTP error:', res.status, res.statusText);
      return null;
    }

    const payload = (await res.json()) as GeneralSettingsResponse;
    if (!payload.success || !payload.data) {
      console.error('[fetchGeneralSettings] API error:', payload.error);
      return null;
    }

    return payload.data;
  } catch (error: any) {
    console.error('[fetchGeneralSettings] Failed to load general settings:', {
      message: error?.message,
      stack: error?.stack,
    });
    return null;
  }
}








