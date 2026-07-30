// Content validator for Lembayung. Run: node tools/validate-content.mjs
//
// This enforces the build rules that a typechecker cannot see. It compiles src/data to a
// temp dir and inspects the REAL exported values, rather than grepping source text, because
// several of these rules (R11 in particular) are about what the page renders, not what the
// file looks like.
//
// Scope note: the dash sweep runs over src/data only. BRAND.md, DESIGN.md and LOGO.md
// deliberately NAME the forbidden entity forms while explaining R11 and R58, so including
// them here would report the rule text as a violation of itself.

import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = join(root, '.validate-tmp');

rmSync(tmp, { recursive: true, force: true });
execFileSync('npx', ['tsc', '-p', 'tsconfig.validate.json'], { cwd: root, stdio: 'inherit' });

const require = createRequire(import.meta.url);
const D = require(join(tmp, 'data', 'index.js'));

const problems = [];
const notes = [];
const fail = (rule, msg) => problems.push(`${rule}  ${msg}`);
const ok = (rule, msg) => notes.push(`${rule}  ${msg}`);

/* ------------------------------------------------------------------ R11 / R58 */
// Literal characters AND the entity forms, which render as real dashes.
const DASH_CHAR = /[–—]/;
const DASH_ENTITY = /&mdash;|&ndash;|&#8212;|&#8211;|&#x201[34];/i;

function walkStrings(value, path, visit) {
  if (typeof value === 'string') return visit(value, path);
  if (Array.isArray(value)) return value.forEach((v, i) => walkStrings(v, `${path}[${i}]`, visit));
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walkStrings(v, `${path}.${k}`, visit);
  }
}

let stringCount = 0;
for (const [name, value] of Object.entries(D)) {
  if (typeof value === 'function') continue;
  walkStrings(value, name, (s, path) => {
    stringCount++;
    if (DASH_CHAR.test(s)) fail('R11 ', `em or en dash character in ${path}: ${JSON.stringify(s.slice(0, 90))}`);
    if (DASH_ENTITY.test(s)) fail('R58 ', `dash entity in ${path}: ${JSON.stringify(s.slice(0, 90))}`);
  });
}
if (!problems.length) ok('R11 ', `${stringCount} content strings scanned, no em dash, en dash, or dash entity`);

/* ------------------------------------------------------------------ R42 */
const VIEW_WORDS = ['lembah', 'hutan', 'danau', 'embung'];
const skus = new Map();
for (const u of D.units) {
  const lower = u.name.toLowerCase();
  if (/\d/.test(u.name)) fail('R42 ', `unit name contains a number, capacity belongs on the variant: "${u.name}"`);
  if (lower.includes('pax')) fail('R42 ', `unit name contains "pax": "${u.name}"`);
  for (const w of VIEW_WORDS) {
    // "Kabin Lembayung" is the brand name, not the view word "lembah".
    if (new RegExp(`\\b${w}\\b`).test(lower)) {
      fail('R42 ', `unit name contains the view dimension "${w}": "${u.name}"`);
    }
  }
  if (!u.variants.length) fail('R42 ', `unit "${u.name}" has no variants, capacity and view have nowhere to live`);
  for (const v of u.variants) {
    if (skus.has(v.sku)) fail('R42 ', `duplicate SKU ${v.sku} on ${u.slug} and ${skus.get(v.sku)}`);
    skus.set(v.sku, u.slug);
    if (typeof v.capacity !== 'number' || v.capacity < 1) fail('R42 ', `${v.sku} has no usable capacity`);
    if (!VIEW_WORDS.includes(v.view)) fail('R42 ', `${v.sku} has an unknown view "${v.view}"`);
    if (v.weekendPrice < v.price) fail('data', `${v.sku} weekend rate is below the weekday rate`);
    if (v.imageIndex < 0 || v.imageIndex >= u.gallery.length) {
      fail('R18 ', `${v.sku} imageIndex ${v.imageIndex} is outside ${u.slug} gallery of ${u.gallery.length}`);
    }
  }
}
ok('R42 ', `${D.units.length} unit types, ${skus.size} unique variant SKUs, no capacity or view in any unit name`);

/* ------------------------------------------------------------------ R41 / R18 */
for (const u of D.units) {
  if (u.gallery.length !== 4) fail('R41 ', `unit ${u.slug} has ${u.gallery.length} images, the manifest budgets exactly 4`);
  const kinds = u.gallery.map((g) => g.kind);
  for (const need of ['eksterior', 'interior', 'dek', 'detail']) {
    if (!kinds.includes(need)) fail('R41 ', `unit ${u.slug} gallery is missing a "${need}" frame`);
  }
}
if (D.units.length < 6) fail('R41 ', `only ${D.units.length} unit types, the brief specifies 6`);
ok('R41 ', `every unit ships 4 images across eksterior, interior, dek and detail, so the R18 gallery has real content`);

