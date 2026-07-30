'use client';

/**
 * The reservation workspace: one dataset, four ways of looking at it.
 *
 * App standard 3, and the reason this screen exists in four modes rather than one:
 *   Kalender  occupancy, arrivals and departures against inventory. The DEFAULT, because on an
 *             accommodation site the operational question is always about a date.
 *   Tabel     dense scanning, sortable columns, sticky header, row selection, bulk actions.
 *   Kartu     browsing, one booking at a glance.
 *   Papan     the lifecycle, drag or keyboard, status committed on drop.
 *
 * Two invariants hold across all four:
 *   - The chosen view is remembered PER PAGE (localStorage, read after mount so a static export
 *     cannot hydrate into a mismatch).
 *   - Switching view NEVER resets the filters. Filters live here, view lives in its own hook,
 *     and neither writes to the other.
 *
 * Mutations (a status move, a new booking) are held in this component for the life of the tab
 * and are deliberately NOT persisted. This is a demo over a static export: a status override
 * written to localStorage in July would still be sitting on a reservation whose dates have long
 * passed, and a panel that lies about its own data is worse than one that resets.
 */

import { useMemo, useState } from 'react';
import Select, { type SelectOption } from '@/components/Select';
import DateRangePicker from '@/components/DateRangePicker';
import { units } from '@/data/units';
import { rupiah } from '@/data/types';
import { KosongState, Overlay, Skeleton, ViewSwitcher, useViewPref, type ViewDef } from './bits';
import {
  buildPanel,
  keluarPada,
  masukPada,
  menginapPada,
  STATUS,
  STATUS_LABEL,
  type Reservasi,
  type Status,
} from './data';
import ReservasiKalender from './ReservasiKalender';
import ReservasiTabel from './ReservasiTabel';
import ReservasiKartu from './ReservasiKartu';
import ReservasiPapan from './ReservasiPapan';
import ReservasiDetail from './ReservasiDetail';
import ReservasiForm from './ReservasiForm';

type Mode = 'kalender' | 'tabel' | 'kartu' | 'papan';

const VIEWS: readonly ViewDef<Mode>[] = [
  { id: 'kalender', label: 'Kalender', ikon: 'kalender' },
  { id: 'tabel', label: 'Tabel', ikon: 'tabel' },
  { id: 'kartu', label: 'Kartu', ikon: 'kartu' },
  { id: 'papan', label: 'Papan', ikon: 'papan' },
];
const MODE_IDS = VIEWS.map((v) => v.id);

const STATUS_OPT: SelectOption[] = [
  { value: 'semua', label: 'Semua status', ket: 'Termasuk yang dibatalkan' },
  ...STATUS.map((s) => ({ value: s, label: STATUS_LABEL[s] })),
];

const UNIT_OPT: SelectOption[] = [
  { value: 'semua', label: 'Semua tipe unit', ket: 'Enam tipe, lima belas varian' },
  ...units.map((u) => ({ value: u.slug, label: u.name, ket: u.structure })),
];

