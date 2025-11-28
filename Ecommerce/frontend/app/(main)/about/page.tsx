import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import Button from '@/components/ui/Button/Button';
import ParallaxSection from '@/components/ui/ParallaxSection/ParallaxSection';
import { getApiUrl } from '@/config/site';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { getPageMetadataFromCMS, generatePageMetadata } from '@/lib/utils/pageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageMetadataFromCMS('/about');
  console.log('[About Page] CMS metadata:', data ? 'Found' : 'Not found, using fallback');
  
  return generatePageMetadata(data, '/about', {
    title: 'Về Chúng Tôi - Banyco Spa Solutions',
    description: 'Giới thiệu Banyco – đối tác cung cấp giải pháp & thiết bị spa chuyên nghiệp, đồng hành phát triển vận hành và tối ưu hoá lợi nhuận.',
    ogImage: '/images/banyco-logo.jpg', // Use logo as fallback OG image
  });
}

// Force dynamic rendering to ensure metadata is always fresh from CMS
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No caching for metadata

interface AboutSection {
  id: string;
  section_key: string;
  title?: string | null;
  content?: string | null;
  image_url?: string | null;
  button_text?: string | null;
  button_link?: string | null;
  list_items?: Array<{ title: string; description: string }> | null;
  is_active: boolean;
}

