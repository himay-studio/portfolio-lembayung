import type { Metadata } from 'next';
import { iso } from '@/lib/tanggal';
import ReservasiWorkspace from '@/components/app/ReservasiWorkspace';

export const metadata: Metadata = { title: 'Reservasi' };

/* Server component. It reads the clock ONCE here, at build time, and hands the panel a plain
   string. Nothing under /app calls `new Date()` during render, which is what keeps the
   prerendered HTML and the hydrated client deriving the same demo dataset. */
export default function Page() {
  return <ReservasiWorkspace hariIni={iso(new Date())} />;
}
