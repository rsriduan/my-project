import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveChatWidget from '@/components/LiveChatWidget';

export const metadata: Metadata = {
  title: 'DELIED — Fashion Haute Couture & Business Management Platform',
  description: 'Luxury Bangladeshi Fashion, Reseller Ecosystem, Wholesale Purchasing, and Integrated Company ERP.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-white text-[#171936]">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <LiveChatWidget />
        </AppProvider>
      </body>
    </html>
  );
}
