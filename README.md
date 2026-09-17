# Fiches ML/LLM

**Site publié : <https://learnings-ek5.pages.dev/>** — déployé par Cloudflare
Pages à chaque push sur `main`. L'adresse ne change pas ; le nom de projet de
`wrangler.toml` n'en est pas l'URL.

Fiches de révision de la formation ML/LLM. Un fichier HTML autonome par entrée :
zéro dépendance, zéro CDN, zéro build. Chaque fichier s'ouvre en `file://`
comme sur le site publié.

## État du site

**56 sheets publiées**, réparties en quatre séries :

| série | dossier | quoi | combien |
| --- | --- | --- | --- |
| **chaîne** | `sheets/chains/` | règle → application chiffrée, pas numérotés, figures interactives | 33 |
| **déroulé** | `sheets/walkthroughs/` | un problème mené de bout en bout sur des chiffres | 7 |
| **pont** | `sheets/bridges/` | un mécanisme qui traverse plusieurs parties | 6 |
| **coding** | `sheets/coding/` | un patron d'algorithme : invariant, variant, où ça casse | 10 |

Onze anciennes fiches Q/A dorment dans `sheets/archive/`. Elles ne sont plus
produites ni maintenues ; on n'y touche pas.

La **Phase 1 de la formation est couverte** : les parties 0 à 9 et les ponts
ont toutes leurs sheets.

```
0 · Socle probabiliste          5 · Modèles linéaires
1 · L'objet aléatoire (fil A)   6 · Évaluer
2 · Le bruit décide (fil B)     7 · Arbres, ensembles, k-means
3 · Critère et descente (fil C) 8 · Calcul, numérique, tenseurs
4 · Matrice = action            9 · Coding            Ponts
```

Les **phases 2 à 4 sont vides** : leurs parties existent dans l'index et dans la
carte, avec un spec `stub` chacune, et aucune sheet.

- Phase 2 — `10` micrograd · `11` makemore · `12` transformer · `13` tokenizer · `14` mech interp
- Phase 3 — `20` evals · `21` fine-tuning · `22` inference
- Phase 4 — `30` system design

Un dixième stub reste ouvert en Phase 1 : `c10`, préfixes et deque monotone.

## Le workflow : un spec, puis `/sheet`

Une sheet ne s'écrit pas à la demande. Elle se produit à partir d'un **spec**,
et d'un seul.

1. **Le spec s'écrit dans le chat**, pas ici. C'est là que vit le contexte
   pédagogique : ce qui a réellement cassé en séance, les chiffres du fil rouge,
   ce que la sheet ne doit pas contenir. Il atterrit dans `specs/<id>-<slug>.md`
   avec son frontmatter et ses onze sections obligatoires — voir
   [`specs/README.md`](specs/README.md).
2. **Claude Code l'exécute**, avec `/sheet <id>`, qui charge le skill
   `sheet-chain`, le gold standard, le template et `assets/sheetlib.js`, vérifie
   chaque chiffre du spec par script, écrit la sheet, la valide au rendu, régénère
   l'index et commite.
3. **Le statut suit la sheet** : `stub` → `ready` → `built` → `reviewed`.

### La règle des sessions

Les deux rôles ne se mélangent jamais, et c'est ce qui fait tenir le dépôt :

- **Claude Code n'écrit jamais le corps d'un spec.** Ni la question, ni les
  hypothèses, ni le fil rouge, ni les pas, ni les figures. Il ne modifie un spec
  que pour corriger un chiffre qu'il a vérifié par script, ajouter une section
  `## Questions pour la revue`, ou changer un statut sur instruction.
- **Le statut ne passe jamais de `stub` à `ready` par Claude Code.** Seul Salah
  le fait, en déposant un spec complet. Un `stub` rencontré en production se
  saute et se note dans le rapport ; il ne se remplit pas.
- **Jamais de sheet sans spec `ready`.** Ce qui n'est pas déterminé se note sous
  `## Questions pour la revue`, jamais ne s'invente.

La suite se produit **une sheet par bloc, à la revue du vendredi**, via `/sheet`.

## Structure

