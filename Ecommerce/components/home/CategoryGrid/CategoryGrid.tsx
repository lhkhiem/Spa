'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { fetchFeaturedCategories, CategorySummaryDTO } from '@/lib/api/publicHomepage';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 'fallback-1',
    name: 'Waxing',
    slug: 'waxing',
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=300',
    description: 'Sản phẩm và vật tư waxing chuyên nghiệp',
  },
  {
    id: 'fallback-2',
    name: 'Chăm Sóc Da',
    slug: 'skin-care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300',
    description: 'Sản phẩm chăm sóc da cao cấp cho chuyên gia',
  },
  {
    id: 'fallback-3',
    name: 'Mi & Lông Mày',
    slug: 'lash-brow',
    image: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&h=300',
    description: 'Nối mi, nhuộm và sản phẩm làm lông mày',
  },
  {
    id: 'fallback-4',
    name: 'Massage',
    slug: 'massage',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300',
    description: 'Dầu massage, dụng cụ và thiết bị',
  },
  {
    id: 'fallback-5',
    name: 'Chăm Sóc Móng',
    slug: 'manicure-pedicure',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300',
    description: 'Giải pháp chăm sóc móng toàn diện',
  },
  {
    id: 'fallback-6',
    name: 'Makeup',
    slug: 'makeup',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300',
    description: 'Professional makeup products',
  },
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const data = await fetchFeaturedCategories();
        if (!isMounted || !data.length) {
          return;
        }

        const mapped: Category[] = data.map((category: CategorySummaryDTO) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description ?? '',
          image: category.imageUrl ?? 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300',
        }));

        setCategories(mapped);
      } catch (error) {
        console.error('[CategoryGrid] failed to load categories', error);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 py-16">
      <div className="container-custom">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Mua Sắm Theo Danh Mục
          </h2>
          <p className="text-lg text-gray-600">
            Khám phá bộ sưu tập toàn diện các sản phẩm spa và salon
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                
                {/* Shimmer effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ${
                    hoveredId === category.id ? 'translate-x-full' : '-translate-x-full'
                  }`}
                />
              </div>

              <div className="relative p-6 transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-pink-50">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-transform duration-300 group-hover:scale-105">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">{category.description}</p>

                <div className="mt-4 flex items-center text-brand-purple-600 transition-all duration-300 group-hover:text-brand-purple-700">
                  <span className="text-sm font-medium">Mua Ngay</span>
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 rounded-xl border-2 border-brand-purple-400/50 animate-pulse" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/categories"
            className="group inline-flex items-center rounded-lg border-2 border-brand-purple-600 bg-white px-8 py-3 font-medium text-brand-purple-600 transition-all duration-300 hover:bg-brand-purple-600 hover:text-white hover:shadow-lg"
          >
            <span>Xem Tất Cả Danh Mục</span>
            <svg 
              className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
