---
id: p06-03
series: chain
part: "06"
number: "03"
slug: seuil-roc-pr
title: Seuil, matrice de confusion, ROC, PR
subtitle: évaluer — ce qui bouge quand on baisse le seuil, et pourquoi la précision dépend de la prévalence
prereq: [p00-03, p05-02]
anki: [ml::metriques, ml::roc-auc, ml::pr-auc, ml::seuil]
bridges: []
next: p06-04
status: stub
---

## Question de la chaîne
Sur 100 000 transactions avec 300 fraudes, un modèle à 98,98 % d'accuracy est-il bon ? Que voit ROC, que voit PR, et pourquoi.

## Prérequis
- p00-03 : sensibilité, spécificité, VPP ; base rate.
- p05-02 : un score p et un seuil.

## Hypothèses posées
- H1 : le modèle produit un **score** ; la décision est un seuil s. Les métriques à seuil (accuracy, précision, rappel, F1) dépendent de s ; ROC et PR le balaient.
- H2 : prévalence π = 300/100 000 = 0,3 %.

## Exemple fil rouge
Seuil courant : TP = 240, FN = 60, FP = 960, TN = 98 740.
Accuracy = (240 + 98 740)/100 000 = **98,98 %** — le modèle trivial « jamais fraude » fait 99,7 %.
Rappel (TPR) = 240/300 = 0,80 ; FPR = 960/99 700 = 0,0096 ; précision = 240/1 200 = 0,20 ; F1 = 2·0,2·0,8/(0,2 + 0,8) = 0,32.
Baisser le seuil : TP ↑ (rappel ↑), FP ↑ (précision ↓, FPR ↑), FN ↓, TN ↓.
Classifieur aléatoire : ROC = diagonale (AUC 0,5) ; PR = ligne horizontale à la prévalence, 0,003.

