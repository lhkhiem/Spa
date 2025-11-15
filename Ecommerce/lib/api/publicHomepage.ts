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
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }

  return buildFromApiOrigin(cleaned);
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



