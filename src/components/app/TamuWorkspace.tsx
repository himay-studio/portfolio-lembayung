'use client';

/**
 * Guests. Aggregated from the reservation set rather than kept as a second list, so a booking
 * and the guest record behind it can never drift apart.
 *
 * Two views: a sortable table for scanning, and cards for browsing. The chosen one is
 * remembered separately from the reservation screen's choice, because they are different pages
 * with different shapes, and a single global "view" preference is how a panel ends up opening a
 * calendar on a screen that has no calendar.
 */

import { useMemo, useState } from 'react';
import Select, { type SelectOption } from '@/components/Select';
import { rupiah } from '@/data/types';
import { panjang, pendek } from '@/lib/tanggal';
import { KosongState, ThSort, ViewSwitcher, initial, useViewPref, type Arah, type ViewDef } from './bits';
import { buildPanel, type Tamu } from './data';

type Mode = 'tabel' | 'kartu';
type Kolom = 'nama' | 'menginap' | 'malam' | 'belanja' | 'terakhir';

const VIEWS: readonly ViewDef<Mode>[] = [
  { id: 'tabel', label: 'Tabel', ikon: 'tabel' },
  { id: 'kartu', label: 'Kartu', ikon: 'kartu' },
];
const MODE_IDS = VIEWS.map((v) => v.id);

const SEGMEN_OPT: SelectOption[] = [
  { value: 'semua', label: 'Semua tamu' },
  { value: 'Baru', label: 'Baru', ket: 'Satu kali menginap' },
  { value: 'Berulang', label: 'Berulang', ket: 'Lebih dari satu kali menginap' },
  { value: 'Rombongan', label: 'Rombongan', ket: 'Panitia kantor dan sekolah' },
];

