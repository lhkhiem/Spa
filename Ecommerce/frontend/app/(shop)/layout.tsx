import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop/ScrollToTop';
import ContactFormSection from '@/components/layout/ContactFormSection/ContactFormSection';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-[120px]">{children}</main>
      <ContactFormSection />
      <Footer />
      <ScrollToTop />
    </>
  );
}
