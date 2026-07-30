/* Behavioural QA for the /app reservation panel. Stage 4, Webapp Architect.
 *
 * `qa-check.mjs` sweeps STRUCTURE across every route (overflow, R48, R50, R57, R58, R59) and
 * `qa-r20.mjs` sweeps contrast. Neither can tell whether a kanban card actually moves, whether
 * switching view silently drops the active filter, or whether the drawer is a real full
 * viewport element rather than a strip. This script drives the panel and MEASURES the result.
 *
 * Every assertion here reads geometry or rendered state, never CSS. R53 in particular cannot be
 * verified any other way: the stylesheet says `position: fixed; top: 0; bottom: 0` in both the
 * broken and the correct case, and only getBoundingClientRect can tell them apart.
 *
 * Run: node scripts/qa-app.mjs ./out
 */

import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { ensureBrowser } from './qa-setup.mjs';

const ROOT = process.argv[2] || 'out';
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.mp4': 'video/mp4',
};
const server = createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  let f = join(ROOT, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f) && existsSync(f + '.html')) f = f + '.html';
  if (!existsSync(f)) { res.writeHead(404); res.end('404'); return; }
  res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(4325, r));

const { executablePath, env } = await ensureBrowser();
const browser = await puppeteer.launch({ executablePath, env, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const problems = [];
const notes = [];
const ok = (m) => notes.push('ok    ' + m);
const bad = (m) => problems.push(m);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(w, h, url) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto('http://localhost:4325' + url, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => {
    sessionStorage.setItem('lembayung_welcome_seen', '1');
    sessionStorage.setItem('lembayung_cta_float_seen', '1');
  });
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  return { ctx, page };
}

/* ---------------------------------------------------------------- 1. marketing chrome gone */
{
  const { ctx, page } = await open(1440, 900, '/app/');
  const r = await page.evaluate(() => ({
    header: document.querySelectorAll('.site-header').length,
    footer: document.querySelectorAll('.footer').length,
    announce: document.querySelectorAll('.announce').length,
    wa: document.querySelectorAll('.wa-float').length,
    shell: document.querySelectorAll('.app-shell').length,
    bodyOverflow: getComputedStyle(document.body).overflow,
    scrollable: document.documentElement.scrollHeight > window.innerHeight,
  }));
  if (r.header + r.footer + r.announce + r.wa > 0) bad(`chrome leaked onto /app/: ${JSON.stringify(r)}`);
  else if (r.shell !== 1) bad('app shell missing on /app/');
  else ok(`marketing chrome absent on /app/, one app shell present, body overflow "${r.bodyOverflow}", page scrollable ${r.scrollable}`);
  await ctx.close();
}

/* ---------------------------------------------------------------- 2. R53 + R57 drawer at 375 */
{
  const { ctx, page } = await open(375, 800, '/app/');
  const shut = await page.evaluate(() => ({
    drawers: document.querySelectorAll('.app-drawer, .app-rec-panel, .app-scrim').length,
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
    aria: document.querySelector('.app-burger').getAttribute('aria-expanded'),
  }));
  if (shut.drawers !== 0) bad(`R57 overlay still in the DOM while closed: ${shut.drawers} node(s)`);
  if (shut.sw > shut.iw + 1) bad(`R19 overflow with everything closed: ${shut.sw} > ${shut.iw}`);
  if (shut.aria !== 'false') bad(`R60 burger reports aria-expanded="${shut.aria}" while the drawer is unmounted`);

  await page.click('.app-burger');
  await page.mouse.move(2, 2);
  await wait(500);
  const open1 = await page.evaluate(() => {
    const d = document.querySelector('.app-drawer');
    const b = d.getBoundingClientRect();
    return {
      top: Math.round(b.top), height: Math.round(b.height), width: Math.round(b.width),
      ih: window.innerHeight, parentIsBody: d.parentElement === document.body,
      aria: document.querySelector('.app-burger').getAttribute('aria-expanded'),
      sw: document.documentElement.scrollWidth, iw: window.innerWidth,
      links: d.querySelectorAll('.app-nav-link').length,
    };
  });
  if (Math.abs(open1.height - open1.ih) > 2 || Math.abs(open1.top) > 2) {
    bad(`R53 drawer is clipped, not full viewport: top ${open1.top} height ${open1.height} vs innerHeight ${open1.ih}`);
  }
  if (!open1.parentIsBody) bad('R53 drawer is not portalled to document.body');
  if (open1.aria !== 'true') bad(`R60 burger aria-expanded="${open1.aria}" while the drawer is measurably open`);
  if (open1.sw > open1.iw + 1) bad(`R19 drawer open causes page overflow: ${open1.sw} > ${open1.iw}`);
  ok(`R53 drawer top ${open1.top}, height ${open1.height} in an ${open1.ih}px viewport, portalled to body, ${open1.links} nav links, aria-expanded ${open1.aria}`);

  await page.keyboard.press('Escape');
  await wait(500);
  const after = await page.evaluate(() => ({
    nodes: document.querySelectorAll('.app-drawer, .app-scrim').length,
    aria: document.querySelector('.app-burger').getAttribute('aria-expanded'),
    bodyOverflow: document.body.style.overflow,
  }));
  if (after.nodes !== 0) bad(`R57 drawer left ${after.nodes} node(s) in the DOM after Escape`);
  if (after.aria !== 'false') bad(`R60 burger aria-expanded="${after.aria}" after Escape closed the drawer`);
  if (after.bodyOverflow === 'hidden') bad('drawer close did not restore body scroll');
  else ok('drawer unmounts on Escape, aria returns to false, body scroll restored');

  /* R47: mobile topbar tap targets and no overlap */
  const bar = await page.evaluate(() => {
    const kids = [...document.querySelectorAll('.app-top a, .app-top button')];
    const rects = kids.map((k) => {
      const b = k.getBoundingClientRect();
      return { tag: k.tagName, cls: k.className.toString().slice(0, 24), w: Math.round(b.width), h: Math.round(b.height), x: Math.round(b.left), y: Math.round(b.top), r: Math.round(b.right), bt: Math.round(b.bottom) };
    });
    const overlap = [];
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i], b = rects[j];
        if (a.x < b.r && b.x < a.r && a.y < b.bt && b.y < a.bt) overlap.push([a.cls, b.cls]);
      }
    }
    /* R52: exactly ONE brand lockup VISIBLE at this width. Counting DOM presence would report 2,
       because the desktop sidebar is display:none here rather than removed. */
    const brands = [...document.querySelectorAll('.app-top-brand, .app-brand')].filter((e) =>
      typeof e.checkVisibility === 'function' ? e.checkVisibility() : e.getClientRects().length > 0,
    ).length;
    return { rects, overlap, brands };
  });
  for (const r of bar.rects) {
    if (r.h < 44 || r.w < 44) bad(`R47 topbar target below 44px: <${r.tag} class="${r.cls}"> ${r.w}x${r.h}`);
  }
  if (bar.overlap.length) bad(`R47 topbar controls overlap: ${JSON.stringify(bar.overlap)}`);
  if (bar.brands !== 1) bad(`R52 ${bar.brands} brand lockups visible at 375px, expected exactly 1`);
  else ok(`R47 mobile topbar: ${bar.rects.length} targets, all >=44px, none overlapping, ${bar.brands} brand lockup rendered`);
  await ctx.close();
}

