import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import { FiChevronDown } from 'react-icons/fi';

const faqCategories = [
  {
    id: 'orders',
    title: 'Orders & Shipping',
    faqs: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-7 business days. We offer free shipping on orders over $749, and $4.99 shipping on orders over $199. Expedited shipping options (2-day and overnight) are also available.',
      },
      {
        question: 'How can I track my order?',
        answer: "Once your order ships, you'll receive a tracking number via email. You can also check your order status by logging into your account and viewing your order history.",
      },
      {
        question: 'Can I change or cancel my order?',
        answer: 'Orders can be modified or cancelled within 2 hours of placement. After that, please contact customer service at 1-800-123-4567 for assistance.',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to select international destinations. International shipping rates and delivery times vary by location. Contact us for a quote before placing your order.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    faqs: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy on most items. Products must be unused, unopened, and in original packaging. A Return Authorization (RA) number is required.',
      },
      {
        question: 'How do I initiate a return?',
        answer: "Contact us at 1-800-123-4567 or email returns@universalcompanies.com to request an RA number. We'll provide instructions and a prepaid return label if applicable.",
      },
      {
        question: 'When will I receive my refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive and inspect your return. The refund will be issued to your original payment method.',
      },
      {
        question: 'Can I exchange an item?',
        answer: "Yes! When requesting your RA number, let us know you'd like an exchange. We'll ship the replacement item as soon as we receive your return.",
      },
    ],
  },
  {
    id: 'products',
    title: 'Products & Pricing',
    faqs: [
      {
        question: 'Are your products professional-grade?',
        answer: 'Yes, all products are professional-grade and used by licensed spa and salon professionals. We only carry trusted brands and rigorously test our products.',
      },
      {
        question: 'Do you offer bulk discounts?',
        answer: 'Yes! We offer bulk pricing on many items. The more you buy, the more you save. Look for "Bulk Buy & Save" badges on product pages or contact us for custom quotes.',
      },
      {
        question: 'How do I know which products are right for my spa?',
        answer: 'Our spa consultants are here to help! Contact us for personalized product recommendations based on your services, budget, and business needs.',
      },
      {
        question: 'Are products tested on animals?',
        answer: 'We carry many cruelty-free and vegan product lines. Look for certification badges on product pages, or filter by "Cruelty-Free" in our product search.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & Payment',
    faqs: [
      {
        question: 'Do I need an account to place an order?',
        answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, and earn Good Karma Rewards points.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and offer financing options through our partners.',
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Absolutely. We use industry-standard SSL encryption to protect your payment information. We never store complete credit card numbers.',
      },
      {
        question: 'Do you offer financing?',
        answer: 'Yes! We offer flexible financing options for qualifying purchases. Learn more on our Financing page or contact us for details.',
      },
    ],
  },
  {
    id: 'services',
    title: 'Spa Development & Services',
    faqs: [
      {
        question: 'What spa development services do you offer?',
        answer: 'We offer comprehensive spa development services including space planning, treatment menu development, equipment sourcing, installation support, staff training, and ongoing consultation.',
      },
      {
        question: 'How much does spa development cost?',
        answer: 'Costs vary based on your specific needs and project scope. Contact us for a free consultation and custom quote.',
      },
      {
        question: 'Do you provide training for new products?',
        answer: 'Yes! We offer product training, both online and in-person. Many of our brand partners also provide certification programs.',
      },
      {
        question: 'Can you help with equipment installation?',
        answer: 'Absolutely. Our team can coordinate equipment delivery, installation, and testing to ensure everything is set up correctly.',
      },
    ],
  },
];

export default function FAQsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'FAQs', href: '/faqs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Frequently Asked Questions</h1>
            <p className="max-w-2xl text-lg text-purple-100">
              Find answers to common questions about orders, shipping, returns, products, and more.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        {/* Quick Links */}
        <FadeInSection>
          <div className="mb-12 rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Links</h2>
            <div className="flex flex-wrap gap-3">
              {faqCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-brand-purple-700 transition-all hover:bg-brand-purple-600 hover:text-white"
                >
                  {category.title}
                </a>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <FadeInSection key={category.id} delay={categoryIndex * 100}>
              <div id={category.id}>
                <h2 className="mb-6 text-3xl font-bold text-gray-900">{category.title}</h2>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <details
                      key={faqIndex}
                      className="group rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg"
                    >
                      <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-900">
                        <span>{faq.question}</span>
                        <FiChevronDown className="h-5 w-5 text-brand-purple-600 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="mt-4 text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>

        {/* Contact CTA */}
        <FadeInSection>
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center text-white md:p-12">
            <h2 className="mb-4 text-3xl font-bold">Still Have Questions?</h2>
            <p className="mb-6 text-lg text-purple-100">
              Our customer support team is here to help. Contact us anytime!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="rounded-lg bg-white px-8 py-3 font-semibold text-brand-purple-600 transition-all hover:bg-purple-50"
              >
                Contact Support
              </a>
              <a
                href="tel:1-800-123-4567"
                className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-brand-purple-600"
              >
                Call 1-800-123-4567
              </a>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
