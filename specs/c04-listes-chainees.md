---
id: c04
series: coding
part: "09"
number: "04"
slug: listes-chainees
title: Listes chaînées
subtitle: lent/rapide, inversion en place, tête factice : trois gestes et un invariant sur les pointeurs
prereq: [c00]
anki: [coding::linked-list, coding::signal-pattern]
bridges: []
next: c05
status: stub
---
## Format coding
Blocs, dans cet ordre : **Signal** (les mots de l'énoncé qui appellent le pattern) → **Pattern** (le geste en 3 lignes) → **TAP** : invariant (conteneur nommé, tranche exacte), variant (entier ≥ 0, strictement décroissant), conclusion qui ouvre par « donc » → **Trace** (`SL.trace` sur un exemple de 8 à 12 cases, une frame par itération, l'invariant affiché à chaque frame) → **Complexité** (hors boucle « + », par itération « × », espace en fonction de n ou de |Σ|) → **Pièges Python** → **Cartes « signal → pattern »**. Le **squelette** (structure de boucle et invariant) est donné ; **jamais le code complet** de la solution : Salah l'écrit.


## Signal
« liste chaînée », « milieu », « cycle », « inverser », « fusionner deux listes triées », « k-ième depuis la fin », « en place, O(1) espace ».

## Pattern
(a) Lent/rapide : fast avance de 2, slow de 1 ⇒ milieu, détection de cycle (Floyd), k-ième depuis la fin (décalage de k). (b) Inversion en place : trois pointeurs prev, cur, nxt. (c) Tête factice (dummy) pour éviter les cas particuliers d'insertion/suppression en tête.

## TAP (inversion, 1 → 2 → 3 → 4)
Invariant : prev est la tête de la liste **inversée** des nœuds déjà traités ; cur est le premier nœud non traité ; les deux listes sont disjointes et leur union est la liste initiale.
Variant : nombre de nœuds à partir de cur.
Conclusion : à la sortie cur = None, donc tous les nœuds sont dans la liste inversée de tête prev, donc prev est la réponse.
Complexité : O(n), O(1).

## Trace exigée
- `SL.trace` sur les cases [1, 2, 3, 4] avec pointeurs prev/cur/nxt ; à chaque frame, la « liste inversée » et la « liste restante » en readout.
- Second `trace` : lent/rapide sur [1..7] pour le milieu (frames slow/fast), puis sur une liste avec cycle (cases 1..6, 6 → 3) montrant la rencontre.

## Complexité
Tous O(n) temps, O(1) espace ; c'est le point : pas de tableau auxiliaire.

## Pièges Python
- Sauvegarder `nxt` **avant** de couper `cur.next`.
- Fast : tester `fast and fast.next` avant `fast.next.next`.
- Dummy : renvoyer `dummy.next`, pas `dummy`.
- Vouloir convertir en liste Python : perd le O(1) espace, c'est souvent ce que l'interviewer teste.

## Cartes
« milieu / cycle / k-ième depuis la fin ⇒ lent-rapide » ; « inversion : prev, cur, nxt » ; « dummy head pour la tête » ; « sauver nxt avant de couper ».

## Ce qui a cassé pour Salah
- Aucun drill enregistré ; sheet à lire avant. L'invariant à deux listes disjointes est celui qui rend l'inversion défendable au tableau.
