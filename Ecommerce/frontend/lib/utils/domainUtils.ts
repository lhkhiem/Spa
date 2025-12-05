/**
 * Domain utility functions for frontend
 * Handles domain configuration from environment variables
 */

import { buildFromApiOrigin } from '@/config/site';

/**
 * Get API domain from environment variable
 */
export const getApiDomain = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use env var or current hostname
    return process.env.NEXT_PUBLIC_API_DOMAIN || window.location.hostname;
  }
  // Server-side: use env var
  return process.env.NEXT_PUBLIC_API_DOMAIN || 'localhost';
};

/**
 * Get frontend domain from environment variable
 */
export const getFrontendDomain = (): string => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || window.location.hostname;
  }
  return process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'localhost';
};

/**
 * Get full API URL with protocol
 */
export const getApiUrl = (): string => {
  const domain = getApiDomain();
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    return `${protocol}//${domain}`;
  }
  // Server-side: default to HTTPS for production
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? `https://${domain}` : `http://${domain}`;
};

/**
 * Check if a URL belongs to production domain
 */
export const isProductionDomain = (url: string): boolean => {
  const frontendDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  
  if (!frontendDomain && !apiDomain) {
    return false; // Development mode
  }
  
  const domains = [frontendDomain, apiDomain].filter(Boolean);
  return domains.some(domain => domain && url.includes(domain));
};

/**
 * Replace IP address with configured API domain
 */
export const replaceIpWithDomain = (url: string): string => {
  const ipPattern = /https?:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?/;
  const ipMatch = url.match(ipPattern);
  
  if (ipMatch) {
    const apiUrl = getApiUrl();
    return url.replace(ipMatch[0], apiUrl);
  }
  
  return url;
};

/**
 * Normalize media URL - replace IP with domain and convert HTTP to HTTPS if needed
 * This is the main function to use for normalizing media URLs in frontend
 * IMPORTANT: All images must be served from ecommerce-api.banyco.vn, not CMS backend
 */
