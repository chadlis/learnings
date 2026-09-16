---
id: p07-02
series: chain
part: "07"
number: "02"
slug: bagging-rf
title: Bagging et random forest — la variance seule
subtitle: ISLR ch. 8 — moyenner des arbres corrélés : ce que B achète, ce que ρ bloque
prereq: [p07-01, p01-05, p06-01]
anki: [ml::bagging, ml::random-forest, ml::oob, ml::variance-moyenne]
bridges: [b03, b04]
next: p07-03
status: ready
---

## Question de la chaîne
Pourquoi moyenner B arbres réduit la variance et pas le biais, pourquoi ça plafonne, ce que le tirage de m features par split ajoute, et d'où sort l'erreur OOB.

## Prérequis
- p07-01 : un arbre profond = biais faible, variance forte, instable.
- p01-05 : bootstrap, 37 % de lignes absentes par rééchantillon.
- p06-01 : biais² + variance ; p00-02 / b04 : variance d'une moyenne corrélée.

## Hypothèses posées
- H1 : B arbres de même loi, chacun de variance σ², corrélés deux à deux avec ρ.
- H2 : arbres **profonds, non élagués** — c'est le choix qui rend le biais faible et laisse à la moyenne le travail sur la variance.

## Exemple fil rouge
Var(moyenne de B) = ρσ² + (1 − ρ)σ²/B. σ² = 1.
Bagging (ρ = 0,6) : B = 1 → 1 ; 10 → 0,64 ; 100 → 0,604 ; ∞ → **0,60**.
Random forest (m = √p décorrèle, ρ = 0,2) : 10 → 0,28 ; 100 → 0,208 ; ∞ → **0,20**.
Bootstrap : chaque rééchantillon contient 1 − 1/e = 63,2 % des lignes distinctes ; 36,8 % sont **out-of-bag** pour cet arbre. Chaque ligne est OOB pour ≈ B/e arbres : les prédire avec ceux-là donne une estimation d'erreur hors échantillon sans validation.

