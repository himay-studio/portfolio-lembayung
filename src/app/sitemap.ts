import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { units } from '@/data/units';
import { packages } from '@/data/packages';
import { articles } from '@/data/articles';

/* Required by `output: export`: without it Next refuses to collect this route, because a
   metadata route defaults to dynamic and a static export has nowhere to run it. */
export const dynamic = 'force-static';


/* Sitemap for every MARKETING route.
 *
 * Stage 4 owns `/app` and its routes are deliberately absent: a reservation panel, a login and a
 * guest portal are not pages Google should index. If Stage 4 wants them listed it should add them
 * itself, but the correct answer is almost certainly no.
 *
 * R59 reverse check: every route in this list is also linked from at least one page, so nothing on
 * this site is an orphan. `next build` with output: export writes this to /sitemap.xml.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, '');
  const stat = [
    '/',
    '/unit/',
    '/paket/',
    '/kegiatan/',
    '/galeri/',
    '/tentang/',
    '/cerita/',
    '/lokasi/',
    '/faq/',
    '/kontak/',
    '/kebijakan/pembatalan/',
    '/kebijakan/syarat/',
    '/kebijakan/privasi/',
  ];

  return [
    ...stat.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.7,
    })),
    ...units.map((u) => ({
      url: `${base}/unit/${u.slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...packages.map((p) => ({
      url: `${base}/paket/${p.slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      url: `${base}/cerita/${a.slug}/`,
      lastModified: a.date,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
