---
id: p06-02
series: chain
part: "06"
number: "02"
slug: cv-leakage
title: Estimer l'erreur — validation croisée, LOOCV, fuites
subtitle: évaluer — mesurer sans se mentir : ce qui doit rester invisible au modèle
prereq: [p06-01, p01-04]
anki: [ml::cv, ml::loocv, ml::leakage, ml::validation]
bridges: [b03, b04]
next: p06-03
status: ready
---

## Question de la chaîne
Comment estimer l'erreur test sans test, pourquoi LOOCV a peu de biais mais beaucoup de variance, et quel test simple détecte une fuite.

## Prérequis
- p06-01 : erreur test, variance du modèle.
- p01-04 : train / validation / test ; le max ment.
- p00-02 / b04 : variance d'une moyenne de termes corrélés.

## Hypothèses posées
- H1 : les lignes sont **iid** — c'est ce qui autorise un découpage aléatoire. Séries temporelles et groupes violent H1.
- H2 : la procédure d'estimation (y compris preprocessing et sélection de features) est **entièrement** refaite dans chaque pli.

## Exemple fil rouge
n = 1 000. k-fold k = 5 : 5 modèles sur 800, chacun évalué sur ses 200 ; erreur = moyenne des 5. LOOCV : 1 000 modèles sur 999.
Fuite 1 : standardiser sur les 1 000 lignes puis découper : la moyenne et l'écart-type du test ont contaminé les features du train (petit effet, réel).
Fuite 2 : target encoding d'une catégorie calculé sur tout le jeu : chaque ligne porte sa propre cible ⇒ AUC 0,99 en CV, 0,7 en production.
Fuite 3 : 20 lignes par utilisateur, découpage aléatoire ⇒ chaque utilisateur est des deux côtés ⇒ le modèle reconnaît l'utilisateur, pas le phénomène. GroupKFold.
Fuite 4 : série temporelle mélangée ⇒ le modèle voit le futur. Découpage temporel.

## Pas de la chaîne
1. **Le décor.** On n'a qu'un dataset ; on veut une erreur test **et** choisir des hyperparamètres. Le test ne peut servir qu'une fois (p01-04).
2. **k-fold** [tronc]. Découper en k plis ; k fois : entraîner sur k − 1, évaluer sur le pli restant ; moyenner. Chaque ligne est évaluée une fois par un modèle qui ne l'a pas vue. Au tableau : « Chaque pli joue le rôle de test pour un modèle entraîné sans lui, donc chaque ligne est prédite hors échantillon, donc la moyenne des erreurs estime l'erreur test d'un modèle entraîné sur (k − 1)/k des données. »
3. **Biais de k-fold.** Les modèles sont entraînés sur 800 lignes, pas 1 000 : l'erreur estimée est légèrement pessimiste. k grand réduit ce biais ; k = n (LOOCV) l'annule presque.
4. **Variance de LOOCV** [tronc]. Les n modèles LOOCV diffèrent d'une ligne : presque identiques, erreurs fortement corrélées ⇒ leur moyenne a une variance proche de ρσ² (b04), qui ne diminue pas avec n. k = 5 ou 10 : modèles plus différents, moyenne plus stable. Et LOOCV coûte n ajustements (sauf formule OLS). Au tableau : « Les modèles LOOCV partagent n − 2 lignes, donc leurs erreurs sont corrélées, donc la variance de leur moyenne ne baisse pas comme 1/n, donc LOOCV a peu de biais et beaucoup de variance ; k = 5–10 est le compromis. »
5. **Sélection + estimation = nested.** Choisir λ par CV puis rapporter l'erreur de cette même CV surestime (le min sur λ ment, p01-04). Soit un test à part, soit une CV imbriquée : une boucle externe pour estimer, une interne pour choisir.
6. **Leakage : le test « disponible à cet instant ? »** [tronc]. Pour chaque feature et chaque étape de preprocessing : cette information serait-elle disponible au moment de prédire, pour cette ligne, sans connaître sa cible ni le futur ? Sinon c'est une fuite. Standardisation, imputation, encodage, sélection de features : **dans** le pli. Au tableau : « Tout ce qui est calculé sur des lignes du test contamine le train, donc chaque étape doit être ajustée dans le pli, donc la question à poser est : cette information existe-t-elle au moment de la prédiction ? »
7. **Le symptôme.** Une métrique trop belle (AUC 0,99, R² 0,98) sur un problème dur est une fuite jusqu'à preuve du contraire. Chercher : identifiants, dates futures, cibles encodées, doublons entre plis, groupes coupés.
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom (schéma de plis)** : 10 lignes × k = 5 plis animés, le pli test surligné à chaque étape, l'erreur de chaque pli et la moyenne en readout ; `slider` k ∈ {2, 5, 10, n}. Légende : chaque ligne est prédite hors échantillon une fois.
- **Figure 2 — `repeat`** : sur un jeu simulé, draw = estimation CV de l'erreur (nouveau tirage du dataset à chaque fois) pour k = 5 vs LOOCV ; deux histogrammes ; readouts biais (écart à l'erreur vraie) et écart-type. Légende : LOOCV centré mais large, k = 5 légèrement décalé mais serré.
- **Figure 3 — SVG custom (la fuite)** : les 10 lignes avec une flèche « moyenne calculée sur tout » qui traverse la frontière train/test ; bouton « dans le pli » qui la coupe. Légende : le test « disponible à cet instant ? ».

