import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Media from '@/components/Media';
import Prose from '@/components/Prose';
import { ArticleCard } from '@/components/Cards';
import { mediaTag } from '@/data/media';
import { articleBySlug, articles, articlesByDate } from '@/data/articles';
import { waLink } from '@/data/links';
import { panjang } from '@/lib/tanggal';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = articleBySlug(slug);
  if (!item) return {};
  return { title: item.title, description: item.excerpt };
}

/* Article detail.
 *
 * News layout, per LAYOUT-ARCHITECTURE.md section 5: a MAIN ARTICLE COLUMN plus a RIGHT SIDEBAR
 * carrying `Artikel Lainnya`, which is the high quality editorial pattern, not a flat feed. The
 * sidebar becomes sticky at 1025px and stacks under the article below that.
 *
 * R48: the `Artikel Lainnya` block at the bottom holds five peer cards, so it is a `.snap-row`.
 * This is the exact shape that survived a Mabrur home page fix and still failed on all six blog
 * detail pages, because nobody re checked the detail route.
 */
export default async function CeritaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = articleBySlug(slug);
  if (!item) notFound();

  const others = articlesByDate.filter((a) => a.slug !== item.slug);
  const sidebar = others.slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={item.category}
        title={item.title}
        lead={item.excerpt}
        crumbs={[{ label: 'Cerita', href: '/cerita/' }, { label: item.title }]}
      />

      <section className="section band">
        <div className="wrap">
          <div className="article-layout">
            <article>
              <div className="article-meta" style={{ marginBottom: '1.25rem' }}>
                <span>{item.author}</span>
                <span>{panjang(item.date)}</span>
                <span>{item.readingMinutes} menit baca</span>
              </div>

              <div className="reveal" style={{ marginBottom: '2rem' }}>
                <Media
                  path={item.image.path}
                  ratio="16:9"
                  alt={item.image.alt}
                  prompt={mediaTag(item.image.path)}
                  eager
                />
              </div>

              <Prose body={item.body} />

              <hr className="rule" />

              <div className="note">
                <p style={{ marginBottom: 0 }}>
                  Ada yang masih ingin ditanyakan setelah membaca ini? WhatsApp kami, dibalas paling
                  lambat dua jam pada jam resepsionis.
                </p>
              </div>
              <div className="btn-row" style={{ marginTop: '1.25rem' }}>
                <a
                  className="btn btn-cta"
                  href={waLink(`pertanyaan setelah membaca tulisan ${item.title}`)}
                  target="_blank"
                  rel="noopener"
                >
                  Tanya lewat WhatsApp
                </a>
                <Link href="/unit/" className="btn btn-outline">
                  Lihat tipe unit
                </Link>
              </div>
            </article>

            {/* the RIGHT sidebar, the pattern this build uses instead of a flat feed */}
            <aside className="article-side">
              <div className="side-box">
                <h3>Artikel lainnya</h3>
                <div className="side-list">
                  {sidebar.map((a) => (
                    <Link key={a.slug} href={`/cerita/${a.slug}/`} className="side-link">
                      {/* R50: title and label are separate block children with a gap */}
                      <span className="side-link-title">{a.title}</span>
                      <span className="side-link-label">
                        {a.category}, {a.readingMinutes} menit baca
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="side-box">
                <h3>Cek tanggal Anda</h3>
                <p className="kecil">
                  Sebutkan tanggal dan jumlah orang, kami balas dengan unit yang masih tersedia.
                </p>
                <a
                  className="btn btn-cta btn-block btn-sm"
                  href={waLink('ketersediaan menginap di Lembayung')}
                  target="_blank"
                  rel="noopener"
                >
                  Tanya Ketersediaan
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* R48: five peer cards on a detail route */}
      <section className="section band-2">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Lanjut baca</span>
            <h2>Lima tulisan yang lain</h2>
          </div>
          <div className="snap-row cols-3">
            {others.map((a) => (
              <ArticleCard key={a.slug} item={a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
