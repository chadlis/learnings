---
id: b01
series: bridge
part: "B"
number: "01"
slug: une-seule-descente
title: Une seule descente
subtitle: pont — le même pas −η·gradient, sur un vecteur, sur une fonction, sur des centroïdes, sur des poids
prereq: [p03-02, p07-03, p07-04, p08-01]
anki: [ml::optimisation, ml::boosting, ml::kmeans, dl::backprop]
bridges: []
next: b02
status: reviewed
---
## Le mécanisme
Un critère L, un objet θ qui bouge, un pas : θ ← θ − η·∇L(θ). Tout ce qui change d'un domaine à l'autre est **ce qu'est θ** et **où l'on prend le gradient**. Le pas, le signal (la pente, p03-01), la condition de convergence (η < 2/courbure) et la casse (non-convexité, pas trop grand) sont les mêmes.

## Format
Une figure unique, puis une ligne par domaine : ce qu'est θ · ce qu'est le gradient · ce que devient le pas · où c'est écrit. Résumé en 3 lignes. Chaîne verbalisée « même argument, autre habit ».

## La table
| domaine | θ | gradient | le pas | où |
|---|---|---|---|---|
| Régression / logistique | le vecteur β | ∂L/∂β = Σ(p − y)x (log-loss) | β ← β − η∇ | p03-02 pas 2–3 ; p05-02 |
| Gradient boosting | la **fonction** F(x) | −∂L/∂F(xᵢ) en chaque point (résidus si MSE) | F ← F + ν·h, où h ≈ le gradient négatif ajusté par un arbre | p07-03 |
| k-means (Lloyd) | les centroïdes μ_j et les affectations | deux gradients **exacts** en alternance : affecter au plus proche, recentrer | descente alternée, chaque demi-pas à son optimum | p07-04 |
| Réseau (backprop) | tous les poids W | ∂L/∂W par VJP depuis la sortie | W ← W − η∇, minibatch | p08-01 pas 5–6 ; p03-02 pas 7 |
| Descente 2 paramètres | β ∈ R² sur un bol allongé | Aβ − b | même pas, mais κ = 71 : 114 pas à η = 0,02 pour diviser l'écart par 10 | w03-01 |

Lecture de la table : boosting = descente **dans l'espace des fonctions**, le taux d'apprentissage est ν ; Lloyd = descente **par blocs** où chaque bloc se résout en forme fermée (b06) ; backprop = le calcul du gradient, pas la descente elle-même (p08-01 le dit : ici on calcule, p03-02 on utilise).

## Figure exigée
- **Figure 1 — `descent`** avec quatre onglets/boutons qui changent l'étiquette de l'axe (β · F(x) · μ · W) et la légende, mais **pas la courbe** : f = (θ − 1)², même trajectoire, mêmes trois régimes de η. Readout : « ce qui bouge : … ; le pas : identique ». Légende : la courbe ne change pas ; seul le nom de l'axe change.

## Ce qui casse partout de la même façon
- Pas trop grand ⇒ divergence (η > 2/courbure ; ν trop grand en boosting ⇒ surapprentissage rapide).
- Non-convexité ⇒ optimum local : réseaux ; k-means (init ratée, p07-04) ; le boosting sur arbres n'a pas ce problème parce que chaque pas est un ajustement local, mais il surapprend si on ne s'arrête pas.
- Gradient nul ⇒ rien n'apprend (p03-01) : entrée nulle en backprop, cluster vide en k-means.

## Résumé
1. Un seul pas : θ ← θ − η∇L. Ce qui change est θ : vecteur, fonction, centroïdes, poids.
2. Boosting = descente sur une fonction (ν = taux) ; Lloyd = descente alternée à demi-pas exacts ; backprop = calcul du gradient.
3. Même casse : pas trop grand, non-convexité, gradient nul.

**Phrase d'entretien** : « La régression, le boosting, k-means et un réseau font le même geste : descendre un critère par petits pas dans la direction opposée au gradient. Ce qui change, c'est l'objet qui bouge — un vecteur de coefficients, une fonction corrigée arbre par arbre, des centroïdes réaffectés en alternance, des millions de poids. »

## Chaîne verbalisée
1. Même argument, autre habit : dans le boosting, qu'est-ce qui bouge et qu'est-ce que le gradient ? → La fonction F ; −∂L/∂F en chaque point, résidus si MSE.
2. Et dans Lloyd ? → Centroïdes et affectations, en alternance ; chaque demi-pas est exact.
3. Et dans un réseau ? → Les poids ; le gradient vient par VJP ; la descente est celle de p03-02.
4. Qu'ont-ils tous en commun quand ça casse ? → Pas trop grand ⇒ divergence ; non-convexe ⇒ local ; pente nulle ⇒ rien.

## Ce qui a cassé pour Salah
- Q12.1 (boosting : gradient de la loss, pas résidus de l'arbre précédent) : la ligne « boosting » de la table est écrite contre ça.
- Signe du gradient à re-solliciter (bilan 16/09) : la figure 1 montre le pas dans le bon sens, quel que soit l'onglet.

## Questions pour la revue

Tous les chiffres du fil rouge ont été revérifiés par script avant écriture (trajectoires à
η = 0,25 / 0,9 / 1,1, gradient de la log-loss sur deux observations, boosting à ν = 0,5,
Lloyd 1D, neurone de p08-01, valeurs propres de A) : un seul écart.

1. **« κ = 71 pas nécessaires » (ligne « Descente 2 paramètres » de la table)** — la formule
   mélangeait deux nombres. Vérifié : les valeurs propres de A = [[15, 28], [28, 57]] sont
   1 et 71, donc κ = **71** et η_max = 2/71 = 0,028 ; le nombre de **pas** est celui de w03-01,
   ln 0,1 / ln 0,98 = 113,97, soit **114 pas** à η = 0,02 pour diviser l'écart par 10.
   Corrigé ci-dessus et écrit ainsi dans la sheet (pas 2 et pas 7).

2. **Convention sur la loss du boosting — tranchée en revue 4** : la loss du boosting
   s'écrit **avec le ½**, pour que le pseudo-résidu soit le résidu. Ligne posée au pas 4 de
   la sheet et reportée dans `specs/p07-03` sous « Convention » : « ici le ½ est gardé pour
   que le pseudo-résidu soit le résidu ; le facteur est absorbé par ν sinon ». Les cibles du
   pas 4 sont inchangées (arbre 2 : y − F₁ = (−2 ; 0 ; −1 ; +3)) ; seule la valeur affichée
   de L suit la convention, 13 → 7 au lieu de 26 → 14.

3. **Outillage** : `tools/validate_sheet.py` n'acceptait que des parties numériques
   (`part=(\d+)`). Les ponts vivent dans la partie « B » de `build_index.py` ; le motif est
   passé à `part=([0-9A-Z]+)`. Aucune autre sheet n'est affectée. **Validé en revue 4.**

**Arbitrage de revue 4, 17/09 — validé 17/09.** La **convention de la loss du boosting est tranchée** : loss écrite avec le ½, le pseudo-résidu est le résidu, ligne reportée dans `specs/p07-03` sous « Convention » ; L affichée au pas 4 passe de 26 → 14 à 13 → 7, les cibles sont inchangées. Correction κ = 71 / 114 pas **validée**. Motif `part=([0-9A-Z]+)` du validateur **validé**. Statut `reviewed`.
