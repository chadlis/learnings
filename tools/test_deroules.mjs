// Vérifie les déroulés de fiches/deroule/ : chaque figure doit produire du SVG,
// chaque bouton doit répondre sans lever d'exception, et la page ne doit pas
// défiler à l'horizontale sur un écran de téléphone.
// Dépendance de développement uniquement (playwright). Voir `make test`.
// Marche en http comme en file:// : un déroulé n'a aucune dépendance réseau.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:8777').replace(/\/$/, '');
const DEROULES = [
  'fiches/deroule/deroule-d01-intervalle-procedure.html',
  'fiches/deroule/deroule-d02-comparer-deux-modeles.html',
  'fiches/deroule/deroule-d03-biais-du-max.html',
];

const browser = await chromium.launch();
let echecs = 0;

for (const chemin of DEROULES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push('exception JS : ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push('console : ' + m.text()); });

  await page.goto(BASE + '/' + chemin, { waitUntil: 'load' });

  // Les boutons des figures sont créés en JS : on les cherche après chargement.
  const figures = await page.$$('figure');
  const muettes = [];
  let clics = 0;
  for (const fig of figures) {
    for (const b of await fig.$$('button')) { await b.click(); clics++; }
    const svg = await fig.evaluate((el) => {
      let noeuds = 0;
      el.querySelectorAll('svg').forEach((s) => { noeuds += s.querySelectorAll('*').length; });
      return { nb: el.querySelectorAll('svg').length, noeuds };
    });
    if (svg.nb === 0 || svg.noeuds < 3) muettes.push(await fig.getAttribute('id'));
  }

  // Le rail latéral tient le desktop et s'efface sous 1100px (media query).
  const railLarge = await page.$eval('nav.echelle', (n) => getComputedStyle(n).display);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(150);
  const railEtroit = await page.$eval('nav.echelle', (n) => getComputedStyle(n).display);
  const debord = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );

  const ok = !erreurs.length && !muettes.length
    && railLarge !== 'none' && railEtroit === 'none' && debord <= 0;
  if (!ok) echecs++;
  console.log(`${ok ? '✓' : '✗'} ${chemin.split('/').pop()} — ${figures.length} figures, `
    + `${clics} clics, rail ${railLarge}/${railEtroit}, débord ${debord}px`);
  if (muettes.length) console.log('   figures sans SVG : ' + muettes.join(', '));
  erreurs.forEach((e) => console.log('   ' + e));

  await ctx.close();
}

await browser.close();
console.log(echecs ? `\n✗ ${echecs} déroulé(s) en échec — ${BASE}` : `\nOK — ${BASE}`);
process.exitCode = echecs ? 1 : 0;
