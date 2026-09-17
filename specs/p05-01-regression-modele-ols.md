---
id: p05-01
series: chain
part: "05"
number: "01"
slug: regression-modele-ols
title: Régression linéaire — le modèle, OLS, ce que R² ne dit pas
subtitle: modèles linéaires — une hypothèse sur y sachant x, des carrés parce que gaussien, une forme fermée parce que linéaire
prereq: [p02-01, p04-01, p00-02]
anki: [ml::regression-lineaire, ml::ols, ml::r2, stats::residus]
bridges: [b06, b02]
next: p05-02
status: built
---

## Question de la chaîne
Qu'est-ce que « Y = β₀ + β₁X + ε » suppose exactement, pourquoi les moindres carrés et pas autre chose, d'où sort la forme fermée, et pourquoi R² monte toujours ?

## Prérequis
- p02-01 : bruit gaussien ⇒ MSE (les six pas) ; MSE estime la moyenne conditionnelle.
- p04-01 : Ax = b, colonnes, témoin atteignable.
- p00-02 : covariance, variance.

## Hypothèses posées
- H1 : **linéarité en β** : E[Y | x] = β₀ + β₁x (les x peuvent être transformés : x², log x — c'est toujours linéaire en β).
- H2 : E[ε | x] = 0 : le bruit est centré quel que soit x — c'est ce qui rend β̂ sans biais.
- H3 : Var(ε | x) = σ² (homoscédastique) et ε indépendants : nécessaires pour les **SE** (p01-03), pas pour β̂.
- H4 : ε gaussien : nécessaire pour que OLS = MLE et pour le Student exact ; pas pour le non-biais.

## Exemple fil rouge
Cinq points : x = (1, 2, 3, 4, 5), y = (2, 4, 5, 4, 5). x̄ = 3, ȳ = 4. S_xy = Σ(xᵢ − x̄)(yᵢ − ȳ) = 6 ; S_xx = 10. β̂₁ = 0,6 ; β̂₀ = ȳ − β̂₁x̄ = 2,2. Prédictions 2,8 ; 3,4 ; 4 ; 4,6 ; 5,2 ; résidus −0,8 ; 0,6 ; 1 ; −0,6 ; −0,2 (somme 0). RSS = 2,4 ; TSS = 6 ; R² = 0,6.
Un outlier : y₅ = 15 au lieu de 5 → ȳ = 6, S_xy = 26, β̂₁ = 2,6 : un point sur cinq a multiplié la pente par plus de quatre (2,6/0,6 = 4,33). Même écart porté par le point du centre (y₃ = 15, levier w = 0) : β̂₁ reste à 0,6, seul β̂₀ passe de 2,2 à 4,2.
ISLR Advertising, `sales ~ TV` : β̂₀ = 7,03, β̂₁ = 0,0475, RSE = 3,26, R² = 0,61 (n = 200) ; SE(β̂₁) = 0,0027. Budget TV en **milliers de dollars**, ventes en milliers d’unités.

## Pas de la chaîne
1. **Le décor.** Un nuage, une droite. La question n'est pas « quelle droite » mais « que suppose-t-on pour qu'une droite soit la bonne réponse, et laquelle ».
2. **Le modèle est une hypothèse sur y sachant x** [tronc]. Y = β₀ + β₁X + ε dit : la moyenne de Y à x fixé est affine en x (H1), et ce qui reste est un bruit centré (H2). Rien sur la loi de X. Au tableau : « Le modèle pose la moyenne conditionnelle affine et un bruit centré, donc il ne parle que de Y sachant X, donc les x peuvent être quelconques et même transformés. »
3. **Pourquoi des carrés** (p02-01). Bruit gaussien ⇒ la NLL est Σ(yᵢ − β₀ − β₁xᵢ)² : OLS = MLE. Bruit de Laplace donnerait Σ|·| (médiane conditionnelle, robuste aux outliers). Les carrés sont une conséquence de H4, pas un choix esthétique.
4. **La forme fermée** [tronc]. ∂RSS/∂β = 0 est linéaire en β (b06) : β̂₁ = S_xy/S_xx = Ĉov(x, y)/V̂ar(x), β̂₀ = ȳ − β̂₁x̄. La droite passe par (x̄, ȳ) ; la pente est « covariance sur variance ». En matriciel : β̂ = (XᵀX)⁻¹Xᵀy, à calculer par QR (p04-03). Au tableau : « Annuler le gradient d'une somme de carrés donne des équations linéaires en β, donc on résout d'un coup, donc la pente est la covariance sur la variance et l'intercept fait passer la droite par le centre du nuage. »
5. **Les résidus ont une structure.** Σrᵢ = 0 et Σrᵢxᵢ = 0 (les deux équations normales) : les résidus sont orthogonaux aux colonnes de X ; ŷ est la **projection** de y sur l'espace des colonnes. C'est ce qui coûte p degrés de liberté (p01-03).
6. **Les carrés amplifient les outliers.** β̂ est **linéaire** en y : ∂β̂₁/∂yᵢ = (xᵢ − x̄)/S_xx, c’est le levier qui fixe l’influence ; le carré, lui, fait que la droite paie cher de laisser un résidu grand. y₅ = 15 (bord, w = 0,2) fait passer la pente de 0,6 à 2,6 ; y₃ = 15 (centre, w = 0) ne la bouge pas. Diagnostic : résidus studentisés, leverage (nommer) ; remède : Huber, MAE, ou comprendre le point.
7. **R² = 1 − RSS/TSS** [tronc]. Part de la variance de y « expliquée » par la droite. Il **ne baisse jamais** quand on ajoute une variable (témoin β = 0, b02), donc il ne juge pas un ajout ; R² ajusté, AIC, ou validation (p06-02). R² = 0,6 sur cinq points, R² = 0,61 sur 200 marchés : le même nombre n'a pas la même valeur — le SE le dit, pas R². Au tableau : « R² compare RSS à TSS, donc ajouter une colonne ne peut que baisser RSS, donc R² monte toujours, donc il ne compare pas des modèles de tailles différentes. »
8. **Ce que β̂₁ veut dire.** 0,0475 : mille dollars de TV en plus ⇒ 47,5 ventes en plus **en moyenne**, **toutes choses égales** si d'autres variables sont dans le modèle — et corrélation, pas cause. Le SE 0,0027 (p01-03) dit que ce chiffre est stable ; le R² de 0,61 dit que la TV n'explique pas tout.
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 2 (sheet) — `plot` + `slider` y₅ ∈ [0, 20] et y₃ ∈ [0, 20]** : le nuage des cinq points, la droite OLS recalculée, les résidus en segments verticaux, readouts β̂₁, β̂₀, RSS, R². Légende : un point tire la droite avec le carré de son écart.
- **Figure 1 (sheet) — `plot`** : le même nuage avec un `slider` sur une droite « à la main » (β₀, β₁) et le RSS affiché comme somme des aires des carrés des résidus (dessinés en carrés) ; bouton « OLS » qui saute au minimum. Légende : minimiser la somme des aires.
- **Figure 3 — `plot` + bouton « ajouter une variable de bruit »** : sur 30 points, R² et R² ajusté en fonction du nombre de colonnes de bruit ajoutées (jusqu'à 10). Légende : R² monte quoi qu'on ajoute.

## Où ça casse
- **Non-linéarité** : la moyenne conditionnelle n'est pas affine ⇒ biais ; résidus en forme ; transformer x ou changer de modèle.
- **Hétéroscédasticité / dépendance** : β̂ reste sans biais, les SE sont faux (p01-03).
- **Colinéarité** : XᵀX non inversible ou mal conditionné ⇒ β̂ non unique ou instable (p02-02, p04-03) ; ridge.
- **Extrapolation** : la droite est ajustée sur le support des x ; hors support, H1 n'a jamais été testée.

## Résumé
1. Le modèle est une hypothèse sur Y sachant X : moyenne affine (H1), bruit centré (H2) ; H3–H4 servent aux SE et au MLE.
2. Carrés ⇐ gaussien ; MAE ⇐ Laplace.
3. Forme fermée : β̂₁ = Ĉov/V̂ar, β̂₀ = ȳ − β̂₁x̄ ; la droite passe par (x̄, ȳ) ; ŷ = projection.
4. Les carrés amplifient les outliers (0,6 → 2,6).
5. R² ne baisse jamais en ajoutant une variable ; il ne juge pas un ajout.
6. β̂₁ = effet moyen, toutes choses égales, corrélation ; le SE dit sa stabilité.

**Phrase d'entretien** : « Le modèle linéaire pose que la moyenne de Y sachant X est affine et que le reste est un bruit centré ; les carrés viennent d'un bruit gaussien, et comme annuler leur gradient est linéaire en β, la solution est fermée : covariance sur variance, droite par le centre du nuage. Le R² ne baisse jamais quand on ajoute une variable, donc il ne juge pas un ajout ; c'est le SE de la pente et la validation qui jugent. »

## Chaîne verbalisée
1. Que suppose Y = β₀ + β₁X + ε, et sur quoi ? → Moyenne conditionnelle affine, bruit centré ; sur Y sachant X seulement.
2. Pourquoi des carrés ? → NLL gaussienne ; Laplace donnerait |·|.
3. Écris β̂₁ et β̂₀ et dis d'où ils sortent. → Ĉov/V̂ar ; ȳ − β̂₁x̄ ; gradient nul, linéaire en β.
4. Que fait un outlier, et pourquoi ? → Tire la droite avec le carré de l'écart : 0,6 → 2,6.
5. Pourquoi R² monte toujours ? → Témoin β = 0 : RSS ne peut pas monter.
6. Comment lis-tu β̂₁ = 0,0475 ? → +47,5 ventes en moyenne par millier d'euros, toutes choses égales, corrélation.

## Ce qui a cassé pour Salah
- Erreur récurrente : β̂₀ = ȳ au lieu de ȳ − β̂₁x̄ (learnings) — pas 4, écrit en clair et chiffré (2,2, pas 4).
- ISLR ch. 3 : H₀ sur l'estimateur au lieu du paramètre — pas ici (p01-02, p01-03), mais le pas 8 doit dire « SE 0,0027 » en renvoyant à p01-03, pas refaire le test.
- Q3 (témoin, R²) réussie : pas 7 renvoie à b02 sans redémontrer.
- Scorie : estimateurs sans chapeau — chaque β̂ chapeauté.

## Exclusions
Pas de leverage/Cook au-delà du nom, pas de régression multiple au-delà de « p colonnes, toutes choses égales », pas d'interactions, pas de tests F.

## Questions pour la revue

Vérifications faites par script (`numpy`) avant écriture — tous les chiffres du fil rouge
sont confirmés (S_xy = 6, S_xx = 10, β̂₁ = 0,6, β̂₀ = 2,2, résidus, RSS = 2,4, TSS = 6,
R² = 0,6, RSE = 0,894, SE(β̂₁) = 0,283). Trois corrections et deux ajouts :

1. **« a quadruplé la pente » → « par plus de quatre »** : 2,6/0,6 = 4,33. Corrigé dans le spec.
2. **« mille euros de TV » → « mille dollars »** : *Advertising* est en milliers de dollars
   (budget) et en milliers d’unités (ventes). Corrigé dans le spec et écrit ainsi dans la sheet.
3. **« un point tire la droite avec le carré de son écart »** était imprécis : β̂ est *linéaire*
   en y, l’influence de yᵢ sur la pente vaut exactement (xᵢ − x̄)/S_xx — c’est le **levier**. Le
   carré explique qu’on subisse le point (laisser un résidu grand coûte son carré), pas de combien
   la pente bouge. Le pas 6 de la sheet dit les deux séparément. À valider en revue.
4. **Ajout vérifié** : le même écart de 10 posé sur le point du **centre** (y₃ = 15, w = 0) laisse
   β̂₁ strictement inchangée (0,6) et ne déplace que β̂₀ (2,2 → 4,2). C’est le contraste qui fait
   comprendre le levier ; la figure 2 de la sheet a donc deux sliders au lieu d’un.
5. **Ajout vérifié** : avec y₅ = 15, R² **monte** à 0,638 (RSS = 38,4, TSS = 106) alors que le RSE
   passe de 0,89 à 3,58. Un deuxième argument, plus frappant que le bruit pur, contre la lecture
   de R² comme « qualité d’ajustement ». Utilisé au pas 7.
6. **Chiffres de la figure 3** (R² vs R² ajusté, n = 30, 10 colonnes de bruit) : simulation sur
   4 000 tirages → R² 0,50 → 0,68, R² ajusté ≈ 0,48 immobile ; gain moyen par colonne de bruit
   = (1 − R²)/(n − p − 1), vérifié à 0,0178 contre 0,0179 théorique. La graine du générateur de la
   figure a été choisie pour que le tirage affiché colle à ces moyennes (0,494 → 0,668).
