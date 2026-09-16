---
id: p07-03
series: chain
part: "07"
number: "03"
slug: boosting
title: Gradient boosting — une descente dans l'espace des fonctions
subtitle: ISLR ch. 8 → XGBoost — chaque arbre apprend le gradient de la loss au modèle cumulé
prereq: [p03-02, p07-01, p02-01]
anki: [ml::boosting, ml::gradient-boosting, ml::learning-rate-boosting, ml::rf-vs-gb]
bridges: [b01]
next: p07-04
status: stub
---

## Question de la chaîne
Que cible chaque nouvel arbre, pourquoi c'est une descente de gradient, ce que font la profondeur et le learning rate, et quand préférer la forêt.

## Prérequis
- p03-02 : descente de gradient, pas η.
- p07-01 : arbres peu profonds = biais fort, variance faible.
- p02-01 : loss = NLL ; gradient de la MSE = résidu, de la log-loss = p − y.

## Hypothèses posées
- H1 : modèle additif F_M(x) = F₀ + ν Σ_m h_m(x), les h_m étant des arbres **peu profonds** (1 à 6 niveaux).
- H2 : loss dérivable en F (MSE, log-loss, …).

## Exemple fil rouge
Régression MSE, y = (1, 2, 3), x = (1, 2, 3). F₀ = ȳ = 2. Gradient de ½(y − F)² en F = −(y − F) ⇒ cible = résidus r = (−1, 0, 1).
Arbre h₁ (souche, split en 1,5) : gauche −1, droite moyenne(0, 1) = 0,5 ⇒ h₁ = (−1, 0,5, 0,5). ν = 0,5 : F₁ = 2 + 0,5·h₁ = (1,5 ; 2,25 ; 2,25). Résidus (−0,5 ; −0,25 ; 0,75). Souche h₂ (split 2,5) : gauche moyenne(−0,5, −0,25) = −0,375, droite 0,75 ⇒ F₂ = F₁ + 0,5·h₂ = (1,3125 ; 2,0625 ; 2,625). Résidus (−0,31 ; −0,06 ; 0,37) : ils s'effacent, lentement à ν = 0,5, plus vite à ν = 1 (mais on verra pourquoi on ne veut pas).
Classification log-loss : cible = y − p (gradient négatif), pas les résidus d'un arbre.

## Pas de la chaîne
1. **Le décor.** Le bagging a réduit la variance. Reste le biais. Idée : corriger le modèle courant par un petit modèle qui apprend **ce qui manque**.
2. **Qu'est-ce qui manque : le gradient de la loss** [tronc]. On veut faire baisser L(F) = Σ ℓ(yᵢ, F(xᵢ)). Le pas de descente sur F serait F ← F − η ∂L/∂F, où ∂L/∂F est un vecteur à n composantes (une par point). Pour la MSE c'est −(y − F) : le **résidu**. Pour la log-loss c'est −(y − p). L'arbre h_m est ajusté sur ce gradient négatif, pour l'approximer par une fonction de x. Au tableau : « La descente de gradient sur la fonction F voudrait ajouter −∂L/∂F en chaque point, donc on entraîne un arbre à reproduire ce vecteur, donc chaque arbre est un pas de gradient dans l'espace des fonctions, et pour la MSE ce gradient est le résidu. »
3. **Le pas : ν et le nombre d'arbres.** F_m = F_{m−1} + ν h_m. ν = learning rate (0,01–0,1 typique) ; petit ν + beaucoup d'arbres généralise mieux que grand ν + peu d'arbres (chaque arbre corrige peu, le suivant voit un problème encore lisse). M par early stopping sur validation. Au tableau : « Chaque arbre est un pas, donc ν est la longueur du pas, donc un petit pas avec plus d'arbres suit mieux la descente et se règle sur validation par arrêt anticipé. »
4. **Profondeur = biais, à l'envers de la forêt** [tronc]. Des souches ou des arbres à 3–6 niveaux : biais fort, variance faible ; la somme de beaucoup réduit le biais (chaque arbre ajoute ce qui manque). Le boosting travaille le biais, le bagging la variance. Profondeur d capture des interactions d'ordre d. Au tableau : « Des arbres peu profonds ont peu de variance et beaucoup de biais, donc l'additivité séquentielle réduit ce biais pas à pas, donc le boosting est une méthode de biais là où le bagging est une méthode de variance. »
5. **Régularisation.** ν, M (early stopping), profondeur, sous-échantillonnage de lignes par arbre (stochastic GB), pénalité sur les feuilles (XGBoost : λ sur les valeurs de feuilles, γ par feuille — nommer seulement). Le boosting **overfitte** si M croît sans arrêt, contrairement à la forêt qui plafonne.
6. **Forêt ou boosting** [tronc]. Forêt : parallèle, presque sans réglage, robuste aux labels bruités (moyenne de votes) — une méthode de variance. Boosting : séquentiel, réglages (ν, M, d), généralement plus précis, **sensible au bruit et aux outliers** : un point mal étiqueté garde un gradient élevé et chaque arbre s'acharne dessus (critère sensible, p03-01). Au tableau : « La forêt moyenne et lisse le bruit, le boosting suit le gradient et donc suit aussi le bruit, donc à labels propres et réglages faits le boosting gagne, à labels bruités ou sans temps de réglage la forêt est le choix sûr. »
7. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom via `plot` + bouton « arbre suivant »** : sur un jeu 1D (30 points, y = sin + bruit), F_m tracée, les résidus en segments, l'arbre h_m (souche) en escalier ; `slider` ν. Légende : chaque arbre apprend le résidu, les résidus s'effacent ; à ν = 1 ça va vite et ça suit le bruit.
- **Figure 2 — `plot`** : erreur train et validation en fonction de M pour ν ∈ {1 ; 0,1 ; 0,01} (simulées) ; minimum de validation marqué. Légende : petit ν, plus d'arbres, meilleur creux ; le boosting overfitte si on continue.
- **Figure 3 — `repeat`** : jeu 2D avec 10 % de labels inversés, forêt vs boosting (implémentation JS de souches) ; frontières redessinées à chaque tirage ; readout erreur test. Légende : la forêt ignore les labels bruités, le boosting les poursuit.

