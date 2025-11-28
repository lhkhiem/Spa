import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
  noIndex?: boolean;
}

export function generateSEO({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url,
  type = 'website',
  keywords = [],
  noIndex = false,
}: SEOProps): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const fullImage = image?.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: siteConfig.name }],
    openGraph: {
      type: type === 'product' ? 'website' : type,
      locale: 'en_US',
      url: fullUrl,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

// Generate product structured data
export function generateProductStructuredData(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0]?.url,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name,
    },
    offers: {
      '@type': 'Offer',
      price: product.salePrice || product.price,
      priceCurrency: 'VND',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${siteConfig.url}/products/${product.slug}`,
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        }
      : undefined,
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}
