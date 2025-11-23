// Tracking Scripts API
// Fetch active tracking scripts for analytics, pixels, etc.

import { getApiUrl } from '@/config/site';

export interface TrackingScript {
  id: string;
  name: string;
  type: 'analytics' | 'pixel' | 'custom' | 'tag-manager' | 'heatmap' | 'live-chat';
  provider?: string;
  position: 'head' | 'body';
  script_code: string;
  load_strategy: 'sync' | 'async' | 'defer';
  priority: number;
}

export interface TrackingScriptsResponse {
  success: boolean;
  data: TrackingScript[];
}

/**
 * Fetch active tracking scripts from CMS
 * @param page - Page identifier (optional, defaults to 'all')
 * @returns Array of active tracking scripts
 */
export async function getActiveTrackingScripts(page: string = 'all'): Promise<TrackingScript[]> {
  try {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/tracking-scripts/active?page=${encodeURIComponent(page)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh tracking scripts
    });

    if (!response.ok) {
      console.error('Failed to fetch tracking scripts:', response.statusText);
      return [];
    }

    const result: TrackingScriptsResponse = await response.json();
    
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching tracking scripts:', error);
    return [];
  }
}

/**
 * Group scripts by position (head/body)
 */
export function groupScriptsByPosition(scripts: TrackingScript[]) {
  return {
    head: scripts.filter(s => s.position === 'head').sort((a, b) => a.priority - b.priority),
    body: scripts.filter(s => s.position === 'body').sort((a, b) => a.priority - b.priority),
  };
}

