import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';

const equipmentCategories = [
  {
    id: 'facial-equipment',
    title: 'Facial Equipment',
    description: 'Professional-grade facial equipment for every spa treatment',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400',
    items: ['Steamers', 'Magnifying Lamps', 'Galvanic Machines', 'Microdermabrasion', 'Ultrasonic Devices'],
    href: '/categories/facial-equipment',
  },
  {
    id: 'furniture',
    title: 'Spa Furniture',
    description: 'Comfortable and durable furniture designed for spa professionals',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400',
    items: ['Treatment Tables', 'Stools & Chairs', 'Trolleys & Carts', 'Storage Solutions'],
    href: '/categories/furniture',
  },
  {
    id: 'waxing-equipment',
    title: 'Waxing Equipment',
    description: 'Essential waxing equipment for professional hair removal',
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=400',
    items: ['Wax Warmers', 'Wax Pots', 'Professional Waxing Stations'],
    href: '/categories/waxing-equipment',
  },
  {
    id: 'nail-equipment',
    title: 'Nail Equipment',
    description: 'Complete nail salon equipment for manicures and pedicures',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400',
    items: ['UV/LED Lamps', 'Nail Stations', 'Pedicure Chairs', 'Nail Dryers'],
    href: '/categories/nail-equipment',
  },
  {
    id: 'massage-equipment',
    title: 'Massage Equipment',
    description: 'Professional massage equipment for therapeutic treatments',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400',
    items: ['Massage Tables', 'Hot Stone Warmers', 'Massage Chairs', 'Bolsters & Cushions'],
    href: '/categories/massage-equipment',
  },
  {
    id: 'spa-systems',
    title: 'Spa Systems',
    description: 'Advanced spa systems and technology',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400',
    items: ['Hydrotherapy Systems', 'Steam Rooms', 'Sauna Equipment', 'Shower Systems'],
    href: '/categories/spa-systems',
  },
];

const featuredEquipment = [
  {
    id: 1,
    name: 'Professional Facial Steamer',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400',
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Hydraulic Treatment Table',
    price: 899.99,
    salePrice: 749.99,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400',
    badge: 'Sale',
  },
  {
    id: 3,
    name: 'Digital Wax Warmer Station',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400',
    badge: 'New',
  },
  {
    id: 4,
    name: 'LED Pedicure Chair',
    price: 1499.99,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400',
    badge: 'Popular',
  },
];

export default function EquipmentPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Equipment', href: '/equipment' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 to-purple-700 py-20 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Professional Spa Equipment
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-purple-100">
              Industry-leading equipment for professional spas and salons. From facial steamers to
              pedicure chairs, we have everything you need to create the perfect spa experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/products?category=equipment" size="lg">
                Shop All Equipment
              </Button>
              <Button href="/services" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-700">
                Spa Development Services
              </Button>
            </div>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        {/* Equipment Categories Grid */}
        <div className="mb-16">
          <FadeInSection>
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Browse by Category</h2>
          </FadeInSection>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {equipmentCategories.map((category, index) => (
              <FadeInSection key={category.id} delay={index * 100}>
                <Link
                  href={category.href}
                  className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-brand-purple-600">
                      {category.title}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">{category.description}</p>
                    <ul className="space-y-1 text-sm text-gray-500">
                      {category.items.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="mr-2 h-1 w-1 rounded-full bg-brand-purple-600" />
                          {item}
                        </li>
                      ))}
                      {category.items.length > 3 && (
                        <li className="text-brand-purple-600">
                          +{category.items.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>

        {/* Featured Equipment */}
        <div className="mb-16">
          <FadeInSection>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Featured Equipment</h2>
              <Link
                href="/products?category=equipment"
                className="text-brand-purple-600 hover:text-brand-purple-700"
              >
                View All →
              </Link>
            </div>
          </FadeInSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredEquipment.map((item, index) => (
              <FadeInSection key={item.id} delay={index * 100}>
                <div className="overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl">
                  <div className="relative h-64">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {item.badge && (
                      <div className="absolute right-2 top-2 rounded-full bg-brand-purple-600 px-3 py-1 text-xs font-semibold text-white">
                        {item.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      {item.salePrice ? (
                        <>
                          <span className="text-lg font-bold text-brand-purple-600">
                            ${item.salePrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${item.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">${item.price}</span>
                      )}
                    </div>
                    <Button href={`/products/equipment-${item.id}`} className="mt-4 w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-600 text-white">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Quality Guaranteed</h3>
                <p className="text-gray-600">
                  All equipment is tested and certified to meet industry standards
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-600 text-white">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Expert Support</h3>
                <p className="text-gray-600">
                  Our team provides installation support and training for all equipment
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-600 text-white">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Financing Available</h3>
                <p className="text-gray-600">
                  Flexible payment options to help you grow your business
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
