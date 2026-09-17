---
id: c07
series: coding
part: "09"
number: "07"
slug: heap
title: Heap — le top-k par un min-heap de taille k
subtitle: coding — le plus petit du tas est le seuil d'entrée ; quand les clés sont bornées, un bucket bat le log
prereq: [c00]
anki: [coding::heap, coding::top-k, coding::bucket-sort]
bridges: []
next: c08
status: ready
---
## Signal
« Les k plus grands / plus fréquents / plus proches », « le k-ième », fusion de k flux triés, ordonnancement par priorité. n grand, k petit. Contre-signal : k ≈ n (trier), clés **bornées** (bucket, O(n)).

## Pattern
Pour les k plus grands : un **min-heap de taille k**. Son minimum est le **seuil d'entrée** : un nouvel élément n'entre que s'il le dépasse, et il remplace le minimum. À la fin le tas contient exactement les k plus grands. (Pour les k plus petits : max-heap, ou min-heap sur −x en Python.)

## Squelette (top-k)
```
h = []
pour v dans arr :
    si len(h) < k : heappush(h, v)
    sinon si v > h[0] : heapreplace(h, v)       # h[0] est le seuil
retour h                                         # les k plus grands, non triés
```

## TAP
- **Invariant** : après le tour i, h contient **exactement** les min(k, i+1) plus grandes valeurs de arr[0:i+1] ; h[0] est la plus petite d'entre elles.
- **Variant** : n − i.
- **Conclusion** : donc à la sortie, h contient exactement les k plus grandes valeurs de arr ; h[0] est la k-ième.
- **Complexité** : n tours × O(log k) ⇒ O(n log k) ; espace O(k). Contre O(n log n) par tri et O(n) espace ; contre O(n) moyen par quickselect (nommer).

## Trace (figure 1)
arr = [5, 1, 9, 3, 7, 8], k = 3 : h trié après chaque tour = [5] · [1, 5] · [1, 5, 9] · [3, 5, 9] (1 sort) · [5, 7, 9] (3 sort) · [7, 8, 9] (5 sort). Réponse {7, 8, 9}, k-ième = 7. `note` = « v = 3 > h[0] = 1 ⇒ remplace ».

## Les variantes, une ligne chacune
- **k plus fréquents** (LC 347) : compter (dict), puis top-k sur (fréquence, valeur) ; ou **bucket** par fréquence (indices 0..n) puis lire depuis le haut : O(n).
- **k plus proches de l'origine** : max-heap sur la distance (ou min-heap sur −d²).
- **Fusion de k listes triées** : heap des têtes (valeur, indice de liste) ; O(N log k).
- **Bucket sort** : dès que les clés sont dans [0, m] avec m = O(n), un tableau de listes bat tout log.

## Figures exigées
- **Figure 1 — `SL.trace`** : arr = [5, 1, 9, 3, 7, 8], 6 images, `ptr` = {i}, `mark` = les indices actuellement dans le tas, `note` = le contenu trié du tas et la décision, `inv`. Légende : le minimum du tas est la barre d'entrée.
- **Figure 2 — `SL.plot`** : n log k, n log n, et n en fonction de n (k = 10, axe log) ; readouts à n = 10⁶. Légende : le gain est log k contre log n, pas plus.

## Où ça casse
Max-heap pour les k plus grands : il faut retirer n − k fois, O(n log n), et la réponse est la même. Le tas est le bon outil parce qu'il garde le **seuil** accessible en O(1), pas parce qu'il trie.

## Pièges Python
- `heapq` est un **min**-heap : max-heap = pousser −x, ou des tuples (−clé, valeur).
- Tuples avec valeurs non comparables en cas d'égalité de clé : ajouter un compteur.
- `heapify` est O(n) ; pousser n fois est O(n log n) — à savoir.
- Retourner `h` en le croyant trié : il ne l'est pas ; `sorted(h)` si l'ordre compte.

## Résumé
1. Signal : k plus grands / fréquents / proches, k-ième, fusion de k flux.
2. Min-heap de taille k ; h[0] = seuil d'entrée ; remplacer, pas pousser-puis-retirer.
3. Invariant : h = exactement les k plus grands de arr[0:i+1] ; O(n log k), O(k).
4. Clés bornées ⇒ bucket, O(n) ; k ≈ n ⇒ trier.

**Phrase d'entretien** : « Pour les k plus grands je garde un min-heap de taille k : son minimum est le seuil d'entrée, un élément n'entre que s'il le dépasse et prend sa place. À chaque instant le tas contient exactement les k plus grands vus, donc à la fin les k plus grands tout court, en n log k. Si les clés sont bornées, un bucket fait mieux, en linéaire. »

## Chaîne verbalisée
1. Pourquoi un min-heap pour les k plus grands ? → Son minimum est le seuil ; remplacement en O(log k).
2. Invariant ? → h = exactement les min(k, i+1) plus grands de arr[0:i+1].
3. Complexité, et contre quoi ? → O(n log k) contre n log n (tri) et O(n) moyen (quickselect).
4. Quand le bucket bat-il le heap ? → Clés dans [0, m], m = O(n) : fréquences, valeurs bornées.

## Ce qui a cassé pour Salah
- Famille t09 : « top-k par min-heap de taille k, k plus fréquents, bucket sort quand les clés sont bornées, O(n log k) » ; la phrase « le min = seuil d'entrée » est l'invariant à dire.
