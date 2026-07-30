import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, extname, relative, sep } from 'node:path';
import { ensureBrowser } from './qa-setup.mjs';

/* R20 contrast sweep: PROGRAMMATIC, SITEWIDE, every route.
 *
 * R20 said "check computed contrast, don't eyeball it" but for a long time carried no recipe, so in
 * practice nobody ran it and it was the only measured rule missing from the harness. This is that
 * recipe, and it is required at Stage 5 and Stage 6.
 *
 *   (a) Every route, not a spot check of the one control someone remembers.
 *   (b) The EFFECTIVE background: walk the ancestor chain compositing every non transparent
 *       backgroundColor, respecting alpha, down to the page. This is the part that matters, because
 *       the failing case is almost always a component whose OWN background is rgba(0,0,0,0) sitting
 *       on a dark section. Reading the element's own background-color reports transparent and
 *       silently passes a broken build.
 *   (c) The right threshold per element: 4,5:1 normally, 3:1 only when font-size >= 24px or
 *       (>= 18,66px AND font-weight >= 700).
 *   (d) `disabled` and `aria-disabled` controls are EXEMPT, WCAG 1.4.3 inactive component. Without
 *       this filter a month of greyed out past dates in the R21 picker floods the report and buries
 *       the real hits.
 *
 * The failure shape to expect is a class designed for the LIGHT ground and then reused on a DARK
 * section with no dark ground variant. On Wanantara `.btn-outline` measured 8,85:1 on cream and
 * 1,52:1 on dark green, so the header button was illegible on all 40 routes. DESIGN.md section 3.4
 * lists every dual ground class on this build and each ships an explicit `-inv` variant; this sweep
 * is what proves the IMPLEMENTATION uses the right one in the right place.
 *
 * Run: node scripts/qa-r20.mjs ./out
 * Note per R51: this and a first paint screenshot read are BOTH required. Neither replaces the other.
 */

const ROOT = process.argv[2] || 'out';
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.mp4': 'video/mp4',
};
const server = createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  let f = join(ROOT, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f) && existsSync(f + '.html')) f = f + '.html';
  if (!existsSync(f)) {
    res.writeHead(404);
    res.end('404');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(4323, r));

/* routes discovered from the build output, so a renamed or added route never drops out */
function discoverRoutes(root) {
  const routes = new Set();
  (function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.html')) continue;
      let rel = '/' + relative(root, full).split(sep).join('/');
      if (rel.endsWith('/index.html')) rel = rel.slice(0, -'index.html'.length);
      else rel = rel.replace(/\.html$/, '/');
      if (rel.includes('/404') || rel.includes('/_not-found')) continue;
      routes.add(rel);
    }
  })(root);
  return [...routes].sort();
}
const ROUTES = discoverRoutes(ROOT);
console.log(`R20 sweep over ${ROUTES.length} routes`);

const SWEEP = `
window.__r20 = function () {
  function parseColor(c) {
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(",").map((s) => parseFloat(s.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  /* (b) composite every non transparent ancestor background down to the page.
     ORDER MATTERS AND IT IS EASY TO GET BACKWARDS. Alpha compositing is "source over
     destination", so the OUTERMOST background is the destination and the innermost is painted
     LAST, on top. Walking up from the element and compositing as you go inverts that: the parent
     ends up painted over the child. Measured on this build, that inversion reported .ph-tag
     (a 0.92 alpha near black label) as white on white at ratio 1, because the ancestor .card
     opaque white was applied ON TOP of it and then terminated the walk. So: COLLECT on the way
     up, then composite in REVERSE, from the page down to the element.
     NOTE this whole SWEEP block is a template literal, so it must contain no backticks. */
  function effectiveBg(el) {
    const layers = [];
    for (let node = el; node; node = node.parentElement) {
      const bg = parseColor(getComputedStyle(node).backgroundColor);
      if (bg && bg.a > 0) {
        layers.push(bg);
        if (bg.a >= 0.999) break; /* fully opaque, nothing behind it can show through */
      }
    }
    let r = 255, g = 255, b = 255; /* the canvas behind everything */
    for (let i = layers.length - 1; i >= 0; i--) {
      const bg = layers[i];
      r = bg.r * bg.a + r * (1 - bg.a);
      g = bg.g * bg.a + g * (1 - bg.a);
      b = bg.b * bg.a + b * (1 - bg.a);
    }
    return { r, g, b };
  }
  function lum({ r, g, b }) {
    const c = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function ratio(fg, bg) {
    const a = lum(fg) + 0.05, b = lum(bg) + 0.05;
    return a > b ? a / b : b / a;
  }

  const out = [];
  document.querySelectorAll("body *").forEach((el) => {
    /* (d) disabled controls are exempt, WCAG 1.4.3 */
    if (el.disabled || el.getAttribute("aria-disabled") === "true") return;
    if (el.closest("[disabled]")) return;
    /* not rendered means there is nothing to read */
    if (typeof el.checkVisibility === "function" ? !el.checkVisibility() : el.getClientRects().length === 0) return;
    /* only elements that render their OWN text, so a wrapper is not credited with its child's text */
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (!own) return;

    const cs = getComputedStyle(el);
    const fg = parseColor(cs.color);
    if (!fg || fg.a === 0) return;
    const bg = effectiveBg(el);
    /* a partly transparent text colour composites onto its own effective background first */
    const eff = fg.a >= 0.999 ? fg : {
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
    };
    const fs = parseFloat(cs.fontSize);
    const fw = parseInt(cs.fontWeight, 10) || 400;
    /* (c) 3:1 only for large text */
    const threshold = fs >= 24 || (fs >= 18.66 && fw >= 700) ? 3 : 4.5;
    const r = ratio(eff, bg);
    if (r >= threshold) return;
    out.push({
      tag: el.tagName,
      cls: el.className.toString().slice(0, 60),
      text: (el.innerText || el.textContent || "").trim().slice(0, 60),
      fg: "rgb(" + Math.round(eff.r) + "," + Math.round(eff.g) + "," + Math.round(eff.b) + ")",
      bg: "rgb(" + Math.round(bg.r) + "," + Math.round(bg.g) + "," + Math.round(bg.b) + ")",
      ratio: Math.round(r * 100) / 100,
      threshold,
      fs: Math.round(fs * 10) / 10,
      fw,
      interactive: Boolean(el.closest("a,button,[role=button],[role=option],[role=gridcell],input,textarea,label")),
    });
  });
  return out;
};
`;

