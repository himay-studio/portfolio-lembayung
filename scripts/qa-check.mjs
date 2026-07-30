import puppeteer from "puppeteer-core";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";
import { ensureBrowser } from "./qa-setup.mjs";

/* Runs against the static export in out/. Uses puppeteer-core against a puppeteer-managed
   Chrome (see qa-setup.mjs) because this sandbox has no root/sudo, so plain `playwright
   install --with-deps` cannot install the system libraries Chromium needs. */

const ROOT = process.argv[2];
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
await new Promise(r=>server.listen(4321, r));

// PAGES is discovered from the actual build output, not hand-maintained, so a renamed or
// added route never silently drops out of R48/R50/R58/R59's "every route" sweep.
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
/* QA_ROUTES=/app/ narrows the sweep to routes under one prefix, the same convenience QA_ONLY
   gives for blocks and with the same warning: it is for ITERATING on one area, and a deploy
   gate needs the unfiltered run. Added at Stage 4 so the /app panel could be swept repeatedly
   without re-walking 35 routes each time. Unset by default, so nothing changes for anyone who
   does not ask for it. */
const ONLY_ROUTES = process.env.QA_ROUTES ? process.env.QA_ROUTES.split(",").map((s) => s.trim()) : null;
const PAGES = discoverRoutes(ROOT).filter((r) => !ONLY_ROUTES || ONLY_ROUTES.some((p) => r.startsWith(p)));
if (ONLY_ROUTES) console.log("QA_ROUTES:", ONLY_ROUTES.join(" "));
console.log(`discovered ${PAGES.length} routes:`, PAGES.join(" "));
const SIZES = [[375,800],[480,900],[768,1000],[1025,900],[1440,900]];

const { executablePath, env } = await ensureBrowser();
const browser = await puppeteer.launch({ executablePath, env, headless: "new", args: ["--no-sandbox","--disable-dev-shm-usage"] });
const problems = [];

/* Genuine intra-word capitals: brand names, SKU codes (LMB-DS-2H), keyboard key names, the GTM
   container id. Whitelisting these beats weakening the [a-z][A-Z] regex, per R50. Shared by the
   mega panel check and the whole page sweep so the two can never disagree. */
const GLUE_WHITELIST = /WhatsApp|WiFi|YouTube|iPhone|QRIS|sessionStorage|localStorage|LMB-|GTM-|PageUp|PageDown|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|mdpl|MEDIA/;

/* The full sweep is 31 routes across 5 viewports plus an open/close pass over every panel, which
   runs past a single 10 minute shell timeout on this runtime. So each block below is gated and can
   be run on its own:

     node scripts/qa-check.mjs ./out                      everything
     QA_ONLY=overflow node scripts/qa-check.mjs ./out     just the scrollWidth sweep
     QA_ONLY=r48,r50,r58 node scripts/qa-check.mjs ./out  a named subset

   Block names: overflow r16 r13 r18 r42 r24 r31 r57 r48 r50 r58 r59 r60
   Running a subset is a convenience for iterating. A DEPLOY GATE needs the full run, and per R51
   it also needs the screenshot pass, which neither replaces. */
const ONLY = process.env.QA_ONLY ? process.env.QA_ONLY.split(",").map(s => s.trim()) : null;
const run = (name) => !ONLY || ONLY.includes(name);
if (ONLY) console.log("QA_ONLY:", ONLY.join(" "));

async function freshPage(w, h) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: w, height: h });
  return { ctx, page };
}
async function gotoSeen(page, url) {
  await page.goto("http://localhost:4321" + url, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => {
    // suppress BOTH one-per-session overlays, so a sweep is measuring the page and not the modal
    sessionStorage.setItem("lembayung_welcome_seen", "1");
    sessionStorage.setItem("lembayung_cta_float_seen", "1");
  });
  await page.reload({ waitUntil: "networkidle2", timeout: 60000 });
}

if (run("overflow")) for (const [w,h] of SIZES) {
  const { ctx, page } = await freshPage(w, h);
  for (const url of PAGES) {
    await gotoSeen(page, url);
    const over = await page.evaluate(()=>({sw:document.documentElement.scrollWidth, iw:window.innerWidth}));
    if (over.sw > over.iw + 1) problems.push(`OVERFLOW ${w}px ${url}: scrollWidth ${over.sw} > innerWidth ${over.iw}`);
  }
  await ctx.close();
}

