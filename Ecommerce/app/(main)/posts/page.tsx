import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import Button from '@/components/ui/Button/Button';
import PageHero from '@/components/ui/PageHero/PageHero';
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
}

const PostCard = ({ post }: PostCardProps) => {
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
        <div className="flex items-center gap-4 text-xs text-gray-500">
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
      </div>
    </Link>
  );
};

export default async function PostsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/posts' },
  ];

  // Fetch all posts (blog type)
  const postsResponse = await fetchPosts({
    pageSize: 24,
    post_type: 'blog',
  });

  const posts = postsResponse.data || [];

  // Extract unique topics for filtering
  const topicsSet = new Set<string>();
  posts.forEach((post) => {
    if (post.topic) {
      topicsSet.add(post.topic);
    }
  });
  const topics = Array.from(topicsSet).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="Learning Library"
        description="Explore our collection of educational articles, tips, and insights to help you grow your spa business and enhance your professional skills."
        backgroundImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80"
      />

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        {/* Topics Filter */}
        {topics.length > 0 && (
          <FadeInSection>
            <TopicFilter topics={topics} />
          </FadeInSection>
        )}

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <FadeInSection key={post.id} delay={index * 50}>
                <PostCard post={post} />
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

        {/* Pagination */}
        <FadeInSection>
          <Pagination totalPages={postsResponse.meta.totalPages} />
        </FadeInSection>

        {/* CTA Section */}
        <FadeInSection>
          <div className="relative mt-16 rounded-2xl overflow-hidden p-8 md:p-12 text-center">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-rose-50/30 to-pink-50/50" />
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
              }}
            />
            
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Khám phá thêm tài nguyên học tập
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                Tham gia các khóa học miễn phí và nâng cao kỹ năng của bạn
              </p>
              <Button href="/learning" size="lg" className="bg-red-700 text-white hover:bg-red-800 shadow-lg transition-all">
                Xem tất cả khóa học
              </Button>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}

