# LAYOUT-ARCHITECTURE.md, Lembayung

Stage 3 output, Site Architect. This is the record of what was decided and **why this shape and not
another**, so Stage 4 and Stage 7 extend the build instead of guessing at it.

MilkyBreeze and portfolio-wanantara were read as REFERENCE for the stack and for the corrected
component patterns. Neither is the layout basis. Every layout decision below is specific to an
accommodation booking site on a terraced slope, and several of them are deliberately the opposite of
what the reference does.

---

## 1. Scope boundary, read this before touching anything

**Stage 3 owns the MARKETING SITE.** That is `/` and every marketing route, the shared shell
(`layout.tsx`, `Header`, `Footer`, `AnnouncementBar`, `globals.css`, `site.css`) and the shared
components in `src/components/`.

**Stage 3 does NOT own `/app`.** The reservation panel, the login and the guest portal are the R8
requirement on this build and they belong to **Webapp Architect (HIM-319)**, built to the app
standard: left sidebar, multiple views, action buttons on the left, simple. No placeholder route was
scaffolded under `/app` either, because that would collide with them.

The marketing site does LINK to three of their routes, and those links are declared in exactly ONE
place so Stage 4 can see the contract without reading every page:

```ts
// src/data/links.ts
export const APP_ROUTES = {
  panel:  '/app/',          // reservation panel, the R8 dashboard
  masuk:  '/app/masuk/',    // demo login
  portal: '/app/portal/',   // guest portal, booking code resolves to a stay
};
```

They appear in the `Rencanakan` mega panel, the footer `Reservasi` column, the home closing CTA and
the contact sidebar. Per R14 these are NAVIGATION and demo-feature links, so they stay functional and
are never WhatsApp leads. `scripts/qa-check.mjs` reports them as `R59 PENDING on Stage 4` rather than
as broken links; **Stage 8 must see them resolve to 200 before deploy.**

`src/app/robots.ts` disallows `/app/`, because a reservation panel and a guest portal are not search
results anybody wants, and `src/app/sitemap.ts` deliberately omits them.

---

## 2. Stack, and what was absorbed rather than replaced

Next.js 16 App Router, TypeScript, Tailwind v4 (`@import "tailwindcss"`), static export
(`output: 'export'`, `images.unoptimized`, `trailingSlash: true`), deploy folder `out/`, plain `<img>`
and never `next/image`, fonts through `next/font/google`.

Stage 1 shipped a provisional `package.json` and `tsconfig.json` so its data modules could actually
be typechecked. Per `HANDOFF.md` those were **merged, not replaced**:

- `contrast`, `validate:content` and `check` scripts are intact and still pass.
- `paths: { "@/*": ["./src/*"] }` is intact, `@/data` still resolves.
- `deploy` runs `rm -rf out .next` before `next build` (R61) and passes
  `--project-name=himaystudio-portfolio-lembayung` (the name locked by the parent issue).

Two generated files, both written by scripts and both committed so a clean checkout typechecks:

| File | Written by | Why |
| --- | --- | --- |
| `src/data/media.generated.ts` | `scripts/gen-media.mjs`, the `prebuild` hook | Lists every file actually under `public/`, so `<Media>` can gate on the real filesystem (R15) |
| `MEDIA.md` | `scripts/gen-manifest.mjs` | Rendered from `src/data/media.ts`, so the manifest and the on page placeholders cannot drift (R49) |

---

## 3. Navbar: split nav with three mega panels

**Variant chosen: split nav.** Logo left, four nav items centred, actions right. Not a minimal centred
nav, because the catalog genuinely needs depth (6 unit types, 5 packages, 8 activities, 3 policy
pages), and not a sticky pill, because R10 forbids the radius that pattern is built on.

Three of the four items open a mega panel, mapped to the three audiences in `BRAND.md` section 2:

| Item | Panel | Audience it serves | R16.1 anchor |
| --- | --- | --- | --- |
| **Menginap** | 6 unit types, 5 packages, plus a green WhatsApp highlight | couples deciding on photographs | `left`, grows right |
| **Pengalaman** | 4 kegiatan, 4 fasilitas, plus a galeri highlight | families deciding whether the child will be bored | `center`, clamped |
| **Rencanakan** | lokasi, FAQ, 2 policies, 3 reservation routes, plus a gathering highlight | panitia deciding on capacity and a quotation | `right`, grows left |
| Cerita | plain link | | |