// R16.1: every mega panel inside the viewport at 1025px
if (run("r16")) {
  const { ctx, page } = await freshPage(1025, 900);
  await gotoSeen(page, "/");
  const triggerCount = await page.evaluate(()=>document.querySelectorAll(".nav-item > .nav-link").length);
  console.log("nav panel triggers:", triggerCount);
  for (let i=0;i<triggerCount;i++){
    const trigger = (await page.$$(".nav-item > .nav-link"))[i];
    await trigger.hover();
    await new Promise(r=>setTimeout(r,400));
    const r = await page.evaluate(()=>{
      const mega = document.querySelector(".nav-item.is-open .mega");
      const p = document.querySelector(".nav-item.is-open .mega .mega-inner");
      const cols = document.querySelector(".nav-item.is-open .mega-cols");
      if(!p) return null;
      const b = p.getBoundingClientRect();
      const items = [...document.querySelectorAll(".nav-item.is-open .mega-link")].map(el=>el.innerText);
      return {
        left:Math.round(b.left), right:Math.round(b.right), w:Math.round(b.width),
        iw:window.innerWidth, items, sw:document.documentElement.scrollWidth,
        /* CLIPPING, which position alone cannot see. A panel can sit perfectly inside the
           viewport, cause no page overflow, and still be squeezed to a fraction of its content
           width so every label is cut off mid word. Measured on this build before the
           `width: max-content` fix: a 124px panel that passed every positional assertion and was
           only visible in a screenshot. Compare scrollWidth to clientWidth on the clipping boxes. */
        clipMega: mega ? Math.round(mega.scrollWidth - mega.clientWidth) : null,
        clipInner: Math.round(p.scrollWidth - p.clientWidth),
        colsWidth: cols ? Math.round(cols.getBoundingClientRect().width) : null,
      };
    });
    if(!r){ problems.push(`PANEL ${i} did not open on hover at 1025px`); continue; }
    if (r.left < 0 || r.right > r.iw) problems.push(`PANEL ${i} escapes viewport at 1025px: left ${r.left} right ${r.right} iw ${r.iw}`);
    if (r.sw > r.iw + 1) problems.push(`PANEL ${i} causes page overflow at 1025px: scrollWidth ${r.sw}`);
    if (r.clipMega > 1 || r.clipInner > 1) problems.push(`PANEL ${i} CLIPS its own content at 1025px: overflow ${r.clipMega}px outer / ${r.clipInner}px inner, rendered width ${r.w}px`);
    for (const t of r.items) {
      for (const line of t.split("\n")) {
        if (/[a-z][A-Z]/.test(line) && !GLUE_WHITELIST.test(line)) {
          problems.push(`R50 GLUE in panel ${i}: "${line}"`);
        }
      }
    }
    console.log(`panel ${i}: left=${r.left} right=${r.right} w=${r.w} cols=${r.colsWidth} clip=${r.clipMega}/${r.clipInner} items=${r.items.length}`);
  }
  await ctx.close();
}

// R53: the drawer must be a real full viewport element at 375px, not a header height strip
if (run("r53")) {
  const { ctx, page } = await freshPage(375, 800);
  await gotoSeen(page, "/");
  await page.click(".burger");
  await new Promise(r=>setTimeout(r,500));
  const d = await page.evaluate(()=>{
    const el = document.querySelector(".drawer");
    const b = el.getBoundingClientRect();
    return { top:Math.round(b.top), height:Math.round(b.height), width:Math.round(b.width), ih:window.innerHeight, headerLogos: document.querySelectorAll(".site-header .brand").length, drawerLogos: document.querySelectorAll(".drawer .brand").length, sw:document.documentElement.scrollWidth, iw:window.innerWidth };
  });
  console.log("drawer:", JSON.stringify(d));
  if (Math.abs(d.height - d.ih) > 2 || Math.abs(d.top) > 2) problems.push(`R53 drawer clipped: top ${d.top} height ${d.height} vs innerHeight ${d.ih}`);
  if (d.sw > d.iw + 1) problems.push(`R53 drawer open causes overflow: ${d.sw} > ${d.iw}`);
  // R52(a): the logo appears EXACTLY once in the topbar. A drawer nested inside a filtered header
  // renders a second lockup across the topbar, which is the visible symptom of the R53 bug.
  if (d.headerLogos !== 1) problems.push(`R52 topbar carries ${d.headerLogos} brand lockups, expected exactly 1`);
  if (d.drawerLogos !== 1) problems.push(`R52 drawer carries ${d.drawerLogos} brand lockups, expected exactly 1`);
  await ctx.close();
}

