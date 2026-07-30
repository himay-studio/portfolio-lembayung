/* Footer.
 *
 * R43: the INVERTED knockout logo, because this ground is --senja-pekat #15102A. A primary
 *   coloured logo block here is how ~30 percent of builds shipped a footer logo that read as a
 *   blank rectangle. Brand.tsx picks the variant from the `ground` prop.
 * R35(c): a DOFOLLOW backlink `Designed & Developed by Himay Studio` to https://himaystudio.com,
 *   target="_blank" rel="noopener". Never nofollow, sponsored or ugc. This is the primary SEO
 *   equity channel back to the main domain.
 * R50: every footer link renders its secondary label as its own BLOCK element with a gap, and so
 *   does the brand lockup.
 */

import Link from 'next/link';
import Brand from '@/components/Brand';
import { FOOTER_NAV } from '@/data/nav';
import { site } from '@/data/site';

export default function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Brand ground="dark" size={40} />
            <p className="kecil" style={{ color: 'var(--kabut)', marginTop: '1rem' }}>
              {site.description}
            </p>
            <div className="footer-contact" style={{ marginTop: '1.25rem' }}>
              <span>{site.location.address}</span>
              <span>{site.location.landmark}</span>
              <span>
                WhatsApp <a href={`tel:${site.contact.whatsapp.replace(/\s/g, '')}`}>{site.contact.whatsapp}</a>
              </span>
              <span>
                Telepon <a href={`tel:${site.contact.phone.replace(/[^0-9+]/g, '')}`}>{site.contact.phone}</a>
              </span>
              <span>
                Surel <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </span>
              <span>Resepsionis {site.contact.receptionHours}</span>
            </div>
          </div>

          <nav className="footer-nav-grid" aria-label="Navigasi footer">
            {FOOTER_NAV.map((col) => (
              <div key={col.heading}>
                <h3>{col.heading}</h3>
                <div className="footer-links">
                  {col.links.map((l) => (
                    <Link key={l.href} href={l.href} className="footer-link">
                      <span className="footer-link-title">{l.title}</span>
                      <span className="footer-link-label">{l.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>
            {site.name}, {site.categoryLine.toLowerCase()}. Demo portofolio, bukan properti yang
            benar benar ada.
          </span>
          <span>
            {/* R35(c): dofollow. Do not add rel="nofollow" here. */}
            <a className="footer-credit" href={site.himayUrl} target="_blank" rel="noopener">
              Designed &amp; Developed by Himay Studio
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