### The five things about this navbar that are load bearing

**R32 hover plus everything else.** Panels open on hover on desktop with a 140ms close delay so the
pointer can travel from trigger into panel. They also open on click, on keyboard focus, and on
ArrowDown, and they close on Escape and outside click.

**R60, and this is the subtle one.** `aria-expanded` is bound to `openPanel`, the SAME state the CSS
`.nav-item.is-open` class reads. There is **no** `:hover .mega` or `:focus-within .mega` rule anywhere
in `site.css`. On Mabrur all three triggers reported `aria-expanded="false"` while measuring fully
open, because CSS opened the panel behind the state's back.

**R60(b), the onFocus / onClick cancellation.** A bare `onFocus` opener paired with an `onClick`
toggler cancels itself on a real click, because a click focuses FIRST: focus opens, click toggles
shut. On a hover capable pointer that is invisible, but **on touch at 1025px and up, where there is
no hover, the tap then never latches the panel open at all.** The fix here is `:focus-visible` as the
discriminator: browsers set it for keyboard focus and withhold it for a pointer press, so keyboard
focus opens the panel and a pointer press leaves the toggle to `onClick`. See `Header.tsx`.

**R16.1 geometry, in three layers.** The CSS anchor fixes which direction a panel grows. Every panel
carries `max-width: calc(100vw - 2rem)` as a hard guard. And `useViewportClamp` (in `src/lib/clamp.ts`)
measures the open panel and writes `--mega-shift` so it nudges back into bounds without breaking the
growth direction, because a nav item that owns a panel is never flush with a viewport edge. Measured
at 1025px: panels at `left 217..1009`, `217..1009`, `16..808` in a 1025px window, no page overflow.

**`width: max-content` on `.mega` is load bearing, do not delete it as redundant.** `overflow: hidden`
makes that box a scroll container, and a scroll container has an automatic minimum size of zero, so an
absolutely positioned box with `left` set and `width: auto` shrink-to-fits to the AVAILABLE width
(the ~110px parent `<li>`) instead of to its content. **Measured on this build without that line: the
panel rendered 124px wide and clipped every label mid word** (`Lokasi dan Rut`, `Pertanyaan Ur`) while
passing every positional assertion, because it was inside the viewport and caused no page overflow. It
was only visible in a screenshot. That is R51 in one line, and `scripts/qa-check.mjs` now also asserts
`scrollWidth === clientWidth` on the panel so the next build cannot ship it.

**R53, and the drawer.** The header sets `backdrop-filter`, which makes it the containing block for
every `position: fixed` DESCENDANT. So the scrim and the drawer are rendered as SIBLINGS of
`<header>`, and the welcome modal, the floating CTA and the WhatsApp oval portal themselves to
`document.body`. z-index is neither the cause nor the cure. Verified by measurement, not by reading
CSS, because the CSS is identical in the broken and the correct case: the drawer measures
`top 0, height 800` in an 800px viewport, not a 76px strip.

**R47 / R52, mobile topbar.** At mobile widths the topbar holds exactly `[logo] [burger]`, one clean
flex row, `space-between`, 76px fixed height, both tap targets 44px, and the logo appears exactly
once (asserted). The booking CTA is in the drawer footer per R22, not squeezed into the bar.

---

## 4. Home page section order

hero video → availability panel → the 17.30 ritual → six unit types → five terraces → five packages →
kegiatan and fasilitas (two grouped carousels) → four honest notes → eight testimonials → three
articles → FAQ preview → closing CTA.

The **availability panel sits second, immediately under the hero**, before any storytelling. On an
accommodation site the visitor's first question is "is my date free", and burying that under three
scroll-lengths of atmosphere is the commonest failure of this vertical.

The **17.30 ritual band comes third**, because it is the positioning (`BRAND.md` 1.2: nobody in
Lembang owns senja) and it has to land before the catalog, not after it.

