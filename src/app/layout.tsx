import type { Metadata, Viewport } from 'next';
import { Figtree, Newsreader } from 'next/font/google';
import './globals.css';
import { site } from '@/data/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import PageShell from '@/components/PageShell';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ClientEffects from '@/components/ClientEffects';
import WelcomeModal from '@/components/WelcomeModal';
import FloatingCta from '@/components/FloatingCta';
import { GtmHead, GtmNoScript, MetaPixel } from '@/components/Analytics';

/* DESIGN.md section 4. Newsreader is the display face, a warm editorial serif that reads as a
   place with a story rather than a resort chain. Figtree carries the UI, body and every numeral,
   because it holds up at 13px in the rate table. Both self hosted through next/font, so there is
   no layout shift and no third party request. */
const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

/* R35(b): self canonical to the portfolio subdomain, because Lembayung is a fictional showcase
   brand with no real client site. site.clientDomain is null and MUST stay null here. For a LIVE
   paying client it is set instead, and the canonical points at their real domain so Google never
   penalises them for duplicate content against this near identical copy. */
const canonical = site.clientDomain ?? site.url;

/* R35(a): the branded portfolio title and description. No em dash, no en dash, R11. */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.metaTitle,
    template: `%s | ${site.metaTitle}`,
  },
  description: site.metaDescription,
  applicationName: site.name,
  alternates: { canonical },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: canonical,
    siteName: site.name,
    title: site.metaTitle,
    description: site.metaDescription,
    images: [{ url: '/og-lembayung.jpg', width: 1200, height: 630, alt: site.lockup }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.metaTitle,
    description: site.metaDescription,
    images: ['/og-lembayung.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#221A3A',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${newsreader.variable} ${figtree.variable}`}>
      <head>
        {/* R36: GTM as high in the head as the framework allows */}
        <GtmHead />
      </head>
      <body>
        {/* R36: the noscript iframe immediately after the opening body tag */}
        <GtmNoScript />
        <MetaPixel />

        <a className="skip" href="#konten">
          Lewati ke konten utama
        </a>

        <AnnouncementBar />
        <Header />
        {/* R46: PageShell keys the fade and rise on the pathname, so every route change animates */}
        <PageShell>{children}</PageShell>
        <Footer />

        {/* R53: every full viewport overlay lives OUT here, as a sibling of <header>. The three
            below additionally portal themselves to document.body. Nesting any of them inside the
            blurred header makes the header their containing block and collapses them to a 76px
            strip across the topbar. */}
        <WhatsAppFloat />
        <FloatingCta />
        <WelcomeModal />
        <ClientEffects />
      </body>
    </html>
  );
}
