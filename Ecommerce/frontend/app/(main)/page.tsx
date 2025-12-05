import { Metadata } from 'next';
import dynamicImport from 'next/dynamic';
import HeroSlider from '@/components/home/HeroSlider/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid/CategoryGrid';
import BestSellers from '@/components/home/BestSellers/BestSellers';
import ValueProps from '@/components/home/ValueProps/ValueProps';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import { getPageMetadataFromCMS, generatePageMetadata } from '@/lib/utils/pageMetadata';

// Lazy load below-the-fold components for better initial page load
const Testimonials = dynamicImport(() => import('@/components/home/Testimonials/Testimonials'), {
  loading: () => (
    <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
      <div className="container-custom">
        <div className="h-64 animate-pulse bg-gray-200 rounded-lg" />
      </div>
    </section>
  ),
  ssr: true,
});

const EducationResources = dynamicImport(() => import('@/components/home/EducationResources/EducationResources'), {
  loading: () => (
    <section className="bg-white py-16">
      <div className="container-custom">
        <div className="h-64 animate-pulse bg-gray-200 rounded-lg" />
      </div>
    </section>
  ),
  ssr: true,
});

// Disable static generation (components fetch data client-side)
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageMetadataFromCMS('/');
  
  return generatePageMetadata(data, '/', {
    title: 'Banyco - Thiết Bị & Vật Tư Spa, Salon Chuyên Nghiệp',
    description:
      'Mua sắm thiết bị spa, salon và vật tư làm đẹp chuyên nghiệp. Được tin dùng bởi các chuyên gia hơn 40 năm. Miễn phí vận chuyển cho đơn hàng trên $749+.',
    ogImage: '/images/og-default.jpg',
  });
}

export default function HomePage() {
  return (
    <div className="min-h-screen -mt-[120px]">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Value Propositions */}
      <FadeInSection delay={100}>
        <ValueProps />
      </FadeInSection>

      {/* Category Grid */}
      <FadeInSection delay={200} className="-mt-4 sm:-mt-6 md:-mt-8">
        <CategoryGrid />
      </FadeInSection>

      {/* Best Sellers */}
      <FadeInSection delay={300}>
        <BestSellers />
      </FadeInSection>

      {/* Brand Showcase */}
      {/* <FadeInSection delay={100}>
        <BrandShowcase />
      </FadeInSection> */}

      {/* Testimonials */}
      <FadeInSection delay={200}>
        <Testimonials />
      </FadeInSection>

      {/* Education Resources */}
      <FadeInSection delay={300}>
        <EducationResources />
      </FadeInSection>
    </div>
  );
}
