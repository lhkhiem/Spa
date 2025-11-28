import { ImageData } from './common';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  sku: string;
  images: ImageData[];
  category: ProductCategory;
  brand?: ProductBrand;
  variants?: ProductVariant[];
  stock: number;
  tags: string[];
  featured: boolean;
  rating?: number;
  reviewCount?: number;
  attributes?: ProductAttribute[];
  ingredients?: string;
  specialInstructions?: string;
  documents?: ProductDocument[];
  relatedProducts?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
  price?: number;
  sku?: string;
  stock: number;
  image?: string;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string | null;
}

export interface ProductBrand {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductDocument {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'image';
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  createdAt: string;
}

export interface ProductFilters {
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  inStock?: boolean;
  rating?: number;
  search?: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  sort?: string;
  filters?: ProductFilters;
}
