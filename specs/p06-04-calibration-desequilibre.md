---
id: p06-04
series: chain
part: "06"
number: "04"
slug: calibration-desequilibre
title: Scores, calibration, déséquilibre
subtitle: évaluer — un bon classement n'est pas une bonne probabilité, et rééquilibrer casse la seconde
prereq: [p06-03, p05-02, p00-03]
anki: [ml::calibration, ml::brier, ml::desequilibre, ml::seuil-cout]
bridges: []
next: p07-01
status: stub
---

## Question de la chaîne
Un modèle à AUC 0,95 prédit 0,8 : y a-t-il 80 % de chances ? Pourquoi sur-échantillonner les positifs fausse les probabilités, et dans quel ordre intervenir sur un déséquilibre.

## Prérequis
- p06-03 : score, seuil, ROC/PR.
- p00-03 : Bayes en cotes, base rate.
- p05-02 : sigmoïde, séparation frontière/seuil.

## Hypothèses posées
- H1 : discrimination (classer) et calibration (dire des probabilités justes) sont deux propriétés **indépendantes** : on peut avoir l'une sans l'autre.
- H2 : les coûts d'un FP et d'un FN sont connus ou estimables — sinon le seuil n'est pas définissable.

## Exemple fil rouge
Calibration : parmi les 1 000 transactions auxquelles le modèle donne p ≈ 0,8, 640 sont des fraudes ⇒ fréquence observée 0,64 : surconfiant. Diagramme de fiabilité : abscisse p prédite (bins), ordonnée fréquence observée ; parfait = diagonale.
Brier = moyenne de (p − y)² : Gini du nœud en p03-01 ; mesure calibration **et** discrimination.
Décalage de prior : modèle entraîné sur un jeu rééquilibré à 50/50 sort p = 0,8 (cote 4) ; prévalence réelle 1 % ⇒ cote vraie = 4 × (0,01/0,99)/(0,5/0,5) = 0,0404 ⇒ p = **0,039**. Le 0,8 n'a jamais été une probabilité pour la population réelle.
Seuil par coûts : c_FP = 1 (vérification manuelle), c_FN = 50 (fraude passée) ⇒ prédire positif si p > c_FP/(c_FP + c_FN) = 1/51 = 0,0196.

