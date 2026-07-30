import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import UnitFilter from '@/components/UnitFilter';
import BookingPanel from '@/components/BookingPanel';
import { rupiah, VIEW_LABEL } from '@/data/types';
import { units } from '@/data/units';
import { waLink } from '@/data/links';

export const metadata: Metadata = {
  title: 'Tipe Unit',
  description:
    'Enam tipe unit di lima teras Lembayung, dari bell tent kanvas sampai lodge rombongan. Kapasitas dan arah pandang adalah varian pada tiap tipe, lengkap dengan tarif hari biasa dan akhir pekan.',
};

/* Unit index.
 *
 * Shop mode, per LAYOUT-ARCHITECTURE.md section 5: a RATE CARD LIST, not an ecommerce grid with
 * add to cart. Accommodation is not a packaged good, so what sells it is the image plus the honest
 * numbers, which is why every card carries capacity, view, bathroom and a starting price, and why
 * the full rate table for all fifteen variants sits below the cards rather than being hidden.
 *
 * R42: the filter narrows WHICH units appear. It never changes a NAME. See UnitFilter.tsx.
 */
export default function UnitIndex() {
  return (
    <>
      <PageHero
        eyebrow="Menginap"
        title="Enam tipe unit di lima teras"
        lead="Enam struktur, lima belas varian yang bisa dipesan. Kapasitas dan arah pandang dipilih di dalam tipe unitnya, jadi nama unitnya tidak pernah berubah."
        crumbs={[{ label: 'Tipe Unit' }]}
      />

      <section className="section band">
        <div className="wrap">
          <UnitFilter />
        </div>
      </section>

      {/* ------------------------------------------------------------------ full rate table */}
      <section className="section band-2">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Tarif lengkap</span>
            <h2>Lima belas varian, tarif hari biasa dan akhir pekan</h2>
            <p className="muted">
              Tarif hari biasa berlaku Minggu sampai Kamis. Tarif Jumat, Sabtu dan libur nasional
              lebih tinggi, dan selalu ditampilkan di kalender sebelum Anda membayar.
            </p>
          </div>

          <div className="table-scroll reveal">
            <table className="rate-table">
              <caption>Tarif per unit per malam, bukan per orang. Sudah termasuk sarapan.</caption>
              <thead>
                <tr>
                  <th scope="col">Tipe unit</th>
                  <th scope="col">Kode</th>
                  <th scope="col">Kapasitas</th>
                  <th scope="col">Arah pandang</th>
                  <th scope="col" className="num">
                    Hari biasa
                  </th>
                  <th scope="col" className="num">
                    Akhir pekan
                  </th>
                </tr>
              </thead>
              <tbody>
                {units.flatMap((u) =>
                  u.variants.map((v) => (
                    <tr key={v.sku}>
                      {/* R42: one row per VARIANT, and every row of a unit carries the SAME name.
                          Capacity and view are their own columns, never folded into the name. */}
                      <th scope="row">
                        <Link href={`/unit/${u.slug}/`} className="link">
                          {u.name}
                        </Link>
                      </th>
                      <td className="tnum">{v.sku}</td>
                      <td>{v.capacity} pax</td>
                      <td>{VIEW_LABEL[v.view]}</td>
                      <td className="num">{rupiah(v.price)}</td>
                      <td className="num">{rupiah(v.weekendPrice)}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>

          <div className="note reveal" style={{ marginTop: '1.5rem' }}>
            <p style={{ marginBottom: 0 }}>
              Lima dari enam tipe punya kamar mandi dalam dengan air panas 24 jam. Hanya Tenda Bara
              yang memakai kamar mandi bersama, empat bilik, sekitar 30 meter berjalan kaki. Itu
              sebabnya harganya paling terjangkau.
            </p>
          </div>
        </div>
      </section>

      <section className="section-tight band">
        <div className="wrap">
          <BookingPanel layout="inline" heading="Sudah tahu tanggalnya?" />
        </div>
      </section>

      <section className="section band-dark on-dark">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 style={{ maxWidth: '32ch', margin: '0 auto 1rem' }}>
            Masih bingung memilih di antara enam tipe ini?
          </h2>
          <p className="lead" style={{ maxWidth: '52ch', margin: '0 auto 1.75rem' }}>
            Sebutkan jumlah orang, tanggal, dan apakah ada anak kecil. Kami sarankan satu tipe, dan
            kami akan bilang kalau tipe yang Anda incar kurang cocok.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <a
              className="btn btn-cta"
              href={waLink('bantuan memilih tipe unit di Lembayung')}
              target="_blank"
              rel="noopener"
            >
              Tanya Ketersediaan
            </a>
            <Link href="/faq/" className="btn btn-outline-inv">
              Baca pertanyaan umum
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
