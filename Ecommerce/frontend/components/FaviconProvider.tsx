'use client';

import { useEffect } from 'react';
import { fetchAppearanceSettings } from '@/lib/api/settings';
import { normalizeMediaUrl } from '@/lib/utils/domainUtils';

function getMimeType(url: string): string {
  const lower = url.toLowerCase();
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.ico')) return 'image/x-icon';
  return 'image/x-icon';
}

export function FaviconProvider() {
  useEffect(() => {
    let isMounted = true;

    const updateFavicon = (rawUrl: string | null | undefined) => {
      if (!isMounted || !rawUrl) return;
      if (typeof document === 'undefined' || !document.head) return;

      const url = normalizeMediaUrl(rawUrl) || rawUrl;

      try {
        // Remove existing favicon links
        const existing = document.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"]');
        existing.forEach((el) => el.parentNode?.removeChild(el));

        const mime = getMimeType(url);

        const icon = document.createElement('link');
        icon.rel = 'icon';
        icon.type = mime;
        icon.href = url;
        document.head.appendChild(icon);

        const shortcut = document.createElement('link');
        shortcut.rel = 'shortcut icon';
        shortcut.href = url;
        document.head.appendChild(shortcut);

        const apple = document.createElement('link');
        apple.rel = 'apple-touch-icon';
        apple.href = url;
        document.head.appendChild(apple);
      } catch (error) {
        console.error('[FaviconProvider] Failed to update favicon:', error);
      }
    };

    const load = async () => {
      const settings = await fetchAppearanceSettings();
      if (!settings) return;
      updateFavicon(settings.faviconUrl || settings.favicon_url);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}





