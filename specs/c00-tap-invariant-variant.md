---
id: c00
series: coding
part: "09"
number: "00"
slug: tap-invariant-variant
title: TAP — invariant, variant, conclusion, complexité
subtitle: le rituel qui transforme un code qui marche en code qu'on peut défendre au tableau
prereq: []
anki: [coding::tap, coding::invariant, coding::complexite]
bridges: []
next: c01
status: ready
---
## Format coding
Blocs, dans cet ordre : **Signal** (les mots de l'énoncé qui appellent le pattern) → **Pattern** (le geste en 3 lignes) → **TAP** : invariant (conteneur nommé, tranche exacte), variant (entier ≥ 0, strictement décroissant), conclusion qui ouvre par « donc » → **Trace** (`SL.trace` sur un exemple de 8 à 12 cases, une frame par itération, l'invariant affiché à chaque frame) → **Complexité** (hors boucle « + », par itération « × », espace en fonction de n ou de |Σ|) → **Pièges Python** → **Cartes « signal → pattern »**. Le **squelette** (structure de boucle et invariant) est donné ; **jamais le code complet** de la solution : Salah l'écrit.


## Le rituel, en quatre gestes
1. **Invariant** : une phrase vraie avant chaque itération, sur l'état **acquis**, avec un conteneur nommé et une tranche exacte. « `best` est le maximum de la somme de toute fenêtre de taille k dont la fin est < i » — pas « best est le meilleur jusqu'ici ».
2. **Variant** : un entier ≥ 0 qui décroît strictement à chaque itération (`n − i`, `hi − lo`, taille de la pile). Sa valeur à la sortie est calibrée sur la vraie condition d'arrêt.
3. **Conclusion** : « **Donc** » + substitution de la condition d'arrêt dans l'invariant ⇒ le résultat demandé. Conclure sur le **problème**, pas sur le déroulement : « donc l'invariant couvre toute la chaîne, donc c'est un palindrome » et non « on a parcouru toute la chaîne ».
4. **Complexité** : ce qui est hors boucle s'**ajoute**, ce qui est par itération se **multiplie** ; tri O(n log n) + boucle O(n) = O(n log n). Espace : en fonction de n, ou de |Σ| — un alphabet borné donne O(1), pas « 26 » ni « la valeur qu'a pris le set à l'exécution ».

## Exemple fil rouge
Somme maximale d'une fenêtre de taille k (LC 643), arr = [1, 12, −5, −6, 50, 3], k = 4.
Invariant (avant l'itération i ≥ k) : `s` = somme de arr[i − k : i] ; `best` = max des sommes de toutes les fenêtres de taille k se terminant avant i.
Variant : n − i.
Conclusion : à la sortie i = n, donc `best` = max sur toutes les fenêtres de taille k se terminant avant n, c'est-à-dire toutes, donc `best` est la réponse.
Complexité : initialisation O(k) + boucle (n − k) × O(1) = O(n) ; espace O(1).

## Trace exigée
- `SL.trace` sur arr, frames i = 4, 5, 6 : `win` = [i − k, i], readout `s`, `best`, et l'invariant instancié (« best = max des fenêtres finissant avant 5 = 2 »). Puis une frame « sortie : i = 6 = n, donc … ».

## Pièges
- Invariant sur le **futur** (« il reste à traiter… ») : ce n'est pas un invariant.
- Variant qui peut stagner (`while lo < hi` avec `lo = mid`) : boucle infinie ; le variant doit strictement décroître.
- Clause de maximalité mal ancrée : « la plus longue fenêtre finissant en j » (ancrée à droite), pas « la plus longue fenêtre vue » — c'est ce qui permet la récurrence.
- Espace = valeur d'exécution (« le set a eu 5 éléments ») au lieu d'une borne.

## Cartes
`coding::tap` : « conclusion ouvre par donc » ; « hors boucle + / dans la boucle × » ; « alphabet borné ⇒ O(1) » ; « maximalité ancrée à droite ».

## Ce qui a cassé pour Salah
- Termination gap (29/07, à surveiller à chaque drill) : conclusion sur le déroulement au lieu du résultat — geste 3.
- Espace donné en valeur d'exécution au lieu de la taille de l'alphabet — geste 4.
- Maximalité ancrée à droite : installée le 25/08 par contre-exemple, à re-solliciter sans redémontrer — pièges.
- Acquis (ne pas réexpliquer) : invariant sur l'état acquis avec conteneur nommé et tranche exacte ; variant à deux propriétés calibré sur la sortie ; substitution explicite.
