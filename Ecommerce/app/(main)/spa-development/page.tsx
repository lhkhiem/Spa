import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';

export default function SpaDevPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Spa Development', href: '/spa-development' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Spa Development Services</h1>
            <p className="max-w-2xl text-lg text-purple-100">
              From concept to reality - we help you build, launch, and grow your successful spa business.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />
        
        <FadeInSection>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Complete Spa Development Solutions
            </h2>
            <p className="mx-auto max-w-3xl text-gray-600">
              Whether you're opening your first spa or expanding an existing business, our team provides comprehensive support every step of the way. For detailed information about our full range of spa development services, visit our dedicated Services page.
            </p>
            <Button href="/services" size="lg" className="mt-6">
              View All Spa Development Services
            </Button>
          </div>
        </FadeInSection>

        <div className="grid gap-8 md:grid-cols-3">
          <FadeInSection>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Dream It</h3>
              <p className="mb-4 text-gray-600">
                Space planning, treatment menu development, and equipment sourcing to bring your vision to life.
              </p>
              <Button href="/services#dream-it" variant="outline">Learn More</Button>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Build It</h3>
              <p className="mb-4 text-gray-600">
                Installation, setup, testing, and finishing touches to create the perfect spa environment.
              </p>
              <Button href="/services#build-it" variant="outline">Learn More</Button>
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Run It</h3>
              <p className="mb-4 text-gray-600">
                Staff training, ongoing support, and product restocking to ensure long-term success.
              </p>
              <Button href="/services#run-it" variant="outline">Learn More</Button>
            </div>
          </FadeInSection>
        </div>

        <FadeInSection>
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Ready to Build Your Dream Spa?</h2>
            <p className="mb-6 text-lg text-purple-100">
              Schedule a free consultation with our spa development experts.
            </p>
            <Button href="/contact" size="lg" className="bg-white text-brand-purple-600 hover:bg-purple-50">
              Schedule Consultation
            </Button>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
