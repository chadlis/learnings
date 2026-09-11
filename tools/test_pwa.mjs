// Vérifie le service worker : enregistrement, manifeste, relecture hors ligne.
// Dépendance de développement uniquement (playwright). Voir `make test`.
// Nécessite un serveur http : un service worker ne s'enregistre pas en file://.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:8777').replace(/\/$/, '');
const FICHE = '/' + (process.argv[3] || 'fiches/theme/fiche-t06-evaluation-metriques.html');

const fail = (m) => { console.error('✗ ' + m); process.exitCode = 1; };
const ok = (m) => console.log('✓ ' + m);

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
page.on('pageerror', (e) => fail('erreur JS : ' + e.message));

await page.goto(BASE + '/index.html');
await page.evaluate(() => navigator.serviceWorker.ready);
await page.reload();
if (!(await page.evaluate(() => !!navigator.serviceWorker.controller))) fail('le service worker ne contrôle pas la page');
else ok('service worker actif');

const nom = await page.evaluate(() => fetch('manifest.webmanifest').then((r) => r.json()).then((j) => j.name));
if (nom !== 'Fiches ML/LLM') fail('manifeste inattendu : ' + nom); else ok('manifeste servi : ' + nom);

await page.goto(BASE + FICHE);
await page.waitForSelector('#v-labo');
const enLigne = await page.locator('#v-labo details').count();
ok('fiche ouverte en ligne (' + enLigne + ' questions)');

await ctx.setOffline(true);
await page.reload();
if ((await page.locator('#v-labo details').count()) !== enLigne) fail('fiche incomplète hors ligne');
else ok('fiche relue hors ligne (cache-first)');

await page.goto(BASE + '/index.html');
const liens = await page.locator('a.it').count();
if (!liens) fail('index vide hors ligne'); else ok('index servi hors ligne (' + liens + ' liens)');

await ctx.setOffline(false);
await browser.close();
console.log(process.exitCode ? '\nÉCHEC — service worker' : '\nOK — service worker');
