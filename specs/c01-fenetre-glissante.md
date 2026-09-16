---
id: c01
series: coding
part: "09"
number: "01"
slug: fenetre-glissante
title: Fenêtre glissante
subtitle: fixe → variable → avec budget : une fenêtre qui n'avance que d'un côté à la fois
prereq: [c00]
anki: [coding::sliding-window, coding::signal-pattern]
bridges: []
next: c02
status: ready
---
## Format coding
Blocs, dans cet ordre : **Signal** (les mots de l'énoncé qui appellent le pattern) → **Pattern** (le geste en 3 lignes) → **TAP** : invariant (conteneur nommé, tranche exacte), variant (entier ≥ 0, strictement décroissant), conclusion qui ouvre par « donc » → **Trace** (`SL.trace` sur un exemple de 8 à 12 cases, une frame par itération, l'invariant affiché à chaque frame) → **Complexité** (hors boucle « + », par itération « × », espace en fonction de n ou de |Σ|) → **Pièges Python** → **Cartes « signal → pattern »**. Le **squelette** (structure de boucle et invariant) est donné ; **jamais le code complet** de la solution : Salah l'écrit.


## Signal
« sous-tableau / sous-chaîne **contigu** », « de taille k », « le plus long / le plus court tel que… », « au plus k caractères distincts / remplacements », contrainte **monotone** (agrandir la fenêtre ne peut que rendre la contrainte plus dure à satisfaire).

## Pattern
Deux indices g ≤ d ; d avance toujours ; g avance quand la contrainte casse. Chaque indice avance au plus n fois ⇒ O(n) amorti. Trois étages : fixe (LC 643), variable numérique (LC 209 : somme ≥ s, plus courte), variable avec budget et compteur (LC 424 : remplacer ≤ k caractères, plus longue).

## TAP (LC 209, arr = [2, 3, 1, 2, 4, 3], s = 7)
Invariant (avant de traiter d) : `total` = somme de arr[g : d] ; `best` = longueur minimale d'une fenêtre de somme ≥ s se terminant **avant** d (ancrée à droite) ; et arr[g : d] est la plus longue fenêtre finissant en d dont on n'a pas encore vérifié la contrainte.
Variant : (n − d) + (n − g), strictement décroissant (l'un des deux avance à chaque étape interne).
Conclusion : à la sortie d = n, donc `best` = min sur toutes les fins possibles, donc `best` est la réponse (0 si aucune).
Complexité : chaque indice avance ≤ n fois ⇒ O(n) ; espace O(1).

## Trace exigée
- `SL.trace` sur [2, 3, 1, 2, 4, 3] : frames pour chaque mouvement de d et chaque contraction de g (≈ 10 frames), `win` = [g, d], readouts `total`, `best` ; l'invariant instancié. Résultat 2 (fenêtre [4, 3]).
- Second `trace` court pour LC 424 (« AABABBA », k = 1) avec le compteur de fréquences et la fréquence dominante en readout : montrer que `maxf` **n'est jamais décrémenté** et pourquoi c'est correct (la fenêtre ne rétrécit que si elle ne peut plus battre le meilleur).

## Complexité
Fixe : O(k) + (n − k)·O(1) = O(n). Variable : O(n) amorti. Budget avec compteur sur alphabet borné : espace O(|Σ|) = O(1).

## Pièges Python
- Vérifier la contrainte **avant** d'enregistrer `best` (ordre des deux gestes).
- `while` de contraction, pas `if` : g peut avancer plusieurs fois pour un seul d.
- Fenêtre variable **non monotone** (somme avec négatifs, « exactement k ») : ce n'est plus une fenêtre glissante — préfixes / hashmap (c02/c09).

## Cartes
« contigu + monotone ⇒ fenêtre glissante » ; « chaque indice avance ≤ n fois ⇒ O(n) amorti » ; « maxf jamais décrémenté (424) » ; « négatifs ⇒ pas de fenêtre ».

## Ce qui a cassé pour Salah
- LC 643, 121, 3 tenus ; LC 209 et 424 en file : le spec les prend comme fil rouge pour que la sheet serve avant les drills.
- Maximalité ancrée à droite (25/08) : l'invariant de 209 l'écrit tel quel.
