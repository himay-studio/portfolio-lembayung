/* The four card shapes the site reuses everywhere.
 *
 * R50 is the rule that shapes all of them: a title and its secondary label are separate BLOCK
 * children of a flex column with an explicit gap, never two adjacent inline text nodes. Two inline
 * nodes glue, and `Dome SenjaTenda` is what ships. The `.titik` / `.titik-utama` / `.titik-label`
 * trio in site.css section 6 is that structure, and every card below uses it.
 *
 * R42: a unit card shows capacity and view as VARIANT CHIPS, never folded into the name. The name
 * on the card is the structure and nothing else, so a listing filter can narrow which cards show
 * without ever changing a name.
 *
 * R48: these cards are what the `.snap-row` carousel carries. Any container holding more than
 * three of them is a snap carousel at 768px and below, on every route.
 */

import Link from 'next/link';
import Media from '@/components/Media';
import { mediaTag } from '@/data/media';
import { VIEW_LABEL, rupiah } from '@/data/types';
import type { Activity, Article, PackageItem, Unit } from '@/data/types';
import { capacities, startingPrice } from '@/data/units';

export function UnitCard({ unit }: { unit: Unit }) {
  const first = unit.gallery[0];
  const caps = capacities(unit);
  const views = [...new Set(unit.variants.map((v) => v.view))];
  const lowStock = unit.variants.reduce((n, v) => n + v.stock, 0) <= 3;

  return (
    <Link href={`/unit/${unit.slug}/`} className="card card-link reveal">
      {first && <Media path={first.path} ratio="1:1" alt={first.alt} prompt={mediaTag(first.path)} />}
      <div className="card-pad stack-sm" style={{ flex: '1 1 auto' }}>
        <div className="chip-row">
          <span className="badge badge-violet">Teras {unit.terrace}</span>
          {lowStock && <span className="badge">Unit terbatas</span>}
        </div>
        {/* R50 / R42: the NAME is the structure. Capacity and view live in the chips below. */}
        <span className="titik">
          <span className="titik-utama">{unit.name}</span>
          <span className="titik-label">{unit.structure}</span>
        </span>
        <p className="kecil muted" style={{ margin: 0 }}>
          {unit.tagline}
        </p>
        <div className="chip-row">
          {caps.map((c) => (
            <span className="chip" key={c}>
              {c} pax
            </span>
          ))}
          {views.map((v) => (
            <span className="chip" key={v}>
              {VIEW_LABEL[v]}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
          <span className="kecil muted" style={{ display: 'block' }}>
            Mulai dari, per malam
          </span>
          <span className="harga">{rupiah(startingPrice(unit))}</span>
        </div>
      </div>
    </Link>
  );
}

export function PackageCard({ item }: { item: PackageItem }) {
  const unitLabel = item.priceUnit === 'paket' ? 'per paket' : `per ${item.priceUnit}`;
  return (
    <Link href={`/paket/${item.slug}/`} className="card card-link reveal">
      <Media path={item.image.path} ratio="4:3" alt={item.image.alt} prompt={mediaTag(item.image.path)} />
      <div className="card-pad stack-sm" style={{ flex: '1 1 auto' }}>
        <span className="badge badge-pinus">{item.duration}</span>
        <span className="titik">
          <span className="titik-utama">{item.name}</span>
          <span className="titik-label">{item.audience}</span>
        </span>
        <p className="kecil muted" style={{ margin: 0 }}>
          {item.tagline}
        </p>
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
          <span className="harga">{rupiah(item.price)}</span>
          <span className="kecil muted" style={{ display: 'block' }}>
            {unitLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ActivityCard({ item }: { item: Activity }) {
  return (
    <article className="card reveal" id={item.slug}>
      <Media path={item.image.path} ratio="4:3" alt={item.image.alt} prompt={mediaTag(item.image.path)} />
      <div className="card-pad stack-sm" style={{ flex: '1 1 auto' }}>
        <span className="badge">{item.kind === 'kegiatan' ? 'Kegiatan' : 'Fasilitas'}</span>
        <span className="titik">
          <span className="titik-utama">{item.name}</span>
          <span className="titik-label">{item.schedule}</span>
        </span>
        <p className="kecil" style={{ margin: 0 }}>
          {item.summary}
        </p>
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
          <span className="kecil" style={{ display: 'block', fontWeight: 600 }}>
            {item.price === 0 ? 'Termasuk tarif menginap' : rupiah(item.price)}
          </span>
          <span className="kecil muted" style={{ display: 'block' }}>
            {item.priceNote}
          </span>
        </div>
      </div>
    </article>
  );
}

export function ArticleCard({ item }: { item: Article }) {
  return (
    <Link href={`/cerita/${item.slug}/`} className="card card-link reveal">
      <Media path={item.image.path} ratio="16:9" alt={item.image.alt} prompt={mediaTag(item.image.path)} />
      <div className="card-pad stack-sm" style={{ flex: '1 1 auto' }}>
        <span className="badge">{item.category}</span>
        <span className="titik">
          <span className="titik-utama">{item.title}</span>
          <span className="titik-label">
            {item.author}, {item.readingMinutes} menit baca
          </span>
        </span>
        <p className="kecil muted" style={{ margin: 0 }}>
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}

export function TestimonialCard({
  name,
  origin,
  stayed,
  rating,
  quote,
}: {
  name: string;
  origin: string;
  stayed: string;
  rating: number;
  quote: string;
}) {
  return (
    <figure className="card card-pad reveal" style={{ margin: 0, gap: '0.75rem' }}>
      <span className="stars" aria-label={`${rating} dari 5`}>
        {'★'.repeat(rating)}
        {'☆'.repeat(5 - rating)}
      </span>
      <blockquote className="kutip" style={{ margin: 0, fontSize: '1.02rem', lineHeight: 1.55 }}>
        {quote}
      </blockquote>
      {/* R50: three separate block lines, so the name never glues to the origin or the unit */}
      <figcaption className="titik" style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
        <span style={{ display: 'block', fontWeight: 600 }}>{name}</span>
        <span className="titik-label">{origin}</span>
        <span className="titik-label">{stayed}</span>
      </figcaption>
    </figure>
  );
}
