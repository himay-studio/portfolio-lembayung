/* R10: the ONE oval on this site, everything else is border-radius 0.
 * R17: the icon is the shared public/img/whatsapp.png asset (512x512 PNG), already committed to
 *      this repo at Stage 2. Never a hand drawn inline SVG glyph and never a substitute icon.
 * R45: on desktop (>=1025px) this renders as icon PLUS a CTA label pill, and collapses to the
 *      icon only oval below 1025px. The label element is always in the DOM, CSS controls it.
 * R14: it routes to Himay Studio WhatsApp, not to the fictional brand's number.
 */

import { site } from '@/data/site';
import { waLink } from '@/data/links';

export default function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={waLink('pemesanan menginap di Lembayung')}
      target="_blank"
      rel="noopener"
      aria-label={`Chat ${site.name} di WhatsApp`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/whatsapp.png" alt="" width={32} height={32} />
      <span className="wa-float-label">Chat Kami</span>
    </a>
  );
}
