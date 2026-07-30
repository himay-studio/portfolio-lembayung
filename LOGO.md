# LOGO.md, Lembayung

Stage 1 output, Brand Strategist.

**Ownership note.** HIM-316 scopes this file to the logo **concept**, and hands the final paste ready prompt text to Asset Forge in Stage 2. So sections 1 to 4 are the concept and the binding constraints, and section 5 is a **Stage 1 draft prompt** that Asset Forge owns, refines and finalises. It is written complete rather than as notes so that nothing downstream is blocked if Stage 2 decides it only needs a light edit. Asset Forge has the final word on the wording.

No agent generates the logo. Per R63 the `gemini-image` MCP was removed on 2026-07-29, and **Fahima Fauziah** (member id `e03e7d1b-1a30-4e2f-a273-4c9d33a34936`) generates it in Google Flow, in the same single combined bundle as every image and the hero video (R25).

---

## 1. Concept

**The mark is a horizon, not a tent.**

Every glamping brand in this market draws a triangle. Bobocabin, Trizara, Pine Forest, half the Lembang listings: a tent silhouette, sometimes with a pine next to it. Drawing another one makes Lembayung invisible on a search results page and wastes the one asset the name already gives us.

The name means the violet and amber band of the sunset sky. So the mark is **that band**: a stack of three horizontal bars of decreasing width sitting above a single wider baseline bar, read as a sky compressed into strata over a ridge line. It is a sunset reduced to its geometry.

Three reasons it is the right answer here:

1. **It carries the palette in the mark itself.** The bars run amber at the bottom into violet at the top, which is literally what the brand is called and exactly what the site's dusk ground does.
2. **It is horizontal, which is what a terraced slope actually looks like.** The property is five stepped terraces. The mark and the site's terrace layout motif are the same idea at two scales.
3. **It survives being small and being flat.** Three bars and a baseline still read at 16px in a browser tab, which a tent with a pine tree does not.

**Optional refinement, Asset Forge's call:** a single narrow vertical notch cut through the bars, slightly off centre, reading as the last sliver of sun dropping behind the ridge. It adds a focal point at large sizes. If it muddies the 16px favicon, drop it. Legibility at 16px wins.

### Lockup

Wordmark **Lembayung** set in the display face, sitting to the right of the mark on the horizontal lockup and beneath it on the stacked lockup.

**The category line `LEMBANG, BANDUNG UTARA` is NOT part of the logo image.** It is rendered as separate HTML next to the lockup, as its own block level element with an explicit gap (R50, and see R62 below for why it must not be baked into the image).

### Explicitly rejected

- A tent or dome triangle. The category default, and invisible.
- A pine tree. Every competitor in Lembang has one.
- A mountain outline with a sun behind it. The single most generic travel mark in existence.
- A circular badge or a rope roundel. Fights R10, which is zero radius everywhere.
- A hand lettered script. Illegible small, and it fights the Newsreader wordmark.

---

## 2. Two variants are mandatory, R43

Ship both. A single self contained coloured block reused on every ground is the recurring failure where the footer logo reads as a blank rectangle, which is exactly what happened on Legatara.

| Variant | File | Ground it is for | What it is |
| --- | --- | --- | --- |
| **Primary** | `public/img/logo.png` | Light grounds: `--kanvas` `#F7F3EC`, `--kanvas-2` `#EDE6DA`, `--putih`. Header at scroll, light sections, invoices, the OG image. | Bars in the amber to violet gradient. Wordmark in `--tinta` `#1C1830`. Fully transparent background. |
| **Inverted knockout** | `public/img/logo-inverted.png` | Dark grounds: `--senja` `#221A3A`, `--senja-pekat` `#15102A` footer, the hero at first paint. | Bars in the amber to light violet gradient, brightened so they hold against dusk. Wordmark in `--kanvas` `#F7F3EC`. Fully transparent background. |

**Neither variant has a background plate.** Both are transparent PNGs. The failure mode being designed out is a logo delivered as a coloured rectangle whose ground happens to match the footer, so the whole block disappears.

