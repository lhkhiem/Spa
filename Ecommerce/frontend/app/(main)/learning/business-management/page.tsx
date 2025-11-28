import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import { FiDollarSign, FiTrendingUp, FiUsers, FiTarget } from 'react-icons/fi';

const courses = [
  {
    id: '1',
    title: 'Financial Planning for Spa Owners',
    instructor: 'Robert Martinez',
    duration: '5 hours',
    ceus: '5 CEUs',
    level: 'Intermediate',
    students: 1890,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400',
    description: 'Learn essential financial planning and budgeting strategies.',
  },
  {
    id: '2',
    title: 'Marketing Strategies for Spas',
    instructor: 'Jennifer Lee',
    duration: '4 hours',
    ceus: '4 CEUs',
    level: 'Beginner',
    students: 2567,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400',
    description: 'Effective marketing techniques to grow your spa business.',
  },
  {
    id: '3',
    title: 'Staff Management & Leadership',
    instructor: 'David Thompson',
    duration: '6 hours',
    ceus: '6 CEUs',
    level: 'Advanced',
    students: 1123,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400',
    description: 'Build and manage a successful spa team.',
  },
  {
    id: '4',
    title: 'Client Retention Strategies',
    instructor: 'Amanda Wilson',
    duration: '3 hours',
    ceus: '3 CEUs',
    level: 'Beginner',
    students: 3456,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400',
    description: 'Keep clients coming back with proven retention techniques.',
  },
];

const topics = [
  'Financial Planning',
  'Marketing Strategies',
  'Staff Management',
  'Client Retention',
  'Business Growth',
  'Operations Management',
];

export default function BusinessManagementPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Learning', href: '/learning' },
    { label: 'Business Management', href: '/learning/business-management' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-20 text-white">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} className="mb-6 text-blue-100" />
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Business Management</h1>
            <p className="mb-8 max-w-2xl text-lg text-blue-100">
              Build and grow a profitable spa business. Learn essential management skills from
              financial planning to marketing and team leadership.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Topics */}
        <FadeInSection>
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Management Topics</h2>
            <div className="flex flex-wrap gap-3">
              {topics.map((topic, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
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
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                          {course.ceus}
                        </span>
                        <span>{course.duration}</span>
                        <span>•</span>
                        <span>{course.level}</span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600">
                        {course.title}
                      </h3>
                      <p className="mb-4 text-sm text-gray-600">{course.description}</p>
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
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-8 md:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Grow Your Business Today
            </h2>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                    <FiDollarSign className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Financial Planning</h3>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                    <FiTrendingUp className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Marketing</h3>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                    <FiUsers className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Team Management</h3>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                    <FiTarget className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Client Retention</h3>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}


