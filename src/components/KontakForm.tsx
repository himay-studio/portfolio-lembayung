'use client';

/* Contact form.
 *
 * R12: the topic field is the custom animated Select, never a native <select>.
 * R21: the visit date is the custom range picker, never a free text input.
 * R14: submitting is a CONVERSION action, so it opens WhatsApp with the whole enquiry already in
 *      the message body. That keeps the demo honest, there is no backend on a static export, and
 *      it is the behaviour a real client would want anyway.
 * R24: the result panel below is inserted AFTER mount and carries `.reveal`, so it depends on the
 *      MutationObserver in ClientEffects. A mount only reveal scan leaves it at opacity 0 and the
 *      form reads as broken after submit, which is the HIM-169 defect.
 * R19: every field renders a visible label AND a placeholder, because a blank white input box with
 *      nothing in it is the exact mobile failure Komodrift shipped.
 */

import { useState } from 'react';
import Select from '@/components/Select';
import DateRangePicker from '@/components/DateRangePicker';
import { waLink } from '@/data/links';
import { panjang } from '@/lib/tanggal';

const TOPIK = [
  { value: 'menginap', label: 'Pesan menginap', ket: 'Satu unit, dua sampai enam orang' },
  { value: 'paket', label: 'Paket berdua atau keluarga', ket: 'Senja Berdua, Akhir Pekan Keluarga' },
  { value: 'rombongan', label: 'Gathering kantor atau sekolah', ket: 'Minimal 30 peserta, hari kerja' },
  { value: 'acara', label: 'Lamaran, ulang tahun, syukuran', ket: 'Sampai 10 orang' },
  { value: 'lain', label: 'Pertanyaan lain', ket: 'Rute, fasilitas, kebijakan' },
];

export default function KontakForm() {
  const [nama, setNama] = useState('');
  const [telepon, setTelepon] = useState('');
  const [topik, setTopik] = useState('menginap');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [pesan, setPesan] = useState('');
  const [sent, setSent] = useState(false);

  const label = TOPIK.find((t) => t.value === topik)?.label ?? topik;
  const context = [
    label.toLowerCase(),
    nama ? `nama ${nama}` : '',
    telepon ? `nomor ${telepon}` : '',
    from && to ? `tanggal ${panjang(from)} sampai ${panjang(to)}` : '',
    pesan ? `catatan ${pesan}` : '',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <form
      className="booking"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        window.open(waLink(context), '_blank', 'noopener');
      }}
    >
      <div className="booking-grid">
        <div className="field">
          <label className="field-label" htmlFor="kontak-nama">
            Nama
          </label>
          <input
            id="kontak-nama"
            className="input"
            name="nama"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama lengkap Anda"
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="kontak-telepon">
            Nomor WhatsApp
          </label>
          <input
            id="kontak-telepon"
            className="input"
            name="telepon"
            inputMode="tel"
            required
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
            placeholder="08xx xxxx xxxx"
          />
          <span className="field-hint">Kami balas ke nomor ini, jadi pastikan aktif di WhatsApp.</span>
        </div>

        <div className="booking-span">
          <Select label="Keperluan" name="topik" options={TOPIK} value={topik} onChange={setTopik} />
        </div>

        <div className="booking-span">
          <DateRangePicker
            from={from}
            to={to}
            onChange={(a, b) => {
              setFrom(a);
              setTo(b);
            }}
            label="Rencana tanggal"
            hint="Boleh dikosongkan kalau tanggalnya masih fleksibel."
          />
        </div>

        <div className="booking-span field">
          <label className="field-label" htmlFor="kontak-pesan">
            Pesan
          </label>
          <textarea
            id="kontak-pesan"
            className="textarea"
            name="pesan"
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            placeholder="Berapa orang, ada anak kecil atau tidak, dan hal lain yang perlu kami tahu."
          />
        </div>

        <div className="booking-span">
          {/* R5: green, because this is a conversion action */}
          <button type="submit" className="btn btn-cta btn-block">
            Kirim lewat WhatsApp
          </button>
        </div>
      </div>

      {sent && (
        /* R24: inserted after mount, revealed by the MutationObserver */
        <div className="booking-out reveal">
          <p className="kecil" style={{ marginBottom: 0 }}>
            WhatsApp sudah dibuka di tab baru dengan isi pesan Anda. Kalau tabnya diblokir peramban,
            tekan tombolnya sekali lagi. Ini demo portofolio, jadi tidak ada data yang disimpan di
            server.
          </p>
        </div>
      )}
    </form>
  );
}