## Où ça casse
- **Lignes non iid** : groupes (utilisateurs) ⇒ GroupKFold ; temps ⇒ découpage temporel, jamais de mélange.
- **Déséquilibre** : un pli sans positifs ⇒ StratifiedKFold.
- **CV comme test** après sélection : le min ment ; nested ou test à part.
- **Petit n** : la CV elle-même a une grande variance ; répéter la CV (repeated k-fold) et rapporter l'écart-type.

## Résumé
1. k-fold : chaque ligne prédite une fois hors échantillon ; erreur = moyenne des plis.
2. Biais : modèles sur (k − 1)/k des données ; LOOCV presque sans biais.
3. LOOCV : modèles quasi identiques ⇒ erreurs corrélées ⇒ variance élevée ; k = 5–10.
4. Sélection + estimation ⇒ nested CV ou test à part.
5. Leakage : tout preprocessing dans le pli ; question « disponible à cet instant ? » ; métrique trop belle = symptôme.
6. Casse : groupes, temps, déséquilibre, petit n.

**Phrase d'entretien** : « La validation croisée prédit chaque ligne par un modèle qui ne l'a pas vue. Avec k égal n, les modèles sont presque identiques, donc leurs erreurs sont corrélées et la moyenne garde une grande variance ; cinq ou dix plis est le compromis. Tout ce qui se calcule sur les données — standardisation, encodage, sélection — se fait dans le pli, et la question qui détecte une fuite est : cette information existe-t-elle au moment de prédire ? »

## Chaîne verbalisée
1. Que mesure k-fold, et sur quel modèle ? → L'erreur hors échantillon d'un modèle entraîné sur (k − 1)/k.
2. Pourquoi LOOCV a beaucoup de variance ? → Modèles quasi identiques ⇒ erreurs corrélées ⇒ variance ≈ ρσ².
3. Standardiser avant de découper : quel problème ? → Le test contamine les statistiques ; ajuster dans le pli.
4. AUC 0,99 en CV sur un problème dur : réaction ? → Fuite jusqu'à preuve du contraire ; chercher cibles encodées, ids, futur, groupes.
5. Choisir λ par CV puis rapporter cette erreur : légitime ? → Non : min sur λ ; nested ou test à part.

## Ce qui a cassé pour Salah
- t06 (index) : « preprocessing dans le fold », « AUC trop belle », « disponible à cet instant ? » en cartes ; la chaîne donne le mécanisme (pas 6) et la variance de LOOCV par b04 (pas 4), qui est le « why » manquant.
- Lien p01-04 (le max ment) → nested CV : une brique.

## Exclusions
Pas de bootstrap .632, pas de time-series CV détaillée au-delà du principe, pas de formule LOOCV pour OLS.