**Acceptance check for Stage 6 and Stage 8:** place `logo-inverted.png` on `#15102A` and confirm every stroke of the wordmark and every bar is clearly visible. If the logo block's own ground is within roughly 10 percent lightness of the footer ground, it is a failed build.

---

## 3. Technical constraints

- **Format:** PNG with a real alpha channel. Not JPG, not a white rectangle pretending to be transparent.
- **Canvas:** 1:1 square, 2048 by 2048, with the lockup centred and about 12 percent clear space on every side.
- **Style:** clean flat vector, crisp edges, solid fills and one linear gradient across the bars. No photo, no gradient mesh, no bevel, no drop shadow, no outer glow, no 3D, no texture.
- **Radius:** the bars have square ends. Zero radius, R10, applies to the mark too.
- **Colour, exactly these values:**
  - amber `#F0A94C`
  - terracotta `#9C4221`
  - violet `#4A3573`
  - light violet `#C9B8E8`
  - ink `#1C1830` (primary wordmark)
  - canvas `#F7F3EC` (inverted wordmark)
- **Wordmark type:** a warm editorial serif matching Newsreader at weight 500, with generous letter spacing. Not a script, not a slab, not a geometric sans.

---

## 4. Text discipline, R62

**`Lembayung` is the only string in the image, and it is spelled exactly that way: capital L, then `embayung`, nine letters.**

- Do not add a tagline, a category line, a location line, an "est. 2019", or any second string. The model invents a different brand name in that slot. On Wanantara the main gate rendered `TAMAN SATWA / WILDLIFE RESORT` on a site branded Wanantara, and a wayfinding sign rendered `WELDIME TO THE MILDLIFE PATH`.
- Do not leave a bracketed placeholder anywhere in the prompt. Wanantara shipped a sign rendering the literal token `[Jenis Satwa]`.
- **Fahima and Asset Forge both read the delivered PNG with the built in `Read` tool and confirm the wordmark spells `Lembayung`, before it is wired.** Reading is free per R55. A misspelling is a regenerate, not a note in the handoff.

---

## 5. Draft prompt text, Stage 1 draft, Asset Forge finalises

Two prompts. Generate them as two separate Flow generations so the knockout is a real second render rather than a filter applied to the first.

### 5.1 PRIMARY, for light backgrounds, save as `public/img/logo.png`

```
Flat vector logo on a fully transparent background, 1:1 square, 2048x2048, clean crisp edges.

MARK: an abstract sunset horizon reduced to geometry. Four solid horizontal bars stacked with
even gaps, all with square ends and zero corner rounding. The top three bars step down in width,
narrowest at the top, and read as bands of dusk sky. The fourth bar at the bottom is the widest
and reads as a ridge line. The bars carry a smooth vertical gradient running warm amber #F0A94C
at the bottom bar, through terracotta #9C4221, into deep violet #4A3573 at the top bar. The mark
sits on the left.

WORDMARK: the single word Lembayung, spelled L-e-m-b-a-y-u-n-g, set to the right of the mark and
vertically centred against it, in a warm editorial serif of medium weight with generous letter
spacing, in near black ink #1C1830. This is the only text in the image.

STYLE: flat vector brand mark, solid fills plus one linear gradient, geometric and confident,
generous clear space around the whole lockup, balanced optical weight between mark and wordmark.

NEGATIVE: no background plate, no coloured rectangle behind the logo, no white box, no photo, no
photorealism, no gradient mesh, no bevel, no emboss, no drop shadow, no outer glow, no 3D, no
texture, no grain, no rounded corners, no circular badge, no rope or roundel border, no tent
shape, no triangle, no pine tree, no mountain outline, no sun disc, no generic stock travel icon,
no script or handwritten lettering, no second line of text, no tagline, no location line, no
date, no numbers, no watermark, no signature, no mockup, no business card, no letterhead, no
presentation slide, no multiple logo variations in a grid, no misspelling.
```

### 5.2 INVERTED KNOCKOUT, for dark backgrounds, save as `public/img/logo-inverted.png`