const { executablePath, env } = await ensureBrowser();
const browser = await puppeteer.launch({
  executablePath,
  env,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

/* Both breakpoints, because a class can be recoloured by a media query. 1440 for the desktop
   header and mega panels, 375 for the drawer and the sticky bar. */
const SIZES = [
  [1440, 900],
  [375, 800],
];
let total = 0;
const fails = [];

for (const [w, h] of SIZES) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: w, height: h });
  for (const url of ROUTES) {
    await page.goto('http://localhost:4323' + url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.evaluate(() => {
      sessionStorage.setItem('lembayung_welcome_seen', '1');
      sessionStorage.setItem('lembayung_cta_float_seen', '1');
    });
    await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
    /* scroll to the bottom so every .reveal section is revealed and measurable */
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 400));
    await page.evaluate(SWEEP);
    const res = await page.evaluate(() => window.__r20());
    total += await page.evaluate(() => document.querySelectorAll('body *').length);
    for (const r of res) fails.push({ ...r, route: url, vw: w });
  }
  await ctx.close();
}

/* the mega panels and the drawer are only measurable while OPEN, so sweep them explicitly */
{
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4323/', { waitUntil: 'networkidle2', timeout: 60000 });
  const triggers = await page.$$('.nav-item > .nav-link');
  for (let i = 0; i < triggers.length; i++) {
    await (await page.$$('.nav-item > .nav-link'))[i].hover();
    await new Promise((r) => setTimeout(r, 400));
    await page.evaluate(SWEEP);
    const res = await page.evaluate(() => window.__r20());
    for (const r of res) fails.push({ ...r, route: `/ (mega panel ${i} open)`, vw: 1440 });
  }
  await ctx.close();
}
{
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 375, height: 800 });
  await page.goto('http://localhost:4323/', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => sessionStorage.setItem('lembayung_welcome_seen', '1'));
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  await page.click('.burger');
  await new Promise((r) => setTimeout(r, 500));
  const groups = await page.$$('.drawer-trigger[aria-expanded]');
  for (let i = 0; i < groups.length; i++) {
    await (await page.$$('.drawer-trigger[aria-expanded]'))[i].click();
    await new Promise((r) => setTimeout(r, 320));
    await page.evaluate(SWEEP);
    const res = await page.evaluate(() => window.__r20());
    for (const r of res) fails.push({ ...r, route: `/ (drawer group ${i} open)`, vw: 375 });
  }
  await ctx.close();
}
/* and the R13 modal, which is a dark stripe over a light panel */
{
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 375, height: 800 });
  await page.goto('http://localhost:4323/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1200));
  await page.evaluate(SWEEP);
  const res = await page.evaluate(() => window.__r20());
  for (const r of res) fails.push({ ...r, route: '/ (welcome modal open)', vw: 375 });
  await ctx.close();
}

await browser.close();
server.close();

/* dedupe by the thing that actually needs fixing, a class plus its measured pair */
const seen = new Map();
for (const f of fails) {
  const key = `${f.tag}.${f.cls}|${f.fg}|${f.bg}|${f.threshold}`;
  if (!seen.has(key)) seen.set(key, { ...f, routes: new Set() });
  seen.get(key).routes.add(f.route);
}

console.log(`\nscanned ${total} rendered elements`);
if (seen.size === 0) {
  console.log('R20 PASS: every text bearing element clears its threshold against its EFFECTIVE background.');
  process.exit(0);
}
console.log(`\n${seen.size} distinct failing foreground/background pairs:\n`);
for (const f of [...seen.values()].sort((a, b) => a.ratio - b.ratio)) {
  console.log(
    `FAIL ${f.ratio} (needs ${f.threshold})  <${f.tag} class="${f.cls}">  fg=${f.fg} bg=${f.bg}  ${f.fs}px/${f.fw}${f.interactive ? ' INTERACTIVE' : ''}\n     "${f.text}"\n     on ${[...f.routes].slice(0, 4).join(', ')}${f.routes.size > 4 ? ` and ${f.routes.size - 4} more` : ''}`,
  );
}
process.exit(1);
