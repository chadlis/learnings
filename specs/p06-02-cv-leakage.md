---
id: p06-02
series: chain
part: "06"
number: "02"
slug: cv-leakage
title: Estimer l'erreur — validation croisée, LOOCV, fuite
subtitle: évaluer — imiter des données non vues sans en gaspiller, et ne rien laisser passer du futur
prereq: [p06-01, p01-04, p01-05]
anki: [ml::validation, ml::cross-validation, ml::leakage]
bridges: [b03, b04, b02]
next: p06-03
status: ready
---

## Question de la chaîne
Comment estimer l'erreur test avec un seul dataset, pourquoi k = 5–10 plutôt que n, et comment une fuite fabrique une AUC de 0,99 qui ne survit pas à la production ?

## Prérequis
- p06-01 : erreur test = ce qu'on veut ; erreur train ne mesure pas.
- p01-04 : le test set ouvert une fois ; biais du max.
- p01-05 : rééchantillonner ; b04 : variance d'une moyenne corrélée.

## Hypothèses posées
- H1 : lignes iid — c'est ce qui autorise un découpage au hasard. Séries temporelles et groupes violent H1.
- H2 : la procédure évaluée est **tout le pipeline** (preprocessing, sélection, modèle), pas seulement le modèle.

## Exemple fil rouge
n = 1 000. Holdout 80/20 : un modèle sur 800, une erreur sur 200 (SE ≈ √(0,13·0,87/200) = 0,024 sur une accuracy à 0,87 — large). 5-fold : cinq modèles sur 800, erreur moyenne sur les 1 000 lignes, chacune prédite hors de son fold. LOOCV : 1 000 modèles sur 999.
Fuite classique (ESL 7.10.2) : 50 lignes, 5 000 features de bruit pur, classes équilibrées. Sélectionner les 100 features les plus corrélées à y **sur tout le jeu**, puis 5-fold sur ces 100 : erreur CV ≈ 3 %. Vrai taux : 50 %. Sélectionner **dans chaque fold** : erreur CV ≈ 50 %.
Fuite de cible : une feature « date de remboursement » pour prédire une résiliation — remplie seulement après la résiliation.

## Pas de la chaîne
1. **Le décor.** L'erreur train ment (b02). On veut une erreur sur des données non vues, mais on n'a qu'un dataset et on veut aussi s'en servir pour apprendre.
2. **Holdout : simple, gaspilleur, bruité.** Séparer 80/20 : le modèle final n'a vu que 80 % ; l'erreur est mesurée sur 200 lignes, SE 0,024 : deux modèles à 0,87 et 0,89 sont indiscernables. Et un seul découpage : le hasard du découpage est dedans.
3. **k-fold** [tronc]. Découper en k plis ; k fois : apprendre sur k − 1, mesurer sur le pli restant ; moyenner. Chaque ligne est prédite une fois, hors de son pli ; les 1 000 lignes servent à mesurer, et chaque modèle a vu (1 − 1/k)·n lignes. Au tableau : « Chaque pli sert une fois de test, donc toutes les lignes sont évaluées hors apprentissage, donc l'erreur moyenne est une estimation de l'erreur test d'un modèle appris sur presque tout. »
4. **k = n (LOOCV) : biais minimal, variance forte** [tronc]. Chaque modèle voit n − 1 lignes : presque le modèle final, biais quasi nul. Mais les n modèles sont presque identiques ⇒ leurs erreurs sont **corrélées** ⇒ la moyenne a une variance élevée (b04, ρ ≈ 1) ; et n ajustements. k = 5–10 : modèles sur 80–90 % (léger biais pessimiste), moins corrélés, moins de calcul. Au tableau : « À k = n les modèles sont presque tous les mêmes, donc leurs erreurs bougent ensemble, donc la moyenne ne réduit pas la variance ; à k = 5 on paie un peu de biais pour beaucoup moins de variance. »
5. **Ce qu'on évalue : la procédure entière.** Standardisation, imputation, sélection de features, choix d'hyperparamètres : tout ce qui a touché les données doit être **refait dans chaque pli** sur le pli d'apprentissage seul. `Pipeline` + `cross_val_score` le garantissent ; `fit_transform` sur tout le jeu avant la CV ne le garantit pas.
6. **Fuite de preprocessing** [tronc]. Le fil rouge ESL : 5 000 features de bruit, sélection sur tout le jeu ⇒ 3 % d'erreur CV pour un problème à 50 %. La sélection a vu les labels des plis de test ; le modèle ne fait que confirmer. Au tableau : « La sélection a utilisé les labels du pli de test, donc le pli n'est plus non vu, donc l'erreur mesurée est celle de l'apprentissage, donc elle ment. »
7. **Fuite de cible : le test « disponible à cet instant ? »** Pour chaque feature : au moment où la prédiction sera faite en production, cette valeur existe-t-elle ? Une date de remboursement, un statut mis à jour après coup, un agrégat calculé sur le futur : non. Symptôme : une métrique trop belle (AUC 0,99, features « magiques » en tête des importances). Une AUC trop belle est un **bug**, pas une réussite.
8. **Hors iid : séries et groupes.** Séries temporelles : plis chronologiques (apprendre sur le passé, tester sur le futur), jamais de shuffle. Groupes (un utilisateur, un patient sur plusieurs lignes) : `GroupKFold`, un groupe entier par pli, sinon le modèle reconnaît l'individu.
9. **Choisir les hyperparamètres.** La CV sert à choisir ; le score du meilleur est biaisé (b02). Pour mesurer le modèle choisi : un test set jamais touché, ou une CV imbriquée (nommer).
10. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom via `plot` (les plis)** : 1 000 lignes en une barre, `slider` k ∈ {2, 5, 10, 50, n} ; le pli de test surligné se déplace (bouton « pli suivant ») ; readouts : lignes par modèle, nombre d'ajustements, « part de lignes communes entre deux modèles » ((k − 2)/(k − 1) → 1 quand k → n). Légende : à k = n, deux modèles partagent 99,8 % de leurs lignes.
- **Figure 2 — `plot` + bouton « fuite / pas de fuite »** : simulation JS du fil rouge ESL en petit (n = 50, 1 000 features de bruit, sélection de 20) : erreur CV affichée dans les deux cas (≈ 5 % vs ≈ 50 %) sur 20 répétitions. Légende : la même CV, la sélection dedans ou dehors.
- **Figure 3 — `plot`** : erreur CV en fonction de k (biais pessimiste qui décroît) et variance de l'estimation (qui croît vers k = n), simulation sur le fil rouge de p06-01. Légende : le compromis de k.

