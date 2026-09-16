---
id: c03
series: coding
part: "09"
number: "03"
slug: binary-search
title: Binary search
subtitle: un espace de recherche monotone, un invariant sur [lo, hi], un variant hi − lo
prereq: [c00]
anki: [coding::binary-search, coding::signal-pattern]
bridges: []
next: c04
status: ready
---
## Format coding
Blocs, dans cet ordre : **Signal** (les mots de l'énoncé qui appellent le pattern) → **Pattern** (le geste en 3 lignes) → **TAP** : invariant (conteneur nommé, tranche exacte), variant (entier ≥ 0, strictement décroissant), conclusion qui ouvre par « donc » → **Trace** (`SL.trace` sur un exemple de 8 à 12 cases, une frame par itération, l'invariant affiché à chaque frame) → **Complexité** (hors boucle « + », par itération « × », espace en fonction de n ou de |Σ|) → **Pièges Python** → **Cartes « signal → pattern »**. Le **squelette** (structure de boucle et invariant) est donné ; **jamais le code complet** de la solution : Salah l'écrit.


## Signal
« trié », « trouver le premier / dernier … tel que », « minimiser le maximum », « la plus petite capacité / vitesse qui suffit » (recherche sur la réponse), une **prédicat monotone** : faux…faux vrai…vrai.

## Pattern
Trois variantes, une seule idée : sur [lo, hi] où le prédicat est monotone, tester mid, jeter la moitié qui ne peut pas contenir la réponse. (a) valeur exacte ; (b) **premier vrai** (lower bound) ; (c) recherche sur la réponse : le tableau n'existe pas, c'est un intervalle d'entiers et un prédicat « faisable(x) ».

## TAP (premier vrai, préd = arr[k] ≥ cible sur [1, 3, 3, 5, 8, 9, 12], cible 5)
Invariant : préd est faux sur [0, lo) et vrai sur [hi, n) ; la réponse est dans [lo, hi] (bornes : lo inclusif, hi exclusif — le dire).
Variant : hi − lo, strictement décroissant (mid ∈ [lo, hi) ⇒ lo = mid + 1 ou hi = mid rétrécit toujours).
Conclusion : à la sortie lo = hi, donc faux sur [0, lo) et vrai sur [lo, n), donc lo est le premier vrai (n si aucun).
Complexité : O(log n) ; espace O(1).

## Trace exigée
- `SL.trace` sur [1, 3, 3, 5, 8, 9, 12], cible 5 : frames (lo, hi, mid) avec `win` = [lo, hi], `mark` = mid, readout de l'invariant instancié (« faux sur [0,3), vrai sur [4,7) »). Résultat 3.
- Second `trace` « recherche sur la réponse » (Koko, LC 875, piles [3, 6, 7, 11], h = 8) : l'axe est la vitesse 1…11 ; readout faisable(mid).

## Complexité
O(log n) itérations × coût du prédicat (O(1) sur tableau, O(n) pour « faisable » ⇒ O(n log M)).

## Pièges Python
- `mid = (lo + hi) // 2` ; `lo = mid + 1` **et** `hi = mid` (pas `mid − 1` avec hi exclusif) : mélanger les conventions crée la boucle infinie.
- `while lo < hi` avec hi exclusif ; `while lo <= hi` avec hi inclusif — choisir et s'y tenir.
- `bisect.bisect_left` existe ; savoir l'écrire quand même.

## Cartes
« prédicat monotone ⇒ binary search » ; « premier vrai : lo = mid + 1 / hi = mid, sortie lo » ; « recherche sur la réponse : intervalle + faisable(x) » ; « variant hi − lo ».

## Ce qui a cassé pour Salah
- Pas de drill binary search enregistré : sheet à lire **avant** le premier drill ; insister sur les bornes (inclusif/exclusif) parce que c'est là que le variant se casse.
