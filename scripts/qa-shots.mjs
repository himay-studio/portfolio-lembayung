import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync, readdirSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";
import sharp from "sharp";

const ROOT = "out";
const OUT = "qa-screenshots";
const RAW = join(OUT, "raw");
mkdirSync(RAW, { recursive: true });
const MIME = { ".html":"text/html", ".css":"text/css", ".js":"text/javascript", ".json":"application/json", ".png":"image/png", ".jpg":"image/jpeg", ".ico":"image/x-icon", ".svg":"image/svg+xml", ".woff2":"font/woff2", ".xml":"application/xml", ".mp4":"video/mp4" };
const server = createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split("?")[0]);
  let f = join(ROOT, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f) && existsSync(f + ".html")) f = f + ".html";
  if (!existsSync(f)) { res.writeHead(404); res.end("404"); return; }
  res.writeHead(200, {"content-type": MIME[extname(f)] || "application/octet-stream"});
  res.end(readFileSync(f));
});
await new Promise(r=>server.listen(4331, r));

function discoverRoutes(root) {
  const routes = new Set();
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!entry.name.endsWith(".html")) continue;
      let rel = "/" + relative(root, full).split(sep).join("/");
      if (rel.endsWith("/index.html")) rel = rel.slice(0, -"index.html".length);
      else rel = rel.replace(/\.html$/, "/");
      if (rel.includes("/404") || rel.includes("/_not-found")) continue;
      routes.add(rel);
    }
  }
  walk(root);
  return [...routes].sort();
}
const PAGES = discoverRoutes(ROOT);
console.log(`${PAGES.length} routes to shoot`);
const slug = (u) => u === "/" ? "home" : u.replace(/^\/|\/$/g, "").replace(/\//g, "-");

const browser = await chromium.launch({ args: ["--no-sandbox"] });

async function freshPage(ctx, url, { seenWelcome = true, scrollThrough = true } = {}) {
  const page = await ctx.newPage();
  await page.goto("http://localhost:4331" + url, { waitUntil: "networkidle" });
  if (seenWelcome) {
    // Stage 4 fix: this said `wanantara_welcome_seen`, a leftover from the repo this harness was
    // copied from. The key never matched, so the R13 modal was still open in every "clean" shot
    // and the R37 banner appeared in the slow ones, which is exactly the R51 evidence Stage 8
    // relies on. Both one-per-session overlays are suppressed here now.
    await page.evaluate(() => {
      sessionStorage.setItem("lembayung_welcome_seen", "1");
      sessionStorage.setItem("lembayung_cta_float_seen", "1");
    });
    await page.reload({ waitUntil: "networkidle" });
  }
  if (scrollThrough) {
    // fullPage screenshots don't fire real scroll events, so IntersectionObserver-driven
    // .reveal content never gets its .in class and the shot shows false blank gaps (R24/R34).
    await page.evaluate(async () => {
      const step = window.innerHeight;
      const max = document.body.scrollHeight;
      for (let y = 0; y < max; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(150);
  }
  return page;
}

// 1. every route at every breakpoint, full page, zero-scroll worst case (R31 nav contrast +
// R51 full coverage). This is the bulk set later composited into per-breakpoint contact sheets.
const BREAKPOINTS = [375, 480, 768, 1025, 1440];
for (const w of BREAKPOINTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  for (const url of PAGES) {
    const page = await freshPage(ctx, url);
    await page.screenshot({ path: `${RAW}/${w}px_${slug(url)}.png`, fullPage: true });
    await page.close();
  }
  await ctx.close();
  console.log(`done: ${w}px full sweep (${PAGES.length} pages)`);
}

// 2. worst-case states, full resolution, individually attachable
async function shot(name, w, h, fn) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  await fn(page, ctx);
  await ctx.close();
}

// welcome modal open, then after close (R13/R52)
await shot("welcome-modal", 375, 800, async (page) => {
  await page.goto("http://localhost:4331/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/375px_home_welcome-modal-open.png` });
  await page.click(".wm-close");
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/375px_home_welcome-modal-closed.png` });
});

// drawer open at 375px, announcement bar + topbar + WA button all present (R52 combo)
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const page = await freshPage(ctx, "/", { scrollThrough: false });
  await page.click(".burger");
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/375px_home_drawer-open_R52-combo.png` });
  await ctx.close();
}

// every mega dropdown open at 1025px (R16.1)
{
  const ctx = await browser.newContext({ viewport: { width: 1025, height: 900 } });
  const page = await freshPage(ctx, "/", { scrollThrough: false });
  const triggers = await page.$$(".nav-item > .nav-link");
  for (let i = 0; i < triggers.length; i++) {
    await triggers[i].hover();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/1025px_home_mega-panel-${i}-open.png` });
  }
  await ctx.close();
}

// date-picker/select panels open at 375px, on every page discovered to carry one
{
  const R57_PAGES = ["/tiket/", "/field-trip/", "/kontak/", "/masuk/", "/portal/profil/"];
  for (const url of R57_PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 900 } });
    const page = await freshPage(ctx, url, { scrollThrough: false });
    const n = await page.evaluate(() => document.querySelectorAll(".select-trigger").length);
    for (let i = 0; i < n; i++) {
      await page.evaluate((idx) => document.querySelectorAll(".select-trigger")[idx].click(), i);
      await page.waitForTimeout(350);
      await page.screenshot({ path: `${OUT}/375px_${slug(url)}_panel-${i}-open.png` });
      await page.evaluate((idx) => document.querySelectorAll(".select-trigger")[idx].click(), i);
      await page.waitForTimeout(200);
    }
    await ctx.close();
  }
}

// R48 mobile carousel proof, scrolled partway
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 900 } });
  const page = await freshPage(ctx, "/", { scrollThrough: false });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.3));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/375px_home_scrolled-carousels.png` });
  await ctx.close();
}

// R18 gallery + R42 variant swap proof
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await freshPage(ctx, "/satwa/harimau-sumatra/", { scrollThrough: false });
  await page.click(".gallery-thumb:nth-child(3)");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/1440px_satwa-detail_gallery-swapped.png` });
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await freshPage(ctx, "/tiket/", { scrollThrough: false });
  await page.click('.varian-row [role="radio"] >> nth=1');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/1440px_tiket_variant-swapped.png` });
  await ctx.close();
}

