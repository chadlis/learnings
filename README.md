# Fiches ML/LLM

Fiches de révision de la formation ML/LLM. Un fichier HTML autonome par entrée :
zéro dépendance, zéro CDN, zéro build. Chaque fichier s'ouvre en `file://`
comme sur le site publié.

Deux genres cohabitent. Une **fiche** se travaille : on ouvre, on répond à voix
haute, on se note. Un **déroulé** se lit : un chapitre suivi, une fois, avec des
figures à manipuler et aucune question posée.

## Structure

```
index.html                  liste des fiches — GÉNÉRÉ, ne pas éditer
timeline.html               pilotage : où j'en suis dans les 51 semaines
manifest.webmanifest        installation sur l'écran d'accueil
sw.js                       service worker (cache hors ligne) — version GÉNÉRÉE
icon.svg / apple-touch-icon.png
CLAUDE.md                   procédure d'intégration (côté agent)
inbox/                      boîte aux lettres : brouillons à intégrer
sheets/
  weekly/        sheet-wNN-<sujet>.html        fiches de semaine (série courante)
  topics/        sheet-tNN-<sujet>.html        fiches thématiques
  walkthroughs/  walkthrough-dNN-<sujet>.html  déroulés : lecture suivie, figures
  archive/                                     anciens formats, gardés pour mémoire
tools/
  build_index.py         régénère l'index + le bloc PWA + la version du cache
  test_ratings.mjs       test headless : noter, recharger, oublier
  test_pwa.mjs           test headless : service worker, hors ligne
  test_walkthroughs.mjs  test headless : figures, boutons, responsive
```

`inbox/` n'est ni versionné ni publié : c'est un sas, il a vocation à être
vide.

## Convention de nommage

`sheet-wNN-<sujet>.html` pour les semaines, `sheet-tNN-<sujet>.html` pour les
thèmes, `walkthrough-dNN-<sujet>.html` pour les déroulés. `NN` sur deux chiffres,
`<sujet>` en minuscules sans accents, mots séparés par des tirets.

**La version vit dans le `<title>`, jamais dans le nom de fichier.** Une fiche
révisée garde son URL : les liens, les favoris et le cache hors ligne survivent
à la révision. `sheet-t05-regression-lineaire-logistique.html` reste ce nom
quand son titre passe de `… — v1 du 11/09` à `… — v2 du 03/10`.

## Métadonnées lues par l'index

Dans le `<head>` de chaque fiche :

```html
<title>Probabilités &amp; lois — fiche thématique</title>
<meta name="sheet" content="series=topic;number=01;status=v1">
<meta name="deck" content="01">
<meta name="subtitle" content="ligne secondaire, optionnelle">
```

`deck` est la valeur du deck Anki et détermine la section de l'index :
`00` (3 fils), `01` (maths-stats), `02` (ml classique), `03+07` (deep learning
+ python), `04+05` (llm engineering + system design), `06` (coding patterns),
`08` (web). Les fiches de semaine prennent `00`. Une fiche dont le `deck` est
inconnu atterrit dans une section « à classer » — elle n'est jamais perdue,
mais elle se voit.

Un déroulé porte `series=walkthrough` et son `<title>` se termine par `— déroulé`.

Le libellé de droite est calculé, jamais écrit à la main : le nombre de balises
`<details>` pour une fiche (« 28 q. »), le nombre de marches du rail de
navigation et de balises `<figure>` pour un déroulé (« 6 marches · 8 fig. »).

## Ajouter une fiche

1. Déposer le fichier dans `sheets/weekly/`, `sheets/topics/` ou
   `sheets/walkthroughs/`, avec son `<title>` et ses `<meta>`.
2. `make index`
3. `git add` + `git commit` + `git push` — Cloudflare Pages déploie tout seul.

`make hooks` (une fois par clone) installe un hook `pre-commit` qui lance
l'étape 2 et rattrape les oublis.

Plus simple : déposer le fichier brut dans `inbox/` et demander
l'intégration à Claude, qui suit la procédure de `CLAUDE.md` — renommage,
métadonnées, liens, index, tests, commit, push.

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
`sheet:<nom-de-fichier>:ratings`. Les notes sont restaurées à l'ouverture et
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