**Dusk is rationed, per `DESIGN.md` section 1.** On the home page the dark ground is the hero, the
17.30 band, the closing CTA band, and the footer. Everything else is the light canvas. Interior pages
get `.pagehero` plus at most two `.band-dark` sections. If a page reads broadly dark, that page is
wrong, and if it reads broadly BROWN it has failed `BRAND.md` 1.3 entirely.

---

## 5. Patterns chosen per the skill's decision points

### Cart pattern: not applicable, replaced by a booking pattern

There is no cart. Accommodation is not a packaged good, so the equivalent decision is how a stay is
collected, and this build uses three surfaces:

1. **`BookingPanel`** (`layout="inline"`), an inline row of date range + unit + pax + green CTA. It
   appears on the home page, `/unit/`, every unit detail page, and every package detail page.
2. **A sticky mobile booking bar** on unit detail pages only, carrying the starting price and a
   `Pesan {unit}` CTA. This is the ONE element in the whole design system allowed `--bayang-kuat`
   (`DESIGN.md` 5). `site.css` reserves 72px of body padding and lifts the WhatsApp oval to 76px so
   neither tap target is ever covered.
3. **`KontakForm`** for the longer enquiry, including the quotation path for audience 3.

All three route to WhatsApp through `waLink()` (R14) with the chosen dates, unit and headcount already
in the message body. There is no backend on a static export, and this is what a real client wants
anyway.

### Shop mode: rate card list, not an ecommerce grid

Neither of the skill's two modes fits, so this is the hybrid the category actually needs.

`/unit/` is a **rate card list**: large 1:1 image, unit name, structure line, capacity and view chips,
bathroom, and a `mulai dari` starting price. No add-to-cart, because you cannot add a night to a cart
without a date. Under the cards sits the **full rate table for all fifteen variants**, weekday and
weekend, rather than hiding it behind a click, because a weekend surcharge discovered at checkout is
the single most common complaint in this vertical and `BRAND.md` 3 rule 2 says to say it out loud.

### News layout: main column plus RIGHT sidebar

`/cerita/[slug]/` is a main article column with a sticky right sidebar carrying `Artikel Lainnya` plus
a small `Cek tanggal` conversion card. Not a flat feed. The sidebar stacks under the article below
1025px. `/cerita/` groups by the four categories in the data and carousels within each group.

### Education layout

Folded into `/cerita/` rather than given its own route. The six articles ARE the education layer, and
`Panduan` and `Tips` are two of the four categories.

### Footer variant

Dark `--senja-pekat`, five columns (brand plus contact, then four nav columns), amber top rule, the
R43 inverted knockout logo, and the R35 dofollow backlink in the bottom row. The bottom row reserves
210px on the right at desktop widths so the fixed WhatsApp pill can never cover the backlink, which is
the primary SEO equity channel back to himaystudio.com.

---

## 6. R31: the navbar over the hero, and why it is a background-color

The bar IS translucent over the hero, which R31 permits. So the question is not "is the bar solid" but
"is the nav text legible against the worst case thing behind it at zero scroll", and the hero is an 8
second dusk video, so the pixels behind the nav are **not** reliably dark: a frame can put bright
amber sky right there, and on an interior page a light section scrolls under it.

The bar therefore carries `background-color: rgba(21, 16, 42, 0.82)`, going fully opaque
`--senja-pekat` on scroll.

**It is a `background-color` and NOT a `::before` gradient, and that choice is deliberate.** A pseudo
element is not in the ancestor chain, so `getComputedStyle(node).backgroundColor` cannot see it, and
the R20 sweep measured the nav text against the BODY canvas and reported **1:1 on a bar that is
actually perfectly legible**. A rule that can only be verified by eye is the rule that does not get
verified. This version is measurable, and `scripts/qa-check.mjs` asserts it.

Measured over **pure white**, the lightest ground that can ever sit behind the bar:

| Element | Colour | Ratio | Needs |
| --- | --- | --- | --- |
| `.nav-link` | `--kanvas` | **9,71** | 4,5 |
| `.brand-word` | `--kanvas` | **9,71** | 4,5 |
| `.brand-kategori` | `--kabut` | **5,43** | 4,5 |
| `.btn-outline-head` | `--kanvas` | **9,71** | 4,5 |
| `.btn-cta` label | `--putih` | **10,74** | 4,5 |

