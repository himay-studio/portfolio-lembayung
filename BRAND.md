# BRAND.md, Lembayung

**Wordmark:** Lembayung
**Full lockup:** Lembayung, Glamping & Kabin Dataran Tinggi
**Category line (HTML, never inside the logo image):** LEMBANG, BANDUNG UTARA
**Tagline:** Tidur di ketinggian, bangun di atas kabut.
**Promise line:** Satu jam dari Bandung, tujuh belas derajat, dan langit yang berubah ungu tepat jam setengah enam.
**Slug:** `lembayung` · **Repo:** `portfolio-lembayung` · **Live:** `portfolio-lembayung.himaystudio.com`

Fictional demo brand for the Himay Studio portfolio. No real business, no `clientDomain`, the site self canonicals per R35.

---

## 1. Category realism self check

Answered before a single hex value was chosen. This is the section that stops the Bersihara failure repeating.

### 1.1 How is this product REALLY packaged and sold?

Accommodation is not a packaged good. There is no bottle, no pouch, no jar, and any prompt that reaches for one is off category on sight. The "packaging" of a glamping resort is four things, and all four are photographable:

1. **The unit itself** as an object on the landscape: a dome on a timber deck, an A frame cabin between pines, a canvas bell tent with its guy lines pegged into red earth.
2. **The threshold**, which is the shot that actually sells the room: the view framed by the open door or the deck rail, taken from where a guest would stand with a coffee.
3. **The bed and the interior** at the hour it is used, warm lamp light rather than flat midday.
4. **The booking artefacts**, the price band, the check in card, the fire pit at 17.30.

**Locked art direction keyword. Every MEDIA.md prompt in Stage 3 and Stage 5 reuses this string verbatim:**

> `unit glamping nyata di lereng berundak hutan pinus Lembang, dek kayu ulin, kabut pagi rendah di lembah, langit senja ungu dan jingga, api unggun batu, tamu keluarga Indonesia asli berjaket, BUKAN render CGI, BUKAN interior showroom, BUKAN tenda di lapangan rumput datar`

**The two failure modes this brand is designed against.** Name them, because a prompt writer who has not seen them will produce them by default:

- **The sterile listing render.** A too clean interior, flat even light, bed made with hotel precision, nothing on any surface, no human trace. It reads as a 3D render of a room that does not exist. Every generated interior on this site must carry evidence of occupation: a jacket over the chair back, a half drunk mug, boots by the door, bedding creased on one side.
- **The tenda pengungsian shot.** A bare tent on a mown flat lawn under hard midday sun, no terrain, no canopy, no atmosphere. It is the single image that makes an Indonesian camping brand look cheap. Lembayung is always on a **slope**, always with **pines above the frame line**, and preferably in **mist or at dusk**.

### 1.2 What shelf am I on? Real competitors, and what they actually look like

Researched against live Lembang, Ciwidey and Bandung Utara listings, July 2026. Rates are the advertised entry price per night.

| Competitor | What it really is | Entry rate | What its visual language actually looks like |
| --- | --- | --- | --- |
| **Bobocabin Cikole / Ranca Upas** | Bobobox's cabin brand. Modular tech cabins, app controlled lighting, skylight and temperature, dropped into a pine stand. | from Rp 900.000 | Owns the **night**. Dark moody frames, a glowing cabin window as the only warm source, minimal humans, product design energy. Very consistent, very tight. |
| **The Lodge Maribaya** | Villa, treehouse, joglo and fun camp attached to an attraction park: hot air balloon, zipline, ATV, sky swing. | from Rp 1.000.000 | Owns the **activity park**. Bright daylight, families mid ride, saturated, busy frames. The stay is sold as an add on to the rides. |
| **Dusun Bambu** | Lakeside destination with Sundanese dining, lake boats, bamboo architecture. | from Rp 1.700.000 | Owns **lake plus dining**. Wide establishing shots, food overhead, lots of bamboo texture. |
| **Trizara Resorts** | Tented resort with bungee trampoline, archery, yoga. | from Rp 900.000 | Bright, wellness leaning, white canvas against green. |
| **Glamping Legok Kondang, Ciwidey** | Canvas tents deep in forest, rafting and trekking. | from Rp 2.750.000 | Premium forest seclusion, heavy green, few people. |
| **Pine Forest Camp** | Group and corporate specialist: outbound, offroad, flying fox. | from Rp 600.000 | Group photos, matching kaos, obstacle courses. Sells to a panitia, not a couple. |
| **Corak Alam Glamping** | Semi permanent domes, thick bedding, communal BBQ. | from Rp 450.000 | The budget dome tier. Straight daylight, functional. |
| **Imah Seniman**, **Kalasenja**, **Shinta Corner**, **Meloh Camp** | The Rp 450.000 to Rp 600.000 cabin and tent tier. | from Rp 450.000 | Mixed quality, inconsistent, mostly phone photography. |

