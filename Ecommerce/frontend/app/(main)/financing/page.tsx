import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';

export default function FinancingPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Financing', href: '/financing' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Flexible Financing Options</h1>
            <p className="max-w-2xl text-lg text-purple-100">
              Grow your spa business now and pay over time with our flexible financing solutions.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        <FadeInSection>
          <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Why Finance Your Purchase?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-brand-purple-600">
                  Preserve Cash Flow
                </h3>
                <p className="text-gray-600">
                  Keep working capital available for daily operations and unexpected expenses.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-brand-purple-600">
                  Affordable Payments
                </h3>
                <p className="text-gray-600">
                  Spread the cost over time with monthly payments that fit your budget.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-brand-purple-600">Quick Approval</h3>
                <p className="text-gray-600">
                  Fast application process with decisions in as little as 24 hours.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="mb-12">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Financing Options</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white p-8 shadow-lg">
                <div className="mb-4 inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-bold text-brand-purple-600">
                  EQUIPMENT FINANCING
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Equipment Lease or Purchase
                </h3>
                <ul className="mb-6 space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-brand-purple-600">✓</span>
                    <span>Finance equipment purchases from $5,000 to $250,000</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-brand-purple-600">✓</span>
                    <span>Terms from 12 to 60 months</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-brand-purple-600">✓</span>
                    <span>Competitive interest rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-brand-purple-600">✓</span>
                    <span>$1 buyout option available</span>
                  </li>
                </ul>
                <Button href="/contact" className="w-full">
                  Apply Now
                </Button>
              </div>

              <div className="rounded-xl bg-white p-8 shadow-lg">
                <div className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-bold text-green-700">
                  BUSINESS LINE OF CREDIT
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Revolving Credit Line
                </h3>
                <ul className="mb-6 space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-green-600">✓</span>
                    <span>Credit lines up to $100,000</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-green-600">✓</span>
                    <span>Use for inventory, supplies, and equipment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-green-600">✓</span>
                    <span>Reusable as you pay down the balance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-green-600">✓</span>
                    <span>Fast approval process</span>
                  </li>
                </ul>
                <Button href="/contact" className="w-full">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="mb-12 rounded-xl bg-purple-50 p-8">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">How to Apply</h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple-600 text-xl font-bold text-white">
                    1
                  </div>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">Contact Us</h4>
                <p className="text-sm text-gray-600">Speak with a financing specialist</p>
              </div>
              <div className="text-center">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple-600 text-xl font-bold text-white">
                    2
                  </div>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">Submit Application</h4>
                <p className="text-sm text-gray-600">Quick online application</p>
              </div>
              <div className="text-center">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple-600 text-xl font-bold text-white">
                    3
                  </div>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">Get Approved</h4>
                <p className="text-sm text-gray-600">Decision within 24-48 hours</p>
              </div>
              <div className="text-center">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple-600 text-xl font-bold text-white">
                    4
                  </div>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">Start Shopping</h4>
                <p className="text-sm text-gray-600">Use your financing to purchase</p>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mb-6 text-lg text-purple-100">
              Contact our financing team to discuss your options and find the perfect solution for
              your business.
            </p>
            <Button href="/contact" size="lg" className="bg-white text-brand-purple-600 hover:bg-purple-50">
              Contact Financing Team
            </Button>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
