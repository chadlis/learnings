---
id: c05
series: coding
part: "09"
number: "05"
slug: arbres
title: Arbres
subtitle: récursion sur la structure : ce que renvoie un sous-arbre décide tout
prereq: [c00]
anki: [coding::trees, coding::dfs, coding::bfs]
bridges: []
next: c06
status: ready
---
## Format coding
Blocs, dans cet ordre : **Signal** (les mots de l'énoncé qui appellent le pattern) → **Pattern** (le geste en 3 lignes) → **TAP** : invariant (conteneur nommé, tranche exacte), variant (entier ≥ 0, strictement décroissant), conclusion qui ouvre par « donc » → **Trace** (`SL.trace` sur un exemple de 8 à 12 cases, une frame par itération, l'invariant affiché à chaque frame) → **Complexité** (hors boucle « + », par itération « × », espace en fonction de n ou de |Σ|) → **Pièges Python** → **Cartes « signal → pattern »**. Le **squelette** (structure de boucle et invariant) est donné ; **jamais le code complet** de la solution : Salah l'écrit.


## Signal
« arbre binaire », « profondeur / hauteur », « diamètre », « BST », « par niveaux », « chemin de somme », « symétrique », « ancêtre commun ».

## Pattern
(a) DFS récursif : définir précisément **ce que renvoie l'appel sur un sous-arbre** (hauteur, (hauteur, meilleur diamètre), (min, max) pour un BST…) ; combiner gauche + droite + nœud. (b) BFS par niveaux : file, taille de niveau capturée avant la boucle interne. (c) BST : invariant de bornes (lo, hi) passées à la récursion, pas seulement « gauche < nœud ».

## TAP (hauteur, DFS)
Invariant (récursif) : h(t) renvoie le nombre de nœuds sur le plus long chemin de t à une feuille, 0 si t = None.
Variant : taille du sous-arbre (strictement plus petite dans chaque appel).
Conclusion : h(t) = 1 + max(h(gauche), h(droite)) satisfait la définition, donc h(racine) est la hauteur.
Complexité : O(n) (chaque nœud une fois) ; espace O(h) de pile (O(n) dégénéré).

## Trace exigée
- Arbre dessiné (SVG custom, 7 nœuds), bouton « appel suivant » qui surligne le nœud courant et affiche la valeur renvoyée par chaque sous-arbre (post-ordre) ; readout de la pile de récursion. Puis diamètre : la même trace avec le couple (hauteur, meilleur) renvoyé.
- BFS : la file affichée niveau par niveau.

## Complexité
DFS/BFS O(n) ; espace : pile O(h) vs file O(largeur max).

## Pièges Python
- BST validé avec `gauche.val < nœud.val < droite.val` seulement : faux (un petit-fils peut violer) ⇒ bornes (lo, hi).
- BFS : `for _ in range(len(queue))` capturé **avant** d'enfiler les enfants.
- RecursionError ~1 000 : `sys.setrecursionlimit` ou itératif avec pile explicite.
- Renvoyer deux valeurs (hauteur, diamètre) : un tuple, ou une variable non locale — dire lequel.

## Cartes
« définir ce que renvoie le sous-arbre » ; « BST ⇒ bornes (lo, hi) » ; « BFS : taille du niveau avant la boucle » ; « espace DFS O(h), BFS O(largeur) ».

## Ce qui a cassé pour Salah
- Pas de drill arbres enregistré ; la question « que renvoie l'appel sur un sous-arbre ? » est le geste à installer avant tout code.
