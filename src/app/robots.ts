import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

/* Required by `output: export`: without it Next refuses to collect this route, because a
   metadata route defaults to dynamic and a static export has nowhere to run it. */
export const dynamic = 'force-static';


/* R35: the portfolio site is indexable, that is the point, and the canonical plus the footer
   backlink are what route the SEO equity. The Stage 4 app routes are disallowed because a
   reservation panel and a guest portal are not search results anybody wants. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/app/'] }],
    sitemap: `${site.url.replace(/\/$/, '')}/sitemap.xml`,
    host: site.url,
  };
}
