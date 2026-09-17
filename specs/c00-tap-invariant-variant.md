---
id: c00
series: coding
part: "09"
number: "00"
slug: tap-invariant-variant
title: TAP — invariant, variant, conclusion, complexité
subtitle: coding — le rituel qui rend une solution défendable au tableau ; jamais le code, toujours la preuve
prereq: []
anki: [coding::tap, coding::invariant, coding::complexite]
bridges: []
next: c01
status: ready
---

## Ce que cette sheet est
La sheet-mère du coding : le format que toutes les familles (c01–c09) rejouent. Un problème résolu n'est pas fini tant que quatre choses ne sont pas dites : l'**invariant** (ce qui est vrai à chaque tour), le **variant** (pourquoi ça s'arrête), la **conclusion** (pourquoi l'invariant à la sortie donne le résultat), la **complexité** (composée, pas devinée). Jamais la solution complète en clair : le squelette, la trace, les quatre phrases.

## Format `coding` (valable pour c01–c09)
1. **Signal dans l'énoncé** → 2. **Pattern** → 3. **Squelette** (les lignes de contrôle, pas le corps) → 4. **TAP** : invariant · variant · conclusion · complexité → 5. **`SL.trace`** sur un exemple de 8 à 12 cases, l'invariant affiché à chaque image → 6. **Pièges Python** → 7. **Cartes « signal → pattern »**. Pas de « Où ça casse » séparé : les pièges en tiennent lieu. Chaîne verbalisée = les quatre phrases du TAP à voix haute.

## Le TAP, règle par règle
- **Invariant** : une propriété **inductive** (vraie avant le premier tour, préservée par un tour), qui nomme le **conteneur** et la **tranche exacte** qu'il décrit. « seen contient exactement les valeurs de nums[0:i] avec leur dernier indice » — pas « seen contient ce qu'on a vu ». Tranche par indices demi-ouverts [a:b) ; « exactement » (ni plus ni moins) ; l'indice courant exclu ou inclus, dit.
- **Variant** : un **entier ≥ 0 strictement décroissant** à chaque tour. n − i pour une boucle simple ; (n − r) + (n − l) pour deux pointeurs ; hi − lo pour une dichotomie ; nombre de sommets non visités pour un parcours. S'il n'existe pas, la boucle peut ne pas terminer.
- **Conclusion** : commence par **« donc »** et porte sur le **résultat**, pas sur le déroulement. « donc à la sortie, l'invariant sur [0:n) dit que … » — pas « donc on a parcouru tout le tableau ». La conclusion est l'invariant instancié à la valeur finale du variant.
- **Complexité** : par **composition**. Hors boucle : les coûts s'**ajoutent** ; dans une boucle : le coût du corps se **multiplie** par le nombre de tours — sauf amortissement, qu'on justifie (chaque élément entre et sort au plus une fois). Espace : en **fonction de la taille de l'entrée**, jamais en valeur d'exécution : min(n, |Σ|) pour un dictionnaire de caractères, O(h) pour une pile de récursion sur un arbre, O(n) pour un set de vus.

## Exemple fil rouge : Two Sum
nums = [2, 7, 11, 15], target = 9. Squelette : pour i, v dans enumerate(nums) : si target − v dans seen → retour ; seen[v] = i.
- Invariant : à l'entrée du tour i, seen contient exactement {nums[j] : j < i} avec le dernier indice j ; et aucune paire (j, k) avec k < i ne somme à target.
- Variant : n − i, strictement décroissant.
- Conclusion : donc si une paire (j, k), j < k, somme à target, au tour i = k son complément nums[j] est dans seen, donc elle est renvoyée ; et si la boucle finit, l'invariant sur [0:n) dit qu'aucune paire n'existe.
- Complexité : n tours × O(1) par tour (test et insertion dans un dict) = O(n) temps ; espace O(min(n, |valeurs distinctes|)).

## Figure exigée
- **Figure 1 — `SL.trace`** : nums = [2, 7, 11, 15], 4 images : pointeur i, cases marquées = seen, note = « cherche 9 − v », invariant affiché (`inv`) mis à jour à chaque image ; la dernière image surligne la paire. Légende : l'invariant se lit à chaque image, pas seulement à la fin.

## Pièges
- Invariant sans conteneur ni tranche (« on a vu les éléments ») : indémontrable, donc faux.
- Conclusion sur le déroulement (« on a tout parcouru ») : ne dit pas pourquoi le résultat est juste.
- Espace en valeur d'exécution (« 4 entrées ») au lieu de fonction de n.
- Complexité devinée (« O(n) parce que une boucle ») sans le coût du corps : un `in` sur une liste dans la boucle donne O(n²).
- Variant oublié sur un `while` à deux pointeurs : c'est là que les boucles infinies se cachent.

## Résumé
1. Invariant inductif, conteneur nommé, tranche exacte, « exactement ».
2. Variant entier ≥ 0 strictement décroissant.
3. Conclusion par « donc », sur le résultat, = invariant à la sortie.
4. Complexité composée : + hors boucle, × dans la boucle, amortissement justifié ; espace en fonction de n.

**Phrase d'entretien** : « Avant d'écrire, je dis ce qui est vrai à chaque tour, sur quel conteneur et quelle tranche ; ce qui décroît et garantit l'arrêt ; pourquoi l'invariant à la sortie est le résultat ; et je compose la complexité au lieu de la deviner. »

## Chaîne verbalisée
1. Énonce l'invariant de Two Sum. → seen = exactement {nums[j] : j < i} avec indices ; aucune paire avant i.
2. Le variant ? → n − i.
3. La conclusion, en commençant par donc. → Donc au tour k le complément de la paire est dans seen ; donc trouvée ; sinon aucune.
4. La complexité, composée. → n × O(1) = O(n) ; espace min(n, |Σ|).

## Ce qui a cassé pour Salah
- Conclusion sur le déroulement au lieu du résultat ; espace donné en valeur d'exécution (learnings) — les deux règles sont écrites contre ça, avec le contre-exemple en pièges.
- Le TAP est le format de ses drills du mardi (ways-of-working) ; cette sheet en est la référence écrite, pas un nouveau format.

## Exclusions
Pas de preuve formelle par récurrence, pas de notation Θ/Ω, pas de master theorem.
