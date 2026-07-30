'use client';

/**
 * Table view. Dense data, so this is the mode built for scanning and for acting in bulk.
 *
 * App standard 3: columns sort, the header stays put while the rows scroll, rows are
 * selectable, and the bulk action bar only exists while something is selected.
 *
 * The sticky header deserves a note, because the obvious implementation silently does nothing.
 * A wide table needs a scroll box so the PAGE never scrolls sideways (R19), and a box with
 * `overflow-x: auto` computes `overflow-y` to `auto` as well. That makes the box a scroll
 * container, so a `thead` sticking to the viewport inside it never triggers. The fix is to own
 * that vertical axis deliberately: the box gets its own max-height, and the header sticks to
 * the box. See `.app-table-wrap` in app.css.
 */

import { useMemo, useState } from 'react';
import { rupiah } from '@/data/types';
import { pendek } from '@/lib/tanggal';
import { Centang, StatusBadge, ThSort, type Arah } from './bits';
import { sisaTagihan, type Reservasi, type Status } from './data';

type Kolom = 'kode' | 'tamu' | 'unit' | 'masuk' | 'malam' | 'status' | 'total';

export default function ReservasiTabel({
  list,
  onPilih,
  onUbahStatus,
}: {
  list: Reservasi[];
  onPilih: (r: Reservasi) => void;
  onUbahStatus: (kode: string[], status: Status) => void;
}) {
  const [urut, setUrut] = useState<Kolom>('masuk');
  const [arah, setArah] = useState<Arah>('naik');
  const [pilih, setPilih] = useState<string[]>([]);

  const sort = (k: Kolom) => {
    if (k === urut) setArah((a) => (a === 'naik' ? 'turun' : 'naik'));
    else {
      setUrut(k);
      setArah('naik');
    }
  };

  const baris = useMemo(() => {
    const nilai = (r: Reservasi): string | number => {
      switch (urut) {
        case 'kode':
          return r.kode;
        case 'tamu':
          return r.tamu;
        case 'unit':
          return `${r.unitNama} ${r.sku}`;
        case 'malam':
          return r.malam;
        case 'status':
          return r.status;
        case 'total':
          return r.total;
        default:
          return r.masuk;
      }
    };
    const arr = [...list].sort((a, b) => {
      const x = nilai(a);
      const y = nilai(b);
      if (x === y) return a.kode < b.kode ? -1 : 1;
      return (x < y ? -1 : 1) * (arah === 'naik' ? 1 : -1);
    });
    return arr;
  }, [list, urut, arah]);

  /* a selection is only meaningful while the row is still in the filtered set */
  const terpilih = pilih.filter((k) => list.some((r) => r.kode === k));
  const semua = terpilih.length > 0 && terpilih.length === list.length;

  const toggle = (kode: string, on: boolean) =>
    setPilih((p) => (on ? [...new Set([...p, kode])] : p.filter((k) => k !== kode)));

  const massal = (status: Status) => {
    onUbahStatus(terpilih, status);
    setPilih([]);
  };

  return (
    <>
      {/* `on-dark` is not decoration: site.css hangs the inverted focus ring and the CTA
          hairline off it, and this bar is a --senja ground sitting in a light workspace. */}
      {terpilih.length > 0 && (
        <div className="app-bulk on-dark" role="status">
          <span className="app-bulk-teks">{terpilih.length} reservasi dipilih</span>
          <button type="button" className="btn btn-cta btn-sm" onClick={() => massal('dikonfirmasi')}>
            Konfirmasi
          </button>
          <button type="button" className="btn btn-outline-inv btn-sm" onClick={() => massal('selesai')}>
            Tandai selesai
          </button>
          <button type="button" className="btn btn-outline-inv btn-sm" onClick={() => massal('batal')}>
            Batalkan
          </button>
          <button type="button" className="btn btn-ghost-inv btn-sm" onClick={() => setPilih([])}>
            Bersihkan pilihan
          </button>
        </div>
      )}

      <div className="app-table-wrap">
        <table className="app-table">
          <caption className="sr-only">
            Daftar reservasi. Kolom dapat diurutkan, baris dapat dipilih untuk aksi massal.
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="app-th-plain">
                  <Centang
                    checked={semua}
                    onChange={(on) => setPilih(on ? list.map((r) => r.kode) : [])}
                    label="Pilih semua reservasi yang tampil"
                  />
                </span>
              </th>
              <ThSort id="kode" label="Kode" aktif={urut} arah={arah} onSort={sort} />
              <ThSort id="tamu" label="Tamu" aktif={urut} arah={arah} onSort={sort} />
              <ThSort id="unit" label="Unit" aktif={urut} arah={arah} onSort={sort} />
              <ThSort id="masuk" label="Menginap" aktif={urut} arah={arah} onSort={sort} />
              <th scope="col" className="app-col-opt">
                <span className="app-th-plain">Kanal</span>
              </th>
              <ThSort id="status" label="Status" aktif={urut} arah={arah} onSort={sort} />
              <ThSort id="total" label="Tagihan" aktif={urut} arah={arah} onSort={sort} />
              <th scope="col">
                <span className="app-th-plain">Rincian</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {baris.map((r) => {
              const on = terpilih.includes(r.kode);
              const sisa = sisaTagihan(r);
              return (
                <tr key={r.kode} className={on ? 'is-picked' : ''}>
                  <td>
                    <Centang checked={on} onChange={(v) => toggle(r.kode, v)} label={`Pilih ${r.kode}`} />
                  </td>
                  <td className="app-td-kode">{r.kode}</td>
                  <td>
                    {/* R50: name and origin are separate BLOCK children with a gap, never two
                        inline nodes that render as `Sinta RahmawatiBandung`. */}
                    <span className="app-cell">
                      <b>{r.tamu}</b>
                      <span>{r.kota}</span>
                    </span>
                  </td>
                  <td>
                    <span className="app-cell">
                      <b>{r.unitNama}</b>
                      <span>
                        {r.sku}, {r.kapasitas} pax
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="app-cell">
                      <b className="app-nowrap">
                        {pendek(r.masuk)} sampai {pendek(r.keluar)}
                      </b>
                      <span>
                        {r.malam} malam, {r.pax} tamu
                      </span>
                    </span>
                  </td>
                  <td className="app-col-opt">{r.kanal}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>
                    <span className="app-cell">
                      <b className="app-nowrap tnum">{rupiah(r.total)}</b>
                      <span>{sisa > 0 ? `sisa ${rupiah(sisa)}` : 'lunas'}</span>
                    </span>
                  </td>
                  <td>
                    <button type="button" className="app-mini" onClick={() => onPilih(r)}>
                      Lihat
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
