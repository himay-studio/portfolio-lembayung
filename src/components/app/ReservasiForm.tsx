'use client';

/**
 * New reservation form, rendered inside the portalled record panel.
 *
 * R12 and R21 are answered by REUSING the marketing site's own controls rather than
 * hand rolling panel versions of them: `Select` is the custom animated listbox with full
 * keyboard support, and `DateRangePicker` is the custom range calendar. There is no native
 * `<select>` and no free text date field anywhere in this panel, and reusing the components
 * means a fix to either one lands on both sides of the site at once.
 *
 * The rate is computed from the SAME weekend night helper the marketing booking panel uses, so
 * a quote raised here cannot disagree with the quote a guest saw on the public page.
 */

import { useMemo, useState } from 'react';
import Select, { type SelectOption } from '@/components/Select';
import DateRangePicker from '@/components/DateRangePicker';
import { units } from '@/data/units';
import { site } from '@/data/site';
import { rupiah, VIEW_LABEL } from '@/data/types';
import { nights, weekendNights } from '@/lib/tanggal';
import { KANAL, type Kanal, type Reservasi } from './data';

const PAX: SelectOption[] = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20].map((n) => ({
  value: String(n),
  label: `${n} tamu`,
}));

const KANAL_OPT: SelectOption[] = KANAL.map((k) => ({
  value: k,
  label: k,
  ket: k === 'Agen' ? 'Pemesanan lewat agen perjalanan' : `Masuk lewat ${k.toLowerCase()}`,
}));

export default function ReservasiForm({
  onTutup,
  onSimpan,
  nomor,
}: {
  onTutup: () => void;
  onSimpan: (r: Reservasi) => void;
  /** Sequence for the generated booking code, so two additions never collide. */
  nomor: number;
}) {
  const varianOpt = useMemo<SelectOption[]>(
    () =>
      units.flatMap((u) =>
        u.variants.map((v) => ({
          value: v.sku,
          label: `${u.name}, ${v.capacity} pax, ${VIEW_LABEL[v.view]}`,
          ket: `${v.sku}, ${rupiah(v.price)} per malam, akhir pekan ${rupiah(v.weekendPrice)}`,
        })),
      ),
    [],
  );

  const [nama, setNama] = useState('');
  const [kota, setKota] = useState('');
  const [sku, setSku] = useState(varianOpt[0]?.value ?? '');
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');
  const [pax, setPax] = useState('2');
  const [kanal, setKanal] = useState<string>('Situs');
  const [galat, setGalat] = useState<string[]>([]);

  const pilihan = useMemo(() => {
    for (const u of units) {
      const v = u.variants.find((x) => x.sku === sku);
      if (v) return { u, v };
    }
    return null;
  }, [sku]);

  const malam = nights(dari, sampai);
  const akhirPekan = weekendNights(dari, sampai, site.operations.weekendDays);
  const total = pilihan
    ? (malam - akhirPekan) * pilihan.v.price + akhirPekan * pilihan.v.weekendPrice
    : 0;

  const kirim = (e: React.FormEvent) => {
    e.preventDefault();
    const masalah: string[] = [];
    if (!nama.trim()) masalah.push('Nama tamu belum diisi.');
    if (!dari || !sampai) masalah.push('Tanggal check in dan check out belum lengkap.');
    if (!pilihan) masalah.push('Unit belum dipilih.');
    setGalat(masalah);
    if (masalah.length > 0 || !pilihan) return;

    onSimpan({
      kode: `LMB-9${String(100 + nomor)}`,
      tamu: nama.trim(),
      kota: kota.trim() || 'Tidak dicatat',
      telepon: 'Belum dicatat',
      email: 'Belum dicatat',
      unitSlug: pilihan.u.slug,
      unitNama: pilihan.u.name,
      sku: pilihan.v.sku,
      kapasitas: pilihan.v.capacity,
      view: pilihan.v.view,
      masuk: dari,
      keluar: sampai,
      malam,
      malamAkhirPekan: akhirPekan,
      pax: Number(pax),
      status: 'permintaan',
      kanal: kanal as Kanal,
      total,
      dibayar: 0,
      catatan: 'Dibuat dari panel reservasi.',
      dibuat: dari,
    });
  };

  return (
    <>
      <div className="app-rec-head">
        <span className="app-rec-teks">
          <span className="app-rec-judul">Reservasi baru</span>
          <span className="app-rec-ket" style={{ color: 'var(--kabut)' }}>
            Masuk ke papan sebagai permintaan
          </span>
        </span>
        <button type="button" className="app-tutup" onClick={onTutup} aria-label="Tutup formulir reservasi">
          &#10005;
        </button>
      </div>

      <form className="app-rec-body" onSubmit={kirim} noValidate>
        {galat.length > 0 && (
          <div className="app-galat" role="alert">
            {galat.join(' ')}
          </div>
        )}

        <div className="stack">
          <div className="field">
            <label className="field-label" htmlFor="app-nama">
              Nama tamu
            </label>
            <input
              id="app-nama"
              className="input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama lengkap sesuai identitas"
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="app-kota">
              Asal kota
            </label>
            <input
              id="app-kota"
              className="input"
              value={kota}
              onChange={(e) => setKota(e.target.value)}
              placeholder="Contoh: Bandung"
              autoComplete="off"
            />
          </div>

          <Select
            label="Unit dan varian"
            options={varianOpt}
            value={sku}
            onChange={setSku}
            hint="Kapasitas dan arah pandang adalah varian dari satu tipe unit, bukan unit terpisah."
          />

          <DateRangePicker
            from={dari}
            to={sampai}
            onChange={(f, t) => {
              setDari(f);
              setSampai(t);
            }}
            label="Tanggal menginap"
            hint="Klik sekali untuk check in, klik lagi untuk check out."
          />

          <Select label="Jumlah tamu" options={PAX} value={pax} onChange={setPax} />
          <Select label="Kanal pemesanan" options={KANAL_OPT} value={kanal} onChange={setKanal} />
        </div>

        <div className="app-rec-blok">
          <h3>Perkiraan tagihan</h3>
          <dl>
            <div className="app-rec-baris">
              <dt>Malam</dt>
              <dd>{malam > 0 ? `${malam} malam` : 'belum ada tanggal'}</dd>
            </div>
            <div className="app-rec-baris">
              <dt>Malam akhir pekan</dt>
              <dd>{akhirPekan}</dd>
            </div>
            <div className="app-rec-baris">
              <dt>Total</dt>
              <dd className="tnum">{rupiah(total)}</dd>
            </div>
          </dl>
        </div>

        <div className="app-baris" style={{ marginTop: '1.25rem' }}>
          <button type="submit" className="btn btn-cta btn-sm">
            Simpan reservasi
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={onTutup}>
            Batal
          </button>
        </div>
      </form>
    </>
  );
}
