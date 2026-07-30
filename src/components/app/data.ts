/**
 * Demo data for the Lembayung reservation panel (Stage 4, Webapp Architect).
 *
 * Three things about this file are deliberate.
 *
 * 1. IT IS PURE AND DETERMINISTIC. `buildPanel(todayIso)` is a function of its argument only.
 *    There is no `Math.random`, and no `new Date()` is read during render. The server page
 *    computes `todayIso` once at build time and passes it down as a prop, so the prerendered
 *    HTML and the hydrated client derive byte identical data. A module level `new Date()` read
 *    by a client component would evaluate to the BUILD day on the server and to the VISITOR day
 *    in the browser, which is a hydration mismatch that only shows up the day after a deploy.
 *
 * 2. IT RESPECTS INVENTORY. Reservations are allocated against `variant.stock` night by night,
 *    so no SKU is ever oversold. That is what makes the calendar occupancy figures and the
 *    inventory page mean something instead of being decoration.
 *
 * 3. R42 IS PRESERVED FROM THE MARKETING SIDE. A reservation carries a unit SLUG plus a variant
 *    SKU. Capacity and view are read off the variant, never off the unit name.
 *
 * R11: no em dash or en dash anywhere in these strings.
 */

import { units } from '@/data/units';
import { site } from '@/data/site';
import { VIEW_LABEL, type Unit, type UnitVariant, type View } from '@/data/types';
import { addDays, iso, nights, parse, weekendNights } from '@/lib/tanggal';

/* ------------------------------------------------------------------ status and vocabulary */

export const STATUS = ['permintaan', 'dikonfirmasi', 'menginap', 'selesai', 'batal'] as const;
export type Status = (typeof STATUS)[number];

export const STATUS_LABEL: Record<Status, string> = {
  permintaan: 'Permintaan',
  dikonfirmasi: 'Dikonfirmasi',
  menginap: 'Menginap',
  selesai: 'Selesai',
  batal: 'Batal',
};

/** One line of plain language per status, shown under the column title on the board. */
export const STATUS_KET: Record<Status, string> = {
  permintaan: 'Belum dibayar, menunggu konfirmasi resepsionis',
  dikonfirmasi: 'Deposit masuk, unit sudah dikunci',
  menginap: 'Tamu sedang berada di properti',
  selesai: 'Sudah check out dan lunas',
  batal: 'Dibatalkan tamu atau kedaluwarsa',
};

export const KANAL = ['Situs', 'WhatsApp', 'Telepon', 'Walk in', 'Agen'] as const;
export type Kanal = (typeof KANAL)[number];

/* ------------------------------------------------------------------ record shapes */

export interface Reservasi {
  /** Booking code the guest quotes at the gate and in the guest portal. */
  kode: string;
  tamu: string;
  kota: string;
  telepon: string;
  email: string;
  unitSlug: string;
  /** Structure name only, R42. Capacity and view live on the variant below. */
  unitNama: string;
  sku: string;
  kapasitas: number;
  view: View;
  /** ISO yyyy-mm-dd. */
  masuk: string;
  keluar: string;
  malam: number;
  malamAkhirPekan: number;
  pax: number;
  status: Status;
  kanal: Kanal;
  total: number;
  dibayar: number;
  catatan: string;
  dibuat: string;
}

export interface Tamu {
  nama: string;
  kota: string;
  telepon: string;
  email: string;
  menginap: number;
  malam: number;
  belanja: number;
  terakhir: string;
  /** Derived segment, shown as a chip. */
  segmen: 'Baru' | 'Berulang' | 'Rombongan';
}

export interface BarisInventaris {
  sku: string;
  unitSlug: string;
  unitNama: string;
  struktur: string;
  kapasitas: number;
  view: View;
  viewLabel: string;
  harga: number;
  hargaAkhirPekan: number;
  stok: number;
  teras: number;
  kamarMandi: string;
  /** Units of this SKU occupied on the reference night. */
  terisi: number;
}

export interface DataPanel {
  hariIni: string;
  reservasi: Reservasi[];
  tamu: Tamu[];
  inventaris: BarisInventaris[];
  totalUnit: number;
}

/* ------------------------------------------------------------------ deterministic source */

