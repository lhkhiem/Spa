import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import { FiCalendar, FiVideo, FiUsers, FiClock } from 'react-icons/fi';

const upcomingWebinars = [
  {
    id: '1',
    title: 'Monthly Expert Series: Advanced Skincare',
    instructor: 'Dr. Sarah Johnson',
    date: '2025-02-15',
    time: '2:00 PM EST',
    duration: '90 minutes',
    attendees: 250,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400',
    description: 'Join us for an interactive session on advanced skincare techniques.',
  },
  {
    id: '2',
    title: 'Product Launch: New Lash Collection',
    instructor: 'Emma Rodriguez',
    date: '2025-02-20',
    time: '3:00 PM EST',
    duration: '60 minutes',
    attendees: 180,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400',
    description: 'Discover our latest lash extension products and techniques.',
  },
  {
    id: '3',
    title: 'Technique Workshop: Massage Therapy',
    instructor: 'Michael Chen',
    date: '2025-02-25',
    time: '1:00 PM EST',
    duration: '120 minutes',
    attendees: 320,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400',
    description: 'Hands-on workshop for massage therapy professionals.',
  },
  {
    id: '4',
    title: 'Q&A Session: Business Growth Strategies',
    instructor: 'Jennifer Lee',
    date: '2025-03-01',
    time: '4:00 PM EST',
    duration: '60 minutes',
    attendees: 150,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400',
    description: 'Ask questions and get expert advice on growing your spa business.',
  },
];

const topics = [
  'Monthly Expert Series',
  'Product Launches',
  'Technique Workshops',
  'Q&A Sessions',
  'Industry Updates',
  'Live Demonstrations',
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export default function WebinarsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Learning', href: '/learning' },
    { label: 'Live Webinars', href: '/learning/webinars' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-900 to-orange-700 py-20 text-white">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} className="mb-6 text-orange-100" />
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Live Webinars</h1>
            <p className="mb-8 max-w-2xl text-lg text-orange-100">
              Interactive online sessions with industry experts. Join live webinars, ask questions,
              and learn from the best in the business.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Topics */}
        <FadeInSection>
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Webinar Topics</h2>
            <div className="flex flex-wrap gap-3">
              {topics.map((topic, index) => (
                <span
                  key={index}
                  className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Upcoming Webinars */}
        <FadeInSection>
          <div className="mb-12">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Upcoming Webinars</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {upcomingWebinars.map((webinar, index) => (
                <FadeInSection key={webinar.id} delay={index * 100}>
                  <div className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={webinar.image}
                        alt={webinar.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="mb-2 flex items-center gap-2 text-sm">
                          <FiCalendar className="h-4 w-4" />
                          <span>{formatDate(webinar.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FiClock className="h-4 w-4" />
                          <span>{webinar.time} • {webinar.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-orange-600">
                        {webinar.title}
                      </h3>
                      <p className="mb-4 text-sm font-medium text-gray-600">
                        {webinar.instructor}
                      </p>
                      <p className="mb-4 text-sm text-gray-600">{webinar.description}</p>
                      <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiUsers className="h-4 w-4" />
                          <span>{webinar.attendees} đã đăng ký</span>
                        </div>
                      </div>
                      <Button className="w-full">Register Now</Button>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Benefits Section */}
        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-8 md:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Why Join Our Webinars?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-white">
                    <FiVideo className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Live Interaction</h3>
                <p className="text-gray-600">
                  Ask questions and get real-time answers from industry experts
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-white">
                    <FiUsers className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Network with Peers</h3>
                <p className="text-gray-600">
                  Connect with other professionals in the spa and salon industry
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-white">
                    <FiCalendar className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Regular Sessions</h3>
                <p className="text-gray-600">
                  Monthly webinars covering the latest trends and techniques
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}


