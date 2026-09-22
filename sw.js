// Service worker des fiches ML/LLM. Aucune dépendance.
// - index.html : réseau d'abord (la liste doit refléter les fiches publiées),
//   cache en secours quand on est hors ligne.
// - tout le reste : cache d'abord (une fiche ouverte une fois reste lisible
//   hors ligne, et se recharge instantanément).
// La version du cache est réécrite par tools/build_index.py : elle ne change
// que lorsque le contenu du site change, ce qui purge l'ancien cache.
const CACHE = 'sheets-v101-b09ae960c3ab0baf';

// Coquille minimale mise en cache dès l'installation.
const SHELL = ['./', 'index.html', 'map.html', 'manifest.webmanifest',
  'assets/sheetlib.js', 'icon.svg', 'icone-fiches.svg', 'apple-touch-icon.png'];

// Cloudflare Pages sert `/x.html` en 308 vers `/x`. Deux conséquences pour un
// service worker, et les deux ont cassé « Carte des prérequis » en production :
//  - une réponse obtenue en suivant une redirection porte `redirected = true` ;
//    la rendre à une **navigation**, dont le mode de redirection est `manual`,
//    lève un TypeError et la page ne s'ouvre pas du tout — ERR_FAILED ;
//  - `fetch(requête de navigation)` ne rend qu'une réponse `opaqueredirect`,
//    qu'on ne peut pas mettre en cache : l'URL en `.html`, celle qu'écrivent
//    tous les liens du site, n'y entrait jamais et hors ligne ne trouvait rien.
// D'où les deux gestes ci-dessous : aller chercher l'**URL** (la redirection est
// alors suivie), et remettre la réponse à plat avant de la servir ou de la
// ranger — sous l'URL demandée, pas sous celle d'arrivée.
async function flat(res) {
  if (!res || !res.redirected) return res;
  return new Response(await res.blob(),
    { status: res.status, statusText: res.statusText, headers: res.headers });
}

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // Fichier par fichier pour qu'une ressource manquante ne fasse pas échouer
      // l'installation — et jamais `c.add()`, qui stocke la réponse redirigée
      // telle quelle et empoisonne l'entrée pour toute navigation ultérieure.
      .then((c) => Promise.all(SHELL.map((u) => fetch(u)
        .then((r) => (r && r.ok ? flat(r).then((f) => c.put(u, f)) : null))
        .catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isIndex = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  e.respondWith(isIndex ? networkFirst(req) : cacheFirst(req));
});

// `fetch(req.url)` et non `fetch(req)` : sur une navigation, la requête porte
// redirect « manual », et on n'obtiendrait qu'une réponse opaque.
async function fromNetwork(req, c) {
  const res = await fetch(req.url);
  if (res && res.ok && res.type === 'basic') {
    const f = await flat(res);
    await c.put(req, f.clone());
    return f;
  }
  return res;
}

async function cacheFirst(req) {
  const c = await caches.open(CACHE);
  const hit = await c.match(req, { ignoreSearch: true });
  if (hit) return hit;
  return fromNetwork(req, c);
}

async function networkFirst(req) {
  const c = await caches.open(CACHE);
  try {
    return await fromNetwork(req, c);
  } catch (err) {
    const hit = (await c.match(req, { ignoreSearch: true })) || (await c.match('index.html'));
    if (hit) return hit;
    throw err;
  }
}
