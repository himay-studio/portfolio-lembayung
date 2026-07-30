# MEDIA-HOWTO.md, Lembayung

**Gerbang aset gabungan, R25.** Ini SATU SATUNYA lembar instruksi yang kamu butuhkan untuk
seluruh aset situs Lembayung: logo (dua varian), 47 gambar, dan satu video hero. Semuanya
digenerate lewat Google Flow, dalam satu sesi kerja. `gemini-image` MCP sudah dimatikan
sepenuhnya di runtime ini per R63, jadi tidak ada jalur generate otomatis lagi, seluruh piksel
build ini lewat gerbang manual ini.

Yang tidak butuh piksel sudah selesai semua: seluruh halaman sudah jadi dengan placeholder
beranotasi, dan setiap prompt di `MEDIA.md` sudah dirangkai lengkap (SUBJECT + PHOTO DNA +
NEGATIVE per baris, tervalidasi otomatis oleh `node scripts/gen-manifest.mjs`).

## Project info

- **Slug site:** `lembayung`
- **Brand:** Lembayung, Glamping & Kabin Dataran Tinggi (Lembang, Bandung Utara)
- **Flow project:** https://labs.google/fx/id/tools/flow/project/1e873728-41ff-4e87-ab36-3de32f6ad416
- **Flow collection:** `lembayung` (bikin kalau belum ada, pakai slug ini persis, jangan di-rename)
- **Save directory:** `public/` di repo ini. Subfoldernya ikut kolom path:
  `public/img/`, `public/img/units/`, `public/img/packages/`, `public/img/activities/`,
  `public/img/articles/`, `public/img/properti/`, dan `public/video/`

## 5 langkah

1. **Copy-paste prompt** yang sudah dirangkai verbatim ke kolom chat input Google Flow, di
   collection bernama `lembayung`. Prompt lengkap per aset ada di `MEDIA.md` (lampiran di
   komentar ini), satu blok kode per baris. **Copy SELURUH isi blok kodenya**, dari baris
   `SUBJECT:` sampai baris terakhir `NEGATIVE:`, jangan cuma kalimat SUBJECT-nya saja. Untuk
   logo (L01, L02), prompt lengkapnya ada di `LOGO.md` section 5.1 dan 5.2, bukan di `MEDIA.md`.
2. **Atur config:**
   - **Rasio** ikuti kolom Rasio di tabel di bawah dan di `MEDIA.md`: `1:1` untuk unit menginap,
     `4:3` untuk paket, kegiatan, fasilitas, dan foto gerbang, `16:9` untuk artikel, foto
     properti, Open Graph, dan video hero.
   - **Resolution:** 1K
   - **Model gambar:** Nano Banana
   - **Model video:** Veo Lite, 8 detik, 16:9
3. **Generate, MAKSIMUM bulk 4 media sekaligus.** Gaboleh berbarengan lebih dari 4.
4. **Lanjut ke prompt berikutnya tanpa download dulu.** Kerjakan berurutan per folder di bawah
   sampai habis, baru download belakangan sekaligus.
5. **Kalau sudah**, select gambar hasilnya, download, lalu taruh di `public/` di repo ini dengan
   nama file **PERSIS** seperti kolom di bawah, di subfolder yang benar. Salah satu huruf saja
   sama dengan gambarnya rusak di build (404 diam-diam di static export).

## Baca ini sebelum generate apapun yang ada tulisannya, R62

Model gambar reliably salah eja tulisan yang dibaca dan suka mengarang nama brand sendiri. Jadi
di manifest ini:

1. Hanya SATU baris di seluruh manifest yang punya tulisan tajam, yaitu **M46**
   (`gerbang-resepsionis.jpg`), dan tulisannya cuma satu kata: `Lembayung`, sembilan huruf,
   L kapital. Baris lain sengaja ditulis supaya papan menu, papan arah, atau layar apapun yang
   kelihatan tulisannya sengaja dibuat blur atau miring, tidak pernah tajam.
2. Kalau hasil generate ada tulisan yang tidak diminta atau terbaca aneh, itu artinya
   REGENERATE, bukan catatan di laporan. Zoom dan baca dulu sebelum download.
3. Tidak ada satupun token berkurung di file ini. Kalau kamu lihat `[` atau `{` di dalam prompt
   manapun, berhenti dan laporkan, jangan di-paste.

## Bagian 1, logo, 2 aset (prompt lengkap ada di LOGO.md 5.1 dan 5.2)

| ID | Nama file, PERSIS seperti ini | Rasio | Model | Sudah |
| --- | --- | --- | --- | --- |
| L01 | `public/img/logo.png` | 1:1, transparan | Nano Banana, 1K | [ ] |
| L02 | `public/img/logo-inverted.png` | 1:1, transparan | Nano Banana, 1K | [ ] |

L02 wajib per R43. Footer situs ini gelap, tanpa varian putih knockout ini logo hilang jadi kotak
kosong di footer.

## Bagian 2, video hero, 1 aset, WAJIB (R30, R44)

| ID | Nama file, PERSIS seperti ini | Rasio | Model | Sudah |
| --- | --- | --- | --- | --- |
| V01 | `public/video/hero-lembayung.mp4` | 16:9 | Veo Lite, 8 detik | [ ] |

Ini satu satunya video, dan ia TIDAK BOLEH dilewat. Situs tidak akan dideploy tanpa file ini.

## Bagian 3, gambar, 47 aset

#### `public/img/units/`  (24 file)