/* ---------------------------------------------------------------- 3. sidebar and rail at 1440 */
{
  const { ctx, page } = await open(1440, 900, '/app/unit/');
  const a = await page.evaluate(() => {
    const side = document.querySelector('.app-side');
    const b = side.getBoundingClientRect();
    const aktif = document.querySelector('.app-nav-link.is-active');
    return {
      sticky: getComputedStyle(side).position, width: Math.round(b.width), height: Math.round(b.height),
      ih: window.innerHeight,
      aktif: aktif ? aktif.getAttribute('href') : null,
      current: aktif ? aktif.getAttribute('aria-current') : null,
      cols: getComputedStyle(document.querySelector('.app-shell')).gridTemplateColumns,
      pressed: document.querySelector('.app-rail-btn').getAttribute('aria-pressed'),
    };
  });
  if (a.aktif !== '/app/unit/') bad(`sidebar highlights "${a.aktif}" on /app/unit/, longest match failed`);
  if (a.current !== 'page') bad('active sidebar item is missing aria-current="page"');
  if (a.sticky !== 'sticky') bad(`sidebar position is "${a.sticky}", expected sticky (fixed would be captured by the animated route wrapper)`);
  ok(`sidebar ${a.width}px wide, ${a.height}px tall in a ${a.ih}px viewport, position ${a.sticky}, active item ${a.aktif}, grid "${a.cols}"`);

  await page.click('.app-rail-btn');
  await wait(400);
  const b = await page.evaluate(() => ({
    cols: getComputedStyle(document.querySelector('.app-shell')).gridTemplateColumns,
    attr: document.documentElement.getAttribute('data-app-rail'),
    pressed: document.querySelector('.app-rail-btn').getAttribute('aria-pressed'),
    stored: localStorage.getItem('lembayung_app_rail'),
    labelsShown: [...document.querySelectorAll('.app-side .app-nav-label')].filter((e) => e.getClientRects().length > 0).length,
  }));
  if (b.attr !== '1' || b.pressed !== 'true') bad(`rail toggle state mismatch: attr=${b.attr} aria-pressed=${b.pressed}`);
  if (b.stored !== '1') bad('rail state was not persisted to localStorage');
  if (b.labelsShown !== 0) bad(`rail is collapsed but ${b.labelsShown} nav labels are still rendered`);

  await page.reload({ waitUntil: 'networkidle2' });
  const c = await page.evaluate(() => ({
    cols: getComputedStyle(document.querySelector('.app-shell')).gridTemplateColumns,
    attr: document.documentElement.getAttribute('data-app-rail'),
    pressed: document.querySelector('.app-rail-btn').getAttribute('aria-pressed'),
  }));
  if (c.attr !== '1' || c.pressed !== 'true') bad(`rail state did not survive a reload: ${JSON.stringify(c)}`);
  else ok(`rail collapses ${a.cols} to ${b.cols} and survives a reload (attr ${c.attr}, aria-pressed ${c.pressed})`);
  await page.evaluate(() => localStorage.removeItem('lembayung_app_rail'));
  await ctx.close();
}

