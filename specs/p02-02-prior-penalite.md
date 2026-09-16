---
id: p02-02
series: chain
part: "02"
number: "02"
slug: prior-penalite
title: Du prior à la pénalité — ce que la régularisation fournit
subtitle: fil B — MAP, λ = σ²/τ², +λI translate, L1 tranche ailleurs
prereq: [p02-01, p04-02]
anki: [stats::map, stats::regularisation, ml::ridge, ml::lasso, algebre::eigen]
bridges: [b05, b06, b03]
next: p02-03
status: ready
---

## Question de la chaîne
D'où sort λ‖β‖² ? Que fournit-il que les données ne fournissaient pas ? Et pourquoi L1 met des zéros exacts ?

## Prérequis
- p02-01 : NLL, le geste des six pas.
- p04-02 : valeurs propres ; (A + λI)v = (μ + λ)v.
- p00-03 : Bayes, posterior ∝ vraisemblance × prior.

## Hypothèses posées
- H1 : **deuxième et dernière hypothèse** de tout le fil B : une loi sur β **avant** les données (le prior). Gaussien N(0, τ²) ou Laplace(0, τ).
- H2 : le bruit est celui de p02-01 (σ² connu ou jeté).
- H3 : on cherche l'argmax du posterior (MAP), pas le posterior entier (p02-03).

## Exemple fil rouge
Régression colinéaire de D4 : x₁ = (1, 2, 3), x₂ = (2, 4, 6), y = (1, 2, 3), f = β₁x₁ + β₂x₂.
- XᵀX = [[14, 28], [28, 56]], valeurs propres 0 et 70, Xᵀy = (14, 28). Rang 1 : toute la droite s = β₁ + 2β₂ = 1 a RSS = 0.
- Ridge λ = 1 : (XᵀX + I) = [[15, 28], [28, 57]], det = 71, β̂ = (14/71 ; 28/71) = (0,197 ; 0,394). Valeurs propres 1 et 71.
- Sur la droite (1 + 2t, −t) : ‖β‖² = 5t² + 4t + 1, min en t = −0,4 → (0,2 ; 0,4). ‖β‖₁ = |1 + 2t| + |t|, min en t = −0,5 → (0 ; 0,5).
- Classification séparable de p02-01 : λβ² rend la NLL coercive ; λ = 0,01 → β̂ = 3,41 ; 0,1 → 1,85 ; 1 → 0,71.

## Pas de la chaîne
1. **Le décor.** Les données ne suffisent pas : une droite entière de solutions (colinéarité), ou aucune (séparation). Il manque un critère.
2. **Prior sur β** [tronc]. β ~ N(0, τ²) : « les coefficients sont modérés, centrés sur zéro ». Bayes : p(β | D) ∝ L(β) p(β). Au tableau : « Le prior est une hypothèse sur le monde, donc il est discutable et remplaçable, donc il n'est pas un artifice. »
3. **−log prior → pénalité.** Même geste que les pas 4–6 de p02-01, appliqué à β : −log p(β) = ‖β‖²/(2τ²) + cste. MAP = argmin [RSS/(2σ²) + ‖β‖²/(2τ²)] = argmin [RSS + λ‖β‖²], **λ = σ²/τ²**. C'est Ridge, et λ a un sens : bruit fort ou prior étroit ⇒ on croit le prior. Au tableau : « Le MAP minimise la NLL plus le moins log prior, donc un prior gaussien ajoute un terme quadratique, donc c'est L2 avec λ = σ²/τ². »
4. **Ce que la pénalité fournit** [tronc] : l'existence et l'unicité. Colinéarité : RSS constant sur la droite, λ‖β‖² ne l'est pas ⇒ un seul point (0,2 ; 0,4). Séparation : NLL → 0, λβ² → ∞ ⇒ la somme remonte, un minimum existe. Au tableau : « Là où les données ne tranchent pas, la pénalité tranche, donc elle rend la solution unique ou existante, donc l'amélioration en test est une conséquence, pas le mécanisme. »
5. **+λI translate, n'annule pas** [tronc]. (XᵀX + λI)v = (μ + λ)v : chaque valeur propre monte de λ ; 0 devient λ, 70 devient 70 + λ. Toutes > 0 ⇒ inversible. Rien n'est annulé. Au tableau : « Ajouter λI ajoute λ à chaque valeur propre, donc la valeur propre nulle devient λ, donc la matrice devient inversible, donc la forme fermée existe à nouveau. »
6. **L1 tranche ailleurs.** Prior de Laplace ⇒ −log p(β) ∝ ‖β‖₁ ⇒ Lasso. Sur la même droite, le minimum de ‖β‖₁ est en (0 ; 0,5) : une coordonnée exactement nulle. Géométrie : la boule L1 a des coins sur les axes ; la boule L2 est ronde. Pente : L1 constante jusqu'à 0, L2 s'évanouit (p03-01).
7. **λ en pratique.** On ne connaît ni σ² ni τ² ⇒ λ par validation croisée ; l'interprétation bayésienne est une lecture, l'équivalence des formules est un fait.
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom via `plot`** : plan (β₁, β₂) ∈ [−1, 2]² ; la droite des solutions s = 1 (trait) ; boule L2 (cercle) et boule L1 (losange) de rayon réglé par un `slider` ; marquer le point de contact avec la droite : (0,2 ; 0,4) pour le cercle, (0 ; 0,5) pour le losange. Légende : la pénalité choisit le point de la droite le plus proche de l'origine au sens de sa norme ; L1 touche sur un axe.
- **Figure 2 — `plot` + `slider` λ ∈ [0, 5]** : les deux valeurs propres de XᵀX + λI en fonction de λ (deux droites de pente 1, partant de 0 et 70 — axe y en log ou coupé) ; readout « plus petite valeur propre = λ ». Légende : translation, pas annulation.
- **Figure 3 — `plot` + `slider` λ** : NLL(β) de la classification séparable + λβ² ; minimum marqué ; readout β̂. Légende : la pénalité fait exister le minimum.

