'use client';

/* R21 custom animated date picker, in the RANGE form this build actually needs.
 *
 * This is a booking site, so it lives or dies here. A free text input with a placeholder like
 * "contoh: 12 Agustus 2026" is a FAILED build, it produces unparseable data.
 *
 * - one panel collects check in AND check out. The first click sets check in, the second sets
 *   check out, and a click before the current check in restarts the range from there.
 * - animated open and close plus a rotating chevron, the same interaction bar as the R12 Select
 * - calendar grid semantics: role="grid", role="row", role="columnheader", role="gridcell",
 *   aria-selected on the range, aria-current="date" on today
 * - keyboard: ArrowLeft / ArrowRight move a day, ArrowUp / ArrowDown a week, PageUp / PageDown a
 *   month, Home / End jump to the ends of the week, Enter and Space commit, Escape closes
 * - past dates are disabled, and per R20(d) a disabled control is EXEMPT from the contrast sweep,
 *   which matters here because a month view of greyed past days would otherwise flood the report
 * - the booking window is capped at site.operations.bookingWindowDays so the calendar cannot run
 *   away into 2031
 * - two hidden inputs carry the ISO values for form submission
 * - R57: while closed this absolutely positioned panel has ZERO layout footprint on BOTH axes.
 *   Mabrur reported scrollWidth 385 against innerWidth 375 at 375px because a shut .dp-panel sat
 *   at left:0 with width 340px, an overflow that appeared in no screenshot because the panel was
 *   invisible in exactly the state that broke the page. See site.css section 12.
 */

import { useEffect, useId, useRef, useState } from 'react';
import { site } from '@/data/site';
import { BULAN, HARI, addDays, iso, leadingBlanks, midnightToday, panjang, parse } from '@/lib/tanggal';
import { useViewportClamp } from '@/lib/clamp';

