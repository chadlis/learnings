---
id: p00-02
series: chain
part: "00"
number: "02"
slug: esperance-variance-densite
title: Espérance, variance, masse vs densité
subtitle: socle — les deux nombres qui résument une loi, et pourquoi une densité s'évalue mais ne se lit pas
prereq: [p00-01]
anki: [stats::esperance, stats::variance, stats::densite, stats::covariance]
bridges: [b04]
next: p00-03
status: ready
---

## Question de la chaîne
Que valent E et Var d'une variable, comment se transforment-ils, quand s'additionnent-ils, et qu'est-ce qu'une densité par rapport à une probabilité ?

## Prérequis
- p00-01 : v.a., loi, PMF d'une loi discrète.

## Hypothèses posées
- H1 : E et Var **existent** (somme ou intégrale finie) — faux pour certaines queues lourdes, voir casse.
- H2 : « indépendant » signifie P(X = x, Y = y) = P(X = x)P(Y = y) pour tous x, y (p00-03).

## Exemple fil rouge
Un dé équilibré : E = 3,5 ; E[X²] = 91/6 = 15,17 ; Var = 15,17 − 12,25 = 2,917 ; écart-type 1,708.
Gain G = 2X + 1 : E = 8, Var = 4·2,917 = 11,67.
Deux dés indépendants, S = X + Y : E = 7, Var = 5,833. Le même dé compté deux fois, 2X : E = 7 aussi, Var = 11,67 — pas 5,833.
Densité : Exponentielle de taux 4/h a pour densité 4 en t = 0 (> 1) ; P(T = 15 min exactement) = 0 ; P(10 < T < 20 min) = e⁻²ᐟ³ − e⁻⁴ᐟ³ = 0,513 − 0,264 = 0,250.
Cov nulle sans indépendance : X uniforme sur {−1, 0, 1}, Y = X² : E[XY] = E[X³] = 0 = E[X]E[Y] ⇒ Cov = 0, mais Y est déterminé par X.

