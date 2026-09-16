---
id: p05-03
series: chain
part: "05"
number: "03"
slug: regularisation-biais-variance
title: Régularisation vue en biais-variance — le chemin de λ
subtitle: ISLR ch. 6 — ce que λ achète et ce qu'il coûte, coefficient par coefficient
prereq: [p02-02, p06-01]
anki: [ml::ridge, ml::lasso, ml::biais-variance, ml::cv]
bridges: [b03]
next: p06-01
status: ready
---

## Question de la chaîne
Que fait λ à chaque coefficient quand on le monte, pourquoi un peu de biais fait baisser l'erreur test, et comment on choisit λ.

## Prérequis
- p02-02 : ridge = MAP gaussien, lasso = MAP Laplace ; +λI translate ; L1 met des zéros exacts.
- p06-01 : erreur test = biais² + variance + bruit.

## Hypothèses posées
- H1 : features **standardisées** (sinon λ pénalise les unités).
- H2 : l'intercept n'est pas pénalisé.
- H3 : modèle linéaire ; l'argument biais-variance est général.

## Exemple fil rouge
Une feature centrée, S_xx = 2, β̂_OLS = 0,5 (les 3 points de p05-01). Ridge : β̂(λ) = β̂_OLS · S_xx/(S_xx + λ) : λ = 0 → 0,5 ; 2 → 0,25 ; 8 → 0,1 ; ∞ → 0. Facteur de rétrécissement 2/(2 + λ).
Variance : Var(β̂(λ)) = Var(β̂_OLS) · [S_xx/(S_xx + λ)]² : à λ = 2, ¼ de la variance ; biais = β₁ · λ/(S_xx + λ) = β₁/2. Le rétrécissement fait baisser la variance au carré et monter le biais linéairement : il existe toujours un λ > 0 qui améliore la MSE (résultat classique, nommer).
Lasso : β̂(λ) = signe(β̂_OLS)·max(0, |β̂_OLS| − λ/(2S_xx)) : zéro exact dès λ ≥ 2 (convention loss sans ½ + λ|β|).

