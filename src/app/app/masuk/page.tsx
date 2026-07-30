import type { Metadata } from 'next';
import MasukDemo from '@/components/app/MasukDemo';

export const metadata: Metadata = { title: 'Masuk' };

export default function Page() {
  return <MasukDemo />;
}
