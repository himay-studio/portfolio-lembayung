'use client';

/**
 * Removes the marketing chrome on `/app` routes.
 *
 * The root layout renders the announcement bar, the header, the footer and the three floating
 * overlays for every route. A reservation panel wearing a marketing mega menu and a footer is
 * not the app standard, so they are gated here.
 *
 * Why a React gate and not a CSS `display: none`, which would touch no shared file at all:
 * WelcomeModal sets `document.body.style.overflow = 'hidden'` while it is open and installs a
 * Tab focus trap. Hiding it with CSS leaves both behaviours running, so the panel would be
 * unscrollable and the keyboard trapped inside an invisible dialog. Returning null before it
 * mounts is the only version that is actually correct.
 *
 * `children` are passed in from the SERVER layout, so the ones that are server components stay
 * server components. This wrapper only decides whether they enter the tree.
 *
 * ClientEffects is deliberately NOT gated: the panel wants the `.js` class and the R24 reveal
 * observers exactly as much as the marketing site does.
 */

import { usePathname } from 'next/navigation';

export function isAppRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === '/app' || pathname.startsWith('/app/');
}

export default function AppChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isAppRoute(pathname)) return null;
  return <>{children}</>;
}
