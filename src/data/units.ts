import type { Unit } from './types';

/**
 * The six unit types.
 *
 * R42 lives in this file. `name` is the STRUCTURE. Capacity and view are variant
 * dimensions in `variants`. Read the doc comment on `Unit` in types.ts before editing.
 *
 * R41 depth: six types, four images each, fifteen bookable variants between them.
 * Rates are set inside the real Lembang band of about Rp 450.000 to Rp 3.000.000,
 * researched July 2026 and recorded in BRAND.md section 1.2.
 */
export const units: Unit[] = [
  {
    slug: 'dome-senja',
    name: 'Dome Senja',
    structure: 'Dome geodesik 5 meter di atas dek kayu ulin, panel atap transparan',
    tagline: 'Kubah dengan panel bening di puncaknya. Kalau langit bersih, itu langit kamar Anda.',
    story:
      'Dome Senja berdiri di Teras 2, deretan enam kubah yang saling membelakangi supaya tidak ada dek yang mengintip dek tetangga. Rangkanya baja ringan berlapis kanvas dua lapis, jadi di dalam tetap 4 sampai 5 derajat lebih hangat daripada di luar tanpa pemanas.\n\nBagian yang membuat orang memesan ulang adalah panel bening selebar 1,2 meter di puncak kubah. Dari kasur, yang terlihat adalah kanopi pinus dan langit. Pada malam cerah antara Juni dan September, rasi bintang terbaca jelas dari dalam selimut.\n\nDome adalah pilihan paling terjangkau di Lembayung yang tetap punya kamar mandi dalam dengan air panas. Ini unit yang paling sering dipesan pasangan untuk semalam.',
    notFor:
      'Kurang cocok untuk balita. Lantainya satu tingkat dengan dek dan kanvas tidak meredam suara, jadi tangis satu dome terdengar sampai dome sebelah.',
    sizeM2: 24,
    terrace: 2,
    bedding: '1 kasur queen 160x200, tambahan sofa bed 120x190 pada varian 4 pax',
    bathroom: 'dalam',
    facilities: [
      'Kamar mandi dalam, air panas 24 jam',
      'Panel atap transparan 1,2 meter',
      'Pemanas listrik 600 watt',
      'Selimut wol ekstra dan botol air panas',
      'Dek kayu pribadi dengan 2 kursi kayu',
      'Colokan 4 titik, listrik 900 watt',
      'WiFi, kuat di dalam dome',
      'Sarapan untuk semua tamu terdaftar',
    ],
    gallery: [
      {
        path: '/img/units/dome-senja-eksterior.jpg',
        alt: 'Dome geodesik Lembayung di teras kedua saat senja, langit ungu jingga di atas lembah',
        kind: 'eksterior',
      },
      {
        path: '/img/units/dome-senja-interior.jpg',
        alt: 'Bagian dalam Dome Senja dengan kasur queen dan panel atap transparan yang menampilkan kanopi pinus',
        kind: 'interior',
      },
      {
        path: '/img/units/dome-senja-dek.jpg',
        alt: 'Dek kayu di depan Dome Senja dengan dua kursi kayu menghadap lembah pagi berkabut',
        kind: 'dek',
      },
      {
        path: '/img/units/dome-senja-detail.jpg',
        alt: 'Detail panel atap transparan Dome Senja dilihat dari kasur pada malam berbintang',
        kind: 'detail',
      },
    ],
    variants: [
      { sku: 'LMB-DS-2H', capacity: 2, view: 'hutan', price: 850000, weekendPrice: 1150000, imageIndex: 0, stock: 3 },
      { sku: 'LMB-DS-2L', capacity: 2, view: 'lembah', price: 950000, weekendPrice: 1290000, imageIndex: 2, stock: 2 },
      { sku: 'LMB-DS-4L', capacity: 4, view: 'lembah', price: 1250000, weekendPrice: 1650000, imageIndex: 1, stock: 1 },
    ],
  },

  {
    slug: 'kabin-pinus',
    name: 'Kabin Pinus',
    structure: 'Kabin kayu A frame dua lantai dengan mezanin, 32 meter persegi',
    tagline: 'Bawah untuk orang tua, mezanin untuk anak. Tangga kayunya jadi bagian liburan.',
    story:
      'Kabin Pinus adalah unit keluarga di Lembayung. Bentuknya A frame, dinding kayu pinus lokal dari Subang, dengan mezanin di atas yang dicapai lewat tangga kayu selebar 70 sentimeter. Anak anak selalu memilih mezanin dan orang tua selalu lega karena ada pembatas setinggi 90 sentimeter di sisi terbuka.\n\nDi lantai bawah ada kasur queen, meja kecil, dan pintu kaca lebar yang membuka ke dek. Kalau hujan, pintu itu ditutup dan kabin tetap terang karena jendela atapnya menghadap timur.\n\nEnam kabin berdiri di Teras 3, jarak 8 meter satu sama lain, dengan jalur batu di antaranya. Ini unit yang paling banyak dipesan pada libur sekolah, jadi untuk akhir pekan panjang sebaiknya pesan tiga minggu sebelumnya.',
    notFor:
      'Tangga ke mezanin cukup curam. Kalau ada tamu lansia atau yang sulit naik tangga, ambil varian 4 pax dan pakai lantai bawah saja, atau pilih Lodge Rimba yang satu lantai.',
    sizeM2: 32,
    terrace: 3,
    bedding: '1 kasur queen 160x200 di lantai bawah, 2 kasur single 90x200 di mezanin, tambahan 1 single pada varian 6 pax',
    bathroom: 'dalam',
    facilities: [
      'Kamar mandi dalam, air panas 24 jam',
      'Mezanin dengan pembatas 90 sentimeter',
      'Pintu kaca lebar ke dek',
      'Pemanas listrik 800 watt',
      'Teko listrik, kopi dan teh',
      'Dek kayu dengan meja dan 4 kursi',
      'Colokan 6 titik, listrik 1.300 watt',
      'Extra bed anak di bawah 6 tahun gratis',
    ],
    gallery: [
      {
        path: '/img/units/kabin-pinus-eksterior.jpg',
        alt: 'Kabin kayu A frame Lembayung di antara pohon pinus pada pagi berkabut',
        kind: 'eksterior',
      },
      {
        path: '/img/units/kabin-pinus-interior.jpg',
        alt: 'Interior Kabin Pinus dengan kasur queen di lantai bawah dan tangga kayu menuju mezanin',
        kind: 'interior',
      },
      {
        path: '/img/units/kabin-pinus-dek.jpg',
        alt: 'Dek Kabin Pinus dengan meja dan empat kursi kayu, lembah pinus di latar belakang',
        kind: 'dek',
      },
      {
        path: '/img/units/kabin-pinus-detail.jpg',
        alt: 'Detail mezanin Kabin Pinus dengan dua kasur single dan jendela atap menghadap timur',
        kind: 'detail',
      },
    ],
    variants: [
      { sku: 'LMB-KP-4H', capacity: 4, view: 'hutan', price: 1150000, weekendPrice: 1480000, imageIndex: 0, stock: 3 },
      { sku: 'LMB-KP-4L', capacity: 4, view: 'lembah', price: 1350000, weekendPrice: 1720000, imageIndex: 2, stock: 2 },
      { sku: 'LMB-KP-6H', capacity: 6, view: 'hutan', price: 1650000, weekendPrice: 2100000, imageIndex: 3, stock: 1 },
    ],
  },

  {
    slug: 'tenda-bara',
    name: 'Tenda Bara',
    structure: 'Bell tent kanvas 5 meter dengan lingkar api unggun pribadi di depan pintu',
    tagline: 'Satu satunya unit dengan api unggun sendiri. Kayunya sudah disiapkan tiap sore.',
    story:
      'Tenda Bara berdiri di Teras 1, paling dekat dengan hutan pinus dan paling jauh dari jalan masuk, jadi ini bagian properti yang paling sunyi. Tendanya kanvas katun 320 gram dengan tiang tengah kayu, tipe bell tent, dan lantainya kayu yang diangkat 20 sentimeter dari tanah supaya kering saat hujan.\n\nYang membedakannya adalah lingkar batu di depan pintu. Setiap sore jam lima, tim kami menaruh kayu bakar kering dan pemantik di sana. Tamu menyalakan sendiri kapan pun mau, tidak perlu ikut api unggun komunal di Plaza Bara kalau ingin sendirian.\n\nKamar mandinya di luar, blok bersama berjarak 30 meter, empat bilik dengan air panas. Itu sebabnya harganya paling terjangkau di Lembayung.',
    notFor:
      'Kamar mandi ada di luar, 30 meter berjalan kaki. Kalau Anda tidak ingin keluar tenda tengah malam saat 15 derajat, ambil Dome Senja yang kamar mandinya di dalam.',
    sizeM2: 19,
    terrace: 1,
    bedding: '1 kasur queen 160x200, tambahan 2 kasur lipat 90x190 pada varian 4 pax',
    bathroom: 'luar',
    facilities: [
      'Api unggun pribadi, kayu disiapkan setiap sore',
      'Kamar mandi bersama 30 meter, air panas',
      'Lantai kayu terangkat, kering saat hujan',
      'Kanvas katun 320 gram, tiang kayu',
      'Lampu gantung dan lampu badai',
      'Selimut wol ekstra dan botol air panas',
      'Colokan 2 titik',
      'Paling dekat dengan jalur trekking pagi',
    ],
    gallery: [
      {
        path: '/img/units/tenda-bara-eksterior.jpg',
        alt: 'Bell tent kanvas Lembayung di tepi hutan pinus dengan lingkar api unggun batu di depan pintu',
        kind: 'eksterior',
      },
      {
        path: '/img/units/tenda-bara-interior.jpg',
        alt: 'Interior Tenda Bara dengan kasur queen, tiang kayu tengah, dan lampu badai menyala',
        kind: 'interior',
      },
      {
        path: '/img/units/tenda-bara-dek.jpg',
        alt: 'Api unggun pribadi menyala di depan Tenda Bara saat langit senja berubah ungu',
        kind: 'dek',
      },
      {
        path: '/img/units/tenda-bara-detail.jpg',
        alt: 'Detail tali pancang dan kanvas Tenda Bara dengan embun pagi di permukaannya',
        kind: 'detail',
      },
    ],
    variants: [
      { sku: 'LMB-TB-2H', capacity: 2, view: 'hutan', price: 750000, weekendPrice: 990000, imageIndex: 0, stock: 4 },
      { sku: 'LMB-TB-4H', capacity: 4, view: 'hutan', price: 1050000, weekendPrice: 1380000, imageIndex: 1, stock: 2 },
    ],
  },

  {
    slug: 'kabin-lembayung',
    name: 'Kabin Lembayung',
    structure: 'Kabin kayu 38 meter persegi dengan dek barat sepanjang fasad dan bak rendam luar',
    tagline: 'Unit yang namanya sama dengan nama tempat ini, karena deknya menghadap persis ke senja.',
    story:
      'Ada dua Kabin Lembayung, keduanya di Teras 4, dan keduanya menghadap lurus ke barat. Deknya membentang di seluruh sisi depan, 9 meter, dengan bak rendam kayu di ujung selatan yang diisi air panas atas permintaan.\n\nJam setengah enam sore, matahari lewat di atas punggung bukit sebelah barat dan lembah ke arah Bandung berubah jingga lalu ungu. Dari dek ini pemandangan itu tidak terhalang apa pun. Itu satu satunya alasan kabin ini dibangun di titik tersebut, dan alasan harganya paling tinggi.\n\nDi dalam, dinding kayu jati belanda, kasur king, perapian listrik, dan jendela kaca setinggi lantai sampai plafon di sisi barat. Kalau hujan, pemandangannya tetap sama, hanya lebih kelabu.',
    notFor:
      'Ini unit paling mahal dan tidak punya ruang ekstra untuk rombongan. Kalau butuh kapasitas, Lodge Rimba jauh lebih masuk akal per orangnya.',
    sizeM2: 38,
    terrace: 4,
    bedding: '1 kasur king 180x200, tambahan sofa bed 140x190 pada varian 4 pax',
    bathroom: 'dalam',
    facilities: [
      'Dek barat 9 meter menghadap lembah',
      'Bak rendam kayu luar, air panas atas permintaan',
      'Jendela kaca penuh sisi barat',
      'Perapian listrik dan pemanas 1.200 watt',
      'Kamar mandi dalam dengan pancuran hujan',
      'Teko listrik, kopi biji dan penggiling',
      'Sarapan diantar ke dek',
      'Check out lambat sampai 14.00',
    ],
    gallery: [
      {
        path: '/img/units/kabin-lembayung-eksterior.jpg',
        alt: 'Kabin Lembayung dengan dek kayu panjang menghadap barat saat matahari turun di balik punggung bukit',
        kind: 'eksterior',
      },
      {
        path: '/img/units/kabin-lembayung-interior.jpg',
        alt: 'Interior Kabin Lembayung dengan kasur king dan jendela kaca penuh menghadap lembah',
        kind: 'interior',
      },
      {
        path: '/img/units/kabin-lembayung-dek.jpg',
        alt: 'Bak rendam kayu di ujung dek Kabin Lembayung dengan uap air panas dan langit ungu jingga',
        kind: 'dek',
      },
      {
        path: '/img/units/kabin-lembayung-detail.jpg',
        alt: 'Detail sudut dek Kabin Lembayung dengan dua mug enamel dan selimut wol di kursi kayu',
        kind: 'detail',
      },
    ],
    variants: [
      { sku: 'LMB-KL-2L', capacity: 2, view: 'lembah', price: 1950000, weekendPrice: 2450000, imageIndex: 0, stock: 2 },
      { sku: 'LMB-KL-4L', capacity: 4, view: 'lembah', price: 2450000, weekendPrice: 3050000, imageIndex: 1, stock: 1 },
    ],
  },

  {
    slug: 'rumah-kanopi',
    name: 'Rumah Kanopi',
    structure: 'Rumah panggung kayu 28 meter persegi, 3,5 meter di atas tanah, di antara empat batang pinus',
    tagline: 'Dibangun di antara empat pohon, bukan menempel di satu pohon. Tidak ada paku di batangnya.',
    story:
      'Rumah Kanopi berdiri di atas empat tiang beton yang dicor di antara empat pinus dewasa, bukan diikatkan ke pohonnya. Ini penting dan kami menjelaskannya kepada setiap tamu yang bertanya: pohon yang dipaku akan mati dalam beberapa tahun, dan pinus di lereng ini yang menahan tanahnya.\n\nAksesnya lewat jembatan kayu sepanjang 11 meter dari sisi tinggi Teras 1, jadi tidak ada tangga curam yang harus dipanjat. Dari dalam, jendela di tiga sisi berada tepat di ketinggian kanopi, dan pagi hari kabut lewat di depan jendela itu, bukan di bawahnya.\n\nDua unit, keduanya menghadap ke dalam hutan. Ini unit paling tenang di properti dan yang paling sering dipesan orang yang datang untuk bekerja jarak jauh sehari dua hari.',
    notFor:
      'Tidak menghadap lembah, jadi senjanya harus dinikmati dari Plaza Bara, bukan dari jendela. Untuk pemandangan matahari terbenam dari kamar, ambil Kabin Lembayung.',
    sizeM2: 28,
    terrace: 1,
    bedding: '1 kasur queen 160x200, tambahan 2 kasur single 90x200 pada varian 4 pax',
    bathroom: 'dalam',
    facilities: [
      'Jembatan kayu 11 meter, tanpa tangga curam',
      'Jendela tiga sisi setinggi kanopi',
      'Kamar mandi dalam, air panas 24 jam',
      'Meja kerja menghadap jendela',
      'WiFi paling stabil di properti',
      'Pemanas listrik 800 watt',
      'Colokan 6 titik, listrik 1.300 watt',
      'Unit paling sunyi, jauh dari Plaza Bara',
    ],
    gallery: [
      {
        path: '/img/units/rumah-kanopi-eksterior.jpg',
        alt: 'Rumah panggung kayu Lembayung berdiri di antara empat batang pinus dengan jembatan kayu menuju pintunya',
        kind: 'eksterior',
      },
      {
        path: '/img/units/rumah-kanopi-interior.jpg',
        alt: 'Interior Rumah Kanopi dengan meja kerja kayu menghadap jendela dan kanopi pinus di luar',
        kind: 'interior',
      },
      {
        path: '/img/units/rumah-kanopi-dek.jpg',
        alt: 'Jembatan kayu menuju Rumah Kanopi pada pagi hari dengan kabut melewati ketinggian kanopi',
        kind: 'dek',
      },
      {
        path: '/img/units/rumah-kanopi-detail.jpg',
        alt: 'Detail tiang beton Rumah Kanopi yang berdiri terpisah dari batang pinus di sekitarnya',
        kind: 'detail',
      },
    ],
    variants: [
      { sku: 'LMB-RK-2H', capacity: 2, view: 'hutan', price: 1450000, weekendPrice: 1850000, imageIndex: 0, stock: 2 },
      { sku: 'LMB-RK-4H', capacity: 4, view: 'hutan', price: 1750000, weekendPrice: 2200000, imageIndex: 1, stock: 1 },
    ],
  },

  {
    slug: 'lodge-rimba',
    name: 'Lodge Rimba',
    structure: 'Lodge kayu memanjang satu lantai, 96 meter persegi, kamar bunk dan ruang kumpul',
    tagline: 'Untuk rombongan yang tidur di satu atap dan rapat di ruang yang sama.',
    story:
      'Lodge Rimba ada di Teras 5, terendah dan terdekat dengan embung serta Plaza Bara. Bangunannya satu lantai memanjang, dibagi jadi kamar bunk, satu ruang kumpul dengan meja panjang, dan blok kamar mandi empat bilik dengan air panas.\n\nSemua satu lantai dan tanpa anak tangga, jadi rombongan sekolah, tamu lansia, dan siapa pun yang membawa banyak barang tidak perlu naik turun teras. Jalur dari parkir ke Lodge sudah dicor, cukup untuk troli.\n\nRuang kumpulnya muat 20 orang duduk dan sudah ada colokan di sepanjang meja, proyektor bisa dipasang atas permintaan. Sebagian besar gathering kantor dan outbound sekolah menginap di sini, sementara panitia dan pembicara biasanya diletakkan di Kabin Pinus.',
    notFor:
      'Ini unit rombongan. Untuk dua orang, harga per malamnya tidak masuk akal dan suasananya bukan suasana berdua. Ambil Dome Senja atau Tenda Bara.',
    sizeM2: 96,
    terrace: 5,
    bedding: 'Kasur bunk 90x200, jumlah menyesuaikan varian, plus 2 kasur single di kamar panitia',
    bathroom: 'dalam',
    facilities: [
      'Satu lantai, tanpa anak tangga',
      'Ruang kumpul meja panjang, muat 20 orang duduk',
      'Blok kamar mandi 4 bilik, air panas',
      'Colokan sepanjang meja kumpul',
      'Proyektor dan layar atas permintaan',
      'Paling dekat dengan Plaza Bara dan Aula Lembah',
      'Jalur cor dari parkir, bisa dilewati troli',
      'Listrik 3.500 watt',
    ],
    gallery: [
      {
        path: '/img/units/lodge-rimba-eksterior.jpg',
        alt: 'Lodge kayu memanjang Lembayung di teras terendah dekat embung pada sore hari',
        kind: 'eksterior',
      },
      {
        path: '/img/units/lodge-rimba-interior.jpg',
        alt: 'Kamar bunk Lodge Rimba dengan deretan tempat tidur susun kayu dan selimut wol terlipat',
        kind: 'interior',
      },
      {
        path: '/img/units/lodge-rimba-dek.jpg',
        alt: 'Ruang kumpul Lodge Rimba dengan meja panjang kayu dan rombongan sedang duduk mengobrol',
        kind: 'dek',
      },
      {
        path: '/img/units/lodge-rimba-detail.jpg',
        alt: 'Detail meja panjang Lodge Rimba dengan colokan tertanam dan mug kopi di sepanjang permukaannya',
        kind: 'detail',
      },
    ],
    variants: [
      { sku: 'LMB-LR-8D', capacity: 8, view: 'danau', price: 2800000, weekendPrice: 3400000, imageIndex: 0, stock: 2 },
      { sku: 'LMB-LR-12D', capacity: 12, view: 'danau', price: 3900000, weekendPrice: 4700000, imageIndex: 1, stock: 1 },
      { sku: 'LMB-LR-20D', capacity: 20, view: 'danau', price: 6200000, weekendPrice: 7400000, imageIndex: 2, stock: 1 },
    ],
  },
];

/** Lowest weekday rate across all variants of a unit. Drives the `mulai dari` label. */
export function startingPrice(unit: Unit): number {
  return Math.min(...unit.variants.map((v) => v.price));
}

/** Distinct capacities offered by a unit, ascending. Feeds the listing filter chips. */
export function capacities(unit: Unit): number[] {
  return [...new Set(unit.variants.map((v) => v.capacity))].sort((a, b) => a - b);
}

export function unitBySlug(slug: string): Unit | undefined {
  return units.find((u) => u.slug === slug);
}
