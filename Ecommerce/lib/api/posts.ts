import { buildFromApiOrigin } from '@/config/site';
import apiClient from './client';
import { handleApiError } from './client';

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type ApiDetailResponse<T> = {
  success: boolean;
  data: T;
};

export interface PostDetailDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  readTime: string | null;
  category: string | null;
  topic: string | null;
  postType: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
  author?: {
    id: string;
    name: string;
    avatar?: string | null;
  } | null;
  tags?: string[];
  relatedPosts?: PostSummaryDTO[];
}

export interface PostSummaryDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  readTime: string | null;
  category: string | null;
  topic: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
}

const normalizeMediaUrl = (raw: unknown): string | null => {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const cleaned = raw.replace(/\\/g, '/');
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }

  return buildFromApiOrigin(cleaned);
};

/**
 * Fetch a single post by slug
 */
export const fetchPostBySlug = async (slug: string): Promise<PostDetailDTO | null> => {
  if (!slug) {
    return null;
  }

  // Try CMS API first (most likely source)
  try {
    const cmsBaseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL;
    if (cmsBaseUrl) {
      const normalizedUrl = cmsBaseUrl.replace(/\/api$/, '');
      const cmsResponse = await fetch(`${normalizedUrl}/api/posts/${slug}`, {
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (cmsResponse.ok) {
        const cmsData = await cmsResponse.json();
        if (cmsData?.data) {
          const post = cmsData.data;
          return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || post.description,
            content: post.content || post.body || post.description,
            readTime: post.read_time || post.readTime || '5 min read',
            category: post.category?.name || post.category || 'Learning Library',
            topic: post.topic || post.category?.name || 'Learning Library',
            postType: post.post_type || 'blog',
            imageUrl: normalizeMediaUrl(
              post.cover_asset?.url || post.image_url || post.cover_image || post.image
            ),
            publishedAt: post.published_at || post.publishedAt || post.created_at,
            author: post.author
              ? {
                  id: post.author.id,
                  name: post.author.name || post.author.username || 'Admin',
                  avatar: normalizeMediaUrl(post.author.avatar),
                }
              : null,
            tags: post.tags || post.tag_list || [],
          };
        }
      }
    }
  } catch (cmsError) {
    console.error('[fetchPostBySlug] CMS API failed:', cmsError);
  }

  // Try public API as fallback
  try {
    const response = await apiClient.get<ApiDetailResponse<PostDetailDTO>>(
      `/public/posts/${slug}`
    );

    if (response.data?.data) {
      const post = response.data.data;
      return {
        ...post,
        imageUrl: normalizeMediaUrl(post.imageUrl),
      };
    }
  } catch (error) {
    console.error('[fetchPostBySlug] Public API failed:', handleApiError(error));
  }

  // Return mock data for development/testing if all APIs fail
  if (process.env.NODE_ENV === 'development') {
    const mockPost = getMockPost(slug);
    if (mockPost) {
      console.warn(`[fetchPostBySlug] Using mock data for slug: ${slug} (normalized)`);
      return mockPost;
    }
  }

  console.warn(`[fetchPostBySlug] All APIs failed for slug: ${slug}`);
  return null;
};

/**
 * Normalize slug - handle various formats
 */
const normalizeSlug = (slug: string): string => {
  return slug
    .toLowerCase()
    .trim()
    .replace(/--+/g, '-') // Replace multiple dashes with single dash
    .replace(/[^\w-]/g, '') // Remove special characters
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

/**
 * Mock fallback data for testing
 */
const getMockPost = (slug: string): PostDetailDTO | null => {
  const normalizedSlug = normalizeSlug(slug);
  
  // Create mock post data
  const mockPost1: PostDetailDTO = {
    id: 'mock-1',
    title: "Building a Lash & Brow Bar Clients Can't Resist",
    slug: 'building-lash-brow-bar',
    excerpt:
      'Soft Clients will beat a path to your door for beautiful brows. Learn five great reasons to add lash and brow services to your menu.',
    content: `
      <h2>Introduction</h2>
      <p>Building a successful lash and brow bar requires more than just technical skills. It's about creating an experience that clients can't resist. In this article, we'll explore five key reasons why adding lash and brow services to your menu can transform your business.</p>
      
      <h2>1. High Demand, High Profit</h2>
      <p>The beauty industry has seen a significant surge in demand for lash and brow services. Clients are willing to pay premium prices for professional, high-quality treatments that enhance their natural features.</p>
      
      <h2>2. Repeat Business</h2>
      <p>Unlike one-time services, lash and brow treatments require regular maintenance. This creates a steady stream of repeat customers, ensuring consistent revenue for your business.</p>
      
      <h2>3. Quick Service Times</h2>
      <p>Lash and brow services can be completed relatively quickly compared to other spa treatments, allowing you to serve more clients throughout the day and maximize your earning potential.</p>
      
      <h2>4. Low Overhead</h2>
      <p>These services require minimal equipment and supplies, making them cost-effective to offer. The initial investment is relatively low, while the return on investment can be substantial.</p>
      
      <h2>5. Client Satisfaction</h2>
      <p>When done professionally, lash and brow services provide immediate, visible results that boost client confidence. Happy clients become loyal clients and your best marketing tool.</p>
      
      <h2>Conclusion</h2>
      <p>Adding lash and brow services to your menu is a strategic move that can significantly enhance your business. From high profit margins to client satisfaction, the benefits are clear. Start building your lash and brow bar today and watch your business grow.</p>
    `,
    readTime: '5 min read',
    category: 'Learning Library',
    topic: 'Learning Library',
    postType: 'blog',
    imageUrl: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=1200&h=600',
    publishedAt: new Date().toISOString(),
    author: {
      id: 'author-1',
      name: 'Spa Expert',
      avatar: null,
    },
    tags: ['Lash Services', 'Brow Services', 'Business Tips'],
  };

  const mockPost2: PostDetailDTO = {
    id: 'mock-2',
    title: 'How Massage Therapists Can Reduce Burnout',
    slug: 'how-massage-therapists-can-reduce-burnout',
    excerpt:
      "As a massage therapist, it's easy to become overwhelmed by the physical and emotional demands of the job. Discover how to prevent burnout.",
    content: `
      <h2>Understanding Burnout</h2>
      <p>Massage therapy is a physically and emotionally demanding profession. The constant physical exertion, combined with the need to be present and empathetic with clients, can lead to burnout if not managed properly.</p>
      
      <h2>Recognize the Signs</h2>
      <p>Early recognition of burnout symptoms is crucial. These may include chronic fatigue, decreased job satisfaction, physical pain, emotional exhaustion, and a sense of detachment from your work.</p>
      
      <h2>Physical Self-Care</h2>
      <p>As a massage therapist, your body is your most important tool. Regular stretching, strength training, and receiving massages yourself are essential. Don't neglect your own physical well-being while caring for others.</p>
      
      <h2>Set Boundaries</h2>
      <p>Learn to say no when necessary. Overbooking yourself or taking on clients beyond your capacity will only accelerate burnout. Set realistic schedules and stick to them.</p>
      
      <h2>Take Regular Breaks</h2>
      <p>Schedule breaks between sessions and take time off regularly. Your body and mind need time to recover. A well-rested therapist provides better service than an exhausted one.</p>
      
      <h2>Seek Support</h2>
      <p>Connect with other massage therapists, join professional associations, or consider working with a mentor. Having a support network can help you navigate challenges and prevent isolation.</p>
      
      <h2>Conclusion</h2>
      <p>Preventing burnout requires intentional self-care and boundary setting. By prioritizing your well-being, you can maintain a long, fulfilling career in massage therapy while providing excellent service to your clients.</p>
    `,
    readTime: '7 min read',
    category: 'Learning Library',
    topic: 'Learning Library',
    postType: 'blog',
    imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&h=600',
    publishedAt: new Date().toISOString(),
    author: {
      id: 'author-2',
      name: 'Wellness Coach',
      avatar: null,
    },
    tags: ['Massage Therapy', 'Wellness', 'Self-Care'],
  };

  // Map various slug formats to mock posts
  const slugVariants: Record<string, PostDetailDTO> = {
    // Post 1 variants
    'building-lash-brow-bar': mockPost1,
    'building-a-lash-brow-bar': mockPost1,
    'building-a-lash--brow-bar': mockPost1,
    'building-a-lash-brow-bar-clients-cant-resist': mockPost1,
    'building-a-lash--brow-bar-clients-cant-resis': mockPost1,
    'building-lash-brow-bar-clients-cant-resist': mockPost1,
    
    // Post 2 variants
    'how-massage-therapists-can-reduce-burnout': mockPost2,
    'how-massage-therapists-reduce-burnout': mockPost2,
    'massage-therapists-reduce-burnout': mockPost2,
  };

  // Try exact match first
  if (slugVariants[normalizedSlug]) {
    return slugVariants[normalizedSlug];
  }

  // Try partial match (contains key words)
  if (normalizedSlug.includes('building') && (normalizedSlug.includes('lash') || normalizedSlug.includes('brow'))) {
    return mockPost1;
  }

  if (normalizedSlug.includes('massage') && normalizedSlug.includes('burnout')) {
    return mockPost2;
  }

  return null;
};

/**
 * Fetch related posts
 */
export const fetchRelatedPosts = async (
  postId: string,
  limit = 3
): Promise<PostSummaryDTO[]> => {
  try {
    const response = await apiClient.get<ApiResponse<PostSummaryDTO[]>>(
      `/public/posts/${postId}/related?limit=${limit}`
    );

    if (response.data?.data) {
      return response.data.data.map((post) => ({
        ...post,
        imageUrl: normalizeMediaUrl(post.imageUrl),
      }));
    }

    return [];
  } catch (error) {
    console.error('[fetchRelatedPosts] Failed:', handleApiError(error));
    return [];
  }
};