```
Flat vector logo on a fully transparent background, 1:1 square, 2048x2048, clean crisp edges.
This is the dark background variant of the same mark, so the composition, proportions and
spacing are identical to the primary and only the colours change.

MARK: an abstract sunset horizon reduced to geometry. Four solid horizontal bars stacked with
even gaps, all with square ends and zero corner rounding. The top three bars step down in width,
narrowest at the top, and read as bands of dusk sky. The fourth bar at the bottom is the widest
and reads as a ridge line. The bars carry a smooth vertical gradient running bright amber #F0A94C
at the bottom bar into light violet #C9B8E8 at the top bar, brightened so every bar stays clearly
visible against a very dark violet background. The mark sits on the left.

WORDMARK: the single word Lembayung, spelled L-e-m-b-a-y-u-n-g, set to the right of the mark and
vertically centred against it, in a warm editorial serif of medium weight with generous letter
spacing, in warm off white #F7F3EC. This is the only text in the image.

STYLE: flat vector brand mark, solid fills plus one linear gradient, geometric and confident,
designed as a knockout for dark grounds, generous clear space around the whole lockup.

NEGATIVE: no background plate, no dark rectangle behind the logo, no coloured box, no white box,
no photo, no photorealism, no gradient mesh, no bevel, no emboss, no drop shadow, no outer glow,
no 3D, no texture, no grain, no rounded corners, no circular badge, no rope or roundel border, no
tent shape, no triangle, no pine tree, no mountain outline, no sun disc, no generic stock travel
icon, no script or handwritten lettering, no second line of text, no tagline, no location line,
no date, no numbers, no watermark, no signature, no mockup, no multiple logo variations in a
grid, no misspelling.
```

---

## 6. Favicon set

Derived **locally** by Asset Forge in Stage 6, from the delivered `public/img/logo.png`, using `sharp` or ImageMagick or Pillow. Per R63(g) this never needed an MCP and is unaffected by its removal.

**Use the mark alone, not the full lockup.** The wordmark is illegible below about 64px and turns the tab icon into grey mush. Crop the four bar mark out of the 2048 master, pad it to a square with roughly 8 percent breathing room, and export from that.

| File | Size | Notes |
| --- | --- | --- |
| `public/favicon.ico` | 16, 32, 48 multi resolution | Legacy browsers and bookmarks |
| `public/icon-16.png` | 16 by 16 | |
| `public/icon-32.png` | 32 by 32 | |
| `public/icon-48.png` | 48 by 48 | |
| `public/apple-touch-icon.png` | 180 by 180 | iOS home screen. **Opaque `--senja` `#221A3A` background**, because iOS composites transparency onto black and the violet bars would disappear. |
| `public/icon-192.png` | 192 by 192 | PWA manifest |
| `public/icon-512.png` | 512 by 512 | PWA manifest, master for the rest |

Export every size from the 512 master except the 2048 crop that produces it, so all sizes stay optically identical.

**The 16px acceptance test:** render `icon-16.png` at actual size against both a light and a dark browser chrome. If the bars merge into a single block, increase the gaps between bars in the crop and re export. This is the check that decides whether the section 1 vertical notch survives.

---

## 7. Delivery contract

Fahima attaches the finished files to the **Stage 5 Media Producer issue**, or drops them directly into the repo at `public/`.

**The filename is the contract. A wrong name is a broken asset at build time**, because this is a static export and a missing file 404s on the deployed site rather than failing the build.

| What | Exact path |
| --- | --- |
| Primary logo | `public/img/logo.png` |
| Inverted knockout | `public/img/logo-inverted.png` |

Both must be transparent PNG. Both go in the same combined bundle as the images and the hero video, per R25 and R63, not as a separate handoff.

---

## 8. How to generate (Google Flow)

Tutorial for Fahima. Bahasa Indonesia, per R23.

1. **Copy paste prompt yang sudah dirangkai.** Ambil blok prompt di bagian 5.1 (logo utama) secara UTUH, dari baris pertama sampai baris NEGATIVE terakhir, jangan cuma bagian MARK atau WORDMARK saja. Tempel ke chat input Google Flow di https://labs.google/fx/id/tools/flow/project/1e873728-41ff-4e87-ab36-3de32f6ad416, di collection bernama `lembayung`.
2. **Atur config.** Rasio **1:1**, resolusi **1K**, model **Nano Banana**.
3. **Generate.** Maksimum **4 media sekaligus**, gaboleh berbarengan lebih dari 4.
4. **Lanjut ke prompt berikutnya tanpa download dulu.** Setelah 5.1 jalan, langsung tempel blok prompt 5.2 (logo inverted) sebagai generation baru yang terpisah, jangan diedit dari hasil pertama.
5. **Kalau sudah, select generated image, download, taruh di `public/img/`** dengan nama file PERSIS: `logo.png` untuk yang versi 5.1, dan `logo-inverted.png` untuk yang versi 5.2. Salah nama = logo rusak di build.

