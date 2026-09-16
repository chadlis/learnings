---
id: p07-01
series: chain
part: "07"
number: "01"
slug: arbres-impurete
title: Arbres — impureté, split, profondeur
subtitle: ISLR ch. 8 — un arbre est une suite de questions choisies gloutonnement sur un dôme
prereq: [p03-01, p00-03]
anki: [ml::arbres, ml::gini, ml::entropie, ml::profondeur]
bridges: [b05]
next: p07-02
status: ready
---

## Question de la chaîne
Comment un arbre choisit sa question, pourquoi sur Gini ou l'entropie et pas sur l'accuracy, ce que la profondeur achète et coûte, et pourquoi l'erreur train tombe à zéro.

## Prérequis
- p03-01 : tente vs dôme ; Gini et entropie voient tout split ; surrogate. **Ne pas redémontrer.**
- p00-03 : proportions dans un nœud.

## Hypothèses posées
- H1 : splits **axiaux** (une feature, un seuil) ; l'arbre partitionne l'espace en rectangles.
- H2 : recherche **gloutonne** : le meilleur split maintenant, sans regarder deux niveaux plus loin.

## Exemple fil rouge
8 points en 1D, x = 1…8, y = (0, 0, 0, 1, 0, 1, 1, 1). Parent 4/4, Gini 0,5.
Seuil 3,5 : gauche (3 zéros) pur, droite (1 zéro, 4 uns) Gini 2·0,2·0,8 = 0,32 ⇒ pondéré 5/8·0,32 = 0,20 ⇒ **gain 0,30**.
Seuil 4,5 : gauche (3, 1) 0,375, droite (1, 3) 0,375 ⇒ gain 0,125. Le split 3,5 gagne.
Gini en deux tirages : dans la feuille droite, tirer un point et une étiquette au hasard selon (0,2 ; 0,8) ⇒ P(erreur) = 0,2·0,8 + 0,8·0,2 = 0,32. Entropie = surprise moyenne : −0,2 log₂ 0,2 − 0,8 log₂ 0,8 = 0,722 bit.
Ensuite : la feuille droite se coupe en 4,5 (isole le 0 de x = 5) puis tout est pur : erreur train 0 en profondeur 3. Seul un doublon contradictoire (deux x égaux, y différents) empêche le zéro.

