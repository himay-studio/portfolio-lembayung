'use client';

/**
 * Inventory. Fifteen bookable variants across six unit types, with tonight's occupancy read off
 * the same reservation set the calendar uses.
 *
 * R42 is visible here rather than merely respected: the unit TYPE is one column and the variant
 * dimensions (capacity, view) are separate columns on the same row. Filtering by capacity
 * narrows which rows are shown and never renames a unit, which is precisely the symptom that
 * proves a catalog was modelled with colour or capacity as the product identity.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Select, { type SelectOption } from '@/components/Select';
import { units } from '@/data/units';
import { rupiah } from '@/data/types';
import { KosongState, ThSort, ViewSwitcher, useViewPref, type Arah, type ViewDef } from './bits';
import { buildPanel, type BarisInventaris } from './data';

type Mode = 'tabel' | 'kartu';
type Kolom = 'sku' | 'unit' | 'kapasitas' | 'teras' | 'terisi' | 'harga';

const VIEWS: readonly ViewDef<Mode>[] = [
  { id: 'tabel', label: 'Tabel', ikon: 'tabel' },
  { id: 'kartu', label: 'Kartu', ikon: 'kartu' },
];
const MODE_IDS = VIEWS.map((v) => v.id);

const UNIT_OPT: SelectOption[] = [
  { value: 'semua', label: 'Semua tipe unit', ket: 'Enam tipe di lima teras' },
  ...units.map((u) => ({ value: u.slug, label: u.name, ket: u.structure })),
];

const ISI_OPT: SelectOption[] = [
  { value: 'semua', label: 'Semua varian' },
  { value: 'kosong', label: 'Masih ada yang kosong', ket: 'Terisi kurang dari stok malam ini' },
  { value: 'penuh', label: 'Penuh malam ini', ket: 'Semua unit varian ini terpakai' },
];

export default function InventarisWorkspace({ hariIni }: { hariIni: string }) {
  const data = useMemo(() => buildPanel(hariIni), [hariIni]);
  const [view, setView] = useViewPref<Mode>('inventaris', 'tabel', MODE_IDS);
  const [fUnit, setFUnit] = useState('semua');
  const [fIsi, setFIsi] = useState('semua');
  const [urut, setUrut] = useState<Kolom>('unit');
  const [arah, setArah] = useState<Arah>('naik');

  const sort = (k: Kolom) => {
    if (k === urut) setArah((a) => (a === 'naik' ? 'turun' : 'naik'));
    else {
      setUrut(k);
      setArah('naik');
    }
  };

  const hasil = useMemo(() => {
    const nilai = (b: BarisInventaris): string | number => {
      switch (urut) {
        case 'sku':
          return b.sku;
        case 'kapasitas':
          return b.kapasitas;
        case 'teras':
          return b.teras;
        case 'terisi':
          return b.terisi / Math.max(1, b.stok);
        case 'harga':
          return b.harga;
        default:
          return `${b.unitNama} ${b.kapasitas}`;
      }
    };
    return data.inventaris
      .filter((b) => {
        if (fUnit !== 'semua' && b.unitSlug !== fUnit) return false;
        if (fIsi === 'kosong' && b.terisi >= b.stok) return false;
        if (fIsi === 'penuh' && b.terisi < b.stok) return false;
        return true;
      })
      .sort((a, b) => {
        const x = nilai(a);
        const y = nilai(b);
        if (x === y) return a.sku < b.sku ? -1 : 1;
        return (x < y ? -1 : 1) * (arah === 'naik' ? 1 : -1);
      });
  }, [data.inventaris, fUnit, fIsi, urut, arah]);

  const stokTampil = hasil.reduce((a, b) => a + b.stok, 0);
  const isiTampil = hasil.reduce((a, b) => a + b.terisi, 0);
  const bersihkan = () => {
    setFUnit('semua');
    setFIsi('semua');
  };

  return (
    <>
      <header className="app-head">
        <h1 className="app-judul">Inventaris Unit</h1>
        <span className="app-sub">
          Lima belas varian yang bisa dipesan dari enam tipe unit. Kapasitas dan arah pandang adalah
          dimensi varian, bukan nama unit, jadi menyaring kapasitas mempersempit baris dan tidak pernah
          mengganti nama tipe unitnya.
        </span>

        <div className="app-aksi">
          <Link href="/unit/" className="btn btn-violet btn-sm">
            Buka katalog publik
          </Link>
          <Link href="/app/" className="btn btn-outline btn-sm">
            Lihat kalender reservasi
          </Link>
          {(fUnit !== 'semua' || fIsi !== 'semua') && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={bersihkan}>
              Bersihkan filter
            </button>
          )}
        </div>
      </header>

      <div className="app-stat-row">
        <div className="app-stat">
          <span className="app-stat-label">Varian ditampilkan</span>
          <span className="app-stat-nilai tnum">{hasil.length}</span>
          <span className="app-stat-ket">Dari {data.inventaris.length} varian yang bisa dipesan</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Unit fisik</span>
          <span className="app-stat-nilai tnum">{stokTampil}</span>
          <span className="app-stat-ket">Jumlah unit nyata di lapangan</span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Terisi malam ini</span>
          <span className="app-stat-nilai tnum">
            {isiTampil} dari {stokTampil}
          </span>
          <span className="app-stat-ket">
            {stokTampil > 0 ? Math.round((isiTampil / stokTampil) * 100) : 0} persen okupansi
          </span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Tarif terendah</span>
          <span className="app-stat-nilai tnum">
            {hasil.length > 0 ? rupiah(Math.min(...hasil.map((b) => b.harga))) : rupiah(0)}
          </span>
          <span className="app-stat-ket">Tarif hari biasa, per malam</span>
        </div>
      </div>

      <div className="app-filter">
        <Select label="Tipe unit" options={UNIT_OPT} value={fUnit} onChange={setFUnit} />
        <Select label="Ketersediaan malam ini" options={ISI_OPT} value={fIsi} onChange={setFIsi} />
      </div>

      <div className="app-viewbar">
        <ViewSwitcher views={VIEWS} value={view} onChange={setView} label="Tampilan inventaris" />
        <span className="app-hitung" role="status">
          {hasil.length} dari {data.inventaris.length} varian ditampilkan
        </span>
      </div>

      {hasil.length === 0 ? (
        <KosongState
          judul="Tidak ada varian yang cocok"
          ket="Kombinasi tipe unit dan ketersediaan ini tidak menyisakan satu varian pun. Longgarkan salah satu saringan untuk melihat inventaris lagi."
          aksi={
            <button type="button" className="btn btn-outline btn-sm" onClick={bersihkan}>
              Bersihkan filter
            </button>
          }
        />
      ) : view === 'tabel' ? (
        <div className="app-table-wrap">
          <table className="app-table">
            <caption className="sr-only">Inventaris varian unit beserta tarif dan okupansi malam ini.</caption>
            <thead>
              <tr>
                <ThSort id="sku" label="SKU" aktif={urut} arah={arah} onSort={sort} />
                <ThSort id="unit" label="Tipe unit" aktif={urut} arah={arah} onSort={sort} />
                <ThSort id="kapasitas" label="Varian" aktif={urut} arah={arah} onSort={sort} />
                <ThSort id="teras" label="Teras" aktif={urut} arah={arah} onSort={sort} />
                <ThSort id="terisi" label="Malam ini" aktif={urut} arah={arah} onSort={sort} />
                <ThSort id="harga" label="Tarif" aktif={urut} arah={arah} onSort={sort} />
                <th scope="col" className="app-col-opt">
                  <span className="app-th-plain">Kamar mandi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((b) => {
                const penuh = b.terisi >= b.stok;
                return (
                  <tr key={b.sku}>
                    <td className="app-td-kode">{b.sku}</td>
                    <td>
                      {/* R50: tipe unit dan strukturnya adalah dua blok terpisah dengan jarak. */}
                      <span className="app-cell">
                        <b>{b.unitNama}</b>
                        <span>{b.struktur}</span>
                      </span>
                    </td>
                    <td>
                      <span className="app-cell">
                        <b>{b.kapasitas} pax</b>
                        <span>{b.viewLabel}</span>
                      </span>
                    </td>
                    <td className="tnum">{b.teras}</td>
                    <td>
                      <span className="app-cell">
                        <b className="tnum">
                          {b.terisi} dari {b.stok}
                        </b>
                        <span>{penuh ? 'penuh' : `${b.stok - b.terisi} unit kosong`}</span>
                      </span>
                    </td>
                    <td>
                      <span className="app-cell">
                        <b className="tnum app-nowrap">{rupiah(b.harga)}</b>
                        <span className="app-nowrap">akhir pekan {rupiah(b.hargaAkhirPekan)}</span>
                      </span>
                    </td>
                    <td className="app-col-opt">{b.kamarMandi}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="snap-row cols-3">
          {hasil.map((b) => {
            const rasio = b.stok > 0 ? Math.round((b.terisi / b.stok) * 100) : 0;
            return (
              <article key={b.sku} className="app-card">
                <span className="app-card-head">
                  <span className="app-card-judul">
                    <span className="app-card-nama">{b.unitNama}</span>
                    <span className="app-card-kode">{b.sku}</span>
                  </span>
                  <span className="app-chip">Teras {b.teras}</span>
                </span>

                <dl className="app-dl">
                  <dt>Varian</dt>
                  <dd>
                    {b.kapasitas} pax, {b.viewLabel}
                  </dd>
                  <dt>Unit fisik</dt>
                  <dd>{b.stok}</dd>
                  <dt>Terisi</dt>
                  <dd>
                    {b.terisi} dari {b.stok}
                  </dd>
                  <dt>Tarif</dt>
                  <dd className="tnum">{rupiah(b.harga)}</dd>
                  <dt>Akhir pekan</dt>
                  <dd className="tnum">{rupiah(b.hargaAkhirPekan)}</dd>
                </dl>

                <span className={`app-cal-bar ${rasio >= 100 ? 'is-penuh' : ''}`} aria-hidden="true">
                  <span style={{ width: `${rasio}%` }} />
                </span>
                <span className="app-kecil">
                  {rasio} persen terisi malam ini, kamar mandi {b.kamarMandi.toLowerCase()}.
                </span>

                <Link href={`/unit/${b.unitSlug}/`} className="app-mini">
                  Halaman publik {b.unitNama}
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
