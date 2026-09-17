---
id: p06-04
series: chain
part: "06"
number: "04"
slug: calibration-desequilibre
title: Scores, calibration, déséquilibre — que vaut un 0,8 ?
subtitle: évaluer — discriminer n'est pas être calibré, et le déséquilibre se traite par le seuil avant tout
prereq: [p06-03, p02-01, p00-03]
anki: [ml::calibration, ml::brier, ml::desequilibre, ml::seuil]
bridges: [b05]
next: p07-01
status: ready
---

## Question de la chaîne
Quand un modèle dit 0,8, est-ce que 80 % de ces cas sont positifs ? Pourquoi un modèle peut classer parfaitement et se tromper sur toutes ses probabilités ? Et pourquoi rééchantillonner casse justement cela ?

## Prérequis
- p06-03 : score → seuil → décision ; ROC = classement.
- p02-01 : la log-loss est la NLL d'une Bernoulli : elle mesure la qualité des **probabilités**.
- p00-03 : prévalence et VPP.

## Hypothèses posées
- H1 : on veut des probabilités **utilisables** : pour un seuil de coût, un tri, une décision par espérance.
- H2 : la prévalence de production est connue (ou estimée) ; c'est elle que les probabilités doivent refléter.

## Exemple fil rouge
Fraude de p06-03 (0,3 %). Deux modèles avec la même AUC = 0,95 :
- A calibré : parmi les transactions scorées 0,20, 20 % sont des fraudes.
- B, entraîné sur un jeu **rééchantillonné à 50/50** : mêmes scores relatifs (même classement, même AUC), mais scoré 0,50 là où A dit 0,006 : ses probabilités portent une prévalence de 50 %, pas de 0,3 %.
Coûts : FN = 100 €, FP = 1 €. Seuil optimal sur une probabilité calibrée : p* = c_FP/(c_FP + c_FN) = 1/101 = 0,0099. Sur B, ce seuil est faux d'un facteur ~150.
Brier = moyenne des (p − y)² : 0,05 pour A ; 0,25 pour B (les 0,5 sur des négatifs coûtent 0,25 chacun) ; le trivial « p = 0,003 partout » fait 0,003.

