import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';

export default function CareersPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Careers', href: '/careers' },
  ];

  const openPositions = [
    {
      title: 'Spa Consultant',
      department: 'Sales',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Product Specialist',
      department: 'Sales',
      location: 'New York, NY',
      type: 'Full-time',
    },
    {
      title: 'Customer Support Representative',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Warehouse Associate',
      department: 'Operations',
      location: 'New York, NY',
      type: 'Full-time',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Careers at Universal Companies</h1>
            <p className="max-w-2xl text-lg text-purple-100">
              Join our team and help shape the future of the spa and wellness industry.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        <FadeInSection>
          <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Why Work With Us?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-brand-purple-600">Great Benefits</h3>
                <p className="text-gray-600">
                  Comprehensive health insurance, 401(k), paid time off, and employee discounts.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-brand-purple-600">Growth Opportunities</h3>
                <p className="text-gray-600">
                  Professional development programs and clear career advancement paths.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-brand-purple-600">Positive Culture</h3>
                <p className="text-gray-600">
                  Collaborative environment where innovation and creativity are encouraged.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Open Positions</h2>
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <div key={index} className="rounded-lg bg-white p-6 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900">{position.title}</h3>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{position.department}</span>
                        <span>•</span>
                        <span>{position.location}</span>
                        <span>•</span>
                        <span>{position.type}</span>
                      </div>
                    </div>
                    <Button href="/contact">Apply Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Don't See the Right Role?</h2>
            <p className="mb-6 text-lg text-purple-100">
              Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button href="/contact" size="lg" className="bg-white text-brand-purple-600 hover:bg-purple-50">
              Send Resume
            </Button>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
