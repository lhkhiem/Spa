'use client';

import Select from '@/components/ui/Select/Select';

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating';

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  totalProducts: number;
}

const sortOptions = [
  { value: 'featured', label: 'Nổi bật' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá: Thấp đến cao' },
  { value: 'price-desc', label: 'Giá: Cao đến thấp' },
  { value: 'name-asc', label: 'Tên: A đến Z' },
  { value: 'rating', label: 'Đánh giá cao' },
];

export default function ProductSort({ value, onChange, totalProducts }: ProductSortProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-gray-600">
        Hiển thị <span className="font-semibold text-gray-900">{totalProducts}</span> sản phẩm
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-700">
          Sắp xếp:
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
