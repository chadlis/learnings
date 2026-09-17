---
id: p07-01
series: chain
part: "07"
number: "01"
slug: arbres-impurete
title: Arbres — impureté, split, profondeur
subtitle: arbres et ensembles — un arbre coupe là où l'impureté baisse le plus, et sa profondeur est sa variance
prereq: [p03-01, p00-03, p06-01]
anki: [ml::arbres, ml::gini, ml::profondeur, ml::cart]
bridges: [b05, b03]
next: p07-02
status: reviewed
---

## Question de la chaîne
Comment CART choisit une coupure, pourquoi avec Gini plutôt qu'avec l'accuracy, jusqu'où il coupe, et pourquoi un arbre profond est un modèle à forte variance.

## Prérequis
- p03-01 : tente vs dôme ; Gini = deux tirages ; entropie = surprise moyenne ; surrogate. **Ne pas redémontrer.**
- p06-01 : biais/variance ; le tirage est le dataset.
- p00-03 : proportions dans un nœud.

## Hypothèses posées
- H1 : coupures **axe par axe** (une feature, un seuil) : la frontière est un pavage en rectangles, jamais une diagonale.
- H2 : construction **gloutonne** : on choisit la meilleure coupure locale sans regarder deux coups plus loin ; on ne revient pas.
- H3 : critère : impureté (Gini par défaut) pour classer, variance (RSS) pour régresser.

## Exemple fil rouge
Huit points sur une feature x = 1…8, labels (+, +, −, +, −, −, +, −). Parent : 4 +/4 −, Gini 0,5.
Seuils candidats (entre deux points) et gain Gini : 1,5 → 0,071 ; **2,5 → 0,167** ; 3,5 → 0,033 ; 4,5 → 0,125 ; 5,5 → 0,033 ; 6,5 → 0 ; 7,5 → 0,071. CART coupe à 2,5 : gauche {1, 2} pure, droite 2 +/4 −.
Gain en erreur de classification : 2,5 → 0,25 et 4,5 → 0,25 : **égalité** — l'accuracy ne départage pas (p03-01), Gini si.
Profondeur : aucun doublon ⇒ l'arbre peut isoler chaque point ⇒ erreur train 0. Avec deux points identiques de labels opposés (x = 3 : un + et un −) : impossible à séparer, erreur train minimale 1/n.
Régression : même geste avec la variance des y dans le nœud ; la feuille prédit sa moyenne.

