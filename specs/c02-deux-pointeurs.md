---
id: c02
series: coding
part: "09"
number: "02"
slug: deux-pointeurs
title: Deux pointeurs
subtitle: trié ⇒ une comparaison élimine une classe entière de candidats
prereq: [c00]
anki: [coding::two-pointers, coding::signal-pattern]
bridges: []
next: c03
status: ready
---
## Format coding
Blocs, dans cet ordre : **Signal** (les mots de l'énoncé qui appellent le pattern) → **Pattern** (le geste en 3 lignes) → **TAP** : invariant (conteneur nommé, tranche exacte), variant (entier ≥ 0, strictement décroissant), conclusion qui ouvre par « donc » → **Trace** (`SL.trace` sur un exemple de 8 à 12 cases, une frame par itération, l'invariant affiché à chaque frame) → **Complexité** (hors boucle « + », par itération « × », espace en fonction de n ou de |Σ|) → **Pièges Python** → **Cartes « signal → pattern »**. Le **squelette** (structure de boucle et invariant) est donné ; **jamais le code complet** de la solution : Salah l'écrit.


## Signal
« trié », « paire / triplet dont la somme… », « palindrome », « conteneur d'eau », « en place », deux extrémités qui se rapprochent.

## Pattern
i au début, j à la fin ; comparer ; avancer celui dont le déplacement est **le seul qui peut améliorer** ; la comparaison élimine d'un coup tous les candidats qui contenaient l'indice abandonné. LC 167 (2Sum sur trié) ; LC 15 (3Sum = tri + 2Sum II avec saut des doublons) ; LC 11 (sans tri : majorer les deux facteurs).

## TAP (LC 167, arr = [1, 2, 4, 6, 8, 11, 15], cible = 12)
Invariant : la paire cherchée, si elle existe, a ses deux indices dans [i, j] (toutes les paires exclues ont été prouvées impossibles).
Variant : j − i, strictement décroissant.
Conclusion : si arr[i] + arr[j] = cible on renvoie (i, j) ; sinon à la sortie i = j, donc aucune paire n'est dans [i, j], donc aucune paire n'existe.
Complexité : O(n) ; espace O(1).

## Trace exigée
- `SL.trace` sur [1, 2, 4, 6, 8, 11, 15], cible 12 : frames (i, j) = (0, 6) somme 16 > 12 ⇒ j−− ; (0, 5) 12 ⇒ trouvé. Un second chemin, cible 10 : (0,6) 16 ⇒ j ; (0,5) 12 ⇒ j ; (0,4) 9 ⇒ i ; (1,4) 10 trouvé. Readout à chaque frame : « éliminés : toutes les paires contenant l'indice j = 6 ».
- Second `trace` pour LC 11 ([1, 8, 6, 2, 5, 4, 8, 3, 7]) : readout aire, et la justification du mouvement : « on bouge la plus petite hauteur, donc toute paire avec elle et un indice intérieur serait ≤ (largeur plus petite × hauteur ≤ la petite) ».

## Complexité
2Sum II : O(n). 3Sum : tri O(n log n) + n × 2Sum O(n) = O(n²) (le « + » et le « × » de c00). Espace : O(1) hors sortie.

## Pièges Python
- 3Sum : sauter les doublons sur **les trois** indices (`while` après un match), sinon triplets répétés.
- Bouger le mauvais pointeur (LC 11) : bouger la plus grande hauteur ne peut jamais aider.
- Confondre avec fenêtre glissante : ici les pointeurs partent des **deux bouts**.

## Cartes
« trié + paire ⇒ deux pointeurs, O(n) » ; « 3Sum = tri + 2Sum II, O(n²) » ; « LC 11 : bouger la plus petite hauteur » ; « doublons : while sur les trois ».

## Ce qui a cassé pour Salah
- LC 125, 167, 15 tenus ; **LC 11 jamais traité** : c'est le fil rouge secondaire, avec l'argument de majoration écrit.
