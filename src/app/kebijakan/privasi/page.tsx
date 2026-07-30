import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description:
    'Data apa yang dikumpulkan situs Lembayung, kenapa, berapa lama disimpan, dan apa yang dikirim ke pihak ketiga. Situs ini adalah demo portofolio Himay Studio.',
};

export default function PrivasiPage() {
  return (
    <>
      <PageHero
        eyebrow="Kebijakan"
        title="Kebijakan privasi"
        lead="Ditulis apa adanya, termasuk bagian bahwa situs ini adalah demo portofolio dan bukan properti yang benar benar ada."
        crumbs={[{ label: 'Kebijakan' }, { label: 'Privasi' }]}
      />

      <section className="section band">
        <div className="wrap measure prose">
          <div className="note">
            <p style={{ marginBottom: 0 }}>
              <strong>Sebelum apa pun.</strong> {site.name} adalah brand demo fiktif. Situs ini
              dibuat oleh Himay Studio sebagai contoh hasil kerja, jadi tidak ada properti, tidak ada
              reservasi yang benar benar diproses, dan tidak ada pembayaran yang bisa dilakukan di
              sini.
            </p>
          </div>

          <h2>Data yang dikumpulkan</h2>
          <p>
            Situs ini adalah halaman statis. Tidak ada akun, tidak ada basis data pesanan, dan tidak
            ada formulir yang mengirim data ke server kami. Formulir kontak dan panel cek
            ketersediaan bekerja dengan menyusun pesan lalu membukanya di WhatsApp, jadi isi pesannya
            berpindah langsung dari peramban Anda ke WhatsApp tanpa melewati kami.
          </p>

          <h2>Yang disimpan di peramban Anda</h2>
          <dl className="spec-list">
            <div>
              <dt>sessionStorage</dt>
              <dd>
                Dua penanda, satu untuk sambutan pembuka dan satu untuk banner penawaran, supaya
                keduanya hanya muncul sekali per sesi. Keduanya hilang saat tab ditutup.
              </dd>
            </div>
            <div>
              <dt>Cookie pengukuran</dt>
              <dd>
                Dipasang oleh Google Tag Manager dan Meta Pixel kalau keduanya aktif, untuk
                menghitung kunjungan. Tidak ada cookie yang kami pasang sendiri.
              </dd>
            </div>
          </dl>

          <h2>Pihak ketiga</h2>
          <ul className="tick-list">
            <li>Google Tag Manager dan Google Analytics, untuk menghitung kunjungan halaman</li>
            <li>Meta Pixel dan Conversions API, hanya kalau kredensialnya diaktifkan pada proyek ini</li>
            <li>Cloudflare Pages, yang menyajikan situs ini dan mencatat log akses standar</li>
            <li>WhatsApp, tujuan setiap tombol yang mengirim pesan</li>
          </ul>
          <p>
            Kalau kredensial pengukuran tidak diaktifkan, seluruh jalur itu tidak berjalan sama
            sekali. Tidak ada skrip yang dipasang, tidak ada permintaan yang dikirim, dan situs tetap
            berfungsi normal.
          </p>

          <h2>Berapa lama</h2>
          <p>
            Penanda sesi hilang saat tab ditutup. Data pengukuran mengikuti masa simpan bawaan
            layanan yang bersangkutan. Karena tidak ada basis data di sisi kami, tidak ada data
            pribadi yang kami simpan sendiri.
          </p>

          <h2>Hak Anda</h2>
          <p>
            Anda bisa menghapus penanda sesi dan cookie kapan saja dari pengaturan peramban, dan bisa
            menolak skrip pengukuran dengan pemblokir skrip tanpa merusak fungsi situs. Kalau Anda
            pernah mengirim pesan lewat WhatsApp dan ingin percakapannya dihapus, sampaikan lewat
            kanal yang sama.
          </p>

          <h2>Pertanyaan</h2>
          <p>
            Situs ini adalah demo portofolio Himay Studio. Untuk pertanyaan soal situs itu sendiri,
            hubungi Himay Studio lewat{' '}
            <a className="link" href={site.himayUrl} target="_blank" rel="noopener">
              himaystudio.com
            </a>
            .
          </p>

          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <Link href="/kebijakan/syarat/" className="btn btn-outline">
              Syarat menginap
            </Link>
            <Link href="/kebijakan/pembatalan/" className="btn btn-ghost">
              Kebijakan pembatalan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
