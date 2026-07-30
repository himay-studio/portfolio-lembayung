import type { Testimonial } from './types';

/**
 * Site wide configuration, contact, location, operating details and testimonials.
 *
 * Stage 3 reads `site` for the header, footer, contact page and metadata. Stage 4 reads
 * `operations` for the reservation panel. Do not hard code any of these values in a page.
 */
export const site = {
  slug: 'lembayung',
  name: 'Lembayung',
  /** Full lockup. The category line is separate, see the R50 note below. */
  lockup: 'Lembayung, Glamping & Kabin Dataran Tinggi',
  /**
   * Rendered as its OWN block level element under the wordmark, never as an inline sibling.
   * R50: an inline `<small>` here renders as `LembayungLEMBANG, BANDUNG UTARA`.
   */
  categoryLine: 'LEMBANG, BANDUNG UTARA',
  tagline: 'Tidur di ketinggian, bangun di atas kabut.',
  promise:
    'Satu jam dari Bandung, tujuh belas derajat, dan langit yang berubah ungu tepat jam setengah enam.',
  description:
    'Glamping dan kabin kayu di lereng hutan pinus Cikole, Lembang. Enam tipe unit di lima teras, menghadap lembah Bandung. Api unggun setiap sore jam 17.30.',

  /** R26 and R40: the custom domain is the public URL. The pages.dev URL is never quoted. */
  url: 'https://portfolio-lembayung.himaystudio.com',
  /**
   * R35: this is a fictional demo brand with no real client site, so the portfolio
   * self canonicals. Leave this null. Set it ONLY for a live paying client whose real
   * site is up, otherwise Google penalises them for duplicate content.
   */
  clientDomain: null as string | null,

  /** R35(a). No em dash or en dash, R11. */
  metaTitle: 'Lembayung - Portfolio Website by Himay Studio',
  metaDescription:
    'Live preview website Lembayung. Proyek pembuatan website profesional oleh Himay Studio. Ingin buat web seperti ini? Hubungi kami.',

  /**
   * R14: every sales CTA routes to Himay Studio WhatsApp, not to the fictional brand.
   * 085772203654 in international format. A 0 prefixed number in wa.me is a dead link.
   */
  himayWhatsapp: '6285772203654',
  himayUrl: 'https://himaystudio.com',

  /** In world contact details, shown on the site. Fictional. */
  contact: {
    whatsapp: '+62 812 2019 4477',
    phone: '(022) 2789 5510',
    email: 'halo@lembayung.id',
    instagram: '@lembayung.id',
    /** Reception desk hours. Night staff cover the rest. */
    receptionHours: '08.00 sampai 22.00, setiap hari',
    responseNote: 'WhatsApp dibalas paling lambat 2 jam pada jam resepsionis.',
  },

  location: {
    address: 'Jalan Kampung Cikole Tonggoh No. 24, Cikole, Lembang, Kabupaten Bandung Barat, Jawa Barat 40391',
    landmark: '1,2 km dari Terminal Wisata Cikole',
    coordinates: { lat: -6.7802, lng: 107.6413 },
    altitudeMdpl: 1300,
    areaHectares: 3.2,
    terraces: 5,
    routes: [
      {
        from: 'Jakarta',
        via: 'Tol Cipularang, keluar Gerbang Tol Pasteur, lalu Jalan Raya Lembang',
        duration: '2,5 sampai 3,5 jam',
        note: 'Hindari berangkat Jumat setelah 15.00 dan Sabtu antara 07.00 dan 10.00.',
      },
      {
        from: 'Bandung',
        via: 'Jalan Dr. Setiabudi, Jalan Raya Lembang, arah Cikole',
        duration: '45 sampai 60 menit',
        note: 'Taksi daring sekitar Rp 150.000 sampai Rp 220.000 tergantung jam.',
      },
      {
        from: 'Bandara Husein Sastranegara',
        via: 'Jalan Dr. Setiabudi lalu Jalan Raya Lembang',
        duration: 'Sekitar 1 jam',
        note: 'Dari Bandara Kertajati sekitar 2,5 jam, jauh lebih lama.',
      },
    ],
    accessNote:
      'Jalan desa beraspal 800 meter, lalu 400 meter terakhir berbatu dan menanjak. Sedan standar bisa lewat pelan pelan, mobil ceper sebaiknya parkir di area bawah dan kami jemput. Bus besar sampai parkir bawah saja.',
  },

  /** Read by the Stage 4 reservation panel. Every number here is also quoted in the FAQ. */
  operations: {
    checkIn: '14.00',
    checkOut: '12.00',
    lateCheckOut: '14.00',
    lateCheckOutFee: 200000,
    /** Day indices that carry the weekend rate. 0 is Sunday. Friday and Saturday. */
    weekendDays: [5, 6],
    minNights: 1,
    /** How far ahead the calendar opens. */
    bookingWindowDays: 180,
    cancellation: [
      { window: 'Lebih dari 14 hari sebelum menginap', refund: '100 persen, dipotong administrasi Rp 100.000' },
      { window: '7 sampai 14 hari sebelum menginap', refund: '50 persen' },
      { window: 'Kurang dari 7 hari', refund: 'Tidak ada pengembalian, boleh pindah tanggal 1 kali dalam 90 hari' },
    ],
    payment: {
      methods: ['Transfer bank', 'Kartu kredit dan debit', 'QRIS'],
      /** Percentage due at booking. The rest on arrival. */
      depositPercent: 50,
      note: 'Tidak ada mesin ATM di properti. Isi bensin dan tarik tunai di Terminal Wisata Cikole.',
    },
    petPolicy: 'Boleh di Tenda Bara dan Kabin Pinus, maksimal 1 ekor, biaya kebersihan Rp 150.000.',
    temperatureRange: '13 sampai 19 derajat Celsius',
    rainySeason: 'November sampai Maret',
    driestSeason: 'Juni sampai September',
  },

  /** Feeds the footer nav and the sitemap. Stage 3 owns the final IA. */
  primaryNav: [
    { label: 'Unit', href: '/unit/' },
    { label: 'Paket', href: '/paket/' },
    { label: 'Kegiatan', href: '/kegiatan/' },
    { label: 'Cerita', href: '/cerita/' },
    { label: 'Lokasi', href: '/lokasi/' },
    { label: 'Tentang', href: '/tentang/' },
  ],
} as const;