## Pas de la chaîne
1. **Le décor.** Deux modèles, même AUC, même classement. L'un sert à décider, l'autre non. Ce qui les sépare n'est pas visible sur la ROC.
2. **Discrimination ≠ calibration** [tronc]. Discriminer = classer les positifs au-dessus des négatifs (AUC). Être calibré = parmi les cas scorés p, une fraction p est positive. Une transformation monotone des scores (×2, exp, rang) conserve la première et détruit la seconde. Au tableau : « L'AUC ne regarde que l'ordre, donc toute transformation croissante la conserve, donc elle ne dit rien de la valeur du score, donc la calibration est une propriété séparée. »
3. **Le diagramme de fiabilité.** Regrouper les prédictions par tranche de score, tracer la fréquence observée contre le score moyen. Diagonale = calibré ; au-dessus = sous-confiant ; au-dessous = sur-confiant. Figure 1. La log-loss et le Brier mesurent la calibration **et** la discrimination ensemble ; l'AUC seulement la seconde.
4. **Brier = MSE sur des probabilités.** Σ(p − y)²/n : le score du modèle trivial est ≈ prévalence(1 − prévalence) ; un modèle doit faire mieux. Décomposable en calibration + résolution (nommer). Log-loss : même rôle, non bornée (une erreur confiante coûte sans limite, p03-01).
5. **Le seuil vient des coûts, si les probabilités sont vraies** [tronc]. Décider positif si p·c_FN > (1 − p)·c_FP ⇔ p > c_FP/(c_FP + c_FN). Fraude : 1/101 ≈ 0,01. Ce calcul n'a de sens que sur une probabilité calibrée. Au tableau : « L'espérance de coût de chaque décision dépend de p, donc le seuil optimal est le point où les deux espérances s'égalent, donc il vaut c_FP sur la somme des coûts, donc il exige un p calibré. »
6. **Rééchantillonner casse la calibration** [tronc]. Sur-échantillonner les positifs (ou SMOTE) déplace la prévalence d'entraînement à 50 % ; le modèle apprend p(y | x) **pour cette prévalence** : ses probabilités sont décalées d'un facteur qui vaut le rapport des cotes (0,997/0,003 × 0,5/0,5 ≈ 332 en cote). Le classement est intact, le seuil de coût est faux, la VPP lue sur les scores est fausse. Au tableau : « Changer la prévalence d'entraînement change le prior que le modèle apprend, donc ses probabilités portent le mauvais prior, donc elles ne sont plus calibrées pour la production. »
7. **Traiter le déséquilibre : seuil > poids > rééchantillonnage.** (a) Ne rien changer aux données, choisir le seuil par coûts ou par PR : gratuit et calibré. (b) Pondérer la loss (class_weight) : équivalent à rééchantillonner **sans** dupliquer, mêmes probabilités décalées, à recalibrer ensuite. (c) Rééchantillonner : dernier recours (très peu de positifs), puis recalibrer sur un jeu à la vraie prévalence. SMOTE invente des points par interpolation : rarement utile avec un modèle non linéaire, et il fabrique des positifs là où il n'y en a pas.
8. **Recalibrer.** Platt : une logistique sur le score, ajustée sur un jeu de validation (2 paramètres, monotone) ; isotonique : une fonction en escalier croissante (plus souple, demande plus de données). Toujours sur des données **non vues** par le modèle et **à la prévalence cible**. Température (softmax/T) : le Platt des réseaux, un seul paramètre.
9. **Réversibilité de l'erreur.** Le seuil se choisit aussi selon ce qui se répare : un FP en fraude coûte un appel ; un FN coûte la fraude. Une décision réversible tolère un seuil bas ; une décision irréversible exige de la précision. C'est l'entrée de c_FN et c_FP.
10. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` (diagramme de fiabilité)** : dix tranches, points (score moyen, fréquence observée) avec taille ∝ effectif, diagonale ; boutons « A calibré / B rééchantillonné / C sur-confiant » ; readouts Brier, log-loss, AUC (identique pour A et B). Légende : même AUC, deux diagrammes.
- **Figure 2 — `plot` + `slider` prévalence d'entraînement ∈ [0,3 % ; 50 %]** : la courbe p_entraînement → p_production (correction par le rapport des cotes) ; readout de p_prod pour un score 0,5. Légende : ce que vaut vraiment un 0,5 appris à 50/50.
- **Figure 3 — `plot` + `slider` c_FN/c_FP ∈ [1, 1 000]** : coût total en fonction du seuil sur les scores calibrés de A ; minimum marqué à c_FP/(c_FP + c_FN) ; bouton « scores de B » qui montre le minimum au mauvais endroit. Légende : le seuil se calcule, si p est vrai.

## Où ça casse
- **Calibré en moyenne, faux par sous-groupe** : la fiabilité globale peut cacher une sur-confiance sur un segment ; vérifier par segment quand la décision y est sensible.
- **Recalibrer sur les données d'entraînement** : le modèle y est sur-confiant, la calibration apprend ce biais.
- **Dérive de prévalence** en production : la calibration est relative à une prévalence ; la surveiller.
- **Coûts inconnus** : sans c_FN, c_FP, le seuil est un choix arbitraire ; la PR ou un budget d'alertes (top-k) remplace le calcul.

## Résumé
1. Discrimination (AUC, ordre) ≠ calibration (valeur des p) ; une transformation monotone conserve l'une, casse l'autre.
2. Diagramme de fiabilité ; Brier = MSE sur p ; log-loss non bornée.
3. Seuil optimal = c_FP/(c_FP + c_FN), sur des p calibrés.
4. Rééchantillonner déplace le prior appris ⇒ p décalées d'un rapport de cotes ; classement intact, décisions fausses.
5. Déséquilibre : seuil > poids > rééchantillonnage ; SMOTE en dernier ; recalibrer sur données non vues à la prévalence cible (Platt, isotonique, température).
6. Réversibilité de l'erreur : ce qui fixe c_FN et c_FP.

**Phrase d'entretien** : « Deux modèles de même AUC peuvent différer du tout au tout sur leurs probabilités : l'AUC ne voit que l'ordre. Une probabilité calibrée permet de calculer le seuil par les coûts, c_FP sur la somme ; rééchantillonner à 50/50 déplace le prior appris et décale toutes les probabilités d'un rapport de cotes, sans toucher au classement. Donc pour un déséquilibre, je change le seuil avant les poids, et les poids avant les données, et je recalibre sur un jeu non vu à la vraie prévalence. »

## Chaîne verbalisée
1. Même AUC, mêmes décisions ? → Non : même ordre, probabilités différentes ; l'AUC ignore la valeur.
2. Que montre un diagramme de fiabilité et que mesure le Brier ? → Fréquence observée vs score ; MSE sur p.
3. D'où vient le seuil optimal ? → Égalité des coûts espérés : c_FP/(c_FP + c_FN), sur p calibré.
4. Que casse le rééchantillonnage ? → Le prior appris ⇒ p décalées d'un rapport de cotes.
5. Ordre des remèdes au déséquilibre ? → Seuil, puis poids, puis données ; recalibrer ensuite.
6. Sur quoi recalibre-t-on ? → Données non vues, prévalence cible ; Platt ou isotonique.

## Ce qui a cassé pour Salah
- t06 avait « SMOTE casse la prévalence ; seuil > poids > rééchantillonnage ; réversibilité » en Q/A ; le pas 6 donne le **mécanisme** (le prior appris) qui manquait, et la figure 2 le chiffre.
- Lien p00-03 (VPP) et p02-03 (prior noyé / prior décisif) : le rééchantillonnage est un prior qu'on impose sans le dire.

## Exclusions
Pas de décomposition du Brier en formules, pas de conformal prediction, pas de calibration multi-classe au-delà de la température.