// R13 welcome modal at 375px, fits and unmounts on close
if (run("r13")) {
  const { ctx, page } = await freshPage(375, 800);
  await page.goto("http://localhost:4321/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise(r=>setTimeout(r,1200));
  const m = await page.evaluate(()=>{
    const el = document.querySelector(".wm-panel");
    if(!el) return null;
    const b = el.getBoundingClientRect();
    return { left:Math.round(b.left), right:Math.round(b.right), top:Math.round(b.top), iw:window.innerWidth, sw:document.documentElement.scrollWidth };
  });
  console.log("welcome modal:", JSON.stringify(m));
  if(!m) problems.push("R13 welcome modal did not appear");
  else if (m.left < 0 || m.right > m.iw) problems.push(`R13 modal escapes viewport: ${m.left}..${m.right} iw ${m.iw}`);
  await page.click(".wm-close");
  await new Promise(r=>setTimeout(r,600));
  const gone = await page.evaluate(()=>!document.querySelector(".wm-overlay"));
  if(!gone) problems.push("R13 modal did not fully unmount on close");
  else console.log("welcome modal unmounted cleanly");
  await ctx.close();
}

// R18 gallery: thumbnail click swaps the shown frame
if (run("r18")) {
  const { ctx, page } = await freshPage(1440, 900);
  await gotoSeen(page, "/unit/dome-senja/");
  const before = await page.evaluate(()=>[...document.querySelectorAll(".gallery-stage > *")].findIndex(e=>e.classList.contains("is-shown")));
  const thumbs = await page.$$(".gallery-thumb");
  await thumbs[2].click();
  await new Promise(r=>setTimeout(r,500));
  const after = await page.evaluate(()=>[...document.querySelectorAll(".gallery-stage > *")].findIndex(e=>e.classList.contains("is-shown")));
  const sel = await page.evaluate(()=>document.querySelectorAll('.gallery-thumb[aria-selected="true"]').length);
  console.log(`gallery: shown ${before} -> ${after}, selected thumbs ${sel}`);
  if (before === after) problems.push("R18 gallery thumbnail click did not swap the main image");
  await ctx.close();
}

// R42 variant swap in place: the SKU, the price and the main image change, the unit NAME and the
// URL do not. The two symptoms of a wrong data model are a filter that renames a card and a picker
// that navigates between slugs, so both are asserted here.
if (run("r42")) {
  const { ctx, page } = await freshPage(1440, 900);
  await gotoSeen(page, "/unit/dome-senja/");
  const read = () => page.evaluate(() => ({
    nama: document.querySelector("h1").innerText.trim(),
    harga: document.querySelector(".harga").innerText.trim(),
    sku: document.querySelector(".varian-out dd").innerText.trim(),
    shown: [...document.querySelectorAll(".gallery-stage > *")].findIndex(e => e.classList.contains("is-shown")),
    url: location.pathname,
  }));
  const a = await read();
  const btns = await page.$$(".varian-row .varian-btn");
  // click the LAST capacity button, which on Dome Senja is a different SKU, price and image
  await btns[btns.length - 1].click();
  await new Promise(r => setTimeout(r, 400));
  const b = await read();
  console.log("variant A:", JSON.stringify(a), "\nvariant B:", JSON.stringify(b));
  if (a.nama !== b.nama) problems.push("R42 unit name changed when the variant changed");
  if (a.sku === b.sku) problems.push("R42 variant change did not swap the SKU");
  if (a.harga === b.harga) problems.push("R42 variant change did not swap the price");
  if (a.url !== b.url) problems.push("R42 variant change navigated to another slug");
  if (a.shown === b.shown) problems.push("R42 variant change did not swap the main gallery image in place");
  await ctx.close();
}

// R24 late node reveal: change a filter on the unit index and confirm the freshly inserted
// .reveal cards actually get .in. Without the MutationObserver in ClientEffects they land at
// opacity 0 and stay there, and the page reads as blank, which is the HIM-169 defect.
if (run("r24")) {
  const { ctx, page } = await freshPage(1440, 900);
  await gotoSeen(page, "/unit/");
  // open the first custom Select (R12) and pick its second option
  await (await page.$(".filter-bar .select-trigger")).click();
  await new Promise(r => setTimeout(r, 300));
  const opts = await page.$$('.filter-bar .select-panel [role="option"]');
  await opts[2].click();
  await new Promise(r => setTimeout(r, 800));
  const hidden = await page.evaluate(() => [...document.querySelectorAll(".reveal")].filter(e => {
    const r = e.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0 && getComputedStyle(e).opacity === "0";
  }).length);
  const shownCards = await page.evaluate(() => document.querySelectorAll(".snap-row .card").length);
  console.log(`post filter: ${shownCards} cards shown, on-screen .reveal still at opacity 0: ${hidden}`);
  if (hidden > 0) problems.push(`R24 ${hidden} on-screen .reveal nodes stayed at opacity 0 after filtering`);
  await ctx.close();
}

// R31 first paint nav legibility. This build's header IS translucent over the hero, which R31
// permits, so the check is not "is the bar solid" but "is the nav text legible against the WORST
// CASE thing behind it at zero scroll". The bar carries a real translucent background-color rather
// than a ::before gradient, precisely so this is measurable: a pseudo element is not in the ancestor
// chain, so a gradient band there is invisible to every contrast sweep and produces a rule that can
// only be verified by eye, which is the rule that does not get verified.
//
// The worst case is the LIGHTEST possible ground, pure white, because a dusk video frame can put
// bright amber sky right behind the bar and an interior page scrolls a light section under it.
//
// NOTE for Stage 7 and Stage 8: this is the MEASURED half. Once the real mp4 is on disk, R51 still
// requires reading an actual first paint screenshot, because only pixels prove the frame.
if (run("r31")) {
  const { ctx, page } = await freshPage(1440, 900);
  await page.goto("http://localhost:4321/", { waitUntil: "networkidle2", timeout: 60000 });
  const r = await page.evaluate(() => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(",").map((s) => parseFloat(s.trim()));
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    };
    const lum = ({ r, g, b }) => {
      const c = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    const ratio = (f, b) => { const x = lum(f) + 0.05, y = lum(b) + 0.05; return x > y ? x / y : y / x; };
    /* composite the bar over pure WHITE, the lightest thing that can ever be behind it */
    const over = (fgc, white = { r: 255, g: 255, b: 255 }) => ({
      r: fgc.r * fgc.a + white.r * (1 - fgc.a),
      g: fgc.g * fgc.a + white.g * (1 - fgc.a),
      b: fgc.b * fgc.a + white.b * (1 - fgc.a),
    });
    const header = document.querySelector(".site-header");
    const barBg = parse(getComputedStyle(header).backgroundColor);
    const worst = over(barBg);
    const measure = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize);
      const fw = parseInt(cs.fontWeight, 10) || 400;
      return {
        sel,
        color: cs.color,
        ratio: Math.round(ratio(parse(cs.color), worst) * 100) / 100,
        need: fs >= 24 || (fs >= 18.66 && fw >= 700) ? 3 : 4.5,
      };
    };
    const scrim = document.querySelector(".hero-scrim");
    return {
      barAlpha: barBg ? barBg.a : 0,
      worstGround: `rgb(${Math.round(worst.r)},${Math.round(worst.g)},${Math.round(worst.b)})`,
      items: [".nav-link", ".brand-word", ".brand-kategori", ".header-actions .btn-outline-head", ".header-actions .btn-cta"].map(measure).filter(Boolean),
      heroScrimPointer: scrim ? getComputedStyle(scrim).pointerEvents : null,
      heroScrimZ: scrim ? getComputedStyle(scrim).zIndex : null,
      copyPanelBg: getComputedStyle(document.querySelector(".hero-copy")).backgroundColor,
    };
  });
  console.log("R31 header measured over pure white, the worst case ground:", JSON.stringify(r, null, 1));
  if (r.barAlpha < 0.75) problems.push(`R31 header ground alpha is only ${r.barAlpha}, too weak for a bright hero frame`);
  for (const it of r.items) {
    if (it.ratio < it.need) problems.push(`R31 ${it.sel} is ${it.ratio}:1 on the worst case bar ground, needs ${it.need}`);
  }
  if (r.heroScrimPointer !== "none") problems.push(`R2 hero scrim is not click-through: pointer-events ${r.heroScrimPointer}`);
  await ctx.close();
}