/* ------------------------------------------------- 4. views: switching keeps filters, persists */
{
  const { ctx, page } = await open(1440, 1000, '/app/');
  const start = await page.evaluate(() => ({
    pressed: document.querySelector('.app-views [aria-pressed="true"]').innerText.trim(),
    cal: document.querySelectorAll('.app-cal').length,
  }));
  if (start.pressed !== 'Kalender' || start.cal !== 1) bad(`default view is "${start.pressed}" with ${start.cal} calendars, expected Kalender`);

  await page.type('#app-cari', 'dome');
  await wait(400);
  const filtered = await page.evaluate(() => document.querySelector('.app-hitung').innerText.trim());

  const btns = await page.$$('.app-views .app-view-btn');
  await btns[1].click(); /* Tabel */
  await wait(400);
  const afterSwitch = await page.evaluate(() => ({
    cari: document.querySelector('#app-cari').value,
    hitung: document.querySelector('.app-hitung').innerText.trim(),
    rows: document.querySelectorAll('.app-table tbody tr').length,
    pressed: document.querySelector('.app-views [aria-pressed="true"]').innerText.trim(),
    stickyTh: getComputedStyle(document.querySelector('.app-table thead th')).position,
  }));
  if (afterSwitch.cari !== 'dome') bad('switching view reset the search filter');
  if (afterSwitch.hitung !== filtered) bad(`switching view changed the result count: "${filtered}" then "${afterSwitch.hitung}"`);
  if (afterSwitch.stickyTh !== 'sticky') bad(`table header position is "${afterSwitch.stickyTh}", expected sticky`);
  ok(`view switch Kalender to Tabel keeps the filter ("${afterSwitch.cari}", ${afterSwitch.hitung}), ${afterSwitch.rows} rows, sticky header`);

  await page.reload({ waitUntil: 'networkidle2' });
  await wait(500);
  const remembered = await page.evaluate(() => ({
    pressed: document.querySelector('.app-views [aria-pressed="true"]').innerText.trim(),
    cari: document.querySelector('#app-cari').value,
  }));
  if (remembered.pressed !== 'Tabel') bad(`view choice not remembered across a reload, got "${remembered.pressed}"`);
  else ok(`view choice remembered across a reload ("${remembered.pressed}"), and the filter correctly resets ("${remembered.cari}")`);

  /* sorting */
  const th = await page.$$('.app-table .app-th-btn');
  const before = await page.evaluate(() => document.querySelector('.app-table tbody tr td:nth-child(2)').innerText.trim());
  await th[1].click(); /* Tamu */
  await wait(300);
  const after = await page.evaluate(() => ({
    first: document.querySelector('.app-table tbody tr td:nth-child(2)').innerText.trim(),
    sort: document.querySelectorAll('.app-table th[aria-sort="ascending"]').length,
  }));
  if (before === after.first) bad('sorting by Tamu did not reorder the rows');
  if (after.sort !== 1) bad(`expected exactly 1 column reporting aria-sort, got ${after.sort}`);
  else ok(`sort by Tamu reorders rows (${before} to ${after.first}) and reports aria-sort on exactly one column`);

  /* selection and bulk action */
  const boxes = await page.$$('.app-table tbody .app-check');
  await boxes[0].click();
  await boxes[1].click();
  await wait(300);
  const bulk = await page.evaluate(() => {
    const bar = document.querySelector('.app-bulk');
    return {
      shown: Boolean(bar),
      teks: bar ? bar.querySelector('.app-bulk-teks').innerText.trim() : '',
      kode: [...document.querySelectorAll('.app-table tbody tr.is-picked .app-td-kode')].map((e) => e.innerText.trim()),
    };
  });
  if (!bulk.shown || bulk.kode.length !== 2) bad(`bulk bar did not appear for 2 selected rows: ${JSON.stringify(bulk)}`);
  const konfirm = await page.$('.app-bulk .btn-cta');
  await konfirm.click();
  await wait(400);
  const done = await page.evaluate((kode) => {
    const rows = [...document.querySelectorAll('.app-table tbody tr')];
    const hit = rows.filter((tr) => kode.includes(tr.querySelector('.app-td-kode').innerText.trim()));
    return { statuses: hit.map((tr) => tr.querySelector('.app-badge').innerText.trim()), bar: document.querySelectorAll('.app-bulk').length };
  }, bulk.kode);
  /* the badge is text-transform: uppercase, so innerText comes back shouted. Compare case
     insensitively rather than "fixing" the design to match the test. */
  if (done.statuses.some((s) => s.toLowerCase() !== 'dikonfirmasi')) bad(`bulk confirm left statuses ${JSON.stringify(done.statuses)}`);
  if (done.bar !== 0) bad('bulk bar stayed on screen after the action cleared the selection');
  else ok(`bulk action on ${bulk.kode.join(' and ')} set both to Dikonfirmasi and cleared the selection`);
  await ctx.close();
}

