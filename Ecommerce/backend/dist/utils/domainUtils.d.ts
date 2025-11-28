/**
 * Domain utility functions for backend
 * Handles domain configuration from environment variables
 */
/**
 * Get API domain from environment variable
 * Falls back to constructing from FRONTEND_DOMAIN if API_DOMAIN not set
 */
export declare const getApiDomain: () => string;
/**
 * Get frontend domain from environment variable
 */
export declare const getFrontendDomain: () => string;
/**
 * Get admin domain from environment variable
 */
export declare const getAdminDomain: () => string;
/**
 * Get full API URL with protocol
 */
export declare const getApiUrl: () => string;
/**
 * Check if a URL belongs to production domain
 */
export declare const isProductionDomain: (url: string) => boolean;
/**
 * Replace IP address with configured API domain
 */
export declare const replaceIpWithDomain: (url: string) => string;
/**
 * Normalize media URL - replace IP with domain and convert HTTP to HTTPS if needed
 * This is the main function to use for normalizing media URLs in backend
 */
export declare const normalizeMediaUrl: (value: string | null | undefined) => string | null;
//# sourceMappingURL=domainUtils.d.ts.map