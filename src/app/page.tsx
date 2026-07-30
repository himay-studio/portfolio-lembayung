import Link from 'next/link';
import Media from '@/components/Media';
import BookingPanel from '@/components/BookingPanel';
import FaqAccordion from '@/components/FaqAccordion';
import { ActivityCard, ArticleCard, PackageCard, TestimonialCard, UnitCard } from '@/components/Cards';
import { mediaTag } from '@/data/media';
import { site, testimonials } from '@/data/site';
import { waLink, APP_ROUTES } from '@/data/links';
import { units } from '@/data/units';
import { packages } from '@/data/packages';
import { activities } from '@/data/activities';
import { articlesByDate } from '@/data/articles';
import { faq } from '@/data/faq';

/* Home page.
 *
 * Section order and why, from LAYOUT-ARCHITECTURE.md section 4:
 *   hero video, availability panel, the 17.30 ritual, unit types, five terraces, packages,
 *   activities and facilities, honest notes, testimonials, articles, FAQ preview, closing CTA.
 *
 * DESIGN.md section 1: the dusk ground is RATIONED. On this page it is the hero, the 17.30 band,
 * the closing CTA band, and the footer. Everything else sits on the light canvas.
 *
 * R48: every section below carrying more than three peer cards is a `.snap-row`, which is a snap
 * carousel at 768px and below and a grid above it. Counted here: 6 units, 5 packages, 8
 * activities, 8 testimonials, 3 articles. Only the article row is under four, and it still uses
 * the same class so the shape never has to be reasoned about twice.
 */
