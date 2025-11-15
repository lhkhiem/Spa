import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import Image from 'next/image';
import Link from 'next/link';

const catalogs = [
  {
    title: '2025 Spring Collection',
    description: 'Discover our latest products for spring treatments',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500',
    pages: 128,
    pdfUrl: '#',
  },
  {
    title: 'Equipment & Furniture Catalog',
    description: 'Complete guide to spa equipment and furniture',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=500',
    pages: 96,
    pdfUrl: '#',
  },
  {
    title: 'Waxing Essentials',
    description: 'Everything you need for professional waxing services',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=500',
    pages: 64,
    pdfUrl: '#',
  },
  {
    title: 'Skin Care Solutions',
    description: 'Professional skin care products and protocols',
    image: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&h=500',
    pages: 112,
    pdfUrl: '#',
  },
];

export default function CatalogsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Browse Catalogs', href: '/catalogs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Browse Our Catalogs</h1>
            <p className="max-w-2xl text-lg text-purple-100">
              Explore our full range of professional spa and salon products in our digital catalogs.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {catalogs.map((catalog, index) => (
            <FadeInSection key={index} delay={index * 100}>
              <div className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-2xl">
                <div className="relative h-96">
                  <Image
                    src={catalog.image}
                    alt={catalog.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{catalog.title}</h3>
                  <p className="mb-3 text-sm text-gray-600">{catalog.description}</p>
                  <p className="mb-4 text-sm text-gray-500">{catalog.pages} pages</p>
                  <Button href={catalog.pdfUrl} className="w-full">
                    View Catalog
                  </Button>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Want a Physical Catalog?</h2>
            <p className="mb-6 text-lg text-purple-100">
              Request a free printed catalog to be mailed to your spa or salon.
            </p>
            <Button href="/contact" size="lg" className="bg-white text-brand-purple-600 hover:bg-purple-50">
              Request Printed Catalog
            </Button>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
