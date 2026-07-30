'use client';

/**
 * Kanban board. Columns are the reservation lifecycle, cards move between them, and a move is
 * committed the moment it lands, exactly as the app standard asks.
 *
 * Drag and drop is the pointer affordance, and it is NOT the only one. A board whose single
 * interaction is dragging is unusable with a keyboard and awkward on touch, so every card also
 * carries two move buttons that walk it one column left or right and are disabled at the ends.
 * The buttons are the accessible path, the drag is the fast path, and both call the same
 * handler.
 *
 * `Batal` is a real column rather than a hidden state. Dropping a card there is how a booking
 * is cancelled, and keeping it visible means the board never silently omits records.
 */

import { useState } from 'react';
import { rupiah } from '@/data/types';
import { pendek } from '@/lib/tanggal';
import { STATUS, STATUS_KET, STATUS_LABEL, type Reservasi, type Status } from './data';

export default function ReservasiPapan({
  list,
  onPilih,
  onUbahStatus,
}: {
  list: Reservasi[];
  onPilih: (r: Reservasi) => void;
  onUbahStatus: (kode: string[], status: Status) => void;
}) {
  const [seret, setSeret] = useState<string | null>(null);
  const [target, setTarget] = useState<Status | null>(null);

  const pindah = (r: Reservasi, delta: number) => {
    const i = STATUS.indexOf(r.status);
    const next = STATUS[i + delta];
    if (next) onUbahStatus([r.kode], next);
  };

  return (
    <div className="app-kanban">
      {STATUS.map((s) => {
        const kolom = list.filter((r) => r.status === s);
        return (
          <section
            key={s}
            className={`app-kan-col ${target === s ? 'is-target' : ''}`}
            aria-label={`${STATUS_LABEL[s]}, ${kolom.length} reservasi`}
            onDragOver={(e) => {
              e.preventDefault();
              setTarget(s);
            }}
            onDragLeave={() => setTarget((t) => (t === s ? null : t))}
            onDrop={(e) => {
              e.preventDefault();
              const kode = seret ?? e.dataTransfer.getData('text/plain');
              if (kode) onUbahStatus([kode], s);
              setSeret(null);
              setTarget(null);
            }}
          >
            <header className="app-kan-head">
              <span className="app-kan-nama">
                {STATUS_LABEL[s]}
                <span className="app-kan-jumlah">{kolom.length}</span>
              </span>
              {/* R50: the column title and its explanation are separate blocks with a gap. */}
              <span className="app-kan-ket">{STATUS_KET[s]}</span>
            </header>

            <ul className="app-list app-kan-body">
              {kolom.length === 0 && (
                <li className="app-kecil" style={{ padding: '0.5rem 0.2rem' }}>
                  Belum ada reservasi di kolom ini.
                </li>
              )}
              {kolom.map((r) => {
                const i = STATUS.indexOf(r.status);
                return (
                  <li key={r.kode}>
                    <article
                      className={`app-kan-card ${seret === r.kode ? 'is-drag' : ''}`}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', r.kode);
                        e.dataTransfer.effectAllowed = 'move';
                        setSeret(r.kode);
                      }}
                      onDragEnd={() => {
                        setSeret(null);
                        setTarget(null);
                      }}
                    >
                      <div className="app-kan-card-atas">
                        <span className="app-rec-teks">
                          <span className="app-rec-judul">{r.tamu}</span>
                          <span className="app-rec-ket">
                            {r.unitNama}, {pendek(r.masuk)} sampai {pendek(r.keluar)}
                          </span>
                          <span className="app-rec-ket">
                            {r.kode}, {rupiah(r.total)}
                          </span>
                        </span>
                      </div>

                      <div className="app-kan-pindah">
                        <button
                          type="button"
                          className="app-mini"
                          disabled={i <= 0}
                          onClick={() => pindah(r, -1)}
                          aria-label={`Pindahkan ${r.kode} ke kolom sebelumnya`}
                        >
                          &#8592;
                        </button>
                        <button
                          type="button"
                          className="app-mini"
                          disabled={i >= STATUS.length - 1}
                          onClick={() => pindah(r, 1)}
                          aria-label={`Pindahkan ${r.kode} ke kolom berikutnya`}
                        >
                          &#8594;
                        </button>
                        <button type="button" className="app-mini" onClick={() => onPilih(r)}>
                          Rincian
                        </button>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
