# portfolio-lembayung

**Lembayung**, highland glamping and wooden cabin resort in Cikole, Lembang, Bandung Utara.

Fictional demo brand built for the Himay Studio portfolio. No real client, so the site self canonicals per R35.

- **Live URL:** https://portfolio-lembayung.himaystudio.com
- **Cloudflare Pages project:** `himaystudio-portfolio-lembayung`
- **Slug:** `lembayung`

## Docs

| File | Read it for |
| --- | --- |
| [HANDOFF.md](./HANDOFF.md) | Start here. What exists, what is provisional, what downstream stages must not break. |
| [BRAND.md](./BRAND.md) | Positioning, category realism, competitors, tone of voice, copy conventions, packaging direction. |
| [DESIGN.md](./DESIGN.md) | Design tokens, measured contrast, typography, shape, motion, PHOTO DNA, NEGATIVE, hero video brief. |
| [LOGO.md](./LOGO.md) | Logo concept, the two mandatory variants, prompts, favicon derivation, Google Flow tutorial. |

## Content

All content lives in `src/data`, typed and typechecked.

| Module | Contents |
| --- | --- |
| `types.ts` | Shared types. The `Unit` and `UnitVariant` split that makes R42 structural. |
| `units.ts` | 6 unit types, 15 bookable variants, 24 images. |
| `packages.ts` | 5 packages. |
| `activities.ts` | 8 activities and facilities. |
| `articles.ts` | 6 articles with full body copy. |
| `faq.ts` | 12 FAQ entries. |
| `site.ts` | Site config, contact, location, operating details, 8 testimonials. |

## Checks

```bash
npm install
npm run check        # typecheck + contrast + content validation
```

- `npm run typecheck` compiles `src/**` with `strict` and `noUncheckedIndexedAccess`.
- `npm run contrast` recomputes every ratio quoted in `DESIGN.md` section 3 and fails on a regression.
- `npm run validate:content` enforces R42, R11, R58, R49, R41, R18, R7 and R35 against the real exported values, not against source text.

## Pipeline

Stage 1 (Brand Strategist) is complete. Stages 2 to 10 are tracked on HIM-315.
