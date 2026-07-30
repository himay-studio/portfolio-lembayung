import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Media from '@/components/Media';
import { TestimonialCard } from '@/components/Cards';
import { mediaTag } from '@/data/media';
import { site, testimonials } from '@/data/site';
import { waLink } from '@/data/links';

export const metadata: Metadata = {
  title: 'Tentang Lembayung',
  description:
    'Tiga koma dua hektar di lereng menghadap barat di Cikole, Lembang, 1.300 mdpl. Bekas kebun stroberi yang ditanami pinus kembali, dibangun di sekitar satu jam: jam setengah enam sore.',
};

export default function TentangPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang"
        title="Satu lereng, lima teras, dan dua puluh menit yang jadi alasannya"
        lead={site.promise}
        crumbs={[{ label: 'Tentang' }]}
      />

      <section className="section band">
        <div className="wrap split">
          <div className="prose">
            <span className="tangga" aria-hidden="true" />
            <h2>Lahannya dulu kebun stroberi yang berhenti berproduksi</h2>
            <p>
              Tiga koma dua hektar di Cikole, Lembang, sekitar 1.300 meter di atas permukaan laut,
              menghadap barat ke cekungan Bandung. Sebelum jadi tempat menginap, lahan ini kebun
              stroberi yang sudah tidak produktif. Yang kami lakukan adalah menanam pinus kembali di
              lereng dan membiarkan dinding penahan terasnya berdiri seperti semula.
            </p>
            <p>
              Itu sebabnya tempat ini terasa seperti lereng dan bukan lapangan kemah. Enam tipe unit
              turun bertahap di lima teras, dan tidak ada satu unit pun yang deknya menghadap ke dek
              unit lain.
            </p>
            <h2>Kenapa segala sesuatu di sini terjadi jam setengah enam</h2>
            <p>
              Matahari lewat di balik punggung bukit sebelah barat sekitar jam 17.30 sampai 17.45,
              tergantung bulan. Lembah ke arah Bandung berubah jingga pekat, lalu langit di atas ufuk
              berubah ungu, dan puncaknya sekitar jam 17.50 sampai 18.10. Setelah 18.20 warnanya
              luruh menjadi biru tua.
            </p>
            <p>
              Jendelanya sekitar dua puluh menit. Jadi api unggun di Plaza Bara dinyalakan jam
              setengah enam dan bukan jam tujuh, dek Kabin Lembayung dibangun menghadap lurus ke
              barat, dan trekking pagi dijadwalkan kembali jam delapan supaya tidak ada tamu yang
              tertidur sebelum sore.
            </p>
            <h2>Yang kami tidak klaim</h2>
            <p>
              Ini bukan resort hotel, bukan taman hiburan, dan kami tidak menyebutnya mewah. Kata
              yang jujur untuk kategori ini adalah nyaman, yang di sini berarti kasur yang benar,
              air panas, kamar mandi dalam di lima dari enam tipe, lantai yang tidak basah, dan staf
              yang menjawab WhatsApp.
            </p>
            <p>
              Kalau tujuan Anda tidur cepat dan bangun pagi, ini tempatnya. Kalau yang dicari
              hiburan malam, bukan.
            </p>
          </div>

          <div className="stack">
            <div className="reveal">
              <Media
                path="img/properti/aerial-teras.jpg"
                ratio="16:9"
                alt="Lima teras berundak Lembayung dari titik tinggi di punggung bukit"
                prompt={mediaTag('img/properti/aerial-teras.jpg')}
                eager
              />
            </div>
            <div className="side-box">
              <h3>Angka propertinya</h3>
              <dl className="spec-list">
                <div>
                  <dt>Luas</dt>
                  <dd className="tnum">{site.location.areaHectares} hektar</dd>
                </div>
                <div>
                  <dt>Ketinggian</dt>
                  <dd className="tnum">{site.location.altitudeMdpl} mdpl</dd>
                </div>
                <div>
                  <dt>Suhu</dt>
                  <dd>{site.operations.temperatureRange}</dd>
                </div>
                <div>
                  <dt>Teras</dt>
                  <dd className="tnum">{site.location.terraces} teras berundak</dd>
                </div>
                <div>
                  <dt>Tipe unit</dt>
                  <dd className="tnum">6 tipe, 15 varian</dd>
                </div>
                <div>
                  <dt>Musim hujan</dt>
                  <dd>{site.operations.rainySeason}</dd>
                </div>
                <div>
                  <dt>Musim terkering</dt>
                  <dd>{site.operations.driestSeason}</dd>
                </div>
              </dl>
            </div>
            <div className="side-box">
              <h3>Nama tempat di properti</h3>
              <dl className="spec-list">
                <div>
                  <dt>Plaza Bara</dt>
                  <dd>Lingkar api unggun komunal di teras terendah</dd>
                </div>
                <div>
                  <dt>Bukit Kabut</dt>
                  <dd>Jalur trekking pagi 2,4 km ke punggung bukit utara</dd>
                </div>
                <div>
                  <dt>Pos Bintang</dt>
                  <dd>Dek pandang tanpa lampu di titik tertinggi</dd>
                </div>
                <div>
                  <dt>Dapur Bara</dt>
                  <dd>Restoran semi terbuka di Teras 4</dd>
                </div>
                <div>
                  <dt>Aula Lembah</dt>
                  <dd>Aula beratap kapasitas 80 di Teras 5</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section band-dark on-dark">
        <div className="wrap split">
          <div>
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow eyebrow-inv">Yang mengelola</span>
            <h2>Pinusnya ditanam sendiri, dan itu bukan cerita pemasaran</h2>
            <p className="lead">
              Pak Damar, 44, bekas petugas lapangan kehutanan dari Subang, menanam tegakan pinus di
              lereng ini sebelum ada satu pun unit berdiri.
            </p>
            <p className="muted-inv">
              Dia tahu jalur mana yang licin setelah hujan semalam, tahu malam apa kabut turun, dan
              akan terus terang bilang jangan ambil dome kalau Anda membawa balita. Itu sebabnya di
              setiap halaman unit ada bagian tidak cocok untuk, dan bukan hanya daftar kelebihan.
            </p>
          </div>
          <div className="reveal">
            <Media
              path="img/properti/gerbang-resepsionis.jpg"
              ratio="4:3"
              alt="Gerbang kayu dan meja resepsionis Lembayung di ujung jalan berbatu pada sore hari"
              prompt={mediaTag('img/properti/gerbang-resepsionis.jpg')}
            />
          </div>
        </div>
      </section>

      <section className="section band-2">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Kata tamu</span>
            <h2>Delapan ulasan, dengan unit yang benar benar dipakai</h2>
          </div>
          <div className="snap-row cols-3">
            {testimonials.map((t) => (
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
          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <a
              className="btn btn-cta"
              href={waLink('menginap di Lembayung')}
              target="_blank"
              rel="noopener"
            >
              Pesan Sekarang
            </a>
            <Link href="/lokasi/" className="btn btn-outline">
              Lihat lokasi dan rute
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
