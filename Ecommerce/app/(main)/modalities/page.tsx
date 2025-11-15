import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';

const modalities = [
  {
    id: 'facial-treatments',
    title: 'Facial Treatments',
    description: 'Advanced facial techniques and products for radiant skin',
    image: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=600&h=400',
    services: ['Deep Cleansing Facials', 'Anti-Aging Treatments', 'Acne Solutions', 'Hydrafacial', 'Chemical Peels', 'Microdermabrasion'],
    href: '/products?category=facial-treatments',
  },
  {
    id: 'massage-therapy',
    title: 'Massage Therapy',
    description: 'Therapeutic massage modalities for relaxation and healing',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400',
    services: ['Swedish Massage', 'Deep Tissue', 'Hot Stone Therapy', 'Aromatherapy Massage', 'Sports Massage', 'Prenatal Massage'],
    href: '/products?category=massage',
  },
  {
    id: 'body-treatments',
    title: 'Body Treatments',
    description: 'Luxurious body treatments for complete wellness',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400',
    services: ['Body Scrubs', 'Body Wraps', 'Mud Treatments', 'Salt Glow', 'Hydrotherapy', 'Detox Treatments'],
    href: '/products?category=body-treatments',
  },
  {
    id: 'waxing-hair-removal',
    title: 'Waxing & Hair Removal',
    description: 'Professional hair removal services and products',
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=400',
    services: ['Hard Wax', 'Soft Wax', 'Brazilian Wax', 'Full Body Wax', 'Eyebrow Shaping', 'Laser Hair Removal'],
    href: '/products?category=waxing',
  },
  {
    id: 'nail-services',
    title: 'Nail Services',
    description: 'Complete nail care and artistic nail designs',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400',
    services: ['Manicures', 'Pedicures', 'Gel Polish', 'Acrylic Nails', 'Nail Art', 'Spa Pedicures'],
    href: '/products?category=nail-care',
  },
  {
    id: 'lash-brow',
    title: 'Lash & Brow',
    description: 'Enhance eyes with professional lash and brow services',
    image: 'https://images.unsplash.com/photo-1583001992068-705744915b0e?w=600&h=400',
    services: ['Lash Extensions', 'Lash Lift', 'Brow Tinting', 'Brow Lamination', 'Microblading', 'Lash & Brow Tinting'],
    href: '/products?category=lash-brow',
  },
  {
    id: 'makeup-services',
    title: 'Makeup Services',
    description: 'Professional makeup application for any occasion',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400',
    services: ['Bridal Makeup', 'Special Occasion', 'Airbrush Makeup', 'Makeup Lessons', 'Permanent Makeup', 'Contouring'],
    href: '/products?category=makeup',
  },
  {
    id: 'holistic-wellness',
    title: 'Holistic Wellness',
    description: 'Mind-body wellness treatments for total health',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400',
    services: ['Reiki', 'Reflexology', 'Aromatherapy', 'Crystal Healing', 'Sound Therapy', 'Meditation'],
    href: '/products?category=wellness',
  },
];

export default function ModalitiesPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Modalities', href: '/modalities' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 to-purple-700 py-20 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Spa & Wellness Modalities</h1>
            <p className="mb-8 max-w-2xl text-lg text-purple-100">
              Explore our comprehensive range of spa treatments and wellness services. From
              traditional therapies to cutting-edge techniques, we provide the products and
              knowledge you need to excel.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        {/* Introduction */}
        <FadeInSection>
          <div className="mb-12 rounded-2xl bg-white p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Professional Spa Treatments & Services
            </h2>
            <p className="text-gray-600">
              Each modality represents a unique approach to wellness and beauty. Our curated
              selection of professional-grade products supports practitioners in delivering
              exceptional results across all treatment types. Whether you're expanding your service
              menu or perfecting your existing offerings, we have the products and expertise to
              help you succeed.
            </p>
          </div>
        </FadeInSection>

        {/* Modalities Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {modalities.map((modality, index) => (
            <FadeInSection key={modality.id} delay={index * 100}>
              <div className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-2xl">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={modality.image}
                    alt={modality.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">{modality.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="mb-4 text-gray-600">{modality.description}</p>
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-900">
                      Popular Services:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {modality.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-purple-50 px-3 py-1 text-sm text-brand-purple-700"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={modality.href}
                    className="inline-flex items-center text-brand-purple-600 hover:text-brand-purple-700"
                  >
                    Shop Products
                    <svg
                      className="ml-2 h-4 w-4"
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
                  </Link>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>

        {/* CTA Section */}
        <FadeInSection>
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center text-white md:p-12">
            <h2 className="mb-4 text-3xl font-bold">Need Help Choosing the Right Products?</h2>
            <p className="mb-8 text-lg text-purple-100">
              Our spa consultants are here to help you select the perfect products for your
              modalities and treatment menu.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-lg bg-white px-8 py-3 font-semibold text-brand-purple-600 transition-all hover:bg-purple-50"
              >
                Contact a Consultant
              </Link>
              <Link
                href="/learning"
                className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-brand-purple-600"
              >
                View Training Resources
              </Link>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