## Où ça casse
- **Labels bruités / outliers** : le gradient ne s'éteint jamais sur un point faux (log-loss non bornée) ; sous-échantillonner, Huber, ou forêt.
- **M sans early stopping** : overfit garanti.
- **Cible = résidus de l'arbre précédent** : faux ; c'est le gradient de la loss au **modèle cumulé** F_{m−1}, qui coïncide avec le résidu seulement pour la MSE.
- **Extrapolation** : somme d'arbres = constante hors du support.

## Résumé
1. Chaque arbre apprend −∂L/∂F au modèle cumulé : résidu pour la MSE, y − p pour la log-loss.
2. F_m = F_{m−1} + ν h_m : descente de gradient dans l'espace des fonctions ; ν = pas ; M par early stopping.
3. Arbres peu profonds : le boosting réduit le biais ; le bagging réduit la variance.
4. Régularisation : ν, M, profondeur, sous-échantillonnage, pénalités de feuilles.
5. Forêt : robuste, parallèle, sans réglage ; boosting : plus précis, séquentiel, sensible au bruit.

**Phrase d'entretien** : « Le gradient boosting est une descente de gradient dans l'espace des fonctions : chaque arbre est entraîné à reproduire le gradient négatif de la loss au modèle cumulé — le résidu pour la MSE, y moins p pour la log-loss — et il est ajouté avec un learning rate. Les arbres sont peu profonds, donc c'est le biais qui baisse, à l'inverse du bagging. Il suit aussi le bruit, d'où l'arrêt anticipé, et d'où la forêt quand les labels sont sales. »

## Chaîne verbalisée
1. Que cible l'arbre m ? → −∂L/∂F en F_{m−1} ; résidu pour MSE, y − p pour log-loss — pas le résidu de l'arbre précédent.
2. Pourquoi c'est une descente de gradient ? → F ← F − η∇_F L, approximé par un arbre.
3. Que fait ν ? → Longueur du pas ; petit ν + plus d'arbres généralise mieux ; M par early stopping.
4. Boosting : biais ou variance ? → Biais (arbres peu profonds) ; bagging : variance.
5. Quand la forêt plutôt que le boosting ? → Labels bruités, pas de temps de réglage, parallélisme.

## Ce qui a cassé pour Salah
- Q12.1 (10/09) : « l'arbre suivant apprend les résidus de l'arbre précédent » — faux, et la casse le nomme ; le pas 2 écrit le gradient de la loss au modèle cumulé, avec la log-loss comme contre-exemple où gradient ≠ résidu.
- Diagnostic : vocabulaire boosting ; pas 4 et 6 fixent « biais vs variance » et « RF vs GB ».
- Scope acté : pas de hessienne XGBoost (second ordre) — nommer λ, γ seulement.

## Exclusions
Pas de Newton boosting / hessienne, pas d'AdaBoost au-delà d'une ligne, pas de LightGBM/CatBoost, pas de SHAP.