export default function TamuWorkspace({ hariIni }: { hariIni: string }) {
  const data = useMemo(() => buildPanel(hariIni), [hariIni]);
  const [view, setView] = useViewPref<Mode>('tamu', 'tabel', MODE_IDS);
  const [cari, setCari] = useState('');
  const [segmen, setSegmen] = useState('semua');
  const [urut, setUrut] = useState<Kolom>('belanja');
  const [arah, setArah] = useState<Arah>('turun');

  const sort = (k: Kolom) => {
    if (k === urut) setArah((a) => (a === 'naik' ? 'turun' : 'naik'));
    else {
      setUrut(k);
      setArah(k === 'nama' ? 'naik' : 'turun');
    }
  };

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    const nilai = (t: Tamu): string | number => {
      switch (urut) {
        case 'nama':
          return t.nama;
        case 'menginap':
          return t.menginap;
        case 'malam':
          return t.malam;
        case 'terakhir':
          return t.terakhir;
        default:
          return t.belanja;
      }
    };
    return data.tamu
      .filter((t) => {
        if (segmen !== 'semua' && t.segmen !== segmen) return false;
        if (!q) return true;
        return `${t.nama} ${t.kota} ${t.email}`.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const x = nilai(a);
        const y = nilai(b);
        if (x === y) return a.nama < b.nama ? -1 : 1;
        return (x < y ? -1 : 1) * (arah === 'naik' ? 1 : -1);
      });
  }, [data.tamu, cari, segmen, urut, arah]);

  const berulang = data.tamu.filter((t) => t.segmen === 'Berulang').length;
  const rombongan = data.tamu.filter((t) => t.segmen === 'Rombongan').length;
  const totalBelanja = data.tamu.reduce((a, t) => a + t.belanja, 0);
  const bersihkan = () => {
    setCari('');
    setSegmen('semua');
  };

  return (
    <>
      <header className="app-head">
        <h1 className="app-judul">Tamu</h1>
        <span className="app-sub">
          Diringkas dari seluruh reservasi dalam rentang data demo, tiga minggu ke belakang sampai enam minggu ke depan. Angka belanja tidak menghitung
          reservasi yang dibatalkan, jadi laporan ini tidak pernah lebih besar dari yang benar benar
          masuk.
        </span>

        <div className="app-aksi">
          <button
            type="button"
            className="btn btn-violet btn-sm"
            onClick={() => {
              setSegmen('Berulang');
              setUrut('belanja');
              setArah('turun');
            }}
          >
            Lihat tamu berulang
          </button>
          {(cari !== '' || segmen !== 'semua') && (
            <button type="button" className="btn btn-outline btn-sm" onClick={bersihkan}>
              Bersihkan filter
            </button>
          )}
        </div>
      </header>

      <div className="app-stat-row">
        <div className="app-stat">
          <span className="app-stat-label">Tamu tercatat</span>
          <span className="app-stat-nilai tnum">{data.tamu.length}</span>
          <span className="app-stat-ket">Nama unik dalam rentang data ini</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Tamu berulang</span>
          <span className="app-stat-nilai tnum">{berulang}</span>
          <span className="app-stat-ket">Menginap lebih dari satu kali</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Rombongan</span>
          <span className="app-stat-nilai tnum">{rombongan}</span>
          <span className="app-stat-ket">Panitia kantor dan sekolah</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Nilai tercatat</span>
          <span className="app-stat-nilai tnum">{rupiah(totalBelanja)}</span>
          <span className="app-stat-ket">Tidak termasuk yang dibatalkan</span>
        </div>
      </div>

      <div className="app-filter">
        <div className="field">
          <label className="field-label" htmlFor="app-cari-tamu">
            Cari tamu
          </label>
          <input
            id="app-cari-tamu"
            className="input"
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Nama, kota, surel"
            autoComplete="off"
          />
        </div>
        <Select label="Segmen" options={SEGMEN_OPT} value={segmen} onChange={setSegmen} />
      </div>

      <div className="app-viewbar">
        <ViewSwitcher views={VIEWS} value={view} onChange={setView} label="Tampilan tamu" />
        <span className="app-hitung" role="status">
          {hasil.length} dari {data.tamu.length} tamu ditampilkan
        </span>
      </div>

      {hasil.length === 0 ? (
        <KosongState
          judul="Tidak ada tamu yang cocok"
          ket="Pencarian dan segmen yang aktif sekarang tidak menemukan satu nama pun. Kosongkan kolom pencarian atau pilih segmen semua tamu."
          aksi={
            <button type="button" className="btn btn-outline btn-sm" onClick={bersihkan}>
              Bersihkan filter
            </button>
          }
        />
      ) : view === 'tabel' ? (
        <div className="app-table-wrap">
          <table className="app-table">
            <caption className="sr-only">Daftar tamu beserta riwayat menginap dan nilai belanja.</caption>
            <thead>
              <tr>
                <ThSort id="nama" label="Tamu" aktif={urut} arah={arah} onSort={sort} />
                <th scope="col" className="app-col-opt">
                  <span className="app-th-plain">Kontak</span>
                </th>
                <ThSort id="menginap" label="Menginap" aktif={urut} arah={arah} onSort={sort} />
                <ThSort id="malam" label="Malam" aktif={urut} arah={arah} onSort={sort} />
                <ThSort id="belanja" label="Nilai" aktif={urut} arah={arah} onSort={sort} />
                <ThSort id="terakhir" label="Terakhir" aktif={urut} arah={arah} onSort={sort} />
                <th scope="col">
                  <span className="app-th-plain">Segmen</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((t) => (
                <tr key={t.nama}>
                  <td>
                    {/* R50: nama dan kota adalah dua blok terpisah dengan jarak. */}
                    <span className="app-cell">
                      <b>{t.nama}</b>
                      <span>{t.kota}</span>
                    </span>
                  </td>
                  <td className="app-col-opt">
                    <span className="app-cell">
                      <b className="app-nowrap">{t.telepon}</b>
                      <span>{t.email}</span>
                    </span>
                  </td>
                  <td className="tnum">{t.menginap}</td>
                  <td className="tnum">{t.malam}</td>
                  <td className="tnum app-nowrap">{rupiah(t.belanja)}</td>
                  <td className="app-nowrap">{pendek(t.terakhir)}</td>
                  <td>
                    <span className="app-chip">{t.segmen}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="snap-row cols-3">
          {hasil.map((t) => (
            <article key={t.nama} className="app-card">
              <span className="app-card-head">
                <span className="app-card-judul">
                  <span className="app-card-nama">{t.nama}</span>
                  <span className="app-card-kode">{t.kota}</span>
                </span>
                <span className="app-avatar" aria-hidden="true">
                  {initial(t.nama)}
                </span>
              </span>

              <dl className="app-dl">
                <dt>Menginap</dt>
                <dd>{t.menginap} kali</dd>
                <dt>Malam</dt>
                <dd>{t.malam} malam</dd>
                <dt>Nilai</dt>
                <dd className="tnum">{rupiah(t.belanja)}</dd>
                <dt>Terakhir</dt>
                <dd>{panjang(t.terakhir)}</dd>
              </dl>

              <span className="app-baris">
                <span className="app-chip">{t.segmen}</span>
                <span className="app-chip">{t.telepon}</span>
              </span>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
