import { buildFromApiOrigin, buildApiUrl } from '@/config/site';
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
  tags?: string[];
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
 * Try to fetch post with different slug variations
 */
const tryFetchPost = async (slug: string, apiPath: string): Promise<PostDetailDTO | null> => {
  // Try with original slug first
  try {
    const response = await fetch(`${apiPath}/${slug}`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.data) {
        return data.data;
      }
    }
  } catch (e) {
    // Continue to try encoded version
  }

  // Try with encoded slug
  try {
    const encodedSlug = encodeURIComponent(slug);
    if (encodedSlug !== slug) {
      const response = await fetch(`${apiPath}/${encodedSlug}`, {
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.data) {
          return data.data;
        }
      }
    }
  } catch (e) {
    // Continue
  }

  return null;
};

/**
 * Fetch a single post by slug
 */
export const fetchPostBySlug = async (slug: string): Promise<PostDetailDTO | null> => {
  if (!slug) {
    return null;
  }

  // Clean slug - remove trailing/leading dashes and whitespace
  const cleanSlug = slug.trim().replace(/^-+|-+$/g, '');

  // Try public API first (correct endpoint: /api/public/posts/slug/:slug)
  try {
    console.log('[fetchPostBySlug] Attempting to fetch post with slug:', cleanSlug);
    
    // Try with cleaned slug
    try {
      const response = await apiClient.get<ApiDetailResponse<PostDetailDTO>>(
        `/public/posts/slug/${cleanSlug}`
      );

      console.log('[fetchPostBySlug] Public API response:', {
        success: response.data?.success,
        hasData: !!response.data?.data,
        status: response.status,
      });

      if (response.data?.success && response.data?.data) {
        const rawPost = response.data.data;
        console.log('[fetchPostBySlug] Post found:', rawPost.title);
        
        // Handle topics - can be array of {id, name} or string
        let topic: string | null = null;
        if ((rawPost as any).topics && Array.isArray((rawPost as any).topics) && (rawPost as any).topics.length > 0) {
          topic = (rawPost as any).topics[0].name || (rawPost as any).topics[0];
        } else if (rawPost.topic) {
          topic = typeof rawPost.topic === 'string' ? rawPost.topic : (rawPost.topic as any)?.name;
        }

        // Handle tags - can be array of {id, name} or array of strings
        let tags: string[] = [];
        if (rawPost.tags && Array.isArray(rawPost.tags)) {
          tags = rawPost.tags.map((tag: any) => 
            typeof tag === 'string' ? tag : (tag.name || tag)
          ).filter(Boolean);
        }

        return {
          id: rawPost.id,
          title: rawPost.title,
          slug: rawPost.slug,
          excerpt: rawPost.excerpt || (rawPost as any).description || null,
          content: rawPost.content || (rawPost as any).body || (rawPost as any).description || null,
          readTime: (rawPost as any).read_time || (rawPost as any).readTime || null,
          category: (typeof rawPost.category === 'object' && rawPost.category ? (rawPost.category as any).name : null) || rawPost.category || null,
          topic,
          tags,
          postType: (rawPost as any).post_type || 'blog',
          imageUrl: normalizeMediaUrl(
            (rawPost as any).cover_asset?.url || (rawPost as any).cover_asset?.cdn_url || (rawPost as any).image_url || (rawPost as any).cover_image || (rawPost as any).image
          ),
          publishedAt: (rawPost as any).published_at || (rawPost as any).publishedAt || (rawPost as any).created_at || null,
          author: rawPost.author
            ? {
                id: (rawPost.author as any).id,
                name: (rawPost.author as any).name || (rawPost.author as any).username || 'Admin',
                avatar: normalizeMediaUrl((rawPost.author as any).avatar),
              }
            : null,
        };
      }
    } catch (e: any) {
      console.log('[fetchPostBySlug] First attempt failed, trying original slug:', e.message);
      
      // Try with original slug (in case cleaned version doesn't match)
      if (slug !== cleanSlug) {
        try {
          const response = await apiClient.get<ApiDetailResponse<PostDetailDTO>>(
            `/public/posts/slug/${slug}`
          );

          if (response.data?.success && response.data?.data) {
            const rawPost = response.data.data;
            
            // Handle topics and tags
            let topic: string | null = null;
            if ((rawPost as any).topics && Array.isArray((rawPost as any).topics) && (rawPost as any).topics.length > 0) {
              topic = (rawPost as any).topics[0].name || (rawPost as any).topics[0];
            } else if (rawPost.topic) {
              topic = typeof rawPost.topic === 'string' ? rawPost.topic : (rawPost.topic as any)?.name;
            }

            let tags: string[] = [];
            if (rawPost.tags && Array.isArray(rawPost.tags)) {
              tags = rawPost.tags.map((tag: any) => 
                typeof tag === 'string' ? tag : (tag.name || tag)
              ).filter(Boolean);
            }

            return {
              id: rawPost.id,
              title: rawPost.title,
              slug: rawPost.slug,
              excerpt: rawPost.excerpt || (rawPost as any).description || null,
              content: rawPost.content || (rawPost as any).body || (rawPost as any).description || null,
              readTime: (rawPost as any).read_time || (rawPost as any).readTime || null,
              category: (typeof rawPost.category === 'object' && rawPost.category ? (rawPost.category as any).name : null) || rawPost.category || null,
              topic,
              tags,
              postType: (rawPost as any).post_type || 'blog',
              imageUrl: normalizeMediaUrl(
                (rawPost as any).cover_asset?.url || (rawPost as any).cover_asset?.cdn_url || (rawPost as any).image_url || (rawPost as any).cover_image || (rawPost as any).image
              ),
              publishedAt: (rawPost as any).published_at || (rawPost as any).publishedAt || (rawPost as any).created_at || null,
              author: rawPost.author
                ? {
                    id: (rawPost.author as any).id,
                    name: (rawPost.author as any).name || (rawPost.author as any).username || 'Admin',
                    avatar: normalizeMediaUrl((rawPost.author as any).avatar),
                  }
                : null,
            };
          }
        } catch (e2) {
          console.error('[fetchPostBySlug] Encoded slug also failed:', e2);
        }
      }
    }
  } catch (error) {
    console.error('[fetchPostBySlug] Public API failed:', handleApiError(error));
  }

  // Try CMS API as fallback (admin route, might need auth)
  try {
    const cmsBaseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL;
    if (cmsBaseUrl) {
      const normalizedUrl = cmsBaseUrl.replace(/\/api$/, '');
      const apiPath = `${normalizedUrl}/api/posts`;
      
      const rawPost = await tryFetchPost(slug, apiPath);
      
      if (rawPost) {
        // Handle topics and tags
        let topic: string | null = null;
        if ((rawPost as any).topics && Array.isArray((rawPost as any).topics) && (rawPost as any).topics.length > 0) {
          topic = (rawPost as any).topics[0].name || (rawPost as any).topics[0];
        } else if (rawPost.topic) {
          topic = typeof rawPost.topic === 'string' ? rawPost.topic : (rawPost.topic as any)?.name;
        }

        let tags: string[] = [];
        if (rawPost.tags && Array.isArray(rawPost.tags)) {
          tags = rawPost.tags.map((tag: any) => 
            typeof tag === 'string' ? tag : (tag.name || tag)
          ).filter(Boolean);
        }

        return {
          id: rawPost.id,
          title: rawPost.title,
          slug: rawPost.slug,
          excerpt: rawPost.excerpt || (rawPost as any).description || null,
          content: rawPost.content || (rawPost as any).body || (rawPost as any).description || null,
          readTime: (rawPost as any).read_time || (rawPost as any).readTime || null,
          category: (typeof rawPost.category === 'object' && rawPost.category ? (rawPost.category as any).name : null) || rawPost.category || null,
          topic,
          tags,
          postType: (rawPost as any).post_type || 'blog',
          imageUrl: normalizeMediaUrl(
            (rawPost as any).cover_asset?.url || (rawPost as any).cover_asset?.cdn_url || (rawPost as any).image_url || (rawPost as any).cover_image || (rawPost as any).image
          ),
          publishedAt: (rawPost as any).published_at || (rawPost as any).publishedAt || (rawPost as any).created_at || null,
          author: rawPost.author
            ? {
                id: (rawPost.author as any).id,
                name: (rawPost.author as any).name || (rawPost.author as any).username || 'Admin',
                avatar: normalizeMediaUrl((rawPost.author as any).avatar),
              }
            : null,
        };
      }
    }
  } catch (cmsError) {
    console.error('[fetchPostBySlug] CMS API failed:', cmsError);
  }

  // Return mock data for development/testing if all APIs fail
  if (process.env.NODE_ENV === 'development') {
    const mockPost = getMockPost(slug);
    if (mockPost) {
      console.warn(`[fetchPostBySlug] Using mock data for slug: ${slug}`);
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

  // Create mock post for "learning network" topic
  const mockPost3: PostDetailDTO = {
    id: 'mock-3',
    title: 'Learning Network to Offer You a Growing Library of Online Classes',
    slug: 'learning-network-to-offer-you-a-growing-library-of-online-classes',
    excerpt: 'Discover our expanding learning network with a comprehensive library of online classes designed to enhance your skills and knowledge.',
    content: `
      <h2>Welcome to Our Learning Network</h2>
      <p>We're excited to offer you access to a growing library of online classes designed to help you succeed. Our learning network provides comprehensive training resources across multiple topics and skill levels.</p>
      
      <h2>Comprehensive Course Library</h2>
      <p>Our library includes courses on business management, professional development, technical skills, and much more. Each course is designed by industry experts and updated regularly to reflect the latest best practices.</p>
      
      <h2>Flexible Learning Options</h2>
      <p>All courses are available online, allowing you to learn at your own pace and on your own schedule. Whether you're looking to advance your career or explore new interests, our learning network has something for everyone.</p>
      
      <h2>Expert Instructors</h2>
      <p>Learn from experienced professionals who are passionate about sharing their knowledge. Our instructors bring real-world experience to every lesson, ensuring you get practical, applicable insights.</p>
      
      <h2>Continuous Growth</h2>
      <p>Our course library is constantly expanding with new classes added regularly. As a member of our learning network, you'll always have access to the latest content and updates.</p>
      
      <h2>Get Started Today</h2>
      <p>Join our learning network today and start exploring our growing library of online classes. Begin your learning journey and unlock your potential with our comprehensive educational resources.</p>
    `,
    readTime: '6 min read',
    category: 'Learning Library',
    topic: 'Learning Library',
    postType: 'blog',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=600',
    publishedAt: new Date().toISOString(),
    author: {
      id: 'author-3',
      name: 'Learning Network Team',
      avatar: null,
    },
    tags: ['Online Classes', 'Learning Network', 'Education'],
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
    
    // Post 3 variants (Learning Network)
    'learning-network-to-offer-you-a-growing-library-of-online-classes': mockPost3,
    'learning-network-to-offer-you-a-growing-library': mockPost3,
    'learning-network-online-classes': mockPost3,
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

  // Match for learning network posts
  if (normalizedSlug.includes('learning') && (normalizedSlug.includes('network') || normalizedSlug.includes('online') || normalizedSlug.includes('classes') || normalizedSlug.includes('library'))) {
    return mockPost3;
  }

  return null;
};

/**
 * Fetch posts list
 */
export const fetchPosts = async (params?: {
  page?: number;
  pageSize?: number;
  post_type?: string;
  featured_only?: boolean;
  topic?: string;
  category?: string;
  q?: string;
}): Promise<{
  data: PostSummaryDTO[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.post_type) {
      queryParams.append('post_type', params.post_type);
    }
    if (params?.featured_only) {
      queryParams.append('featured_only', 'true');
    }
    if (params?.topic) {
      queryParams.append('topic', params.topic);
    }
    if (params?.category) {
      queryParams.append('category', params.category);
    }
    if (params?.q) {
      queryParams.append('q', params.q);
    }

    const queryString = queryParams.toString();
    const url = buildApiUrl(`/public/posts${queryString ? `?${queryString}` : ''}`);

    const response = await fetch(url, {
      cache: 'no-store', // Disable caching to ensure fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[fetchPosts] Failed to fetch posts', response.statusText);
      return {
        data: [],
        meta: {
          total: 0,
          page: params?.page || 1,
          pageSize: params?.pageSize || 20,
          totalPages: 0,
        },
      };
    }

    const payload = await response.json();
    
    console.log('[fetchPosts] Raw API response:', {
      hasSuccess: 'success' in payload,
      hasData: 'data' in payload,
      dataType: Array.isArray(payload.data) ? 'array' : typeof payload.data,
      dataLength: Array.isArray(payload.data) ? payload.data.length : 'N/A',
      total: payload.total,
      firstItem: Array.isArray(payload.data) && payload.data.length > 0 ? payload.data[0] : null,
    });

    // Handle different response formats
    // Format 1: { success: true, data: [...], total: ... }
    // Format 2: { data: { data: [...], total: ... } }
    let posts: any[] = [];
    let total = 0;
    let page = params?.page || 1;
    let pageSize = params?.pageSize || 20;
    
    if (payload.success && Array.isArray(payload.data)) {
      // Format 1: Direct array in data
      posts = payload.data;
      total = payload.total || posts.length;
      page = payload.page || page;
      pageSize = payload.pageSize || pageSize;
    } else if (payload.data && Array.isArray(payload.data)) {
      // Format 2: Array in data.data
      posts = payload.data;
      total = payload.total || payload.data?.total || posts.length;
      page = payload.page || payload.data?.page || page;
      pageSize = payload.pageSize || payload.data?.pageSize || pageSize;
    } else if (payload.data?.data && Array.isArray(payload.data.data)) {
      // Format 3: Nested data.data
      posts = payload.data.data;
      total = payload.data.total || posts.length;
      page = payload.data.page || page;
      pageSize = payload.data.pageSize || pageSize;
    }
    
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: posts.map((post: any) => {
        // Handle topics - can be array of {id, name} or string
        let topic: string | null = null;
        if (post.topics && Array.isArray(post.topics) && post.topics.length > 0) {
          topic = post.topics[0].name || post.topics[0];
        } else if (post.topic) {
          topic = typeof post.topic === 'string' ? post.topic : post.topic?.name;
        } else if (post.category?.name) {
          topic = post.category.name;
        }

        // Handle tags - can be array of {id, name} or array of strings
        let tags: string[] = [];
        if (post.tags && Array.isArray(post.tags)) {
          tags = post.tags.map((tag: any) => 
            typeof tag === 'string' ? tag : (tag.name || tag)
          ).filter(Boolean);
        } else if (post.tag_list && Array.isArray(post.tag_list)) {
          tags = post.tag_list;
        }

        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || post.description || null,
          readTime: post.read_time || post.readTime || null,
          category: post.category?.name || post.category || null,
          topic,
          tags,
          imageUrl: normalizeMediaUrl(
            post.cover_asset?.url || post.cover_asset?.cdn_url || post.image_url || post.cover_image || post.image
          ),
          publishedAt: post.published_at || post.publishedAt || post.created_at || null,
        };
      }),
      meta: {
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  } catch (error) {
    console.error('[fetchPosts] Error:', error);
    return {
      data: [],
      meta: {
        total: 0,
        page: params?.page || 1,
        pageSize: params?.pageSize || 20,
        totalPages: 0,
      },
    };
  }
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

