import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import UnitDetail from '@/components/UnitDetail';
import BookingPanel from '@/components/BookingPanel';
import { UnitCard, PackageCard, TestimonialCard } from '@/components/Cards';
import { rupiah, VIEW_LABEL } from '@/data/types';
import { startingPrice, unitBySlug, units } from '@/data/units';
import { packages } from '@/data/packages';
import { site, testimonials } from '@/data/site';
import { waLink } from '@/data/links';

export function generateStaticParams() {
  return units.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const unit = unitBySlug(slug);
  if (!unit) return {};
  return {
    /* R42: the title is the unit NAME, which is the structure. It never picks up a capacity or a
       view, not even in metadata, because that is where the wrong model leaks first. */
    title: unit.name,
    description: `${unit.structure}. ${unit.tagline} Mulai ${rupiah(startingPrice(unit))} per malam di Lembayung, Cikole Lembang.`,
  };
}

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const unit = unitBySlug(slug);
  if (!unit) notFound();

  const related = units.filter((u) => u.slug !== unit.slug);
  const relatedPackages = packages.filter((p) => p.relatedUnits.includes(unit.slug));
  const quotes = testimonials.filter((t) => t.stayed.startsWith(unit.name));

  return (
    <>
      <PageHero
        eyebrow={`Teras ${unit.terrace}, ${unit.sizeM2} meter persegi`}
        title={unit.name}
        lead={unit.tagline}
        crumbs={[{ label: 'Tipe Unit', href: '/unit/' }, { label: unit.name }]}
      />

      {/* -------------------------------------------- R18 gallery plus R42 variant picker */}
      <section className="section band">
        <div className="wrap">
          <UnitDetail unit={unit} />
        </div>
      </section>

      {/* ------------------------------------------------------------------- story and specs */}
      <section className="section band-2">
        <div className="wrap split">
          <div className="prose">
            <span className="tangga" aria-hidden="true" />
            <h2>Tentang {unit.name}</h2>
            {unit.story.split(/\n\s*\n/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="stack">
            <div className="side-box">
              <h3>Spesifikasi</h3>
              <dl className="spec-list">
                <div>
                  <dt>Struktur</dt>
                  <dd>{unit.structure}</dd>
                </div>
                <div>
                  <dt>Luas</dt>
                  <dd className="tnum">{unit.sizeM2} meter persegi</dd>
                </div>
                <div>
                  <dt>Teras</dt>
                  <dd className="tnum">Teras {unit.terrace} dari 5</dd>
                </div>
                <div>
                  <dt>Tempat tidur</dt>
                  <dd>{unit.bedding}</dd>
                </div>
                <div>
                  <dt>Kamar mandi</dt>
                  <dd>
                    {unit.bathroom === 'dalam'
                      ? 'Di dalam unit, air panas 24 jam'
                      : 'Bersama, sekitar 30 meter, air panas'}
                  </dd>
                </div>
                <div>
                  <dt>Kapasitas</dt>
                  <dd>
                    {[...new Set(unit.variants.map((v) => v.capacity))]
                      .sort((a, b) => a - b)
                      .map((c) => `${c} pax`)
                      .join(', ')}
                  </dd>
                </div>
                <div>
                  <dt>Arah pandang</dt>
                  <dd>{[...new Set(unit.variants.map((v) => v.view))].map((v) => VIEW_LABEL[v]).join(', ')}</dd>
                </div>
              </dl>
            </div>

            <div className="side-box">
              <h3>Yang ada di unit ini</h3>
              <ul className="tick-list">
                {unit.facilities.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="side-box">
              <h3>Tarif per varian</h3>
              <div className="table-scroll">
                <table className="rate-table">
                  <thead>
                    <tr>
                      <th scope="col">Varian</th>
                      <th scope="col" className="num">
                        Hari biasa
                      </th>
                      <th scope="col" className="num">
                        Akhir pekan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {unit.variants.map((v) => (
                      <tr key={v.sku}>
                        <th scope="row">
                          {/* R50: two block lines, so the capacity never glues to the view */}
                          <span className="titik">
                            <span style={{ display: 'block', fontWeight: 600 }}>{v.capacity} pax</span>
                            <span className="titik-label">{VIEW_LABEL[v.view]}</span>
                          </span>
                        </th>
                        <td className="num">{rupiah(v.price)}</td>
                        <td className="num">{rupiah(v.weekendPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="field-hint" style={{ marginTop: '0.6rem', marginBottom: 0 }}>
                Check in {site.operations.checkIn}, check out {site.operations.checkOut}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ guest quotes */}
      {quotes.length > 0 && (
        <section className="section-tight band">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Kata tamu yang menginap di sini</span>
              <h2>Ulasan untuk {unit.name}</h2>
            </div>
            <div className="snap-row cols-2">
              {quotes.map((t) => (
                <TestimonialCard
                  key={t.name}
                  name={t.name}
                  origin={t.origin}
                  stayed={t.stayed}
                  rating={t.rating}
                  quote={t.quote}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- related packages */}
      {relatedPackages.length > 0 && (
        <section className="section-tight band-2">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Paket yang memakai unit ini</span>
              <h2>Sudah termasuk makan dan kegiatan</h2>
            </div>
            <div className="snap-row cols-2">
              {relatedPackages.map((p) => (
                <PackageCard key={p.slug} item={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-tight band">
        <div className="wrap">
          <BookingPanel unitSlug={unit.slug} layout="inline" heading={`Cek tanggal untuk ${unit.name}`} />
        </div>
      </section>

      {/* ------------------------------------------------------------------- other units.
          R48: five peer cards on a DETAIL page, which is exactly the shape that gets missed.
          It is a `.snap-row` here too, not a vertical stack. */}
      <section className="section band-2">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Tipe lainnya</span>
            <h2>Lima tipe unit yang lain</h2>
          </div>
          <div className="snap-row cols-3">
            {related.map((u) => (
              <UnitCard key={u.slug} unit={u} />
            ))}
          </div>
        </div>
      </section>

      {/* R22 / R45: the mobile sticky booking bar. It is the ONE element in the whole design
          system allowed --bayang-kuat, and site.css reserves body padding plus lifts the
          WhatsApp oval so the two tap targets never overlap. */}
      <div className="sticky-bar">
        <span className="sticky-bar-harga">
          <span className="harga tnum">{rupiah(startingPrice(unit))}</span>
          <span>mulai dari, per malam</span>
        </span>
        <a
          className="btn btn-cta btn-sm"
          href={waLink(`pemesanan unit ${unit.name} di Lembayung`)}
          target="_blank"
          rel="noopener"
        >
          Pesan {unit.name}
        </a>
      </div>
    </>
  );
}
