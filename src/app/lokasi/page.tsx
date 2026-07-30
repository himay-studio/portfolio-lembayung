import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Media from '@/components/Media';
import { mediaTag } from '@/data/media';
import { site } from '@/data/site';
import { waLink } from '@/data/links';

export const metadata: Metadata = {
  title: 'Lokasi dan Rute',
  description:
    'Lembayung berada 1,2 km dari Terminal Wisata Cikole, Lembang. Rute dari Jakarta 2,5 sampai 3,5 jam, dari Bandung 45 sampai 60 menit, dan 400 meter terakhir berbatu.',
};

export default function LokasiPage() {
  const { location } = site;
  const maps = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;

  return (
    <>
      <PageHero
        eyebrow="Lokasi"
        title="Cikole, Lembang, 1,2 km dari Terminal Wisata"
        lead="Titik petanya akurat, tapi ada tiga hal yang tidak akan diberi tahu aplikasi navigasi mana pun. Ketiganya ada di halaman ini."
        crumbs={[{ label: 'Lokasi' }]}
      />

      <section className="section band">
        <div className="wrap split">
          <div>
            <div className="reveal">
              <Media
                path="img/properti/gerbang-resepsionis.jpg"
                ratio="4:3"
                alt="Gerbang kayu dan meja resepsionis Lembayung di ujung jalan berbatu"
                prompt={mediaTag('img/properti/gerbang-resepsionis.jpg')}
                eager
              />
            </div>

            <div className="prose" style={{ marginTop: '2rem' }}>
              <span className="tangga" aria-hidden="true" />
              <h2>Kondisi jalan, dan kami tulis terus terang</h2>
              <p>{location.accessNote}</p>
              <h2>Titik terakhir untuk bensin dan uang tunai</h2>
              <p>
                Terminal Wisata Cikole, 1,2 kilometer sebelum kami, punya minimarket, ATM, dan pom
                bensin. Setelah itu tidak ada apa apa lagi, dan di properti kami hanya menerima
                transfer, kartu, atau QRIS. {site.operations.payment.note}
              </p>
              <h2>Usahakan tiba sebelum jam lima sore</h2>
              <p>
                Bukan karena kami tutup, resepsionis buka sampai jam 22.00. Tapi bagian berbatu jauh
                lebih mudah dilalui saat terang, Anda ingin sempat mandi sebelum api unggun, dan jam
                setengah enam adalah alasan sebagian besar orang datang ke sini.
              </p>
            </div>
          </div>

          <div className="stack">
            <div className="side-box">
              <h3>Alamat</h3>
              <p className="kecil">{location.address}</p>
              <p className="kecil">{location.landmark}</p>
              <a className="btn btn-outline btn-block btn-sm" href={maps} target="_blank" rel="noopener">
                Buka di Google Maps
              </a>
            </div>

            <div className="side-box">
              <h3>Jam operasional</h3>
              <dl className="spec-list">
                <div>
                  <dt>Check in</dt>
                  <dd className="tnum">{site.operations.checkIn}</dd>
                </div>
                <div>
                  <dt>Check out</dt>
                  <dd className="tnum">{site.operations.checkOut}</dd>
                </div>
                <div>
                  <dt>Check out lambat</dt>
                  <dd className="tnum">
                    Sampai {site.operations.lateCheckOut}, Rp {site.operations.lateCheckOutFee.toLocaleString('id-ID')}
                  </dd>
                </div>
                <div>
                  <dt>Resepsionis</dt>
                  <dd>{site.contact.receptionHours}</dd>
                </div>
              </dl>
            </div>

            <div className="side-box">
              <h3>Kontak</h3>
              <dl className="spec-list">
                <div>
                  <dt>WhatsApp</dt>
                  <dd>{site.contact.whatsapp}</dd>
                </div>
                <div>
                  <dt>Telepon</dt>
                  <dd>{site.contact.phone}</dd>
                </div>
                <div>
                  <dt>Surel</dt>
                  <dd>{site.contact.email}</dd>
                </div>
                <div>
                  <dt>Instagram</dt>
                  <dd>{site.contact.instagram}</dd>
                </div>
              </dl>
              <p className="field-hint" style={{ marginBottom: 0 }}>
                {site.contact.responseNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- three routes.
          Three peer cards, which is at the R48 threshold and not over it, so a grid is correct
          here. It still uses the `.snap-row` class so the shape never has to be re decided. */}
      <section className="section band-2">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="tangga" aria-hidden="true" />
            <span className="eyebrow">Tiga rute</span>
            <h2>Dari Jakarta, dari Bandung, dan dari bandara</h2>
          </div>
          <div className="snap-row cols-3">
            {location.routes.map((r) => (
              <article className="card card-pad reveal" key={r.from}>
                <span className="titik">
                  <span className="titik-utama">Dari {r.from}</span>
                  <span className="titik-label">{r.duration}</span>
                </span>
                <p className="kecil" style={{ marginTop: '0.75rem' }}>
                  {r.via}
                </p>
                <p className="kecil muted" style={{ marginBottom: 0, marginTop: 'auto' }}>
                  {r.note}
                </p>
              </article>
            ))}
          </div>

          <div className="note reveal" style={{ marginTop: '2rem' }}>
            <p style={{ marginBottom: 0 }}>
              Memesan taksi daring dari properti sering gagal karena sinyal, dan pengemudi kadang
              menolak orderan ke titik ini. Untuk kepulangan, pesan antar jemput lewat kami saat
              check in, Rp 250.000 sekali jalan ke Bandung.
            </p>
          </div>

          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <Link href="/cerita/rute-ke-lembayung-jakarta-bandung/" className="btn btn-outline">
              Panduan rute lengkap, termasuk titik berhenti
            </Link>
            <a
              className="btn btn-cta"
              href={waLink('bantuan rute dan antar jemput ke Lembayung')}
              target="_blank"
              rel="noopener"
            >
              Tanya Antar Jemput
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