## Pas de la chaîne
1. **Le décor.** Un arbre profond mémorise et change avec le tirage. On ne peut pas retirer le dataset ; on peut faire semblant (bootstrap).
2. **Bagging = bootstrap + moyenne** [tronc]. B rééchantillons, B arbres profonds, prédiction = moyenne (régression) ou vote (classification). Moyenner ne change pas le biais (E[moyenne] = E[un arbre]) ; il agit sur la variance. Au tableau : « L'espérance d'une moyenne est l'espérance d'un terme, donc le biais ne bouge pas, donc tout ce que le bagging peut faire est réduire la variance, et c'est pourquoi on lui donne des arbres profonds à biais faible. »
3. **La formule** [tronc]. Var(X̄) = ρσ² + (1 − ρ)σ²/B (b04). Le second terme s'éteint avec B ; le premier reste : les arbres voient les mêmes données, ils font les mêmes erreurs. Le plafond est ρσ². Au tableau : « La variance d'une moyenne de termes corrélés a une part qui décroît en 1/B et une part ρσ² qui ne dépend pas de B, donc ajouter des arbres ne sert plus au-delà de quelques centaines, donc le levier est ρ, pas B. »
4. **Random forest = décorréler** [tronc]. À chaque split, ne considérer que m features tirées au hasard (m ≈ √p en classification, p/3 en régression). Une feature dominante ne peut plus ouvrir tous les arbres : ρ baisse (0,6 → 0,2 dans le fil rouge), le plafond avec. Coût : chaque arbre est un peu moins bon (biais ↑ légèrement) ; gain : la moyenne bien meilleure. Au tableau : « Limiter les features à chaque split empêche les arbres de se ressembler, donc ρ baisse, donc le plafond ρσ² baisse, donc la forêt gagne là où le bagging plafonnait. »
5. **OOB : une validation gratuite.** Chaque ligne est absente de ~37 % des rééchantillons ; la prédire par les seuls arbres qui ne l'ont pas vue donne une erreur hors échantillon ≈ CV, sans découpage. Le 37 % est celui de p01-05 : (1 − 1/n)ⁿ → e⁻¹.
6. **Ce qui reste.** Biais : celui d'un arbre profond, faible mais réel (frontières axiales, pas d'extrapolation). B : au-delà de quelques centaines, rien. Importance : biaisée comme celle d'un arbre ; permutation OOB mieux (nommer). Probabilités : fraction de votes, mal calibrées (p06-04).
7. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` ρ ∈ [0, 1]** : Var(X̄) en fonction de B (axe log, 1…1 000) pour σ² = 1 ; asymptote ρσ² en pointillé ; presets ρ = 0,6 (bagging), 0,2 (RF). Légende : le plafond, et pourquoi décorréler vaut plus que multiplier.
- **Figure 2 — `repeat` + `slider` B ∈ {1, 5, 25, 100}** : sur le jeu 2D de p07-01 (croissants), frontière de la forêt à chaque tirage du dataset ; readout de la dispersion des frontières. Légende : à B = 1 la frontière change à chaque tirage ; à B = 100 elle se stabilise.
- **Figure 3 — SVG custom (OOB)** : 10 lignes, B = 6 rééchantillons dessinés (cases surlignées si tirées) ; pour la ligne 4, les arbres où elle est absente marqués ; readout « 37 % en moyenne ». Légende : chaque ligne a ses propres arbres de validation.

## Où ça casse
- **Biais** : un problème de biais (frontière oblique, extrapolation) n'est pas réparé par la forêt — c'est le boosting (p07-03) ou un autre modèle.
- **Une feature dominante** : sans m < p, tous les arbres s'ouvrent dessus, ρ reste haut.
- **OOB sur lignes dépendantes** (groupes) : un arbre a vu le « jumeau » de la ligne OOB ; l'erreur est optimiste — même piège que la CV (p06-02).
- **Coût** : B arbres profonds en mémoire et en prédiction ; parallélisable à l'entraînement.

## Résumé
1. Bagging = bootstrap + moyenne d'arbres profonds : biais inchangé, variance réduite.
2. Var(X̄) = ρσ² + (1 − ρ)σ²/B : plafond ρσ² ; B au-delà de quelques centaines ne sert plus.
3. RF : m features par split ⇒ ρ baisse ⇒ plafond baisse ; petit biais en échange.
4. OOB : 37 % de lignes absentes par arbre ⇒ validation gratuite ≈ CV.
5. Reste : biais d'arbre, calibration, importance biaisée.

**Phrase d'entretien** : « Moyenner des arbres ne change pas leur biais, donc on prend des arbres profonds et on ne travaille que la variance : celle d'une moyenne de B termes corrélés vaut rho sigma carré plus un moins rho sur B, donc elle plafonne à rho sigma carré. Le bagging multiplie B ; la random forest fait baisser rho en ne montrant que quelques features à chaque split, et c'est ce levier-là qui compte. Chaque arbre laisse 37 % des lignes hors sac, ce qui donne une erreur de validation gratuite. »

## Chaîne verbalisée
1. Que fait le bagging au biais, à la variance ? → Rien au biais ; réduit la variance.
2. Var d'une moyenne de B arbres corrélés ? → ρσ² + (1 − ρ)σ²/B ; plafond ρσ².
3. Pourquoi B = 1 000 ne bat pas B = 200 ? → Le terme en 1/B est déjà négligeable ; reste ρσ².
4. Qu'ajoute la random forest ? → m features par split ⇒ ρ baisse ⇒ plafond baisse.
5. D'où sort l'erreur OOB, et quel pourcentage ? → Lignes absentes du bootstrap, 37 % ; prédire chaque ligne par les arbres qui ne l'ont pas vue.

## Ce qui a cassé pour Salah
- Diagnostic : « vocabulaire bagging/boosting manquant » — la chaîne fixe bagging = variance, boosting = biais (p07-03), avec la formule qui rend le premier vérifiable.
- Le 37 % apparaît deux fois (p01-05 bootstrap, ici OOB) : une seule origine, nommée au pas 5.
- t07 (index) : ρσ² + (1 − ρ)σ²/B déjà en carte ; ici c'est la figure 1 qui la rend visible.

## Exclusions
Pas d'ExtraTrees, pas d'importance par permutation au-delà du nom, pas de proximités RF.
