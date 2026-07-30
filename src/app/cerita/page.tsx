import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { ArticleCard } from '@/components/Cards';
import { articlesByDate } from '@/data/articles';

export const metadata: Metadata = {
  title: 'Cerita dan Panduan',
  description:
    'Enam tulisan dari lapangan: membaca cuaca Lembang, daftar bawaan yang benar benar terpakai, kenapa senja di Lembang berwarna ungu, rundown gathering dua hari, aturan api unggun, dan rute ke Lembayung.',
};

/* Article index.
 *
 * R48: grouped by category and carouselled within each group, so six articles never become a six
 * card vertical stack on a phone. The category groups also mean a reader looking for a practical
 * guide does not have to scroll past the essays.
 */
export default function CeritaIndex() {
  const kategori = [...new Set(articlesByDate.map((a) => a.category))];

  return (
    <>
      <PageHero
        eyebrow="Cerita"
        title="Tulisan dari lapangan, bukan artikel wisata"
        lead="Ditulis oleh orang yang tinggal di lereng ini. Isinya angka, jam, dan bagian yang biasanya tidak ditulis vendor, misalnya kapan sebaiknya Anda tidak berangkat."
        crumbs={[{ label: 'Cerita' }]}
      />

      <section className="section band">
        <div className="wrap">
          {kategori.map((k) => {
            const list = articlesByDate.filter((a) => a.category === k);
            return (
              <div className="group-row" key={k}>
                <div className="group-row-head">
                  <h3>{k}</h3>
                  <span className="kecil muted">
                    {list.length} tulisan
                  </span>
                </div>
                <div className="snap-row cols-3">
                  {list.map((a) => (
                    <ArticleCard key={a.slug} item={a} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
