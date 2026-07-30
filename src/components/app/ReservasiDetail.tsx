'use client';

/**
 * The record panel body. Rendered inside the portalled `Overlay`, so R53 and R57 are already
 * handled by that primitive and this file is only concerned with what a receptionist needs to
 * see when they open one booking.
 *
 * The payment block and the cancellation table read their numbers from `site.operations`, the
 * same object the FAQ and the policy pages quote, so the panel can never state a deposit
 * percentage or a refund window that contradicts the marketing site.
 */

import { rupiah, VIEW_LABEL } from '@/data/types';
import { panjang } from '@/lib/tanggal';
import { site } from '@/data/site';
import { STATUS, STATUS_LABEL, sisaTagihan, type Reservasi, type Status } from './data';
import { StatusBadge } from './bits';

export default function ReservasiDetail({
  r,
  onTutup,
  onUbahStatus,
}: {
  r: Reservasi;
  onTutup: () => void;
  onUbahStatus: (kode: string[], status: Status) => void;
}) {
  const sisa = sisaTagihan(r);
  const persen = r.total > 0 ? Math.round((r.dibayar / r.total) * 100) : 0;

  return (
    <>
      <div className="app-rec-head">
        <span className="app-rec-teks">
          {/* R50: the code and the guest name are separate blocks with a gap. */}
          <span className="app-rec-judul">{r.kode}</span>
          <span className="app-rec-ket" style={{ color: 'var(--kabut)' }}>
            {r.tamu}, {r.kota}
          </span>
        </span>
        <button type="button" className="app-tutup" onClick={onTutup} aria-label="Tutup rincian reservasi">
          &#10005;
        </button>
      </div>

      <div className="app-rec-body">
        <div className="app-baris" style={{ marginBottom: '1rem' }}>
          <StatusBadge status={r.status} />
          <span className="app-chip">{r.malam} malam</span>
          <span className="app-chip">{r.pax} tamu</span>
          <span className="app-chip">Lewat {r.kanal.toLowerCase()}</span>
        </div>

        <dl>
          <div className="app-rec-baris">
            <dt>Unit</dt>
            <dd>{r.unitNama}</dd>
          </div>
          <div className="app-rec-baris">
            <dt>Varian</dt>
            <dd>
              {r.sku}, {r.kapasitas} pax, {VIEW_LABEL[r.view]}
            </dd>
          </div>
          <div className="app-rec-baris">
            <dt>Check in</dt>
            <dd>
              {panjang(r.masuk)}, {site.operations.checkIn}
            </dd>
          </div>
          <div className="app-rec-baris">
            <dt>Check out</dt>
            <dd>
              {panjang(r.keluar)}, {site.operations.checkOut}
            </dd>
          </div>
          <div className="app-rec-baris">
            <dt>Malam akhir pekan</dt>
            <dd>
              {r.malamAkhirPekan} dari {r.malam}
            </dd>
          </div>
          <div className="app-rec-baris">
            <dt>Kontak</dt>
            <dd>{r.telepon}</dd>
          </div>
          <div className="app-rec-baris">
            <dt>Surel</dt>
            <dd>{r.email}</dd>
          </div>
          <div className="app-rec-baris">
            <dt>Dipesan</dt>
            <dd>{panjang(r.dibuat)}</dd>
          </div>
        </dl>

        <div className="app-rec-blok">
          <h3>Pembayaran</h3>
          <span className="app-bayar" aria-hidden="true">
            <span style={{ width: `${persen}%` }} />
          </span>
          <p className="app-kecil" style={{ marginTop: '0.5rem' }}>
            {rupiah(r.dibayar)} dari {rupiah(r.total)} sudah masuk, {persen} persen.{' '}
            {sisa > 0
              ? `Sisa ${rupiah(sisa)} dilunasi saat tiba.`
              : 'Tidak ada sisa tagihan pada reservasi ini.'}{' '}
            Deposit di muka {site.operations.payment.depositPercent} persen, sisanya di properti.
          </p>
        </div>

        {r.catatan ? (
          <div className="app-rec-blok">
            <h3>Catatan tamu</h3>
            <p className="app-kecil">{r.catatan}</p>
          </div>
        ) : null}

        <div className="app-rec-blok">
          <h3>Ubah status</h3>
          <div className="app-baris">
            {STATUS.map((s) => (
              <button
                key={s}
                type="button"
                className="app-mini"
                aria-pressed={r.status === s}
                disabled={r.status === s}
                onClick={() => onUbahStatus([r.kode], s)}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
          <p className="app-kecil" style={{ marginTop: '0.6rem' }}>
            Panel demo. Perubahan status tersimpan selama tab peramban ini terbuka dan langsung
            terlihat di kalender, tabel, kartu dan papan.
          </p>
        </div>

        <div className="app-rec-blok">
          <h3>Ketentuan pembatalan</h3>
          <dl>
            {site.operations.cancellation.map((c) => (
              <div className="app-rec-baris" key={c.window}>
                <dt>{c.window}</dt>
                <dd>{c.refund}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
