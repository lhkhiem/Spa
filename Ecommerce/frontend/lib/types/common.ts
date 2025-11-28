// Common types used across the application

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ValidationError[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ImageData {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface SEO {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'name-asc' | 'name-desc';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