// R57: every .select-trigger (Select AND DatePicker share this class) must not cause overflow
// while OPEN, at every breakpoint, on every page that carries one. A closed position:absolute
// panel already gets swept by the OVERFLOW loop above (default state is closed). The page list
// is discovered at runtime (not hand-guessed) so a form added to a new route is never missed.
if (run("r57")) {
  const R57_PAGES = [];
  {
    const { ctx, page } = await freshPage(1440, 900);
    for (const url of PAGES) {
      await gotoSeen(page, url);
      const n = await page.evaluate(() => document.querySelectorAll(".select-trigger").length);
      if (n > 0) R57_PAGES.push(url);
    }
    await ctx.close();
  }
  console.log("R57 pages with a select/date-picker trigger:", R57_PAGES.join(" ") || "(none)");
  for (const [w,h] of SIZES) {
    const { ctx, page } = await freshPage(w, h);
    for (const url of R57_PAGES) {
      await gotoSeen(page, url);
      const n = await page.evaluate(()=>document.querySelectorAll(".select-trigger").length);
      for (let i=0;i<n;i++){
        const trig = (await page.$$(".select-trigger"))[i];
        await trig.click();
        await new Promise(r=>setTimeout(r,300));
        const r = await page.evaluate((idx)=>{
          const panel = document.querySelectorAll(".select-panel, .dp-panel")[idx];
          const b = panel ? panel.getBoundingClientRect() : null;
          return { sw:document.documentElement.scrollWidth, iw:window.innerWidth, right: b ? Math.round(b.right) : null, left: b ? Math.round(b.left) : null };
        }, i);
        if (r.sw > r.iw + 1) problems.push(`R57 ${w}px ${url} trigger#${i} OPEN causes overflow: scrollWidth ${r.sw} > innerWidth ${r.iw}`);
        if (r.right !== null && (r.left < 0 || r.right > r.iw)) problems.push(`R57 ${w}px ${url} trigger#${i} panel escapes viewport: left ${r.left} right ${r.right} iw ${r.iw}`);
        await trig.click();
        await new Promise(r=>setTimeout(r,200));
      }
    }
    await ctx.close();
  }
}

