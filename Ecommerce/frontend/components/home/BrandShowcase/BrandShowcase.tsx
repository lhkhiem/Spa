'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchFeaturedBrands, BrandSummaryDTO } from '@/lib/api/publicHomepage';

interface Brand {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo?: string | null;
}

const FALLBACK_BRANDS: Brand[] = [
  {
    id: 'fallback-1',
    name: 'Cirepil',
    slug: 'cirepil',
    tagline: 'Premium Wax Products',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=320&h=200&fit=crop',
  },
  {
    id: 'fallback-2',
    name: 'Bio-Therapeutic',
    slug: 'bio-therapeutic',
    tagline: 'Advanced Skincare',
    logo: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=320&h=200&fit=crop',
  },
  {
    id: 'fallback-3',
    name: 'Intensive',
    slug: 'intensive',
    tagline: 'Professional Tinting',
    logo: 'https://images.unsplash.com/photo-1594735153960-40c6b1b3c199?w=320&h=200&fit=crop',
  },
  {
    id: 'fallback-4',
    name: 'Complete Pro',
    slug: 'complete-pro',
    tagline: 'Salon Essentials',
    logo: 'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=320&h=200&fit=crop',
  },
  {
    id: 'fallback-5',
    name: 'Moor Spa',
    slug: 'moor-spa',
    tagline: 'Natural Body Care',
    logo: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=320&h=200&fit=crop',
  },
  {
    id: 'fallback-6',
    name: 'ESS Aromatherapy',
    slug: 'ess-aromatherapy',
    tagline: 'Essential Oils',
    logo: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=320&h=200&fit=crop',
  },
];

const brandColors = [
  'bg-brand-purple-600',
  'bg-brand-green-600',
  'bg-brand-blue-600',
  'bg-yellow-500',
  'bg-pink-600',
  'bg-purple-600',
];

export default function BrandShowcase() {
  const [brands, setBrands] = useState<Brand[]>(FALLBACK_BRANDS);

  useEffect(() => {
    let isMounted = true;

    const loadBrands = async () => {
      try {
        // Gọi API public để lấy danh sách thương hiệu nổi bật từ CMS
        const data = await fetchFeaturedBrands();
        if (!isMounted || !data.length) {
          return;
        }

        const mapped: Brand[] = data.map((brand: BrandSummaryDTO) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          tagline: brand.tagline ?? '',
          logo: brand.logoUrl,
        }));

        setBrands(mapped);
      } catch (error) {
        console.error('[BrandShowcase] failed to load brands', error);
      }
    };

    loadBrands();

    return () => {
      // Dọn cờ khi component unmount để tránh setState khi đã huỷ
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&h=1080&fit=crop)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Mua Sắm Thương Hiệu Spa & Salon Phổ Biến
          </h2>
          <p className="text-lg text-gray-600">
            Bạn có thể tin tưởng vào các thương hiệu này với độ tin cậy, giá trị và hiệu suất vượt trội
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand, index) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group flex flex-col items-center rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-xl"
            >
              <div className="mb-3 flex w-full items-center justify-center overflow-hidden rounded" style={{ aspectRatio: '16/10' }}>
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={320}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <span className="px-2 text-center text-xs font-bold text-gray-600">{brand.name}</span>
                  </div>
                )}
              </div>
              <p className="text-center text-xs text-gray-600 line-clamp-2">{brand.tagline}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/brands"
            className="text-brand-purple-600 hover:text-brand-purple-700 font-medium"
          >
            Xem tất cả thương hiệu →
          </Link>
        </div>
      </div>
    </section>
  );
}
