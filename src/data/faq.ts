import type { FaqItem } from './types';

/**
 * FAQ, R7. Twelve entries covering the eight questions named in the Stage 1 brief plus four
 * that come up constantly on a booking site.
 *
 * Answers give the number or the policy, not reassurance. Where the answer is inconvenient,
 * it says so, per BRAND.md section 3 rule 2.
 *
 * Note for Stage 3: a collapsed accordion is not a card stack, so this list is exempt from
 * the R48 mobile carousel rule. It still needs full keyboard operation and honest
 * `aria-expanded` state per R60.
 */
export const faq: FaqItem[] = [
  {
    category: 'Menginap',
    question: 'Jam berapa check in dan check out?',
    answer:
      'Check in mulai jam 14.00, check out jam 12.00. Kalau tiba lebih awal, barang bisa dititipkan di meja depan dan Anda bisa menunggu di Dapur Bara. Resepsionis buka sampai jam 22.00, dan kalau Anda akan tiba lebih malam dari itu, kabari lewat WhatsApp supaya petugas malam menunggu. Check out lambat sampai jam 14.00 gratis untuk Kabin Lembayung, dan Rp 200.000 untuk unit lain kalau unitnya belum dipesan tamu berikutnya.',
  },
  {
    category: 'Menginap',
    question: 'Bagaimana kalau hujan? Apakah kegiatan tetap jalan?',
    answer:
      'Antara November dan Maret, hujan sore hampir setiap hari di Lembang, biasanya antara jam dua dan jam lima. Yang tetap jalan saat hujan: menginap di semua unit, Dapur Bara, Aula Lembah, bak rendam air hangat, dan sesi rombongan di aula. Yang ditunda atau dibatalkan: trekking pagi kalau jalur licin, panahan, api unggun komunal, dan Pos Bintang. Kegiatan berbayar yang batal karena cuaca kami kembalikan penuh atau dijadwalkan ulang, Anda yang pilih. Biaya menginap tidak dikembalikan karena hujan, karena unitnya tetap Anda pakai.',
  },
  {
    category: 'Fasilitas',
    question: 'Apakah kamar mandinya di dalam unit?',
    answer:
      'Lima dari enam tipe unit punya kamar mandi dalam dengan air panas 24 jam: Dome Senja, Kabin Pinus, Kabin Lembayung, Rumah Kanopi, dan Lodge Rimba. Hanya Tenda Bara yang memakai kamar mandi bersama, empat bilik dengan air panas, berjarak sekitar 30 meter berjalan kaki. Itu sebabnya Tenda Bara harganya paling terjangkau. Kalau Anda tidak ingin keluar tenda tengah malam saat suhu 15 derajat, ambil Dome Senja.',
  },
  {
    category: 'Menginap',
    question: 'Apakah cocok membawa anak kecil?',
    answer:
      'Cocok, tapi pilihan unitnya berpengaruh. Kabin Pinus adalah yang paling aman untuk keluarga: mezanin dengan pembatas 90 sentimeter, kamar mandi dalam, dan extra bed gratis untuk anak di bawah 6 tahun. Dome Senja kurang cocok untuk balita karena dindingnya kanvas dan tidak meredam suara antar unit. Tenda Bara berat untuk anak yang masih sering bangun malam karena kamar mandinya di luar. Bawa jaket yang benar benar hangat, karena jam tujuh malam suhunya sekitar 15 derajat dan ini barang yang paling sering dilupakan tamu.',
  },
  {
    category: 'Fasilitas',
    question: 'Bagaimana dengan listrik? Apakah ada colokan di setiap unit?',
    answer:
      'Semua unit berlistrik 24 jam. Dome Senja dan Tenda Bara 900 watt, Kabin Pinus dan Rumah Kanopi 1.300 watt, Kabin Lembayung 1.300 watt dengan perapian listrik terpisah, Lodge Rimba 3.500 watt. Jumlah colokan antara 2 dan 6 titik tergantung unit, dan tercantum di halaman tiap unit. Aula Lembah punya jalur listrik terpisah 7.700 watt supaya peralatan panitia tidak menjatuhkan listrik unit menginap. Kami tidak menyediakan genset cadangan untuk unit, jadi kalau listrik PLN padam, penerangan darurat memakai lampu badai yang sudah ada di tiap unit.',
  },
  {
    category: 'Fasilitas',
    question: 'Bagaimana sinyal dan WiFi di sini?',
    answer:
      'Telkomsel kuat di hampir seluruh properti. Indosat dan XL naik turun, terutama di Teras 1 dan di Pos Bintang. WiFi tersedia di semua unit dan di Dapur Bara. Yang paling stabil ada di Rumah Kanopi, dan itu sebabnya unit tersebut sering dipesan orang yang bekerja jarak jauh. Kecepatannya cukup untuk rapat video satu orang, tidak cukup untuk seluruh rombongan melakukannya bersamaan. Satu hal praktis: memesan taksi daring dari properti sering gagal karena sinyal, jadi untuk kepulangan sebaiknya pesan antar jemput lewat kami saat check in.',
  },
  {
    category: 'Pemesanan',
    question: 'Bagaimana kebijakan pembatalan dan reschedule?',
    answer:
      'Pembatalan lebih dari 14 hari sebelum tanggal menginap, uang kembali 100 persen dipotong biaya administrasi Rp 100.000. Antara 7 dan 14 hari, kembali 50 persen. Kurang dari 7 hari, tidak ada pengembalian, tapi Anda boleh memindahkan tanggal satu kali ke tanggal lain dalam 90 hari, selama masih tersedia dan selisih harganya dibayar kalau pindah ke akhir pekan. Untuk rombongan 30 orang ke atas, ketentuannya berbeda dan tertulis di surat penawaran. Pembatalan karena bencana alam atau penutupan jalur resmi selalu kami kembalikan penuh.',
  },
  {
    category: 'Lokasi',
    question: 'Bagaimana kondisi jalan menuju ke sana? Apakah mobil biasa bisa masuk?',
    answer:
      'Dari Jalan Raya Tangkuban Perahu, ada jalan desa beraspal selebar sekitar 3,5 meter sepanjang 800 meter, lalu 400 meter terakhir berbatu dan menanjak. Mobil sedan standar bisa lewat pelan pelan. Mobil yang diceperkan sebaiknya tidak, dan kalau mobil Anda ceper, telepon kami, parkir di area bawah dekat Aula Lembah, dan kami jemput dengan mobil bak. Bus besar bisa masuk sampai area parkir bawah, tidak sampai teras atas. Usahakan tiba sebelum jam 17.00, karena bagian berbatu jauh lebih mudah dilalui saat terang.',
  },
  {
    category: 'Pemesanan',
    question: 'Kenapa harga akhir pekan berbeda dengan harga hari biasa?',
    answer:
      'Harga yang tampil pertama adalah tarif hari biasa, Minggu sampai Kamis. Tarif Jumat, Sabtu, dan libur nasional lebih tinggi antara Rp 240.000 dan Rp 1.200.000 per malam tergantung unit, dan selalu ditampilkan di kalender sebelum Anda membayar, bukan muncul di akhir. Sebagian besar unit terisi pada akhir pekan, jadi kalau tanggal Anda fleksibel, menginap Selasa atau Rabu lebih murah dan propertinya jauh lebih sepi.',
  },
  {
    category: 'Menginap',
    question: 'Apakah boleh membawa hewan peliharaan?',
    answer:
      'Boleh, dengan syarat. Anjing dan kucing diperbolehkan di Tenda Bara dan Kabin Pinus, maksimal satu ekor per unit, dengan biaya kebersihan Rp 150.000 per menginap. Tidak diperbolehkan di Dome Senja, Rumah Kanopi, Kabin Lembayung, dan Lodge Rimba. Hewan harus selalu dengan tali di area umum, tidak boleh masuk Dapur Bara, dan tidak boleh ditinggal sendirian di dalam unit. Beri tahu saat memesan, bukan saat check in, karena unit yang menerima hewan jumlahnya terbatas.',
  },
  {
    category: 'Rombongan',
    question: 'Berapa minimum peserta untuk gathering kantor atau outbound sekolah?',
    answer:
      'Gathering Kantor minimum 30 peserta, hanya Minggu sampai Kamis, Rp 850.000 per orang sudah termasuk pajak. Outbound Sekolah minimum 40 siswa, hanya Senin sampai Kamis, Rp 385.000 per siswa, dengan guru pendamping gratis satu per 15 siswa. Di bawah jumlah minimum itu, kami tetap bisa menerima, tapi dihitung dengan tarif unit biasa ditambah sewa Aula Lembah Rp 2.500.000 per hari. Surat penawaran resmi dengan rincian per item kami kirim dalam satu hari kerja setelah Anda menyebutkan jumlah peserta dan tanggal.',
  },
  {
    category: 'Fasilitas',
    question: 'Apakah boleh memasak atau membawa makanan sendiri?',
    answer:
      'Memasak di dalam unit tidak diizinkan, karena bahan bangunannya kanvas dan kayu dan pemadam terdekat cukup jauh. Panggangan tersedia di area Plaza Bara, dan Anda boleh membawa bahan sendiri dengan biaya pemakaian alat Rp 100.000. Membawa camilan dan minuman ringan bebas, tidak ada biaya buka botol untuk minuman non alkohol. Untuk minuman beralkohol, konsumsi dibatasi di dek unit masing masing dan tidak di area umum setelah jam 22.00. Kalau ada alergi atau pantangan makan, sebutkan saat memesan, bukan saat makanan sudah datang, karena dapur kami kecil dan tidak bisa mengulang cepat.',
  },
];

export const faqCategories = [...new Set(faq.map((f) => f.category))];