export const normalizeMediaUrl = (raw: unknown): string | null => {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const cleaned = raw.replace(/\\/g, '/');
  let url: string;
  
  if (typeof window !== 'undefined') {
    const isProduction = window.location.hostname !== 'localhost' && 
                        !window.location.hostname.includes('127.0.0.1') &&
                        (window.location.hostname.includes('banyco.vn') || window.location.hostname.includes('vercel.app'));
    
    // Get ecommerce API origin (always use ecommerce-api.banyco.vn for images in production)
    const ecommerceApiOrigin = isProduction 
      ? 'https://ecommerce-api.banyco.vn'
      : buildFromApiOrigin('');
    
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      url = cleaned;
      
      // CRITICAL: ALWAYS replace localhost/127.0.0.1 - NO EXCEPTIONS
      // This must happen regardless of production mode to prevent mixed content errors
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        const beforeReplace = url;
        url = url.replace(/https?:\/\/localhost(:\d+)?/gi, ecommerceApiOrigin);
        url = url.replace(/https?:\/\/127\.0\.0\.1(:\d+)?/gi, ecommerceApiOrigin);
        if (beforeReplace !== url) {
          console.warn(`[normalizeMediaUrl] FORCED localhost replacement: ${beforeReplace} -> ${url}`);
        }
      }
      
      // IMPORTANT: Replace any CMS backend URLs (api.banyco.vn) with ecommerce-api.banyco.vn
      // This ensures images are served from ecommerce backend, not CMS
      if (isProduction && url.includes('banyco.vn')) {
        // Replace api.banyco.vn with ecommerce-api.banyco.vn
        if (url.includes('api.banyco.vn') && !url.includes('ecommerce-api.banyco.vn')) {
          const urlObj = new URL(url);
          const path = urlObj.pathname + urlObj.search + urlObj.hash;
          url = `${ecommerceApiOrigin}${path}`;
          console.log(`[normalizeMediaUrl] Replaced CMS URL with Ecommerce: ${cleaned} -> ${url}`);
        }
        // Replace any URL with port 3011 (CMS backend) with ecommerce-api
        if (url.includes(':3011')) {
          const urlObj = new URL(url);
          const path = urlObj.pathname + urlObj.search + urlObj.hash;
          url = `${ecommerceApiOrigin}${path}`;
          console.log(`[normalizeMediaUrl] Replaced CMS port 3011 with Ecommerce: ${cleaned} -> ${url}`);
        }
      }
    } else {
      // Relative path - use ecommerce backend URL
      url = `${ecommerceApiOrigin}${cleaned.startsWith('/') ? '' : '/'}${cleaned}`;
    }
  } else {
    // Server-side: use buildFromApiOrigin
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      url = cleaned;
    } else {
      url = buildFromApiOrigin(cleaned);
    }
  }
  
  // CRITICAL: Final check - if URL still contains localhost/127.0.0.1, FORCE replace it
  // This is a safety net to catch any localhost that might have slipped through
  if (typeof window !== 'undefined') {
    const isProduction = window.location.hostname !== 'localhost' && 
                        !window.location.hostname.includes('127.0.0.1') &&
                        (window.location.hostname.includes('banyco.vn') || window.location.hostname.includes('vercel.app'));
    
    const ecommerceApiOrigin = isProduction 
      ? 'https://ecommerce-api.banyco.vn'
      : buildFromApiOrigin('');
    
    // ABSOLUTE SAFETY: If we're on production domain and URL still has localhost, FORCE replace
    if (isProduction && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      console.error(`[normalizeMediaUrl] CRITICAL: Found localhost in production! Forcing replacement: ${url}`);
      url = url.replace(/https?:\/\/localhost(:\d+)?/gi, ecommerceApiOrigin);
      url = url.replace(/https?:\/\/127\.0\.0\.1(:\d+)?/gi, ecommerceApiOrigin);
      console.error(`[normalizeMediaUrl] After forced replacement: ${url}`);
    }
  }
  
  // Fix common path issues: /upload/ should be /uploads/
  // This handles cases where database has /upload/ instead of /uploads/
  url = url.replace(/\/upload\/(?!s)/g, '/uploads/');
  
  // Replace IP with domain
  url = replaceIpWithDomain(url);
  
  // Convert HTTP to HTTPS for production domains
  if (url.startsWith('http://')) {
    const isProduction = isProductionDomain(url);
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
    
    if (isProduction || (!isLocalhost && typeof window !== 'undefined' && window.location.protocol === 'https:')) {
      url = url.replace('http://', 'https://');
    }
  }
  
  // Final normalization: ensure URL format is exactly https://ecommerce-api.banyco.vn/uploads/...
  if (typeof window !== 'undefined') {
    const isProduction = window.location.hostname !== 'localhost' && 
                        !window.location.hostname.includes('127.0.0.1') &&
                        window.location.hostname.includes('banyco.vn');
    
    if (isProduction) {
      // Ensure path starts with /uploads/ (not /upload/)
      url = url.replace(/\/upload\/(?!s)/g, '/uploads/');
      
      // Final safety check: if still has localhost, something is very wrong
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        console.error(`[normalizeMediaUrl] ERROR: URL still contains localhost after all processing: ${url}`);
        // Force replace one more time
        url = url.replace(/https?:\/\/localhost(:\d+)?/gi, 'https://ecommerce-api.banyco.vn');
        url = url.replace(/https?:\/\/127\.0\.0\.1(:\d+)?/gi, 'https://ecommerce-api.banyco.vn');
      }
      
      // Log if we made corrections
      if (url !== cleaned && url.includes('/uploads/')) {
        console.log(`[normalizeMediaUrl] Final normalized URL: ${cleaned} -> ${url}`);
      }
    }
  }
  
  return url;
};

