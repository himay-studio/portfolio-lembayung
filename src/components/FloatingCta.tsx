'use client';

/* R37 floating conversion banner. A portfolio subdomain is never a passive showcase: every
 * visitor here is a prospective Himay client, not the demo brand's customer.
 *
 * - copy `Looking for a website like this?` plus a GREEN (R5) `Build Yours with Himay Studio`
 * - the CTA routes through waLink() to https://wa.me/6285772203654 (R14)
 * - ONE appearance per browser session (sessionStorage), same family as the R13 modal
 * - FULLY UNMOUNTS on close, so no invisible click trapping layer is left behind
 * - dismissable via the X button AND Escape, keyboard reachable, role="region"
 * - animates in and out and obeys prefers-reduced-motion through the global reduce block
 * - R10 / R17 collision: it sits bottom LEFT while the WhatsApp oval sits bottom RIGHT, and below
 *   620px it stacks ABOVE the oval, so the two tap targets can never overlap. When a page carries
 *   the mobile sticky booking bar it lifts again, see site.css section 20.
 */

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { waLink } from '@/data/links';

const KEY = 'lembayung_cta_float_seen';

export default function FloatingCta() {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(KEY)) return;
    /* well after the welcome modal, so the two never compete for attention */
    const t = window.setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setShown(true));
    }, 9000);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = useCallback(() => {
    setShown(false);
    sessionStorage.setItem(KEY, '1');
    window.setTimeout(() => setMounted(false), 320);
  }, []);

  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shown, dismiss]);

  if (!mounted) return null;

  return createPortal(
    <aside
      className={`cta-float ${shown ? 'in' : ''}`}
      role="region"
      aria-label="Penawaran pembuatan website dari Himay Studio"
    >
      <button type="button" className="cta-float-close" onClick={dismiss} aria-label="Tutup penawaran">
        &#10005;
      </button>
      <p>Looking for a website like this?</p>
      <a
        className="btn btn-cta btn-sm"
        href={waLink('konsultasi pembuatan website portfolio')}
        target="_blank"
        rel="noopener"
      >
        Build Yours with Himay Studio
      </a>
    </aside>,
    document.body,
  );
}
