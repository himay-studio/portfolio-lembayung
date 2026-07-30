'use client';

/* Lembayung header. See LAYOUT-ARCHITECTURE.md section 3 for why this shape and not another.
 *
 * R16 / R32: three of the four desktop nav items open a mega panel. Each opens on HOVER and also
 *   on click, focus and keyboard, closes on Escape and outside click, and animates with a panel
 *   reveal plus a rotating chevron.
 * R16.1: each panel declares its own anchor, leftmost left:0, rightmost right:0, middle centred,
 *   every panel carries max-width: calc(100vw - 2rem) in CSS, and useViewportClamp adds the
 *   measured nudge on top.
 * R60, and this is the subtle one: `aria-expanded` must be TRUE whenever the panel is visibly
 *   open. So the React state and the CSS open condition are the SAME condition, `.nav-item.is-open`
 *   driven by `openPanel`. There is no CSS `:hover .mega` or `:focus-within .mega` rule anywhere,
 *   which is what let Mabrur report `aria-expanded="false"` on all three triggers while they
 *   measured fully open. And the trigger does NOT pair an onFocus opener with an onClick toggler:
 *   focus opens via the wrapper, the button's onClick toggles, and because the wrapper's
 *   mouseenter has already opened the panel before the click lands, the toggle closes it, which
 *   is the correct behaviour for a second click.
 * R53: the scrim and the drawer are rendered as SIBLINGS of <header>. The header sets
 *   backdrop-filter, which makes it the containing block for any position:fixed descendant and
 *   would collapse the drawer into a 76px strip across the topbar. z-index is neither cause nor
 *   cure. Verify by measuring getBoundingClientRect, because the CSS reads identically either way.
 * R47 / R52: the mobile topbar is ONE clean flex row holding only the logo and the burger, so the
 *   two 44px tap targets can never stack or collide, and the logo appears exactly once.
 * R22: the mobile booking CTA lives in the drawer, not squeezed into the topbar.
 * R31: the bar is translucent over the hero, so it carries its own localised top down band and
 *   the nav text is measured against the WORST case video frame. See site.css section 8.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import Brand from '@/components/Brand';
import { NAV } from '@/data/nav';
import { waLink } from '@/data/links';
import { useViewportClamp } from '@/lib/clamp';

function MegaPanel({
  item,
  open,
  panelId,
}: {
  item: (typeof NAV)[number];
  open: boolean;
  panelId: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useViewportClamp(ref, open, '--mega-shift');
  const panel = item.panel;
  if (!panel) return null;

  const highlightHref =
    panel.highlight.kind === 'konversi' ? waLink(panel.highlight.href) : panel.highlight.href;

  return (
    <div
      id={panelId}
      ref={ref}
      className={`mega mega-${panel.anchor}`}
      role="menu"
      aria-label={item.label}
    >
      <div className="mega-inner">
        <div className="mega-cols">
          {panel.groups.map((g) => (
            <div key={g.heading}>
              <span className="mega-group-title">{g.heading}</span>
              {g.links.map((l) => (
                /* R50: title and label are separate BLOCK children with an explicit gap */
                <Link key={l.href + l.title} href={l.href} className="mega-link" role="menuitem">
                  <span className="mega-link-title">{l.title}</span>
                  <span className="mega-link-label">{l.label}</span>
                </Link>
              ))}
            </div>
          ))}
          <div className="mega-highlight">
            <h4>{panel.highlight.title}</h4>
            <p>{panel.highlight.body}</p>
            {panel.highlight.kind === 'konversi' ? (
              /* R14: a conversion CTA routes to Himay Studio WhatsApp */
              <a
                className="btn btn-cta btn-sm"
                href={highlightHref}
                target="_blank"
                rel="noopener"
                role="menuitem"
              >
                {panel.highlight.cta}
              </a>
            ) : (
              /* a NAVIGATION CTA stays a working internal link, R14 scope */
              <Link href={highlightHref} className="btn btn-outline-inv btn-sm" role="menuitem">
                {panel.highlight.cta}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uid = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close every layer on a route change, without an effect */
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setDrawer(false);
    setOpenPanel(null);
    setOpenGroup(null);
  }

  /* lock the page behind the drawer only */
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  /* Escape closes both layers, an outside click closes the mega panel */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenPanel(null);
      setDrawer(false);
    };
    const onDown = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) setOpenPanel(null);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  /* R32: hover opens on desktop, with a short close delay so the pointer can travel from the
     trigger down into the panel without it snapping shut on the way. */
  function hoverOpen(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenPanel(label);
  }
  function hoverClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenPanel(null), 140);
  }

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wrap header-bar">
          {/* R43: the inverted knockout on the dark bar */}
          <Brand ground="dark" />

          <nav className="header-nav" aria-label="Navigasi utama" ref={navRef}>
            {NAV.map((item) => {
              if (!item.panel) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link ${isActive(item.href) ? 'is-active' : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              }
              const open = openPanel === item.label;
              const panelId = `${uid}-panel-${item.label.toLowerCase()}`;
              return (
                <div
                  key={item.href}
                  className={`nav-item ${open ? 'is-open' : ''}`}
                  onMouseEnter={() => hoverOpen(item.label)}
                  onMouseLeave={hoverClose}
                  /* R60(b), and this guard is the whole fix. A bare onFocus opener paired with
                     an onClick toggler cancels itself on a real click, because a click focuses
                     FIRST: focus opens the panel and the click immediately toggles it shut. On a
                     hover capable pointer that is invisible (hover had already opened it), but on
                     TOUCH at >=1025px, where there is no hover, the tap then never latches the
                     panel open at all. `:focus-visible` is the discriminator: browsers set it for
                     keyboard focus and withhold it for a pointer press, so keyboard focus opens
                     the panel and a pointer press leaves the toggle to onClick. */
                  onFocus={(e) => {
                    const t = e.target as HTMLElement;
                    if (typeof t.matches === 'function' && t.matches(':focus-visible')) {
                      hoverOpen(item.label);
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenPanel(null);
                  }}
                >
                  <button
                    type="button"
                    className={`nav-link ${isActive(item.href) ? 'is-active' : ''}`}
                    /* R60: this is the SAME condition the CSS uses to open the panel */
                    aria-expanded={open}
                    aria-haspopup="true"
                    aria-controls={panelId}
                    onClick={() => setOpenPanel(open ? null : item.label)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setOpenPanel(item.label);
                      }
                    }}
                  >
                    {item.label}
                    <span className="nav-caret" aria-hidden="true" />
                  </button>

                  <MegaPanel item={item} open={open} panelId={panelId} />
                </div>
              );
            })}
          </nav>

          <div className="header-actions">
            {/* R20: the header ground is translucent, neither the light canvas nor a solid dark
                section, so it gets its own variant. See site.css section 5. */}
            <Link href="/lokasi/" className="btn btn-outline-head btn-sm hide-sm">
              Lokasi
            </Link>
            {/* R5 / R14: the primary sales CTA, green, routing to Himay Studio WhatsApp */}
            <a
              className="btn btn-cta btn-sm hide-sm"
              href={waLink('pemesanan menginap di Lembayung')}
              target="_blank"
              rel="noopener"
            >
              Pesan Sekarang
            </a>
            {/* R47: at mobile widths the topbar holds ONLY the logo and this burger */}
            <button
              type="button"
              className={`burger ${drawer ? 'is-open' : ''}`}
              onClick={() => setDrawer((v) => !v)}
              aria-label={drawer ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={drawer}
              aria-controls={`${uid}-drawer`}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* R53: the scrim and the drawer are SIBLINGS of <header>, never nested inside it. */}
      <div className={`scrim ${drawer ? 'is-open' : ''}`} onClick={() => setDrawer(false)} aria-hidden="true" />

      <div
        id={`${uid}-drawer`}
        className={`drawer ${drawer ? 'is-open' : ''}`}
        aria-hidden={!drawer}
        role="dialog"
        aria-label="Menu navigasi"
      >
        <div className="drawer-head">
          <Brand ground="dark" size={30} />
          <button type="button" className="burger is-open" onClick={() => setDrawer(false)} aria-label="Tutup menu">
            <span />
          </button>
        </div>

        <div className="drawer-body">
          {NAV.map((item) => {
            if (!item.panel) {
              return (
                <div className="drawer-group" key={item.href}>
                  <Link href={item.href} className="drawer-trigger">
                    {item.label}
                  </Link>
                </div>
              );
            }
            const open = openGroup === item.label;
            const gid = `${uid}-dg-${item.label.toLowerCase()}`;
            return (
              <div className={`drawer-group ${open ? 'is-open' : ''}`} key={item.href}>
                <button
                  type="button"
                  className="drawer-trigger"
                  aria-expanded={open}
                  aria-controls={gid}
                  onClick={() => setOpenGroup(open ? null : item.label)}
                >
                  {item.label}
                  <span className="nav-caret" aria-hidden="true" />
                </button>
                <div className="drawer-panel" id={gid}>
                  <div>
                    {item.panel.groups
                      .flatMap((g) => g.links)
                      .map((l) => (
                        <Link key={l.href + l.title} href={l.href} className="drawer-link">
                          <span className="drawer-link-title">{l.title}</span>
                          <span className="drawer-link-label">{l.label}</span>
                        </Link>
                      ))}
                    <Link href={item.href} className="drawer-link">
                      <span className="drawer-link-title">Lihat semua {item.label}</span>
                      <span className="drawer-link-label">Buka halaman lengkap</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="drawer-group">
            <Link href="/galeri/" className="drawer-trigger">
              Galeri
            </Link>
          </div>
          <div className="drawer-group">
            <Link href="/tentang/" className="drawer-trigger">
              Tentang
            </Link>
          </div>
          <div className="drawer-group">
            <Link href="/faq/" className="drawer-trigger">
              Pertanyaan Umum
            </Link>
          </div>
          <div className="drawer-group">
            <Link href="/kontak/" className="drawer-trigger">
              Kontak
            </Link>
          </div>
        </div>

        <div className="drawer-foot">
          {/* R22: the mobile CTA lives HERE, with its real label and full tap target */}
          <a
            className="btn btn-cta btn-block"
            href={waLink('pemesanan menginap di Lembayung')}
            target="_blank"
            rel="noopener"
          >
            Pesan Sekarang
          </a>
          <Link href="/unit/" className="btn btn-outline-inv btn-block">
            Lihat Tipe Unit
          </Link>
        </div>
      </div>
    </>
  );
}
