/**
 * Domain utility functions for backend
 * Handles domain configuration from environment variables
 */

/**
 * Get API domain from environment variable
 * For Ecommerce Backend, use ecommerce-api.banyco.vn in production
 */
export const getApiDomain = (): string => {
  // Check if API_DOMAIN is explicitly set
  if (process.env.API_DOMAIN) {
    return process.env.API_DOMAIN;
  }
  
  // Production: use ecommerce-api.banyco.vn
  const isProduction = process.env.NODE_ENV === 'production' || 
                       process.env.API_DOMAIN?.includes('banyco.vn') ||
                       process.env.FRONTEND_DOMAIN?.includes('banyco.vn');
  
  if (isProduction) {
    return 'ecommerce-api.banyco.vn';
  }
  
  // Development: use localhost with port
  const apiDomain = process.env.FRONTEND_DOMAIN;
  if (!apiDomain) {
    return 'localhost:3012'; // Ecommerce backend port
  }
  return apiDomain;
};

/**
 * Get frontend domain from environment variable
 * In production we ALWAYS want banyco.vn (not localhost)
 */
export const getFrontendDomain = (): string => {
  const envDomain =
    process.env.FRONTEND_DOMAIN ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/https?:\/\//, '');

  // If we're clearly in production, force banyco.vn as a safe default
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (envDomain && envDomain.includes('banyco.vn')) ||
    process.env.API_DOMAIN?.includes('banyco.vn');

  if (isProduction) {
    // Prefer explicit env, otherwise hard-code banyco.vn
    return envDomain || 'banyco.vn';
  }

  // Development fallback
  return envDomain || 'localhost:3000';
};

/**
 * Get site URL (frontend URL) with protocol
 * Production: always https://banyco.vn (or https://{FRONTEND_DOMAIN} if explicitly set)
 */
export const getSiteUrl = (): string => {
  const rawDomain = getFrontendDomain();

  // If domain already includes protocol, normalize to https in production
  if (rawDomain.startsWith('http://') || rawDomain.startsWith('https://')) {
    if (process.env.NODE_ENV === 'production' && rawDomain.startsWith('http://')) {
      return rawDomain.replace('http://', 'https://');
    }
    return rawDomain;
  }

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return `${protocol}://${rawDomain}`;
};

/**
 * Get admin domain from environment variable
 */
export const getAdminDomain = (): string => {
  const adminDomain = process.env.ADMIN_DOMAIN;
  const frontendDomain = getFrontendDomain();
  return adminDomain || `admin.${frontendDomain}`;
};

/**
 * Get full API URL with protocol
 */
export const getApiUrl = (): string => {
  const domain = getApiDomain();
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  // Remove port if it's included in domain (for localhost)
  const cleanDomain = domain.includes(':') ? domain : domain;
  return `${protocol}://${cleanDomain}`;
};

/**
 * Check if a URL belongs to production domain
 */