**The real price band in this market is Rp 450.000 to about Rp 3.000.000 per night**, with the Ciwidey premium tents reaching higher. Lembayung's own rate card is built inside that band, not above it.

**The open lane.** Everyone in Lembang photographs one of three moments: **midday** (the activity parks), **night with fairy lights** (the tech cabins), or **blue hour generic**. Nobody owns **senja**, the twenty minutes when the sun drops behind the western ridge and the sky over the Bandung basin goes amber into violet. That moment is free, it is real, it happens every clear evening, and the western ridges of Lembang genuinely face it. Lembayung owns it, the name says it, the palette is built from it, and the daily 17.30 bonfire is scheduled to sit inside it.

That is a positioning nobody can copy without renaming themselves.

### 1.3 Does my palette match the category mood, or am I defaulting to dark and warm because it looks premium?

Answered explicitly, because this is where the Bersihara build went wrong.

**The site is majority LIGHT.** The default ground is a warm canvas off white, `--kanvas`. Listings, rate cards, the booking panel, articles and FAQ all sit on it. The dark dusk ground is **rationed**: hero, footer, and at most two atmosphere bands per page.

**The dark is a COOL violet indigo, not a warm brown.** This distinction is the whole argument. A warm brown dark ground plus wooden textures is the "warung kayu jadul" look, and it is what makes Indonesian cabin brands read as tired. `--senja` `#221A3A` is a blue violet. Against it, the amber and terracotta accents read as **fire and sun**, which is exactly what this category sells at 1.300 metres: warmth you had to climb for.

So warm is present, but only ever as an **accent against a cool dark**, never as an all over wash. If a reviewer sees a page that is broadly brown, that page is wrong.

**And it is not Wanantara.** Wanantara is dark jungle green with tropical daylight. Lembayung is cool violet dusk with amber firelight, on a light canvas base. The two share a workspace but must not share a silhouette.

---

## 2. Brand direction

**Concept.** Lembayung is a 3,2 hektar highland glamping and wooden cabin resort on a west facing terraced slope in Cikole, Lembang, at roughly 1.300 mdpl. Six unit types step down the slope in five terraces, so no unit looks into another unit's deck. The land was a failed strawberry plot before it was replanted with pine, and the original terrace walls are still there, which is why the site reads as a hillside and not a campground.

The property is built around one scheduled moment. At 17.30 the sun clears the western ridge, the valley toward Bandung turns amber and then violet, and the communal fire is lit at the Plaza Bara. Everything else on the property, the trekking that returns at 08.00, the west facing decks, the observation deck with no lighting, is arranged so guests are outdoors at that hour.

**Name logic.** *Lembayung* is the Indonesian word for the purple and reddish band of the sky at sunset. It is one word, it is already in KBBI so no Indonesian has to be taught how to say it, it carries no English loanword, and it is not a place name so it cannot be confused with a real property. Critically for this build, **the name is the art direction**: it hands the palette, the daily ritual, and the hero video brief to every downstream stage without further argument. It also opens a natural sub name family: Plaza Bara (the fire plaza), Bukit Kabut (the morning trek), Pos Bintang (the star deck), Dapur Bara (the kitchen).

