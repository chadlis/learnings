---
id: b03
series: bridge
part: "B"
number: "03"
slug: biais-variance-partout
title: Biais et variance partout
subtitle: pont — le même compromis à sept échelles : estimateur, modèle, estimation de l'erreur, ensembles, pénalité, prior, boosting
prereq: [p06-01, p01-01, p06-02, p07-02, p05-03, p02-03]
anki: [ml::biais-variance, stats::estimation, ml::validation, ml::regularisation]
bridges: []
next: b04
status: built
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
- On ne voit qu'un tirage : biais et variance sont des propriétés **sur les répétitions** (p01-01 pas 3 et 9) ; sur un seul jeu on ne les observe pas séparément, on observe leur somme.
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

## Exemple fil rouge (vérifié)
`n` = 16 mesures, `σ` = 4, vraie valeur `μ` = 1 ⇒ SE = 1, Var(x̄) = 1.
Estimateur rétréci `θ̂_λ = x̄/(1+λ)` : biais = −λ/(1+λ), variance = 1/(1+λ)².
λ* = Var(x̄)/μ² = 1, erreur quadratique 0,5 — moitié de celle de x̄. Traductions du
même λ* : pénalité ridge `λ_r = nλ` = 16 ; prior gaussien `τ² = (σ²/n)/λ` = 1.
Chiffres des autres échelles, tous recalculés : Bessel `n` = 25 (MSE 0,0833 / 0,0784 /
0,0769 pour les diviseurs n−1, n, n+1) ; kNN sur 50 points, f = sin(πx), σ = 0,5
(minimum du U à k = 7, somme 0,0442) ; k-fold n = 1 000, p = 20 (surestimation
+2,0 % à k = 2, +0,49 % à k = 5) ; forêt ρσ² + (1−ρ)σ²/B (0,3014 à ρ = 0,3, B = 500).

## Questions pour la revue
- **`p01-01 pas 8` corrigé en `pas 3 et 9`.** Le pas 8 de p01-01 est « La forme : TCL » ;
  « biais et variance vivent sur les répétitions » est porté par le pas 3 (la distribution
  d'échantillonnage) et le pas 9 (le SE décrit la procédure). La sheet pointe vers ces deux-là.
- **Six ou sept échelles — tranché en revue 4** : sept. Le sous-titre, le chapeau et le
  titre de section de la sheet annoncent désormais sept échelles, boosting compris, en
  accord avec les sept lignes de la table du pas 2.
- **`n` et `B` ne sont pas des boutons d'arbitrage.** Le résumé annonce « sept boutons, un
  seul U : n, flexibilité, k-fold, B, λ, τ², ν ». Or `n` baisse la variance sans monter le
  biais, et `B` fait de même jusqu'au plancher `ρσ²` : aucun des deux ne produit un U. La
  sheet les nomme « deux intrus utiles » et met à leur place le **diviseur** (Bessel) et **m**
  (features par split), qui, eux, arbitrent. Les sept boutons de la figure sont donc :
  souplesse, degré, 1/k, profondeur, 1/λ, τ², ν·arbres. **Validé en revue 4.**
- **La décomposition est quadratique.** Elle n'a pas d'équivalent additif pour la 0/1 loss ;
  la sheet le pose en H1 et le redit en limite 4. **Validé en revue 4** : bon niveau de détail.
