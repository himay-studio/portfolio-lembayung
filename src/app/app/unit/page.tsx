import type { Metadata } from 'next';
import { iso } from '@/lib/tanggal';
import InventarisWorkspace from '@/components/app/InventarisWorkspace';

export const metadata: Metadata = { title: 'Inventaris Unit' };

export default function Page() {
  return <InventarisWorkspace hariIni={iso(new Date())} />;
}