/* ---------------------------------------------------------------- 5. kanban move */
{
  const { ctx, page } = await open(1440, 1000, '/app/');
  const btns = await page.$$('.app-views .app-view-btn');
  await btns[3].click(); /* Papan */
  await wait(500);
  const before = await page.evaluate(() => ({
    cols: [...document.querySelectorAll('.app-kan-col')].map((c) => c.querySelector('.app-kan-jumlah').innerText.trim()),
    first: document.querySelector('.app-kan-col .app-kan-card .app-rec-judul').innerText.trim(),
  }));
  /* the first card in column 1 (Permintaan), moved one column right by its keyboard control */
  const move = await page.$$('.app-kan-col:first-child .app-kan-card .app-mini');
  await move[1].click();
  await wait(400);
  const after = await page.evaluate(() => ({
    cols: [...document.querySelectorAll('.app-kan-col')].map((c) => c.querySelector('.app-kan-jumlah').innerText.trim()),
  }));
  if (Number(after.cols[0]) !== Number(before.cols[0]) - 1 || Number(after.cols[1]) !== Number(before.cols[1]) + 1) {
    bad(`kanban move did not commit: columns ${before.cols.join('/')} then ${after.cols.join('/')}`);
  } else {
    ok(`kanban keyboard move commits: columns ${before.cols.join('/')} to ${after.cols.join('/')}`);
  }
  const drag = await page.evaluate(() => {
    const c = document.querySelector('.app-kan-card');
    return { draggable: c.getAttribute('draggable'), grab: getComputedStyle(c).cursor };
  });
  if (drag.draggable !== 'true') bad('kanban cards are not draggable');
  else ok(`kanban cards are draggable (cursor ${drag.grab}) as well as keyboard movable`);
  await ctx.close();
}

