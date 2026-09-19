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
