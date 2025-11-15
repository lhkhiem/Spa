import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';

export default function PartnershipsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'School Partnerships', href: '/partnerships' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">School Partnerships</h1>
            <p className="max-w-2xl text-lg text-purple-100">
              Empowering the next generation of spa professionals through education and training partnerships.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        <FadeInSection>
          <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Partner with Industry Leaders</h2>
            <p className="mb-6 text-gray-600">
              We work with cosmetology schools, esthetician programs, and massage therapy institutions to provide students with the best products, equipment, and training resources. Our partnerships help educators prepare students for successful careers in the spa and wellness industry.
            </p>
          </div>
        </FadeInSection>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <FadeInSection>
            <div className="rounded-xl bg-white p-6 shadow-md">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Educational Discounts</h3>
              <p className="text-gray-600">
                Special pricing on products and equipment for educational institutions and students.
              </p>
            </div>
          </FadeInSection>
          <FadeInSection delay={100}>
            <div className="rounded-xl bg-white p-6 shadow-md">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Training Resources</h3>
              <p className="text-gray-600">
                Access to product training materials, instructional videos, and curriculum support.
              </p>
            </div>
          </FadeInSection>
          <FadeInSection delay={200}>
            <div className="rounded-xl bg-white p-6 shadow-md">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Product Donations</h3>
              <p className="text-gray-600">
                Support programs through product donations for student practice and competitions.
              </p>
            </div>
          </FadeInSection>
          <FadeInSection delay={300}>
            <div className="rounded-xl bg-white p-6 shadow-md">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Career Support</h3>
              <p className="text-gray-600">
                Help students transition to professional careers with job placement resources.
              </p>
            </div>
          </FadeInSection>
        </div>

        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Interested in Partnering?</h2>
            <p className="mb-6 text-lg text-purple-100">
              Contact us to learn more about our school partnership programs.
            </p>
            <Button href="/contact" size="lg" className="bg-white text-brand-purple-600 hover:bg-purple-50">
              Contact Partnership Team
            </Button>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