R2 is preserved: this is a 76px band at the top of an 88vh hero, about 9 percent of it, which is the
localised darkening R2 endorses rather than a full section wash. The other 91 percent of the clip is
untouched, the hero copy panel is a localised `rgba(21,16,42,0.58)` block behind the text only, and the
bottom-up scrim peaks at `--scrim-ke` alpha 0,55. Both overlays are `pointer-events: none` and sit at
negative z-index, BELOW the interactive content.

### A third dual ground variant, `.btn-outline-head`

`DESIGN.md` 3.4 pairs every dual ground class. This build needed a **third** ground: the translucent
bar, which is neither the light canvas nor a solid dark section. On opaque `--senja`,
`.btn-outline-inv` measures 6,01:1; on the 0,82 alpha bar over a light page it is only **3,94:1** and
fails. So `.btn-outline-head` exists, with a `--kanvas` label at 9,71:1.

It is used on the header `Lokasi` button and on the hero secondary CTA. It also removes a second green
from the header, which `DESIGN.md` section 2 explicitly wants: a decorative green competing with the
CTA green stops the CTA being a signal. Both buttons are NAVIGATION, so R5 never asked them to be
green.

**The hero secondary is the interesting case, and it is why R51 keeps the screenshot read.** The
ground there is a translucent panel over a video plus the R2 scrim, and **the video and the scrim are
z-index negative SIBLINGS, not ancestors**, so no ancestor-chain contrast sweep can see them. Measured
by hand through the real stack, `--pinus-terang` is 4,60:1 over a dusk frame but only **4,24:1 over
the light layout-first placeholder**, so it fails in exactly the state Stage 7 reviews. `--kanvas` is
11,38:1 and 10,48:1. The programmatic sweep said PASS on both; only arithmetic through the real
stacking order and a screenshot caught it.

---

## 7. R48: where the carousels are, and the exemptions

One class, `.snap-row`, built once: `overflow-x: auto`, `scroll-snap-type: x mandatory`, 82vw items at
375px and 56vw from 560px, becoming a plain grid at 769px. Every container with more than three peer
cards uses it, on **every** route.

| Route | Carouselled rows |
| --- | --- |
| `/` | 6 units, 5 packages, 4 kegiatan, 4 fasilitas, 8 testimonials, 3 articles |
| `/unit/` | filtered unit results |
| `/unit/[slug]/` | unit quotes, related packages, **5 other units** |
| `/paket/` | 3 private, 2 group (grouped rows) |
| `/paket/[slug]/` | related units, **4 other packages** |
| `/kegiatan/` | 4 kegiatan, 4 fasilitas |
| `/cerita/` | one row per category |
| `/cerita/[slug]/` | **5 other articles** |
| `/galeri/` | property row, one row per unit type, activities row |
| `/lokasi/` | 3 routes |
| `/tentang/` | 8 testimonials |

The bold ones are the shape that gets missed. On Mabrur the home page was fixed to three correct
carousels and `Artikel Lainnya` was still a vertical stack on all six blog detail pages.

**Long index routes group, then carousel within each group** (`.group-row`), which is the pattern
`portfolio-mabrur` got right on `/paket/`. `/galeri/` carries 24 unit frames plus 8 activity frames
and would be a 32 card vertical stack on a phone without it.

**Exempt shapes**, each because R48 does not govern it rather than for convenience: the page root and
its `<section>` list, `.dp-grid` (a calendar month), `.mega-cols` and `.drawer-*` (navigation panels),
`.gallery-thumbs` (a fixed 4 thumb strip driving one stage), `.gallery-stage` (crossfade slides stacked
at ONE position, R18 owns it), `.varian-row` (a button group), `.article-layout` (a 2 column page
shell), `.spec-list` and `.tick-list` (prose lists whose children are leaf rows), footer link columns,
`.side-list`, form field groups, and the collapsed FAQ accordion.

---

## 8. R57: the closed panel contract

`visibility: hidden` and `opacity: 0` do NOT remove an element from layout. Mabrur reported
`scrollWidth 385` against `innerWidth 375` at 375px because a shut `.dp-panel` sat at `left: 0` with
`width: 340px`, an overflow invisible in every screenshot because the panel was invisible in exactly
the state that broke the page.

