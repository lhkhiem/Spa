import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import { FiTruck, FiPackage, FiRotateCcw, FiClock } from 'react-icons/fi';

export default function ShippingPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shipping & Return', href: '/shipping' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Shipping & Return Policy</h1>
            <p className="max-w-2xl text-lg text-purple-100">
              Fast, reliable shipping and hassle-free returns. We make it easy to get the products
              you need.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        {/* Shipping Benefits */}
        <div className="mb-12 grid gap-6 md:grid-cols-4">
          <FadeInSection>
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <FiTruck className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders $749+</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={100}>
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <FiPackage className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">Low Rate Shipping</h3>
              <p className="text-sm text-gray-600">$4.99 on orders $199+</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={200}>
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <FiClock className="h-8 w-8 text-brand-purple-600" />
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">Fast Processing</h3>
              <p className="text-sm text-gray-600">Ships within 1-2 business days</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={300}>
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <FiRotateCcw className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
          </FadeInSection>
        </div>

        {/* Shipping Information */}
        <div className="mb-12">
          <FadeInSection>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Shipping Information</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    Shipping Rates & Delivery Times
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Order Total
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Shipping Cost
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Delivery Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900">$0 - $198.99</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            Calculated at checkout
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">3-7 business days</td>
                        </tr>
                        <tr className="bg-purple-50">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            $199 - $748.99
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-brand-purple-600">
                            $4.99
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">3-7 business days</td>
                        </tr>
                        <tr className="bg-green-50">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            $749 or more
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-green-600">
                            FREE SHIPPING
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">3-7 business days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    Expedited Shipping Options
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-purple-600" />
                      <span>
                        <strong className="text-gray-900">2-Day Express:</strong> Available for an
                        additional $29.99
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-purple-600" />
                      <span>
                        <strong className="text-gray-900">Overnight:</strong> Available for an
                        additional $49.99
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-purple-600" />
                      <span>
                        Select your preferred shipping method during checkout. Expedited options
                        must be placed before 12 PM EST for same-day processing.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    International Shipping
                  </h3>
                  <p className="mb-3 text-gray-600">
                    We ship to select international destinations. International shipping rates and
                    delivery times vary by location.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-purple-600" />
                      <span>Customs fees and import duties are the responsibility of the customer</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-purple-600" />
                      <span>Delivery times: 7-21 business days depending on destination</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-purple-600" />
                      <span>Contact us for a shipping quote before placing your international order</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>

        {/* Return Policy */}
        <div>
          <FadeInSection>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Return Policy</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">30-Day Return Guarantee</h3>
                  <p className="text-gray-600">
                    We want you to be completely satisfied with your purchase. If you're not happy
                    for any reason, you can return most items within 30 days of delivery for a full
                    refund or exchange.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">Return Requirements</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-purple-600" />
                      <span>Items must be unused, unopened, and in original packaging</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-purple-600" />
                      <span>Returns must be initiated within 30 days of delivery</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-purple-600" />
                      <span>Include all original packaging, manuals, and accessories</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-purple-600" />
                      <span>A Return Authorization (RA) number is required for all returns</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">Non-Returnable Items</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
                      <span>Opened personal care products and cosmetics (for hygiene reasons)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
                      <span>Custom or personalized items</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
                      <span>Final sale or clearance items (marked as such)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
                      <span>Gift cards and e-certificates</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">How to Initiate a Return</h3>
                  <ol className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-purple-600 text-sm font-semibold text-white">
                        1
                      </span>
                      <span>
                        <strong className="text-gray-900">Contact Us:</strong> Call 1-800-123-4567
                        or email returns@universalcompanies.com to request a Return Authorization
                        (RA) number
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-purple-600 text-sm font-semibold text-white">
                        2
                      </span>
                      <span>
                        <strong className="text-gray-900">Package Your Items:</strong> Securely
                        pack the items in their original packaging with all accessories
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-purple-600 text-sm font-semibold text-white">
                        3
                      </span>
                      <span>
                        <strong className="text-gray-900">Ship the Return:</strong> Use the prepaid
                        return label we provide or ship at your own expense to the address provided
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-purple-600 text-sm font-semibold text-white">
                        4
                      </span>
                      <span>
                        <strong className="text-gray-900">Receive Your Refund:</strong> Once we
                        receive and inspect your return, we'll process your refund within 5-7
                        business days
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="rounded-lg bg-purple-50 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Questions about returns?
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Our customer support team is here to help make your return as easy as possible.
                  </p>
                  <a
                    href="/contact"
                    className="text-brand-purple-600 hover:text-brand-purple-700"
                  >
                    Contact Support →
                  </a>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
}
