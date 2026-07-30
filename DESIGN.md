# DESIGN.md, Lembayung

Design system for `portfolio-lembayung`. Stage 1 output, Brand Strategist.

This file is the single source of truth for colour, type, shape, motion and photography. Stage 3 and Stage 7 implement the `:root` block as written. Stage 3 and Stage 5 copy the PHOTO DNA and NEGATIVE blocks into MEDIA.md verbatim.

**Every contrast ratio in section 3 was computed by `tools/contrast.mjs`, not estimated.** Run `node tools/contrast.mjs` to reproduce them. It exits non zero if any required pair regresses.

This system is derived from Lembayung's own category realism in `BRAND.md`, not lifted from another portfolio. Several shipped workspace sites were read only to see how token groups are conventionally named. None of them is the design basis, and the values here are all new.

---

## 1. Design thesis

**The site is a light canvas with a rationed dusk.**

Most of Lembayung is warm off white paper. Listings, rate cards, the booking panel, FAQ and articles all sit on `--kanvas`. The violet dusk ground is spent deliberately and sparingly: the hero, the footer, and at most two atmosphere bands per page. That ratio is the design, and it is what stops the build drifting into the tired brown cabin look described in `BRAND.md` section 1.3.

Three formal moves carry it:

1. **Zero radius, everywhere.** R10. Sharp corners on cards, buttons, inputs, image frames, chips and the calendar. The only oval on the entire site is the floating WhatsApp button. Combined with hairline rules instead of soft shadows, this reads as a printed field guide, not a booking SaaS.
2. **A cool dark against warm accents, never a warm wash.** The dark ground is a blue violet. Amber and terracotta only ever appear on top of it, as fire and sun. If a page reads broadly brown, that page is wrong.
3. **The terrace as a layout motif.** The property is five stepped terraces, and sections step with it: alternating bands offset by a consistent 24px horizontal indent on desktop, with a 1px `--garis` rule at each step. It is quiet, it is unique to this brand, and it costs nothing.

---

## 2. Colour tokens

Copy this block as written.

```css
:root {
  /* ---- Dusk. The dark ground. Rationed: hero, footer, max two bands per page. ---- */
  --senja:              #221A3A;  /* primary dark surface */
  --senja-pekat:        #15102A;  /* footer, deepest surface */
  --lembayung:          #4A3573;  /* signature violet: filled secondary button, active state */
  --lembayung-tua:      #3A2A5C;  /* violet as TEXT or LINK on LIGHT grounds; violet button hover */
  --lembayung-terang:   #C9B8E8;  /* violet as TEXT or LINK on DARK grounds  [inverted pair] */

  /* ---- Fire and earth. Accents only, never a large surface. ---- */
  --bara:               #F0A94C;  /* amber. DARK GROUND ONLY. eyebrow, icon, accent rule */
  --bara-tua:           #96500B;  /* amber. LIGHT GROUND ONLY.                [inverted pair] */
  --tanah:              #9C4221;  /* terracotta. FILL ONLY, always carries white text */

  /* ---- Pine. This is ALSO the sales CTA (R5), by construction. See note below. ---- */
  --pinus:              #1E6B45;  /* sales CTA fill; green text and icon on LIGHT ground */
  --pinus-tua:          #155134;  /* CTA hover and active */
  --pinus-terang:       #4FAE7C;  /* green text on DARK ground              [inverted pair] */

  /* ---- Canvas and stone. The light ground, and the site default. ---- */
  --kanvas:             #F7F3EC;  /* page canvas */
  --kanvas-2:           #EDE6DA;  /* alternating band, card ground on canvas */
  --putih:              #FFFFFF;  /* cards, inputs, calendar cells */
  --batu:               #D8D0C4;  /* stone chip, muted fill, disabled track */
  --kabut:              #BDB4D2;  /* mist. secondary TEXT on DARK ground     [inverted pair] */

  /* ---- Ink. ---- */
  --tinta:              #1C1830;  /* primary text on light grounds */
  --tinta-lembut:       #4E4866;  /* secondary text on light grounds         [inverted pair] */

  /* ---- Lines, focus, state. Each has an explicit dark ground counterpart. ---- */
  --garis:              #E2DACC;                    /* decorative hairline, LIGHT. never a control border */
  --garis-inv:          rgba(247, 243, 236, 0.22);  /* decorative hairline, DARK */
  --garis-tegas:        #8A8098;                    /* input and control border, LIGHT */
  --garis-tegas-inv:    rgba(247, 243, 236, 0.62);  /* input and control border, DARK */
  --fokus:              #4A3573;                    /* focus ring, LIGHT */
  --fokus-inv:          #F0A94C;                    /* focus ring, DARK */
  --bahaya:             #A32318;                    /* form error, LIGHT */
  --bahaya-terang:      #FF9182;                    /* form error, DARK */

  /* ---- Hero scrim. R2: the 8s video must stay clearly visible. ---- */
  --scrim-dari:         rgba(28, 24, 48, 0);
  --scrim-ke:           rgba(28, 24, 48, 0.55);     /* peak alpha 0.55, and only over the copy block */

  /* ---- Elevation. Deliberately almost none. ---- */
  --bayang:             0 1px 0 0 rgba(28, 24, 48, 0.10);   /* card, a hard hairline lift */
  --bayang-kuat:        0 -12px 32px -20px rgba(28, 24, 48, 0.50); /* sticky booking bar ONLY */
}
```

