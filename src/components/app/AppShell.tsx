'use client';

/**
 * The panel shell: persistent left sidebar, topbar, and the mobile drawer.
 *
 * App standard 1: navigation is a PERSISTENT LEFT SIDEBAR, not a topbar. This is an
 * application, not a landing page, so R16's mega menu contract deliberately does not apply
 * here. The sidebar collapses to an icon rail and the collapsed state survives between visits.
 *
 * Two implementation notes that are load bearing:
 *
 * - The rail state is written to `document.documentElement` and read by CSS, and it is applied
 *   BEFORE first paint by a small inline script in the /app layout. Keeping it out of React
 *   render means a returning visitor never sees the wide sidebar flash to a rail after
 *   hydration, and there is no server/client render disagreement to hydrate around.
 * - The sidebar is `position: sticky`, not `position: fixed`. Sticky has no containing block
 *   problem, and the route wrapper this shell lives inside animates a transform (site.css
 *   `.page-enter`), which WOULD capture a fixed child while the animation runs. The mobile
 *   drawer, which genuinely has to be fixed, is portalled to document.body instead (R53).
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { site } from '@/data/site';
import { panjang } from '@/lib/tanggal';
import { Ikon, Overlay, initial } from './bits';
import { APP_NAV, itemAktif } from './nav';
import { useSesi } from './session';

const RAIL_KEY = 'lembayung_app_rail';

function NavList({ aktif, onPilih }: { aktif: string; onPilih?: () => void }) {
  return (
    <nav className="app-nav" aria-label="Navigasi panel">
      {APP_NAV.map((g) => (
        <div className="app-nav-group" key={g.judul}>
          <span className="app-nav-head">{g.judul}</span>
          <ul className="app-nav-list">
            {g.items.map((it) => {
              const on = aktif === it.href;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={`app-nav-link ${on ? 'is-active' : ''}`}
                    aria-current={on ? 'page' : undefined}
                    onClick={onPilih}
                  >
                    <Ikon name={it.ikon} className="app-nav-ikon" />
                    {/* R50: the label and its description are separate BLOCK children with a
                        gap. Two inline nodes here render as `ReservasiKalender, tabel`. */}
                    <span className="app-nav-teks">
                      <span className="app-nav-label">{it.label}</span>
                      <span className="app-nav-ket">{it.ket}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function AppShell({
  hariIni,
  children,
}: {
  /** ISO yyyy-mm-dd, computed once on the server so nothing reads the clock during render. */
  hariIni: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const aktif = itemAktif(pathname ?? '/app/');
  const [drawer, setDrawer] = useState(false);
  const [rail, setRail] = useState(false);
  const { sesi, keluar } = useSesi();

  /* sync from storage after mount. The inline boot script already applied the attribute on a
     full page load; this covers a client side navigation into /app and keeps aria-pressed
     honest, which is the R60 contract applied to a toggle. */
  useEffect(() => {
    try {
      const on = localStorage.getItem(RAIL_KEY) === '1';
      setRail(on);
      document.documentElement.setAttribute('data-app-rail', on ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, []);

  const toggleRail = useCallback(() => {
    setRail((v) => {
      const next = !v;
      document.documentElement.setAttribute('data-app-rail', next ? '1' : '0');
      try {
        localStorage.setItem(RAIL_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  /* close the drawer on navigation, so a tap on a drawer link does not leave it open over the
     page it just opened */
  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  const lockup = (
    <>
      <span className="app-mark" aria-hidden="true">
        L
      </span>
      {/* R50: wordmark and category line are blocks. An inline <small> here renders the single
          line `LembayungPANEL RESERVASI`, which is the exact shape measured on Mabrur. */}
      <span className="app-lockup">
        <span className="app-word">{site.name}</span>
        <span className="app-kategori">Panel Reservasi</span>
      </span>
    </>
  );

  return (
    <div className="app-shell">
      <aside className="app-side on-dark">
        <Link href="/" className="app-brand" aria-label={`${site.name}, kembali ke situs utama`}>
          {lockup}
        </Link>

        <NavList aktif={aktif} />

        <div className="app-side-foot">
          <div className="app-user">
            <span className="app-avatar" aria-hidden="true">
              {initial(sesi.nama)}
            </span>
            <div>
              <span className="app-user-nama">{sesi.nama}</span>
              <span className="app-user-peran">{sesi.peran}</span>
            </div>
          </div>
          {sesi.masuk ? (
            <button type="button" className="app-rail-btn" onClick={keluar} style={{ marginBottom: '0.5rem' }}>
              <span>Keluar dari sesi</span>
            </button>
          ) : null}
          <button type="button" className="app-rail-btn" aria-pressed={rail} onClick={toggleRail}>
            <Ikon name="panah" className="app-rail-ikon" />
            <span>Ciutkan sidebar</span>
          </button>
        </div>
      </aside>

      <div className="app-main">
        {/* R47 and R52: one clean flex row, fixed height, every child in its own slot, and the
            brand lockup appears exactly once at any width. The sidebar carries it on desktop,
            this bar carries it below 1025px, and the drawer deliberately carries none. */}
        <div className="app-top">
          <button
            type="button"
            className="app-burger"
            aria-label="Buka navigasi panel"
            aria-expanded={drawer}
            aria-controls="app-drawer"
            onClick={() => setDrawer((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <Link href="/app/" className="app-top-brand">
            {lockup}
          </Link>

          <span className="app-top-spacer" />

          <span className="app-top-tanggal">{panjang(hariIni)}</span>

          <div className="app-sesi">
            <div className="app-sesi-nama">
              <b>{sesi.nama}</b>
              <span>{sesi.peran}</span>
            </div>
            <span className="app-avatar" aria-hidden="true">
              {initial(sesi.nama)}
            </span>
          </div>
        </div>

        <div className="app-page">{children}</div>
      </div>

      {/* R53: portalled to document.body, so nothing in the ancestor chain can clip it, and
          R57: fully unmounted while closed, so it contributes no layout at all. */}
      <Overlay
        open={drawer}
        onClose={() => setDrawer(false)}
        label="Navigasi panel"
        panelClass="app-drawer on-dark"
        id="app-drawer"
      >
        <div className="app-drawer-head">
          <span className="app-drawer-judul">Panel Reservasi</span>
          <button type="button" className="app-tutup" onClick={() => setDrawer(false)} aria-label="Tutup navigasi">
            &#10005;
          </button>
        </div>
        <NavList aktif={aktif} onPilih={() => setDrawer(false)} />
        <div className="app-side-foot">
          <div className="app-user">
            <span className="app-avatar" aria-hidden="true">
              {initial(sesi.nama)}
            </span>
            <div>
              <span className="app-user-nama">{sesi.nama}</span>
              <span className="app-user-peran">{sesi.peran}</span>
            </div>
          </div>
          <Link href="/" className="btn btn-outline-inv btn-sm btn-block">
            Kembali ke situs
          </Link>
        </div>
      </Overlay>
    </div>
  );
}
