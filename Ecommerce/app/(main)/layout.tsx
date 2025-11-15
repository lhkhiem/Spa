import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-[120px]">{children}</main>
      <Footer />
    </>
  );
}