/**
 * Testimonials. Each names the unit or package the guest actually stayed in, so the quote
 * can be shown on that unit's page rather than only in a generic wall.
 */
export const testimonials: Testimonial[] = [
  {
    name: 'Aditya Nugroho',
    origin: 'Jakarta Selatan',
    stayed: 'Kabin Lembayung, paket Senja Berdua',
    date: '2026-06-21',
    rating: 5,
    quote:
      'Kami sudah pernah ke beberapa tempat di Lembang dan biasanya pemandangannya bagus untuk lima menit pertama. Di sini deknya benar benar menghadap ke arah yang tepat, dan jam setengah enam itu memang seperti yang mereka bilang. Makan malam diantar tepat waktu dan tidak ada yang mondar mandir di depan kabin.',
  },
  {
    name: 'Sinta Rahmawati',
    origin: 'Bandung',
    stayed: 'Kabin Pinus, varian 4 pax hutan',
    date: '2026-05-30',
    rating: 5,
    quote:
      'Anak saya dua, tujuh dan sepuluh tahun, dan mereka berebut mezanin sejak pintu dibuka. Yang saya hargai, staf jujur bilang jangan ambil dome karena anak saya masih kecil. Vendor lain biasanya bilang semua cocok.',
  },
  {
    name: 'Bayu Setiawan',
    origin: 'Tangerang',
    stayed: 'Tenda Bara, varian 2 pax hutan',
    date: '2026-05-11',
    rating: 4,
    quote:
      'Api unggun sendiri di depan tenda itu nilai jualnya, kayunya sudah disiapkan tiap sore tanpa diminta. Kamar mandi di luar memang agak berat jam dua pagi, tapi itu sudah ditulis jelas di situsnya sebelum saya pesan, jadi bukan kejutan.',
  },
  {
    name: 'Larasati Widodo',
    origin: 'Jakarta Pusat',
    stayed: 'Dome Senja, varian 2 pax lembah',
    date: '2026-04-27',
    rating: 5,
    quote:
      'Datang sendirian untuk kerja tiga hari. Sinyal Telkomsel stabil, panel atapnya membuat saya tidur lebih cepat dari biasanya, dan tidak ada satu pun orang yang mengajak ngobrol basa basi. Persis yang saya cari.',
  },
  {
    name: 'Hendra Wijaya',
    origin: 'Bekasi',
    stayed: 'Lodge Rimba, paket Gathering Kantor',
    date: '2026-03-19',
    rating: 5,
    quote:
      'Rombongan kami 48 orang. Hujan turun jam empat sore persis seperti yang mereka peringatkan, dan sesi tetap jalan di aula tanpa perubahan rundown. Surat penawaran datang sehari setelah saya kirim tanggal, rinciannya per item, jadi mudah dibawa ke bagian keuangan.',
  },
  {
    name: 'Fitri Handayani',
    origin: 'Cimahi',
    stayed: 'Rumah Kanopi, varian 2 pax hutan',
    date: '2026-02-14',
    rating: 5,
    quote:
      'Jembatan kayunya membuat saya tenang karena tidak ada tangga curam. Pagi hari kabut lewat persis di depan jendela, bukan di bawah. Satu catatan, memang tidak kelihatan matahari terbenam dari unit ini, tapi itu sudah dijelaskan di halaman unitnya.',
  },
  {
    name: 'Gunawan Saputra',
    origin: 'Depok',
    stayed: 'Kabin Pinus, paket Akhir Pekan Keluarga',
    date: '2026-01-31',
    rating: 4,
    quote:
      'Panahan sore lalu api unggun lalu trekking pagi, anak saya tidur di mobil sebelum keluar Lembang. Jalan berbatu 400 meter terakhir memang harus pelan, mobil saya bukan SUV, tapi mereka sudah bilang di telepon jadi saya sudah siap.',
  },
  {
    name: 'Ratna Puspita',
    origin: 'Jakarta Barat',
    stayed: 'Kabin Lembayung, paket Momen Spesial',
    date: '2025-12-13',
    rating: 5,
    quote:
      'Lamaran untuk adik saya. Mereka mengatur supaya calonnya diajak ke kebun stroberi sampai setup selesai, dan tidak ada satu pun staf yang terlihat di dek saat waktunya tiba. Foto dari fotografer lokalnya sampai tiga hari kemudian, sesuai janji.',
  },
];
