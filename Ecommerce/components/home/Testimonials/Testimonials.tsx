'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchHomepageStats, fetchTestimonials, HomepageStatsDTO, TestimonialDTO } from '@/lib/api/publicHomepage';

// Animated Counter Hook
function useCounterAnimation(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuad(progress));
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return { count, ref };
}

interface TestimonialItem {
  id: string;
  quote: string;
  customerName: string;
  customerTitle?: string;
  customerInitials: string;
  rating: number;
}

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'fallback-1',
    quote:
      'I have been dealing with Universal for over 30 yrs now and have never been disappointed in a product or their great customer service. Thank you for making my job easier as a Clinic Esthetician.',
    customerName: 'Laura W.',
    customerTitle: 'Esthetician',
    customerInitials: 'LW',
    rating: 5,
  },
  {
    id: 'fallback-2',
    quote: 'All your needs in one place like being at a party store! Amazing selection and fast shipping. Highly recommend!',
    customerName: 'Kiara H.',
    customerTitle: 'Owner/Operator',
    customerInitials: 'KH',
    rating: 5,
  },
  {
    id: 'fallback-3',
    quote: 'Outstanding quality and service! The educational resources have been invaluable for my team. We trust Universal for all our spa supplies.',
    customerName: 'Sarah M.',
    customerTitle: 'Spa Director',
    customerInitials: 'SM',
    rating: 5,
  },
];

const FALLBACK_STATS: HomepageStatsDTO = {
  activeCustomers: '100',
  countriesServed: '200',
  yearsInBusiness: '10',
};

const renderStars = (count: number) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <svg
      key={index}
      className={`h-5 w-5 ${index < count ? 'text-yellow-400' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
  ));
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(FALLBACK_TESTIMONIALS);
  const [stats, setStats] = useState<HomepageStatsDTO>(FALLBACK_STATS);

  // Parse numeric values for animation
  const customersCount = parseInt(stats.activeCustomers?.replace(/\D/g, '') || '100');
  const productsCount = parseInt(stats.countriesServed?.replace(/\D/g, '') || '200');
  const yearsCount = parseInt(stats.yearsInBusiness?.replace(/\D/g, '') || '10');

  const customers = useCounterAnimation(customersCount);
  const products = useCounterAnimation(productsCount);
  const years = useCounterAnimation(yearsCount);

  useEffect(() => {
    let isMounted = true;

    const loadTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        if (!isMounted || !data.length) {
          return;
        }

        const mapped: TestimonialItem[] = data.map((item: TestimonialDTO) => ({
          id: item.id,
          quote: item.testimonial_text,
          customerName: item.customer_name,
          customerTitle: item.customer_title ?? undefined,
          customerInitials: item.customer_initials ?? item.customer_name.slice(0, 2).toUpperCase(),
          rating: item.rating ?? 5,
        }));

        setTestimonials(mapped);
      } catch (error) {
        console.error('[Testimonials] failed to load testimonials', error);
      }
    };

    const loadStats = async () => {
      try {
        const data = await fetchHomepageStats();
        if (!isMounted || !data) {
          return;
        }
        setStats(data);
      } catch (error) {
        console.error('[Testimonials] failed to load homepage stats', error);
      }
    };

    loadTestimonials();
    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
      <div className="container-custom">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Nhà Phân Phối Hàng Đầu Ngành Spa Hơn 40 Năm!
          </h2>
          <p className="text-lg text-gray-600">
            Khách hàng nói gì về lựa chọn sản phẩm và dịch vụ của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center text-yellow-400">
                {renderStars(Math.round(testimonial.rating))}
              </div>
              <p className="mb-4 text-gray-700">“{testimonial.quote}”</p>
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple-100 text-brand-purple-600">
                  {testimonial.customerInitials}
              </div>
              <div className="ml-3">
                  <p className="font-semibold text-gray-900">{testimonial.customerName}</p>
                  {testimonial.customerTitle && (
                    <p className="text-sm text-gray-600">{testimonial.customerTitle}</p>
                  )}
              </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section - Animated Counters */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center" ref={customers.ref}>
            <div className="mb-2 text-5xl font-bold text-brand-purple-600">
              {customers.count}+
            </div>
            <p className="text-lg font-semibold text-gray-700">Khách hàng</p>
          </div>
          <div className="text-center" ref={products.ref}>
            <div className="mb-2 text-5xl font-bold text-brand-purple-600">
              {products.count}+
            </div>
            <p className="text-lg font-semibold text-gray-700">Sản phẩm</p>
          </div>
          <div className="text-center" ref={years.ref}>
            <div className="mb-2 text-5xl font-bold text-brand-purple-600">
              {years.count}+
            </div>
            <p className="text-lg font-semibold text-gray-700">Năm kinh nghiệm</p>
          </div>
        </div>
      </div>
    </section>
  );
}