**Positioning statement.** Untuk pasangan dan keluarga dari Jakarta dan Bandung yang punya satu malam, dan untuk kantor yang butuh dua hari kerja di luar kota, Lembayung adalah tempat menginap di lereng pinus Lembang yang menjual satu hal dengan jelas: senja. Bukan taman hiburan yang kebetulan punya kamar, bukan kabin teknologi yang mengunci tamu di dalam ruangan, dan bukan tenda di lapangan datar.

**Audience.**

1. **Pasangan akhir pekan** (25 sampai 40, Jakarta dan Bandung, satu malam, sering ulang tahun atau anniversary). Decides on photographs and on whether the bathroom is private. Books late, often for the same weekend. Highest rate per night, lowest headcount.
2. **Keluarga dengan anak** (orang tua 30 sampai 45, anak 4 sampai 12). Decides on safety, on whether there is hot water, on extra bed policy, and on whether the child will be bored. Books two to three weeks ahead, arrives with a car, stays one or two nights.
3. **Panitia gathering kantor dan outbound sekolah** (HR, GA, guru, EO). Weekday inventory, the segment that pays the operating cost from Monday to Thursday. Decides on capacity, rundown, an itemised quotation, and whether there is a covered hall if it rains. Books four to eight weeks ahead, asks for a surat penawaran.

The site must serve all three without letting the corporate segment make the brand feel like a training centre. Segment 3 gets its own depth, not its own tone.

**What the brand is not.** Not a resort hotel. Not a theme park. Not luxury, and the copy never claims it. The honest word is **nyaman**, which in this category means: a real mattress, hot water, a private bathroom in most units, a floor that is not wet, and staff who answer WhatsApp.

---

## 3. Tone of voice

Bahasa Indonesia, warm and grounded, written the way a good host talks. Never corporate brochure, never travel blog breathless.

**The five rules.**

1. **Sebut angkanya.** Suhu 15 sampai 19 derajat. Jarak 1,2 km dari Terminal Wisata Cikole. Air panas 24 jam. Vague comfort words are worth nothing to someone deciding at 23.00; numbers are.
2. **Akui yang kurang.** Sinyal Telkomsel kuat, Indosat naik turun. Jalan 400 meter terakhir berbatu. Saying this out loud converts better than hiding it, and it is the difference between a host and a brochure.
3. **Ajak, jangan perintah.** "Ambil selimut ekstra di lemari" beats "Guests are advised to". Second person, active, short sentences.
4. **Satu gagasan per kalimat.** If a sentence needs a dash to hold two ideas together, it needs to be two sentences. This is also how R11 gets satisfied by writing style rather than by find and replace.
5. **Tidak ada kata pemasaran kosong.** Banned on this site: mewah, eksklusif, world class, hidden gem, surga tersembunyi, wajib dikunjungi, healing, aesthetic, cozy vibes, sensasi tak terlupakan, memanjakan mata.

**Persona.** Pak Damar, 44, the property's founder, an ex forestry field officer from Subang who planted the pines himself. He knows the trail, he knows which nights the mist comes in, and he will tell you plainly not to book the dome if you are bringing a toddler. He is proud of the place and slightly embarrassed by superlatives.

**Voice test.** Read any sentence aloud. If Pak Damar would not say it to a guest standing in front of him with a bag, rewrite it.

| Instead of | Write |
| --- | --- |
| Nikmati sensasi menginap di tengah alam yang memanjakan mata | Kabin menghadap barat. Jam setengah enam sore, lembah berubah jingga lalu ungu. |
| Fasilitas lengkap dan modern | Air panas 24 jam, listrik 900 watt per unit, kamar mandi dalam di lima dari enam tipe. |
| Lokasi strategis mudah dijangkau | 1,2 km dari Terminal Wisata Cikole. Sekitar 2,5 jam dari Jakarta lewat Tol Cipularang, 45 menit dari Stasiun Bandung. |
| Cocok untuk healing | Kalau tujuannya tidur cepat dan bangun pagi, ini tempatnya. Kalau cari hiburan malam, bukan. |

---

