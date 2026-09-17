---
id: p06-03
series: chain
part: "06"
number: "03"
slug: seuil-roc-pr
title: Seuil, matrice de confusion, ROC, PR
subtitle: évaluer — un score devient une décision par un seuil, et chaque métrique regarde une colonne
prereq: [p00-03, p01-01]
anki: [ml::metriques, ml::roc-auc, ml::precision-rappel, ml::desequilibre]
bridges: [b05]
next: p06-04
status: ready
---

## Question de la chaîne
Un modèle de fraude affiche 98,98 % d'accuracy : est-ce bon ? Que se passe-t-il quand on baisse le seuil, quelle métrique dépend de la prévalence, et quand regarder ROC plutôt que PR ?

## Prérequis
- p00-03 : sensibilité, spécificité, VPP ; le base rate.
- p01-01 : une proportion a un SE ; le rappel est une Bernoulli sur les positifs.

## Hypothèses posées
- H1 : le modèle sort un **score** ; la décision est score ≥ seuil. Les métriques de décision dépendent du seuil, les métriques de classement (AUC) non.
- H2 : la prévalence du test set est celle de la production (sinon précision et accuracy ne se transportent pas, p00-03).

## Exemple fil rouge
100 000 transactions, 300 fraudes (0,3 %). Au seuil courant : TP = 240, FN = 60, FP = 960, TN = 98 740.
- Accuracy = (240 + 98 740)/100 000 = **98,98 %**. Modèle trivial « jamais fraude » : 99,70 %. L'accuracy dit que le modèle est **pire que rien**.
- Rappel (TPR) = 240/300 = 0,80 · FPR = 960/99 700 = 0,0096 · Précision = 240/1 200 = 0,20 · Spécificité = 0,9904.
- Baisser le seuil : TP ↑ (jusqu'à 300), FN ↓, FP ↑, TN ↓ ; rappel ↑, FPR ↑, précision ↓ en général.
- Baseline PR = prévalence = 0,003 (un classement au hasard a une précision de 0,3 %) ; baseline ROC = la diagonale.

## Pas de la chaîne
1. **Le décor.** Le modèle ne dit pas « fraude », il donne un score. Quelqu'un choisit un seuil ; à partir de là, quatre cases.
2. **La matrice, en effectifs** [tronc]. Lignes = vérité (300 / 99 700), colonnes = décision. TP, FN sur la ligne des positifs ; FP, TN sur celle des négatifs. Toute métrique est un rapport de cases ; nommer laquelle. Au tableau : « Une décision binaire contre une vérité binaire donne quatre cases, donc chaque métrique est une case divisée par une somme de cases, donc il faut dire laquelle avant de la lire. »
3. **Les « rates » regardent une ligne de vérité.** TPR = rappel = TP/(TP + FN) : parmi les vrais positifs. FPR = FP/(FP + TN) : parmi les vrais négatifs. Elles ne dépendent **pas** de la prévalence (chaque ligne est normalisée par elle-même) ; ce sont les propriétés du test de p00-03. Au tableau : « Une rate divise par le total de sa ligne, donc elle est calculée à l'intérieur d'une classe, donc changer la taille des classes ne la change pas. »
4. **La précision regarde une colonne de décision — sans TN** [tronc]. Précision = TP/(TP + FP) : parmi ceux qu'on a déclarés positifs. Les TN n'y sont pas ; les FP viennent de la classe majoritaire, donc la précision **dépend de la prévalence** : 960 FP sur 99 700 négatifs à 1 % d'erreur écrasent 240 TP. C'est la VPP de p00-03. Au tableau : « La précision divise par une colonne de décision où les négatifs entrent par leurs faux positifs, donc plus les négatifs sont nombreux plus la précision baisse, donc elle ne se transporte pas entre populations. »
5. **L'accuracy et le modèle trivial.** Accuracy = (TP + TN)/n : dominée par TN quand la prévalence est faible. Le trivial fait 99,7 % ; 98,98 % est une régression. Toujours comparer au trivial ; à 0,3 % de prévalence, l'accuracy ne dit rien.
6. **Le seuil bouge tout dans un sens connu** [tronc]. Baisser le seuil : on déclare plus de positifs ⇒ TP ↑, FP ↑, FN ↓, TN ↓ ⇒ rappel ↑, FPR ↑, précision ↓ (sauf si les nouveaux positifs sont surtout vrais). Le seuil est une décision **métier** (coût d'un FN vs d'un FP, p06-04), pas une propriété du modèle. Au tableau : « Baisser le seuil déplace des lignes de la colonne négative vers la positive, donc TP et FP montent ensemble, donc rappel et FPR montent et la précision descend. »
7. **ROC : TPR contre FPR pour tous les seuils.** Une courbe par modèle, indépendante de la prévalence ; l'aire AUC = P(score d'un positif > score d'un négatif) : une métrique de **classement**. Diagonale = hasard. Deux modèles se comparent sur toute la courbe, pas à un seuil.
8. **PR : précision contre rappel.** Sensible à la prévalence ; baseline = prévalence. Quand la classe positive est rare et que c'est elle qu'on cherche, la ROC est trompeusement flatteuse (FPR minuscule même avec 960 FP) ; la PR montre la précision de 0,20. Règle : classe rare et coût des FP élevé ⇒ PR ; sinon ROC.
9. **Barres d'erreur.** Rappel = 240/300 : SE = √(0,8·0,2/300) = 0,023 (p01-01, n = nombre de positifs). Précision = 240/1 200 : SE = 0,012. Deux modèles à 0,80 et 0,83 de rappel sur 300 positifs sont dans le bruit.
10. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom via `plot` (matrice interactive)** : deux distributions de scores (positifs, négatifs ; effectifs 300 et 99 700, dessinés en densité) avec un `slider` seuil ; la matrice de confusion se remplit en effectifs, readouts accuracy, rappel, FPR, précision, et « trivial : 99,70 % ». Légende : baisse le seuil, regarde quelles cases bougent.
- **Figure 2 — `plot`** : la ROC tracée en direct par le même slider (point courant marqué), AUC en readout ; bouton « mélanger les scores » qui rapproche les distributions (AUC → 0,5). Légende : la courbe est le seuil qu'on fait glisser.
- **Figure 3 — `plot`** : la PR du même modèle, baseline 0,003 en pointillé, point courant marqué ; `slider` prévalence ∈ [0,1 % ; 50 %] qui redessine la PR (la ROC, affichée à côté, ne bouge pas). Légende : la PR voit la prévalence, la ROC non.

## Où ça casse
- **Prévalence du test ≠ production** : précision et accuracy changent, TPR et FPR non (p00-03). Ré-estimer avec la prévalence cible.
- **AUC élevée, précision nulle** : classe rare ; l'AUC compare des paires, pas des décisions.
- **F1** = moyenne harmonique précision/rappel à un seuil : dépend du seuil et de la prévalence, ignore les TN ; utile pour résumer, jamais pour choisir un seuil sans coûts.
- **Métriques en marches** : accuracy, F1, rappel à un seuil ne servent qu'à évaluer ; on n'apprend pas avec (p03-01).

## Résumé
1. Quatre cases en effectifs ; chaque métrique = une case sur une somme, nommée.
2. Rates (TPR, FPR) : par ligne de vérité, indépendantes de la prévalence. Précision : par colonne de décision, sans TN, dépendante de la prévalence.
3. Accuracy : dominée par TN ; comparer au trivial (99,7 % ici contre 98,98 %).
4. Baisser le seuil : TP FP ↑, FN TN ↓ ⇒ rappel FPR ↑, précision ↓ ; le seuil est un choix métier.
5. ROC = classement, AUC = P(s₊ > s₋), insensible à la prévalence ; PR = décision, baseline = prévalence, à préférer si la classe rare est la cible.
6. Rappel sur 300 positifs : SE 0,023 ; les écarts de 3 points sont du bruit.

**Phrase d'entretien** : « À 0,3 % de fraude, 98,98 % d'accuracy est pire que le modèle qui ne détecte rien. Je regarde les cases : rappel 0,80 sur les 300 fraudes, FPR 1 % sur les 99 700 légitimes, mais précision 0,20 parce que les faux positifs viennent de la classe majoritaire — la précision n'a pas de vrais négatifs et dépend de la prévalence. Le seuil déplace tout dans un sens connu ; la ROC compare le classement indépendamment de la prévalence, et la PR montre ce que vaut la décision quand la classe rare est celle qu'on cherche. »

## Chaîne verbalisée
1. 98,98 % d'accuracy à 0,3 % de prévalence : verdict ? → Pire que le trivial (99,7 %) ; l'accuracy ne dit rien.
2. Quelles métriques ne dépendent pas de la prévalence, et pourquoi ? → TPR, FPR : normalisées par ligne de vérité.
3. Pourquoi la précision en dépend ? → Divise par une colonne de décision ; pas de TN ; les FP viennent des négatifs.
4. Que fait baisser le seuil ? → TP FP ↑, FN TN ↓ ; rappel FPR ↑, précision ↓.
5. Que mesure l'AUC, et quand préférer la PR ? → P(s₊ > s₋) ; classe rare ciblée et FP coûteux ⇒ PR.
6. SE du rappel 240/300 ? → √(0,8·0,2/300) = 0,023.

## Ce qui a cassé pour Salah
- Q5 (10/09) puis 16/09 : « précision sans TN ⇒ sensible à la prévalence » — mécanisme tenu le 16/09 ; ici pas 4, avec les effectifs de sa séance (240/60/960). Le rappel oublié dans la liste des métriques et les unités : pas 2 exige de nommer les cases, pas 3 le rappel.
- 16/09 : accuracy 98,98 % < trivial 99,7 % — pas 5, ses chiffres.
- Wald sur le rappel (16/09) : pas 9, avec n = nombre de positifs.

## Exclusions
Pas de DeLong, pas de courbes de coût, pas de multi-classe (macro/micro) au-delà d'une phrase.
