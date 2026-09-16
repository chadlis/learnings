// Vérifie le service worker : enregistrement, manifeste, relecture hors ligne.
// Dépendance de développement uniquement (playwright). Voir `make test`.
// Nécessite un serveur http : un service worker ne s'enregistre pas en file://.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:8777').replace(/\/$/, '');
const SHEET = '/' + (process.argv[3] || 'sheets/archive/sheet-t06-evaluation-metriques.html');

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

const name = await page.evaluate(() => fetch('manifest.webmanifest').then((r) => r.json()).then((j) => j.name));
if (name !== 'Fiches ML/LLM') fail('manifeste inattendu : ' + name); else ok('manifeste servi : ' + name);

await page.goto(BASE + SHEET);
await page.waitForSelector('#v-labo');
const online = await page.locator('#v-labo details').count();
ok('fiche ouverte en ligne (' + online + ' questions)');

await ctx.setOffline(true);
await page.reload();
if ((await page.locator('#v-labo details').count()) !== online) fail('fiche incomplète hors ligne');
else ok('fiche relue hors ligne (cache-first)');

await page.goto(BASE + '/index.html');
const links = await page.locator('a.it').count();
if (!links) fail('index vide hors ligne'); else ok('index servi hors ligne (' + links + ' liens)');

await ctx.setOffline(false);
await browser.close();
console.log(process.exitCode ? '\nÉCHEC — service worker' : '\nOK — service worker');
