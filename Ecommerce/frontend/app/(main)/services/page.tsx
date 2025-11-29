import Image from 'next/image';
import Link from 'next/link';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import Button from '@/components/ui/Button/Button';

export const metadata = {
  title: 'Spa Development Services - Universal Companies',
  description: 'Your One-Stop Solution for Spa Development. Expert Planning, Product Selection, Logistics, and Support.',
};

// TODO: Replace hardcoded mockup data with API calls
// These should be fetched from CMS/backend API (e.g., /api/services, /api/partners)
// For now, keeping empty arrays to avoid displaying mockup data
interface ServiceItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const services: {
  dreamIt: ServiceItem[];
  buildIt: ServiceItem[];
  runIt: ServiceItem[];
} = {
  dreamIt: [],
  buildIt: [],
  runIt: [],
};

const partners: string[] = [];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <FadeInSection>
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-blue-700 py-20">
          <div className="container-custom relative z-10">
            <div className="mx-auto max-w-4xl text-center text-white">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">
                Your One-Stop Solution for Spa Development
              </h1>
              <p className="mb-8 text-xl">
                We help you with Expert Planning, Product Selection, Logistics, and Support
              </p>
              <Button size="lg" className="bg-white text-teal-700 hover:bg-gray-100">
                Get Started
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/20" />
        </section>
      </FadeInSection>

      {/* Intro */}
      <FadeInSection delay={100}>
        <section className="py-16">
          <div className="container-custom">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                From Small Day Spas to World-Class Destination Resorts, We Make Development Dreams Come True!
              </h2>
              <p className="text-lg text-gray-600">
                No matter the size of your spa operation, we have to make your dream a reality. Whether your
                requirements are primarily spa products and protocols, or you need the full-service help in
                planning and bringing your dream project to completion.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105">
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400"
                  alt="Dream It"
                  width={600}
                  height={400}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold">Dream It: Design & Space Planning</h3>
                  <p className="text-sm">Let us provide innovative solutions for your spa</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400"
                  alt="Build It"
                  width={600}
                  height={400}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold">Build It: Logistics & Project Management</h3>
                  <p className="text-sm">We make shipping seamless in your deployment and turnkey</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105">
                <Image
                  src="https://images.unsplash.com/photo-1552693673-1bf958298229?w=600&h=400"
                  alt="Run It"
                  width={600}
                  height={400}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold">Run It: Training & Ongoing Support</h3>
                  <p className="text-sm">We deliver full ongoing support</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Dream It Section */}
      <FadeInSection delay={200}>
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Dream It: Design, Menu Development & Space Planning
              </h2>
              <p className="text-lg text-gray-600">
                Let us help you turn your dream spa into reality by defining your target spa experience and
                needs in three important aspects of your opening strategy:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {services.dreamIt.length > 0 && services.dreamIt.map((service) => (
                <div
                  key={service.id}
                  className="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-2xl"
                >
                  <div className="relative h-48">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Build It Section */}
      <FadeInSection delay={300}>
        <section className="py-16">
          <div className="container-custom">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Build It: White-Glove Logistics and Project Management
              </h2>
              <p className="text-lg text-gray-600">
                Our proven services ensure industry-leading pricing with services that ease stress: small order
                cash discounts and we can take the burden out of your spa development plans.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {services.buildIt.length > 0 && services.buildIt.map((service) => (
                <div
                  key={service.id}
                  className="overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
                >
                  <div className="relative h-40">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 font-bold text-gray-900">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button>View More</Button>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Run It Section */}
      <FadeInSection delay={100}>
        <section className="bg-gradient-to-br from-blue-50 to-teal-50 py-16">
          <div className="container-custom">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Run It: Training & Ongoing Support
              </h2>
              <p className="text-lg text-gray-600">
                Our partnership doesn't end at delivery. We're there to ensure you can operate and stay
                competitive with robust training and ongoing support.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {services.runIt.length > 0 && services.runIt.map((service) => (
                <div
                  key={service.id}
                  className="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-2xl"
                >
                  <div className="relative h-48">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Partners Section */}
      <FadeInSection delay={200}>
        <section className="bg-gray-100 py-16">
          <div className="container-custom">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Our Work and Trusted Partners
              </h2>
              <p className="text-lg text-gray-600">
                Each project we undertake reflects our passion for innovation and excellence. See how we've
                transformed visions into stunning, successful spas worldwide.
              </p>
            </div>

            <div className="mb-12">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-teal-600">•</span>
                  <span>
                    <strong>Luxury Resort Spa:</strong> 14,000 sq ft spa featuring luxurious treatment suites,
                    custom furniture, and full-service product
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-teal-600">•</span>
                  <span>
                    <strong>Urban Day Spa:</strong> 2,500 sq ft spa combining contemporary design with holistic
                    wellness treatments
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-teal-600">•</span>
                  <span>
                    <strong>Eco-Resort Spa:</strong> A 5,800 sq ft sustainable spa created alongside with full
                    natural surrounds
                  </span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              {partners.length > 0 && partners.map((partner) => (
                <div
                  key={partner}
                  className="flex items-center justify-center rounded-full bg-gray-300 p-8 shadow-md"
                >
                  <span className="text-center font-semibold text-gray-600">{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Contact Form Section */}
      <FadeInSection delay={300}>
        <section className="py-16">
          <div className="container-custom">
            <div className="mx-auto max-w-3xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  Ready to Build Your Dream Spa?
                </h2>
                <p className="text-lg text-gray-600">
                  Contact us today to receive free development assistance.
                </p>
              </div>

              <form className="space-y-6 rounded-xl bg-white p-8 shadow-xl">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Type of Project
                    </label>
                    <select className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                      <option>Select...</option>
                      <option>Day Spa</option>
                      <option>Salon & Spa</option>
                      <option>Resort Spa</option>
                      <option>Medical Spa</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Size of Project
                    </label>
                    <select className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                      <option>Select...</option>
                      <option>1-3 Treatment Rooms</option>
                      <option>4-6 Treatment Rooms</option>
                      <option>7+ Treatment Rooms</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    rows={5}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>

                <div className="text-center">
                  <Button type="submit" size="lg" className="px-12">
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
