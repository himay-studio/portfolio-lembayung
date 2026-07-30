'use client';

/**
 * Card view. The browse oriented mode: fewer fields, more room to read one reservation at a
 * glance, and the right shape when you are looking for something rather than scanning a ledger.
 *
 * R48 applies HERE and not to the record lists elsewhere in the panel: this genuinely is a
 * section of peer cards, so below 769px it is the site's one `.snap-row` carousel rather than a
 * forty card vertical stack on a phone.
 *
 * The card is an `<article>` carrying its own button, not one giant `<button>` wrapping
 * everything. A button's content model is phrasing content, so a `<dl>` inside one is invalid
 * markup, and a screen reader reading the whole card as a single button label is worse than a
 * short explicit action.
 */

import { rupiah, VIEW_LABEL } from '@/data/types';
import { pendek } from '@/lib/tanggal';
import { StatusBadge } from './bits';
import { sisaTagihan, type Reservasi } from './data';

export default function ReservasiKartu({
  list,
  onPilih,
}: {
  list: Reservasi[];
  onPilih: (r: Reservasi) => void;
}) {
  return (
    <div className="snap-row cols-3">
      {list.map((r) => (
        <article key={r.kode} className="app-card">
          <span className="app-card-head">
            {/* R50: the guest name and the booking code are separate blocks with a gap. */}
            <span className="app-card-judul">
              <span className="app-card-nama">{r.tamu}</span>
              <span className="app-card-kode">{r.kode}</span>
            </span>
            <StatusBadge status={r.status} />
          </span>

          <dl className="app-dl">
            <dt>Unit</dt>
            <dd>{r.unitNama}</dd>
            <dt>Varian</dt>
            <dd>
              {r.kapasitas} pax, {VIEW_LABEL[r.view]}
            </dd>
            <dt>Menginap</dt>
            <dd>
              {pendek(r.masuk)} sampai {pendek(r.keluar)}
            </dd>
            <dt>Malam</dt>
            <dd>
              {r.malam} malam, {r.pax} tamu
            </dd>
            <dt>Tagihan</dt>
            <dd className="tnum">{rupiah(r.total)}</dd>
          </dl>

          <span className="app-kecil">
            {sisaTagihan(r) > 0 ? `Sisa pembayaran ${rupiah(sisaTagihan(r))}` : 'Sudah lunas'}, masuk lewat{' '}
            {r.kanal.toLowerCase()}.
          </span>

          <button type="button" className="app-mini" onClick={() => onPilih(r)}>
            Lihat rincian {r.kode}
          </button>
        </article>
      ))}
    </div>
  );
}
