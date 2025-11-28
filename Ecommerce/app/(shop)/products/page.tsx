import type { SortOption } from '@/components/product/ProductSort/ProductSort';
import { Metadata } from 'next';
import ProductsPageClient from './ProductsPageClient';
import { fetchProducts } from '@/lib/api/products';
import { fetchProductCategories } from '@/lib/api/categories';
import { fetchBrands } from '@/lib/api/brands';
import { getPageMetadataFromCMS, generatePageMetadata } from '@/lib/utils/pageMetadata';

interface ProductsPageProps {
  searchParams: {
    page?: string;
    sort?: string;
    q?: string;
    category?: string;
    brand?: string;
    price?: string;
    availability?: string;
    special?: string;
  };
}

const parseCsv = (value?: string | string[] | null): string[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(','))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeSort = (value?: string | null): SortOption => {
  const allowed: SortOption[] = ['featured', 'newest', 'price-asc', 'price-desc', 'name-asc', 'rating'];
  if (value && allowed.includes(value as SortOption)) {
    return value as SortOption;
  }
  return 'featured';
};

const parsePage = (value?: string | null): number => {
  if (!value) {
    return 1;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.floor(parsed);
};

export async function generateMetadata({ 
  searchParams 
}: ProductsPageProps): Promise<Metadata> {
  // Fetch metadata from CMS (ignore query params for metadata)
  const data = await getPageMetadataFromCMS('/products');
  
  return generatePageMetadata(data, '/products', {
    title: 'Sản Phẩm - Banyco',
    description: 'Khám phá các sản phẩm spa, salon chuyên nghiệp. Thiết bị massage, chăm sóc da, mỹ phẩm và vật tư làm đẹp.',
    ogImage: '/images/og-products.jpg',
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const initialFilters: Record<string, string[]> = {};

  const categoryValues = parseCsv(searchParams.category);
  if (categoryValues.length) {
    initialFilters.category = categoryValues;
  }

  const brandValues = parseCsv(searchParams.brand);
  if (brandValues.length) {
    initialFilters.brand = brandValues;
  }

  const priceValues = parseCsv(searchParams.price);
  if (priceValues.length) {
    initialFilters.price = priceValues;
  }

  const availabilityValues = parseCsv(searchParams.availability);
  if (availabilityValues.length) {
    initialFilters.availability = availabilityValues;
  }

  const specialValues = parseCsv(searchParams.special);
  if (specialValues.length) {
    initialFilters.special = specialValues;
  }

  const sortBy = normalizeSort(searchParams.sort);
  const page = parsePage(searchParams.page);
  const pageSize = 24;

  const [{ data, meta }, categories, brands] = await Promise.all([
    fetchProducts({
      page,
      pageSize,
      q: searchParams.q,
      sort: sortBy,
      category: searchParams.category,
      brand: searchParams.brand,
      price: searchParams.price,
      availability: searchParams.availability,
      special: searchParams.special,
    }),
    fetchProductCategories(),
    fetchBrands(),
  ]);

  const initialState = {
    selectedFilters: initialFilters,
    sortBy,
    searchQuery: searchParams.q ?? '',
    page: meta.page ?? page,
  };

  return (
    <ProductsPageClient
      initialProducts={data}
      initialMeta={meta}
      categories={categories}
      brands={brands}
      initialState={initialState}
    />
  );
}
