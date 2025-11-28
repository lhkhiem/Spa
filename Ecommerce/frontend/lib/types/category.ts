export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  parentId?: string | null;
  parent?: Category;
  children?: Category[];
  productCount: number;
  featured: boolean;
  order: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithProducts extends Category {
  products: any[]; // Will be Product[] when imported
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}
