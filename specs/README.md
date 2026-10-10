# specs/ — la matière des sheets

Un spec = une sheet = un commit. Claude Code ne rédige **jamais** une sheet sans spec au statut `ready`.
Les specs sont écrits dans le chat Claude (contexte pédagogique : ce qui a cassé pour Salah, chiffres des séances). Claude Code les exécute.

## Frontmatter

```yaml
---
id: p03-01              # pNN-MM (chain/walkthrough), bNN (bridge), cNN (coding)
series: chain           # chain | walkthrough | bridge | coding
part: "03"
number: "01"
slug: critere-escalier-vs-sensible
title: Critère en escalier vs critère sensible
subtitle: fil C — …
prereq: [p00-04, p02-01, p03-02]
anki: [ml::arbres, ml::logistique]
bridges: [b01, b06]
next: p03-02
status: ready           # stub | ready | built | reviewed
---
```

Chemin de sortie déduit : `sheets/<chains|walkthroughs|bridges|coding>/<series>-<id>-<slug>.html`
(chain-p03-01-…, walkthrough-p01-01-…, bridge-01-…, coding-01-…).

## Sections obligatoires d'un spec `ready`

1. **Question de la chaîne** — une ligne, c'est le sous-titre implicite.
2. **Prérequis** — objets et hypothèses supposés, avec l'id et l'ancre de la sheet source.
3. **Hypothèses posées** — numérotées H1…, mot-clé en gras.
4. **Exemple fil rouge** — les chiffres exacts, vérifiés, qui traversent toute la chaîne.
5. **Pas de la chaîne** — numérotés : règle (3 lignes max) → application chiffrée → « au tableau » (prémisse, donc, donc, résultat nommé). Marquer `[tronc]` et `[casse]`.
6. **Figures exigées** — pour chaque figure : primitive sheetlib (`plot`, `repeat`, `descent`, `trace`, `plane`), ce qu'elle doit rendre visible, quels curseurs, et ce que la légende doit dire.
7. **Où ça casse** — 2 à 4 limites, mécanisme en une phrase.
8. **Résumé** (≤ 8 lignes) et **phrase d'entretien**.
9. **Chaîne verbalisée** — 4 à 7 maillons (question → réponse d'une ligne).
10. **Ce qui a cassé pour Salah** — les erreurs réelles des séances ; chacune doit être adressée explicitement par un pas, une figure ou une limite. C'est la section que Claude Code ne peut pas inventer.
11. **Exclusions** — ce que la sheet ne doit pas contenir (scope Phase 1 acté le 10/09/2026 : pas de CCP, SDP, SE de White, PCA non centrée, hessienne XGBoost, feature engineering).

Un spec `stub` n'a que le frontmatter et une ligne de périmètre : il sert au squelette (index, carte), pas à la production.

## Série `lesson` — le cours autoporteur du socle (décidé le 10/10/2026)

Les douze leçons `l01` à `l12` remplacent les quatre chaînes p00 comme source du socle probabiliste. Elles suivent la playlist *Probability and Statistics* de Steve Brunton, vidéo par vidéo, avec un seul écart d'ordre : la covariance (vidéos 41, 42) est la leçon 9, juste après la variance. Chemin de sortie : `sheets/lessons/lesson-00-NN-<slug>.html`.

Pour cette série seulement, Salah a délégué l'écriture du spec et le passage en `ready` (10/10/2026) : la leçon reste relue par lui avant que la suivante ne parte, et la première produite (`l08`) fige le format.

Sections obligatoires d'un spec de leçon `ready` :

1. **Question de la leçon** — une ligne.
2. **Vidéos couvertes** — numéros et titres.
3. **Prérequis** — ids et ancres des leçons supposées.
4. **Notions** — numérotées `n1`…, dans l'ordre de Brunton. Pour chacune : titre, étiquette **OUTIL** (resservira, donnera une carte) ou **CULTURE** (reste dans la leçon), vidéo source, l'idée (l'image de Brunton), la formule et ses hypothèses, les exemples chiffrés, la preuve (ce qu'elle montre, où l'hypothèse sert), le code (ce qu'il simule), « où ça casse », l'encadré « Brunton dit X, c'est Y » s'il y a lieu, et « ce qu'on garde ».
5. **Figures exigées** — primitive sheetlib, ce qu'elle rend visible, curseurs, légende.
6. **Résumé** (≤ 8 lignes) et **phrase d'entretien**.
7. **Chaîne verbalisée** — 4 à 7 maillons.
8. **Ce qui a cassé pour Salah** — chaque item adressé par une notion, une figure ou un « où ça casse ».
9. **Erreurs de Brunton couvertes** — la ligne du tableau d'errata, et la notion qui la corrige.
10. **Exclusions**.

Gabarit d'une notion dans la leçon : `section.notion#nN` › `h3` (titre + `span.tag.outil|culture`) › `p.src` › `div.idee` › `div.formule` › figure éventuelle › `details.ex` › `details.preuve` › `details.code` (`pre.py` + `pre.out`, code exécuté avant publication) › `details.casse` (avec `div.brunton` s'il y a lieu) › `p.garde`. Le validateur (`tools/validate_sheet.py`, branche `lesson`) l'impose.
