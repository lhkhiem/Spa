import { Metadata } from 'next';
import { getPageMetadataFromCMS, generatePageMetadata } from '@/lib/utils/pageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageMetadataFromCMS('/posts');
  
  return generatePageMetadata(data, '/posts', {
    title: 'Bài Viết & Tin Tức - Banyco',
    description: 'Cập nhật những thông tin mới nhất về sản phẩm spa, kiến thức chăm sóc sắc đẹp và xu hướng ngành làm đẹp',
    ogImage: '/images/og-posts.jpg',
  });
}

// Force dynamic rendering to ensure metadata is always fresh from CMS
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No caching for metadata

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



