'use client';

/* Scroll reveal plus the R46 route transition.
 *
 * R24: this is the CORRECTED reveal block, cloned from portfolio-kilau (post HIM-169), NOT from
 * MilkyBreeze, whose version still has the mount only scan. A pass that runs only at mount
 * silently hides every node inserted AFTER mount: filter results, form submit results, tab and
 * accordion swaps, async loads. The node lands at opacity 0, is never observed, never gets `.in`,
 * and the page reads as blank even though the markup is correct. So a MutationObserver on
 * document.body runs alongside the IntersectionObserver, and the same late node handling is
 * mirrored for prefers-reduced-motion.
 *
 * R34 lives in site.css, not here: the revealed state is written at specificity (0,3,0) as
 * `.reveal.in, .js .reveal.in` so it out ranks every hide rule regardless of source order, and
 * there is deliberately no `.js .reveal { opacity: 0 }` rule at equal specificity to fight with.
 *
 * R46: `.page-enter` is keyed on the pathname in layout.tsx, so the incoming page fades and rises
 * on every route change. It obeys prefers-reduced-motion through the global reduce block.
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientEffects() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealAll = () => {
      document.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach((n) => n.classList.add('in'));
    };

    if (reduce) {
      revealAll();
      /* late nodes matter here too, otherwise a reduced motion user sees the same blank page */
      const mo = new MutationObserver(revealAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    /* reveal immediately if already on screen, otherwise watch for scroll in */
    const observe = (node: HTMLElement) => {
      if (node.getBoundingClientRect().top < window.innerHeight) node.classList.add('in');
      else io.observe(node);
    };

    /* check a node AND its subtree for un revealed .reveal elements */
    const check = (el: HTMLElement) => {
      if (el.classList?.contains('reveal') && !el.classList.contains('in')) observe(el);
      el.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach(observe);
    };

    /* initial pass: everything present at mount */
    check(document.body);

    /* late pass: .reveal nodes inserted after mount (R24, the HIM-169 defect) */
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1) check(node as HTMLElement);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
