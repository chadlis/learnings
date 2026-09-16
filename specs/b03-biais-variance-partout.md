---
id: b03
series: bridge
part: "B"
number: "03"
slug: biais-variance-partout
title: Biais et variance partout
subtitle: le même trade-off à six échelles : estimateur, modèle, estimation d'erreur, ensembles, régularisation, prior
prereq: [p01-01, p06-01, p06-02, p07-02, p05-03, p02-03]
anki: [ml::biais-variance, stats::estimation]
bridges: []
next: 
status: ready
---
## Format bridge
Une seule figure (le mécanisme), puis une ligne par domaine : règle | où on l'a vue (lien vers le pas exact) | ce qui change. Résumé en 3 lignes, phrase d'entretien, chaîne verbalisée de 4 maillons « même argument, autre habit ». Pas de chaîne numérotée longue : le pont relie, il ne redémontre pas.


## Le mécanisme
Une quantité estimée sur un tirage a un **centre** (écart au vrai = biais) et une **largeur** (dispersion sur les tirages = variance). Erreur quadratique = biais² + variance. Presque tous les boutons du ML déplacent le point sur cette somme ; presque aucun ne fait baisser les deux.

## Les habits
| échelle | ce qui est estimé | le bouton | biais ↔ variance | où on l'a vu |
|---|---|---|---|---|
| estimateur | σ² par RSS/(n − p) | diviser par n ou n − p | /n biaisé vers le bas, /(n − p) sans biais, un peu plus large | p01-03 pas 3 |
| modèle | f̂(x) | complexité d | d ↑ : biais ↓, variance ↑ ⇒ U | p06-01 pas 5 |
| estimation d'erreur | erreur test | k dans k-fold | k = n : biais ≈ 0, variance haute (modèles corrélés) ; k = 5 : petit biais, variance basse | p06-02 pas 3–4 |
| ensembles | prédiction | B et ρ (bagging/RF) | biais inchangé, variance ρσ² + (1 − ρ)σ²/B ; boosting : biais ↓ | p07-02 pas 2–4, p07-03 pas 4 |
| régularisation | β̂ | λ | biais linéaire en λ, variance en carré du facteur ⇒ creux à λ > 0 | p05-03 pas 3–4 |
| prior | posterior | τ² (force du prior) | prior étroit : biais vers 0, variance faible ; n grand : le prior est noyé | p02-02 pas 3, p02-03 pas 5 |

Ce qui change : l'objet (un nombre, une fonction, une erreur). Ce qui ne change pas : le tirage est la source de la variance (dataset, test set, rééchantillon), et « plus de données » réduit la variance sans toucher au biais.

## Figure exigée
- **`plot` + `slider` unique « rigidité »** ∈ [0, 1] : biais² (croissant), variance (décroissant), somme (U) ; presets qui renomment l'axe (« degré d inversé », « λ », « 1/τ² », « profondeur inversée ») sans changer les courbes. Légende : la même courbe en U, six axes différents.

## Où le pont casse
- **Bagging** ne suit pas le trade-off : il baisse la variance sans monter le biais (moyenne d'estimateurs de même loi). C'est l'exception qui explique son succès.
- **Le bruit σ²** est hors du trade-off : aucun bouton ne le touche.
- Pour une loss non quadratique (0/1), la décomposition n'est pas additive ; l'intuition tient, la formule non.

## Résumé
1. Erreur = biais² + variance ; la variance vient du tirage.
2. Complexité, k, λ, τ², profondeur : un bouton, deux termes en sens contraires ⇒ U.
3. Exceptions : bagging (variance seule), données (variance seule), bruit (aucun).

**Phrase d'entretien** : « Presque chaque réglage — la complexité d'un modèle, le nombre de plis d'une validation croisée, la force d'une pénalité ou d'un prior, la profondeur d'un arbre — déplace un point sur la somme biais carré plus variance, et le bon réglage est au creux. Les seules manières de faire baisser la variance sans payer en biais sont d'avoir plus de données ou de moyenner des modèles de même loi, ce que fait le bagging. »

## Chaîne verbalisée
1. Pourquoi LOOCV a peu de biais et beaucoup de variance ? → Modèles sur n − 1 ; erreurs corrélées.
2. Pourquoi le meilleur λ est > 0 ? → Variance en carré, biais linéaire.
3. Qu'est-ce que le bagging fait d'inhabituel ? → Variance ↓ sans biais ↑.
4. Qu'est-ce qu'aucun bouton ne touche ? → σ², le bruit.
