# Fiches ML/LLM

Fiches de révision de la formation ML/LLM. Un fichier HTML autonome par fiche :
zéro dépendance, zéro CDN, zéro build. Chaque fichier s'ouvre en `file://`
comme sur le site publié.

## Structure

```
index.html                          liste des fiches — GÉNÉRÉ, ne pas éditer
timeline-formation.html             pilotage : où j'en suis dans les 51 semaines
manifest.webmanifest                installation sur l'écran d'accueil
sw.js                               service worker (cache hors ligne) — version GÉNÉRÉE
icone-fiches.svg / apple-touch-icon.png
fiches/
  semaine/    fiche-sNN-<sujet>.html    fiches de semaine (série courante)
  theme/      fiche-tNN-<sujet>.html    fiches thématiques
  archives/                             anciens formats, gardés pour mémoire
tools/
  build_index.py    régénère l'index + le bloc PWA + la version du cache
  test_ratings.mjs  test headless : noter, recharger, oublier
  test_pwa.mjs      test headless : service worker, hors ligne
```

## Convention de nommage

`fiche-sNN-<sujet>.html` pour les semaines, `fiche-tNN-<sujet>.html` pour les
thèmes. `NN` sur deux chiffres, `<sujet>` en minuscules sans accents, mots
séparés par des tirets.

**La version vit dans le `<title>`, jamais dans le nom de fichier.** Une fiche
révisée garde son URL : les liens, les favoris et le cache hors ligne survivent
à la révision. `fiche-t05-regression-lineaire-logistique.html` reste ce nom
quand son titre passe de `… — v1 du 11/09` à `… — v2 du 03/10`.

## Métadonnées lues par l'index

Dans le `<head>` de chaque fiche :

```html
<title>Probabilités &amp; lois — fiche thématique</title>
<meta name="fiche" content="serie=thematique;numero=01;statut=v1">
<meta name="deck" content="01">
<meta name="sous-titre" content="ligne secondaire, optionnelle">
```

`deck` est la valeur du deck Anki et détermine la section de l'index :
`00` (3 fils), `01` (maths-stats), `02` (ml classique), `03+07` (deep learning
+ python), `04+05` (llm engineering + system design), `06` (coding patterns),
`08` (web). Les fiches de semaine prennent `00`. Une fiche dont le `deck` est
inconnu atterrit dans une section « à classer » — elle n'est jamais perdue,
mais elle se voit.

Le nombre de questions affiché est le nombre de balises `<details>` du fichier.

## Ajouter une fiche

1. Déposer le fichier dans `fiches/semaine/` ou `fiches/theme/`, avec son
   `<title>` et ses `<meta>`.
2. `make index`
3. `git add` + `git commit` + `git push` — Cloudflare Pages déploie tout seul.

`make hooks` (une fois par clone) installe un hook `pre-commit` qui lance
l'étape 2 et rattrape les oublis.

`make index` fait trois choses, toutes idempotentes : régénérer `index.html`,
poser le bloc `<!--pwa-->…<!--/pwa-->` dans le `<head>` de chaque fiche, et
réécrire la version du cache dans `sw.js` — qui ne change que si le contenu du
site a changé, et purge alors l'ancien cache chez les visiteurs.

## Autres commandes

| commande | effet |
| --- | --- |
| `make index` | régénère l'index, le bloc PWA et la version du cache |
| `make check` | échoue si `index.html` ou `sw.js` ne sont pas à jour |
| `make test` | tests headless (playwright, dépendance de développement — saute si absente) |
| `make hooks` | installe le hook `pre-commit` |

Pour servir le site localement (nécessaire pour tester le service worker,
qui ne s'enregistre pas en `file://`) :

```sh
python3 -m http.server 8777
```

## Notes de révision

Chaque fiche enregistre l'état `encore` / `difficile` / `bien` de ses questions
dans le `localStorage` du navigateur, sous la clé
`fiche:<nom-de-fichier>:ratings`. Les notes sont restaurées à l'ouverture et
survivent d'une session à l'autre. Le bouton **« Oublier mes notes »** de la
barre du haut efface celles de la fiche courante.

Ces notes restent dans le navigateur : elles ne sont ni synchronisées entre
appareils, ni sauvegardées. Effacer les données du site les perd.

## Installer sur l'écran d'accueil iPhone

1. Ouvrir le site dans **Safari** (Chrome iOS ne sait pas installer).
2. Bouton **Partager** → **Sur l'écran d'accueil** → **Ajouter**.
3. L'icône « Fiches » apparaît ; lancée depuis là, l'app s'ouvre en plein
   écran, sans barre d'adresse.

Une fiche déjà ouverte une fois reste consultable hors ligne (métro, avion).
L'index, lui, est rafraîchi dès qu'il y a du réseau, pour voir les fiches
ajoutées depuis.

## Hébergement

Cloudflare Pages, dépôt public, pas de build : `wrangler.toml` déclare la
racine du dépôt comme répertoire de sortie. Chaque `push` sur `main` déclenche
un déploiement.
