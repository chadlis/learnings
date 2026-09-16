---
id: p02-03
series: chain
part: "02"
number: "03"
slug: conjugues-posterior
title: Le posterior entier — conjugués, lissage, et pourquoi MCMC/VI existent
subtitle: fil B — Beta-Binomiale, pseudo-comptes, prior noyé quand n grandit
prereq: [p02-01, p02-02, p00-03]
anki: [stats::beta, stats::bayes, stats::map, stats::mle-map]
bridges: [b03]
next: p03-01
status: ready
---

## Question de la chaîne
Trois lancers PPP : le MLE dit p = 1. Comment un prior répare, que vaut le posterior, et pourquoi le prior disparaît quand n grandit ?

## Prérequis
- p00-03 : posterior ∝ vraisemblance × prior ; P(D) normalise.
- p02-01 : L(p) = pᵏ(1 − p)ⁿ⁻ᵏ pour k succès sur n.

## Hypothèses posées
- H1 : prior Beta(α, β) sur p ∈ [0, 1] — une loi **sur une probabilité** (une normale donnerait du poids à p = 1,5).
- H2 : tirages Bernoulli indépendants.

## Exemple fil rouge
PPP : k = 3, n = 3. Prior Beta(1, 1) = uniforme → posterior Beta(4, 1) : moyenne 4/5 = 0,8, MAP = 3/3 = 1 (α + k − 1)/(α + β + n − 2). Prior Beta(2, 2) → Beta(5, 2) : moyenne 5/7 = 0,714, MAP 4/5 = 0,8. Lissage de Laplace (k + 1)/(n + 2) = 4/5 = 0,8 = moyenne du posterior sous prior uniforme.
n = 300, k = 300 : Beta(302, 2), moyenne 0,993 : le prior est noyé.

## Pas de la chaîne
1. **Le décor.** MLE p̂ = 1 : « un échec est impossible ». En NLP, un mot jamais vu met une phrase entière à probabilité 0.
2. **Le prior conjugué** [tronc]. Likelihood ∝ pᵏ(1 − p)ⁿ⁻ᵏ, prior ∝ pᵅ⁻¹(1 − p)ᵝ⁻¹ : même forme en p ⇒ le produit additionne les exposants ⇒ posterior Beta(α + k, β + n − k). Pas d'intégrale, pas de P(D). Au tableau : « Le prior et la vraisemblance ont la même forme en p, donc leur produit est encore une Beta, donc la mise à jour est arithmétique : succès dans α, échecs dans β. »
3. **Lecture en pseudo-comptes.** Beta(α, β) = « (α − 1) succès et (β − 1) échecs imaginaires ». Beta(1, 1) = rien. Beta(2, 2) = un succès et un échec vus d'avance ⇒ jamais 0 ni 1.
4. **Trois résumés du posterior.** MAP (mode), moyenne, intervalle crédible. Lissage de Laplace = moyenne du posterior sous prior uniforme : (k + 1)/(n + 2). C'est un MAP déguisé (Beta(2, 2)) ou une moyenne (Beta(1, 1)) — les deux lectures donnent 0,8 ici.
5. **Le prior est noyé quand n grandit** [tronc]. log posterior = Σᵢ log p(xᵢ | p) + log p(p) : le premier terme croît en n, le second est fixe. n = 3 : prior décisif ; n = 300 : invisible. Le prior ne compte que s'il est informatif **et** que n est petit. Au tableau : « La log-vraisemblance est une somme de n termes, donc elle croît avec n, donc le log-prior, constant, est noyé, donc MAP et MLE coïncident asymptotiquement. »
6. **Sans conjugué.** P(D) = ∫ L(θ)p(θ) dθ est intraitable en haute dimension. Le MAP reste faisable (optimisation, P(D) ignoré) ; c'est le posterior **entier** qui coûte. MCMC l'échantillonne (lent, exact asymptotiquement) ; VI l'approxime par une famille simple en minimisant une KL (rapide, biaisé). Cinq lignes, pas d'algorithme.
7. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` k et n** (n ∈ [0, 300], k ≤ n), prior Beta(α, β) réglable par deux petits sliders : densité du prior (pointillé), de la vraisemblance normalisée (fin), du posterior (épais) ; marques MAP et moyenne. Légende : à n = 3 le posterior est large et tiré par le prior ; à n = 300 il est un pic sur k/n. (Implémenter la densité Beta via log-gamma en JS : fonction lgamma de Lanczos, 20 lignes.)
- **Figure 2 — `plot`** : log-vraisemblance (pente croissante en n) et log-prior (constant) en fonction de n, pour k/n = 1 : la somme suit la vraisemblance dès n ≈ 30. Légende : pourquoi le prior est noyé.

## Où ça casse
- **Prior conjugué = luxe de calcul**, pas une nécessité : le choisir pour la commodité peut imposer une forme fausse.
- **Prior informatif + n petit** : le résultat est le prior ; le dire.
- **Haute dimension** : plus de conjugué ⇒ MAP seul, ou MCMC/VI.
- **MAP ≠ moyenne** : pour une Beta asymétrique ils diffèrent ; une décision (p × montant) veut la moyenne.

## Résumé
1. MLE ne croit que le vu ; un prior sur [0,1] répare.
2. Beta est conjuguée de Bernoulli : posterior Beta(α + k, β + n − k), mise à jour arithmétique.
3. Pseudo-comptes : (α − 1) succès, (β − 1) échecs imaginaires ; Laplace = (k + 1)/(n + 2).
4. Le prior est noyé quand n grandit : somme de n termes contre une constante.
5. Sans conjugué : MAP facile, posterior entier cher ⇒ MCMC (échantillonne) ou VI (optimise une KL).

**Phrase d'entretien** : « Avec un prior Beta, le posterior d'une Bernoulli est encore une Beta dont on incrémente les paramètres avec les succès et les échecs : le lissage de Laplace n'est que ce posterior sous prior uniforme. Le prior compte à petit n et disparaît quand n grandit, parce que la log-vraisemblance croît en n et le log-prior non. Sans conjugué, le MAP reste une optimisation ; c'est le posterior entier qui exige MCMC ou une approximation variationnelle. »

## Chaîne verbalisée
1. Que dit le MLE après PPP et pourquoi c'est un problème ? → p̂ = 1 ; l'échec devient impossible.
2. Pourquoi Beta, et que vaut le posterior ? → Loi sur [0,1] ; même forme que la vraisemblance ; Beta(α + k, β + n − k).
3. Qu'est-ce que le lissage de Laplace ? → (k + 1)/(n + 2) : moyenne du posterior sous prior uniforme.
4. Pourquoi le prior est-il noyé quand n grandit ? → log L croît en n ; log prior constant.
5. Pourquoi MCMC et VI existent ? → P(D) intraitable ; échantillonner ou optimiser une approximation.

## Ce qui a cassé pour Salah
- Q16.1 (10/09) échouée : « pourquoi le prior est noyé » — pas 5 et figure 2 sont la réponse, avec l'argument « somme de n termes contre constante » écrit tel quel.
- Q16.3 : cas petit n (proportion à 0 ou 1) — pas 1, 3, 4 ; l'exemple PPP est le sien.
- Ce qui est acquis (ne pas redémontrer) : Ridge = gaussien, Lasso = Laplace ; MLE = MAP à prior plat.

## Exclusions
Pas d'algorithme MCMC (Metropolis) ni de VI (ELBO) : cinq lignes de « pourquoi », c'est tout. Pas de Dirichlet.