/* ------------------------------------------------------------------ R49 */
const paths = [];
const collectImage = (img, where) => {
  if (!img) return;
  paths.push({ path: img.path, where });
  if (!img.alt || img.alt.length < 20) fail('a11y', `weak or missing alt text at ${where}: ${JSON.stringify(img.alt)}`);
  if (!img.path.startsWith('/img/')) fail('path', `${where} path must start with /img/, got ${img.path}`);
};
D.units.forEach((u) => u.gallery.forEach((g, i) => collectImage(g, `units.${u.slug}.gallery[${i}]`)));
D.packages.forEach((p) => collectImage(p.image, `packages.${p.slug}`));
D.activities.forEach((a) => collectImage(a.image, `activities.${a.slug}`));
D.articles.forEach((a) => collectImage(a.image, `articles.${a.slug}`));

const seen = new Map();
for (const { path, where } of paths) {
  if (seen.has(path)) fail('R49 ', `image recycled across slots: ${path} used at ${seen.get(path)} and ${where}`);
  seen.set(path, where);
}
// Rows not yet in src/data but already budgeted in DESIGN.md 7.6.
const EXTRA = { 'logo pair (R43)': 2, 'hero video (R30, R44)': 1, 'property wide': 3, 'open graph': 1 };
const extraTotal = Object.values(EXTRA).reduce((a, b) => a + b, 0);
const manifestTotal = paths.length + extraTotal;
ok('R49 ', `${paths.length} distinct image paths in src/data, none recycled`);
if (manifestTotal < 45 || manifestTotal > 55) {
  fail('budget', `projected MEDIA.md manifest is ${manifestTotal} rows, the parent brief caps it at 45 to 55`);
} else {
  ok('budget', `projected manifest ${manifestTotal} rows (${paths.length} in data + ${extraTotal} logo, video, property, OG), inside the 45 to 55 cap`);
}

/* ------------------------------------------------------------------ R7 */
if (D.faq.length < 8) fail('R7  ', `only ${D.faq.length} FAQ entries, minimum is 8`);
const NEEDED_FAQ = ['check in', 'hujan', 'kamar mandi', 'anak', 'listrik', 'sinyal', 'pembatalan', 'jalan'];
const faqBlob = D.faq.map((f) => `${f.question} ${f.answer}`).join(' ').toLowerCase();
for (const topic of NEEDED_FAQ) {
  if (!faqBlob.includes(topic)) fail('R7  ', `FAQ never covers the required topic "${topic}"`);
}
ok('R7  ', `${D.faq.length} FAQ entries, all 8 required topics covered`);

/* ------------------------------------------------------------------ content depth */
if (D.packages.length !== 5) fail('brief', `${D.packages.length} packages, the brief specifies 5`);
if (D.activities.length !== 8) fail('brief', `${D.activities.length} activities, the brief specifies 8`);
if (D.articles.length !== 6) fail('brief', `${D.articles.length} articles, the brief specifies 6`);

for (const a of D.articles) {
  const words = a.body.trim().split(/\s+/).length;
  if (words < 400) fail('brief', `article "${a.slug}" is ${words} words, that is a stub not full body copy`);
  if (!a.body.includes('##')) fail('brief', `article "${a.slug}" has no subheadings`);
}
const articleWords = D.articles.map((a) => a.body.trim().split(/\s+/).length);
ok('brief', `5 packages, 8 activities, 6 articles (${Math.min(...articleWords)} to ${Math.max(...articleWords)} words each, full body)`);

for (const u of D.units) {
  if (u.story.trim().split(/\s+/).length < 60) fail('brief', `unit "${u.slug}" story is too thin`);
  if (!u.notFor) fail('voice', `unit "${u.slug}" has no notFor line, the brand voice requires saying who it does not suit`);
}

/* ------------------------------------------------------------------ slugs */
for (const [label, list] of [['units', D.units], ['packages', D.packages], ['activities', D.activities], ['articles', D.articles]]) {
  const s = new Set();
  for (const item of list) {
    if (s.has(item.slug)) fail('slug', `duplicate slug in ${label}: ${item.slug}`);
    if (!/^[a-z0-9-]+$/.test(item.slug)) fail('slug', `slug in ${label} is not kebab case: ${item.slug}`);
    s.add(item.slug);
  }
}

/* ------------------------------------------------------------------ R35 */
if (D.site.clientDomain !== null) {
  fail('R35 ', 'clientDomain must be null for a fictional demo brand, otherwise the canonical points at a site that does not exist');
}
if (!D.site.metaTitle.includes('Himay Studio')) fail('R35 ', 'metaTitle must carry the branded Himay Studio suffix');
if (D.site.himayWhatsapp.startsWith('0')) fail('R14 ', 'wa.me number must be international format, a 0 prefix is a dead link');
ok('R35 ', 'self canonical (clientDomain null), branded meta title, wa.me number in international format');

/* ------------------------------------------------------------------ report */
rmSync(tmp, { recursive: true, force: true });
console.log('');
for (const n of notes) console.log('  ok    ' + n);
console.log('');
if (problems.length) {
  for (const p of problems) console.log('  FAIL  ' + p);
  console.log(`\n${problems.length} problem(s).`);
  process.exit(1);
}
console.log('Content validation passed.');
