import type { PackageItem } from './types';

/**
 * Five packages, one per audience in BRAND.md section 2.
 *
 * Weekday packages exist because Monday to Thursday inventory is what pays the operating
 * cost. That is also why the corporate and school rates are per head and gated on a minimum.
 */
export const packages: PackageItem[] = [
  {
    slug: 'senja-berdua',
    name: 'Senja Berdua',
    audience: 'Pasangan, anniversary, bulan madu singkat',
    tagline: 'Satu malam di kabin yang menghadap barat, dengan makan malam di dek sendiri.',
    description:
      'Paket ini dibangun di sekitar satu jam saja, yaitu jam setengah enam sore, dan sisanya diatur supaya Anda berdua tidak perlu ke mana mana pada jam itu. Makan malam diantar ke dek, bak rendam diisi air panas sebelum matahari turun, dan sarapan besoknya juga diantar, jadi tidak ada alasan untuk pindah dari dek sampai check out jam dua siang.\n\nKami tidak memasang dekorasi berlebihan. Yang disiapkan adalah lampu gantung hangat di sepanjang pagar dek, bunga potong lokal di meja, dan kartu tulisan tangan. Kalau Anda ingin sesuatu yang lebih besar, misalnya lamaran, ambil paket Momen Spesial.',
    duration: '2 hari 1 malam',
    priceUnit: 'paket',
    price: 3450000,
    priceNote: 'Untuk 2 orang. Tambah Rp 400.000 untuk menginap Jumat, Sabtu, atau libur nasional.',
    inclusions: [
      'Menginap 1 malam di Kabin Lembayung, varian 2 pax lembah',
      'Makan malam 3 hidangan diantar ke dek',
      'Bak rendam kayu diisi air panas jam 17.00',
      'Lampu gantung hangat dan bunga potong lokal di dek',
      'Kartu ucapan tulisan tangan',
      'Sarapan untuk 2 orang, diantar ke dek',
      'Check out lambat sampai 14.00',
      'Kopi biji dan penggiling di dalam kabin',
    ],
    exclusions: [
      'Transportasi ke dan dari properti',
      'Kue ulang tahun, bisa ditambah Rp 250.000',
      'Fotografer, bisa ditambah Rp 800.000 untuk 2 jam',
      'Makan siang di hari kedua',
    ],
    image: {
      path: '/img/packages/senja-berdua.jpg',
      alt: 'Meja makan malam untuk dua orang di dek Kabin Lembayung dengan lampu gantung hangat dan langit senja ungu',
      kind: 'dek',
    },
    relatedUnits: ['kabin-lembayung'],
  },

  {
    slug: 'akhir-pekan-keluarga',
    name: 'Akhir Pekan Keluarga',
    audience: 'Keluarga dengan anak usia 4 sampai 12 tahun',
    tagline: 'Satu kabin, satu api unggun, dan dua kegiatan yang membuat anak tidur cepat.',
    description:
      'Yang membuat akhir pekan keluarga berhasil atau gagal adalah apakah anak punya sesuatu untuk dikerjakan. Paket ini mengisi dua slot: panahan sore sebelum api unggun, dan trekking pagi jam enam yang berakhir dengan sarapan di puncak.\n\nAnak di bawah 6 tahun tidak dihitung dan tidak dikenakan biaya extra bed. Kami sediakan kasur lipat dan selimut tambahan tanpa diminta, karena hampir semua keluarga membutuhkannya dan menanyakannya di malam hari saat suhu sudah 15 derajat.\n\nMarshmallow dan jagung bakar untuk api unggun sudah termasuk. Kalau anak Anda tidak suka keduanya, bilang saat check in dan kami ganti dengan pisang bakar.',
    duration: '2 hari 1 malam',
    priceUnit: 'paket',
    price: 2650000,
    priceNote: 'Untuk 4 orang. Anak di bawah 6 tahun gratis. Tambah Rp 350.000 untuk Jumat, Sabtu, atau libur nasional.',
    inclusions: [
      'Menginap 1 malam di Kabin Pinus, varian 4 pax',
      'Sarapan untuk 4 orang',
      'Api unggun sore dengan marshmallow dan jagung bakar',
      'Satu sesi panahan untuk 4 orang, dengan instruktur',
      'Trekking pagi Bukit Kabut dengan pemandu, plus sarapan kopi di puncak',
      'Extra bed dan selimut untuk anak di bawah 6 tahun',
      'Akses kebun petik stroberi, hasil petikan dibayar terpisah',
      'Parkir 1 mobil',
    ],
    exclusions: [
      'Makan siang dan makan malam, tersedia di Dapur Bara',
      'Hasil petikan stroberi, sekitar Rp 45.000 per keranjang',
      'Bak rendam kayu air hangat, Rp 150.000 per sesi',
      'Transportasi',
    ],
    image: {
      path: '/img/packages/akhir-pekan-keluarga.jpg',
      alt: 'Keluarga Indonesia duduk mengelilingi api unggun di Lembayung, anak anak memanggang marshmallow saat senja',
      kind: 'dek',
    },
    relatedUnits: ['kabin-pinus', 'dome-senja'],
  },

  {
    slug: 'gathering-kantor',
    name: 'Gathering Kantor',
    audience: 'HR, GA, dan panitia gathering perusahaan',
    tagline: 'Dua hari kerja di luar kantor, dengan aula yang tetap terpakai kalau hujan.',
    description:
      'Paket weekday untuk rombongan minimal 30 orang. Rombongan menginap di Lodge Rimba, panitia dan pembicara di Kabin Pinus, dan sesi berlangsung di Aula Lembah yang beratap dan berdinding setengah terbuka. Aula itu penting: Lembang hujan sore hampir setiap hari antara November dan Maret, dan rundown yang bergantung pada cuaca akan berantakan.\n\nFasilitator outbound kami menangani sesi pagi hari kedua, enam pos di lereng dan sekitar embung, dengan durasi total tiga jam. Kalau perusahaan Anda membawa fasilitator sendiri, harga per orang turun Rp 120.000 dan kami hanya menyiapkan lokasi serta peralatan.\n\nSurat penawaran resmi dengan rincian per item kami kirim dalam satu hari kerja. Sebutkan jumlah peserta dan tanggal, dan kami balas dengan ketersediaan sebelum Anda menyusun proposal internal.',
    duration: '2 hari 1 malam',
    priceUnit: 'orang',
    price: 850000,
    priceNote: 'Minimum 30 peserta. Hanya Minggu sampai Kamis. Sudah termasuk pajak.',
    inclusions: [
      'Menginap 1 malam, Lodge Rimba untuk peserta dan Kabin Pinus untuk panitia',
      'Aula Lembah kapasitas 80, beratap, dengan sound dan proyektor',
      'Makan 3 kali, plus 2 coffee break',
      'Fasilitator outbound dan 6 pos permainan, total 3 jam',
      'Api unggun malam dengan sound untuk sesi bebas',
      'Spanduk selamat datang dengan nama perusahaan',
      'Parkir bus dan mobil',
      'Surat penawaran resmi dalam 1 hari kerja',
    ],
    exclusions: [
      'Transportasi peserta',
      'Sewa alat khusus di luar 6 pos standar',
      'Konsumsi tambahan di luar rundown',
      'Dokumentasi foto dan video, bisa ditambah Rp 2.500.000',
    ],
    image: {
      path: '/img/packages/gathering-kantor.jpg',
      alt: 'Peserta gathering kantor mengikuti sesi di Aula Lembah Lembayung yang beratap dengan dinding setengah terbuka',
      kind: 'interior',
    },
    relatedUnits: ['lodge-rimba', 'kabin-pinus'],
  },

  {
    slug: 'outbound-sekolah',
    name: 'Outbound Sekolah',
    audience: 'Guru, panitia study tour, dan sekolah dasar sampai menengah',
    tagline: 'Enam pos, instruktur bersertifikat, dan ambulans siaga di lokasi.',
    description:
      'Paket ini disusun bersama dua sekolah di Bandung yang rutin membawa siswa ke sini, dan urutannya sudah diuji: kedatangan dan orientasi, enam pos permainan di lereng, makan siang, modul hutan pinus, lalu api unggun dan malam keakraban.\n\nRasio instruktur satu banding dua belas siswa, semuanya bersertifikat, dan setiap pos punya satu pendamping. Ada satu tim P3K di lokasi sepanjang acara dan satu ambulans siaga di area parkir, bukan on call dari luar. Kami menuliskan ini karena ini pertanyaan pertama setiap kepala sekolah.\n\nModul hutan pinus adalah sesi 60 menit tentang fungsi tegakan pinus di lereng, erosi, dan tata air. Bukan ceramah, siswa mengukur sendiri kemiringan dan menghitung jarak tanam. Guru mendapat lembar kerja siap cetak sebelum keberangkatan.',
    duration: '2 hari 1 malam, tersedia juga 1 hari tanpa menginap',
    priceUnit: 'siswa',
    price: 385000,
    priceNote: 'Minimum 40 siswa. Hanya Senin sampai Kamis. Guru pendamping gratis, 1 per 15 siswa.',
    inclusions: [
      'Menginap 1 malam di Lodge Rimba dan area kemah',
      'Makan 3 kali plus 1 snack',
      '6 pos permainan dengan instruktur bersertifikat, rasio 1 banding 12',
      'Modul edukasi hutan pinus 60 menit, dengan lembar kerja siap cetak',
      'Api unggun dan malam keakraban',
      'Tim P3K di lokasi dan ambulans siaga di area parkir',
      'Asuransi kecelakaan diri untuk seluruh peserta',
      'Guru pendamping gratis, 1 per 15 siswa',
    ],
    exclusions: [
      'Transportasi sekolah',
      'Kaos atau atribut kegiatan',
      'Dokumentasi',
      'Biaya tambahan untuk peserta di luar kuota gratis guru',
    ],
    image: {
      path: '/img/packages/outbound-sekolah.jpg',
      alt: 'Siswa sekolah Indonesia mengikuti pos permainan tali di lereng pinus Lembayung didampingi instruktur',
      kind: 'eksterior',
    },
    relatedUnits: ['lodge-rimba'],
  },

  {
    slug: 'momen-spesial',
    name: 'Momen Spesial',
    audience: 'Lamaran, ulang tahun, syukuran kecil',
    tagline: 'Dek barat disiapkan untuk satu momen, tepat pada jam senja.',
    description:
      'Untuk lamaran, ulang tahun, atau syukuran kecil sampai 10 orang. Lokasinya di dek barat Kabin Lembayung atau di titik pandang Plaza Bara, tergantung berapa orang yang datang dan seberapa rahasia acaranya.\n\nSetup dimulai jam tiga sore dan selesai jam lima, jadi jam setengah enam semua sudah siap dan tidak ada tim kami yang terlihat di sekitar lokasi. Kalau ini kejutan, beri tahu kami siapa yang tidak boleh tahu, dan kami akan mengarahkan orangnya ke kegiatan lain sampai waktunya.\n\nFotografer dua jam sudah termasuk. Kami pakai fotografer lokal Lembang yang sudah hafal titik dan jam terbaiknya, dan hasilnya dikirim dalam tiga hari kerja.',
    duration: 'Setengah hari, bisa ditambah menginap 1 malam',
    priceUnit: 'paket',
    price: 4200000,
    priceNote: 'Sampai 10 orang. Tambah Rp 1.950.000 untuk menginap 1 malam di Kabin Lembayung.',
    inclusions: [
      'Setup dekorasi di dek barat atau titik pandang Plaza Bara',
      'Rangkaian bunga potong lokal dan lampu gantung hangat',
      'Kue ukuran 20 sentimeter dengan tulisan sesuai permintaan',
      'Fotografer lokal 2 jam, hasil dikirim dalam 3 hari kerja',
      'Sound sederhana untuk musik latar',
      'Minuman hangat dan camilan untuk 10 orang',
      'Api unggun di Plaza Bara setelah acara',
      'Koordinasi kejutan, kami arahkan orang yang tidak boleh tahu',
    ],
    exclusions: [
      'Menginap, bisa ditambah',
      'Makan malam penuh, bisa ditambah Rp 165.000 per orang',
      'Videografer',
      'Dekorasi skala besar seperti panggung atau tenda acara',
    ],
    image: {
      path: '/img/packages/momen-spesial.jpg',
      alt: 'Setup dekorasi lamaran di dek barat Lembayung dengan bunga potong dan lampu gantung menghadap lembah senja',
      kind: 'dek',
    },
    relatedUnits: ['kabin-lembayung'],
  },
];

export function packageBySlug(slug: string): PackageItem | undefined {
  return packages.find((p) => p.slug === slug);
}
