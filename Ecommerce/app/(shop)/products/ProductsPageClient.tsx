'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ProductGrid from '@/components/product/ProductGrid/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters/ProductFilters';
import ProductSort, { SortOption } from '@/components/product/ProductSort/ProductSort';
import ProductSearch from '@/components/product/ProductSearch/ProductSearch';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import { FiFilter } from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';
import { fetchProducts, ProductDTO, ProductListResponse } from '@/lib/api/products';
import { ProductCategorySummary } from '@/lib/api/categories';
import { BrandSummaryDTO } from '@/lib/api/brands';

interface ProductCardItem {
  id: string;
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  inStock: boolean;
}

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

interface InitialState {
  selectedFilters: Record<string, string[]>;
  sortBy: SortOption;
  searchQuery: string;
  page: number;
}

interface ProductsPageClientProps {
  initialProducts: ProductDTO[];
  initialMeta: ProductListResponse['meta'];
  categories: ProductCategorySummary[];
  brands: BrandSummaryDTO[];
  initialState: InitialState;
}

const FALLBACK_IMAGE = '/images/placeholder-product.jpg';

const priceFilterOptions: FilterOption[] = [
  { id: '0-25', label: 'Under $25' },
  { id: '25-50', label: '$25 - $50' },
  { id: '50-100', label: '$50 - $100' },
  { id: '100-250', label: '$100 - $250' },
  { id: '250-500', label: '$250 - $500' },
  { id: '500+', label: '$500+' },
];

const availabilityOptions: FilterOption[] = [
  { id: 'in-stock', label: 'In Stock' },
  { id: 'out-of-stock', label: 'Out of Stock' },
];

const specialOptions: FilterOption[] = [
  { id: 'on-sale', label: 'On Sale' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'featured', label: 'Featured' },
  { id: 'best-seller', label: 'Best Sellers' },
];

const mapProductToCard = (product: ProductDTO): ProductCardItem => {
  const hasDiscount =
    product.comparePrice !== null &&
    product.comparePrice !== undefined &&
    product.comparePrice > product.price;

  const basePrice = hasDiscount ? product.comparePrice ?? product.price : product.price;
  const salePrice = hasDiscount ? product.price : undefined;

  let badge: string | undefined;
  if (product.isBestSeller) {
    badge = 'Best Seller';
  } else if (product.isFeatured) {
    badge = 'Featured';
  }

  const isVariant = product.isVariant ?? false;
  const productId = product.baseProductId ?? product.id;
  const variantId = isVariant ? product.id : undefined;

  return {
    id: product.id,
    productId,
    variantId,
    slug: product.slug,
    name: product.name,
    price: basePrice,
    salePrice,
    image: product.thumbnailUrl ?? FALLBACK_IMAGE,
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    badge,
    inStock: (product.stock ?? 0) > 0,
  };
};

export default function ProductsPageClient({
  initialProducts,
  initialMeta,
  categories,
  brands,
  initialState,
}: ProductsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<ProductCardItem[]>(
    initialProducts.map(mapProductToCard)
  );
  const [meta, setMeta] = useState(initialMeta);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(
    initialState.selectedFilters
  );
  const [sortBy, setSortBy] = useState<SortOption>(initialState.sortBy);
  const [searchQuery, setSearchQuery] = useState(initialState.searchQuery);
  const [currentPage, setCurrentPage] = useState(initialState.page);
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const pageSize = initialMeta.pageSize ?? 24;
  const initialFetchSkipped = useRef(false);

  const filterGroups: FilterGroup[] = useMemo(() => {
    const categoryOptions: FilterOption[] = categories.map((category) => ({
      id: category.slug,
      label: category.name,
      count: category.productCount ?? undefined,
    }));

    const brandOptions: FilterOption[] = brands.map((brand) => ({
      id: brand.slug,
      label: brand.name,
    }));

    return [
      {
        id: 'category',
        title: 'Category',
        options: categoryOptions,
      },
      {
        id: 'brand',
        title: 'Brand',
        options: brandOptions,
      },
      {
        id: 'price',
        title: 'Price Range',
        options: priceFilterOptions,
      },
      {
        id: 'availability',
        title: 'Availability',
        options: availabilityOptions,
      },
      {
        id: 'special',
        title: 'Special Offers',
        options: specialOptions,
      },
    ];
  }, [brands, categories]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchProducts({
        page: currentPage,
        pageSize,
        q: searchQuery,
        sort: sortBy,
        category: selectedFilters.category?.join(','),
        brand: selectedFilters.brand?.join(','),
        price: selectedFilters.price?.join(','),
        availability: selectedFilters.availability?.join(','),
        special: selectedFilters.special?.join(','),
      });

      setProducts(response.data.map(mapProductToCard));
      setMeta(response.meta);
    } catch (error) {
      console.error('[ProductsPageClient] loadProducts failed', error);
      setProducts([]);
      setMeta({
        total: 0,
        page: 1,
        pageSize,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, sortBy, selectedFilters]);

  useEffect(() => {
    if (!initialFetchSkipped.current) {
      initialFetchSkipped.current = true;
      return;
    }
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (searchQuery) {
      searchParams.set('q', searchQuery);
    }
    if (sortBy && sortBy !== 'featured') {
      searchParams.set('sort', sortBy);
    }

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        searchParams.set(key, values.join(','));
      }
    });

    if (currentPage > 1) {
      searchParams.set('page', String(currentPage));
    }

    const queryString = searchParams.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchQuery, sortBy, selectedFilters, currentPage]);

  const handleFilterChange = (filterId: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedFilters({});
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const breadcrumbItems = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Products' },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">All Products</h1>
          <ProductSearch value={searchQuery} onChange={handleSearchChange} />
        </div>

        <div className="mb-4 lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full"
          >
            <FiFilter className="mr-2" />
            Filters{' '}
            {Object.values(selectedFilters).flat().length > 0 &&
              `(${Object.values(selectedFilters).flat().length})`}
          </Button>
        </div>

        <div className="flex gap-8">
          <aside
            className={`${showMobileFilters ? 'block' : 'hidden'} w-full lg:block lg:w-64 lg:flex-shrink-0`}
          >
            <ProductFilters
              filters={filterGroups}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </aside>

          <div className="flex-1">
            <div className="mb-6">
              <ProductSort value={sortBy} onChange={handleSortChange} totalProducts={meta.total} />
            </div>

            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}