## Où ça casse
- **Prior faux** : L2 sur des coefficients vraiment sparse répartit sur des features inutiles ; L1 sur des effets diffus en éteint à tort. Le critère ajouté doit correspondre à ce qu'on croit du monde.
- **Échelle** : ‖β‖² dépend des unités ; standardiser avant de pénaliser, sinon λ pénalise les features à petite échelle.
- **Intercept** : ne se pénalise pas (il n'a pas de raison d'être proche de 0).
- **« Régulariser pour éviter l'overfitting »** : conséquence, pas mécanisme ; dire ça en entretien sans le mécanisme est ce qui coûte.

## Résumé
1. Deux hypothèses dans tout le fil B : le bruit (p02-01) et le prior (ici).
2. MAP = NLL + (−log prior) ; gaussien → λ‖β‖², λ = σ²/τ² ; Laplace → λ‖β‖₁.
3. La pénalité fournit existence et unicité : elle tranche là où les données ne tranchent pas.
4. +λI translate le spectre de λ ; rien n'est annulé.
5. L1 tranche sur un coin : zéros exacts ; L2 tranche au plus près : jamais zéro.
6. λ par CV ; standardiser ; pas l'intercept.

**Phrase d'entretien** : « La pénalité L2 est le moins log d'un prior gaussien sur les coefficients, avec λ égal au rapport variance du bruit sur variance du prior. Ce qu'elle fournit, c'est l'existence et l'unicité : sous colinéarité elle choisit le point de norme minimale, et +λI translate chaque valeur propre de λ sans rien annuler. Un prior de Laplace donne L1, qui tranche sur un coin de sa boule et met des coefficients exactement à zéro. »

## Chaîne verbalisée
1. D'où sort λ‖β‖² ? → −log d'un prior N(0, τ²) ; MAP ; λ = σ²/τ².
2. Que fournit la pénalité sous colinéarité ? → L'unicité : RSS constant sur la droite, la norme non.
3. Que fait +λI aux valeurs propres ? → Les translate de λ ; 0 → λ ; inversible.
4. Pourquoi L1 met des zéros exacts ? → Coin de la boule sur un axe ; pente constante jusqu'à 0.
5. Que fournit la pénalité sous séparation parfaite ? → L'existence : la NLL seule n'a pas de minimum.

## Ce qui a cassé pour Salah
- 15/09 : « +λI **annule** » au lieu de « translate » — le pas 5 est écrit contre cette erreur, avec la figure 2.
- 15/09 : le raisonnement p > n (rang, valeur propre nulle) non récupérable juste après l'avoir prouvé — le pas 4 doit rester à une brique : « droite de solutions ⇒ pas d'unicité ⇒ la pénalité choisit ».
- Q16.2 (10/09) réussie : Ridge = gaussien, Lasso = Laplace ; Q8.1 réussie : gradient L1 constant. Ne pas redémontrer, réutiliser.
- Q16.3 : petit n → p02-03.
- « On régularise pour éviter l'overfitting » : phrase fausse tentante, à nommer comme telle (D4 le fait).

## Exclusions
Pas d'Elastic Net au-delà d'une ligne. Pas de chemin de régularisation complet (p05-03). Pas de dérivation de la variance de Ridge.
