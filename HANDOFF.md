# HANDOFF.md, Stage 1 to Stage 2

Brand Strategist output for `portfolio-lembayung`. Read this before touching anything.

---

## What is in the repo

| File | What it is |
| --- | --- |
| `BRAND.md` | Positioning, category realism self check, competitors, tone of voice, copy conventions, the R42 identity model, the packaging direction that MEDIA.md copies verbatim. |
| `DESIGN.md` | The `:root` token block, the measured contrast tables, typography, shape, motion, PHOTO DNA, NEGATIVE, the hero video brief, the asset budget. |
| `LOGO.md` | Logo concept, the two mandatory R43 variants, technical constraints, a Stage 1 **draft** prompt pair that Asset Forge finalises, the favicon derivation, the Google Flow tutorial for Fahima. |
| `src/data/*.ts` | All content. Typed, and it typechecks. |
| `tools/contrast.mjs` | Produces every ratio quoted in DESIGN.md section 3. Exits non zero on a regression. |
| `tools/validate-content.mjs` | Enforces R42, R11, R58, R49, R41, R18, R7 and R35 against the real exported values. Exits non zero on a violation. |

Run all three checks with `npm run check`. Current state: `tsc --noEmit` clean, contrast 50 of 50 pairs pass, content validation passes.

---

## The three things most likely to be got wrong downstream

**1. R42, the catalog identity model.** A unit's `name` is the STRUCTURE only. Capacity and view are variant dimensions in `variants`. `tools/validate-content.mjs` fails the build if a unit name ever picks up a number, the word `pax`, or a view word, so you cannot regress this silently. In the UI: the listing capacity filter must never change the name on a card, and the detail page view picker must swap `sku`, `price` and image **in place**, never navigate to another slug.

**2. R20, dual ground variants.** `DESIGN.md` section 3.4 lists every class that appears on both a light and a dark ground, and each one ships an `-inv` variant. This is the Wanantara failure exactly: one `.btn-outline` measured 8,85:1 on cream and 1,52:1 on dark green because a single class was reused on both. The checker also asserts each light variant **fails** on dark, so if a pair ever stops being justified it prints `LEAK!`.

**3. Variant images are indices, not paths.** `UnitVariant.imageIndex` points into the parent unit's own four image gallery. That is deliberate: the asset budget is four images per unit type, so a variant can never introduce a new manifest row. Do not change it to a free path without renegotiating the budget with the parent issue.

---

## Provisional scaffolding, Stage 3 should absorb it

`package.json` and `tsconfig.json` are minimal and exist only so the data modules could actually be typechecked rather than asserted to be correct. They are **not** a Next.js scaffold.

Site Architect should merge Next dependencies into the existing `package.json` rather than replacing it, and keep these three scripts, which later stages depend on:

```
"contrast":         "node tools/contrast.mjs"
"validate:content": "node tools/validate-content.mjs"
"check":            "npm run typecheck && npm run contrast && npm run validate:content"
```

Keep `paths: { "@/*": ["./src/*"] }` in `tsconfig.json`, the data barrel is imported as `@/data`.

Per R61, whatever `deploy` script Stage 8 adds must `rm -rf out .next` before `next build`, and its `--project-name` must be exactly `himaystudio-portfolio-lembayung`, which is the name locked in the parent issue.

---

## Two known false positives in a naive grep sweep

Both are correct and must not be "fixed".

1. `tools/validate-content.mjs` line 34 contains the literal characters `–` and `—`. That is the R11 detection regex itself. A repo wide character grep will hit it.
2. `BRAND.md` line 120 names the entity forms `&mdash;`, `&ndash;`, `&#8212;`, `&#8211;`, `&#x2014;`, `&#x2013;`. That is the rule text explaining what R58 forbids.

The real R11 and R58 sweep must run over `src/` and over the **rendered** page text, per R58(a). `tools/validate-content.mjs` already does the `src/data` half against the real exported strings, so Stage 7 only needs to add the rendered page half.

---

## Asset budget, hold this shape

Fifty rows, inside the 45 to 55 cap the parent issue set, because Fahima generates every pixel by hand four at a time and is currently working Rangkai's 109 asset bundle on HIM-271.

| Group | Rows | Where the paths are declared |
| --- | --- | --- |
| Logo primary plus inverted knockout | 2 | `LOGO.md` section 7 |
| Hero video | 1 | `public/video/hero-lembayung.mp4`, locked by the parent issue |
| 6 unit types, 4 images each | 24 | `src/data/units.ts` |
| 5 packages | 5 | `src/data/packages.ts` |
| 8 activities and facilities | 8 | `src/data/activities.ts` |
| 6 article covers | 6 | `src/data/articles.ts` |
| Property wide: aerial of the terraces, Plaza Bara at dusk, reception and gate | 3 | Stage 3 declares these |
| Open Graph share image | 1 | Stage 3 declares this |

The 43 paths already in `src/data` are validated unique, so no image is recycled across two slots. The remaining 7 are Stage 3's to declare. Every row needs its own distinct SUBJECT block per R49, and a smaller manifest is not licence to reuse a prompt.

---

## Stage 2, Asset Forge

Your checklist is at the bottom of `LOGO.md`. Short version: decide the vertical notch, finalise or confirm the two draft prompts, confirm both variants appear as rows in the combined `MEDIA.md`, and generate no pixels (R63).

---

## Stage 3, Site Architect

- `BRAND.md` section 6 is the packaging direction, copy it into `MEDIA.md` verbatim.
- `DESIGN.md` sections 7.2 and 7.3 are the PHOTO DNA and NEGATIVE blocks, append them to every prompt verbatim. They do not replace the per asset SUBJECT block.
- `DESIGN.md` section 6 lists the component contracts that map to hard gates, R12, R21, R16.1, R57, R53, R50, R18 and R48. Read it before laying out the navbar or the booking panel.
- The IA is driven by the three audiences in `BRAND.md` section 2. Audiences 1 and 2 need a date range plus unit plus variant flow. Audience 3 needs a quotation flow, and it is what pays for Monday to Thursday.
- `site.primaryNav` in `src/data/site.ts` is a starting point, not a decision. You own the final IA.
