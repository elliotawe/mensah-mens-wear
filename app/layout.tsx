import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Montserrat } from 'next/font/google';
import './globals.css';
import { BasketProvider } from '@/context/BasketContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BasketDrawer } from '@/components/basket/BasketDrawer';
import { ToastProvider } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mensah.vercel.app'),
  title: {
    default: 'Mensah — Luxury Tailored Menswear | Ghana',
    template: '%s | Mensah',
  },
  description:
    'Mensah crafts luxury tailored menswear for the discerning Ghanaian gentleman. Browse our bespoke collection and order via WhatsApp.',
  keywords: ['luxury menswear', 'tailored suits', 'Ghana fashion', 'bespoke menswear', 'Mensah', 'Accra fashion'],
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    siteName: 'Mensah',
    title: 'Mensah — Luxury Tailored Menswear',
    description: 'Bespoke menswear crafted for the discerning Ghanaian gentleman.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Mensah Luxury Menswear' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        cormorant.variable,
        dmSans.variable,
        montserrat.variable,
        'antialiased'
      )}
    >
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-gold focus:text-obsidian focus:text-sm focus:font-medium">
          Skip to content
        </a>
        <BasketProvider>
          <ToastProvider>
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
            <BasketDrawer />
          </ToastProvider>
        </BasketProvider>
      </body>
    </html>
  );
}