/* ---------------------------------------------------------------- 6. calendar day panel */
{
  const { ctx, page } = await open(1440, 1000, '/app/');
  const first = await page.evaluate(() => document.querySelector('.app-side-judul').innerText.trim());
  /* pick a day that is NOT today. The panel opens on today, so clicking it proves nothing, and
     the second to last cell of the current month happened to BE today on the first run. */
  const days = await page.$$('.app-cal-day:not(.is-today)');
  await days[8].click();
  await wait(400);
  const after = await page.evaluate(() => ({
    judul: document.querySelector('.app-side-judul').innerText.trim(),
    pressed: document.querySelectorAll('.app-cal-day[aria-pressed="true"]').length,
    ket: document.querySelector('.app-side-ket').innerText.trim(),
  }));
  if (after.judul === first) bad('clicking a calendar day did not update the day panel');
  if (after.pressed !== 1) bad(`expected exactly 1 selected day, got ${after.pressed}`);
  else ok(`calendar day click moves the panel from "${first}" to "${after.judul}", one day selected, "${after.ket.slice(0, 60)}"`);

  /* record panel: open, measure, close */
  const rec = await page.$('.app-cal-layout .app-rec');
  if (rec) {
    await rec.click();
    await wait(500);
    const panel = await page.evaluate(() => {
      const p = document.querySelector('.app-rec-panel');
      const b = p.getBoundingClientRect();
      return {
        top: Math.round(b.top), height: Math.round(b.height), right: Math.round(b.right),
        ih: window.innerHeight, iw: window.innerWidth,
        parentIsBody: p.parentElement === document.body,
        role: p.getAttribute('role'), modal: p.getAttribute('aria-modal'),
        sw: document.documentElement.scrollWidth,
      };
    });
    if (Math.abs(panel.height - panel.ih) > 2 || Math.abs(panel.top) > 2) bad(`R53 record panel clipped: top ${panel.top} height ${panel.height} vs ${panel.ih}`);
    if (!panel.parentIsBody) bad('R53 record panel is not portalled to document.body');
    if (panel.sw > panel.iw + 1) bad(`record panel open causes overflow: ${panel.sw} > ${panel.iw}`);
    await page.keyboard.press('Escape');
    await wait(500);
    const gone = await page.evaluate(() => document.querySelectorAll('.app-rec-panel, .app-scrim').length);
    if (gone !== 0) bad(`R57 record panel left ${gone} node(s) in the DOM after Escape`);
    else ok(`R53 record panel measures top ${panel.top} height ${panel.height} in a ${panel.ih}px viewport, role ${panel.role} aria-modal ${panel.modal}, unmounts on Escape`);
  } else {
    bad('no reservation row in the calendar day panel to open');
  }
  await ctx.close();
}

