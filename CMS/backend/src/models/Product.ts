// Product model
// Represents individual variant SKUs in the eCommerce catalog

export interface Product {
  id: string;
  group_id: string;
  name: string;
  slug: string;
  description?: string | null;
  content?: any; // JSONB for rich content
  category_id?: string | null;
  brand_id?: string | null;
  sku?: string | null;
  price: number;
  compare_price?: number | null;
  cost_price?: number | null;
  stock: number;
  status: 'draft' | 'published' | 'archived' | 'active' | 'inactive';
  thumbnail_id?: string | null;
  published_at?: Date | null;
  title_override?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  specs?: Record<string, unknown> | null;
  variant_position?: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductGroup {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  content?: any;
  category_id?: string | null;
  brand_id?: string | null;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  is_best_seller: boolean;
  thumbnail_id?: string | null;
  published_at?: Date | null;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  } | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductGroupDTO {
  name: string;
  slug: string;
  description?: string;
  content?: any;
  category_id?: string;
  brand_id?: string;
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  is_best_seller?: boolean;
  thumbnail_id?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  } | null;
}

export interface CreateProductDTO {
  group_id: string;
  name: string;
  slug: string;
  description?: string;
  content?: any;
  category_id?: string;
  brand_id?: string;
  sku?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  stock?: number;
  status?: 'draft' | 'published' | 'archived' | 'active' | 'inactive';
  thumbnail_id?: string;
  title_override?: string;
  short_description?: string;
  long_description?: string;
  specs?: Record<string, unknown> | null;
  variant_position?: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}
