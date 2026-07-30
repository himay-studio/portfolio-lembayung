import type { Metadata } from 'next';
import '@/styles/app.css';
import AppShell from '@/components/app/AppShell';
import { iso } from '@/lib/tanggal';

/* `/app` is disallowed in robots.ts and deliberately omitted from the sitemap: a reservation
   panel and a guest portal are not search results anybody wants. This repeats that intent in
   the page metadata so it holds even if the crawler ignores robots.txt. */
export const metadata: Metadata = {
  title: 'Panel Reservasi',
  description:
    'Panel reservasi demo Lembayung. Kalender ketersediaan, tabel, papan status dan portal tamu.',
  robots: { index: false, follow: false },
};

/* Applied BEFORE first paint, so a returning visitor whose sidebar was collapsed never sees the
   wide sidebar render and then snap to a rail. React syncs its own state from the same key in
   an effect, see AppShell. */
const RAIL_BOOT = `try{var v=localStorage.getItem('lembayung_app_rail');document.documentElement.setAttribute('data-app-rail',v==='1'?'1':'0');}catch(e){}`;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  /* Read ONCE here, on the server, at build time, and passed down as a plain string. Nothing
     under /app reads the clock during render, so the prerendered HTML and the hydrated client
     always derive the same demo dataset. */
  const hariIni = iso(new Date());
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: RAIL_BOOT }} />
      <AppShell hariIni={hariIni}>{children}</AppShell>
    </>
  );
}
