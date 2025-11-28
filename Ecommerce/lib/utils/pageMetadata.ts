import { Metadata } from 'next';
import { getApiUrl, buildFromApiOrigin } from '@/config/site';

export interface PageMetadataData {
  title: string;
  description: string;
  ogImage: string;
  keywords: string[];
  headScript?: string;
  bodyScript?: string;
}

/**
 * Fetch page metadata from CMS Settings
 * @param path - Page path (e.g., '/products', '/posts/digital-marketing-guide')
 * @returns Page metadata or null if not found
 */
export async function getPageMetadataFromCMS(
  path: string
): Promise<PageMetadataData | null> {
  try {
    const apiUrl = getApiUrl();
    
    // Normalize path
    let normalizedPath = path;
    
    // Ensure path starts with /
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath;
    }
    
    // Remove query params (Facebook/LinkedIn will strip query params when sharing)
    if (normalizedPath.includes('?')) {
      normalizedPath = normalizedPath.split('?')[0];
    }
    
    // Remove trailing slash (except for root)
    normalizedPath = normalizedPath.replace(/\/+$/, '') || '/';
    
    // For API call, remove leading slash (Express route expects path without leading slash)
    const apiPath = normalizedPath === '/' ? '' : normalizedPath.substring(1);
    
    // Fetch metadata from CMS
    const url = `${apiUrl}/public/page-metadata/${apiPath}`;
    console.log('[getPageMetadataFromCMS] Original path:', path, '→ Normalized:', normalizedPath, '→ API path:', apiPath);
    
    const response = await fetch(url, {
      cache: 'no-store', // No caching - always fetch fresh data
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('[getPageMetadataFromCMS] API error:', response.status, errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('[getPageMetadataFromCMS] Received data for', path, ':', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('[getPageMetadataFromCMS] Error:', error);
    return null;
  }
}

/**
 * Generate Next.js Metadata from CMS data or fallback
 * @param data - Metadata from CMS (can be null)
 * @param path - Page path
 * @param fallback - Fallback metadata if CMS doesn't have data
 * @returns Next.js Metadata object
 */
export function generatePageMetadata(
  data: PageMetadataData | null,
  path: string,
  fallback: { title: string; description: string; ogImage?: string }
): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://banyco.vn';
  const fullUrl = `${siteUrl}${path}`;
  
  // Use CMS data if available, otherwise use fallback
  const title = data?.title || fallback.title;
  const description = data?.description || fallback.description;
  
  console.log('[generatePageMetadata]', path, '- Using title:', title, '- CMS data:', data ? 'Yes' : 'No');
  // Handle empty string from DB - treat as no image
  const ogImage = (data?.ogImage && data.ogImage.trim() !== '') 
    ? data.ogImage 
    : (fallback.ogImage || '/images/banyco-logo.jpg');
  
  // Build full image URL
  // If ogImage starts with /uploads, it's from CMS API, use buildFromApiOrigin
  // Otherwise, if it's already a full URL, use it as is
  // Otherwise, treat it as a site-relative path
  const imageUrl = ogImage.startsWith('http') 
    ? ogImage 
    : ogImage.startsWith('/uploads')
    ? buildFromApiOrigin(ogImage)
    : `${siteUrl}${ogImage}`;
  
  return {
    title: {
      absolute: title, // Use absolute to override root layout template
    },
    description,
    keywords: data?.keywords?.join(', ') || undefined,
    // Explicitly override all openGraph fields to prevent merging with root layout
    openGraph: {
      title,
      description,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      }],
      type: 'website',
      locale: 'vi_VN',
      url: fullUrl,
      siteName: 'Banyco',
      // Explicitly set to override root layout
    },
    // Explicitly override twitter metadata
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
    // Override robots if needed
    robots: {
      index: true,
      follow: true,
    },
  };
}

