import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';

const featuredBrands = [
  {
    id: 'cirepil',
    name: 'Cirepil',
    slug: 'cirepil',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Premium hard wax and waxing products for professionals',
    category: 'Waxing',
    productCount: 45,
  },
  {
    id: 'bio-therapeutic',
    name: 'Bio-Therapeutic',
    slug: 'bio-therapeutic',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Advanced skin care technology and equipment',
    category: 'Equipment',
    productCount: 32,
  },
  {
    id: 'intensive',
    name: 'Intensive',
    slug: 'intensive',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Professional lash and brow tinting products',
    category: 'Lash & Brow',
    productCount: 28,
  },
  {
    id: 'intrinsics',
    name: 'Intrinsics',
    slug: 'intrinsics',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Quality disposable spa supplies and linens',
    category: 'Supplies',
    productCount: 156,
  },
  {
    id: 'sposh',
    name: 'Sposh',
    slug: 'sposh',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Premium spa linens and accessories',
    category: 'Linens',
    productCount: 89,
  },
  {
    id: 'ess',
    name: 'ESS Aromatherapy',
    slug: 'ess',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Essential oils and aromatherapy products',
    category: 'Aromatherapy',
    productCount: 67,
  },
  {
    id: 'dermalogica',
    name: 'Dermalogica',
    slug: 'dermalogica',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Professional skin care system',
    category: 'Skin Care',
    productCount: 124,
  },
  {
    id: 'image-skincare',
    name: 'Image Skincare',
    slug: 'image-skincare',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Clinical skin care backed by science',
    category: 'Skin Care',
    productCount: 98,
  },
  {
    id: 'biotone',
    name: 'Biotone',
    slug: 'biotone',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Professional massage products',
    category: 'Massage',
    productCount: 56,
  },
  {
    id: 'bon-vital',
    name: 'Bon Vital',
    slug: 'bon-vital',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Massage creams, lotions, and oils',
    category: 'Massage',
    productCount: 43,
  },
  {
    id: 'gm-collin',
    name: 'GM Collin',
    slug: 'gm-collin',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Advanced dermo-corrective skin care',
    category: 'Skin Care',
    productCount: 87,
  },
  {
    id: 'opi',
    name: 'OPI',
    slug: 'opi',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150',
    description: 'Professional nail lacquer and care',
    category: 'Nails',
    productCount: 234,
  },
];

const brandCategories = [
  'All Brands',
  'Skin Care',
  'Waxing',
  'Massage',
  'Lash & Brow',
  'Nails',
  'Equipment',
  'Supplies',
];

export default function BrandsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Brands', href: '/brands' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 to-purple-700 py-20 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Our Trusted Brands</h1>
            <p className="mb-8 max-w-2xl text-lg text-purple-100">
              We partner with the world's leading spa and salon brands to bring you the highest
              quality products. Shop by brand to find your favorites.
            </p>
          </FadeInSection>
        </div>
      </div>

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
        <div className="mb-12">
          <FadeInSection>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Featured Brands</h2>
          </FadeInSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredBrands.map((brand, index) => (
              <FadeInSection key={brand.id} delay={index * 50}>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
                >
                  <div className="relative h-32 border-b border-gray-100 bg-white p-6">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-purple-600">
                          {brand.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="mb-2 text-sm text-gray-600">{brand.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-brand-purple-700">
                        {brand.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {brand.productCount} products
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
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
