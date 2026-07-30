'use client';

/* R12 custom animated dropdown. There is NO native <select> anywhere on this site, and no
 * unstyled default dropdown either.
 *
 * - opens and closes with a grid-template-rows 0fr to 1fr transition plus a rotating chevron
 * - keyboard: ArrowUp, ArrowDown, Home, End, Enter, Space, Escape
 * - role="listbox" on the panel, role="option" with aria-selected on each item
 * - a hidden input carries the form value so it submits like a real control
 * - R50: option title and helper line are separate BLOCK children with an explicit gap
 * - R57: while closed the panel has zero layout footprint on both axes, see site.css section 12,
 *   and useViewportClamp nudges the open panel back inside the window
 * - R60: aria-expanded is driven by the SAME `open` state the CSS open class reads
 */

import { useEffect, useId, useRef, useState } from 'react';
import { useViewportClamp } from '@/lib/clamp';

export type SelectOption = { value: string; label: string; ket?: string };

export default function Select({
  options,
  value,
  onChange,
  label,
  name,
  hint,
  placeholder = 'Pilih salah satu',
}: {
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
  label: string;
  name?: string;
  hint?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const listId = `${uid}-list`;
  const labelId = `${uid}-label`;

  useViewportClamp(panelRef, open);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function pick(i: number) {
    const opt = options[i];
    if (!opt) return;
    onChange(opt.value);
    setActive(i);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => (i + dir + options.length) % options.length);
      return;
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
      return;
    }
    if (e.key === 'End') {
      e.preventDefault();
      setActive(options.length - 1);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) setOpen(true);
      else pick(active);
    }
  }

  return (
    <div className="field">
      <span className="field-label" id={labelId}>
        {label}
      </span>
      <div className={`select ${open ? 'is-open' : ''}`} ref={rootRef}>
        <button
          type="button"
          className="select-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={labelId}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onKeyDown}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <span className="select-caret" aria-hidden="true" />
        </button>

        <div className="select-panel" id={listId} role="listbox" aria-labelledby={labelId} ref={panelRef}>
          <div className="select-panel-inner">
            {options.map((o, i) => (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={o.value === value}
                className={`select-option ${i === active ? 'is-active' : ''}`}
                onClick={() => pick(i)}
                onMouseEnter={() => setActive(i)}
              >
                <span className="select-option-title">{o.label}</span>
                {o.ket && <span className="select-option-label">{o.ket}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
      {hint && <span className="field-hint">{hint}</span>}
      {name && <input type="hidden" name={name} value={value} readOnly />}
    </div>
  );
}
