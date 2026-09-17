---
id: b03
series: bridge
part: "B"
number: "03"
slug: biais-variance-partout
title: Biais et variance partout
subtitle: pont — le même compromis à six échelles : estimateur, modèle, estimation de l'erreur, ensembles, pénalité, prior
prereq: [p06-01, p01-01, p06-02, p07-02, p05-03, p02-03]
anki: [ml::biais-variance, stats::estimation, ml::validation, ml::regularisation]
bridges: []
next: b04
status: ready
---
## Le mécanisme
Une quantité estimée sur un tirage a un centre (biais = écart entre la moyenne sur les tirages et la vérité) et une largeur (variance). Erreur quadratique = biais² + variance (+ bruit irréductible). Presque tout réglage en ML déplace l'un contre l'autre ; l'erreur totale est en U.

## La table
| échelle | ce qui est estimé | le bouton | vers le biais | vers la variance | où |
|---|---|---|---|---|---|
| Estimateur | une moyenne, une proportion, σ² | n ; Bessel (n − 1) | σ̂² sans Bessel : biaisé vers le bas | SE = σ/√n | p01-01 pas 4–5 ; p01-03 pas 3 |
| Modèle | f̂ sur un dataset tiré | flexibilité (degré, profondeur, k de kNN) | modèle rigide | modèle souple, dépend du tirage | p06-01 |
| Estimation de l'erreur | l'erreur test | k dans k-fold | k petit : modèles entraînés sur moins de données ⇒ erreur surestimée | LOOCV : modèles quasi identiques, moyenne corrélée (b04) | p06-02 |
| Ensembles | une prédiction moyennée | B, m (features par split) | bagging ne change pas le biais | ρσ² + (1 − ρ)σ²/B | p07-02 |
| Pénalité | β̂ | λ | λ grand : coefficients tirés vers 0 | λ petit : β̂ suit le bruit | p05-03 ; p02-02 |
| Prior | posterior | τ² (largeur du prior), n | prior étroit + n petit : le prior décide | prior plat : MLE, variance pleine | p02-03 pas 5 |
| Boosting | F | ν, nombre d'arbres, profondeur | arbres peu profonds | trop d'arbres | p07-03 |

## Figure exigée
- **Figure 1 — `plot` + `slider` « rigidité »** : les courbes biais², variance, et leur somme + bruit, en fonction d'un axe abstrait ; boutons qui renomment l'axe (« degré du polynôme », « 1/λ », « 1/k voisins », « profondeur », « τ² ») sans changer les courbes. Readout du minimum. Légende : un seul U, sept boutons.

## Ce qui casse partout de la même façon
- On ne voit qu'un tirage : biais et variance sont des propriétés **sur les répétitions** (p01-01 pas 8) ; sur un seul jeu on ne les observe pas séparément, on observe leur somme.
- Réduire la variance en moyennant ne marche que si les termes ne sont pas trop corrélés (b04).
- Le plancher σ² ne se voit pas dans les résidus (p06-01).

## Résumé
1. Erreur = biais² + variance + bruit ; tout réglage déplace l'un contre l'autre.
2. Sept boutons, un seul U : n, flexibilité, k-fold, B, λ, τ², ν.
3. Biais et variance vivent sur les répétitions ; un tirage ne montre que leur somme.

**Phrase d'entretien** : « Biais et variance, c'est le centre et la largeur d'un estimateur sur des tirages répétés, et tout ce qu'on règle en ML — la flexibilité, λ, le nombre de folds, le nombre d'arbres, la largeur d'un prior — déplace l'un contre l'autre. L'erreur totale est en U et le seul moyen de la voir est un jeu de données que le réglage n'a pas touché. »

## Chaîne verbalisée
1. Définis biais et variance sur un estimateur. → Centre − vérité ; largeur ; sur les tirages.
2. Même argument, autre habit : que fait λ ? → Biais vers 0 contre variance.
3. Et k dans k-fold ? → k petit : biais (moins de données) ; LOOCV : variance (modèles corrélés).
4. Et le bagging ? → Variance seule ; biais inchangé.

## Ce qui a cassé pour Salah
- Q10 (biais-variance) et la chaîne « un objet aléatoire » : ce pont doit répéter que le tirage est le dataset entier (p06-01), pas une ligne.
