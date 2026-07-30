import type { Metadata } from 'next';
import { iso } from '@/lib/tanggal';
import TamuWorkspace from '@/components/app/TamuWorkspace';

export const metadata: Metadata = { title: 'Tamu' };

export default function Page() {
  return <TamuWorkspace hariIni={iso(new Date())} />;
}
