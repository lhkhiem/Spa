'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard/ProductCard';
import { fetchBestSellers, ProductSummaryDTO } from '@/lib/api/publicHomepage';

interface BestSellerProduct {
  id: string;
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  inStock: boolean;
}

const FALLBACK_PRODUCTS: BestSellerProduct[] = [
  {
    id: 'fallback-1',
    productId: 'fallback-1',
    variantId: undefined,
    slug: 'intensive-lash-brow-tint',
    name: 'Intensive Lash and Brow Tint for Professionals',
    price: 29.99,
    salePrice: 24.99,
    image: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&h=400',
    rating: 4.8,
    reviewCount: 245,
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: 'fallback-2',
    productId: 'fallback-2',
    variantId: undefined,
    slug: 'cirepil-hard-wax-blue',
    name: 'Cirepil Hard Wax Beads, Blue',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400',
    rating: 4.9,
    reviewCount: 189,
    inStock: true,
  },
  {
    id: 'fallback-3',
    productId: 'fallback-3',
    variantId: undefined,
    slug: 'bio-therapeutic-ultrasonic',
    name: 'Bio-Therapeutic bt-micro® Ultrasonic Exfoliation',
    price: 299.99,
    salePrice: 249.99,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400',
    rating: 4.7,
    reviewCount: 156,
    badge: 'New',
    inStock: true,
  },
  {
    id: 'fallback-4',
    productId: 'fallback-4',
    variantId: undefined,
    slug: 'disposable-headbands',
    name: 'Intrinsics Disposable Headbands, 48 ct',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400',
    rating: 4.6,
    reviewCount: 512,
    inStock: true,
  },
  {
    id: 'fallback-5',
    productId: 'fallback-5',
    variantId: undefined,
    slug: 'massage-table-sheet',
    name: 'Sposh Premium Waterproof Fitted Sheet for Massage Tables',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400',
    rating: 4.8,
    reviewCount: 203,
    inStock: true,
  },
  {
    id: 'fallback-6',
    productId: 'fallback-6',
    variantId: undefined,
    slug: 'esthetic-wipes',
    name: 'Intrinsics Silken Esthetic Wipes, 200 ct',
    price: 18.99,
    salePrice: 15.99,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=400',
    rating: 4.7,
    reviewCount: 387,
    inStock: true,
  },
];

export default function BestSellers() {
  const [products, setProducts] = useState<BestSellerProduct[]>(FALLBACK_PRODUCTS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 4;

  useEffect(() => {
    let isMounted = true;

    const loadBestSellers = async () => {
      try {
        const data = await fetchBestSellers();
        if (!isMounted || !data.length) {
          return;
        }

        const mapped: BestSellerProduct[] = data.map((item: ProductSummaryDTO) => ({
          id: item.id,
          productId: item.id,
          variantId: undefined,
          slug: item.slug,
          name: item.name,
          price: item.price,
          salePrice: item.salePrice ?? undefined,
          image: item.imageUrl ?? '/images/placeholder-product.jpg',
          rating: item.rating ?? undefined,
          reviewCount: item.reviewCount ?? undefined,
          badge: item.badge ?? undefined,
          inStock: item.inStock,
        }));

        setProducts(mapped);
      } catch (error) {
        console.error('[BestSellers] failed to load products', error);
      }
    };

    loadBestSellers();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerSlide);
  const startIndex = currentSlide * itemsPerSlide;
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerSlide);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="relative overflow-hidden bg-white py-16">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-purple-200/40 to-pink-200/40 blur-3xl" 
             style={{ animationDuration: '4s' }} />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-blue-200/40 to-green-200/40 blur-3xl" 
             style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      <div className="container-custom relative">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Bán Chạy Nhất
          </h2>
          <p className="text-lg text-gray-600">
            Các sản phẩm được ưa chuộng nhất bởi chuyên gia
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative px-12">
          {/* Previous Button */}
          {totalSlides > 1 && (
            <button
              onClick={goToPrev}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-lg p-3 hover:bg-gray-100 transition-all"
              aria-label="Previous products"
            >
              <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Products Grid - 4 items per slide */}
          <div className="overflow-hidden">
            <div 
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-500"
              key={currentSlide}
            >
              {visibleProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="transform transition-all duration-500"
                  style={{
                    animation: `fadeInScale 0.6s ease-out ${index * 0.1}s both`,
                  }}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div
                    className={`transition-transform duration-300 ${
                      hoveredId === product.id ? 'scale-105' : 'scale-100'
                    }`}
                  >
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          {totalSlides > 1 && (
            <button
              onClick={goToNext}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-lg p-3 hover:bg-gray-100 transition-all"
              aria-label="Next products"
            >
              <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Dots Indicator */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? 'w-8 bg-brand-purple-600' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="/products?filter=best-sellers"
            className="group inline-flex items-center rounded-lg bg-gradient-to-r from-brand-purple-600 to-brand-purple-700 px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span>Xem Tất Cả Sản Phẩm Bán Chạy</span>
            <svg
              className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
