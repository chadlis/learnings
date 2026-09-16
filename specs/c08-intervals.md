---
id: c08
series: coding
part: "09"
number: "08"
slug: intervals
title: Intervals
subtitle: trier par début, puis un seul invariant : le dernier intervalle fusionné
prereq: [c00]
anki: [coding::intervals, coding::sweep]
bridges: []
next: c09
status: stub
---
## Format coding
Blocs, dans cet ordre : **Signal** (les mots de l'énoncé qui appellent le pattern) → **Pattern** (le geste en 3 lignes) → **TAP** : invariant (conteneur nommé, tranche exacte), variant (entier ≥ 0, strictement décroissant), conclusion qui ouvre par « donc » → **Trace** (`SL.trace` sur un exemple de 8 à 12 cases, une frame par itération, l'invariant affiché à chaque frame) → **Complexité** (hors boucle « + », par itération « × », espace en fonction de n ou de |Σ|) → **Pièges Python** → **Cartes « signal → pattern »**. Le **squelette** (structure de boucle et invariant) est donné ; **jamais le code complet** de la solution : Salah l'écrit.


## Signal
« intervalles », « fusionner », « chevauchement », « salles de réunion / nombre minimal de… », « insérer un intervalle », « points couverts ».

## Pattern
Trier par début ; parcourir en maintenant le **dernier intervalle du résultat** : si le courant commence avant sa fin ⇒ fusionner (fin = max des fins) ; sinon ⇒ pousser. Variante balayage (sweep) : événements (+1 au début, −1 à la fin) triés, compteur ⇒ maximum de chevauchements.

## TAP (fusion, [[1,3],[2,6],[8,10],[15,18],[9,12]])
Invariant (après avoir traité les i premiers intervalles triés) : `res` est la liste des intervalles fusionnés de tri[:i], disjoints, triés, et `res[−1]` est celui qui peut encore absorber le suivant.
Variant : n − i.
Conclusion : à la sortie, donc `res` = fusion de tous, donc `res` est la réponse.
Complexité : tri O(n log n) + parcours O(n) = O(n log n) ; espace O(n) pour la sortie.

## Trace exigée
- Ligne de temps SVG custom : intervalles triés empilés, frames qui fusionnent [1,3] et [2,6], puis [8,10] et [9,12] ; readout `res`. Résultat [[1,6],[8,12],[15,18]].
- Sweep : événements sur l'axe, compteur en readout, maximum = salles nécessaires.

## Complexité
O(n log n) dominé par le tri (le « + » de c00 : tri + parcours).

## Pièges Python
- Trier par début **et** utiliser `max(fin)` à la fusion (pas la fin du courant).
- Chevauchement : `cur[0] <= last[1]` (inclusif) ou `<` selon l'énoncé — le lire.
- Sweep : à égalité de temps, traiter les −1 avant les +1 si les intervalles fermés à droite ne se chevauchent pas.

## Cartes
« intervalles ⇒ trier par début + dernier fusionné » ; « fin = max(fin) » ; « nombre de salles ⇒ sweep ±1 » ; « O(n log n) par le tri ».

## Ce qui a cassé pour Salah
- Aucun drill enregistré ; sheet à lire avant.