export default function Home() {
  const kegiatan = activities.filter((a) => a.kind === 'kegiatan');
  const fasilitas = activities.filter((a) => a.kind === 'fasilitas');

  return (
    <>
      {/* ------------------------------------------------------------------ hero, R2 R30 R44 */}
      <section className="hero on-dark">
        <div className="hero-media">
          {/* R15: Media checks the build time filesystem manifest first, so this is a real
              <video> only once the mp4 is on disk. Until then it is an honest annotated
              placeholder, never a frozen dead <video> pointed at a missing file. */}
          <Media
            path="video/hero-lembayung.mp4"
            type="video"
            ratio="16:9"
            alt="Lereng berundak Lembayung saat senja, kabut di lembah dan api unggun menyala"
            prompt={mediaTag('video/hero-lembayung.mp4')}
            poster="img/properti/plaza-bara-senja.jpg"
          />
        </div>
        {/* R2: decorative, pointer-events none, and it sits BELOW the copy in the stacking order */}
        <div className="hero-scrim" aria-hidden="true" />

        <div className="wrap hero-inner">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-inv">{site.categoryLine}</span>
            <h1>{site.tagline}</h1>
            <p className="lead">{site.promise}</p>
            <div className="btn-row" style={{ marginTop: '1.5rem' }}>
              {/* R5 / R14: green sales CTA to Himay Studio WhatsApp */}
              <a
                className="btn btn-cta"
                href={waLink('menginap di Lembayung, glamping dan kabin Lembang')}
                target="_blank"
                rel="noopener"
              >
                Pesan Sekarang
              </a>
              {/* A NAVIGATION button, so it stays a working internal link. It uses the header
                  variant rather than .btn-outline-inv because the ground here is a TRANSLUCENT
                  panel over a video, not a solid section, and the ancestor chain a contrast sweep
                  walks cannot see the video or the R2 scrim (both are z-index negative SIBLINGS,
                  not ancestors). Measured by hand through the real stack, video plus 0,55 scrim
                  plus 0,58 panel: --pinus-terang is 4,60:1 over a dusk frame but only 4,24:1 over
                  the light layout-first placeholder, so it fails in the state Stage 7 reviews.
                  --kanvas is 11,38:1 and 10,48:1 respectively. This is also exactly why R51 keeps
                  the screenshot read alongside the programmatic sweep. */}
              <Link href="/unit/" className="btn btn-outline-head">
                Lihat Enam Tipe Unit
              </Link>
            </div>
            <div className="hero-meta">
              <span>
                <b>{site.location.altitudeMdpl} mdpl</b> Cikole, Lembang
              </span>
              <span>
                <b>{site.operations.temperatureRange}</b>
              </span>
              <span>
                <b>{site.location.areaHectares} hektar</b> di {site.location.terraces} teras
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- availability panel */}
      <section className="section-tight band">
        <div className="wrap">
          <BookingPanel layout="inline" heading="Cek tanggal Anda" />
        </div>
      </section>

      {/* ------------------------------------------------------------------- the 17.30 ritual */}
      <section className="section band-dark on-dark">
        <div className="wrap split">
          <div>
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow eyebrow-inv">Jam setengah enam sore</span>
            <h2>Seluruh properti ini disusun di sekitar dua puluh menit</h2>
            <p className="lead">
              Matahari lewat di balik punggung bukit barat sekitar jam 17.30. Lembah ke arah Bandung
              berubah jingga lalu ungu, dan warnanya bertahan sekitar dua puluh menit sebelum luruh
              jadi biru tua.
            </p>
            <p className="muted-inv">
              Karena itu api unggun di Plaza Bara dinyalakan jam setengah enam, bukan jam tujuh. Dek
              Kabin Lembayung menghadap lurus ke barat. Trekking pagi kembali jam delapan supaya
              tidak ada yang tertidur sebelum sore. Kami ingin tamu sudah berada di luar sebelum
              warnanya datang, bukan baru berjalan keluar saat warnanya sudah lewat.
            </p>
            <div className="btn-row" style={{ marginTop: '1.25rem' }}>
              <Link href="/cerita/kenapa-senja-lembang-berwarna-ungu/" className="btn btn-outline-inv">
                Kenapa langitnya ungu
              </Link>
            </div>
          </div>
          <div className="reveal">
            <Media
              path="img/properti/plaza-bara-senja.jpg"
              ratio="16:9"
              alt="Plaza Bara jam setengah enam sore, api baru menyala dan lembah berubah jingga"
              prompt={mediaTag('img/properti/plaza-bara-senja.jpg')}
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- unit types */}
      <section className="section band band-step">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Enam tipe unit</span>
            <h2>Dari tenda kanvas dengan api unggun sendiri sampai lodge untuk dua puluh orang</h2>
            <p className="muted">
              Enam struktur, lima belas varian yang bisa dipesan. Kapasitas dan arah pandang dipilih
              di halaman unitnya, bukan jadi unit yang berbeda.
            </p>
          </div>
          {/* R48: 6 peer cards, so a snap carousel at 768px and below */}
          <div className="snap-row cols-3">
            {units.map((u) => (
              <UnitCard key={u.slug} unit={u} />
            ))}
          </div>
          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <Link href="/unit/" className="btn btn-outline">
              Bandingkan semua tipe dan tarifnya
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- five terraces */}
      <section className="section band-2">
        <div className="wrap split split-narrow-left">
          <div className="reveal">
            <Media
              path="img/properti/aerial-teras.jpg"
              ratio="16:9"
              alt="Lima teras berundak Lembayung dengan dome dan kabin tersebar di lereng pinus"
              prompt={mediaTag('img/properti/aerial-teras.jpg')}
            />
          </div>
          <div>
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Lima teras</span>
            <h2>Lahannya bekas kebun stroberi, dan dinding terasnya masih yang asli</h2>
            <p>
              Tiga koma dua hektar di lereng menghadap barat, dibagi lima teras. Dinding penahan
              batu yang ada sekarang dibangun waktu lahan ini masih kebun stroberi, dan itu sebabnya
              tempat ini terasa seperti lereng, bukan lapangan kemah.
            </p>
            <dl className="spec-list">
              <div>
                <dt>Teras 1, paling tinggi</dt>
                <dd>Tenda Bara dan Rumah Kanopi, paling sunyi, paling dekat jalur trekking</dd>
              </div>
              <div>
                <dt>Teras 2</dt>
                <dd>Dome Senja dan kebun petik stroberi 0,4 hektar</dd>
              </div>
              <div>
                <dt>Teras 3</dt>
                <dd>Kabin Pinus, lapangan panahan, dan empat bak rendam kayu</dd>
              </div>
              <div>
                <dt>Teras 4</dt>
                <dd>Kabin Lembayung dan Dapur Bara, keduanya menghadap barat</dd>
              </div>
              <div>
                <dt>Teras 5, paling rendah</dt>
                <dd>Lodge Rimba, Aula Lembah, Plaza Bara, embung, dan parkir</dd>
              </div>
            </dl>
            <div className="btn-row" style={{ marginTop: '1.5rem' }}>
              <Link href="/tentang/" className="btn btn-outline">
                Tentang Lembayung
              </Link>
              <Link href="/galeri/" className="btn btn-ghost">
                Buka galeri
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- packages */}
      <section className="section band band-step">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Lima paket</span>
            <h2>Untuk berdua, untuk keluarga, dan untuk rombongan yang datang hari kerja</h2>
            <p className="muted">
              Paket hari kerja ada karena Senin sampai Kamis yang membiayai operasional. Rombongan
              kantor dan sekolah dapat surat penawaran per item dalam satu hari kerja.
            </p>
          </div>
          {/* R48: 5 peer cards */}
          <div className="snap-row cols-3">
            {packages.map((p) => (
              <PackageCard key={p.slug} item={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- activities and facilities */}
      <section className="section band-2">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Delapan hal di properti</span>
            <h2>Empat kegiatan berjadwal, empat fasilitas yang selalu ada</h2>
          </div>

          {/* R48 for a long list: GROUP into rows and carousel within each group, rather than one
              endless vertical stack. This is the pattern portfolio-mabrur got right on /paket/. */}
          <div className="group-row">
            <div className="group-row-head">
              <h3>Kegiatan berjadwal</h3>
              <Link href="/kegiatan/" className="link">
                Lihat semua
              </Link>
            </div>
            <div className="snap-row cols-4">
              {kegiatan.map((a) => (
                <ActivityCard key={a.slug} item={a} />
              ))}
            </div>
          </div>

          <div className="group-row">
            <div className="group-row-head">
              <h3>Fasilitas</h3>
              <Link href="/kegiatan/#fasilitas" className="link">
                Lihat semua
              </Link>
            </div>
            <div className="snap-row cols-4">
              {fasilitas.map((a) => (
                <ActivityCard key={a.slug} item={a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- honest notes */}
      <section className="section-tight band band-step">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Yang sebaiknya Anda tahu sebelum memesan</span>
            <h2>Empat hal yang kami tulis lebih awal, bukan setelah Anda tiba</h2>
          </div>
          <div className="grid grid-2">
            <div className="note reveal">
              <p>
                <strong>Empat ratus meter terakhir berbatu dan menanjak.</strong> Sedan standar bisa
                lewat pelan pelan. Mobil ceper sebaiknya parkir di area bawah, telepon kami, dan
                kami jemput dengan mobil bak.
              </p>
            </div>
            <div className="note reveal">
              <p>
                <strong>Sinyal Telkomsel kuat, Indosat dan XL naik turun,</strong> terutama di Teras
                1 dan Pos Bintang. WiFi ada di semua unit, paling stabil di Rumah Kanopi.
              </p>
            </div>
            <div className="note reveal">
              <p>
                <strong>November sampai Maret hujan sore hampir setiap hari.</strong> Sesi rombongan
                tetap jalan karena Aula Lembah beratap. Trekking dan api unggun bisa ditunda.
              </p>
            </div>
            <div className="note reveal">
              <p>
                <strong>Tidak ada mesin ATM di properti.</strong> Isi bensin dan tarik tunai di
                Terminal Wisata Cikole, 1,2 km sebelum kami. Pembayaran transfer, kartu, atau QRIS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- testimonials */}
      <section className="section band-2">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Kata tamu</span>
            <h2>Delapan ulasan, masing masing menyebut unit atau paket yang benar benar dipakai</h2>
          </div>
          {/* R48: 8 peer cards */}
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
        </div>
      </section>

      {/* -------------------------------------------------------------------------- articles */}
      <section className="section band band-step">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Cerita dan panduan</span>
            <h2>Tulisan dari lapangan, bukan artikel wisata</h2>
          </div>
          <div className="snap-row cols-3">
            {articlesByDate.slice(0, 3).map((a) => (
              <ArticleCard key={a.slug} item={a} />
            ))}
          </div>
          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <Link href="/cerita/" className="btn btn-outline">
              Semua enam tulisan
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------- FAQ preview */}
      <section className="section band-2">
        <div className="wrap split split-narrow-left">
          <div>
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Pertanyaan umum</span>
            <h2>Jawaban dengan angkanya, termasuk yang kurang nyaman</h2>
            <p className="muted">
              Dua belas pertanyaan lengkap ada di halaman FAQ, mulai dari kebijakan pembatalan
              sampai kondisi jalan masuk.
            </p>
            <div className="btn-row" style={{ marginTop: '1.25rem' }}>
              <Link href="/faq/" className="btn btn-outline">
                Buka semua pertanyaan
              </Link>
            </div>
          </div>
          <FaqAccordion items={faq.slice(0, 4)} idBase="faq-home" />
        </div>
      </section>

      {/* -------------------------------------------------------------------- closing CTA */}
      <section className="section band-dark on-dark">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <span className="eyebrow eyebrow-inv" style={{ textAlign: 'center' }}>
            Satu jam dari Bandung
          </span>
          <h2 style={{ maxWidth: '30ch', margin: '0.5rem auto 1rem' }}>
            Sebutkan tanggal dan jumlah orang, kami balas dengan yang masih tersedia
          </h2>
          <p className="lead" style={{ maxWidth: '54ch', margin: '0 auto 1.75rem' }}>
            WhatsApp dibalas paling lambat dua jam pada jam resepsionis, {site.contact.receptionHours}.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <a
              className="btn btn-cta"
              href={waLink('pemesanan menginap di Lembayung')}
              target="_blank"
              rel="noopener"
            >
              Pesan Sekarang
            </a>
            {/* R8 demo entry point. It NAVIGATES and demonstrates a working feature, so per R14
                scope it stays a functional link and is never a WhatsApp lead. Stage 4 owns it. */}
            <Link href={APP_ROUTES.panel} className="btn btn-outline-inv">
              Buka Panel Reservasi
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
