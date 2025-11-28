import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import { FiGift, FiStar, FiTrendingUp, FiAward } from 'react-icons/fi';

export default function RewardsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Good Karma Rewards', href: '/rewards' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-purple-700 py-20 text-white">
        <div className="container-custom">
          <FadeInSection>
            <div className="max-w-3xl">
              <h1 className="mb-4 text-5xl font-bold md:text-6xl">Good Karma Rewards</h1>
              <p className="mb-8 text-xl text-purple-100">
                Earn points on every purchase and unlock exclusive benefits. The more you shop, the
                more you save!
              </p>
              <Button size="lg" className="bg-white text-brand-purple-600 hover:bg-purple-50">
                Join Free Today
              </Button>
            </div>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        {/* How It Works */}
        <FadeInSection>
          <div className="mb-16 text-center">
            <h2 className="mb-12 text-4xl font-bold text-gray-900">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                    <FiGift className="h-10 w-10 text-brand-purple-600" />
                  </div>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">Sign Up Free</h3>
                <p className="text-gray-600">
                  Create your account and automatically join our Good Karma Rewards program. No fees,
                  no hassle.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                    <FiStar className="h-10 w-10 text-brand-purple-600" />
                  </div>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">Earn Points</h3>
                <p className="text-gray-600">
                  Earn 1 point for every $1 spent. Plus bonus points for reviews, referrals, and
                  special promotions.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                    <FiAward className="h-10 w-10 text-brand-purple-600" />
                  </div>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">Redeem Rewards</h3>
                <p className="text-gray-600">
                  Use your points for discounts on future purchases. 100 points = $5 off your order.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Rewards Tiers */}
        <FadeInSection>
          <div className="mb-16">
            <h2 className="mb-8 text-center text-4xl font-bold text-gray-900">Membership Tiers</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Bronze */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-4 text-center">
                  <div className="mb-2 inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-bold text-orange-700">
                    BRONZE
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
                  <p className="text-gray-600">$0 - $999 annual spend</p>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-brand-purple-600">✓</span>
                    <span>Earn 1 point per $1 spent</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-brand-purple-600">✓</span>
                    <span>Birthday reward</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-brand-purple-600">✓</span>
                    <span>Early access to sales</span>
                  </li>
                </ul>
              </div>

              {/* Silver */}
              <div className="relative rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-8 shadow-xl">
                <div className="mb-4 text-center">
                  <div className="mb-2 inline-block rounded-full bg-gray-400 px-4 py-1 text-sm font-bold text-white">
                    SILVER
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                  <p className="text-gray-700">$1,000 - $4,999 annual spend</p>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-brand-purple-600">✓</span>
                    <span>Earn 1.25 points per $1 spent</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-brand-purple-600">✓</span>
                    <span>All Bronze benefits</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-brand-purple-600">✓</span>
                    <span>Exclusive Silver-only deals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-brand-purple-600">✓</span>
                    <span>Priority customer support</span>
                  </li>
                </ul>
              </div>

              {/* Gold */}
              <div className="relative rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 shadow-xl">
                <div className="absolute -right-2 -top-2 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                  BEST VALUE
                </div>
                <div className="mb-4 text-center">
                  <div className="mb-2 inline-block rounded-full bg-yellow-900 px-4 py-1 text-sm font-bold text-white">
                    GOLD
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Elite</h3>
                  <p className="text-gray-800">$5,000+ annual spend</p>
                </div>
                <ul className="space-y-3 text-gray-900">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-purple-900">✓</span>
                    <span className="font-medium">Earn 1.5 points per $1 spent</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-purple-900">✓</span>
                    <span className="font-medium">All Silver benefits</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-purple-900">✓</span>
                    <span className="font-medium">Free expedited shipping</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-purple-900">✓</span>
                    <span className="font-medium">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-purple-900">✓</span>
                    <span className="font-medium">VIP event invitations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Ways to Earn */}
        <FadeInSection>
          <div className="mb-16 rounded-2xl bg-white p-8 shadow-lg md:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              More Ways to Earn Points
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-3 text-4xl font-bold text-brand-purple-600">1x</div>
                <h3 className="mb-2 font-semibold text-gray-900">Every Purchase</h3>
                <p className="text-sm text-gray-600">Earn points on every dollar spent</p>
              </div>
              <div className="text-center">
                <div className="mb-3 text-4xl font-bold text-brand-purple-600">50</div>
                <h3 className="mb-2 font-semibold text-gray-900">Product Reviews</h3>
                <p className="text-sm text-gray-600">50 points per approved review</p>
              </div>
              <div className="text-center">
                <div className="mb-3 text-4xl font-bold text-brand-purple-600">500</div>
                <h3 className="mb-2 font-semibold text-gray-900">Referral Bonus</h3>
                <p className="text-sm text-gray-600">When friends make their first purchase</p>
              </div>
              <div className="text-center">
                <div className="mb-3 text-4xl font-bold text-brand-purple-600">100</div>
                <h3 className="mb-2 font-semibold text-gray-900">Birthday Bonus</h3>
                <p className="text-sm text-gray-600">Special birthday points every year</p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* CTA */}
        <FadeInSection>
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center text-white md:p-12">
            <h2 className="mb-4 text-3xl font-bold">Ready to Start Earning?</h2>
            <p className="mb-8 text-lg text-purple-100">
              Join thousands of spa professionals who are already saving with Good Karma Rewards.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-brand-purple-600 hover:bg-purple-50">
                Create Account
              </Button>
              <Button
                href="/products"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-purple-600"
              >
                Start Shopping
              </Button>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