/* ---------------------------------------------------------------- 7. login lands in the panel */
{
  const { ctx, page } = await open(1440, 900, '/app/masuk/');
  const pre = await page.evaluate(() => ({
    email: document.querySelector('#masuk-email').value,
    sandi: document.querySelector('#masuk-sandi').value,
    tipe: document.querySelector('#masuk-sandi').getAttribute('type'),
    labels: [...document.querySelectorAll('.app-masuk-kartu .field-label')].map((e) => e.innerText.trim()),
  }));
  if (!pre.email || !pre.sandi) bad('login fields are not prefilled with the demo credentials');
  await page.click('.app-masuk-kartu button[type="submit"]');
  await wait(900);
  const posted = await page.evaluate(() => ({
    path: location.pathname,
    nama: document.querySelector('.app-sesi-nama b') ? document.querySelector('.app-sesi-nama b').innerText.trim() : null,
    peran: document.querySelector('.app-sesi-nama span') ? document.querySelector('.app-sesi-nama span').innerText.trim() : null,
    shell: document.querySelectorAll('.app-shell').length,
  }));
  if (posted.path !== '/app/') bad(`login did not land in the panel, path is ${posted.path}`);
  if (posted.nama !== 'Rani Anggraeni') bad(`topbar identity after login is "${posted.nama}"`);
  else ok(`login submits and lands on ${posted.path} as ${posted.nama}, ${posted.peran}, labels ${JSON.stringify(pre.labels)}`);

  /* the wrong password still fails */
  await page.goto('http://localhost:4325/app/masuk/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.removeItem('lembayung_app_sesi'));
  await page.reload({ waitUntil: 'networkidle2' });
  await page.click('#masuk-sandi', { clickCount: 3 });
  await page.type('#masuk-sandi', 'salah');
  await page.click('.app-masuk-kartu button[type="submit"]');
  await wait(500);
  const galat = await page.evaluate(() => ({
    alert: document.querySelectorAll('.app-galat[role="alert"]').length,
    path: location.pathname,
  }));
  if (galat.alert !== 1 || galat.path !== '/app/masuk/') bad(`wrong password did not produce an error: ${JSON.stringify(galat)}`);
  else ok('a wrong password shows the error and stays on the login screen');
  await ctx.close();
}

/* -------------------------------------------- 8. portal: tabs, lookup, R24 late node reveal */
{
  const { ctx, page } = await open(1440, 1000, '/app/portal/');
  const awal = await page.evaluate(() => ({
    tab: document.querySelector('.app-tab-row [aria-pressed="true"]').innerText.trim(),
    items: document.querySelectorAll('.app-list .app-rec').length,
  }));
  const tabs = await page.$$('.app-tab-row .app-view-btn');
  await tabs[1].click();
  await wait(400);
  const riwayat = await page.evaluate(() => ({
    tab: document.querySelector('.app-tab-row [aria-pressed="true"]').innerText.trim(),
    items: document.querySelectorAll('.app-list .app-rec').length,
  }));
  if (riwayat.tab === awal.tab) bad('portal tab switch did not change the pressed tab');
  else ok(`portal tabs: "${awal.tab}" (${awal.items} items) to "${riwayat.tab}" (${riwayat.items} items)`);

  /* R24: the lookup result is inserted AFTER mount and carries .reveal. Without the
     MutationObserver in ClientEffects it lands at opacity 0 and never receives .in. */
  const kode = await page.evaluate(() => document.querySelector('.app-side-ket').innerText.match(/LMB-\d+/)[0]);
  await page.type('#portal-kode', kode);
  await page.click('.app-side-box button[type="submit"]');
  await wait(900);
  const hasil = await page.evaluate(() => {
    const el = document.querySelector('.app-side-box .reveal');
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { opacity: cs.opacity, hasIn: el.classList.contains('in'), teks: el.innerText.split('\n')[0] };
  });
  if (!hasil) bad('portal code lookup rendered no result');
  else if (parseFloat(hasil.opacity) < 0.99 || !hasil.hasIn) bad(`R24 late inserted .reveal stayed hidden: opacity ${hasil.opacity}, has .in ${hasil.hasIn}`);
  else ok(`R24 lookup result inserted after mount is revealed (opacity ${hasil.opacity}, .in ${hasil.hasIn}): "${hasil.teks}"`);

  const kosong = await page.evaluate(() => {
    const i = document.querySelector('#portal-kode');
    return { label: document.querySelector('label[for="portal-kode"]').innerText.trim(), placeholder: i.getAttribute('placeholder') };
  });
  if (!kosong.label || !kosong.placeholder) bad('R19 lookup input has no visible label or placeholder');
  else ok(`lookup input has a visible label "${kosong.label}" and placeholder "${kosong.placeholder}"`);
  await ctx.close();
}

/* ---------------------------------------------------------------- 9. empty state is designed */
{
  const { ctx, page } = await open(1440, 900, '/app/');
  await page.type('#app-cari', 'zzzz tidak ada');
  await wait(500);
  const e = await page.evaluate(() => {
    const k = document.querySelector('.app-kosong');
    return k
      ? { judul: k.querySelector('.app-kosong-judul').innerText.trim(), aksi: k.querySelectorAll('a, button').length, tabel: document.querySelectorAll('.app-table').length }
      : null;
  });
  if (!e) bad('an empty result set rendered nothing, not a designed empty state');
  else if (e.aksi < 1) bad('empty state has no action button');
  else ok(`empty state renders "${e.judul}" with ${e.aksi} action(s)`);
  await ctx.close();
}

/* ------------------------------------------------- 10. the demo data is actually alive

   The dataset is derived from the build date, so it shifts every time the site is rebuilt. That
   makes "does it still look like a working business" a thing worth ASSERTING rather than
   eyeballing once. A first cut of the generator scattered random offsets and capped the result,
   and the panel came out with nothing in house tonight: `Terisi malam ini 0 dari 28`, empty
   occupancy bars on the current day, and an empty Menginap column. Every one of those reads as
   a broken panel, and none of it would fail a structural sweep. */
{
  const { ctx, page } = await open(1440, 1000, '/app/');
  const d = await page.evaluate(() => {
    const angka = [...document.querySelectorAll('.app-cal-angka')].map((e) => Number(e.innerText.split(' ')[0]));
    const stat = [...document.querySelectorAll('.app-stat-nilai')].map((e) => e.innerText.trim());
    return {
      malamIni: stat[0], masuk: stat[1], keluar: stat[2], menunggu: stat[3],
      min: Math.min(...angka), max: Math.max(...angka), rata: Math.round((angka.reduce((a, b) => a + b, 0) / angka.length) * 10) / 10,
      hari: angka.length,
      total: document.querySelector('.app-hitung').innerText.trim(),
    };
  });
  const terisi = Number(d.malamIni.split(' ')[0]);
  if (!Number.isFinite(terisi) || terisi < 1) bad(`no unit is occupied tonight: "${d.malamIni}". The panel reads as a dead demo.`);
  if (d.max < 8) bad(`peak occupancy across the month is only ${d.max} of 28 units, the calendar bars will look uniformly empty`);
  if (d.max <= d.min) bad('occupancy does not vary across the month, the calendar carries no information');
  else ok(`data health: ${d.total}, tonight ${d.malamIni} occupied, ${d.masuk} in and ${d.keluar} out, ${d.menunggu} awaiting confirmation; month occupancy min ${d.min} avg ${d.rata} max ${d.max} of 28 across ${d.hari} days`);

  /* A meter with no content is invisible the moment anything sizes it to its content, and
     nothing else in the harness can see that: a zero width box has no contrast to fail, no text
     to glue and no overflow to report. Measured once at width 0 on every calendar cell, because
     the flex container is a <button> and the browser's own button styling sets
     `align-items: center`. Assert the geometry, not the CSS. */
  const meter = await page.evaluate(() => {
    const bars = [...document.querySelectorAll('.app-cal-bar')].map((el) => {
      const b = el.getBoundingClientRect();
      const inner = el.firstElementChild;
      return { w: Math.round(b.width), h: Math.round(b.height), inner: inner ? Math.round(inner.getBoundingClientRect().width) : -1 };
    });
    return { n: bars.length, zeroTrack: bars.filter((b) => b.w < 8 || b.h < 2).length, filled: bars.filter((b) => b.inner > 0).length };
  });
  if (meter.zeroTrack > 0) bad(`${meter.zeroTrack} of ${meter.n} occupancy meters render with no track, they are invisible`);
  else if (meter.filled === 0) bad('no occupancy meter has any fill, every day reads as empty');
  else ok(`occupancy meters: ${meter.n} tracks all painted, ${meter.filled} carry a visible fill`);

  const papan = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.app-views .app-view-btn')].find((x) => x.innerText.includes('Papan'));
    b.click();
    return true;
  });
  await wait(500);
  const kolom = await page.evaluate(() =>
    [...document.querySelectorAll('.app-kan-col')].map((c) => ({
      nama: c.querySelector('.app-kan-nama').innerText.split('\n')[0],
      n: Number(c.querySelector('.app-kan-jumlah').innerText.trim()),
    })),
  );
  const kosong = kolom.filter((k) => k.n === 0);
  if (papan && kosong.length > 0) bad(`kanban column(s) empty: ${kosong.map((k) => k.nama).join(', ')}`);
  else ok(`every kanban column carries records: ${kolom.map((k) => `${k.nama} ${k.n}`).join(', ')}`);
  await ctx.close();
}

