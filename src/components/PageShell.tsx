'use client';

/* R46 animated page transition on every route change.
 *
 * The incoming page fades and rises 12px over 260ms, inside the 150 to 300ms window DESIGN.md
 * section 5 sets. It is keyed on the pathname so React remounts the wrapper on navigation and the
 * CSS animation replays; a hard page cut with no transition is a failed build.
 *
 * It never delays first contentful paint: the animation starts from opacity 0 but `both` fill plus
 * a 260ms duration means the content is painted and interactive immediately, and it is disabled
 * entirely under prefers-reduced-motion by the global reduce block in site.css.
 *
 * `@view-transition { navigation: auto }` in site.css handles the cross document case for browsers
 * that support it. This wrapper is the same document fallback, so both paths animate.
 */

import { usePathname } from 'next/navigation';

export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <main id="konten" key={pathname} className="page-enter">
      {children}
    </main>
  );
}
