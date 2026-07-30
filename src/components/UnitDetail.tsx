'use client';

/* Unit detail interaction: the R18 gallery and the R42 variant picker, wired together.
 *
 * R42, and this is the trap flagged on this build. Capacity and view are VARIANT dimensions on a
 * unit type, never separate units and never part of the name. So:
 *   - the heading above this component is the unit NAME and this component never changes it
 *   - picking a capacity or a view swaps the SKU, the price and the main IMAGE **in place**
 *   - nothing here navigates to another slug, there is not one Link between variants
 * The two symptoms that prove the model is wrong are a filter that changes the name on a card, and
 * a picker that navigates between slugs. Neither is possible in this shape.
 *
 * R18: the gallery thumbnails are real buttons, the active one carries a visible ring, and the
 * main image crossfades. The variant picker drives the same `active` index, which is why the two
 * live in one component rather than two.
 */

import { useMemo, useState } from 'react';
import UnitGallery from '@/components/UnitGallery';
import { mediaTag } from '@/data/media';
import { site } from '@/data/site';
import { waLink } from '@/data/links';
import { VIEW_LABEL, rupiah, type Unit } from '@/data/types';

export default function UnitDetail({ unit }: { unit: Unit }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(unit.variants[0]?.imageIndex ?? 0);

  const prompts = useMemo(() => unit.gallery.map((g) => mediaTag(g.path)), [unit]);
  const variant = unit.variants[variantIndex];

  const capacities = [...new Set(unit.variants.map((v) => v.capacity))].sort((a, b) => a - b);
  const views = [...new Set(unit.variants.map((v) => v.view))];

  /* choosing a dimension keeps the other one if that combination exists, otherwise it falls back
     to the first variant offering the chosen dimension. It never navigates. */
  function pick(next: number) {
    const v = unit.variants[next];
    if (!v) return;
    setVariantIndex(next);
    setImageIndex(v.imageIndex);
  }

  function pickCapacity(cap: number) {
    const keepView = variant?.view;
    const exact = unit.variants.findIndex((v) => v.capacity === cap && v.view === keepView);
    pick(exact >= 0 ? exact : unit.variants.findIndex((v) => v.capacity === cap));
  }

  function pickView(view: string) {
    const keepCap = variant?.capacity;
    const exact = unit.variants.findIndex((v) => v.view === view && v.capacity === keepCap);
    pick(exact >= 0 ? exact : unit.variants.findIndex((v) => v.view === view));
  }

  const available = (cap: number, view: string) =>
    unit.variants.some((v) => v.capacity === cap && v.view === view);

  return (
    <div className="split" style={{ gap: '3rem' }}>
      <div>
        <UnitGallery
          images={unit.gallery}
          prompts={prompts}
          active={imageIndex}
          onSelect={setImageIndex}
          unitName={unit.name}
        />
      </div>

      <div className="stack">
        <div className="varian">
          <span className="field-label">Kapasitas</span>
          <div className="varian-row" role="group" aria-label={`Pilih kapasitas ${unit.name}`}>
            {capacities.map((c) => {
              const on = variant?.capacity === c;
              return (
                <button
                  key={c}
                  type="button"
                  className="varian-btn"
                  aria-pressed={on}
                  onClick={() => pickCapacity(c)}
                >
                  <span className="varian-btn-utama">{c} pax</span>
                  <span className="varian-btn-label">
                    {variant && !available(c, variant.view) ? 'arah pandang lain' : 'tersedia'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="varian">
          <span className="field-label">Arah pandang</span>
          <div className="varian-row" role="group" aria-label={`Pilih arah pandang ${unit.name}`}>
            {views.map((v) => {
              const on = variant?.view === v;
              return (
                <button
                  key={v}
                  type="button"
                  className="varian-btn"
                  aria-pressed={on}
                  onClick={() => pickView(v)}
                >
                  <span className="varian-btn-utama">{VIEW_LABEL[v]}</span>
                  <span className="varian-btn-label">
                    {variant && !available(variant.capacity, v) ? 'kapasitas lain' : 'tersedia'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {variant && (
          <div className="varian-out">
            <dl>
              <dt>Kode varian</dt>
              <dd className="tnum">{variant.sku}</dd>
              <dt>Kapasitas</dt>
              <dd>{variant.capacity} pax</dd>
              <dt>Arah pandang</dt>
              <dd>{VIEW_LABEL[variant.view]}</dd>
              <dt>Sisa unit</dt>
              <dd>{variant.stock} unit</dd>
            </dl>
          </div>
        )}

        {variant && (
          <div>
            <span className="kecil muted" style={{ display: 'block' }}>
              Hari biasa, Minggu sampai Kamis, per malam
            </span>
            <span className="harga">{rupiah(variant.price)}</span>
            <span className="kecil" style={{ display: 'block', marginTop: '0.4rem' }}>
              Jumat, Sabtu dan libur nasional <strong className="tnum">{rupiah(variant.weekendPrice)}</strong>
            </span>
          </div>
        )}

        <div className="btn-row">
          {/* R14: a conversion CTA, so it carries this exact variant into the WhatsApp message */}
          <a
            className="btn btn-cta"
            href={waLink(
              variant
                ? `${unit.name}, varian ${variant.sku}, ${variant.capacity} pax, arah ${VIEW_LABEL[variant.view]}`
                : unit.name,
            )}
            target="_blank"
            rel="noopener"
          >
            Pesan Unit Ini
          </a>
          <a
            className="btn btn-outline"
            href={waLink(`pertanyaan tentang unit ${unit.name}`)}
            target="_blank"
            rel="noopener"
          >
            Tanya Dulu
          </a>
        </div>

        <div className="note">
          <p>
            <strong>Tidak cocok untuk:</strong> {unit.notFor}
          </p>
        </div>

        <p className="field-hint" style={{ marginBottom: 0 }}>
          Check in {site.operations.checkIn}, check out {site.operations.checkOut}. Uang muka{' '}
          {site.operations.payment.depositPercent} persen saat memesan.
        </p>
      </div>
    </div>
  );
}
