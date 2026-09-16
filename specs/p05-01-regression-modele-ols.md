---
id: p05-01
series: chain
part: "05"
number: "01"
slug: regression-modele-ols
title: Régression linéaire — le modèle, OLS, R²
subtitle: ISLR ch. 3 — ce que suppose la droite avant de la tracer
prereq: [p02-01, p04-01, p00-02]
anki: [ml::regression-lineaire, ml::ols, ml::r2]
bridges: [b02, b06]
next: p05-02
status: stub
---

## Question de la chaîne
Qu'est-ce qu'une régression linéaire suppose, d'où vient la forme fermée, que valent les coefficients, et pourquoi R² ne peut que monter ?

## Prérequis
- p02-01 : MSE = NLL gaussienne ; OLS = MLE sous bruit gaussien.
- p04-01 : témoin atteignable.
- p00-02 : covariance, variance.

## Hypothèses posées
- H1 : **modèle** Y = β₀ + β₁X + ε avec E[ε | x] = 0 : la moyenne de Y est linéaire en x. C'est une hypothèse, pas une description des données.
- H2 : Var(ε | x) = σ² constante, ε indépendants (pour l'inférence, p01-03).
- H3 : les x sont mesurés sans erreur.

## Exemple fil rouge
Minimal : (1, 1), (2, 2), (3, 2). x̄ = 2, ȳ = 5/3. S_xy = Σ(x − x̄)(y − ȳ) = (−1)(−2/3) + 0 + (1)(1/3) = 1 ; S_xx = 2 ⇒ β̂₁ = 0,5 ; β̂₀ = ȳ − β̂₁x̄ = 5/3 − 1 = 2/3. Ajustés : 7/6, 5/3, 13/6 ; résidus −1/6, 1/3, −1/6 (somme 0). RSS = 1/6 ; TSS = 2/3 ⇒ R² = 0,75.
Réaliste : ISLR Advertising, sales ~ TV : β̂₀ = 7,03, β̂₁ = 0,0475 (« +1 000 $ de TV ⇒ +47,5 unités vendues, en moyenne »), RSE = 3,26, R² = 0,612.

## Pas de la chaîne
1. **Le décor.** Un nuage, une droite. La question n'est pas « quelle droite » mais « qu'est-ce que je suppose en posant une droite ».
2. **Le modèle** [tronc]. Y = β₀ + β₁X + ε. β sont des paramètres fixes inconnus ; ε porte tout ce que x n'explique pas. E[ε | x] = 0 dit que la droite est la **moyenne conditionnelle**. Au tableau : « Poser une droite, c'est poser que la moyenne de Y est affine en x et que tout le reste est un bruit centré, donc les coefficients décrivent la moyenne conditionnelle, pas les points. »
3. **Le critère : carrés ⇒ forme fermée** [tronc]. RSS(β) = Σ(yᵢ − β₀ − β₁xᵢ)². Quadratique en β ⇒ gradient linéaire ⇒ ∇ = 0 est un système linéaire ⇒ solution unique en une résolution (p03-02). Et c'est la NLL gaussienne (p02-01) : OLS = MLE sous ε ~ N(0, σ²). Au tableau : « Le critère est quadratique en β, donc son gradient est linéaire, donc l'annuler est un système linéaire, donc il y a une forme fermée — et ce carré est celui de la gaussienne. »
4. **Les coefficients.** β̂₁ = S_xy/S_xx = Ĉov(x, y)/V̂ar(x) ; β̂₀ = ȳ − β̂₁x̄ (la droite passe par (x̄, ȳ)). Sur le fil rouge : 0,5 et 2/3. Résidus de somme nulle et orthogonaux à x (les deux équations normales). Au tableau : « Annuler la dérivée en β₀ dit que les résidus somment à zéro, donc la droite passe par le point moyen ; annuler celle en β₁ dit que les résidus sont orthogonaux à x, donc β₁ est la covariance sur la variance. »
5. **Lire un coefficient.** β̂₁ = variation de la **moyenne** de Y par unité de x, les autres features fixées (multiple). Pas une causalité. Unités : y-unités par x-unité (47,5 unités pour 1 000 $).
6. **R² et le témoin** [tronc]. R² = 1 − RSS/TSS = part de variance expliquée. Ajouter une feature ne peut pas augmenter RSS (β_nouveau = 0 est atteignable, p04-01) ⇒ R² ne peut que monter, même avec du bruit. D'où R² ajusté, et surtout : évaluer hors échantillon (p06-02). Au tableau : « L'ancien ajustement est atteignable dans le nouvel espace, donc le nouveau minimum de RSS est plus petit ou égal, donc R² monte toujours, donc il ne dit rien sur la valeur d'une feature. »
7. **Multiple, en matrices.** β̂ = (XᵀX)⁻¹Xᵀy ; XᵀX inversible ⇔ colonnes indépendantes (p04-01, p02-02) ; résoudre sur X, pas sur XᵀX (p04-03).
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot`** : les 3 points, la droite, les résidus en segments verticaux, RSS en readout ; `slider` β₁ et β₀ pour voir RSS bouger et son minimum en (0,5 ; 2/3). Légende : le critère est un bol, le minimum est unique.
- **Figure 2 — `plot` + `slider` position d'un 4ᵉ point outlier** (x ∈ [0, 10], y fixe à 8) : droite recalculée, β̂₁ en readout. Légende : un point loin en x a du levier ; les carrés le suivent.
- **Figure 3 — `plot` + bouton « ajouter une feature de bruit »** : R² affiché après chaque ajout (sur 30 points), courbe croissante ; R² sur un test set séparé qui, lui, redescend. Légende : le témoin monte R², le test le contredit.

## Où ça casse
- **Non-linéarité** : E[Y | x] non affine ⇒ résidus structurés ; regarder résidus vs x.
- **Outliers et levier** : un point loin en x tire la droite (figure 2) ; MAE/Huber (p02-01) sont moins sensibles.
- **Colinéarité** : XᵀX singulière ou mal conditionnée ⇒ coefficients instables ; ridge (p02-02).
- **Causalité** : β̂₁ décrit une association conditionnelle, jamais un effet d'intervention.

## Résumé
1. Modèle : Y = β₀ + β₁X + ε, E[ε | x] = 0 ⇒ la droite est la moyenne conditionnelle.
2. Carrés ⇒ gradient linéaire ⇒ forme fermée ; OLS = MLE gaussien.
3. β̂₁ = Ĉov/V̂ar ; β̂₀ = ȳ − β̂₁x̄ ; résidus de somme nulle.
4. Un coefficient = variation de la moyenne par unité, les autres fixés ; pas causal.
5. R² ne peut que monter avec une feature (témoin) ⇒ évaluer hors échantillon.
6. Casse : non-linéarité, levier, colinéarité, causalité.

**Phrase d'entretien** : « Une régression linéaire suppose que la moyenne conditionnelle de Y est affine en x et que le reste est un bruit centré. Le critère des moindres carrés est quadratique, donc son gradient est linéaire et la solution est en forme fermée — c'est le maximum de vraisemblance sous bruit gaussien. La pente vaut covariance sur variance, l'ordonnée fait passer la droite par le point moyen, et R² ne peut que monter quand on ajoute une feature, parce que l'ancien ajustement reste atteignable. »

## Chaîne verbalisée
1. Que suppose Y = β₀ + β₁X + ε ? → Moyenne conditionnelle affine ; ε centré.
2. Pourquoi une forme fermée ? → Critère quadratique ⇒ gradient linéaire ⇒ système linéaire.
3. Que valent β̂₁ et β̂₀ sur (1,1), (2,2), (3,2) ? → 0,5 et 2/3 ; ȳ − β̂₁x̄, pas ȳ.
4. Pourquoi R² monte toujours avec une feature ? → β = 0 atteignable ⇒ RSS min ne peut que baisser.
5. Que casse un point à x = 10 ? → Levier : les carrés suivent le point.

## Ce qui a cassé pour Salah
- Erreur récurrente : **β̂₀ = ȳ** au lieu de ȳ − β̂₁x̄ — le pas 4 la dérive depuis l'équation normale (résidus de somme nulle), et le fil rouge donne 2/3, pas 5/3.
- ISLR ch. 3, le vrai trou : H₀ sur le paramètre, distribution d'échantillonnage — c'est p01-03, pas ici ; pointer.
- Q3 (témoin) réussie : pas 6, une brique.
- Learnings : « unnecessary algebraic expansions » — pas 3 sans développer RSS ; l'argument est « quadratique ⇒ linéaire ».

## Exclusions
Pas d'inférence (t, Student) : p01-03. Pas de leverage/Cook, pas d'interactions, pas de variables qualitatives au-delà d'une mention.
