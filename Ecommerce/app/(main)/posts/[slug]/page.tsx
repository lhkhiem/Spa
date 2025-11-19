import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { fetchPostBySlug, fetchRelatedPosts, PostDetailDTO, PostSummaryDTO } from '@/lib/api/posts';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import ShareButton from './ShareButton';
import ContactFormSection from '@/components/layout/ContactFormSection/ContactFormSection';
import { FiClock, FiUser, FiTag, FiArrowLeft } from 'react-icons/fi';

interface PostDetailPageProps {
  params: { slug: string };
}

// Normalize slug to handle various formats
const normalizeSlug = (slug: string): string => {
  // Decode URL-encoded characters first
  try {
    slug = decodeURIComponent(slug);
  } catch (e) {
    // If decode fails, use original slug
  }
  
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-') // Replace special chars with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const normalizedSlug = normalizeSlug(params.slug);
  const post = await fetchPostBySlug(normalizedSlug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.imageUrl ? [post.imageUrl] : [],
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      authors: post.author ? [post.author.name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

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

const PostContent = ({ content }: { content: string | null }) => {
  if (!content) {
    return (
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600">Nội dung đang được cập nhật...</p>
      </div>
    );
  }

  // If content is HTML, render it directly
  if (content.includes('<')) {
    return (
      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:no-underline hover:prose-a:text-red-700 hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-img:rounded-lg prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // If content is plain text, format it
  const paragraphs = content.split('\n\n').filter((p) => p.trim());
  return (
    <div className="prose prose-lg max-w-none">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

const RelatedPostCard = ({ post }: { post: PostSummaryDTO }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400';
  
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <Image
          src={post.imageUrl || fallbackImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        {post.topic && (
          <span className="mb-2 inline-block text-xs font-semibold text-red-700">
            {post.topic}
          </span>
        )}
        <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-red-700 line-clamp-2 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mb-3 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="flex items-center text-xs text-gray-500">
          {post.readTime && (
            <>
              <FiClock className="mr-1 h-3 w-3" />
              <span>{post.readTime}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = params;
  const normalizedSlug = normalizeSlug(slug);
  
  // Try with normalized slug first
  let post = await fetchPostBySlug(normalizedSlug);
  
  // If not found, try with original slug (in case it needs exact match)
  if (!post && slug !== normalizedSlug) {
    post = await fetchPostBySlug(slug);
  }
  
  // If still not found, try decoding the slug
  if (!post) {
    try {
      const decodedSlug = decodeURIComponent(slug);
      if (decodedSlug !== slug) {
        post = await fetchPostBySlug(normalizeSlug(decodedSlug));
      }
    } catch (e) {
      // Decode failed, continue
    }
  }

  if (!post) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/posts' },
    { label: post.title, href: `/posts/${post.slug}` },
  ];

  const relatedPosts = post.relatedPosts || (await fetchRelatedPosts(post.id, 3));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-900 via-red-800 to-rose-900">
        {post.imageUrl && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              style={{ filter: 'blur(1px)' }}
              priority
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 via-red-800/50 to-rose-900/60" />
        <div className="relative container-custom py-16 md:py-24 z-10">
          <Breadcrumb items={breadcrumbItems} className="mb-6 text-gray-100" />
          
          <div className="max-w-7xl">
            {post.topic && (
              <div className="mb-4">
                <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                  {post.topic}
                </span>
              </div>
            )}
            
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl drop-shadow-lg">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mb-8 text-xl text-gray-100 md:text-2xl drop-shadow-md">{post.excerpt}</p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-gray-100">
              {post.author && (
                <div className="flex items-center">
                  <FiUser className="mr-2 h-5 w-5" />
                  <span className="font-medium">{post.author.name}</span>
                </div>
              )}
              
              {post.publishedAt && (
                <div className="flex items-center">
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              )}
              
              {post.readTime && (
                <div className="flex items-center">
                  <FiClock className="mr-2 h-5 w-5" />
                  <span>{post.readTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="mx-auto max-w-7xl">
          {/* Featured Image */}
          {post.imageUrl ? (
            <div className="relative mb-12 h-[400px] overflow-hidden rounded-2xl shadow-2xl md:h-[500px]">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="relative mb-12 h-[300px] overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 shadow-2xl md:h-[400px]">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <FiTag className="mx-auto h-16 w-16 text-red-300" />
                </div>
              </div>
            </div>
          )}

          {/* Article Content */}
          <article className="mb-12 rounded-2xl bg-white p-8 shadow-lg md:p-12">
            <PostContent content={post.content} />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 border-t border-gray-200 pt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <FiTag className="h-5 w-5 text-gray-400" />
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-8">
              <Button href="/posts" variant="outline" size="sm">
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Quay lại Blog
              </Button>
              
              <ShareButton
                title={post.title}
                excerpt={post.excerpt}
                url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${post.slug}`}
              />
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-8 text-3xl font-bold text-gray-900">
                Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="relative rounded-2xl overflow-hidden p-8 md:p-12 text-center">
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
          </section>
        </div>
      </div>

      {/* Contact Form Section */}
      <ContactFormSection />
    </div>
  );
}

