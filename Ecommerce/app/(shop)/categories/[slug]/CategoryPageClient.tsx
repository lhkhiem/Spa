'use client';

import { useMemo, useState } from 'react';
import ProductGrid from '@/components/product/ProductGrid/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters/ProductFilters';
import ProductSort, { SortOption } from '@/components/product/ProductSort/ProductSort';
import ProductSearch from '@/components/product/ProductSearch/ProductSearch';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import { FiFilter } from 'react-icons/fi';

interface ProductItem {
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
  category?: string;
  brand?: string;
  tags?: string[];
}

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

interface CategoryPageClientProps {
  categoryName: string;
  categorySlug: string;
  breadcrumbItems: { label: string; href?: string }[];
  initialProducts: ProductItem[];
}

const priceFilterOptions: FilterOption[] = [
  { id: '0-25', label: 'Under $25' },
  { id: '25-50', label: '$25 - $50' },
  { id: '50-100', label: '$50 - $100' },
  { id: '100+', label: '$100+' },
];

const availabilityOptions: FilterOption[] = [
  { id: 'in-stock', label: 'In Stock' },
  { id: 'out-of-stock', label: 'Out of Stock' },
];

const specialOptions: FilterOption[] = [
  { id: 'on-sale', label: 'On Sale' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'best-seller', label: 'Best Sellers' },
];

export default function CategoryPageClient({
  categoryName,
  categorySlug,
  breadcrumbItems,
  initialProducts,
}: CategoryPageClientProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const brandOptions = useMemo<FilterOption[]>(() => {
    const brands = new Map<string, string>();
    initialProducts.forEach((product) => {
      if (product.brand) {
        const id = product.brand.toLowerCase();
        if (!brands.has(id)) {
          brands.set(id, product.brand);
        }
      }
    });

    return Array.from(brands.entries()).map(([id, label]) => ({ id, label }));
  }, [initialProducts]);

  const filterGroups: FilterGroup[] = useMemo(
    () => [
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
    ],
    [brandOptions]
  );

  const categoryProducts = useMemo(() => {
    return initialProducts.filter((p) => !p.category || p.category === categorySlug);
  }, [initialProducts, categorySlug]);

  const filteredProducts = useMemo(() => {
    let filtered = [...categoryProducts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const tags = p.tags ?? [];
        return (
          p.name.toLowerCase().includes(query) ||
          (p.brand ?? '').toLowerCase().includes(query) ||
          tags.some((tag) => tag.toLowerCase().includes(query))
        );
      });
    }

    if (selectedFilters.brand?.length) {
      filtered = filtered.filter((p) => {
        const brand = (p.brand ?? '').toLowerCase();
        return selectedFilters.brand?.includes(brand);
      });
    }

    if (selectedFilters.price?.length) {
      filtered = filtered.filter((p) => {
        const price = p.salePrice || p.price;
        return selectedFilters.price?.some((range) => {
          if (range === '0-25') return price < 25;
          if (range === '25-50') return price >= 25 && price < 50;
          if (range === '50-100') return price >= 50 && price < 100;
          if (range === '100+') return price >= 100;
          return false;
        });
      });
    }

    if (selectedFilters.availability?.length) {
      filtered = filtered.filter((p) => {
        if (selectedFilters.availability?.includes('in-stock')) {
          return p.inStock;
        }
        if (selectedFilters.availability?.includes('out-of-stock')) {
          return !p.inStock;
        }
        return true;
      });
    }

    if (selectedFilters.special?.length) {
      filtered = filtered.filter((p) => {
        if (selectedFilters.special?.includes('on-sale') && p.salePrice) return true;
        if (selectedFilters.special?.includes('new') && p.badge === 'New') return true;
        if (selectedFilters.special?.includes('best-seller') && p.badge === 'Best Seller') return true;
        return false;
      });
    }

    return filtered;
  }, [categoryProducts, searchQuery, selectedFilters]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'newest':
        return sorted; // TODO: add created_at sort when available
      case 'price-asc':
        return sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case 'price-desc':
        return sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const handleFilterChange = (filterId: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearAll = () => {
    setSelectedFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">{categoryName}</h1>
          <ProductSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="mb-4 lg:hidden">
          <Button variant="outline" onClick={() => setShowMobileFilters(!showMobileFilters)} className="w-full">
            <FiFilter className="mr-2" />
            Filters{' '}
            {Object.values(selectedFilters).flat().length > 0 &&
              `(${Object.values(selectedFilters).flat().length})`}
          </Button>
        </div>

        <div className="flex gap-8">
          <aside className={`${showMobileFilters ? 'block' : 'hidden'} w-full lg:block lg:w-64 lg:flex-shrink-0`}>
            <ProductFilters
              filters={filterGroups}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </aside>

          <div className="flex-1">
            <div className="mb-6">
              <ProductSort value={sortBy} onChange={setSortBy} totalProducts={sortedProducts.length} />
            </div>

            <ProductGrid products={sortedProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}


