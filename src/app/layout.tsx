import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileNav } from '@/components/MobileNav';

export const metadata: Metadata = {
  title: 'KitConnect — Electronic Precision Gadget Accessories Storefront',
  description:
    'High-performance gadget accessories laboratory with fast regional delivery and tactile dark mode aesthetic.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-on-surface antialiased min-h-screen flex flex-col justify-between">
        <CartProvider>
          <Header />
          <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-8 py-6">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </CartProvider>
      </body>
    </html>
  );
}