## Pas de la chaîne
1. **Le décor.** Un score sert à deux choses : ranger (qui vérifier en premier) et décider (combien de fraudes attendues, quel seuil). AUC ne parle que de la première.
2. **Discrimination vs calibration** [tronc]. Discrimination : les positifs ont-ils des scores plus hauts ? (AUC). Calibration : parmi les cas à p ≈ 0,8, 80 % sont-ils positifs ? Une transformation monotone des scores (p ↦ p²) conserve l'AUC et détruit la calibration. Au tableau : « L'AUC ne dépend que de l'ordre des scores, donc toute transformation croissante la conserve, donc elle ne dit rien de la valeur des scores, donc la calibration est une propriété séparée. »
3. **Mesurer la calibration.** Diagramme de fiabilité (bins de p vs fréquence observée) ; Brier = E[(p − y)²] qui se décompose en calibration + discrimination + bruit (nommer) ; log-loss aussi sensible à la calibration. Quand on **utilise** les p (attentes, coûts, seuils par coût), c'est ça qu'il faut regarder.
4. **Recalibrer.** Platt : une logistique sur le score (deux paramètres, monotone, robuste avec peu de données). Isotonique : fonction monotone par paliers (flexible, demande plus de données, overfit possible). Toujours sur un jeu **séparé** de l'entraînement (validation), sinon fuite (p06-02).
5. **Rééquilibrer fausse les probabilités** [tronc]. Sur-échantillonner les positifs (ou pondérer) change la prévalence vue par le modèle ⇒ ses p sont des posteriors pour la **mauvaise** prévalence. Correction exacte pour un décalage de prior : cote_vraie = cote_modèle × (π_vraie/(1 − π_vraie)) / (π_train/(1 − π_train)) : 0,8 devient 0,039. Au tableau : « Le modèle apprend le posterior sous la prévalence d'entraînement, donc changer cette prévalence multiplie la cote par un facteur fixe, donc les probabilités sorties sont fausses pour la population réelle et doivent être corrigées par le rapport des cotes de prévalence. »
6. **Ordre d'intervention sur un déséquilibre** [tronc]. (1) Le **seuil** : gratuit, réversible, dérivé des coûts (p* = c_FP/(c_FP + c_FN)) ; sur un modèle calibré c'est la décision optimale. (2) Les **poids** de classe : même effet qu'un rééchantillonnage sans dupliquer, à recalibrer. (3) Le **rééchantillonnage** : sous-échantillonner jette de l'information ; sur-échantillonner duplique ; SMOTE invente des points entre positifs et casse la structure. Au tableau : « Le seuil transforme la décision sans toucher au modèle ni aux données, donc on commence par lui ; les poids déplacent la prévalence apprise et exigent une recalibration ; le rééchantillonnage détruit ou invente des données, donc il vient en dernier. »
7. **Réversibilité.** Un seuil se change en production en une ligne ; un rééchantillonnage impose un réentraînement et une recalibration. Choisir l'intervention qu'on peut défaire.
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot`** : diagramme de fiabilité de deux modèles simulés (un calibré, un surconfiant p ↦ σ(3·logit p)) avec la diagonale ; readouts AUC (identiques) et Brier (différents). Légende : même AUC, calibrations opposées.
- **Figure 2 — `plot` + `slider` π_train ∈ [0,3 % ; 50 %]** (π_vraie = 0,3 %) : p_modèle ↦ p_vraie par la correction de cotes ; marque 0,8 → 0,039 à π_train = 50 %. Légende : ce que vaut vraiment un 0,8 sorti d'un jeu rééquilibré.
- **Figure 3 — `plot` + `slider` c_FN/c_FP ∈ [1, 200]** : seuil optimal p* et coût total attendu sur les scores du fil rouge de p06-03 en fonction du seuil ; minimum marqué. Légende : le seuil se déduit des coûts ; il n'y a rien à « rééquilibrer ».

## Où ça casse
- **Calibrer sur le train** : fuite ; calibrer sur validation.
- **Coûts inconnus** : pas de seuil optimal ; rapporter la courbe PR entière et laisser le métier choisir.
- **Décalage de prévalence en production** (drift) : les p se décalent ; surveiller la fréquence observée par bin.
- **Arbres et RF** : scores mal calibrés par construction (feuilles, moyennes de votes) ; toujours recalibrer avant d'utiliser leurs p.

## Résumé
1. AUC = ordre ; calibration = valeur ; indépendantes.
2. Fiabilité (bins) et Brier mesurent la calibration ; Platt / isotonique la réparent, sur validation.
3. Rééquilibrer change la prévalence apprise ⇒ p fausses ; correction par rapport des cotes de prévalence (0,8 → 0,039).
4. Ordre : seuil (coûts, réversible) > poids (à recalibrer) > rééchantillonnage (destructif, SMOTE invente).
5. p* = c_FP/(c_FP + c_FN) sur un modèle calibré.

**Phrase d'entretien** : « L'AUC ne dépend que de l'ordre des scores ; la calibration est une propriété séparée qu'on lit sur un diagramme de fiabilité et qu'on répare par Platt ou isotonique sur un jeu de validation. Rééquilibrer les classes fausse les probabilités parce que le modèle apprend le posterior sous une autre prévalence : la cote doit être corrigée du rapport des prévalences. Sur un déséquilibre, je commence par le seuil dérivé des coûts, réversible et gratuit, avant les poids, et le rééchantillonnage en dernier. »

## Chaîne verbalisée
1. AUC 0,95, p = 0,8 : 80 % de chances ? → Pas nécessairement ; AUC = ordre, calibration = valeur.
2. Comment mesurer et réparer la calibration ? → Fiabilité, Brier ; Platt / isotonique sur validation.
3. Un modèle entraîné à 50/50 sort 0,8 ; prévalence 1 % : p vraie ? → Cote 4 × 0,0101 = 0,04 ⇒ 0,039.
4. Ordre d'intervention sur un déséquilibre, et pourquoi ? → Seuil (réversible) > poids (recalibrer) > rééchantillonnage (destructif).
5. Seuil optimal avec c_FN = 50 c_FP ? → 1/51 ≈ 0,02.

## Ce qui a cassé pour Salah
- Anki 16/09 : carte « MSE vs log-loss » corrigée d'une prémisse « calibration » fausse, Brier propre — le pas 3 relie Brier à Gini (p03-01) sans réintroduire l'erreur.
- t06 (index) : « seuil > poids > rééchantillonnage », « SMOTE casse la prévalence », « réversibilité » en cartes ; la chaîne donne le mécanisme du décalage de prior (pas 5) qui les justifie.

## Exclusions
Pas de décomposition du Brier détaillée, pas de température scaling au-delà du nom (Phase 3), pas de cost-sensitive learning au-delà du seuil.