## Pas de la chaîne
1. **Le décor.** Une loi entière est trop d'information ; on veut deux nombres : où elle est centrée, à quel point elle s'étale. Et il faut savoir ce que ces nombres deviennent quand on transforme ou additionne.
2. **Espérance = moyenne pondérée par les probabilités** [tronc]. E[X] = Σ x P(X = x) (ou ∫ x f(x) dx). Elle est **linéaire toujours** : E[aX + b] = aE[X] + b et E[X + Y] = E[X] + E[Y] même si X et Y sont dépendants. Au tableau : « L'espérance est une somme pondérée, donc elle passe à travers les sommes et les constantes, donc elle est linéaire sans aucune hypothèse d'indépendance. »
3. **Variance = espérance de l'écart au carré** [tronc]. Var(X) = E[(X − E[X])²] = E[X²] − E[X]². Unités au carré ⇒ l'écart-type √Var est dans l'unité de X. Au tableau : « La variance est la moyenne des écarts au carré, donc en développant le carré il reste E[X²] moins E[X]², donc elle se calcule avec deux moments. »
4. **Transformation affine** : Var(aX + b) = a²Var(X). La constante b décale sans étaler ; a étale au carré. C'est l'origine du 1/n² dans Var(X̄) (p00-04, p01-01). Au tableau : « Décaler ne change pas les écarts, donc b disparaît, donc multiplier par a multiplie les écarts par a et leur carré par a². »
5. **Additivité seulement sous indépendance** [tronc]. Var(X + Y) = Var(X) + Var(Y) + 2Cov(X, Y). Cov = E[XY] − E[X]E[Y] ; nulle sous indépendance. X + X = 2X : Cov(X, X) = Var(X) ⇒ Var = 4Var(X), pas 2Var(X). Au tableau : « Le carré d'une somme a un terme croisé, donc la variance d'une somme a une covariance, donc elle n'est additive que si la covariance est nulle, donc en particulier sous indépendance. »
6. **Corrélation** : ρ = Cov/(σ_X σ_Y) ∈ [−1, 1], sans unité. Cov = 0 ⇏ indépendance (exemple Y = X²) ; indépendance ⇒ Cov = 0. La corrélation ne voit que le **linéaire**.
7. **Masse vs densité** [tronc]. Discret : P(X = x) est une probabilité. Continu : P(X = x) = 0 pour tout x ; ce qui existe est une **densité** f(x), un taux de probabilité par unité de x : P(a < X < b) = ∫ f. Une densité peut dépasser 1 (Exponentielle(4) vaut 4 en 0). On **évalue** f en un point quand on veut la vraisemblance d'une observation (fil B) ; on **intègre** f quand on veut une probabilité. Au tableau : « En continu, un point a probabilité nulle, donc l'information est un taux, donc une probabilité est une aire, donc une vraisemblance est une hauteur et n'a pas à être inférieure à 1. »
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot`** : PMF du dé en barres, E = 3,5 en trait, et pour chaque face une barre fine (x − 3,5)² pondérée par 1/6, dont la somme affichée = 2,917 ; `slider` a ∈ [−3, 3] et b ∈ [−5, 5] qui redessinent la loi de aX + b avec E et Var en readout. Légende : b décale, a étale au carré.
- **Figure 2 — `plot` + `slider` a et b (bornes)** : densité Exponentielle(4/h) en heures ; aire entre a et b grisée ; readouts f(a) (hauteur, peut dépasser 1), P(a < T < b) (aire). Légende : hauteur = vraisemblance, aire = probabilité ; la hauteur en 0 vaut 4.
- **Figure 3 — `repeat`** (deux boutons) : draw = X + Y (deux dés) vs draw = 2X (un dé doublé) ; bins [2 ; 12 ; 11] ; readouts E et écart-type mesurés (≈ 2,42 vs 3,42). Légende : même moyenne, variances 5,83 et 11,67 — la covariance est là.

## Où ça casse
- **Queues lourdes** : Cauchy n'a pas d'espérance ; Pareto à indice < 2 n'a pas de variance ⇒ la moyenne empirique ne converge pas, l'écart-type empirique explose avec n. Signal : un seul point domine la somme.
- **Cov = 0 pris pour indépendance** : la corrélation ne mesure que le linéaire (Y = X²).
- **Additivité appliquée à des termes dépendants** : mesures répétées sur un même individu, lignes d'un même utilisateur ⇒ variance de la somme sous-estimée ⇒ SE trop optimiste (p01-01, b04).
- **Densité lue comme une probabilité** : « f(x) = 2,3 donc probable » n'a pas de sens ; seule l'aire en a.

## Résumé
1. E = moyenne pondérée, linéaire toujours (pas besoin d'indépendance).
2. Var = E[X²] − E[X]², unités au carré ; écart-type dans l'unité de X.
3. Var(aX + b) = a²Var(X) : b décale, a étale au carré.
4. Var(X + Y) = Var(X) + Var(Y) + 2Cov : additive seulement à covariance nulle (indépendance suffit).
5. Cov = 0 ⇏ indépendance ; ρ ne voit que le linéaire.
6. Continu : densité = taux ; on l'évalue (vraisemblance) ou on l'intègre (probabilité) ; elle peut dépasser 1.

**Phrase d'entretien** : « L'espérance est linéaire sans condition ; la variance ne s'additionne que si la covariance est nulle, et une transformation affine la multiplie par a². En continu il n'y a pas de probabilité ponctuelle, seulement une densité : je l'évalue quand je veux une vraisemblance, je l'intègre quand je veux une probabilité, et rien ne l'empêche de dépasser 1. »

## Chaîne verbalisée
1. E[X + Y] = E[X] + E[Y] : sous quelle hypothèse ? → Aucune ; linéarité.
2. Var(X + Y) = Var(X) + Var(Y) : sous quelle hypothèse, et que vaut Var(2X) ? → Cov = 0 (indépendance suffit) ; Var(2X) = 4Var(X).
3. D'où vient a² dans Var(aX + b) ? → Les écarts sont multipliés par a, leur carré par a² ; b disparaît.
4. Une densité peut-elle valoir 4 ? → Oui : c'est un taux ; seule l'aire est une probabilité.
5. Cov = 0 implique-t-il l'indépendance ? → Non : Y = X² sur {−1, 0, 1}.

## Ce qui a cassé pour Salah
- Scorie du fil B (15/09) : densité **intégrée** au lieu d'**évaluée** — le pas 7 existe pour ça, et la figure 2 met la hauteur et l'aire côte à côte avec deux readouts distincts.
- p01-04 a besoin de Var(D) = Var(A) + Var(B) − 2Cov : le pas 5 doit écrire explicitement le cas X − Y (signe moins devant 2Cov) en une ligne.
- Le 1/n² de Var(X̄) (p01-01, pas 5) vient du pas 4 : le nommer.

## Exclusions
Pas de moments d'ordre supérieur, pas de fonction de répartition au-delà de « l'intégrale de la densité », pas de changement de variable.
