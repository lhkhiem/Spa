'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button/Button';
import { fetchHeroSlides, HeroSlideDTO } from '@/lib/api/publicHomepage';
import { normalizeMediaUrl } from '@/lib/utils/domainUtils';

interface Slide {
  id: string;
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const FALLBACK_SLIDES: Slide[] = [
  {
    id: 'fallback-1',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&h=1080',
    title: 'Thiết Bị & Vật Tư Spa & Salon Chuyên Nghiệp',
    description: 'Mọi thứ bạn cần cho kinh doanh spa và salon của mình',
    ctaText: 'Mua Ngay',
    ctaLink: '/products',
  },
  {
    id: 'fallback-2',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1920&h=1080',
    title: 'Thiết Bị & Công Cụ Cao Cấp',
    description: 'Thiết bị hàng đầu ngành dành cho chuyên gia',
    ctaText: 'Khám Phá Thiết Bị',
    ctaLink: '/categories/spa-equipment',
  },
  {
    id: 'fallback-3',
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=1920&h=1080',
    title: 'Đào Tạo Chuyên Nghiệp',
    description: 'Khóa học và chứng chỉ miễn phí cho chuyên gia spa',
    ctaText: 'Tìm Hiểu Thêm',
    ctaLink: '/learning',
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length === 0) {
      return () => undefined;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      try {
        const data = await fetchHeroSlides();
        console.log('[HeroSlider] Fetched slides:', data);
        
        if (!isMounted) {
          return;
        }

        if (!data || !data.length) {
          console.warn('[HeroSlider] No slides returned from API, using fallback slides');
          return;
        }

        const mapped: Slide[] = data
          .map((slide: HeroSlideDTO) => {
            // CRITICAL: Normalize image URL to remove localhost and ensure correct domain
            const normalizedImageUrl = normalizeMediaUrl(slide.imageUrl);
            return {
              id: slide.id,
              image: normalizedImageUrl ?? '',
              title: slide.title,
              description: slide.description ?? '',
              ctaText: slide.ctaText ?? 'Learn More',
              ctaLink: slide.ctaLink ?? '#',
            };
          })
          .filter((slide) => {
            const hasImage = Boolean(slide.image);
            if (!hasImage) {
              console.warn('[HeroSlider] Slide filtered out (no image):', slide.id, slide.title);
            }
            // Additional check: reject any slide with localhost in image URL
            if (hasImage && (slide.image.includes('localhost') || slide.image.includes('127.0.0.1'))) {
              console.error('[HeroSlider] CRITICAL: Slide image still contains localhost after normalization!', slide.id, slide.image);
              return false;
            }
            return hasImage;
          });

        if (!mapped.length) {
          console.warn('[HeroSlider] No slides with images after filtering, using fallback slides');
          return;
        }

        console.log('[HeroSlider] Setting slides:', mapped);
        setSlides(mapped);
        setCurrentSlide(0);
      } catch (error) {
        console.error('[HeroSlider] failed to load slides', error);
        // Keep fallback slides on error
      }
    };

    loadSlides();

    return () => {
      isMounted = false;
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!slides.length) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden pt-[120px]">
      {/* TRUE Parallax Hero - Single Block with background-attachment: fixed */}
      <section
        className="parallax-section relative w-full min-h-[60vh] md:min-h-[60vh] sm:min-h-[50vh] overflow-hidden mb-0"
        style={{
          backgroundImage: `url(${currentSlideData.image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Content - Scrolls normally while background stays fixed */}
        <div className="parallax-inner relative z-20 flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="py-16">
              <div className="text-white pl-8 sm:pl-12 md:pl-16 lg:pl-24 xl:pl-32">
                <h1 className="mb-4 text-3xl font-bold md:text-5xl lg:text-6xl leading-tight max-w-2xl">
                  {currentSlideData.title}
                </h1>
                <p className="mb-8 text-base md:text-xl max-w-2xl">{currentSlideData.description}</p>
                <Button
                  href={currentSlideData.ctaLink}
                  size="lg"
                  className="bg-white text-brand-purple-600 hover:bg-gray-100"
                >
                  {currentSlideData.ctaText}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 space-x-2 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