/* ----------------------------------------------- 11. R20 inside the states the sweep cannot see

   `qa-r20.mjs` sweeps every rendered element on every route, which is the R20 gate. It cannot
   reach the panel's overlays, because they are UNMOUNTED until something opens them (R57), so
   the record panel, the new booking form, the mobile drawer and the login error message are all
   invisible to it. Those are exactly the surfaces where a light class gets reused on a dark
   ground, so they are measured here instead, with the same algorithm.
   The compositing order below is copied deliberately, including the part that is easy to get
   backwards: COLLECT backgrounds walking up, then composite in REVERSE from the page down, so a
   parent is never painted over its child. */
const R20 = `
window.__appR20 = function (rootSel) {
  function parseColor(c) {
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(",").map(function (s) { return parseFloat(s.trim()); });
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function effectiveBg(el) {
    var layers = [];
    for (var node = el; node; node = node.parentElement) {
      var bg = parseColor(getComputedStyle(node).backgroundColor);
      if (bg && bg.a > 0) { layers.push(bg); if (bg.a >= 0.999) break; }
    }
    var r = 255, g = 255, b = 255;
    for (var i = layers.length - 1; i >= 0; i--) {
      var l = layers[i];
      r = l.r * l.a + r * (1 - l.a);
      g = l.g * l.a + g * (1 - l.a);
      b = l.b * l.a + b * (1 - l.a);
    }
    return { r: r, g: g, b: b };
  }
  function lum(c) {
    var v = [c.r, c.g, c.b].map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function ratio(f, b) { var x = lum(f) + 0.05, y = lum(b) + 0.05; return x > y ? x / y : y / x; }

  var out = [], n = 0;
  var root = document.querySelector(rootSel);
  if (!root) return { missing: true };
  root.querySelectorAll("*").forEach(function (el) {
    if (el.disabled || el.getAttribute("aria-disabled") === "true") return;
    if (el.closest("[disabled]")) return;
    if (typeof el.checkVisibility === "function" ? !el.checkVisibility() : el.getClientRects().length === 0) return;
    var own = [].slice.call(el.childNodes).some(function (x) { return x.nodeType === 3 && x.textContent.trim().length > 0; });
    if (!own) return;
    var cs = getComputedStyle(el);
    var fg = parseColor(cs.color);
    if (!fg || fg.a === 0) return;
    n++;
    var bg = effectiveBg(el);
    var eff = fg.a >= 0.999 ? fg : { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a) };
    var fs = parseFloat(cs.fontSize), fw = parseInt(cs.fontWeight, 10) || 400;
    var need = fs >= 24 || (fs >= 18.66 && fw >= 700) ? 3 : 4.5;
    var r = ratio(eff, bg);
    if (r >= need) return;
    out.push({ cls: el.className.toString().slice(0, 40), text: (el.innerText || "").trim().slice(0, 40),
      fg: "rgb(" + Math.round(eff.r) + "," + Math.round(eff.g) + "," + Math.round(eff.b) + ")",
      bg: "rgb(" + Math.round(bg.r) + "," + Math.round(bg.g) + "," + Math.round(bg.b) + ")",
      ratio: Math.round(r * 100) / 100, need: need });
  });
  return { n: n, fails: out };
};
`;