// R48: exhaustive at 375px, every container with more than 3 peer children over ~80px tall
// must be a snap carousel (overflow-x auto|scroll AND scroll-snap-type starting with x).
// Exempt containers that are not marketing/card grids by nature: FAQ accordion list, the
// DatePicker calendar grid, fixed-length galleries (<=3 children never trip this anyway),
// and account/dashboard record lists which are inherently vertical (order/ticket history).
if (run("r48")) {
  // Exemptions, and each one is a shape R48 does not govern rather than a convenience:
  //   page root + section list  the .page-enter <main> and its <section> children
  //   .dp-grid                  a calendar month grid, R21 owns it
  //   .mega-cols / .drawer-*    navigation panels, not card rows
  //   .gallery-thumbs           a fixed 4 thumb strip driving one stage, R18 owns it
  //   .gallery-stage            crossfade slides stacked at ONE position, R18 owns it
  //   .varian-row               the R42 variant picker, a button group
  //   .article-layout           article column plus sidebar, a 2 column page shell
  //   .spec-list/.tick-list     prose lists, leaf rows not cards
  //   .footer-*/.side-list      footer link columns and a sidebar link list
  //   .booking-grid/.field/fieldset/.filter-bar  form field groups
  const R48_EXEMPT_SELECTORS = [".page-enter", ".dp-grid", ".dp-panel-inner", ".mega-cols", ".mega-inner", ".drawer-body", ".drawer-group", ".varian-row", ".varian-out", ".gallery-thumbs", ".gallery-stage", ".article-layout", ".spec-list", ".tick-list", ".footer-grid", ".footer-nav-grid", ".footer-links", ".side-list", ".side-box", ".booking-grid", ".booking", ".filter-bar", ".field", "fieldset", ".hero-meta", ".announce", ".chip-row", ".btn-row", ".rate-table", "thead", "tbody", "tr", ".table-scroll"];
  // a chronological timeline (year + one line of text per row) is not a "peer card" grid in
  // R48's sense (testimonials, products, team...). Horizontally scrolling a timeline actively
  // hurts UX, readers expect it top to bottom in order, and each row here is a single short
  // line (~40px), not a tall card, so a vertical stack is not "long and tedious" either.
  const R48_EXEMPT_CHILD_CLASS = ["faq-item"];
  const { ctx, page } = await freshPage(375, 900);
  for (const url of PAGES) {
    await gotoSeen(page, url);
    const offenders = await page.evaluate((exemptSel, exemptChildClass) => {
      const exempt = (el) => exemptSel.some(sel => el.matches(sel) || el.closest(sel));
      const out = [];
      document.querySelectorAll("body *").forEach((el) => {
        const kids = [...el.children].filter(c => c.getBoundingClientRect().height > 20);
        if (kids.length <= 3) return;
        const rect = el.getBoundingClientRect();
        if (rect.height < 80) return;
        if (exempt(el)) return;
        if (kids.some(k => exemptChildClass.some(c => k.classList.contains(c)))) return;
        // Only consider containers whose children are REPEATED, visually distinct CARDS: same
        // tag, each with its own sub-structure (not a bare text leaf like a bullet <li>), and
        // tall enough to be a card rather than a single-line list/timeline row. This avoids
        // false positives on a card's OWN internal content stack (title/desc/cta, heterogeneous
        // tags) and on plain bullet lists or timeline strips (leaf or short-row children).
        const tagSet = new Set(kids.map(k => k.tagName));
        if (tagSet.size > 1) return;
        const looksLikeCard = (k) => (k.children.length >= 2 || k.querySelector("img,svg")) && k.getBoundingClientRect().height >= 60;
        if (!kids.every(looksLikeCard)) return;
        const cs = getComputedStyle(el);
        const isCarousel = /(auto|scroll)/.test(cs.overflowX) && cs.scrollSnapType.startsWith("x");
        if (isCarousel) return;
        const isGridSingleTrack = cs.display.includes("grid");
        const isVerticalStack = !cs.display.includes("grid") && cs.flexDirection !== "row" && kids.every(k => k.getBoundingClientRect().width > rect.width * 0.5);
        if (isGridSingleTrack || isVerticalStack) {
          out.push({ cls: el.className.toString().slice(0,60), n: kids.length, overflowX: cs.overflowX, snap: cs.scrollSnapType, cols: cs.gridTemplateColumns });
        }
      });
      return out;
    }, R48_EXEMPT_SELECTORS, R48_EXEMPT_CHILD_CLASS);
    for (const o of offenders) {
      problems.push(`R48 ${url} .${o.cls || "(no class)"} has ${o.n} peer items but is not a snap carousel (overflowX=${o.overflowX} snap=${o.snap})`);
    }
  }
  await ctx.close();
}

