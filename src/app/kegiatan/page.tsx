import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Media from '@/components/Media';
import { ActivityCard } from '@/components/Cards';
import { mediaTag } from '@/data/media';
import { activities } from '@/data/activities';
import { rupiah } from '@/data/types';
import { waLink } from '@/data/links';

export const metadata: Metadata = {
  title: 'Kegiatan dan Fasilitas',
  description:
    'Empat kegiatan berjadwal dan empat fasilitas di Lembayung: api unggun 17.30, trekking pagi Bukit Kabut, panahan, kebun stroberi, Dapur Bara, bak rendam kayu, Aula Lembah, dan Pos Bintang.',
};

/* Activities and facilities.
 *
 * R48 for a long index: grouped into two rows and carouselled within each group at 768px and
 * below. The detail table below is a table, not a card stack, so it is not subject to the rule.
 */
export default function KegiatanPage() {
  const kegiatan = activities.filter((a) => a.kind === 'kegiatan');
  const fasilitas = activities.filter((a) => a.kind === 'fasilitas');

  return (
    <>
      <PageHero
        eyebrow="Di properti"
        title="Kegiatan dan fasilitas"
        lead="Empat kegiatan yang punya jadwal, dan empat fasilitas yang selalu ada. Yang gratis untuk tamu menginap kami tulis gratis, yang berbayar kami tulis harganya."
        crumbs={[{ label: 'Kegiatan dan Fasilitas' }]}
      />

      <section className="section band">
        <div className="wrap">
          <div className="group-row" id="kegiatan">
            <div className="group-row-head">
              <h3>Kegiatan berjadwal</h3>
              <span className="kecil muted">Empat kegiatan, masing masing punya jam sendiri</span>
            </div>
            <div className="snap-row cols-4">
              {kegiatan.map((a) => (
                <ActivityCard key={a.slug} item={a} />
              ))}
            </div>
          </div>

          <div className="group-row" id="fasilitas">
            <div className="group-row-head">
              <h3>Fasilitas</h3>
              <span className="kecil muted">Empat fasilitas yang tersedia sepanjang hari</span>
            </div>
            <div className="snap-row cols-4">
              {fasilitas.map((a) => (
                <ActivityCard key={a.slug} item={a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- the detail list */}
      <section className="section band-2">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Lengkapnya</span>
            <h2>Delapan hal ini, satu per satu</h2>
          </div>

          <div className="stack-lg">
            {activities.map((a, i) => (
              <article key={a.slug} id={`detail-${a.slug}`} className="split reveal">
                <div className={i % 2 === 1 ? 'prose' : ''} style={i % 2 === 1 ? { order: 2 } : undefined}>
                  <span className="badge">{a.kind === 'kegiatan' ? 'Kegiatan' : 'Fasilitas'}</span>
                  <h3 style={{ marginTop: '0.6rem' }}>{a.name}</h3>
                  <dl className="spec-list" style={{ marginBottom: '1rem' }}>
                    <div>
                      <dt>Jadwal</dt>
                      <dd>{a.schedule}</dd>
                    </div>
                    <div>
                      <dt>Biaya</dt>
                      <dd>{a.price === 0 ? 'Termasuk tarif menginap' : rupiah(a.price)}</dd>
                    </div>
                    <div>
                      <dt>Catatan</dt>
                      <dd>{a.priceNote}</dd>
                    </div>
                  </dl>
                  {a.description.split(/\n\s*\n/).map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
                <div style={i % 2 === 1 ? { order: 1 } : undefined}>
                  <Media path={a.image.path} ratio="4:3" alt={a.image.alt} prompt={mediaTag(a.image.path)} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-dark on-dark">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 style={{ maxWidth: '34ch', margin: '0 auto 1rem' }}>
            Api unggun jam 17.30 gratis untuk semua tamu menginap
          </h2>
          <p className="lead" style={{ maxWidth: '52ch', margin: '0 auto 1.75rem' }}>
            Bak rendam dan panahan sebaiknya dipesan saat check in, karena sesi jam lima sore selalu
            paling cepat penuh.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <a
              className="btn btn-cta"
              href={waLink('kegiatan dan fasilitas di Lembayung')}
              target="_blank"
              rel="noopener"
            >
              Tanya Ketersediaan
            </a>
            <Link href="/unit/" className="btn btn-outline-inv">
              Lihat tipe unit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
