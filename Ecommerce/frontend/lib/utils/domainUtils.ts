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
 */
export const normalizeMediaUrl = (raw: unknown): string | null => {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const cleaned = raw.replace(/\\/g, '/');
  let url: string;
  
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    url = cleaned;
  } else {
    // Use buildFromApiOrigin from config/site.ts
    url = buildFromApiOrigin(cleaned);
  }
  
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
  
  return url;
};

