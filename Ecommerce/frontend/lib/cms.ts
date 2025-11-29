/**
 * Menu API Client
 * Handles menu-related API calls to Ecommerce Backend
 */

import {
  CMSMenuItem,
  CMSMenuLocation,
} from '@/lib/types/cms';
import { getApiUrl } from '@/config/site';

const menuLocationCache = new Map<string, string>();
// Note: getApiUrl() already includes /api, so endpoint should not have /api prefix
const MENU_LOCATIONS_ENDPOINT = '/menu-locations';

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim());

const toCacheKey = (value: string) => value.trim().toLowerCase();

const cacheMenuLocation = (location: CMSMenuLocation) => {
  const keys = new Set<string>();
  keys.add(toCacheKey(location.id));
  if (location.slug) {
    keys.add(toCacheKey(location.slug));
  }
  if (location.name) {
    keys.add(toCacheKey(location.name));
  }

  keys.forEach((key) => menuLocationCache.set(key, location.id));
};

/**
 * Menu API
 */
const resolveMenuLocationId = async (identifier?: string): Promise<string | null> => {
  if (!identifier) {
    return null;
  }

  const trimmed = identifier.trim();
  if (!trimmed) {
    return null;
  }

  if (isUuid(trimmed)) {
    return trimmed;
  }

  const cached = menuLocationCache.get(toCacheKey(trimmed));
  if (cached) {
    return cached;
  }

  try {
    // Use Ecommerce Backend API
    const apiUrl = getApiUrl();
    const url = `${apiUrl}${MENU_LOCATIONS_ENDPOINT}`;
    
    // Debug logging - always log in browser for troubleshooting
    if (typeof window !== 'undefined') {
      console.log('[Menu] Fetching menu locations from:', url);
    }
    
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for CORS
    };
    
    // Only add next option in server-side (Next.js)
    if (typeof window === 'undefined') {
      (fetchOptions as any).next = { revalidate: 3600 }; // Cache for 1 hour
    }
    
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Failed to fetch menu locations: ${response.status} ${errorText}`);
    }

    const data: { data?: CMSMenuLocation[] } = await response.json();
    
    // Debug: log response structure
    if (typeof window !== 'undefined') {
      console.log('[Menu] Menu locations API response:', {
        hasData: 'data' in data,
        dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
        dataLength: Array.isArray(data.data) ? data.data.length : 'N/A',
        rawData: data,
      });
    }
    
    const locations = data.data || [];

    if (locations.length === 0) {
      console.warn('[Menu] No menu locations found in API response');
      return null;
    }

    // Cache all locations
    locations.forEach((location) => {
      if (location?.id) {
        cacheMenuLocation(location);
      }
    });

    // Try to resolve the identifier
    const resolvedId = menuLocationCache.get(toCacheKey(trimmed));
    
    if (!resolvedId) {
      // Debug: log cache state
      console.warn(`[Menu] Menu location "${trimmed}" not found in API response.`);
      console.warn(`[Menu] Available locations:`, locations.map(l => ({ id: l.id, slug: l.slug, name: l.name })));
      console.warn(`[Menu] Cache keys:`, Array.from(menuLocationCache.keys()));
      console.warn(`[Menu] Looking for key:`, toCacheKey(trimmed));
    }
    
    return resolvedId ?? null;
  } catch (error: any) {
    console.error('[Menu] Failed to resolve menu location id', error);
    console.error('[Menu] Error details:', {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      cause: error?.cause,
    });
    // If it's a network error, provide more helpful message
    if (error?.message?.includes('Failed to fetch') || error?.name === 'TypeError') {
      const apiUrl = getApiUrl();
      const attemptedUrl = `${apiUrl}${MENU_LOCATIONS_ENDPOINT}`;
      console.error('[Menu] This appears to be a network/CORS error. Check:');
      console.error('  1. Is the API URL correct?', attemptedUrl);
      console.error('  2. Are CORS headers set correctly on the backend?');
      console.error('  3. Is the API server running and accessible?');
    }
    return null;
  }
};

export async function getMenuItems(menuIdentifier?: string): Promise<CMSMenuItem[]> {
  // If no identifier provided, try to get from environment variable
  const identifier = menuIdentifier || process.env.NEXT_PUBLIC_MAIN_MENU_ID;
  
  if (!identifier) {
    console.warn('[Menu] Menu identifier not configured. Set NEXT_PUBLIC_MAIN_MENU_ID environment variable.');
    return [];
  }

  console.log(`[Menu] Resolving menu location for identifier: "${identifier}"`);
  const locationId = await resolveMenuLocationId(identifier);

  if (!locationId) {
    console.warn(`[Menu] Menu location not found for identifier: "${identifier}"`);
    console.warn(`[Menu] Troubleshooting:`);
    console.warn(`  1. Check Network tab for request to /api/menu-locations`);
    console.warn(`  2. Verify the API URL is correct`);
    console.warn(`  3. Check if fetch succeeded and response was parsed correctly`);
    return [];
  }

  console.log(`[Menu] Found menu location ID: ${locationId} for identifier: "${identifier}"`);

  try {
    // Use Ecommerce Backend API
    const apiUrl = getApiUrl();
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Only add next option in server-side (Next.js)
    if (typeof window === 'undefined') {
      (fetchOptions as any).next = { revalidate: 3600 }; // Cache for 1 hour
    }
    
    // Note: apiUrl already includes /api, so use /menu-items (not /api/menu-items)
    const response = await fetch(`${apiUrl}/menu-items?location_id=${encodeURIComponent(locationId)}`, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch menu items: ${response.statusText}`);
    }

    const data: { data?: CMSMenuItem[]; flat?: CMSMenuItem[] } = await response.json();
    const items = Array.isArray(data?.data) && data.data.length ? data.data : data.flat ?? [];
    return items ?? [];
  } catch (error) {
    console.error('[Menu] Failed to fetch menu items', error);
    return [];
  }
}