### Why pine and the sales CTA are the same green

R5 requires sales CTAs to be green and to not clash. A palette that carries a decorative forest green **and** a separate CTA green has two greens competing, and the CTA stops being a signal.

So on this build the pine green **is** the CTA green. `--pinus` is the only green in the system. It follows that:

- **`--pinus` is never used as a large surface or a section band.** If it were, a green CTA could land on a green ground and vanish.
- `--pinus` as text or an icon on a light ground is allowed, and is used for confirmation states, the availability tick, and included item ticks in package lists.
- Every sales and conversion button on the site is `--pinus` with `--putih` text, hovering to `--pinus-tua`.

### Role of every token

| Token | Used for | Hard limits |
| --- | --- | --- |
| `--senja` | Hero ground, dark atmosphere bands | Max two bands per page outside hero and footer |
| `--senja-pekat` | Footer, modal backdrop base | |
| `--lembayung` | Filled secondary button, active nav item, selected calendar range fill | Never body text |
| `--lembayung-tua` | Links and eyebrows on light grounds, secondary button hover | **Never on a dark ground, 1,30:1** |
| `--lembayung-terang` | Links and eyebrows on dark grounds | **Never on a light ground** |
| `--bara` | Eyebrow, icon, accent rule on dark grounds. Dark text sits on it when used as a button fill | **Never as text on a light ground, 2,04:1 on kanvas** |
| `--bara-tua` | Amber accent text on light grounds, rating stars, price emphasis | **Never on a dark ground, 2,70:1** |
| `--tanah` | Badge and tag FILL carrying white text: "Sisa 2 unit", "Weekday", "Baru" | Fill only, never a text colour |
| `--pinus` | **Sales CTA fill (R5)**, green text and icons on light grounds | Never a section band |
| `--pinus-tua` | CTA hover, focus, pressed | |
| `--pinus-terang` | Green text and ticks on dark grounds, `.btn-outline-inv` label | **Never on a light ground, 2,20:1** |
| `--kanvas` | Page canvas. Also the body text colour ON dark grounds | |
| `--kanvas-2` | Alternating section band, card ground when the card sits on `--kanvas` | |
| `--putih` | Cards on `--kanvas-2`, inputs, calendar cells, CTA label | |
| `--batu` | Muted chip fill, disabled track, image placeholder ground | Text on it must be `--tinta` |
| `--kabut` | Secondary text on dark grounds | **Never on a light ground, 1,79:1** |
| `--tinta` | Body text and headings on light grounds | |
| `--tinta-lembut` | Secondary text, captions, meta on light grounds | **Never on a dark ground, 1,91:1** |
| `--garis` / `--garis-inv` | Decorative hairline only | **Not a control border**, fails 3:1 as one |
| `--garis-tegas` / `--garis-tegas-inv` | Input, select, checkbox and control borders | |
| `--bahaya` / `--bahaya-terang` | Form error text and border | |

---

## 3. Contrast, measured

Produced by `node tools/contrast.mjs`. Thresholds per R20(c): **4,5:1** for normal text, **3:1** for large text and UI components. Alpha tokens are composited over the real ground before measuring, per R20(b).

