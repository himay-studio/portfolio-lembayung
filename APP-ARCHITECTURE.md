# APP-ARCHITECTURE.md, Lembayung

Stage 4 output, Webapp Architect. This is the record of what `/app` is, why it has this shape, and
which rule each decision answers, so Stage 7 and Stage 8 extend it instead of guessing at it.

`LAYOUT-ARCHITECTURE.md` is the sibling document for the MARKETING site and it is Stage 3's. The
two do not overlap: Site Architect owns `/` and every marketing route, this stage owns `/app`.

---

## 1. Why this is an application and not a page

R8 requires a dashboard, a login and a customer portal on every generated site. On most portfolio
builds that is a display only demo and belongs to Site Architect. On an accommodation booking site
it is the most persuasive thing the build can show a prospective client, so it was routed here and
built to the Himay app standard instead: **persistent left sidebar, primary actions on the left,
several views over the same data, and nothing on screen that needs a paragraph to explain.**

The centrepiece is the calendar. For a resort the operational question is never "list my
bookings", it is "how many of my 28 units are occupied on the night of the fourteenth, who arrives
and who leaves". That is why the calendar is the DEFAULT view and why every cell carries occupancy
against inventory rather than a list of names.

---

## 2. File boundary, and the one shared file that changed

Two agents share this repository. Everything below is Stage 4's:

```
src/app/app/**            every route under /app, plus the layout
src/components/app/**     every panel component
src/styles/app.css        imported by the /app layout only
scripts/qa-app.mjs        behavioural QA for the panel
scripts/qa-app-shots.mjs  screenshots of the panel in its interactive states
APP-ARCHITECTURE.md       this file
```

**One shared file changed, and it is disclosed here as well as in the Stage 4 DONE comment:
`src/app/layout.tsx`.** The root layout renders the announcement bar, the header, the footer and
the three floating overlays for every route. A reservation panel wearing a marketing mega menu is
not the app standard, so those six components are now wrapped in `AppChromeGate`
(`src/components/app/AppChromeGate.tsx`), a client component that renders its children on every
marketing route and nothing on `/app`. It is a fragment, so the DOM on a marketing page is byte
for byte what it was before, and `ClientEffects` is deliberately left OUTSIDE the gate because the
panel wants the `.js` class and the R24 reveal observers exactly as much as the marketing site
does.

A CSS `display: none`, which would have touched no shared file at all, was rejected on purpose:
`WelcomeModal` sets `document.body.style.overflow = 'hidden'` while it is open and installs a Tab
focus trap. Hiding it leaves both behaviours running, so the panel would be unscrollable with the
keyboard stuck inside an invisible dialog. `app.css` still carries the `body:has(.app-shell)`
rule, but only as belt and braces for the single frame before hydration.

Three shared QA scripts were also touched, all additively, all listed in section 10.

`MEDIA.md` was NOT touched and no image path was added anywhere. The panel needs no generated
imagery at all: identity is an initials avatar, the icons are inline geometric SVG, and the empty
states are typographic. Fahima's queue is the bottleneck on this build, so the correct number of
new asset rows from this stage is zero.

---

## 3. Route map

| Route | Screen | Default view | Owns |
| --- | --- | --- | --- |
| `/app/` | Reservasi | **Kalender** | the whole reservation book, 4 views, record panel, new booking form |
| `/app/unit/` | Inventaris Unit | Tabel | 15 bookable variants, occupancy tonight, rate card |
| `/app/tamu/` | Tamu | Tabel | guests aggregated from the reservations |
| `/app/portal/` | Portal Tamu | Akan datang | the guest facing half of R8 |
| `/app/masuk/` | Halaman Masuk | | demo login |

All five are linked from the sidebar, which is what keeps R59's orphan check satisfied: a route
reachable from nothing is a defect even when it returns 200. The marketing site links three of
them through `APP_ROUTES` in `src/data/links.ts`, Stage 3's single declaration point.

`src/app/robots.ts` disallows `/app/` and `sitemap.ts` omits it, both Stage 3 decisions that stand.
The `/app` layout repeats the intent in page metadata (`robots: { index: false, follow: false }`)
so it holds even for a crawler that ignores robots.txt.

