'use client';

import { useEffect, useState } from 'react';
import { fetchValueProps, ValuePropDTO } from '@/lib/api/publicHomepage';

interface ValuePropItem {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'truck' | 'discount' | 'shield' | 'award' | 'heart' | 'book';
}

// Brand red color
const BRAND_RED = '#98131b';

// Simple SVG Icons in brand red
const TruckIcon = () => (
  <svg
    className="w-12 h-12 animate-icon-pulse"
    fill="none"
    stroke={BRAND_RED}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l2 2v4h-6V8z" />
    <circle cx="5.5" cy="18.5" r="2" />
    <circle cx="18.5" cy="18.5" r="2" />
  </svg>
);

const DiscountIcon = () => (
  <svg
    className="w-12 h-12 animate-icon-pulse"
    fill="none"
    stroke={BRAND_RED}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="w-12 h-12 animate-icon-pulse"
    fill="none"
    stroke={BRAND_RED}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const AwardIcon = () => (
  <svg
    className="w-12 h-12 animate-icon-pulse"
    fill="none"
    stroke={BRAND_RED}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="8" r="6" />
    <polyline points="9 12 7 20 12 18 17 20 15 12" />
  </svg>
);

const HeartIcon = () => (
  <svg
    className="w-12 h-12 animate-icon-pulse"
    fill="none"
    stroke={BRAND_RED}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BookIcon = () => (
  <svg
    className="w-12 h-12 animate-icon-pulse"
    fill="none"
    stroke={BRAND_RED}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ICON_COMPONENTS = {
  truck: TruckIcon,
  discount: DiscountIcon,
  shield: ShieldIcon,
  award: AwardIcon,
  heart: HeartIcon,
  book: BookIcon,
};

const FALLBACK_VALUE_PROPS: ValuePropItem[] = [
  {
    id: 'fallback-1',
    title: 'Miễn Phí Vận Chuyển',
    subtitle: 'Đơn hàng từ 749.000₫+',
    iconType: 'truck',
  },
  {
    id: 'fallback-2',
    title: 'Giảm Giá Vận Chuyển',
    subtitle: '4.990₫ cho đơn hàng 199.000₫+',
    iconType: 'discount',
  },
  {
    id: 'fallback-3',
    title: 'Chất Lượng Đảm Bảo',
    subtitle: 'Đã kiểm tra & phê duyệt',
    iconType: 'shield',
  },
  {
    id: 'fallback-4',
    title: 'Hơn 40 Năm',
    subtitle: 'Dẫn đầu ngành',
    iconType: 'award',
  },
  {
    id: 'fallback-5',
    title: 'Chương Trình Thưởng',
    subtitle: 'Tích điểm mỗi lần mua',
    iconType: 'heart',
  },
  {
    id: 'fallback-6',
    title: 'Đào Tạo Miễn Phí',
    subtitle: 'Khóa học CEU có sẵn',
    iconType: 'book',
  },
];

export default function ValueProps() {
  const [valueProps, setValueProps] = useState<ValuePropItem[]>(FALLBACK_VALUE_PROPS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadValueProps = async () => {
      try {
        const data = await fetchValueProps();
        if (!isMounted || !data.length) {
          return;
        }

        const mapped: ValuePropItem[] = data.map((item: ValuePropDTO) => {
          // Map icon keys to icon types
          const iconTypeMap: Record<string, ValuePropItem['iconType']> = {
            shipping: 'truck',
            truck: 'truck',
            dollar: 'discount',
            'dollar-sign': 'discount',
            discount: 'discount',
            'shield-check': 'shield',
            shield: 'shield',
            award: 'award',
            heart: 'heart',
            'book-open': 'book',
            book: 'book',
          };
          
          return {
            id: item.id,
            title: item.title,
            subtitle: item.subtitle ?? '',
            iconType: iconTypeMap[item.icon_key ?? ''] ?? 'truck',
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

  // Auto-slide every 3 seconds - move one item at a time
  useEffect(() => {
    if (valueProps.length <= 3) return; // No need to slide if 3 or fewer items
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % valueProps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [valueProps.length]);

  // Get visible items (3 items starting from currentIndex)
  const getVisibleItems = () => {
    const items: ValuePropItem[] = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % valueProps.length;
      items.push(valueProps[index]);
    }
    return items;
  };

  const visibleItems = getVisibleItems();
  const totalSlides = valueProps.length;

  return (
    <>
      <style jsx>{`
        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.05) rotate(3deg);
          }
        }
        .animate-icon-pulse {
          animation: iconPulse 3s ease-in-out infinite;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
      <section className="bg-white -mt-1 pb-4 sm:pb-6 md:pb-8 lg:pb-12 overflow-hidden relative z-10">
        <div className="container-custom">
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {visibleItems.map((feature, index) => {
                const IconComponent = ICON_COMPONENTS[feature.iconType] || TruckIcon;
                return (
                  <div
                    key={`${feature.id}-${currentIndex}-${index}`}
                    className="group flex flex-col items-center rounded-2xl bg-white p-4 sm:p-6 md:p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-in"
                  >
                    <div className="mb-3 sm:mb-4 md:mb-6 flex items-center justify-center">
                      <IconComponent />
                    </div>
                    <h3 className="mb-2 sm:mb-2 md:mb-3 text-lg sm:text-xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{feature.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots indicator */}
          {valueProps.length > 3 && (
            <div className="flex justify-center gap-2 mt-6 sm:mt-8 md:mt-12">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? 'w-8 bg-[#98131b]'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to item ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
