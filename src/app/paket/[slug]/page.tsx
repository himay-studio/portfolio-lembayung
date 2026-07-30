import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Media from '@/components/Media';
import BookingPanel from '@/components/BookingPanel';
import { PackageCard, UnitCard } from '@/components/Cards';
import { mediaTag } from '@/data/media';
import { packageBySlug, packages } from '@/data/packages';
import { unitBySlug } from '@/data/units';
import { rupiah } from '@/data/types';
import { site } from '@/data/site';
import { waLink } from '@/data/links';

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = packageBySlug(slug);
  if (!item) return {};
  return {
    title: `Paket ${item.name}`,
    description: `${item.tagline} ${item.duration}, ${rupiah(item.price)} per ${item.priceUnit}. ${item.audience}.`,
  };
}

export default async function PaketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = packageBySlug(slug);
  if (!item) notFound();

  const related = packages.filter((p) => p.slug !== item.slug);
  const relatedUnits = item.relatedUnits.map(unitBySlug).filter((u): u is NonNullable<typeof u> => Boolean(u));

  return (
    <>
      <PageHero
        eyebrow={item.duration}
        title={item.name}
        lead={item.tagline}
        crumbs={[{ label: 'Paket', href: '/paket/' }, { label: item.name }]}
      />

      <section className="section band">
        <div className="wrap split">
          <div>
            <div className="reveal">
              <Media path={item.image.path} ratio="4:3" alt={item.image.alt} prompt={mediaTag(item.image.path)} eager />
            </div>
            <div className="prose" style={{ marginTop: '2rem' }}>
              <h2>Apa isinya</h2>
              {item.description.split(/\n\s*\n/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <div className="stack">
            <div className="side-box">
              <h3>Harga</h3>
              <span className="harga">{rupiah(item.price)}</span>
              <span className="kecil muted" style={{ display: 'block' }}>
                per {item.priceUnit}
              </span>
              {item.priceNote && (
                <p className="kecil" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                  {item.priceNote}
                </p>
              )}
              <div className="btn-row" style={{ marginTop: '1.25rem' }}>
                <a
                  className="btn btn-cta btn-block"
                  href={waLink(`paket ${item.name} di Lembayung`)}
                  target="_blank"
                  rel="noopener"
                >
                  {item.priceUnit === 'paket' ? 'Pesan Paket Ini' : 'Minta Penawaran'}
                </a>
              </div>
            </div>

            <div className="side-box">
              <h3>Untuk siapa</h3>
              <p className="kecil" style={{ marginBottom: 0 }}>
                {item.audience}
              </p>
            </div>

            <div className="side-box">
              <h3>Sudah termasuk</h3>
              <ul className="tick-list">
                {item.inclusions.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            {/* the brand voice says the inconvenient part out loud, so exclusions are not buried */}
            <div className="side-box">
              <h3>Belum termasuk</h3>
              <ul className="tick-list tick-no">
                {item.exclusions.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            <div className="side-box">
              <h3>Ketentuan singkat</h3>
              <dl className="spec-list">
                <div>
                  <dt>Durasi</dt>
                  <dd>{item.duration}</dd>
                </div>
                <div>
                  <dt>Check in</dt>
                  <dd className="tnum">{site.operations.checkIn}</dd>
                </div>
                <div>
                  <dt>Check out</dt>
                  <dd className="tnum">{site.operations.checkOut}</dd>
                </div>
                <div>
                  <dt>Uang muka</dt>
                  <dd className="tnum">{site.operations.payment.depositPercent} persen</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {relatedUnits.length > 0 && (
        <section className="section-tight band-2">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Unit yang dipakai paket ini</span>
              <h2>Anda menginap di sini</h2>
            </div>
            <div className="snap-row cols-2">
              {relatedUnits.map((u) => (
                <UnitCard key={u.slug} unit={u} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-tight band">
        <div className="wrap">
          <BookingPanel layout="inline" heading="Cek tanggal untuk paket ini" />
        </div>
      </section>

      {/* R48: four peer cards on a DETAIL page, so a snap carousel here too */}
      <section className="section band-2">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Paket lainnya</span>
            <h2>Empat paket yang lain</h2>
          </div>
          <div className="snap-row cols-3">
            {related.map((p) => (
              <PackageCard key={p.slug} item={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