---

## 4. Sidebar

Two groups, five items, each item a label plus its own one line description as a separate BLOCK
element with a gap (R50, and a sidebar is exactly where `ReservasiKalender, tabel` glues).

```
OPERASIONAL
  Reservasi         Kalender, tabel, kartu, papan
  Inventaris Unit   Lima belas varian di lima teras
  Tamu              Riwayat menginap dan belanja
SISI TAMU
  Portal Tamu       Yang dilihat tamu sendiri
  Halaman Masuk     Demo login resepsionis
```

- The active item is a filled violet block with a 4px amber left bar, not a slightly different
  text colour, and it carries `aria-current="page"`. Longest match wins, so `/app/unit/` never
  lights up `/app/`.
- It collapses to a 76px icon rail. The collapsed state is written to `document.documentElement`
  by a pre paint inline script in the `/app` layout and read by CSS, so a returning visitor never
  sees the wide sidebar render and snap to a rail after hydration. React syncs its own
  `aria-pressed` from the same key in an effect.
- **It is `position: sticky`, not `position: fixed`, and that is load bearing.** This shell lives
  inside `<main class="page-enter">`, which animates a transform; a transformed ancestor becomes
  the containing block for a fixed descendant while the animation runs. Sticky has no such
  problem. The one thing that genuinely has to be fixed, the mobile drawer, is portalled to
  `document.body` instead (R53).
- Below 1025px the sidebar is `display: none` and the drawer takes over. The mobile topbar holds
  exactly `[burger] [lockup] [avatar]`, one flex row, and the brand lockup appears exactly once at
  any width: the sidebar carries it on desktop, the topbar below 1025px, and the drawer carries
  none (R52).

R16 does not apply here. Mega menus are the marketing navbar's contract; an application uses a
sidebar.

---

## 5. Entities

### Reservasi

| Field | Type | Note |
| --- | --- | --- |
| `kode` | string | `LMB-1000`, what the guest quotes at the gate |
| `tamu`, `kota`, `telepon`, `email` | string | |
| `unitSlug`, `unitNama` | string | the unit TYPE. Structure only, R42 |
| `sku`, `kapasitas`, `view` | string, number, View | variant dimensions, R42 |
| `masuk`, `keluar` | ISO date | check out day is NOT an occupied night |
| `malam`, `malamAkhirPekan` | number | weekend nights drive the rate |
| `pax` | number | |
| `status` | permintaan, dikonfirmasi, menginap, selesai, batal | |
| `kanal` | Situs, WhatsApp, Telepon, Walk in, Agen | |
| `total`, `dibayar` | number, IDR | |
| `catatan`, `dibuat` | string, ISO date | |

**R42 carries straight through from the catalog.** A reservation holds a unit SLUG plus a variant
SKU; capacity and view are read off the variant and never off the unit name. On `/app/unit/` the
unit type is one column and the variant dimensions are separate columns on the same row, so
filtering by capacity narrows the rows and never renames a unit.

### Tamu

Derived, never stored twice: `nama`, `kota`, `telepon`, `email`, `menginap`, `malam`, `belanja`,
`terakhir`, `segmen` (Baru, Berulang, Rombongan). Aggregating from the reservations means a booking
and the guest record behind it cannot drift apart. Cancelled bookings are excluded from `belanja`,
so the report is never larger than what actually came in.

### BarisInventaris

One row per bookable variant: `sku`, `unitSlug`, `unitNama`, `struktur`, `kapasitas`, `view`,
`harga`, `hargaAkhirPekan`, `stok`, `teras`, `kamarMandi`, `terisi`. Fifteen rows, 28 physical
units.

---

## 6. The demo data, and why it is a pure function

`buildPanel(todayIso)` in `src/components/app/data.ts` is a function of its argument only. No
`Math.random`, and **no `new Date()` is read during render anywhere under `/app`**. The server
page reads the clock once at build time and passes a plain string down.

