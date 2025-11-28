import { Metadata } from 'next';
import { getPageMetadataFromCMS, generatePageMetadata } from '@/lib/utils/pageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageMetadataFromCMS('/contact');
  
  return generatePageMetadata(data, '/contact', {
    title: 'Liên Hệ - Banyco',
    description: 'Liên hệ Banyco để được tư vấn về thiết bị spa, salon và vật tư làm đẹp chuyên nghiệp. Hotline: 0986 671 5229',
    ogImage: '/images/og-contact.jpg',
  });
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