## Où ça casse
- **Shuffle sur une série temporelle** : le modèle apprend le futur ; en production il ne l'a pas.
- **Groupes ignorés** : erreur CV optimiste, parfois de beaucoup (le modèle reconnaît le patient, pas la maladie).
- **CV sur un jeu déséquilibré sans stratification** : un pli sans positifs ; `StratifiedKFold`.
- **Répéter la CV pour « stabiliser »** : réduit le bruit du découpage, pas le biais d'une fuite ni celui du choix (b02).

## Résumé
1. Holdout : simple, gaspilleur, bruité (SE 0,024 sur 200 lignes).
2. k-fold : chaque ligne prédite hors de son pli ; modèles sur (1 − 1/k)·n lignes.
3. LOOCV : biais minimal, variance forte (modèles corrélés) ; k = 5–10 est le compromis.
4. On évalue la procédure entière : preprocessing et sélection dans chaque pli.
5. Fuite = le pli de test a été vu (sélection, standardisation) ou le futur est dans une feature ; une métrique trop belle est un bug.
6. Séries : plis chronologiques ; groupes : GroupKFold ; choix d'hyperparamètres : test à part ou CV imbriquée.

**Phrase d'entretien** : « Je fais une validation croisée à cinq ou dix plis : chaque ligne est prédite hors de son pli, les modèles voient presque tout, et je ne monte pas jusqu'à n parce que des modèles quasi identiques donnent des erreurs corrélées dont la moyenne a une variance élevée. Tout le pipeline est refait dans chaque pli — sinon la sélection de features a vu les labels du test et l'erreur ment. Et devant une AUC de 0,99, je cherche la feature qui contient le futur avant de me réjouir. »

## Chaîne verbalisée
1. Pourquoi pas un simple holdout ? → Gaspille 20 %, une seule mesure bruitée (SE 0,024 sur 200).
2. Que fait k-fold, et que voit chaque modèle ? → k modèles, chaque ligne testée une fois ; (1 − 1/k)·n lignes.
3. Pourquoi pas LOOCV ? → Modèles corrélés ⇒ variance de la moyenne élevée ; n ajustements.
4. Où mettre la standardisation et la sélection ? → Dans chaque pli, sur l'apprentissage seul.
5. Quel est le test d'une feature contre la fuite ? → Disponible au moment de la prédiction en production ?
6. Que change une série temporelle ? → Plis chronologiques, pas de shuffle.

## Ce qui a cassé pour Salah
- t06 avait « k-fold vs LOOCV (corrélation des modèles), preprocessing dans le fold, test disponible à cet instant, AUC trop belle = symptôme » en Q/A ; la chaîne les enchaîne avec le fil rouge ESL chiffré (pas 6, figure 2), qui est ce qui rend la fuite concrète.
- b04 est le mécanisme du pas 4 : y renvoyer, ne pas le redériver.

## Exclusions
Pas de CV imbriquée détaillée, pas de bootstrap .632, pas de time-series split avancé (purging, embargo) au-delà de « chronologique ».