// R50: whole page sweep, not just nav. Walk elements with <=3 children, read innerText line by
// line, flag [a-z][A-Z] glue within one rendered line or a duplicated word on one line.
//
// TWO traps here, and the second one bit this build:
//   1. Read innerText, NEVER textContent. textContent concatenates block level nodes that are
//      already visually separate, so it reports a false positive on correctly fixed markup.
//   2. innerText DEGRADES TO textContent on an element that is not being rendered. So a sweep at
//      1440px, where the mobile drawer is display:none, reports every single drawer item as glued
//      even though each one is a correct flex column with a gap. Measured on this build: the
//      hidden drawer returned "LembayungLEMBANG, BANDUNG UTARA" as ONE line while the rendered
//      header lockup returned two. Skipping non-rendered elements is therefore mandatory, and it
//      is NOT a weakening of the check, because the drawer subtree is then swept separately at
//      375px with the drawer actually open. Exempting it silently would be the weakening.
function glueSweep() {
  const out = [];
  document.querySelectorAll("body *:not(script):not(style):not(noscript)").forEach((el) => {
    if (el.children.length > 3) return;
    // not rendered means innerText is textContent, which is a guaranteed false positive
    if (typeof el.checkVisibility === "function") {
      if (!el.checkVisibility()) return;
    } else if (el.offsetParent === null && el.getClientRects().length === 0) {
      return;
    }
    if (!el.innerText || el.innerText.length > 200) return;
    for (const line of el.innerText.split("\n")) {
      if (/[a-z][A-Z]/.test(line)) out.push({ line, cls: el.className.toString().slice(0, 50), tag: el.tagName });
    }
  });
  return out;
}

if (run("r50")) {
  const WHITELIST = GLUE_WHITELIST;
  const { ctx, page } = await freshPage(1440, 900);
  for (const url of PAGES) {
    await gotoSeen(page, url);
    const glued = await page.evaluate(glueSweep);
    for (const g of glued) {
      if (WHITELIST.test(g.line)) continue;
      problems.push(`R50 1440px ${url} <${g.tag} class="${g.cls}"> glued line: "${g.line}"`);
    }
  }
  await ctx.close();
}

// R50 second pass: the DRAWER, at 375px, open, with every accordion expanded. This is the state
// where drawer items are actually rendered, so it is the only state in which they can be read.
if (run("r50")) {
  const WHITELIST = GLUE_WHITELIST;
  const { ctx, page } = await freshPage(375, 800);
  await gotoSeen(page, "/");
  await page.click(".burger");
  await new Promise(r => setTimeout(r, 500));
  /* the drawer accordion is single open by design, so clicking every trigger in a row leaves only
     the LAST group expanded and the earlier ones go unswept. Open one at a time and sweep after
     each. */
  const groupCount = await page.evaluate(() => document.querySelectorAll(".drawer-trigger[aria-expanded]").length);
  const sweepDrawer = () => page.evaluate(() => {
    const out = [];
    document.querySelectorAll(".drawer *:not(script):not(style)").forEach((el) => {
      if (el.children.length > 3) return;
      if (typeof el.checkVisibility === "function" ? !el.checkVisibility() : el.getClientRects().length === 0) return;
      if (!el.innerText || el.innerText.length > 200) return;
      for (const line of el.innerText.split("\n")) {
        if (/[a-z][A-Z]/.test(line)) out.push({ line, cls: el.className.toString().slice(0, 50), tag: el.tagName });
      }
    });
    return out;
  });

  let raw = 0;
  for (let i = 0; i < groupCount; i++) {
    const trig = (await page.$$(".drawer-trigger[aria-expanded]"))[i];
    await trig.click();
    await new Promise(r => setTimeout(r, 320));
    const glued = await sweepDrawer();
    raw += glued.length;
    for (const g of glued) {
      if (WHITELIST.test(g.line)) continue;
      problems.push(`R50 375px drawer group#${i} <${g.tag} class="${g.cls}"> glued line: "${g.line}"`);
    }
  }
  console.log(`R50 drawer pass at 375px: ${groupCount} accordion groups opened one at a time, ${raw} raw hits`);
  await ctx.close();
}

// R58: the dash sweep must read RENDERED text (innerText, after reveal animations have had a
// chance to run) and match em/en dash, not just grep literal source characters, because JSX can
// emit &mdash;/&ndash;/&#8212;/&#8211; as ordinary text that a literal-character grep never sees.
if (run("r58")) {
  const { ctx, page } = await freshPage(1440, 1200);
  for (const url of PAGES) {
    await gotoSeen(page, url);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 500));
    const hits = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll("body *").forEach((el) => {
        if (el.children.length > 0) return; // leaf nodes only, avoids duplicate reports up the tree
        const text = el.textContent || "";
        if (/[–—]/.test(text)) {
          out.push({ tag: el.tagName, cls: (el.className || "").toString().slice(0, 50), text: text.slice(0, 80) });
        }
      });
      return out;
    });
    for (const h of hits) problems.push(`R58 ${url} rendered dash in <${h.tag} class="${h.cls}">: "${h.text}"`);
  }
  await ctx.close();
}