## Pas de la chaîne
1. **Le décor.** Un arbre pose des questions « x_j ≤ t ? » et range chaque point dans une feuille. Deux décisions à chaque nœud : quelle feature, quel seuil. Une décision globale : quand s'arrêter.
2. **Le critère : la baisse d'impureté** [tronc]. Pour chaque (feature, seuil) : impureté du parent − impureté pondérée des enfants. Gini par défaut (p03-01 : dôme, deux tirages, surrogate du Brier) ; entropie presque équivalente ; l'erreur de classification est une tente et ne départage pas. Au tableau : « L'arbre compare toutes les coupures par la baisse d'impureté, donc il lui faut un critère qui voit une purification sans basculement, donc un dôme, donc Gini ou entropie. »
3. **La recherche : trier, balayer.** Par feature : trier les valeurs, essayer chaque seuil entre deux valeurs consécutives en mettant à jour les comptes incrémentalement — O(n log n) par feature et par nœud. C'est pourquoi les arbres n'ont besoin ni de standardiser ni de transformer monotonement : seul l'**ordre** compte.
4. **Glouton et axe par axe** [tronc]. On prend la meilleure coupure maintenant (H2) ; une coupure médiocre qui préparerait une excellente suivante n'est jamais vue (XOR : aucune première coupure ne gagne). Les coupures sont parallèles aux axes (H1) : une frontière diagonale coûte un escalier de coupures. Au tableau : « Chaque nœud choisit sa coupure sans regarder la suite, donc un arbre rate les structures qui n'apparaissent qu'à deux coupures, donc une diagonale ou un XOR lui coûtent cher. »
5. **Jusqu'où couper : la profondeur est la variance** [tronc]. Sans limite, l'arbre isole chaque point (erreur train 0 sauf doublons contradictoires) : il a mémorisé le tirage, sa prédiction change entièrement sur un autre dataset. Profondeur, taille minimale de feuille, nombre de feuilles : ce sont des boutons de **variance** (p06-01, b03). Au tableau : « Un arbre profond a une feuille par point, donc il reproduit le bruit du tirage, donc sa variance est maximale, donc limiter la profondeur ou la taille des feuilles est le réglage de variance. »
6. **Élagage.** Faire pousser à fond puis couper : on évalue au **taux d'erreur** (ou au RSS) sur validation, pas à l'impureté — on mesure, on n'apprend plus (p03-01, surrogate). L'élagage coût-complexité (α) est le nom ; l'idée est celle du U de p06-01.
7. **Régression.** Même algorithme, impureté = variance des y du nœud ; feuille = moyenne. La prédiction est en marches : un arbre ne peut ni extrapoler ni produire une valeur hors du support des y vus.
8. **Ce qu'un arbre sait faire.** Non-linéarités et interactions sans les spécifier, mélange de types de features, valeurs manquantes (surrogate splits, nommer), aucune standardisation. Interprétable à faible profondeur ; instable (un point déplacé change la première coupure et tout l'arbre) — c'est ce que le bagging répare (p07-02).
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` seuil ∈ [1,5 ; 7,5]** : les huit points sur un axe avec leurs labels, la coupure mobile, readouts Gini gauche/droite/pondérée et gain, gain en erreur de classification à côté ; courbe du gain Gini en fonction du seuil avec le maximum à 2,5. Légende : deux seuils à égalité pour l'accuracy, un seul pour Gini.
- **Figure 2 — SVG custom via `plot` (l'arbre qui pousse)** : nuage 2D de 40 points, deux classes, bouton « coupure suivante » : chaque clic ajoute la meilleure coupure gloutonne, la partition rectangulaire se dessine, readouts profondeur et erreur train ; à la fin chaque point est isolé. Bouton « nouveau tirage » : le même arbre à profondeur 6 recalculé sur un autre échantillon change du tout au tout. Légende : la profondeur mémorise le tirage.
- **Figure 3 — `plot`** : erreur train et erreur test (simulation) en fonction de la profondeur 1…12 sur le nuage de la figure 2 ; le U. Légende : la profondeur est le bouton de variance.

## Où ça casse
- **XOR / diagonales** : le glouton ne voit pas ce qui demande deux coupures ; les ensembles compensent en partie, pas les rotations.
- **Extrapolation** : marches constantes hors du support ; un arbre de régression ne suit pas une tendance.
- **Instabilité** : petite perturbation ⇒ arbre différent ; interprétation d'un arbre unique à prendre avec prudence.
- **Classes déséquilibrées** : Gini favorise la classe majoritaire dans les feuilles ; poids de classe ou seuil (p06-04).

## Résumé
1. Coupure = (feature, seuil) qui maximise la baisse d'impureté ; Gini (dôme), pas l'accuracy (tente).
2. Recherche par tri et balayage : seul l'ordre des valeurs compte ; pas de standardisation.
3. Glouton, axe par axe : rate XOR et diagonales.
4. Profondeur = variance ; sans limite, erreur train 0 (sauf doublons contradictoires) ; profondeur / taille de feuille sont les boutons.
5. Élagage au taux d'erreur sur validation (on mesure, on n'apprend plus).
6. Régression : variance du nœud, feuille = moyenne, prédiction en marches, pas d'extrapolation.

**Phrase d'entretien** : « Un arbre choisit à chaque nœud la coupure axe par axe qui fait le plus baisser l'impureté — Gini, parce que l'erreur de classification est une tente qui ne voit pas une purification sans basculement. Il est glouton, donc aveugle aux structures à deux coupures, et sa profondeur est son bouton de variance : à fond il isole chaque point et mémorise le tirage. On l'élague au taux d'erreur, sur des données non vues. »

## Chaîne verbalisée
1. Comment CART choisit une coupure ? → Pour chaque feature et seuil, baisse d'impureté ; la plus grande.
2. Pourquoi Gini et pas l'accuracy ? → Dôme vs tente ; 2,5 et 4,5 à égalité en accuracy, pas en Gini.
3. Pourquoi ne pas standardiser avant un arbre ? → Seul l'ordre des valeurs compte.
4. Que rate un arbre glouton ? → XOR, diagonales : ce qui demande deux coupures.
5. Quel est le bouton de variance ? → Profondeur / taille de feuille ; à fond, erreur train 0 et mémorisation.
6. Sur quel critère élaguer ? → Taux d'erreur ou RSS sur validation ; l'impureté sert à apprendre, pas à mesurer.

## Ce qui a cassé pour Salah
- Q11.1 (Gini vs accuracy) : tenue le 16/09 ; ici le pas 2 renvoie à p03-01 et la figure 1 montre l'égalité en accuracy sur **ses** huit points — ne pas redémontrer.
- « Erreur train nulle sauf doublons contradictoires » (t07) : pas 5, chiffré.
- Scope : élagage CCP exclu au-delà du nom (10/09).

## Exclusions
Pas d'élagage coût-complexité détaillé, pas de surrogate splits au-delà du nom, pas de CHAID/C4.5, pas d'importance des features (p07-02).

## Questions pour la revue
- **Tous les chiffres du fil rouge sont vérifiés et justes** (script Python, fractions exactes) :
  gains Gini 1,5 → 1/14 = 0,071 · 2,5 → 1/6 = 0,167 · 3,5 → 1/30 = 0,033 · 4,5 → 1/8 = 0,125 ·
  5,5 → 1/30 = 0,033 · 6,5 → 0 · 7,5 → 1/14 = 0,071 ; gain en erreur de classification 0,250 à
  2,5 **et** à 4,5, donc égalité au sommet. Aucune correction à apporter au spec.
- **Figures 2 et 3 : la frontière vraie est un coin (x < 0,40 ou y > 0,70), pas une diagonale.**
  Le spec ne fixait pas la loi du nuage. Testé : avec une frontière diagonale le U de la figure 3
  est plat (0,332 → 0,270 → 0,278, soit 0,008 d'amplitude) et ne se lit pas. Avec le coin et 12 %
  d'étiquettes retournées, le U est net (0,292 → **0,182** à la profondeur 2 → 0,244 à 12).
  Le prix payé : la figure 2 ne montre plus l'escalier des coupures le long d'une diagonale.
  Le coût de la diagonale est donc traité **au pas 4, chiffré** (1/(2k) d'aire d'erreur pour k
  marches, donc k = 50 pour 1 %) plutôt qu'en figure. À valider.
- **Le minimum du U tombe à la profondeur 2** sur une échelle 1…12 : le creux est très à gauche.
  C'est le régime honnête pour n = 40 ; augmenter n déplacerait le creux vers la droite mais
  éloignerait la figure 3 du nuage de la figure 2. Gardé tel quel.
- **« Isoler chaque point »** (pas 5 du spec) : l'arbre coupe jusqu'à ce que chaque *feuille* soit
  pure, ce qui ne fait une feuille par point qu'à la limite. La sheet écrit « il finit par isoler
  les points », et le compteur « feuilles » de la figure 2 montre 12 feuilles pour 40 points à
  erreur train nulle. Formulation à confirmer.
- **Instabilité du pas 8** : l'exemple chiffré retenu n'est pas un point *déplacé* mais le point
  x = 3 *retiré* — c'est la perturbation minimale qui change effectivement la racine
  (2,5 → 4,5, gain 0,167 → 0,276). Un simple déplacement ne change rien tant que l'ordre tient,
  ce qui est justement le pas 3.

**Arbitrage de revue 5, 17/09 — validé 17/09.** Aucun chiffre du spec n'était faux (les
sept gains Gini et l'égalité à 0,250 en accuracy entre les seuils 2,5 et 4,5 sont exacts).
**Frontière vraie en coin validée** — avec une diagonale le U est plat (0,008 d'amplitude,
mesuré) et la figure ne montrerait rien ; le coût de la diagonale est chiffré au pas 4
(1/(2k)) au lieu d'être dessiné. **Creux du U à la profondeur 2 validé** comme régime
honnête à n = 40. Reformulations **validées** : « couper jusqu'à ce que chaque feuille soit
pure » plutôt que « isoler chaque point », et l'instabilité du pas 8 posée sur un point
**retiré** et non déplacé. Statut `reviewed`.
