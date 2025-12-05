import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import Button from '@/components/ui/Button/Button';
import ParallaxSection from '@/components/ui/ParallaxSection/ParallaxSection';
import { getPageMetadataFromCMS, generatePageMetadata } from '@/lib/utils/pageMetadata';
import { getApiUrl } from '@/config/site';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageMetadataFromCMS('/about');
  console.log('[About Page] CMS metadata:', data ? 'Found' : 'Not found, using fallback');
  
  return generatePageMetadata(data, '/about', {
    title: 'Về Chúng Tôi - Banyco Spa Solutions',
    description: 'Giới thiệu Banyco – đối tác cung cấp giải pháp & thiết bị spa chuyên nghiệp, đồng hành phát triển vận hành và tối ưu hoá lợi nhuận.',
    ogImage: '/images/banyco-logo.jpg', // Use logo as fallback OG image
  });
}

interface AboutSection {
  section_key: string;
  title?: string | null;
  content?: string | null;
  image_url?: string | null;
  button_text?: string | null;
  button_link?: string | null;
  list_items?: Array<{ 
    title?: string; 
    description?: string;
    icon_type?: string;
    icon_color?: string;
    year?: string;
  }> | null;
}

async function getAboutSections(): Promise<{ 
  welcome: AboutSection | null; 
  givingBack: AboutSection | null;
  differences: AboutSection | null;
  timeline: AboutSection | null;
}> {
  try {
    const apiBase = getApiUrl();
    const res = await fetch(`${apiBase}/public/about-sections?active_only=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('[getAboutSections] HTTP error:', res.status, res.statusText);
      return { welcome: null, givingBack: null, differences: null, timeline: null };
    }

    const payload = await res.json();
    if (!payload.success || !payload.data || !payload.data.length) {
      console.log('[getAboutSections] No sections found in CMS');
      return { welcome: null, givingBack: null, differences: null, timeline: null };
    }

    const sections = payload.data as AboutSection[];
    const welcome = sections.find(s => s.section_key === 'welcome') || null;
    const givingBack = sections.find(s => s.section_key === 'giving_back') || null;
    const differences = sections.find(s => s.section_key === 'differences') || null;
    const timeline = sections.find(s => s.section_key === 'timeline') || null;

    return { welcome, givingBack, differences, timeline };
  } catch (error: any) {
    console.error('[getAboutSections] Failed to load about sections:', {
      message: error?.message,
      stack: error?.stack,
    });
    return { welcome: null, givingBack: null, differences: null, timeline: null };
  }
}

// Helper function to render icon based on type and color
function renderIcon(iconType: string = 'shield', iconColor: string = 'purple') {
  const colorClasses: Record<string, { bg: string; text: string }> = {
    purple: { bg: 'from-purple-100 to-purple-200', text: 'text-brand-purple-600' },
    green: { bg: 'from-green-100 to-green-200', text: 'text-green-600' },
    blue: { bg: 'from-blue-100 to-blue-200', text: 'text-blue-600' },
    pink: { bg: 'from-pink-100 to-pink-200', text: 'text-pink-600' },
  };
  const colors = colorClasses[iconColor] || colorClasses.purple;

  const iconPaths: Record<string, JSX.Element> = {
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    document: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    book: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    ),
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
  };

  return (
    <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${colors.bg}`}>
      <svg className={`h-10 w-10 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {iconPaths[iconType] || iconPaths.shield}
      </svg>
    </div>
  );
}

export default async function AboutPage() {
  const { welcome, givingBack, differences, timeline } = await getAboutSections();

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

      {/* Section 1: Welcome */}
      {welcome && (
        <FadeInSection delay={200}>
          <section className="bg-gradient-to-br from-gray-50 to-purple-50 py-16">
            <div className="container-custom">
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                  <div>
                    {welcome.title && (
                      <h2 className="mb-6 text-3xl font-bold text-gray-900">
                        {welcome.title}
                      </h2>
                    )}
                    {welcome.content && (
                      <div 
                        className="space-y-4 text-gray-700 prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: welcome.content }}
                      />
                    )}
                    {welcome.button_text && welcome.button_link && (
                      <div className="mt-8">
                        <Button size="lg" href={welcome.button_link}>
                          {welcome.button_text}
                        </Button>
                      </div>
                    )}
                  </div>

                  {welcome.image_url && (
                    <div className="relative rounded-lg bg-white p-8 shadow-xl">
                      <Image
                        src={welcome.image_url}
                        alt={welcome.title || 'Banyco'}
                        width={600}
                        height={400}
                        className="mb-4 rounded-lg w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>
      )}

      {/* Section 2: Điều làm chúng tôi khác biệt */}
      {differences && (
        <FadeInSection delay={300}>
          <section className="py-16">
            <div className="container-custom">
              <div className="mx-auto max-w-7xl">
                {differences.title && (
                  <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
                    {differences.title}
                  </h2>
                )}
                {differences.content && (
                  <p className="mb-12 text-center text-lg text-gray-600 max-w-3xl mx-auto">
                    {differences.content}
                  </p>
                )}

                {differences.list_items && differences.list_items.length > 0 && (
                  <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                    {differences.list_items.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="mb-6 flex justify-center">
                          {renderIcon(item.icon_type, item.icon_color)}
                        </div>
                        {item.title && (
                          <h3 className="mb-4 text-xl font-bold text-gray-900">
                            {item.title}
                          </h3>
                        )}
                        {item.description && (
                          <p className="text-gray-600">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </FadeInSection>
      )}

      {/* Section 3: Giá trị cộng đồng */}
      {givingBack && (
        <FadeInSection delay={100}>
          <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
            <div className="container-custom">
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                  {givingBack.image_url && (
                    <div>
                      <Image
                        src={givingBack.image_url}
                        alt={givingBack.title || 'Giá trị cộng đồng'}
                        width={600}
                        height={400}
                        className="rounded-lg shadow-xl w-full"
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
            </div>
          </section>
        </FadeInSection>
      )}

      {/* Section 4: Hành trình phát triển */}
      {timeline && (
        <FadeInSection delay={200}>
          <section className="py-16">
            <div className="container-custom">
              <div className="mx-auto max-w-7xl">
                {timeline.title && (
                  <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
                    {timeline.title}
                  </h2>
                )}
                {timeline.content && (
                  <p className="mb-12 text-center text-lg text-gray-600 max-w-3xl mx-auto">
                    {timeline.content}
                  </p>
                )}

                {timeline.list_items && timeline.list_items.length > 0 && (
                  <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    {timeline.list_items.map((item, index) => (
                      <div key={index} className="text-center">
                        {item.year && (
                          <div className="mb-4 text-4xl font-bold text-brand-purple-600">
                            {item.year}
                          </div>
                        )}
                        {item.description && (
                          <p className="text-gray-700">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </FadeInSection>
      )}
    </div>
  );
}
