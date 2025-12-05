'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiSearch, FiX, FiLoader } from 'react-icons/fi';
import { fetchProducts, type ProductDTO } from '@/lib/api/products';
import SafeImage from '@/components/ui/SafeImage/SafeImage';
import { formatPrice } from '@/lib/utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setProducts([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery.length < 2) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetchProducts({
          q: trimmedQuery,
          page: 1,
          pageSize: 10, // Show max 10 suggestions
        });
        setProducts(response.data);
      } catch (error) {
        console.error('[SearchModal] Error fetching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < products.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && products[selectedIndex]) {
        // Navigate to selected product
        handleProductSelect(products[selectedIndex]);
      } else if (searchQuery.trim()) {
        // Navigate to products page with search query
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [selectedIndex, products, searchQuery, onClose]);

  const handleProductSelect = (product: ProductDTO) => {
    router.push(`/products/${product.slug}`);
    onClose();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0) {
      const element = document.getElementById(`product-item-${selectedIndex}`);
      if (element) {
        element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-20 z-50 w-full max-w-2xl -translate-x-1/2 transform">
        <div className="mx-4 rounded-lg bg-white shadow-2xl">
          {/* Search Input */}
          <div className="relative border-b border-gray-200 p-4">
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 text-sm focus:border-[#98131b] focus:outline-none focus:ring-2 focus:ring-[#98131b]/20"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndex(-1);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <FiLoader className="h-6 w-6 animate-spin text-[#98131b]" />
                <span className="ml-2 text-sm text-gray-600">Đang tìm kiếm...</span>
              </div>
            )}

            {!isLoading && searchQuery.trim().length >= 2 && products.length === 0 && (
              <div className="py-8 text-center text-sm text-gray-500">
                Không tìm thấy sản phẩm nào
              </div>
            )}

            {!isLoading && searchQuery.trim().length < 2 && (
              <div className="py-8 text-center text-sm text-gray-500">
                Nhập ít nhất 2 ký tự để tìm kiếm
              </div>
            )}

            {!isLoading && products.length > 0 && (
              <>
                <div className="divide-y divide-gray-100">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      id={`product-item-${index}`}
                      onClick={() => handleProductSelect(product)}
                      className={`cursor-pointer px-4 py-3 transition-colors ${
                        selectedIndex === index
                          ? 'bg-[#98131b]/10'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Product Image */}
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <SafeImage
                            src={product.thumbnailUrl || '/images/placeholder-product.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </h3>
                          {product.brand && (
                            <p className="mt-0.5 text-xs text-gray-500">
                              {product.brand.name}
                            </p>
                          )}
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-sm font-bold text-[#98131b]">
                              {formatPrice(product.price)}
                            </span>
                            {product.comparePrice && product.comparePrice > product.price && (
                              <span className="text-xs text-gray-500 line-through">
                                {formatPrice(product.comparePrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Results */}
                {products.length > 0 && (
                  <div className="border-t border-gray-200 p-4">
                    <button
                      onClick={handleSearch}
                      className="w-full rounded-lg bg-[#98131b] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#98131b]/90"
                    >
                      Xem tất cả kết quả ({searchQuery.trim()})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

