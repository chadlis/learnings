---
id: c06
series: coding
part: "09"
number: "06"
slug: graphes
title: Graphes — marquer à l'enfilement
subtitle: coding — parcours = frontière + ensemble de vus ; le seul bug qui compte est de marquer trop tard
prereq: [c00]
anki: [coding::graphes, coding::bfs, coding::dfs, coding::topo]
bridges: []
next: c07
status: ready
---
## Signal
Des **relations** entre éléments (voisins, arêtes, cases adjacentes), des **cycles possibles**, des questions de connexité, de composantes, de plus court chemin non pondéré, d'ordre de dépendances. Grille = graphe implicite (4 voisins). Contre-signal : arêtes pondérées (Dijkstra, nommer ; hors périmètre).

## Pattern
Un ensemble **vus** et une **frontière** (file pour BFS, pile ou récursion pour DFS). Règle unique : **marquer vu à l'enfilement**, pas au défilement — sinon un nœud entre plusieurs fois dans la frontière (correct mais quadratique, et faux pour les distances). BFS donne les **distances par niveaux** (non pondéré) ; DFS suffit pour composantes, cycles, ordre topologique.

## Squelette (flood fill / Number of Islands, BFS)
```
pour chaque case (r, c) non vue et à 1 :
    îles += 1 ; file = [(r, c)] ; vu.add((r, c))          # marquer à l'enfilement
    tant que file :
        (x, y) = file.popleft()
        pour (nx, ny) dans les 4 voisins :
            si dans la grille et grille[nx][ny] == 1 et (nx, ny) pas vu :
                vu.add((nx, ny)) ; file.append((nx, ny))
```

## TAP
- **Invariant** : vu = exactement les cases **découvertes** (atteignables depuis la case de départ et déjà rencontrées) ; file = celles de vu dont les voisins n'ont pas encore été examinés (la frontière). Chaque case de vu y entre une fois.
- **Variant** : nombre de cases non vues, entier ≥ 0, strictement décroissant à chaque enfilement ; la boucle interne termine parce que la file ne reçoit que des cases non vues.
- **Conclusion** : donc à file vide, vu est exactement la composante de la case de départ ; donc chaque lancement compte une composante, donc îles = nombre de composantes.
- **Complexité** : chaque case entre au plus une fois, chaque arête examinée deux fois ⇒ O(V + E) = O(R·C) sur une grille. Espace O(R·C) pour vu (ou O(1) en marquant **in-place** dans la grille, si on a le droit de la modifier — le dire).

## Trace (figure 1)
Grille 3 × 4 : [1100 / 0100 / 0011]. Depuis (0,0) : ordre de défilement (0,0), (0,1), (1,1) ; vu = {ces trois} ; île 1 = cases 0, 1, 5 (indices aplatis). Deuxième lancement depuis (2,2) : île 2 = cases 10, 11. Réponse 2. `inv` = « vu = découvertes ; file = frontière ».

## Les variantes, une ligne chacune
- **Distances non pondérées** : BFS ; dist[v] = dist[u] + 1 à l'enfilement ; le premier défilement d'une cible est optimal.
- **Composantes** : compter les lancements.
- **Cycle dans un graphe orienté** : DFS avec trois couleurs (blanc / gris / noir) ; une arête vers un gris = cycle.
- **Ordre topologique** : DFS, empiler à la **sortie** (post-ordre), inverser ; ou Kahn (degrés entrants, file des 0).
- **Bipartition** : BFS en alternant les couleurs ; conflit = pas bipartite.

## Figures exigées
- **Figure 1 — `SL.trace`** : arr = les 12 cases aplaties [1,1,0,0,0,1,0,0,0,0,1,1] (afficher la grille 3×4 en CSS grid si possible, sinon la ligne), `mark` = vu, `win` = la file (frontière), `ptr` = {cur}, 6 images pour l'île 1 puis 3 pour l'île 2, `inv`. Légende : une case entre dans la file une fois, parce qu'elle est marquée en entrant.
- **Figure 2 — `SL.trace`** : le même parcours avec **marquage au défilement** : la file contient (1,1) deux fois ; `note` le montre. Légende : le bug qui ne plante pas.

## Où ça casse
Marquer au défilement : doublons dans la file (quadratique dans le pire cas), et en BFS des distances fausses. Récursion DFS sur une grille 1 000 × 1 000 : RecursionError vers 1 000 niveaux ⇒ pile explicite ou BFS.

## Pièges Python
- `deque` avec `popleft()`, jamais `list.pop(0)` (O(n)).
- Vérifier les bornes de la grille **avant** d'indexer.
- `vu` en set de tuples ou en marquage in-place ; une liste `in` est O(n).
- Ordre topologique : empiler à l'entrée au lieu de la sortie donne un ordre faux sur des DAG non triviaux.

## Résumé
1. Signal : relations, cycles possibles, connexité, distances non pondérées, dépendances.
2. vus + frontière ; **marquer à l'enfilement**.
3. Invariant : vu = découvertes, file = frontière ; variant = non vus ; O(V + E).
4. BFS pour les distances, DFS pour composantes / cycle (trois couleurs) / topo (post-ordre inversé).
5. Récursion limitée ~1 000 : pile explicite.

**Phrase d'entretien** : « Un parcours de graphe, c'est un ensemble de vus et une frontière ; je marque à l'enfilement pour que chaque sommet entre une fois, ce qui donne V plus E. BFS me donne les distances par niveaux, DFS suffit pour les composantes, la détection de cycle à trois couleurs et l'ordre topologique en empilant à la sortie. Sur une grille, la récursion casse vers mille niveaux : pile explicite. »

## Chaîne verbalisée
1. Invariant d'un BFS ? → vu = découvertes ; file = frontière ; chaque sommet entre une fois.
2. Pourquoi marquer à l'enfilement ? → Sinon doublons dans la file : quadratique, distances fausses.
3. Complexité et pourquoi ? → O(V + E) : chaque sommet une fois, chaque arête deux fois.
4. Ordre topologique par DFS ? → Empiler à la sortie, inverser.
5. Cycle orienté ? → Trois couleurs ; arête vers un gris.

## Ce qui a cassé pour Salah
- Famille t09 : « marquer à l'enfilement, deque, RecursionError ~1 000, in-place vs set, distances par niveaux, tri topologique en DFS simple » — la figure 2 (le bug qui ne plante pas) est ce que Q/A ne montrait pas.