export default function DateRangePicker({
  from,
  to,
  onChange,
  label = 'Tanggal menginap',
  hint,
}: {
  /** ISO yyyy-mm-dd, or "" */
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  label?: string;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  /* midnight today, computed once and stable across renders. Held in state rather than a ref
     because it IS read during render, to disable past days. */
  const [today] = useState(midnightToday);
  const last = addDays(today, site.operations.bookingWindowDays);
  const initial = parse(from) || today;
  const [view, setView] = useState({ y: initial.getFullYear(), m: initial.getMonth() });
  const [cursor, setCursor] = useState(iso(initial));
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const labelId = `${uid}-label`;

  useViewportClamp(panelRef, open);

  /* `site` is declared `as const`, so weekendDays narrows to the tuple `readonly [5, 6]` and
     `.includes(number)` will not typecheck against it. Widen it once here. */
  const weekendDays: readonly number[] = site.operations.weekendDays;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    gridRef.current?.querySelector<HTMLElement>('[data-cursor="true"]')?.focus();
  }, [open, cursor]);

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const blanks = leadingBlanks(view.y, view.m);

  function moveCursor(deltaDays: number) {
    const cur = parse(cursor) || today;
    const next = addDays(cur, deltaDays);
    if (next < today || next > last) return;
    setCursor(iso(next));
    setView({ y: next.getFullYear(), m: next.getMonth() });
  }

  function moveMonth(delta: number) {
    const cur = parse(cursor) || today;
    const next = new Date(cur.getFullYear(), cur.getMonth() + delta, 1);
    const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    next.setDate(Math.min(cur.getDate(), lastDay));
    if (next < today) return;
    if (next > last) return;
    setCursor(iso(next));
    setView({ y: next.getFullYear(), m: next.getMonth() });
  }

  /* the range state machine, kept deliberately small: pick a start, pick an end after it, and
     any click at or before the current start restarts the range. */
  function commit(v: string) {
    if (!from || (from && to)) {
      onChange(v, '');
      return;
    }
    if (v <= from) {
      onChange(v, '');
      return;
    }
    onChange(from, v);
    setOpen(false);
  }

  function onGridKey(e: React.KeyboardEvent) {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const step = map[e.key];
    if (step !== undefined) {
      e.preventDefault();
      moveCursor(step);
      return;
    }
    if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
      moveMonth(e.key === 'PageUp' ? -1 : 1);
      return;
    }
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const cur = parse(cursor) || today;
      const dow = (cur.getDay() + 6) % 7;
      moveCursor(e.key === 'Home' ? -dow : 6 - dow);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const cur = parse(cursor);
      if (cur && cur >= today && cur <= last) commit(cursor);
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  }

  const tampil =
    from && to
      ? `${panjang(from)} sampai ${panjang(to)}`
      : from
        ? `${panjang(from)}, pilih tanggal check out`
        : 'Pilih tanggal check in dan check out';

  const prevDisabled = view.y === today.getFullYear() && view.m === today.getMonth();
  const nextDisabled = view.y === last.getFullYear() && view.m === last.getMonth();

  return (
    <div className="field">
      <span className="field-label" id={labelId}>
        {label}
      </span>
      <div className={`datepick ${open ? 'is-open' : ''}`} ref={rootRef}>
        <button
          type="button"
          className="select-trigger"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={labelId}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
            if (e.key === 'Escape') setOpen(false);
          }}
        >
          <span>{tampil}</span>
          <span className="select-caret" aria-hidden="true" />
        </button>

        <div className="dp-panel" role="dialog" aria-label="Pilih tanggal menginap" ref={panelRef}>
          <div className="dp-panel-inner">
            <div className="dp-summary">
              {/* R50: two labelled values, each its own block, never two glued inline nodes */}
              <span>
                <b>Check in</b>
                <br />
                {from ? panjang(from) : 'belum dipilih'}
              </span>
              <span>
                <b>Check out</b>
                <br />
                {to ? panjang(to) : 'belum dipilih'}
              </span>
            </div>

            <div className="dp-head">
              <button
                type="button"
                className="dp-nav"
                onClick={() => moveMonth(-1)}
                disabled={prevDisabled}
                aria-label="Bulan sebelumnya"
              >
                &#8592;
              </button>
              <span className="dp-title" aria-live="polite">
                {BULAN[view.m]} {view.y}
              </span>
              <button
                type="button"
                className="dp-nav"
                onClick={() => moveMonth(1)}
                disabled={nextDisabled}
                aria-label="Bulan berikutnya"
              >
                &#8594;
              </button>
            </div>

            <div className="dp-grid" role="grid" aria-label="Kalender" ref={gridRef} onKeyDown={onGridKey}>
              {HARI.map((h) => (
                <span className="dp-dow" key={h} role="columnheader" aria-label={h}>
                  {h}
                </span>
              ))}
              {Array.from({ length: blanks }).map((_, i) => (
                <span className="dp-empty" key={`b${i}`} role="gridcell" aria-hidden="true" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = new Date(view.y, view.m, i + 1);
                const v = iso(d);
                const disabled = d < today || d > last;
                const isEdge = v === from || v === to;
                const inRange = Boolean(from && to && v > from && v < to);
                const isToday = v === iso(today);
                const isCursor = v === cursor;
                const isWeekend = weekendDays.includes(d.getDay());
                return (
                  <button
                    key={v}
                    type="button"
                    role="gridcell"
                    aria-selected={isEdge || inRange}
                    aria-current={isToday ? 'date' : undefined}
                    aria-label={`${panjang(v)}${isWeekend ? ', tarif akhir pekan' : ''}`}
                    data-cursor={isCursor}
                    tabIndex={isCursor ? 0 : -1}
                    disabled={disabled}
                    className={[
                      'dp-day',
                      isEdge ? 'is-edge' : '',
                      inRange ? 'in-range' : '',
                      isToday ? 'is-today' : '',
                      isWeekend ? 'is-weekend' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => commit(v)}
                    onFocus={() => setCursor(v)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <p className="dp-foot">
              Klik sekali untuk check in, klik lagi untuk check out. Tanggal merah adalah Jumat dan
              Sabtu, tarifnya lebih tinggi. Gunakan tombol panah untuk berpindah hari, PageUp dan
              PageDown untuk berpindah bulan, Escape untuk menutup.
            </p>
          </div>
        </div>
      </div>
      {hint && <span className="field-hint">{hint}</span>}
      <input type="hidden" name="checkin" value={from} readOnly />
      <input type="hidden" name="checkout" value={to} readOnly />
    </div>
  );
}
