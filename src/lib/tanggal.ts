/* Date helpers for the booking flow. Plain functions, no dependency, shared by the range picker
 * and by the rate summary so the two can never disagree on what a weekend night is.
 *
 * BRAND.md section 4: dates read `12 Agustus 2026`, times use a full stop `17.30`.
 * site.operations.weekendDays is [5, 6], Friday and Saturday, 0 being Sunday.
 */

export const BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

/** Monday first, matching how an Indonesian calendar is read. */
export const HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'] as const;

export function iso(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parse(v: string): Date | null {
  if (!v) return null;
  const d = new Date(`${v}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function midnightToday(): Date {
  return new Date(new Date().setHours(0, 0, 0, 0));
}

/** `12 Agustus 2026`. */
export function panjang(v: string): string {
  const d = parse(v);
  if (!d) return '';
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/** `12 Agu`, for tight summary rows. */
export function pendek(v: string): string {
  const d = parse(v);
  if (!d) return '';
  return `${d.getDate()} ${BULAN[d.getMonth()]?.slice(0, 3)}`;
}

/** Monday first offset for a month grid. */
export function leadingBlanks(year: number, month: number): number {
  const first = new Date(year, month, 1).getDay(); /* 0 = Minggu */
  return (first + 6) % 7;
}

export function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

export function nights(from: string, to: string): number {
  const a = parse(from);
  const b = parse(to);
  if (!a || !b) return 0;
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}

/**
 * How many of the nights between `from` and `to` are charged at the weekend rate.
 *
 * A NIGHT belongs to the day it starts on, so a stay checking in on Friday and out on Sunday is
 * two nights: Friday (weekend rate) and Saturday (weekend rate). This is the calculation the FAQ
 * answer about weekend pricing promises, so it is done in one place.
 */
export function weekendNights(from: string, to: string, weekendDays: readonly number[]): number {
  const a = parse(from);
  const total = nights(from, to);
  if (!a || total === 0) return 0;
  let count = 0;
  for (let i = 0; i < total; i++) {
    if (weekendDays.includes(addDays(a, i).getDay())) count++;
  }
  return count;
}
