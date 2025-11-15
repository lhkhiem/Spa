import { notFound, redirect } from 'next/navigation';
import { fetchPostBySlug } from '@/lib/api/posts';
import { fetchEducationResources } from '@/lib/api/publicHomepage';

// Normalize slug to handle various formats
const normalizeSlug = (slug: string): string => {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Create slug from title or ID
const createSlugFromString = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export default async function EducationResourcePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const normalizedSlug = normalizeSlug(slug);

  // Try to find as a post first (most common case)
  try {
    const post = await fetchPostBySlug(normalizedSlug);
    if (post) {
      // Redirect to posts page if found
      redirect(`/posts/${post.slug}`);
    }
  } catch (error) {
    // Continue to check education resources
    console.log('[EducationResourcePage] Post not found, checking education resources');
  }

  // Try to find in education resources
  try {
    const resources = await fetchEducationResources();
    
    // Try to match by ID, title slug, or link_url
    const resource = resources.find((r) => {
      // Match by ID
      if (r.id === slug || r.id === normalizedSlug) {
        return true;
      }

      // Match by title slug
      if (r.title) {
        const titleSlug = createSlugFromString(r.title);
        if (titleSlug === normalizedSlug || titleSlug === slug) {
          return true;
        }
      }

      // Match by link_url if it contains the slug
      if (r.link_url) {
        const urlSlug = r.link_url.split('/').pop() || '';
        if (normalizeSlug(urlSlug) === normalizedSlug) {
          return true;
        }
      }

      return false;
    });

    if (resource) {
      // If resource has a link_url, redirect to it
      if (resource.link_url) {
        if (resource.link_url.startsWith('/')) {
          redirect(resource.link_url);
        } else if (resource.link_url.startsWith('http://') || resource.link_url.startsWith('https://')) {
          // External URL - redirect
          redirect(resource.link_url);
        }
      }
      
      // Otherwise, redirect to learning page
      redirect('/learning');
    }
  } catch (error) {
    console.error('[EducationResourcePage] Error fetching education resources', error);
  }

  // If not found, try one more time with different slug variations
  // Some slugs might have extra prefixes/suffixes
  const slugVariations = [
    slug.replace(/^education-?resource-?/i, ''),
    slug.replace(/^education-?/i, ''),
    slug.replace(/-?resource-?ff$/i, ''),
    slug.replace(/-ff$/i, ''),
  ].filter((s) => s && s !== slug);

  for (const variation of slugVariations) {
    if (!variation) continue;
    
    try {
      const post = await fetchPostBySlug(normalizeSlug(variation));
      if (post) {
        redirect(`/posts/${post.slug}`);
      }
    } catch (error) {
      // Continue
    }
  }

  // Final fallback: redirect to learning page instead of 404
  // This is more user-friendly for education resources
  redirect('/learning');
}

