import type { Metadata } from 'next';
import { iso } from '@/lib/tanggal';
import PortalTamu from '@/components/app/PortalTamu';

export const metadata: Metadata = { title: 'Portal Tamu' };

export default function Page() {
  return <PortalTamu hariIni={iso(new Date())} />;
}
