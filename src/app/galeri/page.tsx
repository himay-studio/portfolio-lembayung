import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Media from '@/components/Media';
import { MEDIA, mediaTag } from '@/data/media';
import { units } from '@/data/units';
import { activities } from '@/data/activities';
import { waLink } from '@/data/links';

export const metadata: Metadata = {
  title: 'Galeri',
  description:
    'Foto Lembayung: enam tipe unit, lima teras, Plaza Bara saat senja, dan fasilitas properti di Cikole, Lembang.',
};

/* Galeri.
 *
 * Deliberately NOT a lightbox. R53 would make one a portal exercise for very little gain here,
 * and every image in this gallery already has a page it belongs to, so each tile links to that
 * page instead. That is better for the visitor and better for internal linking (R59 reverse check:
 * no route on this site is orphaned).
 *
 * R48: every group below holds more than three tiles, so each is a `.snap-row`. A 12 tile grid
 * stacked vertically at 375px is exactly the failure this rule exists for, and on Mabrur it was
 * `/galeri/` specifically that shipped that way.
 */
export default function GaleriPage() {
  const properti = MEDIA.filter((m) => m.path.startsWith('img/properti/'));

  return (
    <>
      <PageHero
        eyebrow="Galeri"
        title="Lereng ini, unitnya, dan jam setengah enam sore"
        lead="Setiap foto di sini punya halaman asalnya. Klik tilenya untuk membuka unit, kegiatan, atau fasilitas yang bersangkutan."
        crumbs={[{ label: 'Galeri' }]}
      />

      {/* ------------------------------------------------------------------- property wide */}
      <section className="section band">
        <div className="wrap">
          <div className="group-row">
            <div className="group-row-head">
              <h3>Properti</h3>
              <Link href="/tentang/" className="link">
                Tentang Lembayung
              </Link>
            </div>
            <div className="snap-row cols-3">
              {properti.map((m) => (
                <figure key={m.path} className="card reveal" style={{ margin: 0 }}>
                  <Media path={m.path} ratio={m.ratio === '1:1' ? '1:1' : m.ratio} alt={m.slot} prompt={m.tag} />
                  <figcaption className="card-pad kecil muted" style={{ paddingBlock: '0.7rem' }}>
                    {m.slot}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* one row per unit type, four frames each. Grouping like this is what keeps a 24 image
              gallery from becoming a 24 card vertical stack on a phone. */}
          {units.map((u) => (
            <div className="group-row" key={u.slug}>
              <div className="group-row-head">
                <h3>{u.name}</h3>
                <Link href={`/unit/${u.slug}/`} className="link">
                  Buka halaman unit
                </Link>
              </div>
              <div className="snap-row cols-4">
                {u.gallery.map((g) => (
                  <Link key={g.path} href={`/unit/${u.slug}/`} className="card card-link reveal">
                    <Media path={g.path} ratio="1:1" alt={g.alt} prompt={mediaTag(g.path)} />
                    <span className="card-pad kecil muted" style={{ paddingBlock: '0.7rem' }}>
                      {/* R50: the kind label is its own block under the unit name */}
                      <span className="titik">
                        <span style={{ display: 'block', fontWeight: 600 }}>{u.name}</span>
                        <span className="titik-label">{g.kind}</span>
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="group-row">
            <div className="group-row-head">
              <h3>Kegiatan dan fasilitas</h3>
              <Link href="/kegiatan/" className="link">
                Lihat semua
              </Link>
            </div>
            <div className="snap-row cols-4">
              {activities.map((a) => (
                <Link key={a.slug} href={`/kegiatan/#detail-${a.slug}`} className="card card-link reveal">
                  <Media path={a.image.path} ratio="4:3" alt={a.image.alt} prompt={mediaTag(a.image.path)} />
                  <span className="card-pad kecil" style={{ paddingBlock: '0.7rem' }}>
                    <span className="titik">
                      <span style={{ display: 'block', fontWeight: 600 }}>{a.name}</span>
                      <span className="titik-label">{a.kind === 'kegiatan' ? 'Kegiatan' : 'Fasilitas'}</span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight band-dark on-dark">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 style={{ maxWidth: '30ch', margin: '0 auto 1.5rem' }}>
            Foto senja di sini tidak diberi filter, warnanya memang begitu
          </h2>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <a
              className="btn btn-cta"
              href={waLink('menginap di Lembayung setelah melihat galeri')}
              target="_blank"
              rel="noopener"
            >
              Pesan Sekarang
            </a>
            <Link href="/cerita/kenapa-senja-lembang-berwarna-ungu/" className="btn btn-outline-inv">
              Kenapa langitnya ungu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
