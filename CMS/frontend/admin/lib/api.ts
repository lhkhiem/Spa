// API configuration
// This file centralizes API URLs to avoid hardcoding localhost

const DEFAULT_BACKEND_PORT = 3011;

const buildUrlFromWindow = (port: number) => {
  if (typeof window === 'undefined') {
    return null;
  }
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:${port}`;
};

let apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011';
let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || apiBaseUrl;

const trimTrailingSlash = (url: string) => {
  if (!url) return url;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

if (typeof window !== 'undefined') {
  const runtimeUrl = buildUrlFromWindow(DEFAULT_BACKEND_PORT);
  if (!process.env.NEXT_PUBLIC_API_URL && runtimeUrl) {
    apiBaseUrl = runtimeUrl;
  }
  if (!process.env.NEXT_PUBLIC_BACKEND_URL && runtimeUrl) {
    backendUrl = runtimeUrl;
  }
}

export const API_BASE_URL = apiBaseUrl;
export const BACKEND_URL = backendUrl;

export const resolveApiBaseUrl = () => {
  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
    const runtimeUrl = buildUrlFromWindow(DEFAULT_BACKEND_PORT);
    if (runtimeUrl) {
      return runtimeUrl;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || apiBaseUrl;
};

export const resolveBackendUrl = () => {
  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_BACKEND_URL) {
    const runtimeUrl = buildUrlFromWindow(DEFAULT_BACKEND_PORT);
    if (runtimeUrl) {
      return runtimeUrl;
    }
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || backendUrl;
};

export const getNormalizedApiBaseUrl = () => trimTrailingSlash(resolveApiBaseUrl());

export const getNormalizedBackendUrl = () => trimTrailingSlash(resolveBackendUrl());

export const buildApiUrl = (path = '') => {
  const base = getNormalizedApiBaseUrl();
  if (!path) return base;
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
};

export const buildBackendUrl = (path = '') => {
  const base = getNormalizedBackendUrl();
  if (!path) return base;
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
};

export const getAssetUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  // If path already has protocol, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Otherwise prepend backend URL
  return buildBackendUrl(path);
};

// Get thumbnail URL from asset data (prefers thumb size)
export const getThumbnailUrl = (asset: any): string => {
  if (!asset) return '';
  
  // Priority: thumb from sizes > thumb_url > url
  if (asset.thumbnail_sizes?.thumb?.url) {
    return getAssetUrl(asset.thumbnail_sizes.thumb.url);
  }
  if (asset.sizes?.thumb?.url) {
    return getAssetUrl(asset.sizes.thumb.url);
  }
  if (asset.thumb_url) {
    return getAssetUrl(asset.thumb_url);
  }
  if (asset.thumbnail_url) {
    return getAssetUrl(asset.thumbnail_url);
  }
  if (asset.url) {
    return getAssetUrl(asset.url);
  }
  return '';
};

