---
name: sheet-lesson
description: Produit une leçon du socle probabiliste (série `lesson`, l01 à l12) à partir d'un spec `specs/lNN-*.md` au statut `ready` — le cours autoporteur aligné sur la playlist Brunton, notion par notion, avec idée, formule, figure, et blocs dépliables exemples / preuve / code / où ça casse. À utiliser pour toute création ou mise à jour de leçon ; jamais pour une chaîne (voir sheet-chain).
---

# sheet-lesson

Une leçon est un **cours**, pas un aide-mémoire : c'est la seule source de Salah sur le socle probabiliste (décision du 10/10/2026). Elle se lit après les vidéos de Brunton, puis se rouvre comme référence. Les cartes Anki se font après sa lecture, à partir des « ce qu'on garde » des notions OUTIL.

## Étape 0 — lire, dans cet ordre

1. `specs/lNN-<slug>.md` — statut `ready` obligatoire (Salah a délégué la rédaction et le passage en `ready` pour cette série, voir `specs/README.md`).
2. `sheets/lessons/lesson-00-08-esperance-variance.html` — l'**étalon**, et ses sources `sources/l08/` (ce dossier) : `parts/02-n2.html`, `parts/06-n6.html`, `js/20-vignettes.js` donnent le ton, la densité et la structure.
3. `assets/sheetlib.js` — les primitives de figure.
4. Les transcriptions des vidéos couvertes : Brunton est la source de l'ordre, des images et des exemples. Ses erreurs connues sont listées dans le doc de plan (« Erreurs de Brunton à ne pas reproduire ») et se corrigent dans un encadré `div.brunton` « Brunton, rectifié ».

## Gabarit d'une notion

`section.notion.(outil|culture)#nN` › `h3` + `span.tag.outil|culture` › `p.src` (vidéo) › `div.idee` (l'image de Brunton, prose courte, ~140 mots, 180 au plus, un exemple chiffré avant la formule quand c'est possible) › `div.fig.vis#vN` (« Voir l'idée — … » : la vignette qui **montre les exemples que l'idée cite**, manipulable ou animée ; légende `.cap`) › `div.formule` (définitions, hypothèses et leur rôle) › `div.fig` si une intuition se joue › `details.ex` › `details.preuve` (lignes `div.drv` : expression | règle utilisée) › `details.code` (`pre.py` + `pre.out`) › `details.casse` (+ `div.brunton`) › `p.garde`.

Ids `n1`…`nN` consécutifs, jamais suffixés.

**La vignette « Voir l'idée »** (décision du 10/10/2026, révision v2 de l08) : une par notion, même CULTURE. Elle ne redit pas la figure sous la formule, elle rend visibles les exemples de l'idée (les deux bosses et les fortunes de n2, le bâton qui tourne de n6, le triangle de n11). Outils dans l'étalon : `runner`, `tween`, `loop` (animation interruptible, `SL.reduced` respecté), `rng` (graine fixée : l'état initial est toujours le même), `stack` (une pastille par individu), `fulcrum` (le point d'équilibre sous la moyenne), `rect`. L'état initial doit déjà dire quelque chose sans clic ; les animations ne partent qu'au clic, sauf une rotation continue suspendue hors écran. Le validateur (`tools/validate_sheet.py`, branche `lesson`) impose ce gabarit.

## Kit et sources (depuis le 10/10/2026)

Une leçon n'est plus écrite à la main dans un seul fichier : elle est **assemblée** par `kit/build.py` à partir de ses sources, et la page produite reste un HTML autonome (invariant du dépôt). Les sources des douze leçons sont dans `sources/lNN/` et font foi : pour réviser une leçon, éditer ses sources puis reconstruire, jamais la page seule (sinon la prochaine reconstruction efface la correction).

- `sources/lNN/head.html` (doctype → `<style>`, metas), `parts/00-top.html`, un `parts/NN-nK.html` par notion, `parts/99-end.html`, `js/*.js` (figures puis vignettes), `code/cN.py` (blocs de code, sorties dans `code/oN.txt`), `extra.css` (optionnel), `check/` (les scripts qui ont vérifié les chiffres).
- `kit/run_code.py sources/lNN` exécute les blocs et écrit les sorties ; `kit/build.py sources/lNN sheets/lessons/lesson-00-NN-<slug>.html` assemble (CSS `kit/base.css` + `kit/lesson.css`, outils `kit/helpers.js`, typographie française du HTML) ; `kit/shots.py <page> <dossier>` capture chaque figure et vignette, signale les erreurs JS et le débordement à 390 px ; `kit/grid.py` colle les captures pour les regarder.
- `kit/helpers.js` est inclus d'office : `curve`, `bar`, `leftAxis`, `rd`, `buttons`, `runner`, `tween`, `loop`, `rng`, `pick`, `gauss`, `fulcrum`, `median`, `rect`, `stack`. Ne pas les recopier dans `js/`.
- Une révision publiée suit `CLAUDE.md` (« Réviser une sheet publiée ») : bump `· vN` dans `head.html` (title et meta) et dans le footer de `parts/99-end.html`, section `## Révision vN` dans le spec.

## Règles

- **Chaque chiffre est recalculé par script** avant d'être écrit ; **chaque bloc de code est exécuté** et sa sortie collée telle quelle (graine fixée). Code et commentaires en anglais.
- **Chaque promesse de « Ce qui a cassé pour Salah » est vérifiée dans le HTML** avant commit : un contre-exemple promis dans le spec doit être visible dans la leçon.
- **Relecture en contexte frais** par un agent qui n'a pas écrit la leçon, avant publication ; ses corrections sont appliquées puis notées sous `## Questions pour la revue` du spec.
- Formules en HTML et Unicode, zéro MathJax, zéro CDN, zéro lien externe (les vidéos sont citées par numéro).
- Typographie française : espace fine insécable (U+202F) avant `; ? !`, insécable (U+00A0) avant `:` et à l'intérieur des guillemets, jamais dans le code ni le script.
- **Leçons apprises aux douze relectures (10/10/2026)** : « jeu de test (test set) », « taux de bonnes réponses (accuracy) », « variables explicatives (features) » au premier usage ; pas de gras décoratif dans les idées (le gras signale le mot défini) ; pas de `<b>` dans le corps d'un `div.brunton` (il devient l'étiquette rouge) ; « ce qu'on garde » d'une OUTIL : une idée, cadre dit, 40 mots au plus ; une correction de Brunton va dans l'encadré, citation vérifiée dans la transcription, sans lui prêter ce qu'il ne dit pas ; Cov = 0 suffit à l'additivité des variances ; Sₙ ≈ N(nμ, nσ²) n'est qu'une approximation, c'est la version standardisée qui converge ; variance infinie n'est pas absence de moyenne ; chapeau sur une lettre grecque en `<span class="hat">μ</span>` ; légendes « premier panneau / second » quand les panneaux s'empilent sur mobile ; readouts courts (≤ ~18 caractères) ; graines choisies pour que l'état initial d'une vignette aléatoire soit proche de la théorie, et la légende ne cite que des chiffres théoriques ou ceux de cet état.
- Vérifier : `validate_sheet.py <leçon> --render` à 0 FAIL, captures regardées blocs **ouverts**, figures manipulées (curseurs et boutons), mobile 390 px ; puis `make index`, `make links`, `make anki`, `make test`.

Commit : `feat(lesson): lNN <titre>`, sources et page dans le même commit ; spec au statut `built`.
