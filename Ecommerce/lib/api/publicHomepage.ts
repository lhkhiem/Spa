import { buildFromApiOrigin } from '@/config/site';
import apiClient from './client';

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export interface HeroSlideDTO {
  id: string;
  title: string;
  description: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  image_url?: string | null;
  order: number;
  isActive: boolean;
}

export interface ProductSummaryDTO {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  imageUrl: string | null;
  inStock: boolean;
  rating: number | null;
  reviewCount: number;
  badge: string | null;
}

export interface HomepageStatsDTO {
  activeCustomers: string;
  countriesServed: string;
  yearsInBusiness: string;
}

export interface LearningPostDTO {
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

export interface CategorySummaryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export interface BrandSummaryDTO {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logoUrl: string | null;
}

export interface ValuePropDTO {
  id: string;
  title: string;
  subtitle: string | null;
  icon_key: string | null;
  icon_color: string | null;
  icon_background: string | null;
  sort_order: number;
}

export interface TestimonialDTO {
  id: string;
  customer_name: string;
  customer_title: string | null;
  customer_initials: string | null;
  testimonial_text: string;
  rating: number;
  is_featured: boolean;
  sort_order: number;
}

export interface EducationResourceDTO {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  link_text: string | null;
  duration: string | null;
  ceus: string | null;
  level: string | null;
  resource_type: string | null;
  sort_order: number;
}

const normalizeMediaUrl = (raw: unknown): string | null => {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const cleaned = raw.replace(/\\/g, '/');
  let url: string;
  
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    url = cleaned;
  } else {
    url = buildFromApiOrigin(cleaned);
  }
  
  // Always replace IP address with domain name (which has HTTPS via reverse proxy)
  // This fixes Mixed Content issues both on client and server side
  const ipPattern = /https?:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?/;
  const ipMatch = url.match(ipPattern);
  if (ipMatch) {
    // Replace IP with api subdomain (which has HTTPS via reverse proxy)
    // Don't include port because nginx reverse proxy handles it
    url = url.replace(ipMatch[0], 'https://api.banyco-demo.pressup.vn');
  }
  
  // Fix Mixed Content issues when page is loaded over HTTPS
  // Convert HTTP to HTTPS for production domains
  if (url.startsWith('http://')) {
    const isProductionDomain = url.includes('banyco-demo.pressup.vn') || 
                               url.includes('pressup.vn') ||
                               url.includes('api.banyco-demo.pressup.vn');
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
    
    // Convert to HTTPS for production domains, or if page is loaded over HTTPS
    if (isProductionDomain || (!isLocalhost && typeof window !== 'undefined' && window.location.protocol === 'https:')) {
      url = url.replace('http://', 'https://');
    }
  }
  
  return url;
};

export const fetchHeroSlides = async (): Promise<HeroSlideDTO[]> => {
  const response = await apiClient.get<ApiResponse<HeroSlideDTO[]>>('/public/homepage/hero-sliders');
  const slides = response.data.data ?? [];

  return slides.map((slide) => {
    const normalizedImage = normalizeMediaUrl(slide.imageUrl ?? slide.image_url);

    return {
      ...slide,
      imageUrl: normalizedImage,
      image_url: slide.image_url,
    };
  });
};

export const fetchBestSellers = async (): Promise<ProductSummaryDTO[]> => {
  const response = await apiClient.get<ApiResponse<ProductSummaryDTO[]>>('/public/homepage/best-sellers');
  return response.data.data ?? [];
};

export const fetchFeaturedCategories = async (): Promise<CategorySummaryDTO[]> => {
  const response = await apiClient.get<ApiResponse<CategorySummaryDTO[]>>('/public/homepage/featured-categories');
  return response.data.data ?? [];
};

export const fetchFeaturedBrands = async (): Promise<BrandSummaryDTO[]> => {
  const response = await apiClient.get<ApiResponse<BrandSummaryDTO[]>>('/public/homepage/featured-brands');
  return response.data.data ?? [];
};

export const fetchValueProps = async (): Promise<ValuePropDTO[]> => {
  const response = await apiClient.get<ApiResponse<ValuePropDTO[]>>('/public/homepage/value-props');
  return response.data.data ?? [];
};

export const fetchTestimonials = async (): Promise<TestimonialDTO[]> => {
  const response = await apiClient.get<ApiResponse<TestimonialDTO[]>>('/public/homepage/testimonials');
  return response.data.data ?? [];
};

export const fetchEducationResources = async (): Promise<EducationResourceDTO[]> => {
  const response = await apiClient.get<ApiResponse<EducationResourceDTO[]>>('/public/homepage/education-resources');
  return response.data.data ?? [];
};

export const fetchHomepageStats = async (): Promise<HomepageStatsDTO> => {
  const response = await apiClient.get<ApiResponse<HomepageStatsDTO>>('/public/homepage/stats');
  return response.data.data;
};

export const fetchLearningPosts = async (limit = 2): Promise<LearningPostDTO[]> => {
  const response = await apiClient.get<ApiResponse<LearningPostDTO[]>>(
    `/public/homepage/learning-posts?limit=${limit}`
  );
  return response.data.data ?? [];
};



