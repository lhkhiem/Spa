import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';

export default function PrivacyPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Privacy Policy', href: '/privacy' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Privacy Policy</h1>
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
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Introduction</h2>
              <p className="mb-4 text-gray-600">
                At Universal Companies ("we," "our," or "us"), we are committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website and use our services.
              </p>
              <p className="text-gray-600">
                Please read this privacy policy carefully. If you do not agree with the terms of
                this privacy policy, please do not access the site.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Information We Collect</h2>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                Personal Information
              </h3>
              <p className="mb-4 text-gray-600">
                We may collect personal information that you provide to us, including:
              </p>
              <ul className="mb-6 list-inside list-disc space-y-2 text-gray-600">
                <li>Name and contact information (email address, phone number, mailing address)</li>
                <li>Business information (company name, tax ID, professional license)</li>
                <li>Account credentials (username, password)</li>
                <li>Payment information (credit card details, billing address)</li>
                <li>Order history and preferences</li>
              </ul>

              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                Automatically Collected Information
              </h3>
              <p className="mb-4 text-gray-600">
                When you visit our website, we automatically collect certain information, including:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-600">
                <li>IP address and browser information</li>
                <li>Device information and operating system</li>
                <li>Pages viewed and time spent on pages</li>
                <li>Referring website and navigation paths</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              <p className="mb-4 text-gray-600">We use the information we collect to:</p>
              <ul className="list-inside list-disc space-y-2 text-gray-600">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your account and orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Sharing Your Information</h2>
              <p className="mb-4 text-gray-600">
                We may share your information with:
              </p>
              <ul className="mb-6 list-inside list-disc space-y-2 text-gray-600">
                <li>
                  <strong>Service Providers:</strong> Third-party vendors who perform services on
                  our behalf (payment processing, shipping, email delivery)
                </li>
                <li>
                  <strong>Business Partners:</strong> Manufacturers and distributors of products we
                  sell
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a merger, sale, or
                  acquisition
                </li>
              </ul>
              <p className="text-gray-600">
                We do not sell your personal information to third parties for their marketing
                purposes.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Cookies and Tracking</h2>
              <p className="mb-4 text-gray-600">
                We use cookies and similar tracking technologies to improve your browsing experience.
                You can control cookies through your browser settings, though disabling cookies may
                limit your ability to use certain features of our website.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Your Rights and Choices</h2>
              <p className="mb-4 text-gray-600">You have the right to:</p>
              <ul className="list-inside list-disc space-y-2 text-gray-600">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Disable cookies through your browser settings</li>
              </ul>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate technical and organizational measures to protect your
                personal information. However, no electronic transmission or storage is 100% secure,
                and we cannot guarantee absolute security.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Contact Us</h2>
              <p className="mb-4 text-gray-600">
                If you have questions about this Privacy Policy or our privacy practices, please
                contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Email:</strong> privacy@universalcompanies.com
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
