import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { site } from '@/data/site';
import { waLink } from '@/data/links';

export const metadata: Metadata = {
  title: 'Kebijakan Pembatalan dan Reschedule',
  description:
    'Tiga jenjang pengembalian: lebih dari 14 hari kembali 100 persen dipotong administrasi, 7 sampai 14 hari kembali 50 persen, kurang dari 7 hari tidak ada pengembalian tapi boleh pindah tanggal satu kali.',
};

export default function PembatalanPage() {
  return (
    <>
      <PageHero
        eyebrow="Kebijakan"
        title="Pembatalan dan pindah tanggal"
        lead="Tiga jenjang, ditulis lengkap di sini supaya tidak ada yang muncul di akhir. Untuk rombongan 30 orang ke atas, ketentuannya berbeda dan tertulis di surat penawaran."
        crumbs={[{ label: 'Kebijakan' }, { label: 'Pembatalan' }]}
      />

      <section className="section band">
        <div className="wrap measure prose">
          <h2>Jenjang pengembalian</h2>
          <div className="table-scroll">
            <table className="rate-table">
              <caption>Dihitung dari tanggal check in, bukan dari tanggal pemesanan.</caption>
              <thead>
                <tr>
                  <th scope="col">Kapan Anda membatalkan</th>
                  <th scope="col">Yang dikembalikan</th>
                </tr>
              </thead>
              <tbody>
                {site.operations.cancellation.map((c) => (
                  <tr key={c.window}>
                    <th scope="row">{c.window}</th>
                    <td>{c.refund}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Pindah tanggal</h2>
          <p>
            Pembatalan kurang dari 7 hari tidak mendapat pengembalian uang, tapi Anda boleh
            memindahkan tanggal satu kali ke tanggal lain dalam 90 hari, selama unitnya masih
            tersedia. Kalau tanggal baru jatuh di Jumat, Sabtu, atau libur nasional, selisih tarifnya
            dibayar. Kalau tanggal baru lebih murah, selisihnya tidak dikembalikan.
          </p>

          <h2>Uang muka dan pelunasan</h2>
          <p>
            Uang muka {site.operations.payment.depositPercent} persen dibayar saat memesan, sisanya
            saat tiba. Cara bayar yang kami terima: {site.operations.payment.methods.join(', ')}.{' '}
            {site.operations.payment.note}
          </p>

          <h2>Yang selalu kami kembalikan penuh</h2>
          <ul className="tick-list">
            <li>Pembatalan karena bencana alam</li>
            <li>Penutupan jalur resmi oleh pihak berwenang</li>
            <li>Kegiatan berbayar yang batal karena cuaca, dikembalikan penuh atau dijadwalkan ulang</li>
          </ul>

          <h2>Yang tidak kami kembalikan</h2>
          <p>
            Biaya menginap tidak dikembalikan karena hujan, karena unitnya tetap Anda pakai. Antara
            November dan Maret hujan sore hampir setiap hari di Lembang, dan kami menuliskannya di
            halaman FAQ serta di panduan cuaca supaya Anda memesan dengan tahu itu.
          </p>

          <div className="note">
            <p style={{ marginBottom: 0 }}>
              Untuk rombongan 30 peserta ke atas, jenjang di atas tidak berlaku. Ketentuannya
              ditulis per item di surat penawaran resmi, termasuk batas perubahan jumlah peserta.
            </p>
          </div>

          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <a
              className="btn btn-cta"
              href={waLink('pertanyaan tentang pembatalan atau pindah tanggal di Lembayung')}
              target="_blank"
              rel="noopener"
            >
              Tanya lewat WhatsApp
            </a>
            <Link href="/kebijakan/syarat/" className="btn btn-outline">
              Syarat menginap
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