Every absolutely positioned panel on this site (`.mega`, `.select-panel`, `.dp-panel`) has **zero
layout footprint on BOTH axes while closed**: `grid-template-rows: 0fr` collapses the height,
`max-width: 0` plus `overflow: hidden` collapses the width so its right edge equals its left edge, and
`visibility: hidden` takes it out of the accessibility tree.

`DESIGN.md` section 6 asked for `display: none` when closed. This is a **deliberate, documented
deviation**: `display: none` cannot animate, and R12 and R21 both require an animated open AND close.
The requirement R57 actually states is that a closed panel must not contribute layout, and that is
verified here by measurement rather than asserted: `scrollWidth <= innerWidth` on all 30 routes at
375, 480, 768, 1025 and 1440 with every panel shut, and again with every panel open.

---

## 9. Components, and which rule each one answers

| Component | Rules |
| --- | --- |
| `Header.tsx` | R16, R16.1, R31, R32, R47, R50, R52, R53, R60 |
| `Brand.tsx` | R43 two variants per ground, R50 block lockup, R62 category line in HTML, R15 filesystem gate |
| `Footer.tsx` | R35 dofollow backlink, R43 inverted logo, R50 |
| `Media.tsx` | **R15 per asset filesystem gate**, R11 in placeholder text |
| `Select.tsx` | R12, R50, R57, R60 |
| `DateRangePicker.tsx` | R21 range picker, R20(d) disabled exemption, R57, R60 |
| `UnitGallery.tsx` | R18 clickable thumbs, crossfade, keyboard |
| `UnitDetail.tsx` | R42 in place variant swap |
| `UnitFilter.tsx` | R42 filter narrows and never renames, R12, R24 |
| `BookingPanel.tsx` | R12, R14, R21, R24 |
| `KontakForm.tsx` | R12, R14, R19 visible label plus placeholder, R21, R24 |
| `FaqAccordion.tsx` | R7, R60 |
| `WelcomeModal.tsx` | R13, R52, R53 |
| `FloatingCta.tsx` | R37 |
| `WhatsAppFloat.tsx` | R10, R17, R45 |
| `ClientEffects.tsx` | **R24 MutationObserver**, cloned from portfolio-kilau and NOT from MilkyBreeze |
| `PageShell.tsx` | R46 route transition |
| `Analytics.tsx` + `functions/api/meta-events.ts` | R36, no-op safe |
| `Cards.tsx` | R42 identity, R48 carousel payload, R50 title plus label |
| `Prose.tsx` | renders the article markdown without a dependency and without `dangerouslySetInnerHTML` |

### R24 and R34, the two ways a page ships blank

`ClientEffects.tsx` clones the **post HIM-169** reveal block from `portfolio-kilau`, not from
MilkyBreeze, whose version still has the mount only scan. A `MutationObserver` on `document.body` runs
alongside the `IntersectionObserver`, mirrored for `prefers-reduced-motion`. Three places on this site
insert `.reveal` nodes AFTER mount and would be permanently invisible without it: the `UnitFilter`
results, the `BookingPanel` estimate, and the `KontakForm` confirmation.

R34 is the other root cause, and it lives in CSS. The revealed state is written
`.reveal.in, .js .reveal.in` at specificity (0,3,0) so it out ranks every hide rule regardless of
source order, and there is deliberately **no** `.js .reveal { opacity: 0 }` rule at (0,2,0) to fight
with. That plus source order is how Mabrur shipped with every below the fold section permanently
invisible.

---

## 10. `MEDIA.md` is generated, and that is the R49 guarantee

`MEDIA.md` at the repo root is **written by `node scripts/gen-manifest.mjs`** from
`src/data/media.ts`. Do not hand edit it. Edit the array and re run the generator.

The reason it is generated: the same rows feed the annotated `.ph` placeholders that render on the
page, so the layout, the manifest and the handoff cannot disagree about what belongs in a slot, and the
generator can **assert** the R49 contract instead of promising it.

**50 rows, 50 unique paths, 50 prompts**, inside the 45 to 55 cap:

