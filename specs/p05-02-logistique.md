---
id: p05-02
series: chain
part: "05"
number: "02"
slug: logistique
title: Régression logistique — logit, odds ratio, effet marginal
subtitle: modèles linéaires — linéaire en log-cote, jamais en probabilité ; e^β multiplie une cote
prereq: [p02-01, p03-01, p03-02, p05-01]
anki: [ml::logistique, ml::odds-ratio, ml::effet-marginal, ml::frontiere-lineaire]
bridges: [b06, b05]
next: p05-03
status: reviewed
---

## Question de la chaîne
Pourquoi pas une droite sur des 0/1, que veut dire « e^β = 1,73 », pourquoi « la probabilité double » est faux, et pourquoi il n'y a pas de forme fermée ?

## Prérequis
- p02-01 : Bernoulli ⇒ log-loss ; image de σ dans ]0, 1[.
- p03-01 : log-loss sensible ; séparation parfaite.
- p03-02 : ∇ = 0 non linéaire ⇒ itérer.
- p05-01 : « linéaire en β ».

## Hypothèses posées
- H1 : Y | x ~ Bernoulli(p(x)) avec **logit p(x) = β₀ + β₁x** : la log-cote est affine. C'est l'hypothèse ; ni p ni la cote ne sont affines.
- H2 : observations indépendantes (produit, p02-01).
- H3 : x connus sans erreur ; pas de séparation parfaite (sinon pénalité, p02-02).

## Exemple fil rouge
ISLR Default, `default ~ balance` : β̂₀ = −10,65, β̂₁ = 0,0055 (par dollar).
- balance = 1 000 : logit = −5,15, p = σ(−5,15) = 0,0058. balance = 2 000 : logit = 0,35, p = 0,587.
- Odds ratio pour +100 $ : e^{0,55} = 1,73 : la **cote** est multipliée par 1,73.
- Effet marginal ∂p/∂x = β₁·p(1 − p) : à p = 0,5, +100 $ ⇒ **+13,75 points** (linéarisé ; +13,42 exact) ; à p = 0,02, +100 $ ⇒ **+1,08 point** (linéarisé ; +1,42 exact). Même β, effets différents.
- Table cote → p : cote 1 → 0,5 ; ×2 → cote 2 → 0,667 (pas 1,0) ; cote 0,02 → 0,0196 ; ×2 → 0,04 → 0,0385 (≈ ×2 seulement parce que p est petit).
- Frontière à p = 0,5 : logit = 0 ⇔ balance = 10,65/0,0055 = 1 936 $.

## Pas de la chaîne
1. **Le décor.** y ∈ {0, 1}. Une droite sur y donne des prédictions < 0 et > 1, un bruit qui ne peut pas être gaussien, et des carrés qui n'ont plus de sens.
2. **Ce qui est affine : la log-cote** [tronc]. logit p = log(p/(1 − p)) = β₀ + β₁x. Trois échelles : la log-cote (affine, de −∞ à +∞), la cote (multiplicative, > 0), la probabilité (sigmoïde, dans ]0, 1[). Au tableau : « La probabilité est bornée, donc on ne peut pas la rendre affine, donc on rend affine sa log-cote, donc p est une sigmoïde de la combinaison linéaire. »
3. **La loss** (p02-01). Bernoulli ⇒ NLL = −Σ[y log p + (1 − y) log(1 − p)] ; gradient (p − y)x, jamais nul (p03-01). Convexe en β (p03-02) ; ∇ = 0 non linéaire (σ) ⇒ **pas de forme fermée**, on itère (GD, Newton/IRLS). Au tableau : « Le gradient contient σ, donc annuler le gradient n'est pas linéaire en β, donc on ne résout pas, on itère ; convexe, donc on arrive au minimum global. »
4. **e^β est un rapport de cotes** [tronc]. Passer de x à x + 1 ajoute β à la log-cote, donc **multiplie la cote** par e^β. Rien n'est ajouté ni multiplié sur p. Au tableau : « β s'ajoute à la log-cote, donc e^β multiplie la cote, donc l'effet sur la probabilité dépend d'où l'on part. »
5. **« La probabilité double » est faux** [tronc]. Cote 1 → cote 2 : p passe de 0,5 à 0,667, pas à 1. Cote 0,02 → 0,04 : p de 0,0196 à 0,0385 — presque ×2, parce que p ≈ cote quand p est petit. « Doubler » ne vaut que pour les petites probabilités, et c'est une approximation. Au tableau : « La cote double, donc p passe de c/(1 + c) à 2c/(1 + 2c), donc elle ne double que si c est négligeable devant 1. »
6. **L'effet marginal dépend de p.** ∂p/∂x = β₁ p(1 − p) : maximal en p = 0,5 (pente de la sigmoïde β/4), presque nul aux extrêmes. Deux clients, même β, effets de 13,75 et 1,08 points pour +100 $ (client à 1 936 $ et client à 1 229 $). « Une unité de x change p de β » est faux partout sauf près de 0,5 et pour β petit.
7. **La frontière est linéaire.** p = 0,5 ⇔ logit = 0 ⇔ β₀ + β₁x = 0 : un point en 1D, une droite en 2D, un hyperplan en général. La logistique est un classifieur linéaire ; ce qui est non linéaire est **p** en fonction de x, pas la frontière. Seuil ≠ 0,5 : frontière déplacée, toujours un hyperplan (p06-03).
8. **Lire la sortie.** β̂₁ = 0,0055 par dollar est illisible ; par 100 $ : 0,55, odds ratio 1,73. Le SE et le test (p01-02) s'appliquent à β̂₁ ; l'IC sur l'odds ratio est e^{IC de β}. Multiclasse : softmax, une log-cote par classe contre une référence (p08-03).
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` balance ∈ [0, 3 000]** : la sigmoïde p(balance) avec le point courant, la tangente (pente β₁p(1 − p)) tracée, readouts p, cote, effet marginal par 100 $. Légende : même β, pente qui change ; frontière à 1 936 $.
- **Figure 2 — `plot` (trois échelles)** : trois panneaux liés par le même slider : log-cote (droite), cote (exponentielle), probabilité (sigmoïde). Légende : où est la linéarité.
- **Figure 3 — `plot` + `slider` p ∈ ]0, 1[ (la table cote → p)** : readouts cote, cote×e^β (avec β réglable), p après ; courbe p_après(p_avant) contre la diagonale ×2. Légende : la cote double ; la probabilité, non — sauf quand elle est petite.

## Où ça casse
- **Séparation parfaite** : NLL sans minimum, ‖β‖ → ∞ (p02-01, p02-02) ; pénalité.
- **Non-linéarité en x** : la log-cote n'est pas affine ⇒ ajouter x², interactions, ou changer de modèle ; la frontière reste linéaire dans les features données.
- **Colinéarité** : mêmes symptômes qu'en OLS (SE explosifs) ; ridge.
- **Calibration** : la logistique est calibrée sur sa distribution d'entraînement ; rééchantillonner la décale (p06-04).

## Résumé
1. Affine en **log-cote**, pas en p ; p = σ(β₀ + β₁x) ∈ ]0, 1[.
2. Log-loss (Bernoulli), gradient (p − y)x, convexe, pas de forme fermée (σ) ⇒ itérer.
3. e^β multiplie la **cote** ; la probabilité ne double pas (0,5 → 0,667) sauf si elle est petite.
4. Effet marginal β p(1 − p) : maximal à p = 0,5, nul aux extrêmes.
5. Frontière linéaire (logit = 0) ; la non-linéarité est dans p, pas dans la frontière.
6. Lire par unité sensée (par 100 $ : OR 1,73) ; IC sur l'OR = e^{IC(β)}.

**Phrase d'entretien** : « La logistique rend affine la log-cote, pas la probabilité : e^β multiplie une cote, donc l'effet sur la probabilité dépend d'où l'on part — β fois p(1 − p), maximal à 0,5. Dire que la probabilité double est faux sauf pour de petites probabilités. La loss est la NLL d'une Bernoulli, convexe mais sans forme fermée à cause de la sigmoïde, et la frontière de décision reste un hyperplan. »

## Chaîne verbalisée
1. Qu'est-ce qui est linéaire dans une logistique ? → La log-cote ; p est une sigmoïde.
2. Pourquoi pas de forme fermée ? → ∇ = 0 contient σ ; convexe, on itère.
3. Que veut dire e^β = 1,73 ? → La cote est multipliée par 1,73 par unité de x.
4. « La probabilité double » : vrai ? → Non : 0,5 → 0,667 ; ≈ vrai seulement si p petit.
5. Effet de +100 $ sur p ? → β·p(1 − p)·100 : 13,75 points à p = 0,5, 1,08 à 0,02.
6. La frontière est-elle linéaire ? → Oui : logit = 0 est un hyperplan ; c'est p qui est non linéaire.

## Ce qui a cassé pour Salah
- Q4.2 (10/09) puis réapparue le 16/09 : « la probabilité double », « baisse de probabilité par unité » — pas 5 et 6, figure 3 avec la table cote → p qui l'a corrigé en séance. C'est la scorie la plus récidivante : elle a trois pas et une figure.
- 16/09 : odds ratio OK, effet marginal β p(1 − p) produit seul — pas 6 le nomme comme acquis, ne le redémontre pas.
- Q4.3 (cross-entropy) : renvoi p02-01 / p08-03, pas ici.

## Exclusions
Pas d'IRLS détaillé, pas de régression multinomiale au-delà du renvoi softmax, pas de courbe de calibration ici (p06-04), pas de GLM général.

## Questions pour la revue
- **Chiffre corrigé.** Le spec annonçait « +13,7 points » à p = 0,5 pour +100 $ : β₁·p(1−p)·100 = 0,0055 × 0,25 × 100 = **0,1375**, soit **13,75 points**. Corrigé ci-dessus, ainsi que « 1,1 » → **1,08** (0,0055 × 0,0196 × 100).
- **Linéarisé ≠ exact.** L'effet marginal est une dérivée : sur un pas de 100 $ l'écart réel vaut 13,42 points (et non 13,75) au sommet, et 1,42 point (et non 1,08) à p = 0,02 — la tangente surestime au milieu et sous-estime en bas. La sheet affiche les deux colonnes ; le spec ne mentionnait que le linéarisé. À valider comme contenu voulu.
- **SE de β̂₁.** La table 4.1 d'ISLR donne SE = 0,0002 et z = 24,9, ce qui est incohérent (0,0055/0,0002 = 27,5) : c'est l'arrondi de la table. La sheet utilise **SE = 0,00022**, qui redonne z = 25,0 et l'IC₉₅ sur l'OR [1,66 ; 1,81]. À confirmer contre une sortie non arrondie.
- **Ordre des figures.** La sheet numérote les figures dans l'ordre de lecture : F1 = les trois échelles (pas 2), F2 = la table cote → p (pas 5), F3 = sigmoïde et tangente (pas 6). C'est l'inverse de la numérotation du spec pour F1 et F3 ; le contenu exigé est identique.

**Arbitrage de revue 5, 17/09 — validé 17/09.** **+13,75 points** (et non 13,7) **validé**.
Les **deux colonnes linéarisé / exact** sont **validées** comme contenu voulu : sur un pas
de 100 $ l'écart réel vaut 13,42 au sommet et 1,42 en bas, contre 13,75 et 1,08 en
linéarisé. **SE = 0,00022** retenu, cohérent avec le z = 24,9 d'ISLR table 4.1 une fois
sorti de l'arrondi, et l'IC₉₅ sur l'OR [1,66 ; 1,81] avec lui. **Ordre des figures validé
tel que produit** (F1 « trois échelles », F2 « la cote est multipliée », F3 « même β, pente
qui change »), donc F1/F3 inversées par rapport au spec. Statut `reviewed`.