export default function ReservasiWorkspace({ hariIni }: { hariIni: string }) {
  const data = useMemo(() => buildPanel(hariIni), [hariIni]);

  const [view, setView] = useViewPref<Mode>('reservasi', 'kalender', MODE_IDS);
  const [cari, setCari] = useState('');
  const [fStatus, setFStatus] = useState('semua');
  const [fUnit, setFUnit] = useState('semua');
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');

  const [ubah, setUbah] = useState<Record<string, Status>>({});
  const [tambahan, setTambahan] = useState<Reservasi[]>([]);
  const [detail, setDetail] = useState<string | null>(null);
  const [form, setForm] = useState(false);

  const semua = useMemo(
    () =>
      [...data.reservasi, ...tambahan].map((r) => (ubah[r.kode] ? { ...r, status: ubah[r.kode]! } : r)),
    [data.reservasi, tambahan, ubah],
  );

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return semua.filter((r) => {
      if (fStatus !== 'semua' && r.status !== fStatus) return false;
      if (fUnit !== 'semua' && r.unitSlug !== fUnit) return false;
      if (dari && sampai && !(r.masuk < sampai && r.keluar > dari)) return false;
      if (!q) return true;
      return `${r.kode} ${r.tamu} ${r.kota} ${r.unitNama} ${r.sku} ${r.kanal}`.toLowerCase().includes(q);
    });
  }, [semua, cari, fStatus, fUnit, dari, sampai]);

  /* the calendar's occupancy denominator has to follow the unit filter, otherwise "2 dari 28"
     is a lie the moment somebody narrows to one tipe unit */
  const kapasitas = useMemo(() => {
    if (fUnit === 'semua') return data.totalUnit;
    const u = units.find((x) => x.slug === fUnit);
    return u ? u.variants.reduce((a, v) => a + v.stock, 0) : data.totalUnit;
  }, [fUnit, data.totalUnit]);

  const aktifFilter = cari !== '' || fStatus !== 'semua' || fUnit !== 'semua' || Boolean(dari && sampai);
  const bersihkan = () => {
    setCari('');
    setFStatus('semua');
    setFUnit('semua');
    setDari('');
    setSampai('');
  };

  const ubahStatus = (kode: string[], status: Status) => {
    setUbah((v) => {
      const next = { ...v };
      for (const k of kode) next[k] = status;
      return next;
    });
  };

  const terpilih = detail ? (hasil.find((r) => r.kode === detail) ?? semua.find((r) => r.kode === detail)) : null;

  /* stat tiles, all counted on tonight */
  const malamIni = menginapPada(semua, hariIni).length;
  const masukIni = masukPada(semua, hariIni).length;
  const keluarIni = keluarPada(semua, hariIni).length;
  const perluAksi = semua.filter((r) => r.status === 'permintaan').length;
  const nilaiTertunda = semua
    .filter((r) => r.status === 'permintaan' || r.status === 'dikonfirmasi')
    .reduce((a, r) => a + (r.total - r.dibayar), 0);

  const unduh = () => {
    const kolom = ['kode', 'tamu', 'kota', 'unit', 'sku', 'masuk', 'keluar', 'malam', 'pax', 'status', 'kanal', 'total'];
    const baris = hasil.map((r) =>
      [r.kode, r.tamu, r.kota, r.unitNama, r.sku, r.masuk, r.keluar, r.malam, r.pax, r.status, r.kanal, r.total]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    );
    const isi = [kolom.join(','), ...baris].join('\n');
    const url = URL.createObjectURL(new Blob([isi], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservasi-lembayung-${hariIni}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="app-head">
        <h1 className="app-judul">Reservasi</h1>
        {/* R50: the title and its summary line are separate blocks with a gap. */}
        <span className="app-sub">
          {data.totalUnit} unit di lima teras, {semua.length} reservasi dari tiga minggu ke belakang
          sampai enam minggu ke depan. Kalender adalah tampilan bawaan karena pertanyaan pertama di
          bisnis penginapan selalu tentang tanggal, bukan tentang daftar.
        </span>

        {/* App standard 2: aksi utama di KIRI, sejajar judul, bukan dibuang ke pojok kanan. */}
        <div className="app-aksi">
          <button type="button" className="btn btn-violet btn-sm" onClick={() => setForm(true)}>
            Reservasi baru
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={unduh}>
            Unduh CSV
          </button>
          {aktifFilter && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={bersihkan}>
              Bersihkan filter
            </button>
          )}
        </div>
      </header>

      <div className="app-stat-row">
        <div className="app-stat">
          <span className="app-stat-label">Terisi malam ini</span>
          <span className="app-stat-nilai tnum">
            {malamIni} dari {data.totalUnit}
          </span>
          <span className="app-stat-ket">Unit yang ditempati pada malam ini</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Check in hari ini</span>
          <span className="app-stat-nilai tnum">{masukIni}</span>
          <span className="app-stat-ket">Mulai jam 14.00 di resepsionis</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Check out hari ini</span>
          <span className="app-stat-nilai tnum">{keluarIni}</span>
          <span className="app-stat-ket">Batas jam 12.00, lambat sampai 14.00</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Menunggu konfirmasi</span>
          <span className="app-stat-nilai tnum">{perluAksi}</span>
          <span className="app-stat-ket">Nilai tertunda {rupiah(nilaiTertunda)}</span>
        </div>
      </div>

      <div className="app-filter">
        <div className="field">
          <label className="field-label" htmlFor="app-cari">
            Cari
          </label>
          <input
            id="app-cari"
            className="input"
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Kode, nama tamu, unit, SKU"
            autoComplete="off"
          />
        </div>
        <Select label="Status" options={STATUS_OPT} value={fStatus} onChange={setFStatus} />
        <Select label="Tipe unit" options={UNIT_OPT} value={fUnit} onChange={setFUnit} />
        <DateRangePicker
          from={dari}
          to={sampai}
          onChange={(f, t) => {
            setDari(f);
            setSampai(t);
          }}
          label="Rentang menginap"
          hint="Menyaring reservasi yang bersinggungan dengan rentang ini."
        />
      </div>

      <div className="app-viewbar">
        <ViewSwitcher views={VIEWS} value={view} onChange={setView} label="Tampilan reservasi" />
        <span className="app-hitung" role="status">
          {hasil.length} dari {semua.length} reservasi ditampilkan
        </span>
      </div>

      {hasil.length === 0 ? (
        <KosongState
          judul="Tidak ada reservasi yang cocok"
          ket="Saringan yang aktif sekarang tidak menemukan satu pun reservasi. Longgarkan salah satunya, atau buat reservasi baru langsung dari panel ini."
          aksi={
            <div className="app-baris">
              <button type="button" className="btn btn-outline btn-sm" onClick={bersihkan}>
                Bersihkan filter
              </button>
              <button type="button" className="btn btn-violet btn-sm" onClick={() => setForm(true)}>
                Reservasi baru
              </button>
            </div>
          }
        />
      ) : view === 'kalender' ? (
        <ReservasiKalender
          list={hasil}
          hariIni={hariIni}
          kapasitas={kapasitas}
          onPilih={(r) => setDetail(r.kode)}
        />
      ) : view === 'tabel' ? (
        <ReservasiTabel list={hasil} onPilih={(r) => setDetail(r.kode)} onUbahStatus={ubahStatus} />
      ) : view === 'kartu' ? (
        <ReservasiKartu list={hasil} onPilih={(r) => setDetail(r.kode)} />
      ) : view === 'papan' ? (
        <ReservasiPapan list={hasil} onPilih={(r) => setDetail(r.kode)} onUbahStatus={ubahStatus} />
      ) : (
        <Skeleton />
      )}

      <Overlay
        open={Boolean(terpilih)}
        onClose={() => setDetail(null)}
        label="Rincian reservasi"
        panelClass="app-rec-panel"
      >
        {terpilih ? (
          <ReservasiDetail r={terpilih} onTutup={() => setDetail(null)} onUbahStatus={ubahStatus} />
        ) : null}
      </Overlay>

      <Overlay open={form} onClose={() => setForm(false)} label="Reservasi baru" panelClass="app-rec-panel">
        <ReservasiForm
          nomor={tambahan.length}
          onTutup={() => setForm(false)}
          onSimpan={(r) => {
            setTambahan((v) => [...v, r]);
            setForm(false);
            setDetail(r.kode);
          }}
        />
      </Overlay>
    </>
  );
}