## Pas de la chaîne
1. **Le décor.** p02-02 a dit d'où vient λ‖β‖² et ce qu'il fournit (existence, unicité). Ici : ce qu'il fait à l'erreur test, et comment le régler.
2. **Le chemin d'un coefficient** [tronc]. Ridge rétrécit chaque coefficient vers 0 continûment (facteur S_xx/(S_xx + λ) en 1D ; σᵢ²/(σᵢ² + λ) par direction singulière, p04-03). Lasso le rétrécit d'une constante et le **coupe** à zéro. Au tableau : « Ridge multiplie par un facteur inférieur à un qui décroît avec λ, donc les coefficients glissent vers zéro sans l'atteindre ; lasso soustrait une constante, donc les petits coefficients tombent à zéro exactement. »
3. **Ce que λ achète : de la variance en moins** [tronc]. Var(β̂) est multipliée par le carré du facteur ; à λ = 2, ¼. Sur p features colinéaires, c'est l'instabilité des coefficients qui disparaît. Au tableau : « L'estimateur rétréci est l'OLS fois un facteur inférieur à un, donc sa variance est celle de l'OLS fois le carré de ce facteur, donc elle décroît plus vite que le biais ne croît. »
4. **Ce que λ coûte : du biais.** E[β̂(λ)] = β · facteur ≠ β. Erreur test = biais² + variance + bruit (p06-01) : λ déplace le point sur cette somme. Petit λ : variance ; grand λ : biais. Il existe un minimum, et il est à λ > 0 dès que la variance de l'OLS est non nulle.
5. **La courbe en U et le choix de λ** [tronc]. Erreur de validation croisée en fonction de λ : décroît puis remonte. On prend le minimum, ou la règle « 1 SE » (le λ le plus grand dont l'erreur est à moins d'un écart-type du minimum : plus simple, aussi bon). λ n'est pas un paramètre du modèle mais un hyperparamètre : jamais choisi sur le test (p01-04). Au tableau : « L'erreur de validation additionne un biais croissant et une variance décroissante en λ, donc elle est en U, donc on choisit λ au creux par validation croisée, sur des données que le test n'a pas vues. »
6. **Ridge ou lasso.** Lasso sélectionne (zéros exacts, interprétable, instable entre features corrélées : il en choisit une au hasard) ; ridge répartit (stable, garde tout). Elastic net mélange. Le choix est un prior : effets sparse ou diffus (p02-02).
7. **Standardiser** : ‖β‖ dépend des unités ; sans standardisation λ pénalise d'abord les features à petite échelle.
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` λ ∈ [0, 20]** : chemins de 4 coefficients (jeu simulé, 30 points, deux vraies features à 1 et 0,5, deux nulles) en ridge (courbes lisses vers 0) et lasso (coupées à zéro) ; readouts. Légende : ridge glisse, lasso coupe.
- **Figure 2 — `plot` + `slider` λ** : biais², variance, bruit et leur somme pour le fil rouge 1D (σ² = 1, Var(β̂_OLS) = σ²/S_xx = 0,5, β₁ = 0,5) ; minimum marqué. Légende : la variance tombe en carré, le biais monte en linéaire ; le creux est à λ > 0.
- **Figure 3 — `plot`** : erreur CV en fonction de λ (courbe en U simulée), minimum et λ « 1 SE » marqués avec la barre d'erreur. Légende : le choix se fait ici, jamais sur le test.

## Où ça casse
- **λ choisi sur le test** : le chiffre rapporté est un minimum sur des essais (p01-04).
- **Sans standardisation** : le chemin dépend des unités.
- **Lasso entre features corrélées** : sélection arbitraire et instable d'un tirage à l'autre.
- **« Régulariser pour éviter l'overfitting »** : conséquence ; le mécanisme est variance contre biais, et existence/unicité (p02-02).

## Résumé
1. Ridge : facteur S_xx/(S_xx + λ) (σᵢ²/(σᵢ² + λ) par direction) ; lasso : soustraction puis zéro exact.
2. λ réduit la variance au carré du facteur, ajoute un biais linéaire : le creux est à λ > 0.
3. Erreur CV en U ; minimum ou règle 1 SE ; jamais sur le test.
4. Lasso sélectionne (instable si corrélé), ridge répartit ; le choix est un prior.
5. Standardiser ; ne pas pénaliser l'intercept.

**Phrase d'entretien** : « Ridge multiplie chaque coefficient par un facteur inférieur à un, ce qui divise sa variance par le carré de ce facteur au prix d'un biais linéaire : l'erreur test, somme des deux, a donc un minimum à lambda strictement positif. Lasso soustrait une constante et coupe à zéro, ce qui sélectionne mais devient instable entre features corrélées. Lambda se choisit au creux de la validation croisée, sur des features standardisées, jamais sur le test. »

## Chaîne verbalisée
1. Que fait ridge à β̂_OLS = 0,5 avec S_xx = 2, λ = 2 ? → 0,25 : facteur 2/(2 + 2).
2. Que devient la variance, que devient le biais ? → ¼ de la variance ; biais β₁/2.
3. Pourquoi le meilleur λ est > 0 ? → Variance en carré du facteur, biais linéaire.
4. Ridge ou lasso, quand ? → Sparse ⇒ lasso ; diffus ou corrélé ⇒ ridge.
5. Comment choisir λ ? → CV, creux ou 1 SE ; standardiser ; pas le test.

## Ce qui a cassé pour Salah
- Q16.2 réussie (ridge/lasso = priors) : ne pas redériver ; cette chaîne est la lecture biais-variance, l'autre (p02-02) la lecture bayésienne — le dire en pas 1.
- « Régulariser pour éviter l'overfitting » : phrase à nommer comme conséquence (casse).
- Convention λ du site : loss sans ½ + λ·pen — le seuil lasso λ/(2S_xx) en découle.

## Exclusions
Pas de subset selection (best/forward), pas de degrés de liberté effectifs au-delà du nom, pas de dérivation de Var(β̂_ridge) en multiple.
