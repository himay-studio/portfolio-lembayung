'use client';

/* R18 ecommerce style gallery on the unit detail page.
 *
 * Six unit types carry four images each specifically so this has something real to swap.
 *
 * - a row of clickable THUMBNAILS swaps the main image
 * - the active thumbnail carries a visible selected state, a violet ring plus full opacity plus
 *   an inverted kind label
 * - the main image CROSSFADES rather than jumping: all four slides are stacked at one position
 *   and opacity is animated, which is also why this container is exempt from the R48 carousel
 *   sweep, it is a stage and not a card row
 * - thumbnails are REAL buttons, reachable by Tab, activated by Enter and Space, with
 *   ArrowLeft / ArrowRight moving between them. A gallery whose sub photos are inert decoration
 *   is a failed build, which is the Komodrift HIM-118 defect.
 *
 * `active` is controlled from the parent, because R42's variant picker also drives it: choosing a
 * capacity or a view swaps the main image IN PLACE through this same index.
 */

import { useRef } from 'react';
import Media from '@/components/Media';
import type { GalleryImage } from '@/data/types';

const KIND_LABEL: Record<GalleryImage['kind'], string> = {
  eksterior: 'Eksterior',
  interior: 'Interior',
  dek: 'Dek',
  detail: 'Detail',
};

export default function UnitGallery({
  images,
  prompts,
  active,
  onSelect,
  unitName,
}: {
  images: GalleryImage[];
  /** the MEDIA.md prompt per image, shown on the placeholder until the file lands */
  prompts: string[];
  active: number;
  onSelect: (i: number) => void;
  unitName: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  function onKey(e: React.KeyboardEvent, i: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + images.length) % images.length;
    onSelect(next);
    rowRef.current?.querySelectorAll<HTMLButtonElement>('.gallery-thumb')[next]?.focus();
  }

  return (
    <div className="gallery">
      <div className="gallery-stage">
        {images.map((img, i) => (
          <div key={img.path} className={`gallery-slide ${i === active ? 'is-shown' : ''}`} aria-hidden={i !== active}>
            <Media
              path={img.path}
              ratio="1:1"
              alt={img.alt}
              prompt={prompts[i] ?? img.alt}
              eager={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="gallery-thumbs" role="tablist" aria-label={`Foto ${unitName}`} ref={rowRef}>
        {images.map((img, i) => (
          <button
            key={img.path}
            type="button"
            role="tab"
            className="gallery-thumb"
            aria-selected={i === active}
            aria-label={`Lihat foto ${KIND_LABEL[img.kind].toLowerCase()} ${unitName}`}
            onClick={() => onSelect(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <Media path={img.path} ratio="1:1" alt="" prompt={prompts[i] ?? img.alt} />
            <span className="gallery-kind">{KIND_LABEL[img.kind]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
