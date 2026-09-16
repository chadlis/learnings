---
id: c06
series: coding
part: "09"
number: "06"
slug: graphes
title: Graphes
subtitle: flood fill, BFS/DFS, marquer à l'enfilement, niveaux = distances, tri topologique
prereq: [c00]
anki: [coding::graphs, coding::bfs, coding::dfs, coding::topological-sort]
bridges: []
next: c07
status: stub
---
## Format coding
Blocs, dans cet ordre : **Signal** (les mots de l'énoncé qui appellent le pattern) → **Pattern** (le geste en 3 lignes) → **TAP** : invariant (conteneur nommé, tranche exacte), variant (entier ≥ 0, strictement décroissant), conclusion qui ouvre par « donc » → **Trace** (`SL.trace` sur un exemple de 8 à 12 cases, une frame par itération, l'invariant affiché à chaque frame) → **Complexité** (hors boucle « + », par itération « × », espace en fonction de n ou de |Σ|) → **Pièges Python** → **Cartes « signal → pattern »**. Le **squelette** (structure de boucle et invariant) est donné ; **jamais le code complet** de la solution : Salah l'écrit.


## Signal
« grille », « îles / régions / composantes », « plus court chemin sans poids », « peut-on atteindre », « dépendances / prérequis / ordre », « voisins ».

## Pattern
(a) Flood fill / composantes : DFS ou BFS depuis chaque case non visitée ; compter les départs. (b) BFS pour les distances non pondérées : niveau = distance ; **marquer visité à l'enfilement**, pas au défilement (sinon doublons dans la file). (c) Tri topologique : DFS post-ordre inversé, ou Kahn (degrés entrants + file). Grille : 4 voisins par deltas ; `visited` = set de tuples ou marquage in-place.

## TAP (nombre d'îles, BFS)
Invariant (boucle externe sur les cases) : `count` = nombre de composantes dont au moins une case est **avant** la case courante en ordre de lecture ; toute case de ces composantes est marquée visitée.
Variant : nombre de cases non encore parcourues par la boucle externe.
Conclusion : à la sortie, donc toute composante a une première case, donc a été comptée exactement une fois (la première fois qu'on l'atteint elle est non visitée ; ensuite toutes ses cases sont marquées), donc `count` est la réponse.
Complexité : chaque case enfilée au plus une fois ⇒ O(R·C) ; espace O(R·C) (visited + file).

## Trace exigée
- `SL.trace` adapté à une grille 4×5 (le spec autorise un SVG custom : cases, file dessinée, marquage à l'enfilement coloré) ; frames par défilement ; readout `count` et taille de la file. Montrer explicitement une frame où marquer au défilement mettrait un doublon dans la file.
- Tri topologique (Kahn) sur 6 nœuds : degrés entrants affichés, file, ordre produit ; détection de cycle (file vide, nœuds restants).

## Complexité
O(V + E) ; grille O(R·C). Espace : visited + file/pile. RecursionError ~1 000 en DFS récursif sur une grande grille ⇒ itératif.

## Pièges Python
- `visited` : set de tuples `(r, c)`, jamais de listes (non hashables) ; in-place (`grid[r][c] = '0'`) si on peut modifier l'entrée — le dire.
- `deque` pour la file (`popleft` O(1)), pas `list.pop(0)`.
- Bornes : tester `0 ≤ r < R` avant d'accéder.
- BFS distances : ne pas relâcher comme Dijkstra ; un nœud vu une fois a sa distance finale.

## Cartes
« composantes ⇒ compter les départs de DFS/BFS » ; « BFS niveaux = distances ; marquer à l'enfilement » ; « deque, set de tuples, bornes » ; « topo = post-ordre inversé ou Kahn ; cycle si nœuds restants ».

## Ce qui a cassé pour Salah
- Diagnostic : graphes N1–N2, « intuition flood fill présente, traduction en code défaillante, concept de marquage visité absent » (clos le 20/07 par drill) — la trace doit montrer la frame du doublon (marquage au défilement) pour que le geste reste ancré.
- Gap prioritaire n°2 : sheet à relire avant chaque drill graphes.