That is not tidiness. A module level `new Date()` read by a client component evaluates to the
BUILD day on the server and the VISITOR day in the browser, which is a hydration mismatch that
only appears the day after a deploy, on a statically exported site, where nobody is looking.

Two other properties are deliberate:

- **It respects inventory.** Candidates are allocated against `variant.stock` night by night, so
  no SKU is ever oversold and the occupancy figures mean something.
- **It guarantees the panel is alive.** Candidates are generated day by day across the window and
  deliberately oversupplied on Friday and Saturday, with the inventory gate deciding what actually
  lands. A first cut scattered random offsets and capped the result, and the panel came out with
  nothing in house tonight: `Terisi malam ini 0 dari 28`, empty bars on the current day, an empty
  Menginap column. None of that fails a structural sweep, so `qa-app.mjs` now asserts it directly.

Window: 21 days back to 40 days forward, roughly 300 reservations, ~120 distinct guests. The
calendar caption states the data range out loud, because the calendar can be paged past the edge
of the demo book and an unexplained empty month reads as a broken panel.

**Mutations are held in memory for the life of the tab and are not persisted.** A status override
written to localStorage in July would still be sitting on a reservation whose dates are long past,
and a panel that lies about its own data is worse than one that resets. The UI says so in plain
words in the record panel.

---

## 7. Views per entity

| Screen | Views | Default | Remembered |
| --- | --- | --- | --- |
| Reservasi | Kalender, Tabel, Kartu, Papan | Kalender | `lembayung_view_reservasi` |
| Inventaris | Tabel, Kartu | Tabel | `lembayung_view_inventaris` |
| Tamu | Tabel, Kartu | Tabel | `lembayung_view_tamu` |
| Portal | Akan datang, Riwayat | Akan datang | `lembayung_view_portal` |

The preference is stored PER PAGE, not globally, because a single shared "view" is how a panel
ends up opening a calendar on a screen that has no calendar. It is read in an effect after mount,
never in a `useState` initializer, for the hydration reason in section 6.

**Switching view never resets the filters.** Filters live in the workspace component, the view
lives in its own hook, and neither writes to the other. `qa-app.mjs` asserts it.

- **Kalender** is a real `<table>`: a month grid IS tabular data, the weekday row IS a set of
  column headers, and it keeps the R48 sweep honest without an exemption, because `thead`, `tbody`
  and `tr` are shapes that sweep already understands. Each cell carries the day, an occupancy
  meter against inventory, and arrival and departure counts. A day panel beside it lists check in,
  check out and in house for the selected day.
- **Tabel**: sortable columns with `aria-sort`, sticky header, row selection, and a bulk action bar
  that exists only while something is selected. The sticky header needed the scroll box to own
  BOTH axes: a box with `overflow-x: auto` computes `overflow-y` to `auto` as well, so a `thead`
  sticking to the viewport inside it never triggers. Giving the box its own `max-height` turns
  that into the feature the standard asks for.
- **Kartu**: the browse mode, and the ONE place R48 genuinely applies in the panel, so below 769px
  it is a real `.snap-row` carousel rather than a 300 card vertical stack.
- **Papan**: five columns for the lifecycle. Cards are draggable AND carry two move buttons, so
  the board is usable with a keyboard and on touch, where dragging is not. `Batal` is a visible
  column rather than a hidden state, so the board never silently omits records. Below 1025px the
  board itself is a snap carousel, which is the only sane mobile shape for a board.

