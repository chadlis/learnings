// Vérifie les déroulés de sheets/walkthroughs/ : chaque figure doit produire du SVG,
// chaque bouton doit répondre sans lever d'exception, et la page ne doit pas
// défiler à l'horizontale sur un écran de téléphone.
// Dépendance de développement uniquement (playwright). Voir `make test`.
// Marche en http comme en file:// : un déroulé n'a aucune dépendance réseau.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:8777').replace(/\/$/, '');
const WALKTHROUGHS = [
  'sheets/walkthroughs/walkthrough-d01-intervalle-procedure.html',
  'sheets/walkthroughs/walkthrough-d02-comparer-deux-modeles.html',
  'sheets/walkthroughs/walkthrough-d03-biais-du-max.html',
];

const browser = await chromium.launch();
let failures = 0;

for (const path of WALKTHROUGHS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('exception JS : ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console : ' + m.text()); });

  await page.goto(BASE + '/' + path, { waitUntil: 'load' });

  // Les boutons des figures sont créés en JS : on les cherche après chargement.
  const figures = await page.$$('figure');
  const silent = [];
  let clicks = 0;
  for (const fig of figures) {
    for (const b of await fig.$$('button')) { await b.click(); clicks++; }
    const svg = await fig.evaluate((el) => {
      let nodes = 0;
      el.querySelectorAll('svg').forEach((s) => { nodes += s.querySelectorAll('*').length; });
      return { count: el.querySelectorAll('svg').length, nodes };
    });
    if (svg.count === 0 || svg.nodes < 3) silent.push(await fig.getAttribute('id'));
  }

  // Le rail latéral tient le desktop et s'efface sous 1100px (media query).
  const railWide = await page.$eval('nav.echelle', (n) => getComputedStyle(n).display);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(150);
  const railNarrow = await page.$eval('nav.echelle', (n) => getComputedStyle(n).display);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );

  const ok = !errors.length && !silent.length
    && railWide !== 'none' && railNarrow === 'none' && overflow <= 0;
  if (!ok) failures++;
  console.log(`${ok ? '✓' : '✗'} ${path.split('/').pop()} — ${figures.length} figures, `
    + `${clicks} clics, rail ${railWide}/${railNarrow}, débord ${overflow}px`);
  if (silent.length) console.log('   figures sans SVG : ' + silent.join(', '));
  errors.forEach((e) => console.log('   ' + e));

  await ctx.close();
}

await browser.close();
console.log(failures ? `\n✗ ${failures} déroulé(s) en échec — ${BASE}` : `\nOK — ${BASE}`);
process.exitCode = failures ? 1 : 0;
