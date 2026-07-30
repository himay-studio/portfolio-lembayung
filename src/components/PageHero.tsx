/* Interior page hero. Dusk ground with a breadcrumb, used on every route except the home page.
 *
 * DESIGN.md section 1: the violet dusk ground is RATIONED. This hero plus the footer are two of
 * the at most four dark surfaces allowed on an interior page, so a page that adds this hero may
 * add at most two further `.band-dark` sections. If a page reads broadly dark, that page is wrong.
 *
 * R50: the eyebrow, the h1 and the lead are all block level with real margins, and the breadcrumb
 * is its own block, so nothing glues to anything.
 */

import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string;
}

export default function PageHero({
  eyebrow,
  title,
  lead,
  crumbs = [],
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="pagehero on-dark">
      <div className="wrap">
        {crumbs.length > 0 && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Beranda</Link>
            {crumbs.map((c) => (
              <span key={c.label}>
                {' / '}
                {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
              </span>
            ))}
          </nav>
        )}
        <span className="eyebrow eyebrow-inv">{eyebrow}</span>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </section>
  );
}
