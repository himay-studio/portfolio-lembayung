'use client';

/* The availability panel. This is the conversion engine of the marketing site.
 *
 * Scope note, and it matters: this panel COLLECTS a stay and hands it to WhatsApp per R14. The
 * real reservation system, the login and the guest portal are the R8 requirement and belong to
 * Webapp Architect at `/app`, Stage 4. This is not a stub of that panel and must not grow into
 * one.
 *
 * R21: the dates come from the custom range picker, never a free text input.
 * R12: the unit and pax fields are the custom Select, never a native <select>.
 * R14: "Cek Ketersediaan" is a conversion CTA, so it routes to Himay Studio WhatsApp with the
 *      chosen dates, unit and headcount already in the message body, built with
 *      encodeURIComponent by waLink.
 * R24: the estimate block below appears AFTER mount, on state change. It carries `.reveal`, and
 *      it only ever becomes visible because ClientEffects also runs a MutationObserver. A
 *      mount only reveal scan would leave this at opacity 0 forever and the panel would read as
 *      broken, which is the HIM-169 defect exactly.
 */

import { useMemo, useState } from 'react';
import DateRangePicker from '@/components/DateRangePicker';
import Select from '@/components/Select';
import { site } from '@/data/site';
import { waLink } from '@/data/links';
import { rupiah } from '@/data/types';
import { units } from '@/data/units';
import { nights, panjang, weekendNights } from '@/lib/tanggal';

const PAX = ['2', '4', '6', '8', '12', '20'];

export default function BookingPanel({
  /** pre select a unit when the panel sits on that unit's own page */
  unitSlug,
  /** `inline` lays the fields out in one desktop row, `panel` stacks them in a card */
  layout = 'panel',
  heading = 'Cek ketersediaan',
}: {
  unitSlug?: string;
  layout?: 'inline' | 'panel';
  heading?: string;
}) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [unit, setUnit] = useState(unitSlug ?? '');
  const [pax, setPax] = useState('2');

  const unitOptions = useMemo(
    () => [
      { value: '', label: 'Belum tahu, bantu pilih', ket: 'Kami sarankan sesuai jumlah orang dan tanggal' },
      ...units.map((u) => ({
        value: u.slug,
        /* R42: the option label is the unit NAME only. Capacity and view are the variant
           dimensions and live in the helper line, never in the name. */
        label: u.name,
        ket: `${u.structure.split(',')[0]}, kamar mandi ${u.bathroom}`,
      })),
    ],
    [],
  );

  const chosen = units.find((u) => u.slug === unit);
  const malam = nights(from, to);
  const akhirPekan = weekendNights(from, to, site.operations.weekendDays);
  const biasa = malam - akhirPekan;

  /* an indicative estimate from the cheapest variant that actually fits the headcount, so the
     number on screen is never lower than anything bookable */
  const estimate = useMemo(() => {
    if (!chosen || malam === 0) return null;
    const need = Number(pax);
    const fits = chosen.variants.filter((v) => v.capacity >= need);
    const pool = fits.length ? fits : chosen.variants;
    const cheapest = pool.reduce((a, b) => (a.price <= b.price ? a : b));
    return {
      sku: cheapest.sku,
      capacity: cheapest.capacity,
      total: biasa * cheapest.price + akhirPekan * cheapest.weekendPrice,
      fits: fits.length > 0,
    };
  }, [chosen, malam, biasa, akhirPekan, pax]);

  const context = [
    'ketersediaan menginap',
    chosen ? `unit ${chosen.name}` : 'unit belum ditentukan',
    from && to ? `${panjang(from)} sampai ${panjang(to)}` : 'tanggal belum ditentukan',
    `${pax} pax`,
  ].join(', ');

  return (
    <div className={`booking ${layout === 'inline' ? 'booking-inline' : ''}`}>
      {heading && (
        <div style={{ marginBottom: '1rem' }}>
          <span className="eyebrow">Reservasi</span>
          <h3 style={{ margin: '0.35rem 0 0' }}>{heading}</h3>
        </div>
      )}

      <div className="booking-grid">
        <div className="booking-span">
          <DateRangePicker
            from={from}
            to={to}
            onChange={(a, b) => {
              setFrom(a);
              setTo(b);
            }}
            hint={`Check in ${site.operations.checkIn}, check out ${site.operations.checkOut}. Kalender terbuka ${site.operations.bookingWindowDays} hari ke depan.`}
          />
        </div>

        <Select
          label="Tipe unit"
          name="unit"
          options={unitOptions}
          value={unit}
          onChange={setUnit}
          placeholder="Belum tahu, bantu pilih"
        />

        <Select
          label="Jumlah orang"
          name="pax"
          options={PAX.map((p) => ({ value: p, label: `${p} pax` }))}
          value={pax}
          onChange={setPax}
        />

        <a
          className="btn btn-cta"
          href={waLink(context)}
          target="_blank"
          rel="noopener"
          style={{ alignSelf: 'end' }}
        >
          Cek Ketersediaan
        </a>
      </div>

      {malam > 0 && (
        /* R24: inserted after mount, so it needs the MutationObserver to ever be revealed */
        <div className="booking-out reveal">
          <div>
            <span className="kecil muted" style={{ display: 'block' }}>
              {malam} malam
              {akhirPekan > 0 ? `, ${akhirPekan} di antaranya tarif akhir pekan` : ', semuanya tarif hari biasa'}
            </span>
            <span className="kecil" style={{ display: 'block' }}>
              {panjang(from)} sampai {panjang(to)}
            </span>
          </div>
          {estimate ? (
            <div style={{ textAlign: 'right' }}>
              <span className="harga">{rupiah(estimate.total)}</span>
              <span className="kecil muted" style={{ display: 'block' }}>
                Perkiraan, varian {estimate.sku}, {estimate.capacity} pax
              </span>
              {!estimate.fits && (
                <span className="kecil" style={{ display: 'block', color: 'var(--bahaya)' }}>
                  Tidak ada varian {pax} pax di tipe ini, kami sarankan tipe lain saat Anda tanya.
                </span>
              )}
            </div>
          ) : (
            <span className="kecil muted">Pilih tipe unit untuk melihat perkiraan harga.</span>
          )}
        </div>
      )}

      <p className="field-hint" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
        Perkiraan di atas belum termasuk kegiatan berbayar. Pembayaran uang muka{' '}
        {site.operations.payment.depositPercent} persen saat memesan, sisanya saat tiba.
      </p>
    </div>
  );
}
