'use client';

/**
 * The centrepiece view: arrivals and departures against unit inventory, month by month.
 *
 * This is why the panel was routed to Webapp Architect rather than built as a decorative stub.
 * For an accommodation business the calendar is the operational document: the first question is
 * never "list my bookings", it is "how many of my 28 units are occupied on the night of the
 * fourteenth, who arrives, and who leaves".
 *
 * It is a real `<table>`. A month grid IS tabular data, the weekday row IS a set of column
 * headers, and a screen reader reading `Sabtu, 15 Agustus` in a grid cell gets that for free.
 * It also keeps the R48 sweep honest without asking anyone for an exemption, because thead,
 * tbody and tr are shapes that sweep already understands.
 */

import { useMemo, useState } from 'react';
import { rupiah } from '@/data/types';
import { BULAN, HARI, iso, leadingBlanks, panjang, parse, pendek } from '@/lib/tanggal';
import { site } from '@/data/site';
import { keluarPada, masukPada, menginapPada, type Reservasi } from './data';
import { StatusBadge } from './bits';

export default function ReservasiKalender({
  list,
  hariIni,
  kapasitas,
  onPilih,
}: {
  list: Reservasi[];
  hariIni: string;
  /** Units available across whatever the unit filter currently allows. The denominator. */
  kapasitas: number;
  onPilih: (r: Reservasi) => void;
}) {
  const awal = parse(hariIni) ?? new Date();
  const [view, setView] = useState({ y: awal.getFullYear(), m: awal.getMonth() });
  const [hari, setHari] = useState(hariIni);

  const hariDalamBulan = new Date(view.y, view.m + 1, 0).getDate();
  const kosongAwal = leadingBlanks(view.y, view.m);

  const sel = useMemo(() => {
    const out: (string | null)[] = [];
    for (let i = 0; i < kosongAwal; i++) out.push(null);
    for (let d = 1; d <= hariDalamBulan; d++) {
      out.push(iso(new Date(view.y, view.m, d)));
    }
    while (out.length % 7 !== 0) out.push(null);
    const minggu: (string | null)[][] = [];
    for (let i = 0; i < out.length; i += 7) minggu.push(out.slice(i, i + 7));
    return minggu;
  }, [view.y, view.m, hariDalamBulan, kosongAwal]);

  const akhirPekan: readonly number[] = site.operations.weekendDays;

  const pindahBulan = (delta: number) => {
    const next = new Date(view.y, view.m + delta, 1);
    setView({ y: next.getFullYear(), m: next.getMonth() });
  };

  const terpilihMasuk = masukPada(list, hari);
  const terpilihKeluar = keluarPada(list, hari);
  const terpilihMenginap = menginapPada(list, hari);
  const isiHariIni = terpilihMenginap.length;

  const totalBulan = list.filter((r) => {
    const d = parse(r.masuk);
    return d && d.getFullYear() === view.y && d.getMonth() === view.m;
  }).length;

  /* The demo book has edges, and the calendar can be navigated past them. Saying where the data
     stops is more honest than letting somebody page into September and conclude the panel is
     broken because every cell is empty. */
  const rentang = useMemo(() => {
    if (list.length === 0) return { awal: hariIni, akhir: hariIni };
    return {
      awal: list.reduce((a, r) => (r.masuk < a ? r.masuk : a), list[0]!.masuk),
      akhir: list.reduce((a, r) => (r.keluar > a ? r.keluar : a), list[0]!.keluar),
    };
  }, [list, hariIni]);

  return (
    <div className="app-cal-layout">
      <div>
        <div className="app-baris" style={{ marginBottom: '0.75rem' }}>
          <button type="button" className="app-mini" onClick={() => pindahBulan(-1)}>
            &#8592; Bulan lalu
          </button>
          <b className="app-nowrap">
            {BULAN[view.m]} {view.y}
          </b>
          <button type="button" className="app-mini" onClick={() => pindahBulan(1)}>
            Bulan depan &#8594;
          </button>
          <button
            type="button"
            className="app-mini"
            onClick={() => {
              const t = parse(hariIni) ?? new Date();
              setView({ y: t.getFullYear(), m: t.getMonth() });
              setHari(hariIni);
            }}
          >
            Hari ini
          </button>
        </div>

        <div className="app-cal-wrap">
          <table className="app-cal">
            <caption>
              {totalBulan} reservasi mulai menginap pada {BULAN[view.m]} {view.y}. Batang hijau
              adalah unit terisi malam itu, batang merah bata berarti penuh. Klik satu tanggal
              untuk melihat siapa masuk dan siapa keluar. Data demo mencakup {panjang(rentang.awal)}{' '}
              sampai {panjang(rentang.akhir)}, di luar rentang itu kalendernya memang kosong.
            </caption>
            <thead>
              <tr>
                {HARI.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sel.map((minggu, wi) => (
                <tr key={wi}>
                  {minggu.map((tgl, di) => {
                    if (!tgl) return <td key={di} className="app-cal-kosong" />;
                    const d = parse(tgl)!;
                    const isi = menginapPada(list, tgl).length;
                    const masuk = masukPada(list, tgl).length;
                    const keluar = keluarPada(list, tgl).length;
                    const rasio = kapasitas > 0 ? Math.min(100, Math.round((isi / kapasitas) * 100)) : 0;
                    const penuh = kapasitas > 0 && isi >= kapasitas;
                    const kelas = [
                      'app-cal-day',
                      akhirPekan.includes(d.getDay()) ? 'is-weekend' : '',
                      tgl === hariIni ? 'is-today' : '',
                    ]
                      .filter(Boolean)
                      .join(' ');
                    return (
                      <td key={di}>
                        <button
                          type="button"
                          className={kelas}
                          aria-pressed={tgl === hari}
                          aria-label={`${panjang(tgl)}, ${isi} unit terisi, ${masuk} check in, ${keluar} check out`}
                          onClick={() => setHari(tgl)}
                        >
                          <span className="app-cal-nomor">{d.getDate()}</span>
                          <span className={`app-cal-bar ${penuh ? 'is-penuh' : ''}`} aria-hidden="true">
                            <span style={{ width: `${rasio}%` }} />
                          </span>
                          <span className="app-cal-angka">
                            {isi} dari {kapasitas} unit
                          </span>
                          <span className="app-cal-tanda">
                            {masuk > 0 && (
                              <span className="app-cal-masuk">
                                {masuk} <span className="app-cal-kata">masuk</span>
                              </span>
                            )}
                            {keluar > 0 && (
                              <span className="app-cal-keluar">
                                {keluar} <span className="app-cal-kata">keluar</span>
                              </span>
                            )}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside aria-label={`Rincian ${panjang(hari)}`}>
        <div className="app-side-box">
          <span className="app-side-judul">{panjang(hari)}</span>
          <span className="app-side-ket">
            {isiHariIni} dari {kapasitas} unit terisi malam ini, {terpilihMasuk.length} check in,{' '}
            {terpilihKeluar.length} check out.
          </span>

          <Blok judul="Check in" list={terpilihMasuk} kosong="Tidak ada tamu datang." onPilih={onPilih} />
          <Blok judul="Check out" list={terpilihKeluar} kosong="Tidak ada tamu pulang." onPilih={onPilih} />
          <Blok
            judul="Sedang menginap"
            list={terpilihMenginap}
            kosong="Semua unit kosong malam ini."
            onPilih={onPilih}
          />
        </div>
      </aside>
    </div>
  );
}

function Blok({
  judul,
  list,
  kosong,
  onPilih,
}: {
  judul: string;
  list: Reservasi[];
  kosong: string;
  onPilih: (r: Reservasi) => void;
}) {
  return (
    <div style={{ marginTop: '1rem' }}>
      <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.4rem' }}>
        {judul} ({list.length})
      </h3>
      {list.length === 0 ? (
        <p className="app-kecil" style={{ margin: 0 }}>
          {kosong}
        </p>
      ) : (
        <ul className="app-list">
          {list.map((r) => (
            <li key={r.kode}>
              <button type="button" className="app-rec" onClick={() => onPilih(r)}>
                <span className="app-rec-teks">
                  {/* R50: title and detail line are separate blocks with a gap. */}
                  <span className="app-rec-judul">{r.tamu}</span>
                  <span className="app-rec-ket">
                    {r.unitNama}, {r.sku}, {pendek(r.masuk)} sampai {pendek(r.keluar)}, {rupiah(r.total)}
                  </span>
                </span>
                <StatusBadge status={r.status} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
