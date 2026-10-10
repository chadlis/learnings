---
name: sheet-lesson
description: Produit une leçon du socle probabiliste (série `lesson`, l01 à l12) à partir d'un spec `specs/lNN-*.md` au statut `ready` — le cours autoporteur aligné sur la playlist Brunton, notion par notion, avec idée, formule, figure, et blocs dépliables exemples / preuve / code / où ça casse. À utiliser pour toute création ou mise à jour de leçon ; jamais pour une chaîne (voir sheet-chain).
---

# sheet-lesson

Une leçon est un **cours**, pas un aide-mémoire : c'est la seule source de Salah sur le socle probabiliste (décision du 10/10/2026). Elle se lit après les vidéos de Brunton, puis se rouvre comme référence. Les cartes Anki se font après sa lecture, à partir des « ce qu'on garde » des notions OUTIL.

## Étape 0 — lire, dans cet ordre

1. `specs/lNN-<slug>.md` — statut `ready` obligatoire (Salah a délégué la rédaction et le passage en `ready` pour cette série, voir `specs/README.md`).
2. `sheets/lessons/lesson-00-08-esperance-variance.html` — l'**étalon**. Repartir de son `<style>` (tokens du tableau noir + bloc « série lesson ») et de ses outils JS (`curve`, `bar`, `rd`, `buttons`, `leftAxis`) tels quels.
3. `assets/sheetlib.js` — les primitives de figure.
4. Les transcriptions des vidéos couvertes : Brunton est la source de l'ordre, des images et des exemples. Ses erreurs connues sont listées dans le doc de plan (« Erreurs de Brunton à ne pas reproduire ») et se corrigent dans un encadré `div.brunton` « Brunton, rectifié ».

## Gabarit d'une notion

`section.notion.(outil|culture)#nN` › `h3` + `span.tag.outil|culture` › `p.src` (vidéo) › `div.idee` (l'image de Brunton, prose courte, un exemple chiffré avant la formule quand c'est possible) › `div.formule` (définitions, hypothèses et leur rôle) › `div.fig` si une intuition se joue › `details.ex` › `details.preuve` (lignes `div.drv` : expression | règle utilisée) › `details.code` (`pre.py` + `pre.out`) › `details.casse` (+ `div.brunton`) › `p.garde`.

Ids `n1`…`nN` consécutifs, jamais suffixés. Le validateur (`tools/validate_sheet.py`, branche `lesson`) impose ce gabarit.

## Règles

- **Chaque chiffre est recalculé par script** avant d'être écrit ; **chaque bloc de code est exécuté** et sa sortie collée telle quelle (graine fixée). Code et commentaires en anglais.
- **Chaque promesse de « Ce qui a cassé pour Salah » est vérifiée dans le HTML** avant commit : un contre-exemple promis dans le spec doit être visible dans la leçon.
- **Relecture en contexte frais** par un agent qui n'a pas écrit la leçon, avant publication ; ses corrections sont appliquées puis notées sous `## Questions pour la revue` du spec.
- Formules en HTML et Unicode, zéro MathJax, zéro CDN, zéro lien externe (les vidéos sont citées par numéro).
- Typographie française : espace fine insécable (U+202F) avant `; ? !`, insécable (U+00A0) avant `:` et à l'intérieur des guillemets, jamais dans le code ni le script.
- Vérifier : `validate_sheet.py <leçon> --render` à 0 FAIL, captures regardées blocs **ouverts**, figures manipulées (curseurs et boutons), mobile 390 px ; puis `make index`, `make links`, `make anki`, `make test`.

Commit : `feat(lesson): lNN <titre>` ; spec au statut `built`.