| ID | Nama file, PERSIS seperti ini | Rasio | Model | Sudah |
| --- | --- | --- | --- | --- |
| M01 | `dome-senja-eksterior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M02 | `dome-senja-interior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M03 | `dome-senja-dek.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M04 | `dome-senja-detail.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M05 | `kabin-pinus-eksterior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M06 | `kabin-pinus-interior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M07 | `kabin-pinus-dek.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M08 | `kabin-pinus-detail.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M09 | `tenda-bara-eksterior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M10 | `tenda-bara-interior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M11 | `tenda-bara-dek.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M12 | `tenda-bara-detail.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M13 | `kabin-lembayung-eksterior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M14 | `kabin-lembayung-interior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M15 | `kabin-lembayung-dek.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M16 | `kabin-lembayung-detail.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M17 | `rumah-kanopi-eksterior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M18 | `rumah-kanopi-interior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M19 | `rumah-kanopi-dek.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M20 | `rumah-kanopi-detail.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M21 | `lodge-rimba-eksterior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M22 | `lodge-rimba-interior.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M23 | `lodge-rimba-dek.jpg` | 1:1 | Nano Banana, 1K | [ ] |
| M24 | `lodge-rimba-detail.jpg` | 1:1 | Nano Banana, 1K | [ ] |

#### `public/img/packages/`  (5 file)

| ID | Nama file, PERSIS seperti ini | Rasio | Model | Sudah |
| --- | --- | --- | --- | --- |
| M25 | `senja-berdua.jpg` | 4:3 | Nano Banana, 1K | [ ] |
| M26 | `akhir-pekan-keluarga.jpg` | 4:3 | Nano Banana, 1K | [ ] |
| M27 | `gathering-kantor.jpg` | 4:3 | Nano Banana, 1K | [ ] |
| M28 | `outbound-sekolah.jpg` | 4:3 | Nano Banana, 1K | [ ] |
| M29 | `momen-spesial.jpg` | 4:3 | Nano Banana, 1K | [ ] |

#### `public/img/activities/`  (8 file)

| ID | Nama file, PERSIS seperti ini | Rasio | Model | Sudah |
| --- | --- | --- | --- | --- |
| M30 | `api-unggun-lembayung.jpg` | 4:3 | Nano Banana, 1K | [ ] |
| M31 | `trekking-bukit-kabut.jpg` | 4:3 | Nano Banana, 1K | [ ] |
| M32 | `panahan-dan-air-rifle.jpg` | 4:3 | Nano Banana, 1K | [ ] |
| M33 | `kebun-petik-stroberi.jpg` | 4:3 | Nano Banana, 1K | [ ] |
| M34 | `dapur-bara.jpg` | 4:3 | Nano Banana, 1K | [ ] |
| M35 | `bak-rendam-air-hangat.jpg` | 4:3 | Nano Banana, 1K | [ ] |
| M36 | `aula-lembah.jpg` | 4:3 | Nano Banana, 1K | [ ] |
| M37 | `pos-bintang.jpg` | 4:3 | Nano Banana, 1K | [ ] |

#### `public/img/articles/`  (6 file)

| ID | Nama file, PERSIS seperti ini | Rasio | Model | Sudah |
| --- | --- | --- | --- | --- |
| M38 | `membaca-cuaca-lembang.jpg` | 16:9 | Nano Banana, 1K | [ ] |
| M39 | `bawa-anak-ke-glamping.jpg` | 16:9 | Nano Banana, 1K | [ ] |
| M40 | `kenapa-senja-berwarna-ungu.jpg` | 16:9 | Nano Banana, 1K | [ ] |
| M41 | `rundown-gathering-kantor.jpg` | 16:9 | Nano Banana, 1K | [ ] |
| M42 | `api-unggun-aman.jpg` | 16:9 | Nano Banana, 1K | [ ] |
| M43 | `rute-ke-lembayung.jpg` | 16:9 | Nano Banana, 1K | [ ] |

#### `public/img/properti/`  (3 file)

| ID | Nama file, PERSIS seperti ini | Rasio | Model | Sudah |
| --- | --- | --- | --- | --- |
| M44 | `aerial-teras.jpg` | 16:9 | Nano Banana, 1K | [ ] |
| M45 | `plaza-bara-senja.jpg` | 16:9 | Nano Banana, 1K | [ ] |
| M46 | `gerbang-resepsionis.jpg` | 4:3, satu satunya baris dengan tulisan tajam ("Lembayung") | Nano Banana, 1K | [ ] |

#### `public/`  (1 file, Open Graph)

| ID | Nama file, PERSIS seperti ini | Rasio | Model | Sudah |
| --- | --- | --- | --- | --- |
| M47 | `og-lembayung.jpg` | 16:9, 1200x630 | Nano Banana, 1K | [ ] |

## Setelah semua tersimpan

Attach file-file yang sudah jadi ke balasan komentar di issue ini (atau drop ke `public/` di
repo kalau kamu sudah punya akses langsung), lalu **balas di komentar dan mention
@Media Producer**. Balasan biasa tidak membangunkan agent, cuma mention yang membangunkan.

Kalau baru sebagian jadi, tidak apa apa, balas dan sebut sampai M-berapa saja yang sudah, nanti
`MEDIA.md` dan checklist ini di update sesuai batch yang masuk.

---
Dibuat mengikuti R23 dan R25. Sumber kebenaran nama file dan prompt logo tetap `LOGO.md`, dan
sumber kebenaran nama file dan prompt gambar/video tetap `MEDIA.md`. Dokumen ini lembar instruksi
siap pakai yang menggabungkan keduanya jadi satu gerbang.