| Group | Rows |
| --- | --- |
| Logo, primary plus inverted knockout (R43), prompts live in `LOGO.md` | 2 |
| Hero video (R30, R44), `public/video/hero-lembayung.mp4`, Veo Lite, 8s, 16:9 | 1 |
| 6 unit types, 4 frames each: eksterior, interior, dek, detail (R41, R18) | 24 |
| 5 packages | 5 |
| 8 kegiatan and fasilitas | 8 |
| 6 article covers | 6 |
| Property wide: aerial of the terraces, Plaza Bara at dusk, gate and reception | 3 |
| Open Graph share image | 1 |

The generator exits non zero and writes nothing if any of these fail:

- **R49** prompt count equals path count, every path unique, no SUBJECT under 55 words
- **R49** every image path declared in `src/data` has a manifest row
- **R33** PHOTO DNA and NEGATIVE are read out of `DESIGN.md` 7.2 and 7.3 and appended verbatim, so they
  can never drift from the design doc. Excluded for L01 and L02 per `LOGO.md` section 10, because a
  flat vector logo prompt's own NEGATIVE forbids photography and the photographic block would fight it.
- **R62** no bracketed template token survives in any SUBJECT
- **R11 / R58** no em dash, en dash or dash entity in any prompt or on-page placeholder caption
- **R30 / R44** the hero video row exists at the locked path
- **R43** both logo variants are rows
- budget inside 45 to 55

**R62 in practice: exactly ONE row in the whole manifest has a sharp string in it.** M46, the gate and
reception frame, where the single word `Lembayung` is written verbatim and is the only legible text in
frame. Every other row is composed so that anything readable, a menu board, a chalkboard, a schedule,
a projection screen, a handwritten card, a direction board, is deliberately out of focus, angled away,
or occluded. Wanantara rendered `TAMAN SATWA / WILDLIFE RESORT` on a site branded Wanantara,
`WELDIME TO THE MILDLIFE PATH` on a sign, and the literal token `[Jenis Satwa]`.

**R15, the one absolute rule of the layout first stage.** No `<video src>`, `<source src>` or
`<img src>` anywhere on this site points at a file that is not on disk. `Media.tsx` asks
`src/data/media.generated.ts` (written from the real filesystem by the `prebuild` hook) and falls back
to the poster still as a plain `<img>`, or to an honest annotated placeholder carrying the exact
`MEDIA.md` path and prompt. `public/video/README.md` states the same contract where someone dropping a
file will read it.

---

## 11. What Stage 7 has to do

1. Download Fahima's delivered assets and place each at the EXACT path in `MEDIA.md`. Filenames are
   the contract: this is a static export, so a wrong name does not fail the build, it 404s silently on
   the live site.
2. Run `npm run prebuild` (or just `npm run build`) so `media.generated.ts` picks them up. Placeholders
   then resolve to real `<img>` and `<video>` with no code change. That is the whole point of the gate.
3. **R55 / R62: open every text bearing image with the built in `Read` tool and read the words back
   verbatim before wiring it.** Reading is free. The generation call succeeding and the file landing at
   the right path say nothing about what the image says.
4. Re run every check below. They all pass right now on the placeholder build, so a regression is
   attributable.
5. Re verify R31 and the hero secondary CTA against the REAL first paint frame, per R51. The
   programmatic sweep cannot see the video, and section 6 above explains exactly why.

---

## 12. The checks, and how to run them

```
npm run check      # tsc --noEmit, then tools/contrast.mjs, then tools/validate-content.mjs
npm run build      # prebuild regenerates media.generated.ts, then next build
npm run qa         # scripts/qa-check.mjs ./out, the measured browser sweep
node scripts/qa-r20.mjs ./out   # R20 contrast, programmatic and sitewide
node scripts/gen-manifest.mjs   # rewrites MEDIA.md from src/data/media.ts, asserting R49/R33/R62
```

The browser harness is gated so a single block can be re run while iterating:

```
QA_ONLY=r48,r50 npm run qa
```

Block names: `overflow r16 r53 r13 r18 r42 r24 r31 r57 r48 r50 r58 r59 r60`. **A deploy gate needs the
full run**, and per R51 it also needs the screenshot pass, which neither replaces.