### 3.1 Light ground

| Foreground | Ground | Ratio | Need |
| --- | --- | --- | --- |
| `--tinta` | `--kanvas` | 15,53 | 4,5 |
| `--tinta-lembut` | `--kanvas` | 7,77 | 4,5 |
| `--lembayung-tua` | `--kanvas` | 11,40 | 4,5 |
| `--bara-tua` | `--kanvas` | 5,50 | 4,5 |
| `--tanah` | `--kanvas` | 5,91 | 4,5 |
| `--pinus` | `--kanvas` | 5,85 | 4,5 |
| `--garis-tegas` | `--kanvas` | 3,38 | 3 |
| `--bahaya` | `--kanvas` | 6,75 | 4,5 |
| `--tinta` | `--kanvas-2` | 13,85 | 4,5 |
| `--tinta-lembut` | `--kanvas-2` | 6,93 | 4,5 |
| `--lembayung-tua` | `--kanvas-2` | 10,17 | 4,5 |
| `--bara-tua` | `--kanvas-2` | 4,91 | 4,5 |
| `--pinus` | `--kanvas-2` | 5,22 | 4,5 |
| `--tinta` | `--putih` | 17,17 | 4,5 |
| `--tinta-lembut` | `--putih` | 8,60 | 4,5 |
| `--garis-tegas` | `--putih` | 3,74 | 3 |
| `--tinta` | `--batu` | 11,24 | 4,5 |

### 3.2 Dark ground

| Foreground | Ground | Ratio | Need |
| --- | --- | --- | --- |
| `--kanvas` | `--senja` | 14,87 | 4,5 |
| `--kabut` | `--senja` | 8,32 | 4,5 |
| `--lembayung-terang` | `--senja` | 9,01 | 4,5 |
| `--bara` | `--senja` | 8,21 | 4,5 |
| `--pinus-terang` | `--senja` | 6,01 | 4,5 |
| `--bahaya-terang` | `--senja` | 7,54 | 4,5 |
| `--garis-tegas-inv` | `--senja` | 6,49 | 3 |
| `--kanvas` | `--senja-pekat` | 16,66 | 4,5 |
| `--kabut` | `--senja-pekat` | 9,32 | 4,5 |
| `--lembayung-terang` | `--senja-pekat` | 10,10 | 4,5 |
| `--bara` | `--senja-pekat` | 9,20 | 4,5 |
| `--pinus-terang` | `--senja-pekat` | 6,74 | 4,5 |
| `--garis-tegas-inv` | `--senja-pekat` | 6,90 | 3 |
| `--kanvas` | `--lembayung` | 9,27 | 4,5 |
| `--bara` | `--lembayung` | 5,12 | 4,5 |

### 3.3 Filled controls

| Foreground | Ground | Ratio | Need |
| --- | --- | --- | --- |
| `--putih` | `--pinus` | 6,47 | 4,5 |
| `--putih` | `--pinus-tua` | 9,30 | 4,5 |
| `--putih` | `--lembayung` | 10,25 | 4,5 |
| `--putih` | `--lembayung-tua` | 12,61 | 4,5 |
| `--tinta` | `--bara` | 8,57 | 4,5 |
| `--putih` | `--tanah` | 6,53 | 4,5 |

### 3.4 Dual ground pairs, the mandatory part

This is the section that exists because of the Wanantara R20 failure, where `.btn-outline` measured 8,85:1 on cream and **1,52:1** on dark green, because one class was reused on both grounds with no inverted variant.

**Rule, binding on Stage 3 and Stage 7: any class that can appear on both a light and a dark ground MUST ship two variants.** The `-inv` variant is not optional and is not a nice to have.

| Class | Light ground variant | Ratio on `--kanvas` | Dark ground variant | Ratio on `--senja` |
| --- | --- | --- | --- | --- |
| `.btn-outline` | label `--pinus`, border `--garis-tegas` | 5,85 | `.btn-outline-inv`, label `--pinus-terang`, border `--garis-tegas-inv` | 6,01 |
| `.link` | `--lembayung-tua` | 11,40 | `.link-inv`, `--lembayung-terang` | 9,01 |
| `.eyebrow` | `--bara-tua` | 5,50 | `.eyebrow-inv`, `--bara` | 8,21 |
| `.muted` | `--tinta-lembut` | 7,77 | `.muted-inv`, `--kabut` | 8,32 |
| control border | `--garis-tegas` | 3,38 | `--garis-tegas-inv` | 6,49 |
| logo | `public/img/logo.png` | n/a | `public/img/logo-inverted.png` (R43) | n/a |

