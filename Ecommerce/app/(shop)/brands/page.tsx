import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import PageHero from '@/components/ui/PageHero/PageHero';
import { fetchBrands } from '@/lib/api/brands';
import { buildFromApiOrigin } from '@/config/site';

const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150';

const resolveLogoUrl = (logoUrl: string | null | undefined): string => {
  if (!logoUrl) return FALLBACK_LOGO;
  
  if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
    return logoUrl;
  }

  return buildFromApiOrigin(logoUrl);
};

export default async function BrandsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Brands', href: '/brands' },
  ];

  // Fetch all brands from DB
  const allBrands = await fetchBrands();
  
  // Fetch featured brands
  const featuredBrandsData = await fetchBrands({ featured_only: true });

  // Extract unique categories from brands
  const categoriesSet = new Set<string>();
  allBrands.forEach((brand) => {
    if (brand.primary_category) {
      categoriesSet.add(brand.primary_category);
    }
  });
  const brandCategories = ['All Brands', ...Array.from(categoriesSet).sort()];

  // Use featured brands if available, otherwise use all brands
  const displayBrands = featuredBrandsData.length > 0 ? featuredBrandsData : allBrands;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="Our Trusted Brands"
        description="We partner with the world's leading spa and salon brands to bring you the highest quality products. Shop by brand to find your favorites."
        backgroundImage="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=1920&q=80"
      />

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        {/* Category Filter */}
        <FadeInSection>
          <div className="mb-8 flex flex-wrap gap-2">
            {brandCategories.map((category) => (
              <button
                key={category}
                className="rounded-full border-2 border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-brand-purple-600 hover:bg-brand-purple-600 hover:text-white"
              >
                {category}
              </button>
            ))}
          </div>
        </FadeInSection>

        {/* Featured Brands Section */}
        {featuredBrandsData.length > 0 && (
          <div className="mb-12">
            <FadeInSection>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Featured Brands</h2>
            </FadeInSection>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredBrandsData.map((brand, index) => (
                <FadeInSection key={brand.id} delay={index * 50}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
                  >
                    <div className="relative h-32 border-b border-gray-100 bg-white p-6">
                      <div className="flex h-full items-center justify-center">
                        {brand.logoUrl ? (
                          <Image
                            src={resolveLogoUrl(brand.logoUrl)}
                            alt={brand.name}
                            width={200}
                            height={80}
                            className="h-auto max-h-full w-auto object-contain"
                          />
                        ) : (
                          <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-purple-600">
                              {brand.name}
                            </h3>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {brand.description && (
                        <p className="mb-2 text-sm text-gray-600 line-clamp-2">{brand.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {brand.primary_category && (
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-brand-purple-700">
                            {brand.primary_category}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {brand.product_count || 0} {brand.product_count === 1 ? 'product' : 'products'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeInSection>
              ))}
            </div>
          </div>
        )}

        {/* All Brands Section */}
        <div className="mb-12">
          <FadeInSection>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {featuredBrandsData.length > 0 ? 'All Brands' : 'Brands'}
            </h2>
          </FadeInSection>
          {allBrands.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allBrands.map((brand, index) => (
                <FadeInSection key={brand.id} delay={index * 50}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
                  >
                    <div className="relative h-32 border-b border-gray-100 bg-white p-6">
                      <div className="flex h-full items-center justify-center">
                        {brand.logoUrl ? (
                          <Image
                            src={resolveLogoUrl(brand.logoUrl)}
                            alt={brand.name}
                            width={200}
                            height={80}
                            className="h-auto max-h-full w-auto object-contain"
                          />
                        ) : (
                          <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-purple-600">
                              {brand.name}
                            </h3>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {brand.description && (
                        <p className="mb-2 text-sm text-gray-600 line-clamp-2">{brand.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {brand.primary_category && (
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-brand-purple-700">
                            {brand.primary_category}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {brand.product_count || 0} {brand.product_count === 1 ? 'product' : 'products'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeInSection>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-12 text-center">
              <p className="text-gray-600">No brands available at the moment.</p>
            </div>
          )}
        </div>

        {/* Why Shop by Brand */}
        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 md:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Why Shop by Brand?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-600 text-white">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Trusted Quality</h3>
                <p className="text-gray-600">
                  Every brand we carry is carefully vetted for quality and performance
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-600 text-white">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Expert Knowledge</h3>
                <p className="text-gray-600">
                  Access training resources and product knowledge for each brand
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-600 text-white">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Fast Shipping</h3>
                <p className="text-gray-600">
                  Get your favorite brands delivered quickly with our shipping options
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* CTA */}
        <FadeInSection>
          <div className="mt-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Can't find the brand you're looking for?
            </h2>
            <p className="mb-6 text-gray-600">
              Contact us to inquire about specific brands or product availability
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-brand-purple-600 px-8 py-3 font-semibold text-white transition-all hover:bg-brand-purple-700"
            >
              Contact Us
            </Link>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
