// Generates MEDIA.md from src/data/media.ts. Run: node scripts/gen-manifest.mjs
//
// MEDIA.md is the work order Fahima reads in the Multica desktop app, so it is GENERATED rather
// than hand written. That is the only way to make the R49 contract structural instead of a promise:
// the manifest and the annotated placeholders on the page both come from ONE array, so they cannot
// drift, and this script FAILS if they ever do.
//
// It asserts, and exits non zero on any of them:
//   R49  the number of SUBJECT blocks equals the number of asset paths, and every path is unique
//   R49  every path declared in src/data (units, packages, activities, articles) has a manifest row
//   R62  no bracketed template token survives in any prompt, the Wanantara [Jenis Satwa] failure
//   R11  no em dash, en dash, or dash entity in any prompt or tag string
//   R30 / R44  the hero video row exists at the locked path
//   R43  both logo variants exist as rows
//   budget  the row count sits inside the 45 to 55 cap the parent issue set
//
// R33: the shared PHOTO DNA and NEGATIVE blocks are read out of DESIGN.md sections 7.2 and 7.3
// and appended VERBATIM to every photographic row. They are not retyped here, so they can never
// drift from the design doc. L01 and L02 are excluded per LOGO.md section 10, because the flat
// vector logo prompts carry their own NEGATIVE and the photographic DNA would contradict it.

import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = join(root, '.validate-tmp');

rmSync(tmp, { recursive: true, force: true });
execFileSync('npx', ['tsc', '-p', 'tsconfig.validate.json'], { cwd: root, stdio: 'inherit' });

const require = createRequire(import.meta.url);
const { MEDIA } = require(join(tmp, 'data', 'media.js'));
const D = require(join(tmp, 'data', 'index.js'));

/* ---------------------------------------------------- pull the shared blocks out of DESIGN.md */

const design = readFileSync(join(root, 'DESIGN.md'), 'utf8');

function fenced(afterHeading) {
  const at = design.indexOf(afterHeading);
  if (at < 0) throw new Error(`DESIGN.md is missing the heading "${afterHeading}"`);
  const open = design.indexOf('```', at);
  const close = design.indexOf('```', open + 3);
  if (open < 0 || close < 0) throw new Error(`no fenced block after "${afterHeading}"`);
  return design.slice(open + 3, close).replace(/^\n/, '').trimEnd();
}

const PHOTO_DNA = fenced('### 7.2 PHOTO DNA');
const NEGATIVE = fenced('### 7.3 NEGATIVE');
if (!PHOTO_DNA.startsWith('PHOTO DNA:')) throw new Error('PHOTO DNA block did not parse');
if (!NEGATIVE.startsWith('NEGATIVE:')) throw new Error('NEGATIVE block did not parse');

/* the packaging direction, copied verbatim from BRAND.md section 6 */
const brand = readFileSync(join(root, 'BRAND.md'), 'utf8');
const packagingAt = brand.indexOf('**Packaging direction:**');
if (packagingAt < 0) throw new Error('BRAND.md section 6 packaging direction not found');
const PACKAGING = brand.slice(packagingAt, brand.indexOf('\n', packagingAt)).trim();

/* ------------------------------------------------------------------------------- assertions */

const problems = [];
const fail = (rule, msg) => problems.push(`${rule}  ${msg}`);

const HERO_VIDEO = 'video/hero-lembayung.mp4';
const DASH_CHAR = /[–—]/;
const DASH_ENTITY = /&mdash;|&ndash;|&#8212;|&#8211;|&#x201[34];/i;
const TOKEN = /\[[^\]]*\]|\{[^}]*\}/;

