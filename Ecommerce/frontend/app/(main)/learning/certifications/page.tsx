import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import { FiAward, FiCheckCircle, FiBook, FiUsers } from 'react-icons/fi';

const certifications = [
  {
    id: '1',
    title: 'Esthetician Training Certification',
    provider: 'National Esthetician Association',
    duration: '120 hours',
    level: 'Professional',
    students: 3456,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400',
    description: 'Comprehensive esthetician training with industry-recognized certification.',
  },
  {
    id: '2',
    title: 'Massage Therapy Certification',
    provider: 'American Massage Therapy Association',
    duration: '500 hours',
    level: 'Professional',
    students: 2890,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400',
    description: 'Complete massage therapy certification program.',
  },
  {
    id: '3',
    title: 'Lash Tech Certification',
    provider: 'International Lash Association',
    duration: '40 hours',
    level: 'Professional',
    students: 4567,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400',
    description: 'Professional lash extension certification course.',
  },
  {
    id: '4',
    title: 'Advanced Techniques Masterclass',
    provider: 'Spa Professionals Institute',
    duration: '80 hours',
    level: 'Advanced',
    students: 1234,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400',
    description: 'Advanced techniques for experienced professionals.',
  },
];

const categories = [
  'Esthetician Training',
  'Massage Therapy',
  'Lash Tech Certification',
  'Advanced Techniques',
  'Specialty Certifications',
  'Continuing Education',
];

export default function CertificationsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Learning', href: '/learning' },
    { label: 'Certifications', href: '/learning/certifications' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 py-20 text-white">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} className="mb-6 text-green-100" />
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Certifications</h1>
            <p className="mb-8 max-w-2xl text-lg text-green-100">
              Industry-recognized certifications to advance your career. Earn credentials that
              demonstrate your expertise and commitment to professional excellence.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Categories */}
        <FadeInSection>
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Certification Categories</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <span
                  key={index}
                  className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Certifications Grid */}
        <FadeInSection>
          <div className="mb-12">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Available Certifications</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert, index) => (
                <FadeInSection key={cert.id} delay={index * 100}>
                  <div className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={cert.image}
                        alt={cert.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute right-4 top-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
                          <FiAward className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-center gap-2 text-xs text-gray-600">
                        <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">
                          {cert.level}
                        </span>
                        <span>{cert.duration}</span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-green-600">
                        {cert.title}
                      </h3>
                      <p className="mb-2 text-sm font-medium text-gray-600">{cert.provider}</p>
                      <p className="mb-4 text-sm text-gray-600">{cert.description}</p>
                      <div className="mb-4 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-semibold">{cert.rating}</span>
                        </div>
                        <span className="text-gray-600">({cert.students} students)</span>
                      </div>
                      <Button className="w-full">Learn More</Button>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Benefits Section */}
        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 md:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Why Get Certified?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
                    <FiAward className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Industry Recognition</h3>
                <p className="text-gray-600">
                  Earn credentials recognized by industry associations and employers
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
                    <FiCheckCircle className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Career Advancement</h3>
                <p className="text-gray-600">
                  Open doors to better opportunities and higher earning potential
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
                    <FiBook className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Expert Knowledge</h3>
                <p className="text-gray-600">
                  Gain in-depth knowledge and skills from industry experts
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}