// R59: crawl every internal link across every route, assert 200, and assert every generated
// route is reachable from at least one link (no orphans). A misspelled folder vs. correctly
// spelled links (or vice versa) is exactly the Mabrur /pembimping/ vs /pembimbing/ failure.
if (run("r59")) {
  const allHrefs = new Set();
  const linkedFrom = new Map(); // href -> [pages that link to it]
  const { ctx, page } = await freshPage(1440, 900);
  for (const url of PAGES) {
    await gotoSeen(page, url);
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute("href"))
    );
    for (const h of hrefs) {
      allHrefs.add(h);
      if (!linkedFrom.has(h)) linkedFrom.set(h, []);
      linkedFrom.get(h).push(url);
    }
  }
  await ctx.close();

  // (a) every linked href must resolve to a real file via the same static-file logic the
  // dev server above uses, not just "the server returns something".
  // Stage 4 (Webapp Architect, HIM-319) SHIPPED /app, so the temporary bypass that reported
  // `/app/*` hrefs as "pending on Stage 4" instead of resolving them is gone. Those links are
  // now crawled and asserted exactly like every other internal link, which is what Stage 8's
  // deploy gate needs. `pending` stays declared so the reporting line below still compiles and
  // prints nothing once the list is empty.
  const pending = [];
  for (const href of allHrefs) {
    const clean = href.split("#")[0].split("?")[0];
    if (!clean || clean === "/") continue;
    let f = join(ROOT, clean);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    else if (!existsSync(f) && existsSync(f + ".html")) f = f + ".html";
    else if (!existsSync(f) && existsSync(f.replace(/\/$/, "") + ".html")) f = f.replace(/\/$/, "") + ".html";
    if (!existsSync(f)) {
      problems.push(`R59 broken link: "${clean}" (linked from ${linkedFrom.get(href).slice(0, 3).join(", ")}) resolves to no file`);
    }
  }
  // (b) every generated route must be reached by at least one link somewhere on the site.
  const normalizedLinked = new Set([...allHrefs].map((h) => {
    let c = h.split("#")[0].split("?")[0];
    if (!c.endsWith("/") && !c.includes(".")) c += "/";
    return c;
  }));
  for (const route of PAGES) {
    if (route === "/") continue;
    // dynamic detail routes (satwa/[slug], artikel/[slug], portal/tiket/[id]) are reached via a
    // listing page's generated cards, not necessarily via a raw <a href> match if the listing is
    // itself client-rendered from data; still check the literal href since these pages render
    // plain <Link href> at build time.
    if (!normalizedLinked.has(route)) {
      problems.push(`R59 orphan route: "${route}" is generated but not linked from any page`);
    }
  }
  console.log(`R59: ${allHrefs.size} distinct internal hrefs crawled across ${PAGES.length} routes`);
  if (pending.length) {
    console.log(`R59 PENDING on Stage 4 (Webapp Architect owns /app): ${[...new Set(pending)].join(" ")}`);
  }
}