async function getAboutSections(): Promise<{ welcome: AboutSection | null; givingBack: AboutSection | null }> {
  try {
    const apiUrl = getApiUrl(); // getApiUrl() already includes '/api'
    const response = await fetch(`${apiUrl}/about-sections?active_only=true`, {
      next: { revalidate: 10 }, // Revalidate every 10 seconds
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch about sections');
    }
    
    const data = await response.json();
    const sections = data.data || [];
    
    return {
      welcome: sections.find((s: AboutSection) => s.section_key === 'welcome') || null,
      givingBack: sections.find((s: AboutSection) => s.section_key === 'giving_back') || null,
    };
  } catch (error) {
    console.error('Error fetching about sections:', error);
    return { welcome: null, givingBack: null };
  }
}

export default async function AboutPage() {
  const { welcome, givingBack } = await getAboutSections();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with TRUE Parallax Effect */}
      <ParallaxSection 
        backgroundImage="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1920&h=1200"
        minHeight="tall"
        overlay={true}
        overlayColor="bg-black"
        overlayOpacity="bg-opacity-60"
      >
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
            "Chúng tôi chỉ thực sự phát triển<br />
            khi spa của bạn vận hành tốt hơn."
          </h1>
        </div>
      </ParallaxSection>

      {/* Welcome Section */}
      {welcome && (
        <FadeInSection delay={200}>
          <section className="bg-gradient-to-br from-gray-50 to-purple-50 py-16">
            <div className="container-custom">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div>
                  {welcome.title && (
                    <h2 className="mb-6 text-3xl font-bold text-gray-900">{welcome.title}</h2>
                  )}
                  {welcome.content && (
                    <div 
                      className="space-y-4 text-gray-700 prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: welcome.content }}
                    />
                  )}
                  {welcome.button_text && (
                    <div className="mt-8">
                      <Button size="lg" href={welcome.button_link || '#'}>
                        {welcome.button_text}
                      </Button>
                    </div>
                  )}
                </div>

                {welcome.image_url && (
                  <div className="relative rounded-lg bg-white p-8 shadow-xl">
                    <Image
                      src={welcome.image_url}
                      alt={welcome.title || 'Welcome'}
                      width={600}
                      height={400}
                      className="mb-4 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </FadeInSection>
      )}

      {/* The UCo Difference */}
      <FadeInSection delay={300}>
        <section className="py-16">
          <div className="container-custom">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Điều làm chúng tôi khác biệt
            </h2>
            <p className="mb-12 text-center text-lg text-gray-600">
              Mọi quyết định – từ chọn nhà sản xuất, tiêu chuẩn kiểm định, đến nội dung đào tạo – đều xoay quanh nhu cầu thực tế của chủ spa và kỹ thuật viên. Không hứa suông, chỉ tập trung mang lại hiệu quả vận hành đo lường được.
            </p>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {/* We are a full solutions provider */}
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200">
                    <svg className="h-10 w-10 text-brand-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Giải pháp trọn gói – không chỉ bán thiết bị
                </h3>
                <p className="text-gray-600">
                  Từ khảo sát mặt bằng, bố trí quy trình dịch vụ, lập ngân sách thiết bị theo giai đoạn tăng trưởng, cho tới đào tạo sử dụng & bảo trì. Mỗi thiết bị đều gắn vào một mục tiêu tài chính / trải nghiệm khách hàng cụ thể, tránh “mua thừa” hoặc chọn sai công suất.
                </p>
              </div>

              {/* We read labels */}
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">Kiểm định & minh bạch thành phần</h3>
                <p className="text-gray-600">
                  Mỗi sản phẩm skincare đều được đối chiếu thành phần: tính an toàn, nồng độ hoạt chất, chứng nhận (Cruelty-Free, Vegan, Organic). Từ “thiên nhiên” hay “hữu cơ” không phải khẩu hiệu marketing – chúng tôi yêu cầu tài liệu xác thực hoặc kết quả kiểm nghiệm của bên thứ ba.
                </p>
              </div>

              {/* We train and educate */}
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                    <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">Đào tạo chuẩn hoá & nâng cao</h3>
                <p className="text-gray-600">
                  Chúng tôi xây dựng thư viện micro-learning (video ngắn quy trình), tài liệu SOP phòng trị liệu, workshop chuyên sâu (khai thác thiết bị đa chức năng, upsell dịch vụ). Mục tiêu: rút ngắn thời gian “onboarding” nhân sự mới và gia tăng tỷ lệ sử dụng tối ưu của thiết bị cao cấp.
                </p>
              </div>

              {/* We are staffed by pros */}
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-pink-200">
                    <svg className="h-10 w-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Đội ngũ thực hành – không chỉ bán hàng
                </h3>
                <p className="text-gray-600">
                  Chuyên viên của chúng tôi từng trực tiếp vận hành hoặc tư vấn tại các spa, thẩm mỹ viện. Họ hiểu rõ sự khác nhau giữa thông số “trên giấy” và hiệu quả thực tế. Bạn nhận được khuyến nghị dựa trên trải nghiệm sử dụng thật – không phải catalogue nhà sản xuất.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Giving Back */}
      {givingBack && (
        <FadeInSection delay={100}>
          <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
            <div className="container-custom">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {givingBack.image_url && (
                  <div>
                    <Image
                      src={givingBack.image_url}
                      alt={givingBack.title || 'Giving Back'}
                      width={600}
                      height={400}
                      className="rounded-lg shadow-xl"
                    />
                  </div>
                )}
                <div>
                  {givingBack.title && (
                    <h2 className="mb-6 text-3xl font-bold text-gray-900">{givingBack.title}</h2>
                  )}
                  {givingBack.content && (
                    <div 
                      className="mb-4 text-gray-700 prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: givingBack.content }}
                    />
                  )}
                  {givingBack.list_items && givingBack.list_items.length > 0 && (
                    <ul className="space-y-2 text-gray-700">
                      {givingBack.list_items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-brand-purple-600">•</span>
                          <span>
                            {item.title && <strong>{item.title}:</strong>} {item.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>
      )}

      {/* Timeline */}
      <FadeInSection delay={200}>
        <section className="py-16">
          <div className="container-custom">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Hành trình phát triển</h2>
            <p className="mb-12 text-center text-lg text-gray-600">
              Hơn 40 năm kinh nghiệm quốc tế trong chuỗi cung ứng & hỗ trợ vận hành spa – nay được bản địa hoá phù hợp thị trường Việt Nam.
            </p>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-brand-purple-600">1982</div>
                <p className="text-gray-700">
                  Khởi nguồn từ một đơn vị cung ứng vật tư làm đẹp quy mô nhỏ tại Hoa Kỳ, tập trung vào sản phẩm móng & chăm sóc cơ bản – đặt nền tảng cho hệ thống phân phối chuyên biệt sau này.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-brand-purple-600">1992</div>
                <p className="text-gray-700">
                  Phát hành catalogue sản phẩm chuyên nghiệp đầu tiên: tiêu chuẩn hoá thông tin kỹ thuật, quy trình đặt hàng và hỗ trợ sau bán – tạo bước nhảy cho mở rộng quy mô.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-brand-purple-600">Hiện tại</div>
                <p className="text-gray-700">
                  Mạng lưới phục vụ hơn 84,000 chuyên gia spa tại nhiều quốc gia. Tại Việt Nam, chúng tôi tập trung vào: cung ứng thiết bị chuyên nghiệp, tối ưu hoá chi phí đầu tư, đào tạo thực tế & nâng chuẩn quy trình vận hành bền vững.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