## Pas de la chaîne
1. **Le décor.** 98,98 % sonne bien. Le modèle qui dit toujours « non » fait mieux. L'accuracy ne voit pas 300 lignes sur 100 000.
2. **La matrice de confusion** [tronc]. Lignes = vérité (P, N), colonnes = prédiction. Quatre cases, deux totaux qui ne dépendent pas du modèle : P = 300 et N = 99 700. Chaque métrique est une case sur un total. Au tableau : « Les totaux par ligne sont fixés par les données, donc rappel et FPR sont des taux **dans** chaque classe, donc ils ne dépendent pas de la prévalence ; la précision, elle, mélange les deux lignes. »
3. **Les taux par classe : rappel, FPR** [tronc]. Rappel = TP/P (sensibilité) ; FPR = FP/N = 1 − spécificité. Un « -rate » a pour dénominateur la colonne des vrais. Ils se transportent d'une population à l'autre.
4. **La précision n'a pas de TN** [tronc]. Précision = TP/(TP + FP) : dénominateur = les prédits positifs, qui viennent des deux classes. Avec N ≫ P, même un FPR de 1 % donne 960 FP contre 240 TP ⇒ précision 0,20. C'est exactement la VPP de p00-03 : elle dépend de la prévalence. Au tableau : « La précision divise les vrais positifs par tous les prédits positifs, donc son dénominateur contient les faux positifs de la classe majoritaire, donc elle s'effondre quand la prévalence est faible même si le modèle est bon dans chaque classe. »
5. **Baisser le seuil.** TP et FP montent ensemble, FN et TN descendent. Rappel ↑, FPR ↑, précision généralement ↓. Il n'y a pas de bon seuil en soi : il y a un coût de FP et un coût de FN, et le seuil est un choix (p06-04).
6. **ROC = (FPR, rappel) sur tous les seuils.** Deux taux par classe ⇒ insensible à la prévalence. AUC = P(score d'un positif > score d'un négatif) : une mesure de **classement**, pas de décision. Diagonale = hasard.
7. **PR = (rappel, précision) sur tous les seuils** [tronc]. Sensible à la prévalence : à 0,3 % un ROC excellent (FPR 0,01) est un PR médiocre (précision 0,20). Quand la classe rare est celle qui compte, PR dit la vérité que ROC cache. Baseline PR = prévalence. Au tableau : « ROC compare des taux par classe, donc il ne voit pas que la classe négative est 300 fois plus nombreuse ; PR met la précision en ordonnée, donc il voit les 960 faux positifs, donc sur une classe rare on lit PR. »
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` seuil s** : deux distributions de scores (positifs, négatifs, avec les effectifs 300 / 99 700 en échelle séparée), le seuil en trait vertical ; matrice de confusion en readout (TP, FP, FN, TN) et accuracy, rappel, FPR, précision, F1. Preset « le seuil du fil rouge ». Légende : bouge le seuil et regarde quelles cases montent ensemble.
- **Figure 2 — `plot` en deux panneaux** : ROC et PR tracées en direct à partir des mêmes scores, le point courant marqué sur les deux ; `slider` prévalence ∈ [0,1 % ; 50 %] qui laisse ROC inchangée et déforme PR. Légende : ROC ne voit pas la prévalence, PR oui.
- **Figure 3 — `plot`** : précision en fonction de la prévalence à rappel 0,8 et FPR 0,0096 fixés ; marque 0,3 % → 0,20 et 10 % → 0,90. Légende : même modèle, précision de 0,20 à 0,90 selon la population.

## Où ça casse
- **Accuracy sur classe rare** : le modèle trivial gagne (99,7 % > 98,98 %).
- **AUC ROC élevée sur classe rare** : peut cacher une précision inutilisable ; regarder PR.
- **F1 sans dire le seuil** : F1 dépend de s ; le rapporter avec s et la prévalence.
- **Précision comparée entre populations** : elle se transporte mal (pas 4) ; comparer rappel et FPR.

## Résumé
1. Matrice de confusion : totaux par ligne fixés par les données.
2. Rappel = TP/P, FPR = FP/N : taux par classe, indépendants de la prévalence.
3. Précision = TP/(TP + FP) : pas de TN, dénominateur mixte ⇒ dépend de la prévalence (0,20 ici).
4. Baisser le seuil : TP ↑ FP ↑ FN ↓ TN ↓.
5. ROC = taux par classe, AUC = P(s₊ > s₋), aveugle à la prévalence ; PR voit les FP ; baseline PR = prévalence.
6. Accuracy 98,98 % < trivial 99,7 % : ne jamais lire l'accuracy seule sur une classe rare.

**Phrase d'entretien** : « Rappel et FPR sont des taux dans chaque classe, donc indépendants de la prévalence ; la précision divise par tous les prédits positifs, où les faux positifs de la classe majoritaire dominent dès que la classe rare est rare : ici 960 contre 240, précision 0,20 pour un rappel de 0,80. ROC, fait de taux par classe, ne voit pas ce déséquilibre ; PR le voit, et c'est lui qu'on lit sur une classe rare. L'accuracy, elle, est battue par le modèle qui dit toujours non. »

## Chaîne verbalisée
1. Pourquoi 98,98 % ne veut rien dire ici ? → Trivial « jamais » = 99,7 %.
2. Rappel, FPR, précision sur le fil rouge ? → 0,80 ; 0,0096 ; 0,20.
3. Pourquoi la précision est si basse avec un FPR si bas ? → Pas de TN au dénominateur ; 99 700 × 0,0096 = 960 FP contre 240 TP.
4. Que se passe-t-il quand on baisse le seuil ? → TP ↑ FP ↑ FN ↓ TN ↓.
5. ROC ou PR sur une classe rare, et pourquoi ? → PR : ROC ne voit que des taux par classe.

## Ce qui a cassé pour Salah
- Q5 (10/09) puis 16/09 : le mécanisme « pas de TN dans la précision » est le pas 4 ; les chiffres du fil rouge sont ceux de ce matin (accuracy 98,98 % < trivial 99,7 %), le rappel avait été oublié dans la liste : la chaîne le nomme en premier (pas 3). Unités : tout est en effectifs.
- ML classique : « PR-AUC » manquait au diagnostic — pas 7.
- Lien p00-03 : sensibilité = rappel, VPP = précision — une ligne, deux ancrages.

## Exclusions
Pas de calibration (p06-04), pas de coût du seuil détaillé (p06-04), pas de multi-classe, pas de test DeLong sur AUC.
