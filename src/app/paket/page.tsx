import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { PackageCard } from '@/components/Cards';
import { packages } from '@/data/packages';
import { waLink } from '@/data/links';

export const metadata: Metadata = {
  title: 'Paket',
  description:
    'Lima paket Lembayung: Senja Berdua, Akhir Pekan Keluarga, Gathering Kantor, Outbound Sekolah, dan Momen Spesial. Rincian termasuk dan tidak termasuk ditulis lengkap.',
};

/* Package index.
 *
 * R48 for a long index: GROUP into rows and carousel within each group, rather than one endless
 * stack. Two groups here, private stays and group bookings, which also happens to be the right
 * split editorially: audiences 1 and 2 from BRAND.md book a date, audience 3 asks for a quotation.
 */
export default function PaketIndex() {
  const pribadi = packages.filter((p) => p.priceUnit === 'paket');
  const rombongan = packages.filter((p) => p.priceUnit !== 'paket');

  return (
    <>
      <PageHero
        eyebrow="Paket"
        title="Lima paket, tiga jenis tamu"
        lead="Dua untuk yang datang berdua atau sekeluarga, dua untuk rombongan hari kerja, dan satu untuk acara yang harus jadi tepat jam setengah enam sore."
        crumbs={[{ label: 'Paket' }]}
      />

      <section className="section band">
        <div className="wrap">
          <div className="group-row">
            <div className="group-row-head">
              <h3>Untuk berdua dan sekeluarga</h3>
              <span className="kecil muted">Harga per paket, bukan per orang</span>
            </div>
            <div className="snap-row cols-3">
              {pribadi.map((p) => (
                <PackageCard key={p.slug} item={p} />
              ))}
            </div>
          </div>

          <div className="group-row">
            <div className="group-row-head">
              <h3>Untuk rombongan hari kerja</h3>
              <span className="kecil muted">Harga per orang, ada jumlah minimum</span>
            </div>
            <div className="snap-row cols-3">
              {rombongan.map((p) => (
                <PackageCard key={p.slug} item={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section band-2">
        <div className="wrap split split-narrow-left">
          <div className="reveal">
            <div className="side-box">
              <h3>Kenapa paket rombongan hanya hari kerja</h3>
              <p className="kecil">
                Senin sampai Kamis adalah inventaris yang membiayai operasional properti. Akhir pekan
                hampir selalu terisi tamu pasangan dan keluarga, jadi rombongan besar di hari Sabtu
                akan mengubah suasana yang justru dicari tamu lain.
              </p>
              <p className="kecil" style={{ marginBottom: 0 }}>
                Kalau rombongan Anda hanya bisa akhir pekan, tetap boleh, tapi dihitung dengan tarif
                unit biasa ditambah sewa Aula Lembah.
              </p>
            </div>
          </div>
          <div>
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Untuk panitia</span>
            <h2>Surat penawaran per item dalam satu hari kerja</h2>
            <p>
              Sebutkan jumlah peserta dan tanggal, dan kami balas dengan ketersediaan lebih dulu,
              supaya Anda tidak menyusun proposal untuk tanggal yang sudah penuh. Setelah tanggalnya
              cocok, surat penawaran resmi dengan rincian per item kami kirim dalam satu hari kerja.
            </p>
            <ul className="tick-list">
              <li>Aula Lembah beratap kapasitas 80, sesi tetap jalan waktu hujan sore</li>
              <li>Lodge Rimba satu lantai tanpa anak tangga, jalur dari parkir sudah dicor</li>
              <li>Listrik aula terpisah 7.700 watt, tidak menjatuhkan listrik unit menginap</li>
              <li>Fasilitator outbound dan enam pos permainan, atau bawa fasilitator sendiri</li>
              <li>Tim P3K di lokasi dan ambulans siaga untuk paket sekolah</li>
            </ul>
            <div className="btn-row" style={{ marginTop: '1.5rem' }}>
              <a
                className="btn btn-cta"
                href={waLink('penawaran paket rombongan di Lembayung')}
                target="_blank"
                rel="noopener"
              >
                Minta Penawaran
              </a>
              <Link href="/cerita/rundown-gathering-kantor-dua-hari/" className="btn btn-outline">
                Contoh rundown 2 hari
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
