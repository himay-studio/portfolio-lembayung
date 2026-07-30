'use client';

/* The unit index filter.
 *
 * R42, the second half of the trap. A capacity or view filter narrows WHICH units are shown. It
 * must NEVER change the NAME on a card, because in a correct data model capacity and view are not
 * part of a name at all. This component therefore filters the `units` array and hands whole `Unit`
 * objects to `UnitCard`; it has no access to a name string and could not rewrite one if it tried.
 *
 * R12: both filters are the custom animated Select, no native <select>.
 * R24: the result grid is re rendered on filter change, which inserts fresh `.reveal` nodes AFTER
 *      mount. They only ever become visible because ClientEffects pairs a MutationObserver with
 *      the IntersectionObserver. Without it, filtering would blank the page.
 * R48: more than three cards, so the container is a `.snap-row` snap carousel at 768px and below.
 */

import { useMemo, useState } from 'react';
import Select from '@/components/Select';
import { UnitCard } from '@/components/Cards';
import { VIEW_LABEL } from '@/data/types';
import { units } from '@/data/units';

export default function UnitFilter() {
  const [cap, setCap] = useState('');
  const [view, setView] = useState('');
  const [bath, setBath] = useState('');

  const capOptions = useMemo(() => {
    const all = [...new Set(units.flatMap((u) => u.variants.map((v) => v.capacity)))].sort((a, b) => a - b);
    return [
      { value: '', label: 'Semua kapasitas' },
      ...all.map((c) => ({ value: String(c), label: `${c} pax atau lebih` })),
    ];
  }, []);

  const viewOptions = useMemo(() => {
    const all = [...new Set(units.flatMap((u) => u.variants.map((v) => v.view)))];
    return [
      { value: '', label: 'Semua arah pandang' },
      ...all.map((v) => ({ value: v, label: VIEW_LABEL[v] })),
    ];
  }, []);

  const shown = units.filter((u) => {
    if (cap && !u.variants.some((v) => v.capacity >= Number(cap))) return false;
    if (view && !u.variants.some((v) => v.view === view)) return false;
    if (bath && u.bathroom !== bath) return false;
    return true;
  });

  return (
    <>
      <div className="filter-bar">
        <Select label="Kapasitas" name="kapasitas" options={capOptions} value={cap} onChange={setCap} />
        <Select label="Arah pandang" name="pandang" options={viewOptions} value={view} onChange={setView} />
        <Select
          label="Kamar mandi"
          name="kamarmandi"
          options={[
            { value: '', label: 'Semua' },
            { value: 'dalam', label: 'Di dalam unit', ket: 'Air panas 24 jam' },
            { value: 'luar', label: 'Bersama, di luar', ket: 'Sekitar 30 meter berjalan kaki' },
          ]}
          value={bath}
          onChange={setBath}
        />
        <span className="filter-count" aria-live="polite">
          {shown.length} dari {units.length} tipe unit
        </span>
      </div>

      {shown.length === 0 ? (
        <div className="note reveal">
          <p style={{ marginBottom: 0 }}>
            Tidak ada tipe unit yang cocok dengan kombinasi itu. Coba lepas salah satu filter, atau
            tanya langsung lewat WhatsApp dan kami carikan.
          </p>
        </div>
      ) : (
        /* R48: 4+ peer cards, so a snap carousel at 768px and below, a grid above */
        <div className="snap-row cols-3">
          {shown.map((u) => (
            <UnitCard key={u.slug} unit={u} />
          ))}
        </div>
      )}
    </>
  );
}