**Satu hal yang perlu dicek sebelum download:** zoom gambarnya dan baca tulisannya. Harus terbaca **Lembayung**, sembilan huruf, huruf L besar. Kalau ada huruf yang salah, huruf yang nempel, atau ada tulisan kedua yang tidak diminta, generate ulang. Model gambar sering salah mengeja, dan ini satu satunya cara ketahuannya.

---

## 9. Stage 2 checklist for Asset Forge

- [x] **Decide on the section 1 vertical notch: dropped.** The mark already has to survive as four thin stacked bars at a 16px favicon, which is the tightest constraint in the whole spec. An off-centre notch cut through those bars adds a fine detail exactly where there is no room for one; at 16px it is far more likely to read as a broken or dirty pixel than as "the sun dropping behind the ridge." Section 1 itself says legibility at 16px wins, so it wins. The section 5 draft prompts never described a notch to begin with, so no prompt text changes as a result of this decision, and the section 6 favicon crop should treat the bar gaps, not a notch, as the thing to widen if 16px still merges.
- [x] **Finalise the two prompt blocks in section 5: confirmed as written, no edits.** Checked both against section 2 (colour pairs per ground, transparent background, no plate) and section 3 (exact hex values, 1:1 2048px, square ends, one linear gradient, Newsreader-weight serif). Both prompts hit every constraint, spell out the ground-appropriate gradient direction and wordmark ink correctly (primary `#1C1830` ink, knockout `#F7F3EC` canvas), carry the R62 single-string discipline (`Lembayung` only, no bracketed tokens), and their NEGATIVE blocks already exclude the rejected tent/pine/mountain/circular-badge shapes from section 1. Confirmed as the paste-ready text for Fahima; no notch to add or remove.
- [x] **Wordmark serif direction confirmed against Newsreader 500.** `DESIGN.md` section 4 locks Newsreader as the display face at weights 400/500/600 (500 for most headings) and explicitly deliberately-not-Fraunces, deliberately-not-single-weight. The section 5 prompts ask for "a warm editorial serif of medium weight with generous letter spacing," which is Newsreader 500 in words a text-to-image model can act on without naming a font family it cannot actually load. No change needed.
- [x] Both variants registered as rows for the combined `MEDIA.md` — see section 10 below, added for Site Architect to fold in at Stage 3.
- [x] Do **not** generate pixels. R63. Confirmed: no image tool was called, no pixel produced this stage.

---

## 10. MEDIA.md manifest rows (for Site Architect, Stage 3)

Fold these two rows in at the top of the combined manifest, ahead of the catalog rows, so the logo pair is unmistakably part of the one bundle per R25.

| # | Subject | Ratio | Model | Path | Prompt source |
| --- | --- | --- | --- | --- | --- |
| L01 | Lembayung primary lockup, horizon mark plus wordmark, light-ground gradient (amber to violet), transparent | 1:1 | Nano Banana | `public/img/logo.png` | `LOGO.md` section 5.1, verbatim |
| L02 | Lembayung inverted knockout lockup, horizon mark plus wordmark, dark-ground brightened gradient, transparent | 1:1 | Nano Banana | `public/img/logo-inverted.png` | `LOGO.md` section 5.2, verbatim |

Neither row takes the shared PHOTO DNA / NEGATIVE blocks from `DESIGN.md` section 7.2/7.3 — those are for the photographic catalog images. The logo prompts carry their own flat-vector NEGATIVE block already, which forbids the PHOTO DNA aesthetic (no photo, no photorealism, no film grain) as well as the rejected shapes. Do not append the shared photographic blocks to L01/L02.
