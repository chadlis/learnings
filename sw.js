// Service worker des fiches ML/LLM. Aucune dépendance.
// - index.html : réseau d'abord (la liste doit refléter les fiches publiées),
//   cache en secours quand on est hors ligne.
// - tout le reste : cache d'abord (une fiche ouverte une fois reste lisible
//   hors ligne, et se recharge instantanément).
// La version du cache est réécrite par tools/build_index.py : elle ne change
// que lorsque le contenu du site change, ce qui purge l'ancien cache.
const CACHE = 'sheets-v46-811a3b0798cd3b90';

// Coquille minimale mise en cache dès l'installation.
const SHELL = ['./', 'index.html', 'map.html', 'manifest.webmanifest',
  'assets/sheetlib.js', 'icon.svg', 'icone-fiches.svg', 'apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll() est tout-ou-rien : on met en cache fichier par fichier pour
      // qu'une ressource manquante ne fasse pas échouer l'installation.
      .then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {}))))
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

async function cacheFirst(req) {
  const c = await caches.open(CACHE);
  const hit = await c.match(req, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok && res.type === 'basic') c.put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  const c = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok && res.type === 'basic') c.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = (await c.match(req, { ignoreSearch: true })) || (await c.match('index.html'));
    if (hit) return hit;
    throw err;
  }
}
