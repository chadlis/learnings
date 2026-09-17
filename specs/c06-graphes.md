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
status: reviewed
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
Grille 3 × 4 : **[1100 / 1100 / 0011]** (corrigé, voir « Questions pour la revue »).
Voisins dans l'ordre haut, bas, gauche, droite. Depuis (0,0) : ordre de défilement
(0,0), (1,0), (0,1), (1,1) ; île 1 = cases **0, 4, 1, 5** (indices aplatis, dans l'ordre
de défilement). Deuxième lancement depuis (2,2) : île 2 = cases 10, 11. Réponse 2.
`inv` = « vu = découvertes ; file = frontière ».

## Les variantes, une ligne chacune
- **Distances non pondérées** : BFS ; dist[v] = dist[u] + 1 à l'enfilement ; le premier défilement d'une cible est optimal.
- **Composantes** : compter les lancements.
- **Cycle dans un graphe orienté** : DFS avec trois couleurs (blanc / gris / noir) ; une arête vers un gris = cycle.
- **Ordre topologique** : DFS, empiler à la **sortie** (post-ordre), inverser ; ou Kahn (degrés entrants, file des 0).
- **Bipartition** : BFS en alternant les couleurs ; conflit = pas bipartite.

## Figures exigées
- **Figure 1 — `SL.trace`** : arr = les 12 cases aplaties [1,1,0,0,1,1,0,0,0,0,1,1] (afficher la grille 3×4 en CSS grid si possible, sinon la ligne), `mark` = vu, `win` = la file (frontière), `ptr` = {cur}, 6 images pour l'île 1 puis 3 pour l'île 2, `inv`. Légende : une case entre dans la file une fois, parce qu'elle est marquée en entrant.
- **Figure 2 — `SL.trace`** : le même parcours avec **marquage au défilement** : la file contient (1,1) deux fois ; `note` le montre. Légende : le bug qui ne plante pas.

## Où ça casse
Marquer au défilement : doublons dans la file — la file grossit comme **E** et non comme
**V**, donc ×2 sur une grille mais ×250 sur K₅₀₀ ; « quadratique » ne vaut que sur un
graphe dense (voir « Questions pour la revue »). Et en BFS des distances fausses (39,4 %
de graphes aléatoires). Récursion DFS sur une grille 1 000 × 1 000 : RecursionError vers 1 000 niveaux ⇒ pile explicite ou BFS.

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

## Questions pour la revue

*Revue 7, 17/09 — **validé 17/09**, les deux points ; le fil rouge corrigé fait désormais foi. Arbitrage en fin de fiche.*

Deux chiffres du spec ont été corrigés après vérification par script (scripts jetables,
non versionnés ; tous les résultats ci-dessous sont reproductibles en quelques lignes).

1. **La grille du fil rouge rendait la figure 2 impossible.** Avec `[1100 / 0100 / 0011]`,
   l'île 1 est un **chemin** — 0 – 1 – 5 — et aucune case n'a deux voisins simultanément
   dans la frontière. Le marquage au défilement y produit alors **zéro doublon** : la
   version fautive trace exactement la même course que la bonne, et la figure 2 (« la file
   contient (1,1) deux fois ») n'a pas d'objet. Corrigé en `[1100 / 1100 / 0011]` : l'île 1
   devient le carré `{0, 1, 4, 5}`, la case 5 a bien deux voisins découverts (1 et 4), et
   la file passe par `[5, 5]`. Bonus : le compte d'images du spec tombe alors juste au
   premier coup — **6** images pour l'île 1 (init + 4 défilements + bilan) et **3** pour
   l'île 2, exactement ce que le spec exigeait. C'est ce qui fait penser à une coquille de
   saisie plutôt qu'à un choix.
   *À valider* : la grille corrigée reste un 3 × 4 à 2 îles, mais l'île 1 a 4 cases au lieu
   de 3 — si le fil rouge a été partagé ailleurs (Anki), il faut le resynchroniser.

2. **« Quadratique dans le pire cas » est vrai, mais pas sur une grille.** Le marquage au
   défilement fait entrer un sommet une fois **par arête entrante** : la file suit E, pas V.
   Sur une grille E ≈ 2V, donc le surcoût n'est que d'un facteur 2 (mesuré : grille pleine
   300 × 300, 179 400 enfilements au lieu de 90 000, file max 599 au lieu de 300). C'est sur
   un graphe **dense** que c'est quadratique (mesuré : K₅₀₀, 124 751 enfilements au lieu de
   500 — ×250, file max 124 252). La sheet dit les deux chiffres plutôt que le seul mot.

Chiffres mesurés et repris dans la sheet, pour mémoire : distances fausses avec marquage au
défilement **39,4 %** de 20 000 graphes aléatoires, plus petit témoin = le **triangle** ;
ordre topologique par pré-ordre faux dans **80,5 %** de 50 000 DAG (0 par post-ordre
inversé), plus petit témoin A→B, A→C, C→B ; trois couleurs contre Kahn **0 désaccord** sur
50 000 graphes orientés ; `RecursionError` à **998** appels avec la limite par défaut 1 000
(dernier passage à 997) — cohérent avec c05 ; `list.pop(0)` contre `deque.popleft()` sur
200 000 éléments, **3,5 s contre 0,011 s**, facteur **334**.

**Arbitrage de revue 7, 17/09 — validé 17/09.** Le **fil rouge de la sheet est adopté
dans le spec** : la grille est `[1100 / 1100 / 0011]`, l'île 1 est le carré
`{0, 1, 4, 5}` à **4 cases**, et c'est cette grille qui fait foi partout — le spec, la
sheet et toute carte Anki qui la reprendrait. La grille `[1100 / 0100 / 0011]` était
une coquille : elle rendait la figure 2 sans objet. La **nuance sur « quadratique »**
(×2 sur une grille, ×250 sur un graphe dense) est **gardée** : les deux chiffres valent
mieux que le seul mot.
