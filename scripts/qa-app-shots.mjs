/* Screenshots of the /app panel in its INTERESTING states. Stage 4, Webapp Architect.
 *
 * `qa-shots.mjs` walks every route at every breakpoint, which is the R51 evidence Stage 8 owes.
 * It cannot capture what this one does: a panel is mostly interaction, and a screenshot of the
 * default view says nothing about whether the drawer opens, the board fills, or the record panel
 * is a real full height sheet. Each shot below drives the panel into one state first.
 *
 * Uses the same puppeteer managed Chrome as the rest of the harness, see qa-setup.mjs.
 *
 * Run: node scripts/qa-app-shots.mjs ./out
 */

import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { ensureBrowser } from './qa-setup.mjs';

const ROOT = process.argv[2] || 'out';
const OUT = 'qa-screenshots/app';
mkdirSync(OUT, { recursive: true });

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
await new Promise((r) => server.listen(4327, r));

const { executablePath, env } = await ensureBrowser();
const browser = await puppeteer.launch({ executablePath, env, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const taken = [];

async function shoot(name, w, h, url, drive, full = false) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto('http://localhost:4327' + url, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => {
    sessionStorage.setItem('lembayung_welcome_seen', '1');
    sessionStorage.setItem('lembayung_cta_float_seen', '1');
  });
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  if (drive) await drive(page);
  await wait(500);
  const file = join(OUT, `${name}-${w}.png`);
  await page.screenshot({ path: file, fullPage: full });
  const over = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  taken.push(`${file}  ${over.sw <= over.iw + 1 ? 'no overflow' : `OVERFLOW ${over.sw} > ${over.iw}`}`);
  await ctx.close();
}

const pickView = (label) => async (page) => {
  await page.evaluate((l) => {
    const b = [...document.querySelectorAll('.app-views .app-view-btn')].find((x) => x.innerText.includes(l));
    if (b) b.click();
  }, label);
  await wait(600);
};

await shoot('reservasi-kalender', 1440, 1100, '/app/');
await shoot('reservasi-tabel', 1440, 1100, '/app/', async (page) => {
  await pickView('Tabel')(page);
  const boxes = await page.$$('.app-table tbody .app-check');
  await boxes[0].click();
  await boxes[2].click();
  await wait(300);
});
await shoot('reservasi-papan', 1440, 1100, '/app/', pickView('Papan'));
await shoot('reservasi-kartu', 1440, 1100, '/app/', pickView('Kartu'));
await shoot('reservasi-rincian', 1440, 1000, '/app/', async (page) => {
  const rec = await page.$('.app-cal-layout .app-rec');
  if (rec) await rec.click();
  await wait(700);
});
await shoot('reservasi-baru', 1440, 1000, '/app/', async (page) => {
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.app-aksi .btn')].find((x) => x.innerText.includes('Reservasi baru'));
    if (b) b.click();
  });
  await wait(700);
  await page.evaluate(() => {
    const t = document.querySelectorAll('.app-rec-panel .select-trigger');
    if (t[1]) t[1].click();
  });
  await wait(500);
});
await shoot('reservasi-rail', 1440, 1000, '/app/', async (page) => {
  await page.click('.app-rail-btn');
  await wait(500);
});
await shoot('inventaris', 1440, 1100, '/app/unit/');
await shoot('tamu-kartu', 1440, 1100, '/app/tamu/', pickView('Kartu'));
await shoot('masuk', 1440, 900, '/app/masuk/');
await shoot('portal', 1440, 1100, '/app/portal/');

await shoot('reservasi-kalender', 1025, 900, '/app/');
await shoot('reservasi-tabel', 768, 900, '/app/', pickView('Tabel'));
await shoot('reservasi-kalender', 375, 900, '/app/');
await shoot('reservasi-papan', 375, 900, '/app/', pickView('Papan'));
await shoot('drawer', 375, 800, '/app/', async (page) => {
  await page.click('.app-burger');
  await wait(600);
});
await shoot('portal', 375, 1000, '/app/portal/');
await shoot('masuk', 375, 1000, '/app/masuk/');

await browser.close();
server.close();
console.log(taken.join('\n'));
