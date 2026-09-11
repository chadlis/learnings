// Vérifie la persistance des notes (localStorage) dans une fiche v5.
// Dépendance de développement uniquement : playwright. Le site, lui, n'a aucune
// dépendance. Lancer avec `make test` (qui trouve playwright tout seul) ou :
//   PLAYWRIGHT_PATH=/chemin/vers/node_modules/playwright \
//   node tools/test_ratings.mjs http://127.0.0.1:8777
// L'URL peut aussi être un file:// : la persistance doit marcher hors ligne.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:8777').replace(/\/$/, '');
const FICHE = process.argv[3] || 'fiches/theme/fiche-t01-probabilites-lois.html';
const URL = BASE + '/' + FICHE;
const KEY = 'fiche:' + FICHE.split('/').pop() + ':ratings';

const fail = (m) => { console.error('✗ ' + m); process.exitCode = 1; };
const ok = (m) => console.log('✓ ' + m);

const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
page.on('pageerror', (e) => fail('erreur JS : ' + e.message));

await page.goto(URL);
const openAll = () =>
  page.evaluate(() => document.querySelectorAll('#v-labo details').forEach((d) => (d.open = true)));
await openAll();

// noter : carte 0 -> encore, carte 2 -> bien
await page.locator('#v-labo details').nth(0).locator('.grade button.again').click();
await page.locator('#v-labo details').nth(2).locator('.grade button.good').click();

const stored = await page.evaluate((k) => localStorage.getItem(k), KEY);
if (stored !== '{"0":"again","2":"good"}') fail(`localStorage : attendu {"0":"again","2":"good"}, obtenu ${stored}`);
else ok('notes écrites sous ' + KEY);

const scoreAvant = await page.locator('#score').innerText();

await page.reload();
await openAll();

const classe = (n, r) => page.locator('#v-labo details').nth(n).locator('.grade button.' + r).getAttribute('class');
if (!(await classe(0, 'again')).includes('on')) fail('carte 0 non restaurée'); else ok('carte 0 restaurée : encore');
if (!(await classe(2, 'good')).includes('on')) fail('carte 2 non restaurée'); else ok('carte 2 restaurée : bien');

const scoreApres = await page.locator('#score').innerText();
if (scoreAvant !== scoreApres) fail(`score non restauré :\n  avant ${scoreAvant}\n  après ${scoreApres}`);
else ok('score restauré : ' + scoreApres.replace(/\s+/g, ' '));

// « Oublier mes notes »
page.once('dialog', (d) => d.accept());
await page.locator('#forgetBtn').click();
if ((await page.evaluate((k) => localStorage.getItem(k), KEY)) !== null) fail('la clé survit à l\'oubli');
else ok('« Oublier mes notes » supprime la clé');
if ((await page.locator('#v-labo .grade button.on').count()) !== 0) fail('notes encore affichées après oubli');
else ok('aucune note affichée après oubli');

await page.reload();
if ((await page.locator('#v-labo .grade button.on').count()) !== 0) fail('les notes oubliées reviennent au reload');
else ok('oubli persistant après reload');

await browser.close();
console.log(process.exitCode ? '\nÉCHEC — ' + BASE : '\nOK — ' + BASE);
