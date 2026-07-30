import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import KontakForm from '@/components/KontakForm';
import { site } from '@/data/site';
import { APP_ROUTES, waLink } from '@/data/links';

export const metadata: Metadata = {
  title: 'Kontak',
  description:
    'Hubungi Lembayung lewat WhatsApp, telepon, atau surel. Resepsionis buka 08.00 sampai 22.00 setiap hari, dan WhatsApp dibalas paling lambat 2 jam pada jam resepsionis.',
};

export default function KontakPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Sebutkan tanggal dan jumlah orang"
        lead="Itu dua hal yang kami butuhkan untuk menjawab dengan berguna. Sisanya bisa menyusul."
        crumbs={[{ label: 'Kontak' }]}
      />

      <section className="section band">
        <div className="wrap split">
          <KontakForm />

          <div className="stack">
            <div className="side-box">
              <h3>Langsung saja</h3>
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
                <div>
                  <dt>Resepsionis</dt>
                  <dd>{site.contact.receptionHours}</dd>
                </div>
              </dl>
              <p className="field-hint">{site.contact.responseNote}</p>
              <a
                className="btn btn-cta btn-block btn-sm"
                href={waLink('pertanyaan umum untuk Lembayung')}
                target="_blank"
                rel="noopener"
              >
                Chat Sekarang
              </a>
            </div>

            <div className="side-box">
              <h3>Untuk rombongan</h3>
              <p className="kecil">
                Sebutkan jumlah peserta dan tanggal, kami balas dengan ketersediaan lebih dulu supaya
                Anda tidak menyusun proposal untuk tanggal yang sudah penuh. Surat penawaran per item
                menyusul dalam satu hari kerja.
              </p>
              <Link href="/paket/gathering-kantor/" className="btn btn-outline btn-block btn-sm">
                Lihat paket gathering
              </Link>
            </div>

            <div className="side-box">
              <h3>Sudah punya pesanan?</h3>
              <p className="kecil">
                Kode booking bisa dicek di portal tamu, lengkap dengan tanggal, unit, dan sisa
                pembayaran.
              </p>
              {/* R14: this NAVIGATES to a working demo feature, so it stays a real link.
                  Stage 4, Webapp Architect, owns everything under /app. */}
              <Link href={APP_ROUTES.portal} className="btn btn-outline btn-block btn-sm">
                Buka Portal Tamu
              </Link>
            </div>

            <div className="side-box">
              <h3>Alamat</h3>
              <p className="kecil">{site.location.address}</p>
              <p className="kecil" style={{ marginBottom: 0 }}>
                {site.location.landmark}
              </p>
              <Link href="/lokasi/" className="btn btn-ghost btn-block btn-sm" style={{ marginTop: '0.75rem' }}>
                Rute dan kondisi jalan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