const seen = new Map();
for (const row of MEDIA) {
  const key = row.path.replace(/^\//, '');
  if (seen.has(key)) fail('R49 ', `path used twice: ${row.path} on ${seen.get(key)} and ${row.id}`);
  seen.set(key, row.id);

  const hasPrompt = row.subject.trim().length > 0 || Boolean(row.promptSource);
  if (!hasPrompt) fail('R49 ', `${row.id} has no SUBJECT block and no promptSource`);
  if (!row.promptSource && row.subject.trim().split(/\s+/).length < 55) {
    fail('R49 ', `${row.id} SUBJECT is ${row.subject.trim().split(/\s+/).length} words, that is a stub`);
  }
  for (const [field, s] of [
    ['tag', row.tag],
    ['subject', row.subject],
  ]) {
    if (DASH_CHAR.test(s)) fail('R11 ', `${row.id} ${field} contains an em or en dash`);
    if (DASH_ENTITY.test(s)) fail('R58 ', `${row.id} ${field} contains a dash entity`);
  }
  /* R62: the tag legitimately carries a leading [MEDIA] marker for the on page placeholder, so
     only the SUBJECT is swept for a surviving template token, which is what gets rendered onto
     a sign. */
  if (TOKEN.test(row.subject)) fail('R62 ', `${row.id} SUBJECT still carries a bracketed token`);
}

if (!seen.has(HERO_VIDEO)) fail('R44 ', `the mandatory hero video row ${HERO_VIDEO} is missing`);
if (!seen.has('img/logo.png')) fail('R43 ', 'the primary logo row is missing');
if (!seen.has('img/logo-inverted.png')) fail('R43 ', 'the inverted knockout logo row is missing');

/* every path declared in src/data must have a row, or a page renders a slot nobody generates */
const declared = [];
D.units.forEach((u) => u.gallery.forEach((g) => declared.push([g.path, `units.${u.slug}`])));
D.packages.forEach((p) => declared.push([p.image.path, `packages.${p.slug}`]));
D.activities.forEach((a) => declared.push([a.image.path, `activities.${a.slug}`]));
D.articles.forEach((a) => declared.push([a.image.path, `articles.${a.slug}`]));
for (const [path, where] of declared) {
  if (!seen.has(path.replace(/^\//, ''))) fail('R49 ', `${where} declares ${path} but no manifest row covers it`);
}

if (MEDIA.length < 45 || MEDIA.length > 55) {
  fail('budget', `${MEDIA.length} rows, the parent brief caps the manifest at 45 to 55`);
}

if (problems.length) {
  console.log('');
  for (const p of problems) console.log('  FAIL  ' + p);
  console.log(`\n${problems.length} problem(s). MEDIA.md not written.`);
  rmSync(tmp, { recursive: true, force: true });
  process.exit(1);
}

/* ----------------------------------------------------------------------------- render MEDIA.md */

const photographic = MEDIA.filter((m) => !m.promptSource);
const images = MEDIA.filter((m) => m.model === 'Nano Banana');
const videos = MEDIA.filter((m) => m.model === 'Veo Lite');

const lines = [];
const P = (s = '') => lines.push(s);

P('# MEDIA.md, Lembayung');
P('');
P('**GENERATED FILE. Do not hand edit.** Source of truth is `src/data/media.ts`, and this file is');
P('written by `node scripts/gen-manifest.mjs`. Editing here is lost on the next run, and worse, it');
P('desynchronises the manifest from the annotated placeholders that render on the page. Edit the');
P('array, re run the generator, commit both.');
P('');
P('Stage 3 output, Site Architect. This is the SINGLE COMBINED asset bundle per R25: the logo pair,');
P('every image, and the mandatory hero video, in one handoff, generated by **Fahima Fauziah**');
P('(member id `e03e7d1b-1a30-4e2f-a273-4c9d33a34936`) in Google Flow per R63. No agent in this');
P('pipeline generates a pixel.');
P('');
P(`**${MEDIA.length} rows total**: ${images.length} images (Nano Banana) and ${videos.length} video (Veo Lite),`);
P('inside the 45 to 55 cap the parent issue set. The cap is deliberate: every asset is generated by');
P('hand, four at a time, and Rangkai\'s 109 asset bundle is already in the queue ahead of this one.');
P('');
P('| Group | Rows |');
P('| --- | --- |');
P('| Logo, primary plus inverted knockout (R43) | 2 |');
P('| Hero video (R30, R44), mandatory | 1 |');
P('| 6 unit types, 4 frames each (R41, R18) | 24 |');
P('| 5 packages | 5 |');
P('| 8 activities and facilities | 8 |');
P('| 6 article covers | 6 |');
P('| Property wide: aerial of the terraces, Plaza Bara at dusk, gate and reception | 3 |');
P('| Open Graph share image | 1 |');
P(`| **Total** | **${MEDIA.length}** |`);
P('');
P('---');
P('');
P('## How to read a row');
P('');
P('Each row below carries its OWN distinct SUBJECT block (R49). The number of SUBJECT blocks equals');
P('the number of asset paths, which the generator asserts. Nothing is recycled: no generic');
P('"glamping interior" prompt reused across eight rows, and no single generated file wired into');
P('several slots. A site where several cards visibly share one photo reads as a stub.');
P('');
P('**Paste the WHOLE prompt block for a row**, from `SUBJECT:` down to the last line of `NEGATIVE:`.');
P('Pasting only the SUBJECT loses the camera, the light and the anti AI guards, and the result comes');
P('back looking like a render.');
P('');
P('**The filename is the contract.** This is a static export, so a wrong filename does not fail the');
P('build, it 404s silently on the deployed site. Save each file at exactly the path in its row.');
P('');
P('### Text inside images, R62, read this before generating anything with a sign in it');
P('');
P('Image models render plausible looking LETTERS, not correct words, and they invent brand names. On');
P('Wanantara every single sampled image that contained legible text was defective: a gate read');
P('`TAMAN SATWA / WILDLIFE RESORT` on a site branded Wanantara, a sign read');
P('`WELDIME TO THE MILDLIFE PATH`, and one sign rendered the literal template token `[Jenis Satwa]`.');
P('');
P('So on this build:');
P('');
P('1. Only ONE row in the entire manifest has a sharp string in it, **M46**, and that string is the');
P('   single word `Lembayung`, nine letters, capital L. Every other row is written so that anything');
P('   readable, a menu board, a direction board, a card, a projection screen, is deliberately out of');
P('   focus or angled away.');
P('2. If a generated image comes back with a word in it that you did not ask for, that is a');
P('   REGENERATE, not a note in the handoff. Zoom in and read it before you download.');
P('3. There is not one bracketed token anywhere in this file. If you ever see `[` or `{` inside a');
P('   prompt, stop and report it, do not paste it.');
P('');
P('### Packaging direction, BRAND.md section 6, verbatim');
P('');
P('> ' + PACKAGING.replace(/^\*\*Packaging direction:\*\*\s*/, ''));
P('');
P('---');
P('');
P('## Manifest');
P('');
P('| # | Path | Ratio | Model | Slot |');
P('| --- | --- | --- | --- | --- |');
for (const m of MEDIA) {
  P(`| ${m.id} | \`public/${m.path}\` | ${m.ratio} | ${m.model} | ${m.slot} |`);
}
P('');
P('---');
P('');
P('## Prompts');
P('');

for (const m of MEDIA) {
  P(`### ${m.id} · \`public/${m.path}\``);
  P('');
  P(`**Ratio** ${m.ratio} · **Model** ${m.model} · **Slot** ${m.slot}`);
  P('');
  if (m.promptSource) {
    P(`Prompt lives in **${m.promptSource}**. Paste that block whole, from its first line to the last`);
    P('line of its NEGATIVE. Per LOGO.md section 10 the shared photographic PHOTO DNA and NEGATIVE');
    P('blocks are deliberately NOT appended to a logo row: the logo prompt is flat vector and its own');
    P('NEGATIVE already forbids photography, grain and photorealism, so appending the photographic');
    P('blocks would contradict it.');
    P('');
    continue;
  }
  P('```');
  P('SUBJECT:');
  P(m.subject);
  P('');
  P(PHOTO_DNA);
  P('');
  P(NEGATIVE);
  P('```');
  P('');
}

P('---');
P('');
P('## Checks the generator ran before writing this file');
P('');
P(`- R49, ${MEDIA.length} rows, ${MEDIA.length} unique paths, ${photographic.length} SUBJECT blocks plus 2 rows whose prompt lives in LOGO.md. Count of prompts equals count of paths.`);
P('- R49, every image path declared in `src/data` (units, packages, activities, articles) has a row.');
P('- R33, PHOTO DNA and NEGATIVE read out of DESIGN.md 7.2 and 7.3 and appended verbatim to every');
P('  photographic row, so they cannot drift from the design doc.');
P('- R62, no bracketed template token survives in any SUBJECT.');
P('- R11 and R58, no em dash, en dash, or dash entity in any prompt or on page placeholder caption.');
P('- R30 and R44, the hero video row exists at the locked path `public/video/hero-lembayung.mp4`.');
P('- R43, both logo variants are rows.');
P(`- Budget, ${MEDIA.length} rows, inside the 45 to 55 cap.`);
P('');
P('Re run with `node scripts/gen-manifest.mjs`. It exits non zero and writes nothing if any check fails.');
P('');

writeFileSync(join(root, 'MEDIA.md'), lines.join('\n'));
rmSync(tmp, { recursive: true, force: true });
console.log(`\n[gen-manifest] MEDIA.md written, ${MEDIA.length} rows, all checks passed.`);
