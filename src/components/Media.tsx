/* Media slot with a PER ASSET FILESYSTEM GATE.
 *
 * R15, and this is the one absolute rule of the layout first stage: a `<video src>`, a
 * `<source src>` or an `<img src>` is NEVER pointed at a file that is not on disk. A `<video>`
 * wired to a missing mp4 renders a frozen dead element that looks broken, which is exactly how
 * dapur-tepat, portfolio-kilau, gunung-rezeki and sinyalkita shipped dead heroes.
 *
 * So every slot asks the build time manifest first. `src/data/media.generated.ts` is written by
 * the `prebuild` hook from whatever actually exists under `public/`, so it cannot drift from the
 * filesystem. When the file is missing this renders an honest annotated placeholder carrying the
 * exact MEDIA.md path and prompt, which is what Fahima and Stage 7 both read.
 *
 * R11: the `.ph-tag` text RENDERS ON SCREEN, so no em dash or en dash in any prompt string.
 */

import { hasMedia } from '@/data/media.generated';

export type Ratio = '1:1' | '4:3' | '16:9' | '3:2';

const RATIO_CLASS: Record<Ratio, string> = {
  '1:1': 'ph-1-1',
  '4:3': 'ph-4-3',
  '16:9': 'ph-16-9',
  '3:2': 'ph-3-2',
};

export function Media({
  path,
  ratio,
  prompt,
  className = '',
  type = 'image',
  poster,
  alt = '',
  eager = false,
}: {
  /** exact target path under public/, with or without the leading slash */
  path: string;
  ratio: Ratio;
  /** what MEDIA.md asks Fahima to generate for this slot, shown on the placeholder */
  prompt: string;
  className?: string;
  type?: 'image' | 'video';
  poster?: string;
  /** meaningful Indonesian alt text, or "" for a decorative image */
  alt?: string;
  eager?: boolean;
}) {
  const ratioCls = RATIO_CLASS[ratio];
  const rel = path.replace(/^\//, '');
  const posterRel = poster ? poster.replace(/^\//, '') : undefined;

  if (type === 'video') {
    /* the mp4 exists: a real muted autoplay loop, R30 and R44 */
    if (hasMedia(rel)) {
      return (
        <video
          className={`media-video ${className}`}
          src={`/${rel}`}
          poster={posterRel && hasMedia(posterRel) ? `/${posterRel}` : undefined}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          data-media={path}
          data-type="video"
          data-ratio={ratio}
          aria-label={alt || undefined}
        />
      );
    }
    /* no mp4 but a poster still exists: a plain <img>, never a frozen dead <video> */
    if (posterRel && hasMedia(posterRel)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={`media-video ${className}`}
          src={`/${posterRel}`}
          alt={alt}
          loading="eager"
          decoding="async"
          data-media={path}
          data-type="video"
          data-ratio={ratio}
          data-fallback="poster"
        />
      );
    }
    /* neither exists: an honest annotated placeholder */
    return (
      <div
        className={`ph ${ratioCls} ${className}`}
        data-media={path}
        data-type="video"
        data-ratio={ratio}
        data-poster={poster}
      >
        <span className="ph-tag">{prompt}</span>
      </div>
    );
  }

  if (hasMedia(rel)) {
    return (
      // plain <img>, this stack never uses next/image
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={`media-img ${ratioCls} ${className}`}
        src={`/${rel}`}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        data-media={path}
        data-type="image"
        data-ratio={ratio}
      />
    );
  }

  return (
    <div className={`ph ${ratioCls} ${className}`} data-media={path} data-type="image" data-ratio={ratio}>
      <span className="ph-tag">{prompt}</span>
    </div>
  );
}

export default Media;