### Current state, all measured, all passing

| Check | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| `tools/contrast.mjs` | 50 of 50 palette pairs pass, all 4 must-fail pairs correctly fail |
| `tools/validate-content.mjs` | 1263 content strings, no dash, R42 / R41 / R49 / R7 / R35 all ok |
| `next build` | 34 routes generated, 30 marketing pages plus 404, robots.txt, sitemap.xml |
| `gen-manifest.mjs` | 50 rows, every assertion passes |
| R19 / R57 closed | `scrollWidth <= innerWidth` on 30 routes at 375, 480, 768, 1025, 1440 |
| R57 open | every Select and DatePicker panel, every breakpoint, 14 routes with a trigger |
| R16.1 | 3 panels inside the viewport at 1025px, `clip=0/0` on all three |
| R53 | drawer measures `top 0, height 800` in an 800px viewport, 1 logo in bar, 1 in drawer |
| R13 | modal `left 16, right 359` at 375px, unmounts fully on close |
| R18 | thumb click swaps shown slide 0 to 2, 1 selected thumb |
| R42 | name constant, SKU and price and image all swap, URL unchanged |
| R24 | 0 on-screen `.reveal` at opacity 0 after filtering |
| R31 | measured over pure white, table in section 6 |
| R48 | exhaustive at 375px on all 30 routes, no offenders |
| R50 | 30 routes at 1440px plus a 375px drawer pass with each accordion opened, no glue |
| R58 | rendered text on 30 routes, no dash |
| R59 | 50 internal hrefs, all resolve, no orphan route, 3 `/app/` links pending on Stage 4 |
| R60 | 3 desktop mega triggers plus 3 drawer accordions, `aria-expanded` matches rendered state |
| R20 | 37476 rendered elements across 30 routes plus open panels, drawer and modal, all pass |

### Three bugs found in the shared harness, and fixed here

Copy these fixes forward, they are not Lembayung specific.

1. **`qa-r20.mjs` composited alpha backwards.** Walking up from the element and compositing as you go
   paints the PARENT over the child. It reported `.ph-tag`, a 0,92 alpha near black label, as white on
   white at ratio 1, because an ancestor `.card`'s opaque white was applied on top of it and then
   terminated the walk. Correct: collect layers on the way up, then composite in REVERSE from the page
   down to the element. This masks real failures as well as inventing false ones.
2. **The R50 sweep read non-rendered elements.** `innerText` degrades to `textContent` on an element
   that is not being rendered, so a sweep at 1440px, where the mobile drawer is `display: none`,
   reported every drawer item as glued. Skipping non-rendered nodes is required, and it is only NOT a
   weakening because the drawer is then swept separately at 375px with it actually open, one accordion
   group at a time (the accordion is single-open, so clicking every trigger in a row leaves only the
   last one expanded and the rest unswept).
3. **The R16.1 check tested position but not CLIPPING.** A panel can sit perfectly inside the viewport,
   cause no page overflow, and still be squeezed to a fraction of its content width with every label
   cut off mid word. It now asserts `scrollWidth === clientWidth` on the panel boxes.

---

## 13. Handoff

- `origin/main` SHA is stated in the Stage 3 DONE comment on HIM-318 (R27, R54). **Stage 4 checks out
  `main`**, so this had to land there and not on an agent branch.
- Stage 4 (Webapp Architect) builds `/app` on this scaffold. `site.css` tokens, `Select.tsx`,
  `DateRangePicker.tsx`, `Media.tsx` and `src/data/*` are all reusable there. Do not overwrite any file
  listed in section 1 as Stage 3's.
- Stage 5 (Media Producer) enriches `src/data/media.ts`, re runs `scripts/gen-manifest.mjs`, writes
  `MEDIA-HOWTO.md` per R23, and reassigns to **Fahima Fauziah**
  (`e03e7d1b-1a30-4e2f-a273-4c9d33a34936`) with `MEDIA.md` attached to the comment per R63(d).
- R56 note: nothing in this stage is served anywhere yet. The site is not deployed. **QA & Deploy
  (Stage 8) owns the deploy**, and a change is done when it is SERVED, not when it is merged.