export const isProductionDomain = (url: string): boolean => {
  const frontendDomain = process.env.FRONTEND_DOMAIN;
  const apiDomain = process.env.API_DOMAIN;
  
  if (!frontendDomain && !apiDomain) {
    return process.env.NODE_ENV === 'production';
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
 * This is the main function to use for normalizing media URLs in backend
 * Images are served from ecommerce backend, so use ecommerce-api.banyco.vn in production
 * IMPORTANT: All images must be served from ecommerce-api.banyco.vn, not CMS backend
 */
export const normalizeMediaUrl = (value: string | null | undefined): string | null => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const cleaned = value.replace(/\\/g, '/');
  let url: string;
  const originalUrl = cleaned;
  
  // Check if we're in production (check multiple indicators)
  // IMPORTANT: Also check if we're running on a production server (not localhost)
  const isProduction = process.env.NODE_ENV === 'production' || 
                       process.env.API_DOMAIN?.includes('banyco.vn') ||
                       process.env.FRONTEND_DOMAIN?.includes('banyco.vn') ||
                       process.env.API_DOMAIN === 'ecommerce-api.banyco.vn' ||
                       (typeof process.env.HOSTNAME !== 'undefined' && 
                        process.env.HOSTNAME !== 'localhost' && 
                        !process.env.HOSTNAME.includes('127.0.0.1'));
  
  // CRITICAL: Always use production URL for images to avoid localhost issues
  // Only use localhost URL if we're absolutely sure we're in development
  // and the input doesn't contain any production indicators
  const ecommerceApiUrl = isProduction 
    ? 'https://ecommerce-api.banyco.vn'
    : getApiUrl();
  
  // CRITICAL: If input contains localhost OR if we detect production environment,
  // ALWAYS use production URL for replacement
  const forceProductionUrl = cleaned.includes('localhost') || 
                             cleaned.includes('127.0.0.1') ||
                             isProduction;
  const replacementUrl = forceProductionUrl ? 'https://ecommerce-api.banyco.vn' : ecommerceApiUrl;
  
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    url = cleaned;
    
    // CRITICAL: ALWAYS replace localhost/127.0.0.1 - NO EXCEPTIONS
    // If URL contains localhost, ALWAYS replace with production URL
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      const beforeReplace = url;
      // Extract path from URL
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname + urlObj.search + urlObj.hash;
        url = `${replacementUrl}${path}`;
      } catch (e) {
        // Fallback: simple replace
        url = url.replace(/https?:\/\/localhost(:\d+)?/gi, replacementUrl);
        url = url.replace(/https?:\/\/127\.0\.0\.1(:\d+)?/gi, replacementUrl);
      }
      
      if (beforeReplace !== url) {
        console.warn(`[normalizeMediaUrl] FORCED localhost replacement: ${beforeReplace} -> ${url}`);
      }
    }
    
    // IMPORTANT: Replace any CMS backend URLs (api.banyco.vn, port 3011) with ecommerce-api.banyco.vn
    // This ensures images are served from ecommerce backend, not CMS
    if (isProduction) {
      const cmsApiPatterns = [
        /https?:\/\/api\.banyco\.vn/gi,
        /https?:\/\/[^\/]+:3011/gi,  // Any URL with port 3011 (CMS backend)
      ];
      
      for (const pattern of cmsApiPatterns) {
        if (pattern.test(url)) {
          const beforeReplace = url;
          // Extract the path part
          const urlObj = new URL(url);
          const path = urlObj.pathname + urlObj.search + urlObj.hash;
          url = `${ecommerceApiUrl}${path}`;
          console.log(`[normalizeMediaUrl] Replaced CMS URL with Ecommerce: ${beforeReplace} -> ${url}`);
        }
      }
    }
  } else {
    // Relative path - use ecommerce backend URL for serving images
    // CRITICAL: Always use production URL to avoid localhost issues
    // Only use localhost if we're absolutely in development AND input is clean
    
    // Fix /upload/ to /uploads/ in relative paths
    let normalizedPath = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
    normalizedPath = normalizedPath.replace(/\/upload\/(?!s)/g, '/uploads/');
    
    // ALWAYS use production URL for relative paths in production environment
    // This prevents any chance of localhost URLs being created
    const finalUrl = isProduction || forceProductionUrl 
      ? 'https://ecommerce-api.banyco.vn' 
      : ecommerceApiUrl;
    
    url = `${finalUrl}${normalizedPath}`;
    
    // Log if we're using production URL for relative path
    if (isProduction || forceProductionUrl) {
      console.log(`[normalizeMediaUrl] Using production URL for relative path: ${cleaned} -> ${url}`);
    }
  }
  
  // CRITICAL: Final safety check - if URL still contains localhost/127.0.0.1, FORCE replace it
  // This is a safety net to catch any localhost that might have slipped through
  // ALWAYS replace, not just in production
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    console.error(`[normalizeMediaUrl] CRITICAL: Found localhost! Forcing replacement: ${url}`);
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname + urlObj.search + urlObj.hash;
      url = `https://ecommerce-api.banyco.vn${path}`;
    } catch (e) {
      // Fallback: simple replace
      url = url.replace(/https?:\/\/localhost(:\d+)?/gi, 'https://ecommerce-api.banyco.vn');
      url = url.replace(/https?:\/\/127\.0\.0\.1(:\d+)?/gi, 'https://ecommerce-api.banyco.vn');
    }
    console.error(`[normalizeMediaUrl] After forced replacement: ${url}`);
  }
  
  // Fix common path issues: /upload/ should be /uploads/
  // This handles cases where database has /upload/ instead of /uploads/
  url = url.replace(/\/upload\/(?!s)/g, '/uploads/');
  
  // Replace IP with domain
  url = replaceIpWithDomain(url);
  
  // Convert HTTP to HTTPS for production domains
  if (url.startsWith('http://')) {
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
    
    if (isProduction && !isLocalhost) {
      url = url.replace('http://', 'https://');
    }
  }
  
  // Final check: ensure production URLs use ecommerce-api.banyco.vn
  if (isProduction && url.includes('banyco.vn')) {
    // If URL contains banyco.vn but not ecommerce-api, replace it
    if (!url.includes('ecommerce-api.banyco.vn') && (url.includes('api.banyco.vn') || url.includes(':3011'))) {
      const urlObj = new URL(url);
      const path = urlObj.pathname + urlObj.search + urlObj.hash;
      url = `${ecommerceApiUrl}${path}`;
      console.log(`[normalizeMediaUrl] Final replacement to ecommerce-api: ${originalUrl} -> ${url}`);
    }
  }
  
  // Final normalization: ensure URL format is exactly https://ecommerce-api.banyco.vn/uploads/...
  // Ensure path starts with /uploads/ (not /upload/)
  url = url.replace(/\/upload\/(?!s)/g, '/uploads/');
  
  // ABSOLUTE FINAL CHECK: if still has localhost, something is very wrong - FORCE REPLACE
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    console.error(`[normalizeMediaUrl] ERROR: URL still contains localhost after all processing: ${url}`);
    // Force replace one more time - extract path and rebuild
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname + urlObj.search + urlObj.hash;
      url = `https://ecommerce-api.banyco.vn${path}`;
    } catch (e) {
      // Fallback: simple replace
      url = url.replace(/https?:\/\/localhost(:\d+)?/gi, 'https://ecommerce-api.banyco.vn');
      url = url.replace(/https?:\/\/127\.0\.0\.1(:\d+)?/gi, 'https://ecommerce-api.banyco.vn');
    }
    console.error(`[normalizeMediaUrl] Final forced replacement result: ${url}`);
  }
  
  // Log if we made any corrections
  if (url !== originalUrl) {
    console.log(`[normalizeMediaUrl] Final normalized URL: ${originalUrl} -> ${url}`);
  }
  
  return url;
};



