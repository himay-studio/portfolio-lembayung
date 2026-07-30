'use client';

/* Small shared pieces for the reservation panel: icons, badges, the view switcher, the empty
 * and loading states, and the one overlay primitive every panel screen uses.
 *
 * The overlay is the piece worth reading. R53: it is PORTALLED to document.body, so no ancestor
 * that sets backdrop-filter, filter, transform, perspective or will-change can become the
 * containing block for its position:fixed box and clip it to a strip. The route wrapper on this
 * site DOES animate a transform (site.css .page-enter), which is exactly such an ancestor while
 * the animation runs, so this is not theoretical. R57: it UNMOUNTS when closed rather than
 * fading out, so its layout footprint while shut is zero on both axes and it can never inflate
 * document.documentElement.scrollWidth.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { STATUS_LABEL, type Status } from './data';

/* ------------------------------------------------------------------ icons */

export type IconName =
  | 'kalender'
  | 'tabel'
  | 'kartu'
  | 'papan'
  | 'unit'
  | 'tamu'
  | 'tiket'
  | 'kunci'
  | 'panah'
  | 'kosong';

const PATHS: Record<IconName, React.ReactNode> = {
  kalender: (
    <>
      <rect x="3" y="5" width="18" height="16" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  tabel: (
    <>
      <rect x="3" y="4" width="18" height="16" />
      <path d="M3 9h18M3 14h18M9 9v11" />
    </>
  ),
  kartu: (
    <>
      <rect x="3" y="4" width="8" height="7" />
      <rect x="13" y="4" width="8" height="7" />
      <rect x="3" y="13" width="8" height="7" />
      <rect x="13" y="13" width="8" height="7" />
    </>
  ),
  papan: (
    <>
      <rect x="3" y="4" width="5" height="16" />
      <rect x="10" y="4" width="5" height="11" />
      <rect x="17" y="4" width="4" height="14" />
    </>
  ),
  unit: (
    <>
      <path d="M3 20V11l9-7 9 7v9" />
      <path d="M3 20h18M9 20v-6h6v6" />
    </>
  ),
  tamu: (
    <>
      <path d="M4 20v-2a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v2" />
      <rect x="6" y="4" width="7" height="7" />
      <path d="M16 20v-2a4 4 0 0 0-2-3.4M15 4.3a3.5 3.5 0 0 1 0 6.4" />
    </>
  ),
  tiket: (
    <>
      <path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" />
      <path d="M13 7v10" />
    </>
  ),
  kunci: (
    <>
      <path d="M4 12h9M10 8l4 4-4 4" />
      <path d="M15 4h5v16h-5" />
    </>
  ),
  panah: <path d="M15 5l-7 7 7 7" />,
  kosong: (
    <>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M3 10h18M8 15h8" />
    </>
  ),
};

export function Ikon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ badges */

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`app-badge app-badge-${status}`}>{STATUS_LABEL[status]}</span>;
}

export function initial(nama: string): string {
  return nama
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

/* ------------------------------------------------------------------ view preference

   App standard 3: every collection is viewable in more than one mode, the choice is remembered
   PER PAGE, and switching view must not reset the filters that are currently applied. The
   filters live in their own state in each workspace, so a view change cannot touch them.

   Read after mount rather than in a useState initializer: reading localStorage during the first
   render would make the server HTML and the client's first render disagree, which React 19
   reports as a hydration error on a statically exported page. */
export function useViewPref<T extends string>(key: string, fallback: T, allowed: readonly T[]) {
  const [view, setView] = useState<T>(fallback);
  useEffect(() => {
    try {
      const v = localStorage.getItem(`lembayung_view_${key}`) as T | null;
      if (v && allowed.includes(v)) setView(v);
    } catch {
      /* private mode, keep the fallback */
    }
    /* `allowed` is a literal tuple declared at module scope in every caller */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const pilih = useCallback(
    (v: T) => {
      setView(v);
      try {
        localStorage.setItem(`lembayung_view_${key}`, v);
      } catch {
        /* ignore */
      }
    },
    [key],
  );
  return [view, pilih] as const;
}

export interface ViewDef<T extends string> {
  id: T;
  label: string;
  ikon: IconName;
}

export function ViewSwitcher<T extends string>({
  views,
  value,
  onChange,
  label,
}: {
  views: readonly ViewDef<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="app-views" role="group" aria-label={label}>
      {views.map((v) => (
        <button
          key={v.id}
          type="button"
          className="app-view-btn"
          aria-pressed={value === v.id}
          onClick={() => onChange(v.id)}
        >
          <Ikon name={v.ikon} className="app-view-ikon" />
          {v.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ empty and loading */

export function KosongState({
  judul,
  ket,
  aksi,
}: {
  judul: string;
  ket: string;
  aksi?: React.ReactNode;
}) {
  return (
    <div className="app-kosong">
      <Ikon name="kosong" className="app-kosong-ikon" />
      <span className="app-kosong-judul">{judul}</span>
      <span className="app-kosong-ket">{ket}</span>
      {aksi}
    </div>
  );
}

/** Skeleton rows, used while a client only workspace resolves its saved view on mount. */
export function Skeleton({ baris = 6 }: { baris?: number }) {
  return (
    <div className="app-side-box" aria-hidden="true">
      {Array.from({ length: baris }).map((_, i) => (
        <span key={i} className="app-skeleton" style={{ width: `${100 - (i % 4) * 12}%` }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ overlay primitive */

export function Overlay({
  open,
  onClose,
  label,
  panelClass,
  id,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  /** `app-drawer` for the nav drawer, `app-rec-panel` for the record panel. */
  panelClass: string;
  /** Target of the trigger's aria-controls, so R60 can be verified on this pair. */
  id?: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      prevFocus.current = document.activeElement as HTMLElement;
      setMounted(true);
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    /* the out transition runs, THEN the node leaves the DOM entirely. R57: while closed it is
       not in the document at all, so its layout footprint is zero rather than merely invisible. */
    const t = window.setTimeout(() => setMounted(false), 320);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted || !open) return;
    panelRef.current?.querySelector<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, open, onClose]);

  useEffect(() => {
    if (mounted || !prevFocus.current) return;
    prevFocus.current.focus();
    prevFocus.current = null;
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div className={`app-scrim ${shown ? 'in' : ''}`} onClick={onClose} aria-hidden="true" />
      <div
        className={`${panelClass} ${shown ? 'in' : ''}`}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        ref={panelRef}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

/* ------------------------------------------------------------------ sortable table header */

export type Arah = 'naik' | 'turun';

export function ThSort<K extends string>({
  id,
  label,
  aktif,
  arah,
  onSort,
}: {
  id: K;
  label: string;
  aktif: K;
  arah: Arah;
  onSort: (k: K) => void;
}) {
  const sorted = aktif === id;
  return (
    <th scope="col" aria-sort={sorted ? (arah === 'naik' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="app-th-btn" onClick={() => onSort(id)}>
        {label}
        <span className="app-sort" aria-hidden="true">
          {sorted ? (arah === 'naik' ? '▲' : '▼') : '↕'}
        </span>
      </button>
    </th>
  );
}

/** A checkbox that keeps a 44px target without growing the 22px box (R47 plus R10). */
export function Centang({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  const id = useId();
  return (
    <label className="app-check-cell" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="app-check"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="sr-only">{label}</span>
    </label>
  );
}
