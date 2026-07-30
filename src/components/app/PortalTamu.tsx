'use client';

/**
 * Guest portal. The other half of R8: what the GUEST sees, as opposed to what the receptionist
 * sees in the panel.
 *
 * Deliberately much simpler than the panel. A guest has two questions, when am I arriving and
 * what did I already pay, so the screen answers those and stops. Two tabs, upcoming and
 * history, a status timeline per booking, and a lookup box for a code that belongs to somebody
 * else's account.
 *
 * The lookup result is inserted AFTER mount and carries `.reveal`, which makes it a live
 * exercise of R24: without the MutationObserver in ClientEffects it would land at opacity 0,
 * never be observed, never receive `.in`, and read as a blank page even though the markup is
 * correct. That is the HIM-169 defect, and this is the shape that reproduces it.
 *
 * R14: the one contact CTA here converts a visitor, so it routes to Himay Studio WhatsApp
 * through `waLink()`. The navigation and the demo controls stay functional.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { rupiah, VIEW_LABEL } from '@/data/types';
import { site } from '@/data/site';
import { waLink } from '@/data/links';
import { nights, panjang, parse, pendek } from '@/lib/tanggal';
import { KosongState, Overlay, StatusBadge, initial, useViewPref } from './bits';
import { buildPanel, sisaTagihan, STATUS_LABEL, tamuPortal, type Reservasi } from './data';

type Tab = 'akan' | 'riwayat';
const TABS: readonly Tab[] = ['akan', 'riwayat'];

function selisihHari(dari: string, ke: string): number {
  const a = parse(dari);
  const b = parse(ke);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export default function PortalTamu({ hariIni }: { hariIni: string }) {
  const data = useMemo(() => buildPanel(hariIni), [hariIni]);
  const tamu = useMemo(() => tamuPortal(data), [data]);

  const [tab, setTab] = useViewPref<Tab>('portal', 'akan', TABS);
  const [kode, setKode] = useState('');
  const [cari, setCari] = useState<{ q: string; hit: Reservasi | null } | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  const milikSaya = useMemo(
    () => data.reservasi.filter((r) => r.tamu === tamu.nama),
    [data.reservasi, tamu.nama],
  );
  const akan = milikSaya.filter((r) => r.keluar >= hariIni && r.status !== 'batal');
  const riwayat = milikSaya.filter((r) => r.keluar < hariIni || r.status === 'batal');
  const berikut = akan[0];

  const list = tab === 'akan' ? akan : riwayat;
  const terpilih = detail ? (data.reservasi.find((r) => r.kode === detail) ?? null) : null;

  const cariKode = (e: React.FormEvent) => {
    e.preventDefault();
    const q = kode.trim().toUpperCase();
    if (!q) {
      setCari(null);
      return;
    }
    setCari({ q, hit: data.reservasi.find((r) => r.kode.toUpperCase() === q) ?? null });
  };

  return (
    <>
      <header className="app-portal-hero on-dark">
        <div className="app-baris" style={{ marginBottom: '0.75rem' }}>
          <span className="app-avatar" aria-hidden="true">
            {initial(tamu.nama)}
          </span>
          <span className="app-rec-teks">
            {/* R50: greeting and origin are separate blocks with a gap. */}
            <span className="app-rec-judul">Halo, {tamu.nama}</span>
            <span className="app-rec-ket" style={{ color: 'var(--kabut)' }}>
              {tamu.kota}, {tamu.menginap} kali menginap di Lembayung
            </span>
          </span>
        </div>

        <h1 className="app-judul">Portal Tamu</h1>
        <span className="app-sub">
          {berikut
            ? `Menginap berikutnya ${panjang(berikut.masuk)}, ${selisihHari(hariIni, berikut.masuk) <= 0 ? 'sedang berlangsung' : `${selisihHari(hariIni, berikut.masuk)} hari lagi`}, di ${berikut.unitNama}.`
            : 'Belum ada rencana menginap berikutnya. Riwayat menginap Anda tetap tersimpan di bawah.'}
        </span>

        <div className="app-baris" style={{ marginTop: '1rem' }}>
          <Link href="/unit/" className="btn btn-outline-inv btn-sm">
            Lihat tipe unit
          </Link>
          <a
            className="btn btn-cta btn-sm"
            href={waLink('perubahan jadwal menginap di Lembayung')}
            target="_blank"
            rel="noopener"
          >
            Hubungi resepsionis
          </a>
        </div>
      </header>

      <div className="app-viewbar">
        <div className="app-tab-row" role="group" aria-label="Menginap saya">
          <button
            type="button"
            className="app-view-btn"
            aria-pressed={tab === 'akan'}
            onClick={() => setTab('akan')}
          >
            Akan datang ({akan.length})
          </button>
          <button
            type="button"
            className="app-view-btn"
            aria-pressed={tab === 'riwayat'}
            onClick={() => setTab('riwayat')}
          >
            Riwayat ({riwayat.length})
          </button>
        </div>
        <span className="app-hitung" role="status">
          {list.length} menginap ditampilkan
        </span>
      </div>

      {list.length === 0 ? (
        <KosongState
          judul={tab === 'akan' ? 'Belum ada menginap berikutnya' : 'Belum ada riwayat menginap'}
          ket={
            tab === 'akan'
              ? 'Anda belum punya reservasi yang akan datang. Pilih tanggal di halaman unit, lalu reservasinya akan muncul di sini.'
              : 'Riwayat akan terisi setelah menginap pertama Anda selesai.'
          }
          aksi={
            <Link href="/unit/" className="btn btn-violet btn-sm">
              Lihat tipe unit
            </Link>
          }
        />
      ) : (
        <ul className="app-list">
          {list.map((r) => (
            <li key={r.kode}>
              <button type="button" className="app-rec" onClick={() => setDetail(r.kode)}>
                <span className="app-rec-teks">
                  <span className="app-rec-judul">{r.unitNama}</span>
                  <span className="app-rec-ket">
                    {panjang(r.masuk)} sampai {panjang(r.keluar)}, {r.malam} malam, {r.pax} tamu
                  </span>
                  <span className="app-rec-ket">
                    {r.kode}, {rupiah(r.total)},{' '}
                    {sisaTagihan(r) > 0 ? `sisa ${rupiah(sisaTagihan(r))}` : 'lunas'}
                  </span>
                </span>
                <StatusBadge status={r.status} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <section className="app-side-box" style={{ marginTop: '1.5rem' }}>
        <span className="app-side-judul">Punya kode booking lain</span>
        <span className="app-side-ket">
          Masukkan kode yang tertulis di surel konfirmasi, misalnya {data.reservasi[0]?.kode}. Kode
          dicocokkan langsung tanpa perlu masuk.
        </span>
        <form className="app-baris" onSubmit={cariKode} style={{ alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: '1 1 220px' }}>
            <label className="field-label" htmlFor="portal-kode">
              Kode booking
            </label>
            <input
              id="portal-kode"
              className="input"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="LMB-1000"
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn btn-violet btn-sm">
            Cari
          </button>
        </form>

        {cari &&
          (cari.hit ? (
            /* inserted AFTER mount, see the R24 note at the top of this file */
            <div className="reveal" style={{ marginTop: '1rem' }}>
              <button type="button" className="app-rec" onClick={() => setDetail(cari.hit!.kode)}>
                <span className="app-rec-teks">
                  <span className="app-rec-judul">
                    {cari.hit.kode}, {cari.hit.unitNama}
                  </span>
                  <span className="app-rec-ket">
                    {cari.hit.tamu}, {pendek(cari.hit.masuk)} sampai {pendek(cari.hit.keluar)},{' '}
                    {STATUS_LABEL[cari.hit.status].toLowerCase()}
                  </span>
                </span>
                <StatusBadge status={cari.hit.status} />
              </button>
            </div>
          ) : (
            <p className="app-kecil reveal" style={{ marginTop: '1rem' }}>
              Kode {cari.q} tidak ditemukan. Periksa lagi surel konfirmasi Anda, atau hubungi
              resepsionis pada jam {site.contact.receptionHours}.
            </p>
          ))}
      </section>

      <Overlay
        open={Boolean(terpilih)}
        onClose={() => setDetail(null)}
        label="Rincian menginap"
        panelClass="app-rec-panel"
      >
        {terpilih ? <Rincian r={terpilih} hariIni={hariIni} onTutup={() => setDetail(null)} /> : null}
      </Overlay>
    </>
  );
}

function Rincian({ r, hariIni, onTutup }: { r: Reservasi; hariIni: string; onTutup: () => void }) {
  const sisa = sisaTagihan(r);
  const langkah = [
    { judul: 'Reservasi dibuat', ket: panjang(r.dibuat), done: true },
    {
      judul: `Deposit ${site.operations.payment.depositPercent} persen`,
      ket: r.dibayar > 0 ? `${rupiah(r.dibayar)} sudah masuk` : 'Belum diterima',
      done: r.dibayar > 0,
    },
    {
      judul: 'Check in',
      ket: `${panjang(r.masuk)}, mulai ${site.operations.checkIn}`,
      done: r.masuk <= hariIni && r.status !== 'batal',
    },
    {
      judul: 'Check out',
      ket: `${panjang(r.keluar)}, batas ${site.operations.checkOut}`,
      done: r.keluar <= hariIni && r.status !== 'batal',
    },
  ];

  return (
    <>
      <div className="app-rec-head">
        <span className="app-rec-teks">
          <span className="app-rec-judul">{r.unitNama}</span>
          <span className="app-rec-ket" style={{ color: 'var(--kabut)' }}>
            {r.kode}, {nights(r.masuk, r.keluar)} malam
          </span>
        </span>
        <button type="button" className="app-tutup" onClick={onTutup} aria-label="Tutup rincian menginap">
          &#10005;
        </button>
      </div>

      <div className="app-rec-body">
        <div className="app-baris" style={{ marginBottom: '1rem' }}>
          <StatusBadge status={r.status} />
          <span className="app-chip">
            {r.kapasitas} pax, {VIEW_LABEL[r.view]}
          </span>
          <span className="app-chip">{r.pax} tamu terdaftar</span>
        </div>

        <div className="app-rec-blok">
          <h3>Perjalanan reservasi</h3>
          <ul className="app-langkah">
            {langkah.map((l) => (
              <li key={l.judul} className={l.done ? 'is-done' : ''}>
                <span className="app-langkah-tanda" aria-hidden="true" />
                {/* R50: step title and its detail are separate blocks with a gap. */}
                <span className="app-langkah-teks">
                  <b>{l.judul}</b>
                  <span>{l.ket}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="app-rec-blok">
          <h3>Tagihan</h3>
          <dl>
            <div className="app-rec-baris">
              <dt>Total</dt>
              <dd className="tnum">{rupiah(r.total)}</dd>
            </div>
            <div className="app-rec-baris">
              <dt>Sudah dibayar</dt>
              <dd className="tnum">{rupiah(r.dibayar)}</dd>
            </div>
            <div className="app-rec-baris">
              <dt>Sisa</dt>
              <dd className="tnum">{sisa > 0 ? rupiah(sisa) : 'lunas'}</dd>
            </div>
            <div className="app-rec-baris">
              <dt>Cara bayar</dt>
              <dd>{site.operations.payment.methods.join(', ')}</dd>
            </div>
          </dl>
          <p className="app-kecil" style={{ marginTop: '0.6rem' }}>
            {site.operations.payment.note}
          </p>
        </div>

        <div className="app-rec-blok">
          <h3>Kalau perlu berubah</h3>
          <dl>
            {site.operations.cancellation.map((c) => (
              <div className="app-rec-baris" key={c.window}>
                <dt>{c.window}</dt>
                <dd>{c.refund}</dd>
              </div>
            ))}
          </dl>
          <a
            className="btn btn-cta btn-sm"
            style={{ marginTop: '1rem' }}
            href={waLink(`perubahan reservasi ${r.kode} di Lembayung`)}
            target="_blank"
            rel="noopener"
          >
            Hubungi resepsionis
          </a>
        </div>
      </div>
    </>
  );
}
