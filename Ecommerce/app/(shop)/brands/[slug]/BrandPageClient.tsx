'use client';

import { useState, useMemo } from 'react';
import ProductGrid from '@/components/product/ProductGrid/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters/ProductFilters';
import ProductSort, { SortOption } from '@/components/product/ProductSort/ProductSort';
import ProductSearch from '@/components/product/ProductSearch/ProductSearch';
import Button from '@/components/ui/Button/Button';
import { FiFilter } from 'react-icons/fi';
import type { ProductDTO } from '@/lib/api/products';

interface ProductData {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  inStock: boolean;
  category: string;
  brand: string;
  tags?: string[];
}

interface BrandPageClientProps {
  products: ProductData[];
  filterGroups: Array<{
    id: string;
    title: string;
    options: Array<{ id: string; label: string }>;
  }>;
}

export default function BrandPageClient({ products, filterGroups }: BrandPageClientProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedFilters.category?.length) {
      filtered = filtered.filter((p) =>
        selectedFilters.category.some((cat) => p.category === cat)
      );
    }

    // Price filter
    if (selectedFilters.price?.length) {
      filtered = filtered.filter((p) => {
        const price = p.salePrice || p.price;
        return selectedFilters.price.some((range) => {
          if (range === '0-25') return price < 25;
          if (range === '25-50') return price >= 25 && price < 50;
          if (range === '50-100') return price >= 50 && price < 100;
          if (range === '100+') return price >= 100;
          return false;
        });
      });
    }

    // Availability filter
    if (selectedFilters.availability?.length) {
      filtered = filtered.filter((p) => {
        if (selectedFilters.availability.includes('in-stock')) return p.inStock;
        if (selectedFilters.availability.includes('out-of-stock')) return !p.inStock;
        return true;
      });
    }

    // Special offers filter
    if (selectedFilters.special?.length) {
      filtered = filtered.filter((p) => {
        if (selectedFilters.special.includes('on-sale') && p.salePrice) return true;
        if (selectedFilters.special.includes('new') && p.badge === 'New') return true;
        if (selectedFilters.special.includes('best-seller') && p.badge === 'Best Seller')
          return true;
        return false;
      });
    }

    return filtered;
  }, [products, selectedFilters, searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'newest':
        return sorted.reverse();
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
    <>
      <ProductSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Mobile Filter Toggle */}
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
        {/* Sidebar Filters */}
        <aside
          className={`${
            showMobileFilters ? 'block' : 'hidden'
          } w-full lg:block lg:w-64 lg:flex-shrink-0`}
        >
          <ProductFilters
            filters={filterGroups}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort and Count */}
          <div className="mb-6">
            <ProductSort
              value={sortBy}
              onChange={setSortBy}
              totalProducts={sortedProducts.length}
            />
          </div>

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <ProductGrid products={sortedProducts} />
          ) : (
            <div className="rounded-lg bg-gray-50 p-12 text-center">
              <p className="text-gray-600">No products found matching your filters.</p>
              <Button variant="outline" onClick={handleClearAll} className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}





