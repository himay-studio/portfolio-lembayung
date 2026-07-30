// Contrast checker for the Lembayung palette (R20).
//
// Every ratio quoted in DESIGN.md is produced by this file, not estimated.
//   node tools/contrast.mjs
//
// Two things this file deliberately does, both of them lessons from Wanantara (HIM-261):
//   1. It composites alpha over the real ground before measuring, because a token
//      written as rgba(...) is invisible to a naive reader that only sees the token.
//   2. It asserts that the LIGHT-ground variant of a dual-ground control FAILS on the
//      dark ground. That is the whole point of shipping an inverted variant: if the
//      light one happened to pass on dark, the pair would be pointless. A "LEAK!" row
//      means the palette has drifted and the inverted variant is no longer justified.

const T = {
  // Dusk. The dark ground.
  senja:              '#221A3A',
  'senja-pekat':      '#15102A',
  lembayung:          '#4A3573',
  'lembayung-tua':    '#3A2A5C',
  'lembayung-terang': '#C9B8E8',
  // Fire and earth.
  bara:               '#F0A94C',
  'bara-tua':         '#96500B',
  tanah:              '#9C4221',
  // Pine. Also the sales CTA (R5), by construction.
  pinus:              '#1E6B45',
  'pinus-tua':        '#155134',
  'pinus-terang':     '#4FAE7C',
  // Canvas and stone. The light ground.
  kanvas:             '#F7F3EC',
  'kanvas-2':         '#EDE6DA',
  putih:              '#FFFFFF',
  batu:               '#D8D0C4',
  kabut:              '#BDB4D2',
  // Ink.
  tinta:              '#1C1830',
  'tinta-lembut':     '#4E4866',
  // Lines and state.
  garis:              '#E2DACC',
  'garis-tegas':      '#8A8098',
  bahaya:             '#A32318',
  'bahaya-terang':    '#FF9182',
  // Alpha tokens. Written as [hex, alpha]; the checker composites them over the ground.
  'garis-inv':        ['#F7F3EC', 0.22],
  'garis-tegas-inv':  ['#F7F3EC', 0.62],
};