/** Linear congruential generator. Small, seeded, and identical on server and client. */
function acak(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* Names are COMBINED rather than listed, so a two month book of reservations does not end up
   with every single guest being a repeat guest. 30 given names against 24 family names cycle
   with a period of 120, which over roughly 220 reservations gives a believable mix: most guests
   appear once, a useful minority appear two or three times, and the guest portal has somebody
   with both a stay behind them and a stay ahead of them. */
const DEPAN = [
  'Sinta', 'Aditya', 'Bayu', 'Larasati', 'Hendra', 'Fitri', 'Gunawan', 'Ratna', 'Dimas', 'Maya',
  'Reza', 'Nurul', 'Yoga', 'Dewi', 'Bagas', 'Intan', 'Rizky', 'Anisa', 'Faisal', 'Citra',
  'Ardi', 'Salma', 'Panji', 'Ayu', 'Tegar', 'Mira', 'Galih', 'Rani', 'Ilham', 'Wulan',
] as const;

const BELAKANG = [
  'Rahmawati', 'Nugroho', 'Setiawan', 'Widodo', 'Wijaya', 'Handayani', 'Saputra', 'Puspita',
  'Prakoso', 'Anggraini', 'Firmansyah', 'Aisyah', 'Pratama', 'Lestari', 'Ramadhan', 'Permata',
  'Maulana', 'Kurnia', 'Rahman', 'Melati', 'Kusuma', 'Hapsari', 'Utami', 'Santoso',
] as const;

const KOTA = [
  'Bandung', 'Jakarta Selatan', 'Tangerang', 'Jakarta Pusat', 'Bekasi', 'Cimahi', 'Depok',
  'Jakarta Barat', 'Bogor', 'Jakarta Timur', 'Karawang', 'Cirebon', 'Sukabumi', 'Serang',
  'Bandung Barat', 'Purwakarta',
] as const;

/* Group bookings are a different kind of record, so they are named as organisations and land on
   the large units. One in every seventeen reservations. */
const ROMBONGAN = [
  ['Panitia Gathering Arunika', 'Jakarta Selatan'],
  ['SMA Cendekia Bandung', 'Bandung'],
  ['Koperasi Karya Sentosa', 'Bekasi'],
  ['Divisi Produk Nawala', 'Jakarta Pusat'],
] as const;

function orangKe(i: number): { nama: string; kota: string } {
  if (i % 17 === 5) {
    const g = ROMBONGAN[(i / 17) % ROMBONGAN.length | 0] ?? ROMBONGAN[0];
    return { nama: g[0], kota: g[1] };
  }
  const depan = DEPAN[i % DEPAN.length] ?? DEPAN[0];
  const belakang = BELAKANG[(i * 7) % BELAKANG.length] ?? BELAKANG[0];
  const kota = KOTA[(i * 5) % KOTA.length] ?? KOTA[0];
  return { nama: `${depan} ${belakang}`, kota };
}

const CATATAN = [
  'Minta unit yang paling dekat dengan parkir.',
  'Datang setelah 20.00, sudah dikonfirmasi ke resepsionis malam.',
  'Bawa satu anak usia 4 tahun, minta extra bed.',
  'Alergi kacang, sudah diteruskan ke dapur.',
  'Perayaan ulang tahun, minta kue diantar jam 19.00.',
  'Minta bak rendam diisi jam 17.00.',
  'Rombongan bawa bus besar, parkir di area bawah.',
  'Minta kayu api unggun ditambah dua ikat.',
  'Check out lambat sampai 14.00, sudah dikenakan biaya.',
  'Tamu lansia, minta unit tanpa anak tangga.',
  '',
  '',
];

const kodeUrut = (n: number) => `LMB-${String(1000 + n)}`;

/* ------------------------------------------------------------------ the builder */

interface Kandidat {
  unit: Unit;
  varian: UnitVariant;
  mulai: number;
  malam: number;
}

/**
 * Build the whole panel dataset from one reference day.
 *
 * `todayIso` is the panel's "hari ini". The reservation spread runs from 34 days before it to
 * 52 days after, which gives the calendar a genuinely busy month in both directions, the kanban
 * board something in every column, and the guest portal both upcoming and past stays.
 */
export function buildPanel(todayIso: string): DataPanel {
  const today = parse(todayIso) ?? new Date();
  const rnd = acak(20260730);
  const weekendDays: readonly number[] = site.operations.weekendDays;

  /* every bookable variant, flattened once */
  const varian: { unit: Unit; v: UnitVariant }[] = [];
  for (const u of units) for (const v of u.variants) varian.push({ unit: u, v });
  const totalUnit = varian.reduce((a, x) => a + x.v.stock, 0);

  /* how many units of a SKU are already taken on a given night offset */
  const terpakai = new Map<string, number>();
  const kunci = (sku: string, offset: number) => `${sku}#${offset}`;

  /* Candidates are generated DAY BY DAY across the window rather than by scattering random
     offsets, and that is not a style preference. A scattered spread plus a hard cap produced a
     book with nothing at all in house tonight: the dashboard read `Terisi malam ini 0 dari 28`,
     the calendar bars were empty on the current day, and the Menginap column on the board was
     empty. Walking the window guarantees every day including today is represented, and
     weighting weekends heavier is what makes the occupancy bars actually vary. */
  const AWAL = -21;
  const AKHIR = 40;
  const kandidat: Kandidat[] = [];
  for (let mulai = AWAL; mulai <= AKHIR; mulai++) {
    const hari = addDays(today, mulai).getDay();
    const akhirPekan = weekendDays.includes(hari);
    /* Deliberately MORE candidates than the property can hold, especially on Friday and
       Saturday. The inventory gate below is what decides how many actually land, so the book
       fills up the way a real one does: weekends close to full, weekdays comfortable, and
       nothing ever oversold. Undersupplying candidates instead produced a calendar whose
       occupancy bars were a uniform sliver on every single day. */
    const berapa = akhirPekan ? 10 : 4;
    for (let j = 0; j < berapa; j++) {
      const pick = varian[Math.floor(rnd() * varian.length)];
      if (!pick) continue;
      /* weekends run longer, weekdays are mostly one night */
      const malam = akhirPekan ? (rnd() < 0.55 ? 2 : 3) : rnd() < 0.75 ? 1 : 2;
      kandidat.push({ unit: pick.unit, varian: pick.v, mulai, malam });
    }
  }

  const reservasi: Reservasi[] = [];
  let nomor = 0;

  for (const k of kandidat) {
    if (reservasi.length >= 300) break;
    /* inventory gate: never oversell a SKU on any night of the stay */
    let muat = true;
    for (let n = 0; n < k.malam; n++) {
      const dipakai = terpakai.get(kunci(k.varian.sku, k.mulai + n)) ?? 0;
      if (dipakai >= k.varian.stock) {
        muat = false;
        break;
      }
    }
    if (!muat) continue;
    for (let n = 0; n < k.malam; n++) {
      const key = kunci(k.varian.sku, k.mulai + n);
      terpakai.set(key, (terpakai.get(key) ?? 0) + 1);
    }

    const masuk = iso(addDays(today, k.mulai));
    const keluar = iso(addDays(today, k.mulai + k.malam));
    const { nama, kota } = orangKe(nomor);

    /* status follows the dates, so the board and the calendar tell the same story */
    let status: Status;
    if (k.mulai + k.malam <= 0) status = rnd() < 0.12 ? 'batal' : 'selesai';
    else if (k.mulai <= 0) status = 'menginap';
    else if (k.mulai <= 12) status = rnd() < 0.22 ? 'permintaan' : 'dikonfirmasi';
    else status = rnd() < 0.42 ? 'permintaan' : 'dikonfirmasi';

    const akhirPekan = weekendNights(masuk, keluar, weekendDays);
    const total = (k.malam - akhirPekan) * k.varian.price + akhirPekan * k.varian.weekendPrice;
    const dibayar =
      status === 'selesai' || status === 'menginap'
        ? total
        : status === 'dikonfirmasi'
          ? Math.round((total * site.operations.payment.depositPercent) / 100)
          : 0;

    const paxDasar = k.varian.capacity;
    const pax = Math.max(1, paxDasar - (rnd() < 0.3 ? 1 : 0));

    reservasi.push({
      kode: kodeUrut(nomor),
      tamu: nama,
      kota,
      telepon: `+62 8${(12 + (nomor % 7)).toString()} ${3000 + nomor * 7} ${1000 + nomor * 13}`,
      email: `${nama.toLowerCase().replace(/[^a-z]+/g, '.')}@contoh.id`,
      unitSlug: k.unit.slug,
      unitNama: k.unit.name,
      sku: k.varian.sku,
      kapasitas: k.varian.capacity,
      view: k.varian.view,
      masuk,
      keluar,
      malam: nights(masuk, keluar),
      malamAkhirPekan: akhirPekan,
      pax,
      status,
      kanal: KANAL[nomor % KANAL.length] ?? 'Situs',
      total,
      dibayar,
      catatan: CATATAN[nomor % CATATAN.length] ?? '',
      dibuat: iso(addDays(today, k.mulai - (6 + (nomor % 21)))),
    });
    nomor++;
  }

  reservasi.sort((a, b) => (a.masuk < b.masuk ? -1 : a.masuk > b.masuk ? 1 : a.kode < b.kode ? -1 : 1));

  /* ---- guests, aggregated from the reservations so the two can never disagree ---- */
  const peta = new Map<string, Tamu>();
  for (const r of reservasi) {
    const t = peta.get(r.tamu);
    if (t) {
      t.menginap += 1;
      t.malam += r.malam;
      if (r.status !== 'batal') t.belanja += r.total;
      if (r.masuk > t.terakhir) t.terakhir = r.masuk;
    } else {
      peta.set(r.tamu, {
        nama: r.tamu,
        kota: r.kota,
        telepon: r.telepon,
        email: r.email,
        menginap: 1,
        malam: r.malam,
        belanja: r.status === 'batal' ? 0 : r.total,
        terakhir: r.masuk,
        segmen: 'Baru',
      });
    }
  }
  const namaRombongan = new Set<string>(ROMBONGAN.map((g) => g[0]));
  const tamu = [...peta.values()].map((t) => ({
    ...t,
    segmen: (namaRombongan.has(t.nama)
      ? 'Rombongan'
      : t.menginap > 1
        ? 'Berulang'
        : 'Baru') as Tamu['segmen'],
  }));
  tamu.sort((a, b) => b.belanja - a.belanja);

  /* ---- inventory, occupancy counted on tonight ---- */
  const inventaris: BarisInventaris[] = varian.map(({ unit, v }) => ({
    sku: v.sku,
    unitSlug: unit.slug,
    unitNama: unit.name,
    struktur: unit.structure,
    kapasitas: v.capacity,
    view: v.view,
    viewLabel: VIEW_LABEL[v.view],
    harga: v.price,
    hargaAkhirPekan: v.weekendPrice,
    stok: v.stock,
    teras: unit.terrace,
    kamarMandi: unit.bathroom === 'dalam' ? 'Dalam' : 'Bersama',
    terisi: reservasi.filter(
      (r) => r.sku === v.sku && r.status !== 'batal' && r.masuk <= todayIso && r.keluar > todayIso,
    ).length,
  }));

  return { hariIni: todayIso, reservasi, tamu, inventaris, totalUnit };
}

/* ------------------------------------------------------------------ shared derivations */

/** Reservations that occupy the night starting on `hari`. Check out day is NOT occupied. */
export function menginapPada(list: Reservasi[], hari: string): Reservasi[] {
  return list.filter((r) => r.status !== 'batal' && r.masuk <= hari && r.keluar > hari);
}

export function masukPada(list: Reservasi[], hari: string): Reservasi[] {
  return list.filter((r) => r.status !== 'batal' && r.masuk === hari);
}

export function keluarPada(list: Reservasi[], hari: string): Reservasi[] {
  return list.filter((r) => r.status !== 'batal' && r.keluar === hari);
}

export function sisaTagihan(r: Reservasi): number {
  return Math.max(0, r.total - r.dibayar);
}

/**
 * The guest the demo guest portal is signed in as.
 *
 * Preference order matters for the demo: a guest who has BOTH a stay ahead of them and one
 * behind them shows the portal doing its actual job, upcoming and history side by side. Falling
 * back to whoever has an upcoming stay, and only then to the top spender, means the screen is
 * never empty no matter how the deterministic spread lands.
 */
export function tamuPortal(data: DataPanel): Tamu {
  const punya = (nama: string, arah: 'depan' | 'lalu') =>
    data.reservasi.some((r) =>
      r.tamu === nama && (arah === 'depan' ? r.keluar >= data.hariIni : r.keluar < data.hariIni),
    );
  const keduanya = data.tamu.filter((t) => punya(t.nama, 'depan') && punya(t.nama, 'lalu'));
  const adaDepan = data.tamu.filter((t) => punya(t.nama, 'depan'));
  return keduanya[0] ?? adaDepan[0] ?? data.tamu[0]!;
}
