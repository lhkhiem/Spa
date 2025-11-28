import { Metadata } from 'next';
import { getPageMetadataFromCMS, generatePageMetadata } from '@/lib/utils/pageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageMetadataFromCMS('/faqs');
  
  return generatePageMetadata(data, '/faqs', {
    title: 'Câu Hỏi Thường Gặp - Banyco',
    description: 'Tổng hợp giải đáp chi tiết về đơn hàng, vận chuyển, bảo hành – đổi trả, lựa chọn thiết bị, tư vấn xây dựng & vận hành spa chuyên nghiệp.',
    ogImage: '/images/og-faqs.jpg',
  });
}

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



