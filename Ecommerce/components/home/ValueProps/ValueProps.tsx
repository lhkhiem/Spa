'use client';

import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { FiTruck, FiDollarSign, FiShield, FiAward, FiHeart, FiBook, FiStar } from 'react-icons/fi';
import { fetchValueProps, ValuePropDTO } from '@/lib/api/publicHomepage';

interface ValuePropItem {
  id: string;
  title: string;
  subtitle: string;
  Icon: IconType;
  iconColor: string;
  iconBackground: string;
}

const ICON_MAP: Record<string, IconType> = {
  shipping: FiTruck,
  dollar: FiDollarSign,
  'dollar-sign': FiDollarSign,
  'shield-check': FiShield,
  shield: FiShield,
  award: FiAward,
  heart: FiHeart,
  'book-open': FiBook,
};

const FALLBACK_VALUE_PROPS: ValuePropItem[] = [
  {
    id: 'fallback-1',
    title: 'Miễn Phí Vận Chuyển',
    subtitle: 'Đơn hàng từ 749.000₫+',
    Icon: FiTruck,
    iconColor: '#2563eb',
    iconBackground: '#bfdbfe',
  },
  {
    id: 'fallback-2',
    title: 'Giảm Giá Vận Chuyển',
    subtitle: '4.990₫ cho đơn hàng 199.000₫+',
    Icon: FiDollarSign,
    iconColor: '#10b981',
    iconBackground: '#bbf7d0',
  },
  {
    id: 'fallback-3',
    title: 'Chất Lượng Đảm Bảo',
    subtitle: 'Đã kiểm tra & phê duyệt',
    Icon: FiShield,
    iconColor: '#a855f7',
    iconBackground: '#e9d5ff',
  },
  {
    id: 'fallback-4',
    title: 'Hơn 40 Năm',
    subtitle: 'Dẫn đầu ngành',
    Icon: FiAward,
    iconColor: '#f59e0b',
    iconBackground: '#fde68a',
  },
  {
    id: 'fallback-5',
    title: 'Chương Trình Thưởng',
    subtitle: 'Tích điểm mỗi lần mua',
    Icon: FiHeart,
    iconColor: '#f43f5e',
    iconBackground: '#fecdd3',
  },
  {
    id: 'fallback-6',
    title: 'Đào Tạo Miễn Phí',
    subtitle: 'Khóa học CEU có sẵn',
    Icon: FiBook,
    iconColor: '#3b82f6',
    iconBackground: '#bfdbfe',
  },
];

export default function ValueProps() {
  const [valueProps, setValueProps] = useState<ValuePropItem[]>(FALLBACK_VALUE_PROPS);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadValueProps = async () => {
      try {
        const data = await fetchValueProps();
        if (!isMounted || !data.length) {
          return;
        }

        const mapped: ValuePropItem[] = data.map((item: ValuePropDTO) => {
          const Icon = ICON_MAP[item.icon_key ?? ''] ?? FiStar;
          return {
            id: item.id,
            title: item.title,
            subtitle: item.subtitle ?? '',
            Icon,
            iconColor: item.icon_color ?? '#ffffff',
            iconBackground: item.icon_background ?? 'rgba(255,255,255,0.15)',
          };
        });

        setValueProps(mapped);
      } catch (error) {
        console.error('[ValueProps] failed to load value props', error);
      }
    };

    loadValueProps();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const itemsPerSlide = 3;
    const totalSlides = Math.ceil(valueProps.length / itemsPerSlide);
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, [valueProps.length]);

  const itemsPerSlide = 3;
  const startIndex = currentSlide * itemsPerSlide;
  const visibleItems = valueProps.slice(startIndex, startIndex + itemsPerSlide);

  return (
    <section className="bg-gradient-to-br from-brand-purple-600 to-brand-purple-700 py-12 overflow-hidden">
      <div className="container-custom">
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {visibleItems.map((feature, index) => {
              const Icon = feature.Icon;
              return (
                <div
                  key={feature.id}
                  className="flex flex-col items-center rounded-lg bg-white/10 p-6 text-center text-white backdrop-blur-sm transition-all hover:bg-white/20 animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className="mb-4 rounded-full p-4"
                    style={{ backgroundColor: feature.iconBackground }}
                  >
                    <Icon className="h-6 w-6" style={{ color: feature.iconColor }} />
                  </div>
                  <h3 className="mb-1 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-purple-100">{feature.subtitle}</p>
                </div>
              );
            })}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(valueProps.length / itemsPerSlide) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
