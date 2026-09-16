---
id: w03-01
series: walkthrough
part: "03"
number: "01"
slug: descente-sur-ridge
title: Descente sur un bol allongé — ridge à deux paramètres
subtitle: p03-02 appliqué aux chiffres de D4 : κ = 71, forme fermée vs 150 itérations
prereq: [p03-02, p02-02]
anki: [ml::optimisation]
bridges: [b01, b06]
next: p04-01
status: ready
---

## Question du déroulé
Sur les données colinéaires de D4 avec λ = 1, refais la descente à la main et compare à la forme fermée.

## Marches
1. **Le décor** : A = XᵀX + I = [[15, 28], [28, 57]], b = Xᵀy = (14, 28), L(β) = ½βᵀAβ − bᵀβ.
2. **Gradient** : ∇L = Aβ − b. En β = (0, 0) : (−14, −28). Direction −∇ = (14, 28)/‖·‖ = (0,447 ; 0,894) : vers la droite des solutions.
3. **Courbures** : valeurs propres 1 et 71 (vérifier : trace 72, det 855 − 784 = 71). κ = 71. η_max = 2/71 = 0,028.
4. **Trois pas à η = 0,02**, chiffrés : β₁ = (0,28 ; 0,56) ; β₂ = ? (calculer : Aβ₁ − b = (15·0,28 + 28·0,56 − 14 ; 28·0,28 + 57·0,56 − 28) = (19,88 − 14 ; 39,76 − 28) = (5,88 ; 11,76) ; β₂ = β₁ − 0,02·(5,88 ; 11,76) = (0,162 ; 0,325)) ; β₃ = (0,2287 ; 0,4575)… oscillation autour de (0,197 ; 0,394) le long de la direction raide (1, 2)/√5, contraction lente le long de la direction plate (−2, 1)/√5.
5. **Combien de pas** : facteur (1 − η·1) = 0,98 sur la direction plate ⇒ ≈ 115 pas pour un facteur 0,1. Forme fermée : une résolution 2×2 → (0,197 ; 0,394).
6. **Préconditionner** : dans la base propre, un pas par direction (η = 1/λᵢ) converge en une itération — c'est ce que Newton fait, et ce qu'Adam approxime par coordonnée.

## Figures exigées
- **Figure 1 — SVG custom via `plot`** : ellipses de niveau de L, trajectoire à η réglable (`slider` 0,005–0,03), 60 pas, point de la forme fermée marqué. Readout : distance à l'optimum après k pas.

## Ce qui a cassé pour Salah
- Calculs de D4 à réutiliser tels quels (déjà validés). Vérifier chaque produit matriciel avec un script avant d'écrire.

## Exclusions
Pas de Newton au-delà de la marche 6.
