---
id: w01-04
series: walkthrough
part: "01"
number: "04"
slug: accuracy-vers-se
title: De l'accuracy au SE en quatre maillons — la sonde
subtitle: fil A — le déroulé de 3 minutes qui sert de sonde de fatigue
prereq: [p01-01]
anki: [stats::estimation]
bridges: []
next: p02-01
status: ready
---

## Question du déroulé
872/1 000. En quatre maillons, à l'oral, sans support : jusqu'à SE = 0,0106 et la phrase « le SE décrit la procédure ».

## Format
Un seul exemple, une seule colonne de marches, chaque marche = une brique ; à droite le calcul chiffré ; en bas les mêmes quatre maillons rejoués sur un second exemple (rappel : 28 positifs retrouvés sur 30).

## Marches
1. **Ce qui est tiré** : le test set. Trois colonnes en une ligne : FIXE π · ALÉATOIRE test set → X → p̂ · PROCÉDURE tirer → compter → diviser.
2. **La loi de X** : Binomiale(1 000, π). E = 1 000π, Var = 1 000π(1 − π).
3. **La loi de p̂** : E = π, Var = π(1 − π)/1 000. SE = √(0,87·0,13/1 000) = 0,0106.
4. **Plug-in** : π inconnu → p̂ : 0,01056. Phrase : « 0,872 ± 0,011, où 0,011 décrit la procédure ».

Second exemple (rappel 28/30) : marches identiques avec n = 30 (nombre de positifs) ; SE = √(0,933·0,067/30) = 0,0455 ; **marche 5 supplémentaire** : 2 échecs seulement ⇒ Wald [0,844 ; 1,023] déborde ⇒ Wilson [0,787 ; 0,982]. Ce qui casse est le nombre d'échecs, pas la prévalence.

## Figures exigées
- **Figure 1 — `stepper`** sur les marches (révélation une à une) + **`repeat`** compact (n = 1 000, π = 0,87) sous la marche 3.

## Ce qui a cassé pour Salah
- Sonde du 15/09 : tenue ; le mot « procédure » vide. Ce déroulé est la sonde elle-même, écrite : quand il la surapprend (≈ novembre 2026), il sert de référence pour en générer une autre, pas de sonde.

## Exclusions
Rien d'autre. Quatre maillons, pas cinq.
