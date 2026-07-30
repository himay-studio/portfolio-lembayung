/**
 * Sidebar structure for the reservation panel.
 *
 * Declared in ONE place because two things read it: the persistent desktop sidebar and the
 * mobile drawer. A second hand maintained copy is how a route ends up reachable from one and
 * not the other, which R59 then reports as an orphan.
 *
 * Every href here is also the R59 contract: each of these routes must be linked from at least
 * one rendered page, and the sidebar is what guarantees that for the panel only routes.
 */

import type { IconName } from './bits';

export interface AppNavItem {
  href: string;
  label: string;
  /** R50: this renders as its OWN block under the label, never as an inline sibling. */
  ket: string;
  ikon: IconName;
}

export interface AppNavGroup {
  judul: string;
  items: AppNavItem[];
}

export const APP_NAV: AppNavGroup[] = [
  {
    judul: 'Operasional',
    items: [
      {
        href: '/app/',
        label: 'Reservasi',
        ket: 'Kalender, tabel, kartu, papan',
        ikon: 'kalender',
      },
      {
        href: '/app/unit/',
        label: 'Inventaris Unit',
        ket: 'Lima belas varian di lima teras',
        ikon: 'unit',
      },
      {
        href: '/app/tamu/',
        label: 'Tamu',
        ket: 'Riwayat menginap dan belanja',
        ikon: 'tamu',
      },
    ],
  },
  {
    judul: 'Sisi tamu',
    items: [
      {
        href: '/app/portal/',
        label: 'Portal Tamu',
        ket: 'Yang dilihat tamu sendiri',
        ikon: 'tiket',
      },
      {
        href: '/app/masuk/',
        label: 'Halaman Masuk',
        ket: 'Demo login resepsionis',
        ikon: 'kunci',
      },
    ],
  },
];

/** Longest match wins, so `/app/unit/` never highlights `/app/`. */
export function itemAktif(pathname: string): string {
  const semua = APP_NAV.flatMap((g) => g.items.map((i) => i.href));
  let best = '';
  for (const href of semua) {
    if (pathname === href || pathname.startsWith(href)) {
      if (href.length > best.length) best = href;
    }
  }
  return best || '/app/';
}