async function sweepOverlay(label, w, h, url, drive, sel) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: w, height: h });
  await page.evaluateOnNewDocument(R20);
  await page.goto('http://localhost:4325' + url, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => {
    sessionStorage.setItem('lembayung_welcome_seen', '1');
    sessionStorage.setItem('lembayung_cta_float_seen', '1');
  });
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  await drive(page);
  await wait(600);
  const r = await page.evaluate((s) => window.__appR20(s), sel);
  if (r.missing) bad(`R20 overlay sweep: ${label} did not render ${sel}`);
  else if (r.fails.length) {
    for (const f of r.fails) bad(`R20 ${label} ${f.ratio}:1 (needs ${f.need}) <${f.cls}> fg ${f.fg} on ${f.bg}: "${f.text}"`);
  } else ok(`R20 ${label}: ${r.n} text bearing elements measured against their effective background, all clear`);
  await ctx.close();
}

await sweepOverlay('record panel', 1440, 1000, '/app/', async (page) => {
  const rec = await page.$('.app-cal-layout .app-rec');
  if (rec) await rec.click();
}, '.app-rec-panel');

await sweepOverlay('new booking form', 1440, 1000, '/app/', async (page) => {
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.app-aksi .btn')].find((x) => x.innerText.includes('Reservasi baru'));
    if (b) b.click();
  });
}, '.app-rec-panel');

await sweepOverlay('mobile drawer', 375, 800, '/app/', async (page) => {
  await page.click('.app-burger');
}, '.app-drawer');

await sweepOverlay('login error state', 1440, 900, '/app/masuk/', async (page) => {
  await page.click('#masuk-sandi', { clickCount: 3 });
  await page.type('#masuk-sandi', 'salah');
  await page.click('.app-masuk-kartu button[type="submit"]');
}, '.app-masuk');

await sweepOverlay('bulk action bar', 1440, 1000, '/app/', async (page) => {
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.app-views .app-view-btn')].find((x) => x.innerText.includes('Tabel'));
    if (b) b.click();
  });
  await wait(600);
  const boxes = await page.$$('.app-table tbody .app-check');
  await boxes[0].click();
}, '.app-bulk');

await sweepOverlay('kanban board', 1440, 1000, '/app/', async (page) => {
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.app-views .app-view-btn')].find((x) => x.innerText.includes('Papan'));
    if (b) b.click();
  });
}, '.app-kanban');

await sweepOverlay('rail sidebar', 1440, 1000, '/app/', async (page) => {
  await page.click('.app-rail-btn');
}, '.app-side');

await browser.close();
server.close();
console.log('');
for (const n of notes) console.log('  ' + n);
console.log('\n=== PROBLEMS ===');
console.log(problems.length ? problems.join('\n') : 'none');
process.exit(problems.length ? 1 : 0);
