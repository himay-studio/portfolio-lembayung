import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { site } from '@/data/site';
import { waLink } from '@/data/links';

export const metadata: Metadata = {
  title: 'Syarat Menginap',
  description:
    'Check in 14.00, check out 12.00, aturan hewan peliharaan, memasak, api unggun, jam tenang, dan tanggung jawab tamu di Lembayung, Cikole Lembang.',
};

export default function SyaratPage() {
  return (
    <>
      <PageHero
        eyebrow="Kebijakan"
        title="Syarat menginap"
        lead="Aturan yang berlaku di properti. Sebagian ada karena bahan bangunannya kanvas dan kayu, dan pemadam terdekat cukup jauh."
        crumbs={[{ label: 'Kebijakan' }, { label: 'Syarat Menginap' }]}
      />

      <section className="section band">
        <div className="wrap measure prose">
          <h2>Jam</h2>
          <dl className="spec-list">
            <div>
              <dt>Check in</dt>
              <dd className="tnum">Mulai {site.operations.checkIn}</dd>
            </div>
            <div>
              <dt>Check out</dt>
              <dd className="tnum">{site.operations.checkOut}</dd>
            </div>
            <div>
              <dt>Check out lambat</dt>
              <dd>
                Sampai {site.operations.lateCheckOut}, Rp{' '}
                {site.operations.lateCheckOutFee.toLocaleString('id-ID')}, gratis untuk Kabin
                Lembayung, dan hanya kalau unitnya belum dipesan tamu berikutnya
              </dd>
            </div>
            <div>
              <dt>Resepsionis</dt>
              <dd>{site.contact.receptionHours}, petugas malam menjaga sisanya</dd>
            </div>
            <div>
              <dt>Jam tenang</dt>
              <dd className="tnum">22.00 sampai 06.00</dd>
            </div>
          </dl>

          <h2>Api unggun</h2>
          <ul className="tick-list">
            <li>Api hanya dinyalakan di lingkar batu yang sudah ada, tidak di tempat lain</li>
            <li>Ember air dan ember pasir tidak boleh dipindahkan dari sisi lingkar api</li>
            <li>Kami tidak menyediakan cairan pemantik, dan cairan pemantik tidak boleh dibawa</li>
            <li>Jangan bakar plastik, styrofoam, kaleng bertekanan, atau kayu berpelitur</li>
            <li>Untuk api unggun pribadi di Tenda Bara, siram sampai berhenti berdesis sebelum tidur</li>
          </ul>

          <h2>Memasak dan makanan</h2>
          <p>
            Memasak di dalam unit tidak diizinkan. Panggangan tersedia di area Plaza Bara, dan Anda
            boleh membawa bahan sendiri dengan biaya pemakaian alat Rp 100.000. Membawa camilan dan
            minuman ringan bebas, tanpa biaya buka botol untuk minuman non alkohol. Minuman beralkohol
            hanya di dek unit masing masing, dan tidak di area umum setelah jam 22.00.
          </p>
          <p>
            Kalau ada alergi atau pantangan makan, sebutkan saat memesan, bukan saat makanan sudah
            datang, karena dapur kami kecil dan tidak bisa mengulang cepat.
          </p>

          <h2>Hewan peliharaan</h2>
          <p>{site.operations.petPolicy}</p>
          <p>
            Hewan harus selalu dengan tali di area umum, tidak boleh masuk Dapur Bara, dan tidak
            boleh ditinggal sendirian di dalam unit. Beri tahu saat memesan, bukan saat check in,
            karena unit yang menerima hewan jumlahnya terbatas.
          </p>

          <h2>Anak dan tamu tambahan</h2>
          <p>
            Anak di bawah 6 tahun tidak dihitung sebagai tamu dan tidak dikenakan biaya extra bed di
            Kabin Pinus. Tamu tambahan di luar kapasitas varian yang dipesan tidak diizinkan menginap,
            karena kapasitas tiap varian mengikuti jumlah tempat tidur yang benar benar ada.
          </p>

          <h2>Tanggung jawab</h2>
          <ul className="tick-list">
            <li>Kerusakan pada unit atau perlengkapan di luar pemakaian normal dibebankan pada tamu</li>
            <li>Merokok tidak diizinkan di dalam unit mana pun, termasuk di dalam tenda dan dome</li>
            <li>Kegiatan di lereng dan di jalur trekking mengikuti arahan pemandu dan instruktur</li>
            <li>Barang berharga adalah tanggung jawab tamu, tidak ada safe deposit di unit</li>
          </ul>

          <div className="note">
            <p style={{ marginBottom: 0 }}>
              Untuk rombongan sekolah dan kantor, ketentuan tambahan soal rasio pendamping, asuransi
              peserta, dan jam kegiatan ditulis di surat penawaran.
            </p>
          </div>

          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <a
              className="btn btn-cta"
              href={waLink('pertanyaan tentang syarat menginap di Lembayung')}
              target="_blank"
              rel="noopener"
            >
              Tanya lewat WhatsApp
            </a>
            <Link href="/kebijakan/pembatalan/" className="btn btn-outline">
              Kebijakan pembatalan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
