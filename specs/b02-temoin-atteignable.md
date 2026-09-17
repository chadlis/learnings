---
id: b02
series: bridge
part: "B"
number: "02"
slug: temoin-atteignable
title: Le témoin atteignable
subtitle: pont — majorer un minimum par un point qu'on peut exhiber ; pourquoi « choisir le meilleur » ne peut que monter
prereq: [p04-01, p01-04, p05-01, p07-02]
anki: [algebre::temoin, stats::multiplicite, ml::validation]
bridges: []
next: b03
status: ready
---
## Le mécanisme
Pour montrer que min_{S'} f ≤ min_S f quand S ⊂ S', il suffit d'un **témoin** : un point de S' qui vaut l'ancien optimum. Le minimum sur un ensemble plus grand ne peut pas monter. Version bruitée : le maximum de k tirages bruités est **biaisé vers le haut** — choisir le plus haut, c'est choisir aussi sa chance.

## La table
| lieu | l'ensemble qui grandit | le témoin | conséquence | où |
|---|---|---|---|---|
| R² et RSS | les modèles avec une variable de plus | β_nouveau = 0 | RSS ne monte jamais, R² ne baisse jamais ⇒ R² ne juge pas l'ajout | p04-01 pas 8 ; p05-01 |
| Erreur train | un modèle plus flexible (degré, profondeur) | l'ancien modèle est dans le nouveau | l'erreur train décroît toujours ⇒ elle ne mesure pas | p06-01 |
| Biais du max | k configurations comparées sur le même test set | le gagnant contient la chance qui l'a fait gagner | score du meilleur ≈ vrai + SE·E[max_k] | p01-04 pas 6 ; w01-03 (D3) |
| Tuning sur le test | le test set utilisé pour choisir | même chose | le test ne mesure plus ⇒ train / validation / test | p01-04 pas 7 |
| OOB vs test | les arbres qui n'ont pas vu la ligne | l'OOB est un test « gratuit » mais chaque ligne n'est jugée que par ~37 % des arbres | OOB légèrement pessimiste, valide ; un test tuné ne l'est pas | p07-02 ; p01-05 pas 4 |

## Figure exigée
- **Figure 1 — `repeat`** : draw = max de k tirages N(0, 1), `slider` k ∈ {1, 2, 5, 10, 40, 100} ; marque 0 ; readout de la moyenne mesurée vs E[max_k] tabulé (0 ; 0,56 ; 1,16 ; 1,54 ; 2,16 ; 2,51). Légende : le max de variables centrées n'est pas centré — et il monte en log k.

## Ce qui casse partout de la même façon
- On lit le score du gagnant comme sa valeur ⇒ surestimation ; la seule parade est un jeu de données que le choix n'a pas touché.
- Un critère qui ne peut que s'améliorer avec la taille de l'ensemble (R², erreur train) ne compare pas des ensembles de tailles différentes ; il faut pénaliser (AIC, R² ajusté — nommer) ou valider.

## Résumé
1. Ensemble plus grand ⇒ minimum plus bas ; il suffit d'exhiber un témoin.
2. Bruité : le max de k tirages est biaisé de ≈ SE·E[max_k] ; choisir = capter la chance.
3. Conséquence unique : ce qui a servi à choisir ne mesure plus.

**Phrase d'entretien** : « Élargir l'espace ne peut jamais faire monter un minimum, il suffit d'un témoin — c'est pourquoi le R² et l'erreur train ne jugent pas un ajout. Et le score du meilleur de k essais bruités surestime sa valeur, parce qu'il a été choisi pour sa chance : ce qui a servi à choisir ne mesure plus. »

## Chaîne verbalisée
1. Pourquoi R² ne baisse jamais en ajoutant une variable ? → Témoin β = 0.
2. Même argument, autre habit : pourquoi l'erreur train décroît avec la flexibilité ? → L'ancien modèle est dans le nouveau.
3. Version bruitée : pourquoi le meilleur de 40 configs surestime ? → Max de tirages bruités, +2 SE.
4. Que change-t-on au protocole ? → Choisir sur validation, mesurer sur test, une fois.

## Ce qui a cassé pour Salah
- Q3 réussie, Q14.2 (multiplicité) ratée le 10/09, D3 « pas compris » à la première tentative : ce pont relie les deux par le même mot, **témoin**, sans redémontrer Φᵏ.