## Pas de la chaîne
1. **Le décor.** Un arbre pose des questions « x_j ≤ s ? » et prédit dans chaque feuille. Tout est dans : quelle question, quand s'arrêter.
2. **Le critère : impureté d'un nœud** [tronc]. Gini G = 1 − Σ pₖ² (deux tirages : probabilité de se tromper en étiquetant au hasard selon les proportions) ; entropie H = −Σ pₖ log pₖ (surprise moyenne). Les deux sont des dômes (p03-01) : ils voient toute purification, l'accuracy non. Au tableau : « Gini est la probabilité d'erreur de deux tirages dans le nœud, l'entropie la surprise moyenne, donc les deux sont maximales à l'équilibre et nulles sur une feuille pure, et concaves, donc tout split qui sépare est vu. »
3. **Le gain d'un split.** gain = I(parent) − [w_L I(L) + w_R I(R)] ; positif dès que les proportions changent. Fil rouge : 0,30 contre 0,125.
4. **La recherche** [tronc]. Pour chaque feature, trier, essayer chaque seuil entre deux valeurs consécutives : O(p · n log n) par nœud. Prendre le meilleur, récurser sur chaque enfant. Glouton : un split médiocre maintenant peut ouvrir un excellent split après, l'arbre ne le verra pas (XOR). Au tableau : « À chaque nœud on énumère features et seuils, on garde le gain maximal et on recommence dans chaque enfant, donc la construction est gloutonne, donc localement optimale et globalement non. »
5. **Profondeur = variance** [tronc]. Chaque niveau divise les effectifs des feuilles par ~2 ; les feuilles profondes reposent sur quelques points, donc changent d'un tirage à l'autre. Erreur train → 0 (sauf doublons contradictoires) : un arbre non contraint **mémorise**. Contrôles : profondeur max, effectif min par feuille, gain min ; élagage au **taux d'erreur** sur validation (on mesure, on n'apprend plus — p03-01). Au tableau : « Chaque split réduit l'effectif des feuilles, donc les feuilles profondes reposent sur peu de points, donc elles suivent le tirage, donc la profondeur est un bouton de variance, réglé par validation. »
6. **Régression.** Impureté = variance intra-feuille (MSE), prédiction = moyenne de la feuille ; la prédiction est constante par morceaux, jamais extrapolée hors du support.
7. **Ce qu'un arbre sait et ne sait pas.** Sait : non-linéarités, interactions, features hétérogènes sans standardisation, valeurs manquantes (surrogate splits). Ne sait pas : frontières obliques (escaliers), extrapolation, stabilité (un point déplacé change l'arbre). Importance = gain total par feature, biaisée vers les features à beaucoup de seuils (nommer).
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` seuil s ∈ [1,5 ; 7,5]** : les 8 points sur l'axe colorés par y, le seuil en trait, Gini de chaque côté et gain en readout ; courbe du gain en fonction de s au-dessus (maximum en 3,5). Légende : l'arbre essaie tous les seuils et prend le maximum.
- **Figure 2 — SVG custom (l'arbre qui pousse)** : bouton « split suivant » : le nœud racine se coupe en 3,5, puis la feuille droite en 4,5, puis en 5,5 ; effectifs et Gini affichés dans chaque nœud ; erreur train en readout (4/8 → 1/8 → 0). Légende : profondeur 3, erreur train 0, feuilles à 1 point.
- **Figure 3 — `repeat` + `slider` profondeur max ∈ [1, 8]** : 40 points 2D tirés (deux classes en croissants), arbre ajusté (implémentation JS minimale), frontière dessinée ; à chaque tirage la frontière se redessine. Légende : profondeur 1–2, frontières stables ; profondeur 8, frontières qui changent à chaque tirage.

## Où ça casse
- **XOR / interactions pures** : aucun split unique n'a de gain ; le glouton ne démarre pas (ou par hasard).
- **Frontière oblique** : escalier de splits axiaux, profond et instable ; un modèle linéaire fait mieux.
- **Extrapolation** : constante hors du support.
- **Instabilité** : un point déplacé change le premier split et tout l'arbre — c'est ce que bagging répare (p07-02).

## Résumé
1. Impureté : Gini (deux tirages), entropie (surprise moyenne) ; dômes ⇒ tout split est vu.
2. Gain = impureté parent − impureté pondérée des enfants ; recherche exhaustive sur (feature, seuil), gloutonne.
3. Profondeur = variance ; erreur train → 0 sauf doublons contradictoires ; contrôle par validation, élagage au taux d'erreur.
4. Régression : variance intra-feuille, prédiction = moyenne, pas d'extrapolation.
5. Sait : non-linéaire, interactions, hétérogène ; ne sait pas : oblique, extrapoler, être stable.

**Phrase d'entretien** : « Un arbre choisit à chaque nœud la feature et le seuil qui réduisent le plus l'impureté — Gini, la probabilité d'erreur de deux tirages, ou l'entropie, la surprise moyenne — parce que ces critères concaves voient toute purification alors que l'accuracy ne voit que les basculements. La construction est gloutonne ; la profondeur divise les effectifs des feuilles et fait monter la variance jusqu'à mémoriser, d'où la limite de profondeur ou l'élagage sur validation, au taux d'erreur puisqu'on ne fait plus qu'évaluer. »

## Chaîne verbalisée
1. Gini de (1 zéro, 4 uns), en deux tirages ? → 0,2·0,8 + 0,8·0,2 = 0,32.
2. Gain du split 3,5 sur le fil rouge ? → 0,5 − 5/8·0,32 = 0,30.
3. Pourquoi pas l'accuracy comme critère ? → Tente : gain nul sans basculement (p03-01) ; Gini/entropie sont des surrogates, l'erreur sert à élaguer.
4. Pourquoi l'erreur train tombe à 0 ? → Splits jusqu'aux feuilles pures ; seuls les doublons contradictoires résistent.
5. Que règle la profondeur ? → La variance : feuilles à peu de points ⇒ arbre qui suit le tirage.

## Ce qui a cassé pour Salah
- 16/09 : Gini reconstruit seul en « deux tirages », entropie en « surprise moyenne », tente/dôme — ce vocabulaire est celui de la chaîne (pas 2). Réponse d'entretien « Gini vs accuracy » jamais dite à voix haute : maillon 3.
- Q11.1 (10/09) : Gini vs accuracy — renvoyer à p03-01, ne pas redémontrer.
- Scope acté : pas d'élagage CCP (cost-complexity) au-delà de « élaguer au taux d'erreur sur validation ».

## Exclusions
Pas de CCP/alpha, pas de surrogate splits détaillés, pas de calcul d'importance par permutation, pas de XGBoost (p07-03 au niveau principe).