```
index.html                  liste par partie, ordre de dépendance — GÉNÉRÉ
map.html                    carte des prérequis — GÉNÉRÉ
timeline.html               pilotage : où j'en suis dans les 51 semaines
sw.js                       service worker (cache hors ligne) — version GÉNÉRÉE
manifest.webmanifest        installation sur l'écran d'accueil
CLAUDE.md                   procédure, invariants, pièges (côté agent)
CLAUDE-CODE-PROMPT.md       le prompt de la refonte, et où elle en est
specs/                      la matière des sheets — un spec, une sheet, un commit
anki/ancres.csv             tag Anki → sheet → ancre du pas — GÉNÉRÉ
assets/sheetlib.js          les primitives de figure, partagées par les sheets
sheets/
  chains/        chain-pNN-MM-<sujet>.html
  walkthroughs/  walkthrough-pNN-MM-<sujet>.html
  bridges/       bridge-NN-<sujet>.html
  coding/        coding-NN-<sujet>.html
  archive/       anciennes fiches Q/A, gardées pour mémoire
tools/
  build_index.py         régénère index.html, map.html, le bloc PWA, la version du cache
  build_anki.py          régénère anki/ancres.csv depuis les meta des sheets
  validate_sheet.py      structure d'une sheet + rendu sombre/clair (--render)
  check_links.py         tout href interne pointe-t-il sur un fichier et une ancre réels
  test_walkthroughs.mjs  test headless : figures, boutons, responsive
```

`inbox/` n'est ni versionné ni publié : c'est un sas, il a vocation à être vide.

## Commandes

| commande | effet |
| --- | --- |
| `make index` | régénère `index.html`, `map.html`, le bloc PWA et la version du cache |
| `make check` | échoue si `index.html` ou `sw.js` ne sont pas à jour |
| `make test` | tests headless (playwright — saute silencieusement s'il est absent) |
| `make anki` | régénère `anki/ancres.csv` |
| `make links` | vérifie tous les liens internes du dépôt |
| `make hooks` | installe le hook `pre-commit` qui lance `make index` |

Valider une sheet, structure **et** rendu :

```sh
.venv/bin/python tools/validate_sheet.py sheets/coding/coding-05-arbres.html --render
```

`--render` passe par le playwright **Python** de `.venv/`, pas par celui de
`make test` (qui est en Node). `python3` seul n'a pas le module : le validateur
se contente alors d'un `WARN rendu impossible`, c'est-à-dire un 0 FAIL qui n'a
rien rendu. Reconstruire le venv :

```sh
python3 -m venv .venv && .venv/bin/pip install playwright && .venv/bin/playwright install chromium
```

Pour servir le site localement (nécessaire pour tester le service worker, qui
ne s'enregistre pas en `file://`) :

```sh
python3 -m http.server 8777
```

## Conventions

**La version vit dans le `<title>`, jamais dans le nom de fichier.** Une sheet
révisée garde son URL : les liens, les favoris et le cache hors ligne survivent
à la révision. Une sheet publiée ne se renomme pas pour des raisons esthétiques.

Chaque sheet porte dans son `<head>` les métadonnées que l'index lit :

```html
<title>Arbres — récursion, parcours, bornes — coding</title>
<meta name="sheet" content="series=coding;part=09;number=05;status=v1">
<meta name="subtitle" content="ligne secondaire, optionnelle">
<meta name="prereq" content="c00">
<meta name="anki" content="coding::arbres,coding::dfs,coding::bfs,coding::bst">
```

Le libellé de droite de l'index est calculé, jamais écrit à la main. `index.html`
et `map.html` sont générés : les éditer à la main se perd au prochain
`make index`.

## Notes de révision

Les sheets du standard actuel ne stockent rien : pas de `localStorage`, pas de
notation. Seules les anciennes fiches de `sheets/archive/` enregistrent leurs
notes `encore` / `difficile` / `bien` dans le navigateur, sous la clé
`sheet:<nom-de-fichier>:ratings`. Ces notes ne sont ni synchronisées ni
sauvegardées.

## Installer sur l'écran d'accueil iPhone

1. Ouvrir le site dans **Safari** (Chrome iOS ne sait pas installer).
2. Bouton **Partager** → **Sur l'écran d'accueil** → **Ajouter**.
3. L'icône « Fiches » apparaît ; lancée depuis là, l'app s'ouvre en plein écran.

Une sheet déjà ouverte une fois reste consultable hors ligne. L'index, lui, est
rafraîchi dès qu'il y a du réseau, pour voir les sheets ajoutées depuis.

## Hébergement

Cloudflare Pages, dépôt public, pas de build : `wrangler.toml` déclare la racine
du dépôt comme répertoire de sortie. Chaque `push` sur `main` déclenche un
déploiement.