// artikel-side related-articles block, isolated (R48 borderline call, see QA report)
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 900 } });
  const page = await freshPage(ctx, "/artikel/kenapa-kami-tidak-pakai-jeruji/", { scrollThrough: false });
  await page.locator(".artikel-side").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.locator(".artikel-side").screenshot({ path: `${OUT}/375px_artikel-detail_related-articles-block.png` });
  await ctx.close();
}

await browser.close();
server.close();
console.log("done: worst-case shots");

// 3. composite contact sheets, one per breakpoint, all 41 pages as labeled thumbnails, so
// "every page at every breakpoint" is a deliverable without attaching 205 separate files.
const THUMB_W = 260;
for (const w of BREAKPOINTS) {
  const tiles = [];
  for (const url of PAGES) {
    const p = `${RAW}/${w}px_${slug(url)}.png`;
    if (!existsSync(p)) continue;
    const meta = await sharp(p).metadata();
    const th = Math.round((meta.height / meta.width) * THUMB_W);
    const buf = await sharp(p).resize(THUMB_W, Math.min(th, THUMB_W * 3)).png().toBuffer();
    tiles.push({ url, buf, h: Math.min(th, THUMB_W * 3) });
  }
  const cols = 6;
  const rows = Math.ceil(tiles.length / cols);
  const rowH = THUMB_W * 3 + 24;
  const sheetW = cols * (THUMB_W + 12) + 12;
  const sheetH = rows * rowH + 12;
  const composite = tiles.map((t, i) => ({
    input: t.buf,
    left: 12 + (i % cols) * (THUMB_W + 12),
    top: 12 + Math.floor(i / cols) * rowH + 24,
  }));
  const labelSvgParts = tiles.map((t, i) => {
    const x = 12 + (i % cols) * (THUMB_W + 12);
    const y = 12 + Math.floor(i / cols) * rowH + 16;
    const label = t.url.length > 34 ? t.url.slice(0, 33) + "…" : t.url;
    return `<text x="${x}" y="${y}" font-size="12" font-family="monospace" fill="#111">${label}</text>`;
  }).join("");
  const labelSvg = Buffer.from(`<svg width="${sheetW}" height="${sheetH}">${labelSvgParts}</svg>`);
  await sharp({ create: { width: sheetW, height: sheetH, channels: 3, background: "#f2f2f2" } })
    .composite([...composite, { input: labelSvg, left: 0, top: 0 }])
    .png()
    .toFile(`${OUT}/contact-sheet-${w}px.png`);
  console.log(`contact sheet: ${w}px (${tiles.length} pages)`);
}

console.log("ALL SCREENSHOTS DONE");