Record lists elsewhere (the calendar day panel, a kanban column, the portal's stay history) are
plain block lists. They are inherently vertical records, not the marketing card sections R48
governs, and each row is one line of data rather than a photo card.

---

## 8. Roles and access

There is no backend and no authentication, and the panel is honest about that rather than
pretending otherwise.

| Role | How you get it | What changes |
| --- | --- | --- |
| Pengunjung demo | default | full read of the panel, all views, all filters, all demo mutations |
| Resepsionis | sign in at `/app/masuk/` | the topbar and sidebar identity, and a sign out control |

Signing in does not unlock hidden data, because there is none to hide: this is a portfolio demo
and its job is to be looked at. The credentials are printed on the login screen and prefilled, and
editing either field still exercises the real error path.

**R14 note, because this is the button people wire to WhatsApp by reflex:** the login form is a
WORKING FEATURE DEMO, so it stays functional. The rule draws the line there itself. The one
contact CTA in the guest portal DOES convert a visitor, so that one routes through `waLink()` to
Himay Studio WhatsApp and is green per R5.

---

## 9. Empty, loading and error states

An empty table with nothing in it is a bug, not a design.

| Screen | Empty | Error | Loading |
| --- | --- | --- | --- |
| Reservasi | `Tidak ada reservasi yang cocok` plus Bersihkan filter and Reservasi baru | | skeleton rows |
| Inventaris | `Tidak ada varian yang cocok` plus Bersihkan filter | | skeleton rows |
| Tamu | `Tidak ada tamu yang cocok` plus Bersihkan filter | | skeleton rows |
| Portal, Akan datang | `Belum ada menginap berikutnya` plus Lihat tipe unit | | |
| Portal, Riwayat | `Belum ada riwayat menginap` | | |
| Portal lookup | code not found, states the code and the reception hours | | |
| Reservasi baru | | `role="alert"` listing every missing field | |
| Masuk | | `role="alert"`, wrong credentials, stays on the screen | |
| Kanban column | `Belum ada reservasi di kolom ini` | | |

Loading is a skeleton, never a full screen spinner that makes the layout jump. In practice the
panel derives its data synchronously, so the skeleton is the fallback branch rather than a state
anyone waits in.

---

## 10. Rules, and where each one is answered

| Rule | Where |
| --- | --- |
| R10 | inherited from the site.css reset. No oval in the panel |
| R11, R58 | no dash in any panel copy, asserted on rendered text across all 35 routes |
| R12 | `Select` REUSED from the marketing site. No native `<select>` in the panel |
| R19, R47 | no page overflow at 375, 480, 768, 1025, 1440. Wide tables scroll in their own box. Topbar targets 44px, none overlapping |
| R20 | every dual ground class ships its dark variant, ratios written next to each pair in `app.css`. Swept sitewide, plus the overlays the sitewide sweep cannot reach |
| R21 | `DateRangePicker` REUSED. The filter bar and the new booking form both use it |
| R24 | the portal code lookup inserts a `.reveal` node after mount, and it is asserted to be revealed |
| R42 | unit type and variant are separate columns and separate fields, never a name |
| R46 | the route transition targets `.app-page`, so the sidebar and topbar never animate |
| R48 | the card views are real `.snap-row` carousels, the board is a snap carousel below 1025px |
| R50 | every title plus label pair is two block children with a gap, verified by `innerText` line by line |
| R52 | one brand lockup visible at any width, asserted at 375px |
| R53 | both overlays portalled to `document.body`, verified by `getBoundingClientRect` |
| R57 | both overlays UNMOUNT when closed, so their closed layout footprint is zero by construction |
| R59 | all five routes linked from the sidebar, no orphans |
| R60 | the burger's `aria-expanded` is the same state the drawer's mount reads. Toggles use `aria-pressed` |

### Shared QA scripts touched, all additive

1. **`scripts/qa-check.mjs`, R59 block.** Removed the temporary bypass that reported `/app/*`
   hrefs as "pending on Stage 4" instead of resolving them. They are crawled like every other
   internal link now, which is what Stage 8's deploy gate needs.
2. **`scripts/qa-check.mjs`, route filter.** Added `QA_ROUTES=/app/` to narrow a sweep to one
   prefix while iterating, the same convenience `QA_ONLY` gives for blocks and with the same
   warning: a deploy gate needs the unfiltered run. Note the prefix is a plain `startsWith`, so
   `QA_ROUTES=/` matches everything.
3. **`scripts/qa-shots.mjs`.** The session key it wrote was `wanantara_welcome_seen`, a leftover
   from the repo the harness was copied from. It never matched, so the R13 modal was still open in
   every "clean" screenshot, which is precisely the R51 evidence Stage 8 depends on. Both
   one per session overlays are suppressed now.

---

## 11. Two defects that only pixels found

Both passed every programmatic sweep. They are recorded here because the pattern matters more
than the fix.

**The occupancy meters rendered at zero width.** `.app-cal-day` is a flex container that is also a
`<button>`, and the browser's own button styling sets `align-items: center`. Under `center` a flex
item sizes to its content, and a meter has no content, so the track measured `width: 0` and
painted nothing on every cell of every month. No contrast to fail, no overflow to report, no text
to glue. It was visible in a screenshot and nowhere else. `qa-app.mjs` now asserts meter geometry.

**`.field-label` measured 1,11:1 on the login card.** `/app/masuk/` is a dark section containing a
white card, and site.css hangs real colour rules off `.on-dark`, including
`.on-dark .field-label { color: var(--kanvas) }`. With the class on the SECTION it reached inside
the white card. The fix is structural rather than a more specific override: `on-dark` describes
the dark COLUMN, not a section that happens to contain a light box. An override would have worked
and would have been the wrong answer, because the next light box nested in a dark region would
reintroduce it.

---

## 12. How to run the checks

```
npm run check                     # tsc --noEmit, contrast pairs, content validation
npm run build                     # prebuild regenerates media.generated.ts, then next build
node scripts/qa-app.mjs ./out     # 28 behavioural assertions on the panel
node scripts/qa-app-shots.mjs ./out   # 18 screenshots of the panel in its interactive states
npm run qa                        # the sitewide structural sweep, see LAYOUT-ARCHITECTURE.md 12
node scripts/qa-r20.mjs ./out     # sitewide contrast
```

The sitewide sweep runs past a single ten minute shell timeout, so run it in blocks:

```
QA_ONLY=overflow node scripts/qa-check.mjs ./out
QA_ONLY=r48,r50 node scripts/qa-check.mjs ./out
QA_ONLY=r57 node scripts/qa-check.mjs ./out
QA_ONLY=r16,r53,r13,r18,r42,r24,r31,r58,r59,r60 node scripts/qa-check.mjs ./out
```

### State at the end of Stage 4, all measured

| Check | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| `tools/contrast.mjs` | 50 of 50 palette pairs pass |
| `tools/validate-content.mjs` | 1263 content strings, no dash, R42 / R41 / R49 / R7 / R35 ok |
| `next build` | 39 routes, 34 marketing plus 5 panel |
| overflow | `scrollWidth <= innerWidth`, 35 routes at 375, 480, 768, 1025, 1440 |
| R57 | every Select and DatePicker panel open and shut, 17 routes, 5 breakpoints |
| R48 | exhaustive at 375px on all 35 routes, no offenders |
| R50 | 35 routes at 1440px plus the marketing drawer at 375px, no glue |
| R58 | rendered text on 35 routes, no dash |
| R59 | 52 internal hrefs, all resolve, no orphan, `/app` no longer pending |
| R16.1, R53, R13, R18, R42, R24, R31, R60 | unchanged and passing, no marketing regression |
| R20 | 41192 rendered elements over 35 routes, plus 1884 in the panel overlays |
| `qa-app.mjs` | 28 assertions, all pass |
| `qa-app-shots.mjs` | 18 screenshots, no overflow in any state |

---

## 13. Handoff

- Stage 7 (Frontend Builder) does not need to touch `/app`. It carries no generated media, so
  Fahima's delivery changes nothing here. If a marketing component this panel reuses is edited
  (`Select`, `DateRangePicker`), re run `node scripts/qa-app.mjs ./out`, which drives both.
- Stage 8 (QA and Deploy): `/app/` is now part of the R59 crawl and must resolve to 200 on the
  live domain. R51 screenshot evidence for the panel can be regenerated with
  `node scripts/qa-app-shots.mjs ./out`, and the `qa-shots.mjs` session key fix means the full
  site pass no longer shoots every page with the welcome modal open.
- The `origin/main` SHA for this stage is stated in the HIM-319 DONE comment (R27, R54). Nothing
  here is served anywhere yet: the site is not deployed, and Stage 8 owns that (R56).
