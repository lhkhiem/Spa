import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';

const learningCategories = [
  {
    id: 'product-training',
    title: 'Product Training',
    description: 'Master the products and techniques that make your spa successful',
    topics: ['Skin Care Protocols', 'Waxing Techniques', 'Lash & Brow Services', 'Massage Methods'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400',
    href: '/learning/product-training',
  },
  {
    id: 'business-management',
    title: 'Business Management',
    description: 'Build and grow a profitable spa business',
    topics: ['Financial Planning', 'Marketing Strategies', 'Staff Management', 'Client Retention'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400',
    href: '/learning/business-management',
  },
  {
    id: 'certifications',
    title: 'Certifications',
    description: 'Industry-recognized certifications to advance your career',
    topics: ['Esthetician Training', 'Massage Therapy', 'Lash Tech Certification', 'Advanced Techniques'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400',
    href: '/learning/certifications',
  },
  {
    id: 'webinars',
    title: 'Live Webinars',
    description: 'Interactive online sessions with industry experts',
    topics: ['Monthly Expert Series', 'Product Launches', 'Technique Workshops', 'Q&A Sessions'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400',
    href: '/learning/webinars',
  },
];

const featuredCourses = [
  {
    title: 'Advanced Facial Techniques',
    instructor: 'Sarah Johnson',
    duration: '4 weeks',
    level: 'Advanced',
    students: 1243,
    rating: 4.9,
  },
  {
    title: 'Spa Business Fundamentals',
    instructor: 'Michael Chen',
    duration: '6 weeks',
    level: 'Beginner',
    students: 2156,
    rating: 4.8,
  },
  {
    title: 'Lash Extension Mastery',
    instructor: 'Emma Rodriguez',
    duration: '3 weeks',
    level: 'Intermediate',
    students: 987,
    rating: 4.9,
  },
];

export default function LearningPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Learning', href: '/learning' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 py-20 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Learning Center</h1>
            <p className="mb-8 max-w-2xl text-lg text-purple-100">
              Advance your skills and grow your business with expert-led training, certifications,
              and educational resources.
            </p>
            <Button size="lg" className="bg-white text-brand-purple-600 hover:bg-purple-50">
              Browse All Courses
            </Button>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        {/* Learning Categories */}
        <div className="mb-16">
          <FadeInSection>
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Learning Paths</h2>
          </FadeInSection>
          <div className="grid gap-8 md:grid-cols-2">
            {learningCategories.map((category, index) => (
              <FadeInSection key={category.id} delay={index * 100}>
                <Link
                  href={category.href}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl"
                >
                  <div className="relative h-48">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-2xl font-bold text-gray-900 group-hover:text-brand-purple-600">
                      {category.title}
                    </h3>
                    <p className="mb-4 text-gray-600">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-purple-50 px-3 py-1 text-xs text-brand-purple-700"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>

        {/* Featured Courses */}
        <FadeInSection>
          <div className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Featured Courses</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredCourses.map((course, index) => (
                <div key={index} className="rounded-xl bg-white p-6 shadow-md">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{course.title}</h3>
                  <p className="mb-4 text-sm text-gray-600">By {course.instructor}</p>
                  <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                    <span>{course.duration}</span>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{course.rating}</span>
                    <span className="text-sm text-gray-600">({course.students} students)</span>
                  </div>
                  <Button className="w-full">Enroll Now</Button>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Benefits */}
        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 md:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Why Learn With Us?
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Expert Instructors</h3>
                <p className="text-gray-600">
                  Learn from industry leaders with decades of experience
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Certified Programs</h3>
                <p className="text-gray-600">
                  Earn industry-recognized certificates upon completion
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Learn at Your Pace</h3>
                <p className="text-gray-600">
                  Flexible online courses you can access anytime, anywhere
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
