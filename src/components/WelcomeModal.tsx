'use client';

/* R13 welcome modal, generated portfolio sites only.
 *
 * Copy starts `Selamat datang di himaystudio, kali ini kami sajikan website Lembayung ...`.
 * Animates in AND out, traps focus while open, role="dialog" aria-modal="true", closes on the X
 * button, Escape and a backdrop click, shown once per session via sessionStorage.
 *
 * R13 / HIM-93: on close it FULLY UNMOUNTS, so it can never leave an invisible layer that
 *   swallows clicks on the page underneath.
 * R52: on mobile it is CENTRED and fits 375px, never a narrow strip overlaying the topbar, and
 *   it is tested at 375px together with the announcement bar, the topbar and the WhatsApp oval
 *   all active at once, because that combination is what broke on HIM-228.
 * R53: it is portalled to document.body, never nested inside the blurred <header>, which would
 *   become the containing block for this position:fixed overlay and clip it to a 76px strip.
 */

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { site } from '@/data/site';

const KEY = 'lembayung_welcome_seen';

export default function WelcomeModal() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(KEY)) return;
    const t = window.setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setOpen(true));
    }, 450);
    return () => window.clearTimeout(t);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem(KEY, '1');
    /* the out animation runs, THEN the node leaves the DOM entirely */
    window.setTimeout(() => setMounted(false), 340);
    prevFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      /* focus trap */
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`wm-overlay ${open ? 'in' : ''}`}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wm-title"
    >
      <div className="wm-panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <div className="wm-stripe" aria-hidden="true" />
        <button ref={closeRef} type="button" className="wm-close" onClick={close} aria-label="Tutup sambutan">
          &#10005;
        </button>
        <div className="wm-body">
          <span className="eyebrow">Himay Studio</span>
          <h2 id="wm-title">Selamat datang di himaystudio</h2>
          <p className="lead" style={{ marginTop: '0.75rem' }}>
            Kali ini kami sajikan website <strong>{site.name}</strong>, glamping dan kabin kayu di
            lereng hutan pinus Lembang. Enam tipe unit dengan galeri yang bisa diklik, pemilihan
            kapasitas dan arah pandang langsung di halaman unit, pemilih tanggal check in dan check
            out, paket rombongan, sampai panel reservasi, semuanya berjalan di demo ini.
          </p>
          <p className="kecil muted">
            Ini website portofolio demo dari Himay Studio. Silakan dijelajah, dicoba pilih
            tanggalnya, dan dilihat panel reservasinya.
          </p>
          <div className="btn-row" style={{ marginTop: '1.25rem' }}>
            <Link href="/unit/" className="btn btn-violet btn-sm" onClick={close}>
              Lihat Tipe Unit
            </Link>
            <Link href="/paket/" className="btn btn-outline btn-sm" onClick={close}>
              Lihat Paket
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