const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const rgb = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const lum = h => { const [r, g, b] = rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const hx = v => '#' + v.map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
// R20(b): composite the foreground's alpha over the EFFECTIVE background before measuring.
const over = (fg, a, bg) => hx(rgb(fg).map((c, i) => a * c + (1 - a) * rgb(bg)[i]));
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const resolve = (key, ground) => {
  const v = T[key] ?? key;
  return Array.isArray(v) ? over(v[0], v[1], resolve(ground, ground)) : v;
};
const r = (fg, bg) => ratio(resolve(fg, bg), resolve(bg, bg));

// [foreground, background, threshold, purpose]
const CHECKS = [
  ['--- LIGHT GROUND ---'],
  ['tinta',            'kanvas',        4.5, 'body text on page canvas'],
  ['tinta-lembut',     'kanvas',        4.5, 'secondary text on canvas'],
  ['lembayung-tua',    'kanvas',        4.5, 'link + eyebrow on canvas'],
  ['bara-tua',         'kanvas',        4.5, 'amber accent text on canvas'],
  ['tanah',            'kanvas',        4.5, 'terracotta label on canvas'],
  ['pinus',            'kanvas',        4.5, 'green text + icon on canvas'],
  ['garis-tegas',      'kanvas',        3,   'input + control border on canvas'],
  ['bahaya',           'kanvas',        4.5, 'form error on canvas'],
  ['tinta',            'kanvas-2',      4.5, 'body text on alt band'],
  ['tinta-lembut',     'kanvas-2',      4.5, 'secondary text on alt band'],
  ['lembayung-tua',    'kanvas-2',      4.5, 'link on alt band'],
  ['bara-tua',         'kanvas-2',      4.5, 'amber accent on alt band'],
  ['pinus',            'kanvas-2',      4.5, 'green text on alt band'],
  ['tinta',            'putih',         4.5, 'body text on card'],
  ['tinta-lembut',     'putih',         4.5, 'secondary text on card'],
  ['garis-tegas',      'putih',         3,   'input border on card'],
  ['tinta',            'batu',          4.5, 'text on stone chip'],
  ['--- DARK GROUND ---'],
  ['kanvas',           'senja',         4.5, 'body text on dusk ground'],
  ['kabut',            'senja',         4.5, 'secondary text on dusk ground'],
  ['lembayung-terang', 'senja',         4.5, 'link on dusk ground'],
  ['bara',             'senja',         4.5, 'amber eyebrow on dusk ground'],
  ['pinus-terang',     'senja',         4.5, 'green text on dusk ground'],
  ['bahaya-terang',    'senja',         4.5, 'form error on dusk ground'],
  ['garis-tegas-inv',  'senja',         3,   'input border on dusk ground (alpha)'],
  ['kanvas',           'senja-pekat',   4.5, 'body text on footer'],
  ['kabut',            'senja-pekat',   4.5, 'secondary text on footer'],
  ['lembayung-terang', 'senja-pekat',   4.5, 'link on footer'],
  ['bara',             'senja-pekat',   4.5, 'amber accent on footer'],
  ['pinus-terang',     'senja-pekat',   4.5, 'green text on footer'],
  ['garis-tegas-inv',  'senja-pekat',   3,   'input border on footer (alpha)'],
  ['kanvas',           'lembayung',     4.5, 'text on violet band'],
  ['bara',             'lembayung',     4.5, 'amber accent on violet band'],
  ['--- FILLED CONTROLS ---'],
  ['putih',            'pinus',         4.5, 'CTA label on sales green (R5)'],
  ['putih',            'pinus-tua',     4.5, 'CTA label on green hover'],
  ['putih',            'lembayung',     4.5, 'secondary button label on violet'],
  ['putih',            'lembayung-tua', 4.5, 'secondary button hover'],
  ['tinta',            'bara',          4.5, 'dark label on amber button'],
  ['putih',            'tanah',         4.5, 'white label on terracotta badge'],
  ['--- DUAL-GROUND PAIRS (the Wanantara .btn-outline failure class) ---'],
  ['pinus',            'kanvas',        4.5, '.btn-outline label, LIGHT ground'],
  ['pinus-terang',     'senja',         4.5, '.btn-outline-inv label, DARK ground'],
  ['lembayung-tua',    'kanvas',        4.5, '.link, LIGHT ground'],
  ['lembayung-terang', 'senja',         4.5, '.link-inv, DARK ground'],
  ['bara-tua',         'kanvas',        4.5, '.eyebrow, LIGHT ground'],
  ['bara',             'senja',         4.5, '.eyebrow-inv, DARK ground'],
  ['tinta-lembut',     'kanvas',        4.5, '.muted, LIGHT ground'],
  ['kabut',            'senja',         4.5, '.muted-inv, DARK ground'],
  ['garis-tegas',      'kanvas',        3,   'control border, LIGHT ground'],
  ['garis-tegas-inv',  'senja',         3,   'control border, DARK ground'],
  ['--- MUST FAIL: the light variant reused on dark, i.e. the bug itself ---'],
  ['pinus',            'senja',         4.5, 'WRONG light-ground outline on dark'],
  ['lembayung-tua',    'senja',         4.5, 'WRONG light-ground link on dark'],
  ['bara-tua',         'senja',         4.5, 'WRONG light-ground eyebrow on dark'],
  ['tinta-lembut',     'senja',         4.5, 'WRONG light-ground muted on dark'],
  ['--- FYI: neutral that legitimately clears both grounds ---'],
  // --garis-tegas is a mid-tone neutral, so it clears the 3:1 UI threshold on the light
  // AND the dark ground. That is NOT the Wanantara failure class, which was a SATURATED
  // brand colour tuned for one ground only. --garis-tegas-inv therefore exists for visual
  // quality (a warm hairline reads correctly against dusk) rather than for compliance, and
  // it is deliberately not asserted as a must-fail pair.
  ['garis-tegas',      'senja',         3,   'FYI neutral border also clears the dark ground'],
];

let fails = 0, leaks = 0;
console.log('fg'.padEnd(19) + 'ground'.padEnd(15) + 'ratio'.padEnd(8) + 'need'.padEnd(6) + 'status    purpose');
for (const row of CHECKS) {
  if (row.length === 1) { console.log('\n' + row[0]); continue; }
  const [fg, bg, need, why] = row;
  const v = r(fg, bg);
  const mustFail = why.startsWith('WRONG');
  const pass = v >= need;
  if (!pass && !mustFail) fails++;
  if (pass && mustFail) leaks++;
  const status = mustFail ? (pass ? 'LEAK!   ' : 'fails ok') : (pass ? 'PASS    ' : 'FAIL    ');
  console.log(fg.padEnd(19) + bg.padEnd(15) + v.toFixed(2).padEnd(8) + String(need).padEnd(6) + status + '  ' + why);
}
console.log('');
if (fails) console.log(`${fails} REQUIRED PAIR(S) FAILED.`);
if (leaks) console.log(`${leaks} MUST-FAIL PAIR(S) PASSED, the inverted variant is no longer justified.`);
if (!fails && !leaks) console.log('All required pairs pass, and every light-ground variant correctly fails on the dark ground.');
process.exit(fails || leaks ? 1 : 0);
