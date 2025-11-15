import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import ProductCard from '@/components/product/ProductCard/ProductCard';
import { fetchProducts } from '@/lib/api/products';
import { buildFromApiOrigin } from '@/config/site';
import type { ProductDTO } from '@/lib/api/products';

const FALLBACK_IMAGE = '/images/placeholder-product.jpg';

const formatPrice = (value: any) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const resolveImageUrl = (value: any) => {
  if (!value || typeof value !== 'string') {
    return FALLBACK_IMAGE;
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return buildFromApiOrigin(value);
};

const dealCategories = [
  { id: 'all', name: 'All Deals', count: 0 },
  { id: 'clearance', name: 'Clearance', count: 0 },
  { id: 'weekly-specials', name: 'Weekly Specials', count: 0 },
  { id: 'bulk-discounts', name: 'Bulk Discounts', count: 0 },
  { id: 'new-customer', name: 'New Customer Offers', count: 0 },
  { id: 'seasonal', name: 'Seasonal Sales', count: 0 },
];

const banners = [
  {
    title: 'Flash Sale - 50% Off Select Items',
    description: "Limited quantities available. Hurry before they're gone!",
    cta: 'Shop Flash Sale',
    href: '/products?sale=flash',
    bgColor: 'from-red-600 to-pink-600',
  },
  {
    title: 'Free Shipping on Orders $199+',
    description: 'Stock up and save on shipping. Offer valid through this week.',
    cta: 'Shop Now',
    href: '/products',
    bgColor: 'from-purple-600 to-blue-600',
  },
  {
    title: 'Bulk Buy & Save Up to 40%',
    description: 'The more you buy, the more you save. Perfect for busy salons.',
    cta: 'View Bulk Deals',
    href: '/products?category=bulk-discounts',
    bgColor: 'from-green-600 to-teal-600',
  },
];

export default async function DealsPage() {
  // Fetch products on sale
  const productsResponse = await fetchProducts({
    pageSize: 8,
    special: 'on-sale',
    sort: 'featured',
  });

  const featuredDeals = productsResponse.data.slice(0, 8).map((product: ProductDTO) => {
    const hasDiscount =
      product.comparePrice !== null &&
      product.comparePrice !== undefined &&
      product.comparePrice > product.price;

    const primaryPrice = hasDiscount ? product.comparePrice ?? product.price : product.price;
    const salePrice = hasDiscount ? product.price : undefined;

    const isVariant = product.isVariant ?? false;
    const productId = isVariant && product.variantId ? product.variantId : product.id;

    let badge: string | undefined;
    if (product.isBestSeller) {
      badge = 'Best Seller';
    } else if (hasDiscount) {
      badge = 'Sale';
    } else if (product.isFeatured) {
      badge = 'Featured';
    }

    return {
      id: productId,
      productId: product.baseProductId ?? product.id,
      variantId: isVariant ? product.variantId : undefined,
      slug: product.slug,
      name: product.name,
      price: formatPrice(primaryPrice),
      salePrice: salePrice ? formatPrice(salePrice) : undefined,
      image: resolveImageUrl(product.thumbnailUrl),
      rating: product.rating ?? 0,
      reviewCount: product.reviewCount ?? 0,
      badge,
      inStock: product.stock > 0,
    };
  });

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Save Now!', href: '/deals' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-pink-600 py-16 text-white">
        <div className="container-custom">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Save Now!</h1>
            <p className="mb-8 max-w-2xl text-lg text-red-100">
              Discover amazing deals on professional spa and salon products. Limited time offers,
              clearance items, and exclusive bundles - all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                Shop All Deals
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-red-600"
              >
                Sign Up for Deal Alerts
              </Button>
            </div>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        {/* Promotional Banners */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {banners.map((banner, index) => (
            <FadeInSection key={index} delay={index * 100}>
              <Link
                href={banner.href}
                className={`group block rounded-2xl bg-gradient-to-br ${banner.bgColor} p-6 text-white shadow-lg transition-all hover:shadow-2xl`}
              >
                <h3 className="mb-2 text-xl font-bold">{banner.title}</h3>
                <p className="mb-4 text-sm opacity-90">{banner.description}</p>
                <span className="inline-flex items-center font-semibold">
                  {banner.cta}
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            </FadeInSection>
          ))}
        </div>

        {/* Deal Categories */}
        <FadeInSection>
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {dealCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?special=on-sale&category=${category.id}`}
                  className="rounded-full bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-md transition-all hover:bg-brand-purple-600 hover:text-white hover:shadow-lg"
                >
                  {category.name} ({category.count})
                </Link>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Featured Deals */}
        <div className="mb-12">
          <FadeInSection>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Today's Best Deals</h2>
              <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600">
                ⏰ Ending Soon
              </div>
            </div>
          </FadeInSection>
          {featuredDeals.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredDeals.map((product, index) => (
                <FadeInSection key={product.id} delay={index * 50}>
                  <ProductCard product={product} />
                </FadeInSection>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-12 text-center">
              <p className="text-gray-600">No deals available at the moment. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Deal of the Week */}
        {featuredDeals.length > 0 && (
          <FadeInSection>
            <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-purple-700 shadow-2xl">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={featuredDeals[0]?.image ?? FALLBACK_IMAGE}
                    alt="Deal of the Week"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 text-white md:p-12">
                  <div className="mb-4 inline-block rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-purple-900">
                    DEAL OF THE WEEK
                  </div>
                  <h2 className="mb-4 text-3xl font-bold">{featuredDeals[0]?.name}</h2>
                  <p className="mb-6 text-lg text-purple-100">
                    Limited quantities available - shop now before they're gone!
                  </p>
                  <div className="mb-6">
                    {featuredDeals[0]?.salePrice && (
                      <>
                        <span className="mr-4 text-4xl font-bold">
                          ${featuredDeals[0].salePrice}
                        </span>
                        <span className="text-xl text-purple-300 line-through">
                          ${featuredDeals[0].price}
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    href={`/products/${featuredDeals[0]?.slug}`}
                    size="lg"
                    className="bg-yellow-400 text-purple-900 hover:bg-yellow-300"
                  >
                    Claim This Deal
                  </Button>
                </div>
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Newsletter Signup */}
        <FadeInSection>
          <div className="rounded-2xl bg-white p-8 text-center shadow-lg md:p-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Never Miss a Deal</h2>
            <p className="mb-6 text-gray-600">
              Sign up for our newsletter and be the first to know about exclusive offers, flash
              sales, and new product launches.
            </p>
            <div className="mx-auto flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-purple-500 focus:outline-none focus:ring-2 focus:ring-brand-purple-500/20"
              />
              <Button size="lg">Subscribe</Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
            </p>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
