---
id: c07
series: coding
part: "09"
number: "07"
slug: heap
title: Heap
subtitle: top-k sans trier tout : le min d'un min-heap de taille k est le seuil d'entrée
prereq: [c00]
anki: [coding::heap, coding::top-k]
bridges: []
next: c08
status: stub
---
## Format coding
Blocs, dans cet ordre : **Signal** (les mots de l'énoncé qui appellent le pattern) → **Pattern** (le geste en 3 lignes) → **TAP** : invariant (conteneur nommé, tranche exacte), variant (entier ≥ 0, strictement décroissant), conclusion qui ouvre par « donc » → **Trace** (`SL.trace` sur un exemple de 8 à 12 cases, une frame par itération, l'invariant affiché à chaque frame) → **Complexité** (hors boucle « + », par itération « × », espace en fonction de n ou de |Σ|) → **Pièges Python** → **Cartes « signal → pattern »**. Le **squelette** (structure de boucle et invariant) est donné ; **jamais le code complet** de la solution : Salah l'écrit.


## Signal
« les k plus grands / plus fréquents / plus proches », « flux, on ne peut pas tout stocker », « fusionner k listes triées », « médiane glissante ».

## Pattern
Top-k plus grands : **min-heap de taille k** ; le sommet est le plus petit des k retenus, donc le seuil : un nouvel élément entre s'il le dépasse (pop puis push, ou `heapreplace`). k plus fréquents : compter (Counter) puis heap sur (fréquence, clé). Quand les clés sont **bornées** (fréquences ≤ n) : bucket sort en O(n) bat le heap.

## TAP (top-k, arr = [3, 1, 5, 12, 2, 11, 7, 8], k = 3)
Invariant (après avoir traité les i premiers) : `heap` contient exactement les min(i, k) plus grands éléments de arr[:i] ; son sommet est le plus petit d'entre eux.
Variant : n − i.
Conclusion : à la sortie i = n, donc `heap` contient les k plus grands de tout arr, donc c'est la réponse.
Complexité : n × O(log k) = O(n log k) ; espace O(k).

## Trace exigée
- `SL.trace` sur [3, 1, 5, 12, 2, 11, 7, 8], k = 3 ; à chaque frame le contenu du heap (trié pour lisibilité) et le seuil (sommet) ; les éléments rejetés marqués. Résultat {8, 11, 12}.
- Second `trace` : bucket sort des fréquences pour « k plus fréquents » sur "aabbbcdddd".

## Complexité
Heap : O(n log k) temps, O(k) espace. Tri complet : O(n log n). Bucket (clés bornées par n) : O(n). `heapq.nlargest(k, …)` fait O(n log k).

## Pièges Python
- `heapq` est un **min**-heap : pour un max-heap, pousser `−x`.
- Tuples `(clé, valeur)` : la comparaison passe à la valeur en cas d'égalité — mettre un tie-breaker ou un index si la valeur n'est pas comparable.
- `heapreplace` (pop puis push) plus rapide que `pushpop` selon le cas ; savoir lequel.

## Cartes
« top-k ⇒ min-heap de taille k, sommet = seuil, O(n log k) » ; « clés bornées ⇒ bucket O(n) » ; « heapq = min-heap, −x pour max » ; « tuples : tie-breaker ».

## Ce qui a cassé pour Salah
- LC 347 tenu (k plus fréquents) ; la sheet fixe le raisonnement « sommet = seuil » et l'alternative bucket, qui est la réponse optimale attendue en entretien.
