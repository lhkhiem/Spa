import Image from 'next/image';
import Link from 'next/link';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import Button from '@/components/ui/Button/Button';
import ParallaxSection from '@/components/ui/ParallaxSection/ParallaxSection';

export const metadata = {
  title: 'About Us - Universal Companies',
  description: 'Learn about Universal Companies, the spa industry\'s top distributor for over 40 years.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with TRUE Parallax Effect */}
      <ParallaxSection 
        backgroundImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1200"
        minHeight="tall"
        overlay={true}
        overlayOpacity={50}
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            "Our business is good<br />
            when your business is better."
          </h1>
        </div>
      </ParallaxSection>

      {/* Welcome Section */}
      <FadeInSection delay={200}>
        <section className="bg-gradient-to-br from-gray-50 to-purple-50 py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold text-gray-900">Welcome, Spa Professionals!</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Are you seeking new adventure? If so, we're excited to meet you. If you're
                    already a customer, we're committed to ensuring you have what you need to run your
                    business together. In one place: making your life easier.
                  </p>
                  <p>
                    The Universal Companies website is designed to help you do just that, with its
                    easy online shopping tools and a growing number of marketing and business
                    resources too--directly over the or in depth on our blogs and maintaining in hands-on
                    learning and courses.
                  </p>
                  <p>
                    Be sure to bookmark{' '}
                    <Link href="/" className="text-brand-purple-600 hover:underline">
                      UniversalCompanies.com
                    </Link>{' '}
                    and visit often. And be sure to stay on
                    top of the latest industry trends and opportunities,{' '}
                    <Link href="/learning" className="text-brand-purple-600 hover:underline">
                      sign up today for our business
                    </Link>{' '}
                    email newsletter.
                  </p>
                  <p>
                    You should do so a central place for you and your clients, so why not set us at
                    least you'll like as well satisfy?
                  </p>
                </div>
                <div className="mt-8">
                  <Button size="lg">Learn More</Button>
                </div>
              </div>

              <div className="relative rounded-lg bg-white p-8 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400"
                  alt="Marti Harrington, President & Chairman"
                  width={600}
                  height={400}
                  className="mb-4 rounded-lg"
                />
                <div className="text-center">
                  <h3 className="mb-1 text-xl font-semibold text-gray-900">Marti Harrington</h3>
                  <p className="text-gray-600">President & Chairman</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* The UCo Difference */}
      <FadeInSection delay={300}>
        <section className="py-16">
          <div className="container-custom">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              The UCo Difference
            </h2>
            <p className="mb-12 text-center text-lg text-gray-600">
              Us support differentiation? Yes. Because everything we do is inspired by your needs.
              Work hard to support you.
            </p>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {/* We are a full solutions provider */}
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200">
                    <svg className="h-10 w-10 text-brand-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  We are a full solutions provider.
                </h3>
                <p className="text-gray-600">
                  We're able to provide support for everything from all over the business when it
                  fulfilling a one-time order for a product.
                </p>
              </div>

              {/* We read labels */}
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">We read labels.</h3>
                <p className="text-gray-600">
                  We review and evaluate the labels of every single item we sell to ensure it
                  is labeled ingredient accurately. We mean the words "natural" and "organic"
                  through health use. We want ingredients.
                </p>
              </div>

              {/* We train and educate */}
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                    <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">We train and educate.</h3>
                <p className="text-gray-600">
                  We not only promote courses product training, but we stay up-to-date and
                  beyond by offering advanced education to help our customers advance
                  professional and technical skills. We're committed to professional development
                  and job security for spa professionals.
                </p>
              </div>

              {/* We are staffed by pros */}
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-pink-200">
                    <svg className="h-10 w-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  We are staffed by pros.
                </h3>
                <p className="text-gray-600">
                  Many on our staff, including but not center representatives, are
                  licensed professionals. They provide a strong knowledge of our
                  products and services, many also have first-hand experience with them and
                  can help you learn and understand what works best for you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Giving Back */}
      <FadeInSection delay={100}>
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <Image
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400"
                  alt="Giving Back"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div>
                <h2 className="mb-6 text-3xl font-bold text-gray-900">Giving Back</h2>
                <p className="mb-4 text-gray-700">
                  We believe that success is about more than business. It's about making a positive
                  impact. That's why we proudly support local businesses and national organizations
                  through monetary initiatives.
                </p>
                <p className="mb-4 text-gray-700">
                  Each year we take an incredible group of spa professionals on field trips to a
                  designated location worldwide to volunteer resources for treatment needs. Since
                  September 2008, we've contributed our 250+ to help in the fight against cancer.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2 text-brand-purple-600">•</span>
                    <span>
                      <strong>Community Care:</strong> Know local women your drivers to finding by
                      free collections and food pantry donations, work closely to further neighbors
                      efforts to help in homeless.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-brand-purple-600">•</span>
                    <span>
                      <strong>Education & Organizations:</strong> To support our young
                      doctors, schools, we provide on campus doctors, schools them provide well and
                      food supply items for students.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Timeline */}
      <FadeInSection delay={200}>
        <section className="py-16">
          <div className="container-custom">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Timeline</h2>
            <p className="mb-12 text-center text-lg text-gray-600">
              For over 40 years, we've enjoyed helping our customers grow their businesses.
            </p>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-brand-purple-600">1982</div>
                <p className="text-gray-700">
                  Universal Companies was established in 1982, when Aluminum Models Worldwide a small,
                  a Philadelphia-based beauty supply company. A Pennsylvania-based company manufactured a
                  small line of nail products.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-brand-purple-600">1992</div>
                <p className="text-gray-700">
                  In 1992, Universal America published its first catalog, a 40-page book that
                  highlighted everything they earned in one piece. the
                  thought Informed the world of our professional product availability
                  expanding benefits of how products.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-brand-purple-600">Now</div>
                <p className="text-gray-700">
                  Had growth continue today. Universal
                  companies continues support more than 84,000 spa
                  professionals in 47 countries. From the
                  UCo Learning courses available and 5-star
                  nationwide success is in the heart of
                  everything we do.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
