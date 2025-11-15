import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';

export default function TermsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Terms of Service</h1>
            <p className="max-w-2xl text-lg text-gray-100">
              Last Updated: January 2025
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        <div className="mx-auto max-w-4xl space-y-8">
          <FadeInSection>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Agreement to Terms</h2>
              <p className="text-gray-600">
                By accessing and using the Universal Companies website and services, you agree to be
                bound by these Terms of Service and all applicable laws and regulations. If you do
                not agree with any of these terms, you are prohibited from using or accessing this
                site.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Professional Use Only</h2>
              <p className="mb-4 text-gray-600">
                Universal Companies sells professional-use products exclusively to licensed
                professionals in the beauty, spa, and wellness industries. By placing an order, you
                represent and warrant that:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-600">
                <li>You are a licensed professional or operating a professional establishment</li>
                <li>Products will be used for professional purposes only</li>
                <li>You will not resell products to unlicensed individuals</li>
                <li>You possess all necessary licenses and permits for your business</li>
              </ul>
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Account Registration</h2>
              <p className="mb-4 text-gray-600">
                To place orders, you must create an account. You agree to:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-600">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Orders and Payment
              </h2>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">Order Acceptance</h3>
              <p className="mb-4 text-gray-600">
                We reserve the right to refuse or cancel any order for any reason, including but not
                limited to product availability, errors in pricing or product information, or
                suspected fraud.
              </p>

              <h3 className="mb-3 text-xl font-semibold text-gray-800">Pricing</h3>
              <p className="mb-4 text-gray-600">
                All prices are in U.S. dollars and are subject to change without notice. We strive
                to provide accurate pricing information, but errors may occur. If we discover an
                error in the price of a product you have ordered, we will notify you and give you
                the option to cancel or proceed at the correct price.
              </p>

              <h3 className="mb-3 text-xl font-semibold text-gray-800">Payment</h3>
              <p className="text-gray-600">
                Payment is due at the time of order placement. We accept major credit cards,
                business checks, and wire transfers for established accounts. All payments must be
                made in U.S. dollars.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Shipping and Delivery
              </h2>
              <p className="mb-4 text-gray-600">
                Shipping costs and delivery times vary based on your location and chosen shipping
                method. While we make every effort to meet estimated delivery dates, we are not
                responsible for delays caused by:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-600">
                <li>Carrier delays or service interruptions</li>
                <li>Weather conditions or natural disasters</li>
                <li>Customs clearance for international orders</li>
                <li>Incorrect or incomplete shipping addresses</li>
              </ul>
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Returns and Refunds
              </h2>
              <p className="mb-4 text-gray-600">
                We offer a 30-day return policy on most products. See our Shipping & Returns page
                for complete details. Refunds will be issued to the original payment method within
                7-10 business days of receiving the return.
              </p>
              <p className="text-gray-600">
                Some products cannot be returned for health and safety reasons. These include opened
                skin care products, wax, and other items marked as final sale.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Intellectual Property
              </h2>
              <p className="text-gray-600">
                All content on this website, including text, graphics, logos, images, and software,
                is the property of Universal Companies or its licensors and is protected by
                copyright, trademark, and other intellectual property laws. You may not reproduce,
                distribute, modify, or create derivative works without our express written
                permission.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Limitation of Liability
              </h2>
              <p className="text-gray-600">
                To the fullest extent permitted by law, Universal Companies shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages arising from
                your use of our website or products. Our total liability for any claim related to
                our services shall not exceed the amount you paid for the product or service giving
                rise to the claim.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Governing Law</h2>
              <p className="text-gray-600">
                These Terms of Service shall be governed by and construed in accordance with the
                laws of the State of Wisconsin, without regard to its conflict of law provisions.
                Any disputes arising from these terms shall be resolved in the courts of Marathon
                County, Wisconsin.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Changes to Terms
              </h2>
              <p className="text-gray-600">
                We reserve the right to modify these Terms of Service at any time. Changes will be
                effective immediately upon posting to the website. Your continued use of the website
                after changes are posted constitutes your acceptance of the modified terms.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Contact Information</h2>
              <p className="mb-4 text-gray-600">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Email:</strong> legal@universalcompanies.com
                </p>
                <p>
                  <strong>Phone:</strong> 1-800-558-5571
                </p>
                <p>
                  <strong>Mail:</strong> Universal Companies, 3232 East Main St, Wausau, WI 54403
                </p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
}
