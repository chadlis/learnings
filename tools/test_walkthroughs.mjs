// Vérifie les déroulés de sheets/walkthroughs/ : chaque figure doit produire du
// SVG, chaque bouton doit répondre sans lever d'exception, et la page ne doit
// pas défiler à l'horizontale sur un écran de téléphone.
// La liste des déroulés est lue dans l'index : ajouter un déroulé ne demande
// aucune édition de ce fichier.
// Dépendance de développement uniquement (playwright). Voir `make test`.
// Marche en http comme en file:// : un déroulé n'a aucune dépendance réseau.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:8777').replace(/\/$/, '');

const browser = await chromium.launch();

// Les déroulés à tester : ceux que l'index publie.
const scout = await browser.newPage();
await scout.goto(BASE + '/index.html', { waitUntil: 'load' });
const WALKTHROUGHS = await scout.$$eval(
  'a.it[href*="sheets/walkthroughs/"]',
  (as) => as.map((a) => a.getAttribute('href'))
);
await scout.close();
if (!WALKTHROUGHS.length) {
  console.error('✗ aucun déroulé trouvé dans l\'index');
  process.exit(1);
}

let failures = 0;

for (const path of WALKTHROUGHS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('exception JS : ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console : ' + m.text()); });

  await page.goto(BASE + '/' + path, { waitUntil: 'load' });

  // Un déroulé peut ranger ses figures derrière des onglets : on passe par
  // chacun, sinon les figures masquées ne seraient jamais exercées.
  const tabs = await page.$$('[role="tab"]');
  const silent = [];
  let clicks = 0;
  let seen = 0;

  for (let i = 0; i < Math.max(tabs.length, 1); i++) {
    if (tabs.length) { await tabs[i].click(); await page.waitForTimeout(80); }

    for (const fig of await page.$$('figure')) {
      if (!(await fig.isVisible())) continue;
      seen++;
      // Les boutons des figures sont créés en JS : on les cherche après coup.
      for (const b of await fig.$$('button')) {
        if (await b.isVisible()) { await b.click(); clicks++; }
      }
      const svg = await fig.evaluate((el) => {
        let nodes = 0;
        el.querySelectorAll('svg').forEach((s) => { nodes += s.querySelectorAll('*').length; });
        return { count: el.querySelectorAll('svg').length, nodes };
      });
      if (svg.count === 0 || svg.nodes < 3) silent.push(await fig.getAttribute('id'));
    }
  }

  // Le rail latéral tient le desktop et s'efface sous 1100px (media query).
  const railWide = await page.$eval('nav.echelle', (n) => getComputedStyle(n).display);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(150);
  const railNarrow = await page.$eval('nav.echelle', (n) => getComputedStyle(n).display);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );

  const ok = !errors.length && !silent.length && seen > 0
    && railWide !== 'none' && railNarrow === 'none' && overflow <= 0;
  if (!ok) failures++;
  console.log(`${ok ? '✓' : '✗'} ${path.split('/').pop()} — ${seen} figures`
    + `${tabs.length ? ` sur ${tabs.length} onglets` : ''}, `
    + `${clicks} clics, rail ${railWide}/${railNarrow}, débord ${overflow}px`);
  if (silent.length) console.log('   figures sans SVG : ' + silent.join(', '));
  errors.forEach((e) => console.log('   ' + e));

  await ctx.close();
}

await browser.close();
console.log(failures ? `\n✗ ${failures} déroulé(s) en échec — ${BASE}` : `\nOK — ${BASE}`);
process.exitCode = failures ? 1 : 0;
