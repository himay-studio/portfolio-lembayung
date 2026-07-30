import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import FaqAccordion from '@/components/FaqAccordion';
import { faq, faqCategories } from '@/data/faq';
import { waLink } from '@/data/links';

export const metadata: Metadata = {
  title: 'Pertanyaan Umum',
  description:
    'Dua belas jawaban tentang menginap di Lembayung: check in, hujan sore, kamar mandi, membawa anak, listrik, sinyal, pembatalan, kondisi jalan, tarif akhir pekan, hewan peliharaan, dan rombongan.',
};

/* FAQ, R7.
 *
 * Grouped by the five categories in the data, each an accordion. A collapsed accordion is NOT a
 * card stack, so per R48 this page is exempt from the mobile carousel rule even though there are
 * twelve items. What it does need is honest `aria-expanded` and full keyboard operation, R60,
 * which FaqAccordion handles.
 */
export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Pertanyaan umum"
        title="Dua belas jawaban, dengan angkanya"
        lead="Termasuk yang kurang nyaman, misalnya jalan berbatu 400 meter terakhir dan kamar mandi luar di Tenda Bara. Lebih baik Anda tahu sekarang daripada saat sudah tiba."
        crumbs={[{ label: 'Pertanyaan Umum' }]}
      />

      <section className="section band">
        <div className="wrap measure">
          {faqCategories.map((cat) => {
            const items = faq.filter((f) => f.category === cat);
            return (
              <div key={cat} style={{ marginBottom: '3rem' }}>
                <div className="group-row-head">
                  <h2 style={{ margin: 0 }}>{cat}</h2>
                  <span className="kecil muted">{items.length} pertanyaan</span>
                </div>
                <FaqAccordion items={items} idBase={`faq-${cat.toLowerCase()}`} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="section band-dark on-dark">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 style={{ maxWidth: '32ch', margin: '0 auto 1rem' }}>Pertanyaan Anda tidak ada di daftar ini?</h2>
          <p className="lead" style={{ maxWidth: '50ch', margin: '0 auto 1.75rem' }}>
            Kirim lewat WhatsApp. Kalau jawabannya ternyata sering ditanyakan, kami tambahkan ke
            halaman ini.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <a className="btn btn-cta" href={waLink('pertanyaan tentang Lembayung')} target="_blank" rel="noopener">
              Tanya lewat WhatsApp
            </a>
            <Link href="/kebijakan/pembatalan/" className="btn btn-outline-inv">
              Kebijakan pembatalan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
