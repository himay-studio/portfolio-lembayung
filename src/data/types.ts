/**
 * Shared content types for Lembayung.
 *
 * Stage 1 output, Brand Strategist. Stage 3 wires these into pages, Stage 4 into the
 * reservation panel. Extend them, do not rename the fields the other modules already use.
 *
 * The important contract in this file is the Unit / UnitVariant split. It exists to make
 * R42 structurally impossible to violate, so read the comment on `Unit.name` before adding
 * anything to the catalog.
 */

/** Which way a unit faces. A VARIANT dimension, never part of a unit name. */
export type View = 'lembah' | 'hutan' | 'danau';

/** Where the bathroom is. */
export type Bathroom = 'dalam' | 'luar';

export const VIEW_LABEL: Record<View, string> = {
  lembah: 'Lembah',
  hutan: 'Hutan Pinus',
  danau: 'Embung',
};

/** One shot in a unit's gallery. Four per unit type, R18 and R41. */
export interface GalleryImage {
  /** Public path. This is the contract with MEDIA.md, a wrong name is a 404 at build. */
  path: string;
  /** Meaningful Indonesian alt text. Never a filename, never empty on a content image. */
  alt: string;
  /** What the frame shows. Drives the MEDIA.md SUBJECT block, R49. */
  kind: 'eksterior' | 'interior' | 'dek' | 'detail';
}

/**
 * A bookable configuration of a unit type.
 *
 * R42: capacity and view live HERE, on the variant, never in `Unit.name`. The detail page
 * picker swaps `sku`, `price` and the image IN PLACE. It must never navigate to another slug.
 */
export interface UnitVariant {
  sku: string;
  /** Guests included in the base rate. */
  capacity: number;
  view: View;
  /** Weekday rate per night, IDR. Sunday to Thursday. */
  price: number;
  /** Friday, Saturday and public holiday rate per night, IDR. */
  weekendPrice: number;
  /**
   * Index into the parent unit's `gallery`, so the picker swaps to an image that already
   * exists. Deliberately an index and not a path: the asset budget is 4 images per unit
   * type (see DESIGN.md 7.6), so a variant can never introduce a new asset row.
   */
  imageIndex: number;
  /** How many of this configuration exist on the property. Drives the availability chip. */
  stock: number;
}

/**
 * A unit TYPE, which is a structure.
 *
 * R42, stated where someone adding a unit will actually read it:
 *   `name` is the STRUCTURE and nothing else. Dome Senja. Kabin Pinus. Lodge Rimba.
 *   It must never contain a capacity or a view.
 *
 *   Correct : name 'Dome Senja', variants [2 pax lembah, 2 pax hutan, 4 pax lembah]
 *   Wrong   : three units named 'Dome Lembah 2 Pax', 'Dome Hutan 2 Pax', ...
 *
 * Two symptoms prove which one shipped. If the listing capacity filter changes the NAME on
 * the card, the model is wrong. If the detail page view picker navigates to another slug
 * instead of swapping in place, the model is wrong.
 */
export interface Unit {
  slug: string;
  /** STRUCTURE ONLY. See the note above. */
  name: string;
  /** One line structural description, e.g. 'Dome geodesik 5 meter di atas dek kayu'. */
  structure: string;
  /** Short hook, one sentence, shown under the name on the card. */
  tagline: string;
  /** Two or three paragraphs. Why this unit exists and who it suits. */
  story: string;
  /** Honest note on who should NOT book it. Part of the brand voice, see BRAND.md 3. */
  notFor: string;
  sizeM2: number;
  /** Which of the five terraces it sits on, 1 highest to 5 lowest. */
  terrace: number;
  bedding: string;
  bathroom: Bathroom;
  facilities: string[];
  /** Exactly four, in order: eksterior, interior, dek, detail. */
  gallery: GalleryImage[];
  /** At least one. Capacity and view live here, R42. */
  variants: UnitVariant[];
}

export interface PackageItem {
  slug: string;
  name: string;
  /** Who it is built for, in plain words. */
  audience: string;
  tagline: string;
  description: string;
  /** e.g. '2 hari 1 malam'. */
  duration: string;
  /** What the price is per: 'paket', 'orang', 'siswa'. */
  priceUnit: 'paket' | 'orang' | 'siswa';
  price: number;
  /** Free text when the rate is conditional, e.g. 'minimum 30 pax, hanya weekday'. */
  priceNote?: string;
  inclusions: string[];
  /** Stated plainly rather than buried, per the brand voice. */
  exclusions: string[];
  image: GalleryImage;
  /** Slugs from units.ts. Empty when the package is not tied to a unit type. */
  relatedUnits: string[];
}

export interface Activity {
  slug: string;
  name: string;
  /** 'kegiatan' runs on a schedule, 'fasilitas' is always there. */
  kind: 'kegiatan' | 'fasilitas';
  summary: string;
  description: string;
  /** e.g. 'Setiap hari, 17.30' or 'Buka 07.00 sampai 22.00'. */
  schedule: string;
  /** 0 means included in the room rate. */
  price: number;
  priceNote: string;
  image: GalleryImage;
}

export interface Article {
  slug: string;
  title: string;
  /** One sentence, used on the card and as the meta description. */
  excerpt: string;
  category: 'Panduan' | 'Cerita' | 'Tips' | 'Acara';
  /** ISO date, YYYY-MM-DD. */
  date: string;
  author: string;
  readingMinutes: number;
  image: GalleryImage;
  /** Full body as markdown. Not a stub. */
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'Pemesanan' | 'Menginap' | 'Fasilitas' | 'Lokasi' | 'Rombongan';
}

export interface Testimonial {
  name: string;
  origin: string;
  /** Which unit or package they actually stayed in. */
  stayed: string;
  date: string;
  rating: number;
  quote: string;
}

/** Formats an IDR amount the way BRAND.md section 4 requires: `Rp 1.250.000`. */
export function rupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}