**And the proof that the pairs are necessary.** The checker also asserts that each light ground variant **fails** on the dark ground. If one of these ever starts passing, the checker prints `LEAK!` and exits non zero, which means the palette drifted and the pair needs rethinking.

| Reused wrongly | Ground | Ratio | Verdict |
| --- | --- | --- | --- |
| `--pinus` | `--senja` | 2,54 | correctly fails |
| `--lembayung-tua` | `--senja` | 1,30 | correctly fails |
| `--bara-tua` | `--senja` | 2,70 | correctly fails |
| `--tinta-lembut` | `--senja` | 1,91 | correctly fails |

One honest exception, recorded rather than hidden: `--garis-tegas` measures **4,40:1** on `--senja`, so it does clear the 3:1 UI threshold on both grounds. That is normal for a mid tone neutral and is not the Wanantara failure class, which was a saturated brand colour tuned for one ground. `--garis-tegas-inv` therefore exists for visual quality, a warm hairline reading correctly against dusk, rather than for compliance. It is flagged FYI in the checker, not asserted as a must fail pair.

### 3.5 What Stage 7 and Stage 8 still have to do

`tools/contrast.mjs` proves the **palette** is sound. It cannot prove the **implementation** is. R20(a) still requires a programmatic, sitewide, every route sweep of computed styles in a real browser, compositing the effective background up the ancestor chain, skipping `disabled` and `aria-disabled` controls per R20(d). Copy `scripts/qa-setup.mjs` and `scripts/qa-check.mjs` from `portfolio-wanantara` rather than reinventing them, and note per R51 that the browser can be brought up in userspace on this runtime.

---

## 4. Typography

Two families, both variable, both self hosted through `next/font` so there is no layout shift and no third party request.

| Role | Family | Weights used | Notes |
| --- | --- | --- | --- |
| Display, h1 to h3, pull quotes | **Newsreader** | 400, 500, 600, plus 400 italic | Warm editorial serif with a low key literary feel. Reads as a place with a story, not a resort chain. Italic is reserved for pull quotes and the tagline. |
| UI, body, h4 to h6, all numerals | **Figtree** | 400, 500, 600, 700 | Geometric humanist sans, tall x height, holds up at 13px in the rate table. |

Deliberately **not** Fraunces, which is Simpul's display face, and deliberately not a single weight display face, because a 40 route site needs real heading hierarchy.

```css
:root {
  --font-display: 'Newsreader', Georgia, 'Times New Roman', serif;
  --font-ui: 'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif;
}
```

### Scale

Fluid between 375px and 1440px. Line height tightens as size grows.

| Step | Mobile | Desktop | Family / weight | Used for |
| --- | --- | --- | --- | --- |
| `--t-hero` | 40px | 76px | Newsreader 500, lh 1,04, ls -0,02em | Hero h1 only |
| `--t-h1` | 32px | 52px | Newsreader 500, lh 1,10, ls -0,015em | Page h1 |
| `--t-h2` | 26px | 38px | Newsreader 500, lh 1,15 | Section heading |
| `--t-h3` | 21px | 27px | Newsreader 600, lh 1,25 | Card title, unit name |
| `--t-h4` | 17px | 19px | Figtree 700, lh 1,35 | Sub heading, table heading |
| `--t-body` | 16px | 17px | Figtree 400, lh 1,65 | Body copy, max 68ch |
| `--t-kecil` | 14px | 14px | Figtree 400, lh 1,55 | Caption, meta, helper text |
| `--t-eyebrow` | 12px | 12px | Figtree 700, lh 1,2, ls 0,14em, uppercase | Eyebrow, section label |
| `--t-harga` | 22px | 26px | Figtree 700, lh 1,1, `tnum` | Price |

**Numerals.** Every price, date, capacity and calendar cell sets `font-feature-settings: "tnum" 1; font-variant-numeric: tabular-nums;`. Prices in a rate table must align on the digit, not on the glyph.

