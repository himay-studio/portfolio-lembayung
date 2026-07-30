/**
 * Information architecture for the marketing site.
 *
 * Stage 3 owns the final IA. `site.primaryNav` in `site.ts` was a Stage 1 starting point; this
 * file supersedes it, and the footer reads from here so the two can never drift.
 *
 * The IA is driven by the three audiences in BRAND.md section 2:
 *   1. couples deciding on photographs and whether the bathroom is private -> Menginap
 *   2. families deciding on safety and whether the child will be bored     -> Pengalaman
 *   3. panitia deciding on capacity, rundown and a quotation               -> Rencanakan
 *
 * R16 / R32: exactly three of the four top level items open a mega panel, and each panel
 * declares its own R16.1 anchor. The leftmost grows RIGHT from left:0, the rightmost grows LEFT
 * from right:0, and the middle one centres with a viewport clamp plus a measured nudge.
 * R50: every panel link carries a `label` that renders as its OWN block element under the title.
 * Titles and labels are written so the LONGEST string in the data still reads on two lines.
 */

import { activities } from './activities';
import { packages } from './packages';
import { rupiah } from './types';
import { startingPrice, units } from './units';
import { APP_ROUTES } from './links';

export interface NavLink {
  href: string;
  /** First line. */
  title: string;
  /** Second line. Rendered as its own block element with a gap, R50. */
  label: string;
}

export interface NavGroup {
  heading: string;
  links: NavLink[];
}

export interface NavHighlight {
  title: string;
  body: string;
  cta: string;
  href: string;
  /** A conversion CTA routes through waLink (R14). A navigation CTA is a plain internal href. */
  kind: 'konversi' | 'navigasi';
}

export interface NavItem {
  label: string;
  href: string;
  panel?: {
    /** R16.1 geometry. Leftmost is `left`, rightmost is `right`, a true middle item may centre. */
    anchor: 'left' | 'center' | 'right';
    groups: NavGroup[];
    highlight: NavHighlight;
  };
}

const unitLinks: NavLink[] = units.map((u) => ({
  href: `/unit/${u.slug}/`,
  title: u.name,
  label: `Teras ${u.terrace}, mulai ${rupiah(startingPrice(u))}`,
}));

const packageLinks: NavLink[] = packages.map((p) => ({
  href: `/paket/${p.slug}/`,
  title: p.name,
  label: p.duration,
}));

const kegiatanLinks: NavLink[] = activities
  .filter((a) => a.kind === 'kegiatan')
  .map((a) => ({ href: `/kegiatan/#${a.slug}`, title: a.name, label: a.schedule }));

const fasilitasLinks: NavLink[] = activities
  .filter((a) => a.kind === 'fasilitas')
  .map((a) => ({ href: `/kegiatan/#${a.slug}`, title: a.name, label: a.schedule }));

export const NAV: NavItem[] = [
  {
    label: 'Menginap',
    href: '/unit/',
    panel: {
      anchor: 'left',
      groups: [
        { heading: 'Tipe Unit', links: unitLinks },
        { heading: 'Paket', links: packageLinks },
      ],
      highlight: {
        title: 'Tanggal Anda masih kosong?',
        body: 'Sebutkan tanggal dan jumlah orang, kami balas dengan unit yang masih tersedia.',
        cta: 'Tanya Ketersediaan',
        href: 'ketersediaan unit menginap di Lembayung',
        kind: 'konversi',
      },
    },
  },
  {
    label: 'Pengalaman',
    href: '/kegiatan/',
    panel: {
      anchor: 'center',
      groups: [
        { heading: 'Kegiatan', links: kegiatanLinks },
        { heading: 'Fasilitas', links: fasilitasLinks },
      ],
      highlight: {
        title: 'Galeri properti',
        body: 'Lima teras, enam tipe unit, dan jam setengah enam sore yang jadi alasan tempat ini dibangun.',
        cta: 'Buka Galeri',
        href: '/galeri/',
        kind: 'navigasi',
      },
    },
  },
  {
    label: 'Rencanakan',
    href: '/lokasi/',
    panel: {
      anchor: 'right',
      groups: [
        {
          heading: 'Sebelum Datang',
          links: [
            { href: '/lokasi/', title: 'Lokasi dan Rute', label: 'Termasuk 400 meter terakhir yang berbatu' },
            { href: '/faq/', title: 'Pertanyaan Umum', label: 'Dua belas jawaban dengan angkanya' },
            { href: '/kebijakan/pembatalan/', title: 'Pembatalan', label: 'Tiga jenjang, tertulis lengkap' },
            { href: '/kebijakan/syarat/', title: 'Syarat Menginap', label: 'Check in 14.00, check out 12.00' },
          ],
        },
        {
          heading: 'Reservasi',
          links: [
            { href: APP_ROUTES.panel, title: 'Panel Reservasi', label: 'Demo sistem pemesanan' },
            { href: APP_ROUTES.portal, title: 'Portal Tamu', label: 'Lihat pesanan dengan kode booking' },
            { href: '/kontak/', title: 'Kontak', label: 'WhatsApp dibalas dalam 2 jam' },
          ],
        },
      ],
      highlight: {
        title: 'Rombongan dan kantor',
        body: 'Aula beratap kapasitas 80, jadi sesi tetap jalan waktu hujan sore. Penawaran per item dalam 1 hari kerja.',
        cta: 'Lihat Paket Gathering',
        href: '/paket/gathering-kantor/',
        kind: 'navigasi',
      },
    },
  },
  { label: 'Cerita', href: '/cerita/' },
];

/** Footer columns. Separate from NAV because a footer is a sitemap, not a menu. */
export const FOOTER_NAV: NavGroup[] = [
  {
    heading: 'Menginap',
    links: [
      { href: '/unit/', title: 'Semua Tipe Unit', label: 'Enam tipe di lima teras' },
      { href: '/paket/', title: 'Paket', label: 'Berdua, keluarga, kantor, sekolah' },
      { href: '/kegiatan/', title: 'Kegiatan dan Fasilitas', label: 'Delapan hal yang bisa dilakukan' },
      { href: '/galeri/', title: 'Galeri', label: 'Foto properti dan unit' },
    ],
  },
  {
    heading: 'Informasi',
    links: [
      { href: '/tentang/', title: 'Tentang Lembayung', label: 'Kenapa lereng ini, kenapa jam 17.30' },
      { href: '/cerita/', title: 'Cerita dan Panduan', label: 'Enam tulisan dari lapangan' },
      { href: '/lokasi/', title: 'Lokasi dan Rute', label: 'Dari Jakarta dan dari Bandung' },
      { href: '/faq/', title: 'Pertanyaan Umum', label: 'Dua belas jawaban' },
    ],
  },
  {
    heading: 'Reservasi',
    links: [
      { href: APP_ROUTES.panel, title: 'Panel Reservasi', label: 'Demo sistem pemesanan' },
      { href: APP_ROUTES.masuk, title: 'Masuk', label: 'Login demo' },
      { href: APP_ROUTES.portal, title: 'Portal Tamu', label: 'Kode booking dan riwayat' },
      { href: '/kontak/', title: 'Kontak', label: 'WhatsApp, telepon, surel' },
    ],
  },
  {
    heading: 'Kebijakan',
    links: [
      { href: '/kebijakan/pembatalan/', title: 'Pembatalan dan Reschedule', label: 'Tiga jenjang pengembalian' },
      { href: '/kebijakan/syarat/', title: 'Syarat Menginap', label: 'Aturan di properti' },
      { href: '/kebijakan/privasi/', title: 'Kebijakan Privasi', label: 'Data apa yang kami simpan' },
    ],
  },
];
