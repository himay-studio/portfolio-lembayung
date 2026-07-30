'use client';

/* Shared viewport clamp for absolutely positioned panels.
 *
 * R16.1 sharp edge, and it is the reason a CSS anchor alone is not enough. The nav item or field
 * that OWNS a panel is not always flush with a viewport edge: a logo sits before it and other
 * items sit after it. So `left: 0` only fixes which DIRECTION the panel grows, not whether it
 * stays inside the window. Dapur Tepat overflowed at 1025px exactly here.
 *
 * This measures the open panel and writes a `--*-shift` custom property so it nudges back into
 * bounds without breaking the anchor's growth direction. The CSS keeps its own
 * `max-width: calc(100vw - 2rem)` clamp as a belt and braces guard, so a panel is never wider
 * than the window even if this never runs.
 */

import { useEffect, type RefObject } from 'react';

const PAD = 16;

export function useViewportClamp(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  prop = '--panel-shift',
) {
  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    if (!el) return;

    const clamp = () => {
      /* reset first, so the measurement is of the un nudged box */
      el.style.setProperty(prop, '0px');
      const rect = el.getBoundingClientRect();
      let dx = 0;
      if (rect.right > window.innerWidth - PAD) dx = window.innerWidth - PAD - rect.right;
      else if (rect.left < PAD) dx = PAD - rect.left;
      el.style.setProperty(prop, `${dx}px`);
    };

    const raf = requestAnimationFrame(clamp);
    window.addEventListener('resize', clamp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', clamp);
    };
  }, [ref, open, prop]);
}
