/**
 * Outbound links, tracking config, and the routes this marketing site expects Stage 4 to own.
 *
 * Stage 3 (Site Architect) module. Kept separate from `site.ts` so Stage 1's content file stays
 * the content file and this stays the wiring file.
 */

import { site } from './site';

/**
 * R14. Every SALES or CONVERSION CTA on this site routes to Himay Studio WhatsApp, never to the
 * fictional brand's own number, and never to a 0 prefixed `wa.me/085...` which is a dead link.
 *
 * `context` is the clicked button's OWN context, so the lead arrives already knowing what the
 * visitor was looking at. The body is built with `encodeURIComponent`, never hand encoded.
 *
 * Scope, so nobody widens this by accident: a button becomes a WhatsApp lead when its job is to
 * convert the visitor into a customer (Pesan, Booking, Cek Ketersediaan, Minta Penawaran,
 * Konsultasi). A button that NAVIGATES or demonstrates a working feature stays functional:
 * nav links, tabs, accordions, the gallery thumbnails, the date picker, the welcome modal
 * controls, and the Stage 4 reservation panel, login and guest portal demos.
 */
export function waLink(context: string): string {
  const body =
    `Hi saya tertarik dengan ${context}. ` +
    `Saya lihat demo website ${site.name} di ${site.url}, ` +
    `sebuah demo portofolio dari himaystudio.com.`;
  return `https://wa.me/${site.himayWhatsapp}?text=${encodeURIComponent(body)}`;
}

/**
 * R36 tracking plumbing. Env driven and NO OP SAFE: when a value is absent the component that
 * reads it renders nothing, the build never fails, and nothing blocks render.
 *
 * The GTM container id is a constant rather than an env var because it is the same shared
 * container on every portfolio subdomain, which is how GA4 rolls himaystudio.com and every
 * portfolio site up into one property.
 */
export const TRACKING = {
  gtmId: 'GTM-WZJZTSKG',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
  /** Pages Function that forwards the server side CAPI event. See functions/api/meta-events.ts. */
  capiEndpoint: '/api/meta-events',
} as const;

/**
 * Routes that belong to Webapp Architect (Stage 4), not to this stage.
 *
 * The marketing site links to them, so they are declared here in ONE place. Stage 4 owns
 * everything under `/app`, and Stage 3 must not create placeholder pages there or the two
 * stages collide. R59 note for Stage 8: these paths are part of the internal link crawl, and
 * they only resolve once Stage 4 has shipped.
 */
export const APP_ROUTES = {
  /** Reservation panel, the R8 dashboard. Left sidebar, multiple views, Stage 4's standard. */
  panel: '/app/',
  /** Demo login. Functional per R14, never a WhatsApp link. */
  masuk: '/app/masuk/',
  /** Guest portal, where a booking code resolves to a stay. */
  portal: '/app/portal/',
} as const;
