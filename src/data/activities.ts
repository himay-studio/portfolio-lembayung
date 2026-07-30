import type { Activity } from './types';

/**
 * Eight activities and facilities.
 *
 * Four are scheduled activities and four are always on facilities, which is the split the
 * listing page filters by. Price 0 means it is already in the room rate.
 */
export const activities: Activity[] = [
  {
    slug: 'api-unggun-lembayung',
    name: 'Api Unggun Lembayung',
    kind: 'kegiatan',
    summary: 'Api komunal di Plaza Bara, dinyalakan tepat saat langit berubah warna.',
    description:
      'Setiap sore jam setengah enam, api di Plaza Bara dinyalakan. Waktunya bukan kebetulan. Jam itu matahari lewat di balik punggung bukit barat dan lembah ke arah Bandung berubah jingga lalu ungu, dan seluruh properti diatur supaya tamu berada di luar ruangan saat itu terjadi.\n\nPlaza Bara ada di teras terendah, lingkar batu selebar 2,5 meter dengan bangku kayu melingkar untuk sekitar 40 orang. Kayunya kayu pinus kering dari penjarangan tegakan sendiri, jadi asapnya sedikit dan tidak pedih di mata.\n\nMarshmallow, jagung, dan pisang untuk dibakar dijual di Dapur Bara, sekitar Rp 25.000 per porsi. Api dibiarkan menyala sampai jam sepuluh malam, setelah itu dijaga sampai padam sendiri. Tidak ada musik keras, karena sebagian besar tamu di sini tidur cepat.',
    schedule: 'Setiap hari, dinyalakan 17.30, padam 22.00',
    price: 0,
    priceNote: 'Gratis untuk semua tamu menginap',
    image: {
      path: '/img/activities/api-unggun-lembayung.jpg',
      alt: 'Api unggun komunal menyala di Plaza Bara Lembayung dengan tamu duduk melingkar saat langit ungu jingga',
      kind: 'eksterior',
    },
  },
  {
    slug: 'trekking-bukit-kabut',
    name: 'Trekking Pagi Bukit Kabut',
    kind: 'kegiatan',
    summary: 'Jalur 2,4 km ke punggung bukit sebelah utara, berangkat sebelum kabut naik.',
    description:
      'Berangkat jam enam pagi dari gerbang atas. Jalurnya 2,4 kilometer memutar lewat tegakan pinus, bekas terasering kebun stroberi lama, dan berakhir di punggung bukit sebelah utara. Total sekitar sembilan puluh menit termasuk berhenti.\n\nJam enam dipilih karena kabut masih duduk di lembah dan baru naik sekitar jam setengah delapan. Kalau berangkat jam delapan, yang terlihat hanya bukit biasa. Kalau berangkat jam enam, yang terlihat adalah punggung bukit yang muncul di atas lapisan putih.\n\nPemandu kami warga Cikole yang tahu jalur mana yang licin setelah hujan semalam. Di puncak ada kopi tubruk dan pisang rebus. Bawa jaket, karena suhu di punggung bukit jam enam pagi sekitar 13 sampai 15 derajat, dan sepatu yang solnya bergerigi.',
    schedule: 'Setiap hari, kumpul 05.45, berangkat 06.00',
    price: 0,
    priceNote: 'Gratis untuk tamu menginap. Tamu harian Rp 75.000 per orang.',
    image: {
      path: '/img/activities/trekking-bukit-kabut.jpg',
      alt: 'Rombongan kecil berjalan di jalur trekking hutan pinus Lembayung pada pagi hari dengan kabut rendah di lembah',
      kind: 'eksterior',
    },
  },
  {
    slug: 'panahan-dan-air-rifle',
    name: 'Panahan dan Air Rifle',
    kind: 'kegiatan',
    summary: 'Lapangan latihan 25 meter di teras tiga, dengan instruktur di setiap sesi.',
    description:
      'Lapangan panahan sepanjang 25 meter berada di sisi utara Teras 3, membelakangi tebing tanah supaya tidak ada anak panah yang keluar area. Ada enam busur recurve ukuran dewasa dan empat ukuran anak, plus dua air rifle untuk sasaran kaleng di jarak 10 meter.\n\nSetiap sesi empat puluh lima menit dan selalu ada instruktur, tidak ada sesi tanpa pendamping. Anak mulai usia delapan tahun boleh ikut dengan busur anak. Sepuluh menit pertama selalu dipakai untuk sikap berdiri dan aturan keamanan, jadi jangan datang mepet.\n\nSesi ramai pada jam empat sore, jadi kalau ingin lebih tenang ambil sesi jam sepuluh pagi. Untuk rombongan gathering dan sekolah, lapangan ini adalah salah satu dari enam pos.',
    schedule: 'Setiap hari, sesi 10.00, 14.00, dan 16.00',
    price: 85000,
    priceNote: 'Per orang per sesi 45 menit. Sudah termasuk dalam paket keluarga dan rombongan.',
    image: {
      path: '/img/activities/panahan-dan-air-rifle.jpg',
      alt: 'Seorang anak belajar memanah didampingi instruktur di lapangan panahan Lembayung dengan latar tebing tanah',
      kind: 'eksterior',
    },
  },
  {
    slug: 'kebun-petik-stroberi',
    name: 'Kebun Petik Stroberi',
    kind: 'kegiatan',
    summary: 'Kebun 0,4 hektar di teras dua, sisa kebun lama yang dihidupkan kembali.',
    description:
      'Sebelum jadi tempat menginap, lahan ini kebun stroberi yang berhenti berproduksi. Empat ribu meter persegi di Teras 2 kami tanami lagi, bukan untuk dijual ke pasar, tapi supaya tamu bisa memetik sendiri dan supaya terasering lamanya terpakai.\n\nVarietasnya Sweet Charlie dan California, ditanam di bedengan mulsa. Musim panen paling ramai antara Mei dan September. Di luar musim itu tetap ada buah, hanya lebih sedikit, dan kami akan bilang jujur kalau hari itu tinggal sedikit supaya Anda tidak kecewa setelah jalan ke bawah.\n\nMasuk kebunnya gratis. Yang dibayar adalah hasil petikan, satu keranjang sekitar 250 gram, Rp 45.000. Jangan mencuci buahnya di kebun, ada wastafel di pintu keluar.',
    schedule: 'Setiap hari, 07.00 sampai 16.00',
    price: 45000,
    priceNote: 'Masuk gratis. Rp 45.000 per keranjang hasil petikan, sekitar 250 gram.',
    image: {
      path: '/img/activities/kebun-petik-stroberi.jpg',
      alt: 'Tamu memetik stroberi di bedengan kebun Lembayung pada pagi hari dengan terasering lama di latar belakang',
      kind: 'eksterior',
    },
  },
  {
    slug: 'dapur-bara',
    name: 'Dapur Bara',
    kind: 'fasilitas',
    summary: 'Restoran semi terbuka di teras empat, masakan Sunda dan menu panggangan.',
    description:
      'Dapur Bara adalah satu satunya tempat makan di properti, bangunan kayu setengah terbuka di Teras 4 dengan sisi barat yang menghadap lembah. Muat sekitar 50 orang duduk, ditambah 20 di teras luar.\n\nMenunya dua bagian. Masakan Sunda harian, nasi liwet, ayam bakar, karedok, sayur asem, dan sambal yang dibuat pagi hari. Lalu menu panggangan sore, iga, ayam, jagung, dan ikan nila dari embung. Harga makanan berat antara Rp 45.000 dan Rp 120.000.\n\nSarapan untuk tamu menginap disajikan jam tujuh sampai sepuluh. Untuk Kabin Lembayung, sarapan diantar ke dek. Kalau ada alergi atau pantangan, sebutkan saat pesan, bukan saat makanan sudah datang, karena dapurnya kecil dan tidak bisa mengulang cepat.',
    schedule: 'Setiap hari, 07.00 sampai 22.00. Dapur terakhir menerima pesanan 21.15.',
    price: 0,
    priceNote: 'Bayar sesuai pesanan. Makanan berat Rp 45.000 sampai Rp 120.000.',
    image: {
      path: '/img/activities/dapur-bara.jpg',
      alt: 'Restoran kayu semi terbuka Dapur Bara di Lembayung dengan sisi barat menghadap lembah pada sore hari',
      kind: 'interior',
    },
  },
  {
    slug: 'bak-rendam-air-hangat',
    name: 'Bak Rendam Kayu Air Hangat',
    kind: 'fasilitas',
    summary: 'Empat bak kayu di teras terlindung, diisi atas permintaan dan dipakai bergiliran.',
    description:
      'Empat bak rendam kayu berdiri di sudut terlindung Teras 3, dipisahkan sekat kayu setinggi 1,8 meter sehingga tiap bak tertutup dari pandangan bak lain. Airnya dipanaskan dengan tungku kayu, bukan pemanas listrik, jadi butuh sekitar empat puluh menit dari saat dipesan.\n\nSatu sesi enam puluh menit, maksimal dua orang per bak. Karena pemanasannya lama, pesan minimal dua jam sebelumnya, dan sebaiknya pesan saat check in kalau Anda mengincar sesi jam lima sore, yang selalu paling cepat penuh.\n\nUntuk tamu Kabin Lembayung, bak rendam ada di dek unit sendiri dan tidak perlu antre. Jangan berendam lebih dari dua puluh menit tanpa keluar sebentar, dan jangan berendam setelah minum alkohol.',
    schedule: 'Setiap hari, sesi mulai 15.00, 17.00, dan 19.00',
    price: 150000,
    priceNote: 'Per sesi 60 menit, maksimal 2 orang per bak. Pesan minimal 2 jam sebelumnya.',
    image: {
      path: '/img/activities/bak-rendam-air-hangat.jpg',
      alt: 'Bak rendam kayu berisi air panas mengepul di teras terlindung Lembayung dengan sekat kayu dan hutan pinus di sekelilingnya',
      kind: 'detail',
    },
  },
  {
    slug: 'aula-lembah',
    name: 'Aula Lembah',
    kind: 'fasilitas',
    summary: 'Aula beratap dinding setengah terbuka, kapasitas 80, untuk gathering dan acara.',
    description:
      'Aula Lembah ada di Teras 5, dekat Lodge Rimba dan area parkir supaya rombongan tidak perlu naik turun teras sambil membawa peralatan. Rangkanya baja, atapnya seng berinsulasi, dan dindingnya setengah terbuka dengan tirai kanvas yang bisa diturunkan kalau hujan menyamping.\n\nKapasitasnya 80 orang gaya teater atau 50 orang gaya kelas. Ada sound dengan dua speaker dan dua mikrofon nirkabel, proyektor 4.000 lumen, dan layar 120 inci. Listriknya terpisah dari unit menginap, 7.700 watt, jadi peralatan panitia tidak akan menjatuhkan listrik kabin.\n\nAula ini alasan kami berani menerima gathering pada musim hujan. Antara November dan Maret, Lembang hampir selalu hujan sore, dan rundown yang bergantung pada lapangan terbuka akan berantakan. Di sini sesi tetap jalan.',
    schedule: 'Sesuai pemesanan, tersedia sepanjang hari',
    price: 2500000,
    priceNote: 'Per hari, di luar paket rombongan. Sudah termasuk sound, proyektor, dan layar.',
    image: {
      path: '/img/activities/aula-lembah.jpg',
      alt: 'Aula Lembah Lembayung beratap dengan dinding setengah terbuka, kursi tertata, dan hutan pinus terlihat dari sisi terbuka',
      kind: 'interior',
    },
  },
  {
    slug: 'pos-bintang',
    name: 'Pos Bintang',
    kind: 'fasilitas',
    summary: 'Dek pandang tanpa lampu di titik tertinggi, dengan satu teleskop.',
    description:
      'Pos Bintang adalah dek kayu berukuran 6 kali 4 meter di titik tertinggi properti, di atas Teras 1. Tidak ada satu pun lampu di dek itu, dan jalur menuju ke sana hanya diberi lampu tanam merah setinggi mata kaki, karena cahaya putih merusak adaptasi mata dan butuh sekitar dua puluh menit untuk pulih.\n\nAda satu teleskop reflektor 130 milimeter di dek, boleh dipakai siapa saja. Kalau belum pernah memakai teleskop, minta tolong petugas malam, karena mencari objek sendiri di gelap biasanya berakhir dengan teleskop yang menghadap ke tempat kosong.\n\nLangit paling bersih antara Juni dan September. Pada musim hujan, dek ini sering tertutup awan dan kami tidak akan menjanjikan apa pun. Bawa jaket tebal, suhu di titik itu jam sembilan malam sekitar 14 derajat dan berangin.',
    schedule: 'Setiap hari, 18.30 sampai 23.00. Petugas malam siaga sampai 22.00.',
    price: 0,
    priceNote: 'Gratis untuk tamu menginap',
    image: {
      path: '/img/activities/pos-bintang.jpg',
      alt: 'Dek pandang Pos Bintang Lembayung tanpa lampu pada malam berbintang dengan satu teleskop menghadap langit',
      kind: 'eksterior',
    },
  },
];

export function activityBySlug(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}

export const kegiatan = activities.filter((a) => a.kind === 'kegiatan');
export const fasilitas = activities.filter((a) => a.kind === 'fasilitas');