### Typographic rules

- Body copy caps at **68ch**. Article body at **72ch**.
- Never centre a paragraph longer than two lines.
- Uppercase only at `--t-eyebrow`, and always with the 0,14em tracking, never uppercase a heading.
- Newsreader italic is for pull quotes and the tagline only, never for emphasis inside body copy, which uses Figtree 600.

---

## 5. Shape, spacing, motion

### Shape, R10

**Border radius is `0` on every element on this site.** Cards, buttons, inputs, selects, chips, badges, images, image frames, modals, the drawer, the calendar, the toast. The single exception permitted by R10 is the floating WhatsApp button, which is an oval.

```css
* { border-radius: 0; }
.wa-float { border-radius: 999px; } /* the only exception R10 allows */
```

R45 note for Stage 7: on desktop at 1025px and up the floating WhatsApp control renders as `[icon] + label`, a pill reading the WhatsApp mark followed by **Chat Kami**, collapsing to the icon only oval below 1025px. The icon is the shared asset copied to `public/img/whatsapp.png` per R17, never a hand drawn SVG.

### Spacing

8px base. Allowed steps: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`. Section padding is 64px mobile, 112px desktop. The terrace motif indents alternating bands by 24px on desktop only, never on mobile where it would eat the gutter.

Gutter is 20px at 375px, 24px from 768px, 32px from 1025px. Content max width 1200px, article measure 760px.

### Elevation

Almost none, and by intent. Cards are separated by a 1px `--garis` rule plus `--bayang`, which is a single hard hairline, not a blur. `--bayang-kuat` is permitted on exactly one element, the sticky mobile booking bar, so it reads as floating above the page.

### Motion

- Duration 150ms to 300ms. Easing `cubic-bezier(0.22, 0.61, 0.36, 1)`.
- **Every route change animates**, R46. Short fade plus 8px rise on the incoming page.
- **Scroll reveal**, R24 and R34. The revealed state must out rank every hide rule by specificity, written as `.reveal.in, .js .reveal.in { opacity: 1; transform: none; }`. Do **not** add a `.js .reveal { opacity: 0 }` hide rule. The observer must be paired with a `MutationObserver` on `document.body` so nodes inserted after mount are revealed too. Clone the reveal block from `portfolio-kilau/src/components/ClientEffects.tsx`, **not** from MilkyBreeze, whose version still has the mount only scan.
- Every animation respects `prefers-reduced-motion: reduce` by dropping to opacity only, or to nothing.

### Focus

3px solid ring, 2px offset, `--fokus` on light grounds and `--fokus-inv` on dark. Never `outline: none` without a replacement.

---

## 6. Component notes that bind downstream

Stated here because each maps to a hard gate.

- **Dropdowns and selects, R12.** No native `<select>` anywhere. Custom animated component, grid-rows 0fr to 1fr plus a rotating chevron, `role="listbox"` and `role="option"`, keyboard on ArrowUp, ArrowDown, Enter, Escape, with a hidden input carrying the form value. Reuse `Himaystudio/src/components/Select.tsx`.
- **Date fields, R21.** This build is a booking site, so it lives or dies on the date picker. Never a free text date input. A custom range picker with a calendar grid, arrow key navigation, Enter and Escape, disabled past dates, and a visible selected range. Disabled past dates are exempt from the R20 contrast sweep per R20(d), which matters here because a month view floods the report otherwise.
- **Navbar dropdowns, R16, R16.1, R32.** One to three top level items open a mega panel. Opens on **hover** on desktop and also on click, focus and keyboard. The leftmost panel anchors `left: 0`, the rightmost anchors `right: 0`, and **every** panel carries `max-width: calc(100vw - 2rem)`. Collapses into the hamburger drawer below 1025px.
- **Closed panels still occupy layout, R57.** Every absolutely positioned panel, including the date picker, is `display: none` when closed, not merely `opacity: 0`. A faded panel still contributes to `scrollWidth` and produces an overflow that appears in no screenshot.
- **Overlays escape filtered ancestors, R53.** The header is translucent with `backdrop-filter`, which makes it the containing block for any `position: fixed` descendant. The drawer, the welcome modal, the gallery lightbox and the toast layer are therefore rendered as siblings of the header or portaled to `document.body`, never nested inside it.
- **Title plus label never glue, R50.** In every mega menu item, card and table row, the secondary label is its own block level element with an explicit gap, its own size and its own contrast. Verify by reading `innerText` line by line, never `textContent`. This includes the brand lockup itself: the category line `LEMBANG, BANDUNG UTARA` under the wordmark must be `display: block`, or it renders as `LembayungLEMBANG, BANDUNG UTARA`.
- **Gallery, R18.** Six unit types carry four images each specifically so the detail page gallery has something real to swap. Thumbnails are real buttons, Tab reachable, Enter and Space activate, the active thumbnail carries a visible ring, and the main image crossfades rather than jumping.
- **Mobile carousels, R48.** At 768px and below, any container with more than three peer card children is a `.snap-row`, `overflow-x: auto` plus `scroll-snap-type: x mandatory`, item width around 82vw. This applies on **every** route, including related items on detail pages, not just the home page. For long index routes, group by category and carousel within each group, which is the pattern `portfolio-mabrur` got right on `/paket/`.

---

## 7. Art direction

### 7.1 The look in one paragraph

A west facing pine slope in Lembang, photographed either in low mist at 06.30 or in the twenty minutes of amber into violet light at 17.30. Terraced ground, stone steps, red earth, guy lines under tension. Canvas and raw timber against cool blue shadow. One warm light source per frame, the sun, a fire, or a lamp behind a canvas wall. Real Indonesian guests in jackets, doing something, not posing. Everything slightly used: creased bedding, a damp deck, a mug already drunk from.

### 7.2 PHOTO DNA, R33

Shared block. Site Architect and Media Producer append this to **every** image prompt, verbatim and unedited. It never replaces the per asset SUBJECT block required by R49.

```
PHOTO DNA:
Shot on a 35mm prime at f/2.0 on a full frame body, handheld at standing eye level, slight
natural tilt. Natural light only, one of three: low golden hour sun raking in from the west
across the valley at 17.30, or soft overcast highland daylight diffused through pine canopy at
06.30 with low mist sitting in the valley, or the warm pool of a single bonfire and the string
bulbs on a cabin deck at blue hour. Believable shallow depth of field, the subject sharp and the
pine ridge and far valley falling soft. Fine 35mm film grain, gentle highlight roll off, mild
lens flare where the sun clips the frame. Real imperfection everywhere: creased bedding, a damp
deck board, mud on a boot, a half drunk enamel mug, dew beaded on canvas, a stray pine needle,
woodsmoke haze in the air, a guy line under visible tension. Real Indonesian people, unposed and
mid gesture, ordinary weekend clothing and jackets, natural skin texture with visible pores and
stray hair. Colour: cool violet blue in the shadows, warm amber in the highlights, muted greens,
nothing neon, nothing HDR.
```

### 7.3 NEGATIVE, R33

Appended to every image prompt, verbatim.

```
NEGATIVE:
plastic or waxy skin, over smoothed surfaces, airbrushed faces, hyper saturation, HDR clipping,
symmetrical reflections, faux bokeh halos, warped or melted labels, misspelled signage, extra or
merged fingers, six fingers, floating objects, objects with no shadow, too perfect symmetry,
artificial studio smear, CGI render, 3D render, architectural visualisation, video game lighting,
unreal engine, stock photo watermark, text overlay, logo watermark, cartoon, illustration,
painting, plastic looking foliage, fake looking fire, empty showroom interior with no human
trace, hotel precise bed styling, mown flat golf course lawn, tent pitched on flat open grass
with no slope and no canopy, harsh vertical midday sun, iron bars, bare concrete slab ground,
snow, autumn maple leaves, european alpine chalet, tropical beach.
```

The last five entries are specific to this build. Image models drift toward alpine chalets and autumn colour the moment they read "cabin", and toward a beach the moment they read "resort". Lembang is tropical highland: pine, tea, red earth, mist, no snow, no maples.

### 7.4 Text inside images, R62

Every generated image that could contain a legible string follows this, without exception.

1. **At most one sharp string per frame.** Everything else, a schedule board, a menu, a clipboard, an information sign, a paragraph on a placard, stays in frame but is thrown out of focus, angled away, or partly occluded.
2. **The brand name is the only string ever written sharp**, and it is written into the prompt verbatim as `Lembayung`. It is never accompanied by a sharp tagline or category line, because the model will invent a second brand name in that slot. On Wanantara the main gate rendered `TAMAN SATWA / WILDLIFE RESORT` on a site branded Wanantara, and a sign rendered `WELDIME TO THE MILDLIFE PATH`.
3. **Never leave a bracketed token in a prompt.** No `[nama unit]`, no `{brand}`, no `[Jenis]`. Wanantara shipped a sign that rendered the literal token `[Jenis Satwa]`.
4. **Verification is a pixel read, and it is free per R55.** Media Producer opens every text bearing image with the built in `Read` tool and reads the rendered words back verbatim before wiring it. The generation call succeeding and the file landing at the right path are not evidence about what the image says.
5. A defect is a regenerate with the composition tightened, up to the R33 retry budget, moving the text further out of focus or out of frame.

### 7.5 Hero video, R30 and R44

Mandatory, and a hard deploy gate. `public/video/hero-lembayung.mp4`, Veo Lite, 8 seconds, 16:9, 720p or better, muted autoplay loop. Generated by Fahima Fauziah in Google Flow per R63, in the same single combined bundle as the images and the logo. A poster only hero is a failed build unless the owner approves it in writing for this specific site.

**Brief for the clip:** one continuous slow push in, no cuts. Open on the terraced pine slope at 17.30 with the valley toward Bandung amber below. Mist drifting left to right across the middle terraces. The communal fire at Plaza Bara catches and lifts in the lower third. Warm lamp light comes up in two cabin windows as the sky above shifts from amber into violet. No people in close up, at most two distant silhouettes on a deck. No text, no logo, no titles.

**Scrim contract, R2.** The clip must stay clearly visible. No full section wash above roughly 30 percent opacity. Legibility comes from a localised translucent panel behind the copy block only, plus a bottom up gradient that peaks at `--scrim-ke`, alpha 0,55, and only under the text. Any decorative overlay carries `pointer-events: none` and sits below the interactive content's z index.

### 7.6 Asset budget

Parent brief caps the manifest at 45 to 55 rows because every pixel is generated by hand, four at a time. Planned split, and Site Architect should hold this shape:

| Group | Rows |
| --- | --- |
| Logo, primary plus inverted knockout (R43) | 2 |
| Hero video (R30, R44) | 1 |
| 6 unit types, 4 images each: exterior, interior, deck or bathroom, detail (R41, R18) | 24 |
| 5 packages, 1 each | 5 |
| 8 activities and facilities, 1 each | 8 |
| 6 articles, 1 cover each | 6 |
| Property wide: aerial of the terraces, Plaza Bara at dusk, the reception and gate | 3 |
| Open Graph share image | 1 |
| **Total** | **50** |

A smaller manifest is not licence to recycle a prompt. Every one of those 50 rows carries its own distinct SUBJECT block per R49, and the count of SUBJECT blocks must equal the count of asset paths.

---

## 8. Accessibility floor

- WCAG AA on every control on every route, R20. Section 3 proves the palette; Stage 7 and Stage 8 must prove the implementation with a browser sweep.
- Tap targets 44 by 44px minimum, with real gaps between them in the mobile topbar, R47.
- `aria-expanded` must be **true** whenever a panel is visibly open, R60. Do not pair an `onFocus` opener with an `onClick` toggler on the same trigger, they cancel on a real click and leave the panel visually open while reporting collapsed.
- Every image carries meaningful Indonesian alt text. Decorative images carry `alt=""` and `aria-hidden="true"`.
- Visible focus everywhere, keyboard reachable everything, logical tab order.
- The welcome modal, R13, traps focus, closes on the X button, Escape and backdrop click, and **fully unmounts** on close so it leaves no invisible click trapping layer.

---

## 9. Quick reference for Stage 3 and Stage 7

- Zero radius everywhere, one oval, the WhatsApp button.
- Light canvas is the default ground. Dusk is rationed.
- One green, and it is the sales CTA.
- Every dual ground class ships an `-inv` variant. The list is in 3.4 and it is not optional.
- No em dash and no en dash, including entity forms, in any rendered string.
- Prices `Rp 1.250.000`. Times `17.30`. Capacity `2 pax`.
- Run `node tools/contrast.mjs` after any palette edit. It exits non zero on a regression.
