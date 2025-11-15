import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import { FiClock, FiUser, FiAward, FiBookOpen } from 'react-icons/fi';

const courses = [
  {
    id: '1',
    title: 'Skin Care Protocols Masterclass',
    instructor: 'Dr. Sarah Johnson',
    duration: '6 hours',
    ceus: '6 CEUs',
    level: 'Advanced',
    students: 1243,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400',
    description: 'Master professional skincare protocols and advanced techniques.',
  },
  {
    id: '2',
    title: 'Waxing Techniques Certification',
    instructor: 'Emma Rodriguez',
    duration: '4 hours',
    ceus: '4 CEUs',
    level: 'Intermediate',
    students: 2156,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=600&h=400',
    description: 'Learn professional waxing techniques and best practices.',
  },
  {
    id: '3',
    title: 'Lash & Brow Services Training',
    instructor: 'Michael Chen',
    duration: '5 hours',
    ceus: '5 CEUs',
    level: 'Beginner',
    students: 3456,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400',
    description: 'Complete training for lash and brow services.',
  },
  {
    id: '4',
    title: 'Massage Methods & Techniques',
    instructor: 'Lisa Anderson',
    duration: '8 hours',
    ceus: '8 CEUs',
    level: 'Advanced',
    students: 987,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400',
    description: 'Advanced massage therapy techniques and protocols.',
  },
];

const topics = [
  'Skin Care Protocols',
  'Waxing Techniques',
  'Lash & Brow Services',
  'Massage Methods',
  'Product Knowledge',
  'Client Consultation',
];

export default function ProductTrainingPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Learning', href: '/learning' },
    { label: 'Product Training', href: '/learning/product-training' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 py-20 text-white">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} className="mb-6 text-purple-100" />
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Product Training</h1>
            <p className="mb-8 max-w-2xl text-lg text-purple-100">
              Master the products and techniques that make your spa successful. Learn from industry
              experts and earn CEUs to advance your career.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Topics */}
        <FadeInSection>
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Training Topics</h2>
            <div className="flex flex-wrap gap-3">
              {topics.map((topic, index) => (
                <span
                  key={index}
                  className="rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-brand-purple-700"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Courses Grid */}
        <FadeInSection>
          <div className="mb-12">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Available Courses</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <FadeInSection key={course.id} delay={index * 100}>
                  <div className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-center gap-2 text-xs text-gray-600">
                        <span className="rounded-full bg-brand-purple-100 px-2 py-1 text-brand-purple-700">
                          {course.ceus}
                        </span>
                        <span>{course.duration}</span>
                        <span>•</span>
                        <span>{course.level}</span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-brand-purple-600">
                        {course.title}
                      </h3>
                      <p className="mb-4 text-sm text-gray-600">{course.description}</p>
                      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                        <FiUser className="h-4 w-4" />
                        <span>{course.instructor}</span>
                      </div>
                      <div className="mb-4 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-semibold">{course.rating}</span>
                        </div>
                        <span className="text-gray-600">({course.students} students)</span>
                      </div>
                      <Button className="w-full">Enroll Now</Button>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Benefits Section */}
        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 md:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Why Choose Our Product Training?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-600 text-white">
                    <FiAward className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">CEU Credits</h3>
                <p className="text-gray-600">
                  Earn continuing education units recognized by industry associations
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-600 text-white">
                    <FiBookOpen className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Expert Instructors</h3>
                <p className="text-gray-600">
                  Learn from industry leaders with decades of hands-on experience
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-600 text-white">
                    <FiClock className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Self-Paced Learning</h3>
                <p className="text-gray-600">
                  Complete courses at your own pace, anytime, anywhere
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}