// R60: aria-expanded must match what is actually rendered. The Mabrur trap was an onFocus
// opener plus an onClick toggler double-firing on a real click, leaving aria-expanded="false"
// while the panel stayed visually open under :hover/:focus-within. Click the trigger, move the
// pointer well away (so :hover cannot mask the state), then compare aria-expanded to the
// controlled panel's actual computed visibility.
async function checkAriaExpandedTriggers(page, label, selector = '[aria-expanded][aria-controls]') {
  // only VISIBLE triggers are real candidates: at desktop width the mobile-only .burger is
  // display:none (R47), and clicking a hidden element throws rather than testing anything.
  const visibleCount = await page.evaluate((sel) =>
    [...document.querySelectorAll(sel)].filter((el) => {
      // a non-zero client rect is not enough: an off-canvas drawer's internal accordion
      // triggers keep real dimensions even while translated outside the viewport (e.g.
      // left:1460 on a 1440px page), and Puppeteer's click() correctly refuses those as
      // "not clickable". Require the rect to actually overlap the current viewport too.
      const r = el.getBoundingClientRect();
      const inViewport = r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < window.innerWidth && r.top < window.innerHeight;
      if (!inViewport) return false;
      const cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && cs.display !== "none";
    }).length
  , selector);
  console.log(`R60 ${label}: ${visibleCount} visible triggers with aria-expanded+aria-controls`);
  for (let i = 0; i < visibleCount; i++) {
    const trig = await page.evaluateHandle((sel, idx) =>
      [...document.querySelectorAll(sel)].filter((el) => {
      // a non-zero client rect is not enough: an off-canvas drawer's internal accordion
      // triggers keep real dimensions even while translated outside the viewport (e.g.
      // left:1460 on a 1440px page), and Puppeteer's click() correctly refuses those as
      // "not clickable". Require the rect to actually overlap the current viewport too.
      const r = el.getBoundingClientRect();
      const inViewport = r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < window.innerWidth && r.top < window.innerHeight;
      if (!inViewport) return false;
      const cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && cs.display !== "none";
    })[idx]
    , selector, i);
    await trig.click();
    await page.mouse.move(2, 2); // move away so :hover / :focus-within cannot fake "open"
    await new Promise((r) => setTimeout(r, 350));
    const r = await page.evaluate((sel, idx) => {
      const t = [...document.querySelectorAll(sel)].filter((el) => {
      // a non-zero client rect is not enough: an off-canvas drawer's internal accordion
      // triggers keep real dimensions even while translated outside the viewport (e.g.
      // left:1460 on a 1440px page), and Puppeteer's click() correctly refuses those as
      // "not clickable". Require the rect to actually overlap the current viewport too.
      const r = el.getBoundingClientRect();
      const inViewport = r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < window.innerWidth && r.top < window.innerHeight;
      if (!inViewport) return false;
      const cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && cs.display !== "none";
    })[idx];
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (!panel) return { noPanel: true };
      const cs = getComputedStyle(panel);
      const rect = panel.getBoundingClientRect();
      const visuallyOpen = cs.visibility !== "hidden" && cs.display !== "none" && parseFloat(cs.opacity) > 0 && rect.height > 4;
      return { ariaExpanded: t.getAttribute("aria-expanded"), visuallyOpen };
    }, selector, i);
    if (r.noPanel) { problems.push(`R60 ${label} trigger#${i}: aria-controls target does not exist in DOM`); continue; }
    const ariaTrue = r.ariaExpanded === "true";
    if (ariaTrue !== r.visuallyOpen) {
      problems.push(`R60 ${label} trigger#${i}: aria-expanded="${r.ariaExpanded}" but panel visuallyOpen=${r.visuallyOpen} after click+pointer-away`);
    }
    // close it back down for the next iteration
    const trig2 = await page.evaluateHandle((sel, idx) =>
      [...document.querySelectorAll(sel)].filter((el) => {
      // a non-zero client rect is not enough: an off-canvas drawer's internal accordion
      // triggers keep real dimensions even while translated outside the viewport (e.g.
      // left:1460 on a 1440px page), and Puppeteer's click() correctly refuses those as
      // "not clickable". Require the rect to actually overlap the current viewport too.
      const r = el.getBoundingClientRect();
      const inViewport = r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < window.innerWidth && r.top < window.innerHeight;
      if (!inViewport) return false;
      const cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && cs.display !== "none";
    })[idx]
    , selector, i);
    await trig2.click();
    await new Promise((r) => setTimeout(r, 200));
  }
}
if (run("r60")) {
  const { ctx, page } = await freshPage(1440, 900);
  await gotoSeen(page, "/");
  await checkAriaExpandedTriggers(page, "desktop 1440px");
  await ctx.close();
}
// R60 also on the drawer burger + welcome modal close, which carry aria-expanded/aria-modal
// at 375px (the only aria-expanded+aria-controls trigger visible at that width is the burger
// itself, checked explicitly here for a clearer failure message than the generic loop above).
if (run("r60")) {
  const { ctx, page } = await freshPage(375, 800);
  await gotoSeen(page, "/");
  const burger = await page.$(".burger");
  await burger.click();
  await page.mouse.move(2, 2);
  await new Promise((r) => setTimeout(r, 350));
  const r = await page.evaluate(() => {
    const b = document.querySelector(".burger");
    const d = document.querySelector(".drawer");
    const cs = getComputedStyle(d);
    const rect = d.getBoundingClientRect();
    const visuallyOpen = cs.visibility !== "hidden" && cs.display !== "none" && rect.width > 4 && rect.height > 4;
    return { ariaExpanded: b.getAttribute("aria-expanded"), visuallyOpen };
  });
  if ((r.ariaExpanded === "true") !== r.visuallyOpen) {
    problems.push(`R60 drawer burger: aria-expanded="${r.ariaExpanded}" but drawer visuallyOpen=${r.visuallyOpen}`);
  }
  // the drawer's own internal accordion triggers (.drawer-trigger, aria-expanded+aria-controls)
  // only become testable once the drawer itself is open (off-canvas otherwise), and the burger
  // is excluded here since it was just tested above and re-clicking it would close the drawer
  // mid-loop and strand the remaining accordion triggers off-canvas.
  await checkAriaExpandedTriggers(page, "mobile 375px drawer accordions", ".drawer-trigger[aria-expanded][aria-controls]");
  await ctx.close();
}

await browser.close();
server.close();
console.log("\n=== PROBLEMS ===");
console.log(problems.length ? problems.join("\n") : "none");
process.exit(problems.length ? 1 : 0);
