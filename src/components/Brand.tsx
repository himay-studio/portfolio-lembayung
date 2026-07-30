/* The brand lockup.
 *
 * R50 applies to the BRAND LOCKUP ITSELF, which is the shape everyone forgets. A wordmark with
 * an inline tagline child renders as one glued line: on Mabrur the footer read
 * `MabrurUMROH & HAJI` because `<small>` defaults to display:inline. So `Lembayung` and
 * `LEMBANG, BANDUNG UTARA` are separate BLOCK children of a flex column with an explicit gap.
 *
 * R62: the category line is HTML and is never baked into the logo image, because a second string
 * in the image is the slot where the model invents a different brand name.
 *
 * R43: two logo variants, and the right one per ground. `logo-inverted.png` on the dark header
 * and the dark footer, `logo.png` on light grounds. A single self contained coloured block
 * reused everywhere is how the Legatara footer logo read as a blank rectangle.
 *
 * R15: the logo is not on disk until Fahima delivers it, so this goes through the same
 * filesystem gate as every other asset and falls back to a CSS drawn four bar mark rather than
 * a broken image icon.
 */

import Link from 'next/link';
import { hasMedia } from '@/data/media.generated';
import { site } from '@/data/site';

const LOGO_LIGHT = 'img/logo.png';
const LOGO_DARK = 'img/logo-inverted.png';

export default function Brand({
  ground = 'dark',
  size = 34,
}: {
  /** which ground the lockup is sitting on, so R43 can pick the right variant */
  ground?: 'dark' | 'light';
  size?: number;
}) {
  const file = ground === 'dark' ? LOGO_DARK : LOGO_LIGHT;

  return (
    <Link href="/" className="brand" data-ground={ground} aria-label={`${site.name}, beranda`}>
      {hasMedia(file) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/${file}`} alt="" height={size} style={{ height: size }} />
      ) : (
        /* the four bar horizon mark from LOGO.md section 1, drawn in CSS so the header is never
           broken while the real PNG is still queued with Fahima */
        <span className="brand-mark-ph" aria-hidden="true" style={{ width: size, height: size }}>
          <i />
          <i />
          <i />
          <i />
        </span>
      )}
      <span className="brand-stack">
        <span className="brand-word">{site.name}</span>
        <span className="brand-kategori">{site.categoryLine}</span>
      </span>
    </Link>
  );
}