## 4. Copy conventions, binding on every stage

- **R11, no em dash and no en dash, anywhere.** Also forbidden in the entity forms `&mdash;`, `&ndash;`, `&#8212;`, `&#8211;`, `&#x2014;`, `&#x2013;`, because those render as real dashes (R58). Use a comma, a full stop, or two sentences. The check runs against **rendered** text, not just the source.
- **Currency:** `Rp 1.250.000` with a space after Rp and a full stop as the thousands separator. Never `IDR`, never `1.250K`, never `1,25jt` in a price field. In running prose `1,25 juta` is acceptable.
- **Decimals** use a comma: `3,2 hektar`, `1,2 km`.
- **Time** uses a full stop: `17.30`, `check in 14.00`, `check out 12.00`.
- **Capacity** is always written `2 pax`, `4 pax`, `20 pax`, lower case `pax`.
- **Nights** are written `2 hari 1 malam`, abbreviated `2D1N` only inside package badges where space is tight.
- **Never put capacity or view into a unit type name.** See R42 and section 5.
- The brand name is always **Lembayung**, capital L, never LEMBAYUNG in body copy, never Lembayung Resort, never Villa Lembayung.

---

## 5. Catalog identity model, R42

This is the trap flagged on this build, so it is stated here in the brand doc as well as in the data.

**A unit type is a STRUCTURE.** Dome Senja, Kabin Pinus, Tenda Bara, Kabin Lembayung, Rumah Kanopi, Lodge Rimba. Six of them. That name never changes.

**Capacity and view are VARIANT DIMENSIONS carried on the unit**, in a `variants` array, each variant holding its own `sku`, `price`, `capacity`, `view`, and `image`.

Concretely, so nobody has to interpret it:

- Correct: unit `Dome Senja`, variants `2 pax / Danau`, `2 pax / Hutan`, `4 pax / Danau`.
- Wrong, and a failed build: six products named `Dome Danau 2 Pax`, `Dome Hutan 2 Pax`, and so on.

Two visible symptoms prove which one was implemented. If the listing capacity filter changes the **name** on the card, the model is wrong. If the detail page view picker **navigates to a different slug** instead of swapping image, price and SKU in place, the model is wrong.

Catalog depth per R41 comes from six unit types with four images each, plus rich variants, never from inflating a variant into a fake unit.

---

## 6. Packaging direction

Copied by Site Architect and Media Producer into MEDIA.md without alteration.

**Packaging direction:** Tidak ada kemasan produk. Subjek foto adalah unit menginap nyata di lereng berundak hutan pinus Lembang: dome geodesik dan kabin kayu di atas dek kayu ulin, tali pancang tertanam di tanah merah, tangga batu antar teras, kabut pagi rendah di lembah, dan langit senja ungu jingga di sisi barat. Interior selalu punya jejak pemakaian, jaket tersampir, mug setengah kosong, sepatu di depan pintu. Manusia dalam frame adalah keluarga dan pasangan Indonesia asli berjaket, tidak bergaya, sedang melakukan sesuatu. Dilarang: botol produk, kemasan, render CGI, interior showroom kosong, tenda di lapangan rumput datar, matahari tegak lurus tanpa suasana.

---

## 7. Downstream contract

| Stage | Takes from this file |
| --- | --- |
| 2, Asset Forge | Wordmark string, tagline, the fact that the category line lives in HTML and never inside the logo image (R62). |
| 3, Site Architect | Section 5 identity model, section 6 packaging direction, the audience list which drives the IA, the sub name family. |
| 4, Webapp Architect | Audience 3 needs a quotation flow; audiences 1 and 2 need a date range plus unit plus variant flow. |
| 5, Media Producer | Section 6 verbatim, the locked art direction keyword in 1.1, and the two named failure modes to write prompts against. |
| 7, Frontend Builder | Section 3 tone rules and section 4 copy conventions, applied to every string that is not already in `src/data`. |
| 10, Review Curator | Section 1.3 is the argument to re check: if the shipped site reads broadly brown, or reads like Wanantara, this brand failed. |
