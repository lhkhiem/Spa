'use client';

import Select from '@/components/ui/Select/Select';

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating';

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  totalProducts: number;
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductSort({ value, onChange, totalProducts }: ProductSortProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{totalProducts}</span> products
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-700">
          Sort by:
        </label>
        <Select
          id="sort"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          options={sortOptions}
          className="w-48"
        />
      </div>
    </div>
  );
}
