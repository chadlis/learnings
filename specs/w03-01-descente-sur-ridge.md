---
id: w03-01
series: walkthrough
part: "03"
number: "01"
slug: descente-sur-ridge
title: Descente sur un bol allongé — ridge à deux paramètres
subtitle: p03-02 appliqué aux chiffres de D4 : κ = 71, forme fermée contre 114 itérations
prereq: [p03-02, p02-02]
anki: [ml::optimisation]
bridges: [b01, b06]
next: p04-01
status: built
---

## Question du déroulé
Sur les données colinéaires de D4 avec λ = 1, refais la descente à la main et compare à la forme fermée.

## Marches
1. **Le décor** : A = XᵀX + I = [[15, 28], [28, 57]], b = Xᵀy = (14, 28), L(β) = ½βᵀAβ − bᵀβ.
2. **Gradient** : ∇L = Aβ − b. En β = (0, 0) : (−14, −28). Direction −∇ = (14, 28)/‖·‖ = (0,447 ; 0,894) : vers la droite des solutions.
3. **Courbures** : valeurs propres 1 et 71 (vérifier : trace 72, det 855 − 784 = 71). κ = 71. η_max = 2/71 = 0,028.
4. **Trois pas à η = 0,02**, chiffrés : β₁ = (0,28 ; 0,56) ; β₂ = ? (calculer : Aβ₁ − b = (15·0,28 + 28·0,56 − 14 ; 28·0,28 + 57·0,56 − 28) = (19,88 − 14 ; 39,76 − 28) = (5,88 ; 11,76) ; β₂ = β₁ − 0,02·(5,88 ; 11,76) = (0,162 ; 0,325)) ; β₃ = (0,2118 ; 0,4236)… oscillation autour de (0,197 ; 0,394) le long de la direction raide (1, 2)/√5, contraction lente le long de la direction plate (−2, 1)/√5.
5. **Combien de pas** : facteur (1 − η·1) = 0,98 sur la direction plate ⇒ ln 0,1 / ln 0,98 = 113,97, soit **114 pas** pour un facteur 0,1 — mais seulement si le départ a une composante plate, ce qui n'est pas le cas de (0 ; 0). Forme fermée : une résolution 2×2 → (0,197 ; 0,394).
6. **Préconditionner** : dans la base propre, un pas par direction (η = 1/λᵢ) converge en une itération — c'est ce que Newton fait, et ce qu'Adam approxime par coordonnée.

## Figures exigées
- **Figure 1 — SVG custom via `plot`** : ellipses de niveau de L, trajectoire à η réglable (`slider` 0,005–0,03), 60 pas, point de la forme fermée marqué. Readout : distance à l'optimum après k pas.

## Ce qui a cassé pour Salah
- Calculs de D4 à réutiliser tels quels (déjà validés). Vérifier chaque produit matriciel avec un script avant d'écrire.

## Exclusions
Pas de Newton au-delà de la marche 6.

## Questions pour la revue

Trois écarts relevés en vérifiant chaque produit matriciel par script avant écriture
(`A`, `b`, valeurs propres, itérés, forme fermée : tout le reste du spec est exact).

1. **β₃ était faux** (marche 4). Le spec donnait `(0,2287 ; 0,4575)`. Le calcul est
   ∇L(β₂) = A·(0,1624 ; 0,3248) − b = (−2,4696 ; −4,9392), donc
   β₃ = β₂ + 0,02·(2,4696 ; 4,9392) = **(0,2118 ; 0,4236)**. Corrigé dans le spec et
   dans la sheet. Contrôle indépendant : l'écart à β̂ doit être multiplié par
   (1 − 0,02·71) = −0,42 à chaque pas, et 0,0778 × (−0,42) = −0,0327 = l'écart de β₃.

2. **« ≈ 115 pas » → 114** (marche 5). ln 0,1 / ln 0,98 = 113,974, et 0,98¹¹⁴ = 0,0999.

3. **Le départ (0 ; 0) annule la direction plate — à arbitrer.** C'est le point de fond.
   b = (14 ; 28) est colinéaire à (1 ; 2), qui est le vecteur propre de A pour λ = 71 ;
   β̂ = (14/71)·(1 ; 2) l'est donc aussi. Partir de l'origine met l'écart initial
   **entièrement** sur l'axe raide, composante plate exactement nulle : la descente reste
   sur cette droite, converge en six pas, et **κ = 71 est invisible**. Les marches 4 et 5
   du spec sont donc en tension : les trois pas chiffrés (départ origine) et les 115 pas
   (direction plate) ne décrivent pas la même descente.

   Traitement retenu dans la sheet, à valider : les trois pas restent depuis (0 ; 0)
   tels que le spec les donne ; la marche 5 nomme explicitement que ce départ est un cas
   particulier, puis chiffre le régime générique depuis **(1 ; 0)** — une des solutions
   OLS de D4 — où l'écart est plat à 100 % : 0,98 par pas, 114 pas pour un facteur 0,1,
   et 0,2661 d'écart restant après 60 pas. La figure a un sélecteur de départ pour que
   les deux régimes se voient au même η. La troisième limite du bloc « où ça casse »
   en fait la leçon : un seul essai de learning rate depuis un seul point de départ ne
   mesure pas le conditionnement.

   Si tu préfères que le déroulé parte directement de (1 ; 0), c'est une réécriture des
   marches 2 à 4 (le gradient en (1 ; 0) vaut (−2 ; −1), moins parlant que −b).
