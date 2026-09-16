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
status: built
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

## Questions pour la revue

- **Tous les chiffres du spec sont vérifiés et justes** (script Python) : SE = √(0,87·0,13/1 000) = 0,010635 → 0,0106 ; plug-in en 0,872 = 0,010565 → 0,01056 ; SE rappel = 0,045542 → 0,0455 ; Wald 0,933 ± 1,96·0,0455 = [0,8441 ; 1,0226] → [0,844 ; 1,023] ; Wilson (z = 1,96) = [0,7868 ; 0,9815] → [0,787 ; 0,982]. Aucune correction nécessaire.
- **Nuance d'affichage, pas d'erreur** : la formule « √(0,933·0,067/30) » prise au pied de la lettre vaut 0,04565 (→ 0,0457). C'est 28/30 *exact* qui donne 0,0455. La sheet écrit la formule avec les arrondis (comme p01-01) et le résultat exact. À trancher un jour pour tout le fil A : arrondir les opérandes ou les garder exacts.
- **Hors périmètre, mais repéré** : `chain-p01-01` annonce Wilson [0,851 ; 0,892] pour 872/1 000 ; le calcul donne [0,8499 ; 0,8913], soit [0,850 ; 0,891]. Ce déroulé ne reprend pas ce chiffre, donc rien n'a été touché.
- **« Ce qui a cassé pour Salah », second point** : « quand il la surapprend (≈ novembre 2026), il sert de référence pour en générer une autre, pas de sonde » n'est pas adressable par le contenu d'une marche. Traité par une phrase dans `#links` qui dit que la valeur de la page est le temps qu'elle met à sortir, et qu'une fois acquise elle devient le patron d'une autre sonde. Si ce n'est pas le bon endroit, le dire.
- **Lien de suite manquant** : `next: p02-01` pointe vers `../chains/chain-p02-01-bruit-vraisemblance-loss.html`, pas encore écrite → 3 WARN de lien interne au validateur, attendus.
- **`bridges: []`** : la barre latérale n'a donc pas de section « Ponts » ; `#links` sert de renvoi vers p01-01 (amont) et p02-01 (aval).
