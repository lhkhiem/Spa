const DEFAULT_SITE_PORT = 3000;
const DEFAULT_API_PORT = 3011;
const DEFAULT_API_PATH = '/api';

const trimTrailingSlash = (value?: string | null): string => {
  if (!value) return '';
  return value.replace(/\/+$/, '');
};

const ensureLeadingSlash = (value: string): string => {
  if (!value) return '';
  return value.startsWith('/') ? value : `/${value}`;
};

const buildUrl = (base: string, path = ''): string => {
  const normalizedBase = trimTrailingSlash(base);
  if (!path) return normalizedBase;
  return `${normalizedBase}${ensureLeadingSlash(path)}`;
};

const resolveSiteUrl = (): string => {
  const envUrl = trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL);
  if (envUrl) return envUrl;

  if (typeof window !== 'undefined') {
    return trimTrailingSlash(window.location.origin);
  }

  return `http://localhost:${DEFAULT_SITE_PORT}`;
};

const resolveApiUrl = (): string => {
  const envUrl = trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL);
  if (envUrl) return envUrl;

  const envPort = trimTrailingSlash(process.env.NEXT_PUBLIC_API_PORT);

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    const finalPort = envPort || `${DEFAULT_API_PORT}`;
    const hostWithPort = finalPort ? `${protocol}//${hostname}:${finalPort}` : `${protocol}//${hostname}`;
    return buildUrl(hostWithPort, DEFAULT_API_PATH);
  }

  return `http://localhost:${envPort || DEFAULT_API_PORT}${DEFAULT_API_PATH}`;
};

const removeApiSuffix = (url: string): string => {
  return trimTrailingSlash(url).replace(/\/api$/, '');
};

export const getSiteUrl = () => resolveSiteUrl();
export const getApiUrl = () => resolveApiUrl();
export const getApiOrigin = () => removeApiSuffix(resolveApiUrl());
export const buildSiteUrl = (path = '') => buildUrl(resolveSiteUrl(), path);
export const buildApiUrl = (path = '') => buildUrl(resolveApiUrl(), path);
export const buildFromApiOrigin = (path = '') => buildUrl(getApiOrigin(), path);

export const siteConfig = {
  name: 'Universal Companies',
  description: 'Leading supplier of spa and salon supplies, products, and equipment',
  get url(): string {
    return getSiteUrl();
  },
  get apiUrl(): string {
    return getApiUrl();
  },
  ogImage: '/images/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/universalcos',
    facebook: 'https://www.facebook.com/universalcompaniesinc',
    instagram: 'https://www.instagram.com/universalcos/',
    youtube: 'https://www.youtube.com/@UniversalCos',
    linkedin: 'https://www.linkedin.com/company/universal-companies',
    tiktok: 'https://www.tiktok.com/@universalcompanies',
    pinterest: 'https://www.pinterest.com/universalcos/',
  },
  contact: {
    email: 'info@universalcompanies.com',
    phone: '1-800-558-5571',
  },
};

export const shippingConfig = {
  freeShippingThreshold: 749,
  reducedShippingThreshold: 199,
  reducedShippingCost: 4.99,
  standardShippingCost: 9.99,
};

export const paginationConfig = {
  defaultPageSize: 24,
  pageSizeOptions: [12, 24, 48, 96],
};

