'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Disable static generation for this page (uses useSearchParams)
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import Button from '@/components/ui/Button/Button';
import ParallaxSection from '@/components/ui/ParallaxSection/ParallaxSection';
import { fetchPosts, PostSummaryDTO } from '@/lib/api/posts';
import { buildFromApiOrigin } from '@/config/site';
import { FiClock, FiUser, FiTag } from 'react-icons/fi';
import TopicFilter from './TopicFilter';
import Pagination from './Pagination';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400';

const resolveImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return FALLBACK_IMAGE;
  
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  return buildFromApiOrigin(imageUrl);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
};

interface PostCardProps {
  post: PostSummaryDTO;
  onTopicClick?: (topic: string) => void;
  onTagClick?: (tag: string) => void;
}

const PostCard = ({ post, onTopicClick, onTagClick }: PostCardProps) => {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <Image
          src={resolveImageUrl(post.imageUrl)}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        {post.topic && (
          <span className="mb-2 inline-block rounded-full bg-red-100/80 px-3 py-1 text-xs font-semibold text-red-800">
            {post.topic}
          </span>
        )}
        <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-red-700 line-clamp-2 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mb-4 text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {post.readTime && (
            <div className="flex items-center">
              <FiClock className="mr-1 h-3 w-3" />
              <span>{post.readTime}</span>
            </div>
          )}
          {post.publishedAt && (
            <div className="flex items-center">
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          )}
        </div>
        
        {/* Topics and Tags */}
        <div className="flex flex-col gap-2 text-xs">
          {post.topic && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Topics:</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTopicClick?.(post.topic!);
                }}
                className="text-red-700 hover:text-red-900 hover:underline"
              >
                {post.topic}
              </button>
            </div>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-700">Tags:</span>
              {post.tags.map((tag, index) => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onTagClick?.(tag);
                  }}
                  className="text-red-700 hover:text-red-900 hover:underline"
                >
                  {tag}{index < post.tags!.length - 1 ? ',' : ''}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default function PostsPage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<PostSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTopics, setAllTopics] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    pageSize: 24,
    totalPages: 0,
  });

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/posts' },
  ];

  // Read topic from URL query params on mount
  useEffect(() => {
    const topicParam = searchParams.get('topic');
    if (topicParam) {
      setSelectedTopic(decodeURIComponent(topicParam));
      setShowAll(true); // Show all posts when filtering by topic
    }
  }, [searchParams]);

  // Load all topics and tags once on mount
  useEffect(() => {
    const loadAllTopicsAndTags = async () => {
      try {
        const allPostsResponse = await fetchPosts({
          pageSize: 1000, // Get all posts to extract topics/tags
          post_type: 'blog',
        });
        const allPosts = allPostsResponse.data || [];
        const topicsSet = new Set<string>();
        const tagsSet = new Set<string>();
        allPosts.forEach((post) => {
          if (post.topic) {
            topicsSet.add(post.topic);
          }
          if (post.tags) {
            post.tags.forEach(tag => tagsSet.add(tag));
          }
        });
        setAllTopics(Array.from(topicsSet).sort());
        setAllTags(Array.from(tagsSet).sort());
      } catch (error) {
        console.error('Failed to load topics/tags:', error);
      }
    };
    loadAllTopicsAndTags();
  }, []);

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAll, selectedTopic, selectedTag]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params: any = {
        pageSize: 24,
        post_type: 'blog',
      };

      // If showing all OR filtering, don't filter by featured
      // Only show featured when showing initial view with no filters
      if (!showAll && !selectedTopic && !selectedTag) {
        params.featured_only = true;
      }

      console.log('[PostsPage] Loading posts with params:', params);
      
      // Note: API filters by topic ID, but we have topic name
      // So we'll filter client-side for both topic and tag
      const response = await fetchPosts(params);
      
      console.log('[PostsPage] API response:', {
        total: response.meta.total,
        postsCount: response.data.length,
        firstPost: response.data[0],
      });
      
      let filteredPosts = response.data || [];
      
      // Filter by topic name if selected (client-side filter)
      if (selectedTopic) {
        filteredPosts = filteredPosts.filter(post => 
          post.topic === selectedTopic
        );
        console.log('[PostsPage] After topic filter:', filteredPosts.length);
      }
      
      // Filter by tag if selected (client-side filter)
      if (selectedTag) {
        filteredPosts = filteredPosts.filter(post => 
          post.tags && post.tags.includes(selectedTag)
        );
        console.log('[PostsPage] After tag filter:', filteredPosts.length);
      }

      console.log('[PostsPage] Final posts count:', filteredPosts.length);
      setPosts(filteredPosts);
      setMeta(response.meta);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topic: string | null) => {
    setSelectedTopic(topic);
    setSelectedTag(null);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setSelectedTopic(null);
  };

  const handleShowAll = () => {
    setShowAll(true);
    setSelectedTopic(null);
    setSelectedTag(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax */}
      <ParallaxSection
        backgroundImage="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80"
        overlay={true}
        overlayColor="bg-black"
        overlayOpacity="bg-opacity-60"
      >
        <div className="text-center text-white">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl drop-shadow-lg">
              Bài Viết & Tin Tức
            </h1>
            <p className="max-w-2xl mx-auto text-lg drop-shadow-md">
              Cập nhật những thông tin mới nhất về sản phẩm spa, kiến thức chăm sóc sắc đẹp và xu hướng ngành làm đẹp
            </p>
          </FadeInSection>
        </div>
      </ParallaxSection>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        {/* Topics Filter */}
        {allTopics.length > 0 && (
          <FadeInSection>
            <div className="mb-4">
              <TopicFilter 
                topics={allTopics}
                selectedTopic={selectedTopic}
                onTopicClick={handleTopicClick}
              />
            </div>
          </FadeInSection>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <FadeInSection key={post.id} delay={index * 50}>
                <PostCard 
                  post={post}
                  onTopicClick={handleTopicClick}
                  onTagClick={handleTagClick}
                />
              </FadeInSection>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-12 text-center">
            <FiTag className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No posts found</h3>
            <p className="text-gray-600">Check back soon for new articles!</p>
          </div>
        )}

        {/* Show All Button - only show when showing featured posts */}
        {!showAll && posts.length > 0 && (
          <FadeInSection>
            <div className="mt-8 text-center">
              <Button 
                onClick={handleShowAll}
                size="lg" 
                className="bg-red-700 text-white hover:bg-red-800 shadow-lg transition-all"
              >
                Xem tất cả bài viết
              </Button>
            </div>
          </FadeInSection>
        )}

        {/* Pagination */}
        {showAll && meta.totalPages > 1 && (
          <FadeInSection>
            <Pagination totalPages={meta.totalPages} />
          </FadeInSection>
        )}
      </div>
    </div>
  );
}
