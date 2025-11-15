/**
 * CMS Integration Types
 * TypeScript interfaces for CMS data structures
 */

// Base Types
export interface CMSImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CMSMeta {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  slug: string;
}

// Product Types
export interface CMSProduct extends CMSMeta {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  sku: string;
  images: CMSImage[];
  category: CMSCategory;
  brand?: CMSBrand;
  tags?: string[];
  inStock: boolean;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  variants?: CMSProductVariant[];
  specifications?: Record<string, string>;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CMSProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  attributes: Record<string, string>; // e.g., { color: "Blue", size: "Large" }
  inStock: boolean;
  stock?: number;
}

// Category Types
export interface CMSCategory extends CMSMeta {
  name: string;
  description?: string;
  image?: CMSImage;
  parent?: string; // Parent category ID
  productCount?: number;
  metaTitle?: string;
  metaDescription?: string;
}

// Brand Types
export interface CMSBrand extends CMSMeta {
  name: string;
  description?: string;
  logo?: CMSImage;
  website?: string;
  featured?: boolean;
}

// Review Types
export interface CMSReview extends CMSMeta {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  author: {
    name: string;
    verified?: boolean;
  };
  helpful?: number;
  images?: CMSImage[];
}

// Menu Types
export interface CMSMenuItem {
  id: string;
  menu_location_id: string;
  parent_id: string | null;
  title: string;
  url: string | null;
  icon: string | null;
  type: string | null;
  entity_id: string | null;
  target: string | null;
  rel: string | null;
  css_classes: string | null;
  sort_order: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: CMSMenuItem[];
  megaMenu?: CMSMegaMenu | null;
}

export interface CMSMegaMenu {
  columns: CMSMegaMenuColumn[];
  featured?: {
    title: string;
    description: string;
    image?: CMSImage;
    url: string;
  };
}

export interface CMSMegaMenuColumn {
  title: string;
  items: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
}

export interface CMSMenuLocation {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  item_count?: number | string;
}

// Page Types
export interface CMSPage extends CMSMeta {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: CMSImage;
  template?: string;
  metaTitle?: string;
  metaDescription?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: CMSImage;
  };
}

// Blog Types
export interface CMSBlogPost extends CMSMeta {
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: CMSImage;
  author: {
    name: string;
    avatar?: CMSImage;
    bio?: string;
  };
  categories?: string[];
  tags?: string[];
  readTime?: number;
  metaTitle?: string;
  metaDescription?: string;
}

// Collection/List Response Types
export interface CMSListResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// Single Item Response
export interface CMSSingleResponse<T> {
  data: T;
}

// Error Response
export interface CMSError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, any>;
}

// Query Parameters
export interface CMSQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  filters?: Record<string, any>;
  populate?: string | string[];
  fields?: string[];
  locale?: string;
  publicationState?: 'live' | 'preview';
  [key: string]: any;
}
