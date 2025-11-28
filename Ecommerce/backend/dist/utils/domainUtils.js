"use strict";
/**
 * Domain utility functions for backend
 * Handles domain configuration from environment variables
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeMediaUrl = exports.replaceIpWithDomain = exports.isProductionDomain = exports.getApiUrl = exports.getAdminDomain = exports.getFrontendDomain = exports.getApiDomain = void 0;
/**
 * Get API domain from environment variable
 * Falls back to constructing from FRONTEND_DOMAIN if API_DOMAIN not set
 */
const getApiDomain = () => {
    const apiDomain = process.env.API_DOMAIN || process.env.FRONTEND_DOMAIN;
    if (!apiDomain) {
        return 'localhost:3011'; // fallback for development
    }
    return apiDomain;
};
exports.getApiDomain = getApiDomain;
/**
 * Get frontend domain from environment variable
 */
const getFrontendDomain = () => {
    return process.env.FRONTEND_DOMAIN || 'localhost:3000';
};
exports.getFrontendDomain = getFrontendDomain;
/**
 * Get admin domain from environment variable
 */
const getAdminDomain = () => {
    const adminDomain = process.env.ADMIN_DOMAIN;
    const frontendDomain = (0, exports.getFrontendDomain)();
    return adminDomain || `admin.${frontendDomain}`;
};
exports.getAdminDomain = getAdminDomain;
/**
 * Get full API URL with protocol
 */
const getApiUrl = () => {
    const domain = (0, exports.getApiDomain)();
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    // Remove port if it's included in domain (for localhost)
    const cleanDomain = domain.includes(':') ? domain : domain;
    return `${protocol}://${cleanDomain}`;
};
exports.getApiUrl = getApiUrl;
/**
 * Check if a URL belongs to production domain
 */
const isProductionDomain = (url) => {
    const frontendDomain = process.env.FRONTEND_DOMAIN;
    const apiDomain = process.env.API_DOMAIN;
    if (!frontendDomain && !apiDomain) {
        return process.env.NODE_ENV === 'production';
    }
    const domains = [frontendDomain, apiDomain].filter(Boolean);
    return domains.some(domain => domain && url.includes(domain));
};
exports.isProductionDomain = isProductionDomain;
/**
 * Replace IP address with configured API domain
 */
const replaceIpWithDomain = (url) => {
    const ipPattern = /https?:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?/;
    const ipMatch = url.match(ipPattern);
    if (ipMatch) {
        const apiUrl = (0, exports.getApiUrl)();
        return url.replace(ipMatch[0], apiUrl);
    }
    return url;
};
exports.replaceIpWithDomain = replaceIpWithDomain;
/**
 * Normalize media URL - replace IP with domain and convert HTTP to HTTPS if needed
 * This is the main function to use for normalizing media URLs in backend
 */
const normalizeMediaUrl = (value) => {
    if (!value || typeof value !== 'string') {
        return null;
    }
    const cleaned = value.replace(/\\/g, '/');
    let url;
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
        url = cleaned;
    }
    else {
        const baseUrl = process.env.FILE_BASE_URL ||
            process.env.CMS_BASE_URL ||
            process.env.API_BASE_URL ||
            (0, exports.getApiUrl)();
        url = `${baseUrl}${cleaned.startsWith('/') ? '' : '/'}${cleaned}`;
    }
    // Replace IP with domain
    url = (0, exports.replaceIpWithDomain)(url);
    // Convert HTTP to HTTPS for production domains
    if (url.startsWith('http://')) {
        const isProduction = (0, exports.isProductionDomain)(url);
        const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
        if (isProduction || (isLocalhost && process.env.FORCE_HTTPS === 'true')) {
            url = url.replace('http://', 'https://');
        }
    }
    return url;
};
exports.normalizeMediaUrl = normalizeMediaUrl;
//# sourceMappingURL=domainUtils.js.map