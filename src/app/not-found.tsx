import Link from 'next/link';
import { waLink } from '@/data/links';

/* 404. It exists so an R59 crawl gets a real 404 rather than a soft fallback that returns 200,
 * which is how a broken link hides. Stage 8 should test a known bad path such as
 * /zzz-nonexistent/ to prove the 404 is genuine before trusting any link sweep. */
export default function NotFound() {
  return (
    <section className="section band" style={{ minHeight: '58svh' }}>
      <div className="wrap measure">
        <span className="tangga" aria-hidden="true" />
        <span className="eyebrow">Halaman tidak ditemukan</span>
        <h1>Alamat ini tidak ada di Lembayung</h1>
        <p className="lead">
          Mungkin tautannya salah ketik, atau halamannya sudah pindah. Tiga tempat yang paling sering
          dicari ada di bawah.
        </p>
        <div className="btn-row" style={{ marginTop: '1.5rem' }}>
          <Link href="/unit/" className="btn btn-violet">
            Enam tipe unit
          </Link>
          <Link href="/paket/" className="btn btn-outline">
            Lima paket
          </Link>
          <Link href="/faq/" className="btn btn-ghost">
            Pertanyaan umum
          </Link>
        </div>
        <p className="kecil muted" style={{ marginTop: '2rem' }}>
          Kalau Anda sampai di sini dari tautan kami sendiri, beri tahu lewat{' '}
          <a className="link" href={waLink('tautan rusak di website Lembayung')} target="_blank" rel="noopener">
            WhatsApp
          </a>
          .
        </p>
      </div>
    </section>
  );
}
