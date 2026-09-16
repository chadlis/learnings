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
status: reviewed
---

## Question du déroulé
Sur les données colinéaires de D4 avec λ = 1, refais la descente à la main et compare à la forme fermée.

## Marches
1. **Le décor** : A = XᵀX + I = [[15, 28], [28, 57]], b = Xᵀy = (14, 28), L(β) = ½βᵀAβ − bᵀβ.
2. **Gradient** : ∇L = Aβ − b. En β = (0, 0) : (−14, −28). Direction −∇ = (14, 28)/‖·‖ = (0,447 ; 0,894) : vers la droite des solutions. Mais (1 ; 2) est le vecteur propre de λ = 71 : l'origine est sur l'axe raide, donc **le déroulé part de β₀ = (1 ; 0)**, une solution OLS de D4, où ∇L = (1 ; 0). *(arbitrage de revue du 16/09)*
3. **Courbures** : valeurs propres 1 et 71 (vérifier : trace 72, det 855 − 784 = 71). κ = 71. η_max = 2/71 = 0,028.
4. **Trois pas à η = 0,02 depuis β₀ = (1 ; 0)**, chiffrés. Écart initial e₀ = (57/71 ; −28/71), norme 0,8944, dont **−2/√5 = −0,8944 sur la vallée** (−2 ; 1)/√5 et **1/(71√5) = 0,0063 sur le mur** (1 ; 2)/√5 — rapport exactement 142. Puis : ∇L(β₀) = (1 ; 0), β₁ = (0,98 ; 0) ; ∇L(β₁) = (14,7 − 14 ; 27,44 − 28) = (0,7 ; −0,56), β₂ = (0,966 ; 0,0112) ; ∇L(β₂) = (0,8036 ; −0,3136), β₃ = (0,9499 ; 0,0175). Écarts : 0,8944 → 0,8765 → 0,8590 → 0,8418, soit le facteur plat 0,98 lisible directement ; la composante raide tombe de 0,0063 à 0,00047 et disparaît.
5. **Combien de pas** : facteur (1 − η·1) = 0,98 sur la direction plate ⇒ ln 0,1 / ln 0,98 = 113,97, soit **114 pas** pour un facteur 0,1. Table du prix de l'itération depuis (1 ; 0) : k = 10 → écart 0,7308 (18 % du chemin), 30 → 0,4879 (45 %), 60 → 0,2661 (70 %), 114 → 0,0894 (90 %). Forme fermée : une résolution 2×2 → (0,197 ; 0,394).
6. **Préconditionner** : dans la base propre, un pas par direction (η = 1/λᵢ) converge en une itération — c'est ce que Newton fait, et ce qu'Adam approxime par coordonnée.

## Figures exigées
- **Figure 1 — SVG custom via `plot`** : ellipses de niveau de L, trajectoire à η réglable (`slider` 0,005–0,03), 60 pas **depuis (1 ; 0) par défaut**, point de la forme fermée marqué. Boutons de départ : (1 ; 0) — celui du déroulé, (−1 ; 1) — autre solution OLS, (0 ; 0) — le mirage. Readout : distance à l'optimum après k pas.

## Ce qui a cassé pour Salah
- Calculs de D4 à réutiliser tels quels (déjà validés). Vérifier chaque produit matriciel avec un script avant d'écrire.

## Exclusions
Pas de Newton au-delà de la marche 6.

## Questions pour la revue

Trois écarts relevés en vérifiant chaque produit matriciel par script avant écriture
(`A`, `b`, valeurs propres, itérés, forme fermée : tout le reste du spec est exact).

1. **β₃ était faux** — validé 16/09 (marche 4). Le spec donnait `(0,2287 ; 0,4575)`. Le calcul est
   ∇L(β₂) = A·(0,1624 ; 0,3248) − b = (−2,4696 ; −4,9392), donc
   β₃ = β₂ + 0,02·(2,4696 ; 4,9392) = **(0,2118 ; 0,4236)**. Corrigé dans le spec et
   dans la sheet. Contrôle indépendant : l'écart à β̂ doit être multiplié par
   (1 − 0,02·71) = −0,42 à chaque pas, et 0,0778 × (−0,42) = −0,0327 = l'écart de β₃.

2. **« ≈ 115 pas » → 114** — validé 16/09 (marche 5). ln 0,1 / ln 0,98 = 113,974, et 0,98¹¹⁴ = 0,0999.

3. **Le départ (0 ; 0) annule la direction plate — tranché le 16/09 : θ₀ = (1 ; 0).** — validé 16/09
   b = (14 ; 28) est colinéaire à (1 ; 2), vecteur propre de A pour λ = 71, donc β̂ l'est aussi :
   partir de l'origine met l'écart **entièrement** sur l'axe raide, la descente converge en six pas
   et κ = 71 reste invisible. Le déroulé part donc de **(1 ; 0)**, une solution OLS de D4. Là
   l'écart vaut 0,8944, dont 0,8944 sur la vallée et 0,0063 sur le mur — rapport exactement 142 —
   et les marches 4 et 5 décrivent enfin la même descente. Les marches 4, 5 et la figure 1 ont été
   recalculées par script ; (0 ; 0) subsiste comme bouton de la figure et comme troisième limite
   du bloc « où ça casse », où il sert de contre-exemple : un seul essai de learning rate depuis
   un seul point de départ ne mesure pas le conditionnement.
