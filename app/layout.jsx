import './globals.css';
import { Poppins } from 'next/font/google';
import Analytics from '@/components/Analytics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/site';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Professional Cleaning Services in Leeds`,
    template: `%s | ${SITE.name}`,
  },
  description:
    'Professional domestic, deep, Airbnb, end of tenancy, commercial and pressure washing cleaning services across Leeds, Bradford, York, Wakefield, Harrogate and Yorkshire.',
  alternates: { canonical: '/' },
  openGraph: {
    title: SITE.name,
    description: 'Professional Cleaning Services You Can Trust',
    url: SITE.url,
    siteName: SITE.name,
    locale: 'en_GB',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: SITE.name },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#0f766e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className={poppins.variable}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-nvg-700 focus:px-5 focus:py-3 focus:font-bold focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <div id="main">{children}</div>
        <Footer />
        {/*
          Only mounted when a real measurement ID is configured. Analytics
          itself stays behind an explicit opt-in — see components/Analytics.
        */}
        {SITE.gaId ? <Analytics gaId={SITE.gaId} /> : null}
      </body>
    </html>
  );
}
