---
id: p03-02
series: chain
part: "03"
number: "02"
slug: gradient-descente
title: Gradient et descente — pente, pas, convexité, conditionnement
subtitle: la porte d'entrée de la Phase 2 : ce que voit un optimiseur
prereq: [p04-01, p04-02, p08-01]
anki: [analyse::gradient-jacobienne, ml::optimisation, ml::learning-rate, algebre::eigen]
bridges: [b01, b06]
next: p04-01
status: ready
---

## Question de la chaîne
Pourquoi −∇L ? Pourquoi un pas trop grand diverge ? Quand résout-on en une fois, quand itère-t-on ? Et pourquoi la descente zigzague sur un bol allongé ?

## Prérequis
- p04-01 : produit scalaire, Cauchy-Schwarz.
- p04-02 : valeurs propres d'une matrice symétrique ; λ_max/λ_min.
- p08-01 : gradient et jacobienne comme application linéaire locale.

## Hypothèses posées
- H1 : L est dérivable ; on ne voit L que **localement** (valeur et pente au point courant).
- H2 : le pas η est fixe (pas de line search, pas de momentum — Phase 2).
- H3 : pour la convergence chiffrée, L est quadratique : L(θ) = ½ θᵀAθ − bᵀθ, A symétrique définie positive.

## Exemple fil rouge
1D : L(θ) = ½·a·(θ − 1)², a = 2 (courbure). Pas : θ ← θ − η·a(θ − 1) = 1 + (1 − ηa)(θ − 1). Converge ssi |1 − ηa| < 1 ⇔ 0 < η < 2/a = 1. η = 0,25 : facteur 0,5 ; η = 0,9 : 0,8 (oscille) ; η = 1,1 : −1,2, diverge.
2D : ridge de D4/p02-02 avec λ = 1 : A = XᵀX + I = [[15, 28], [28, 57]], valeurs propres 1 et 71, κ = 71. Pas maximal η < 2/71 = 0,028 ; à ce pas, la direction de valeur propre 1 se contracte de 1 − 0,028 ≈ 0,97 par itération : ~150 itérations pour un facteur e⁻¹. Forme fermée : (0,197 ; 0,394) en une résolution.

## Pas de la chaîne
1. **Le décor.** Un optimiseur ne voit pas L, il voit L(θ) et ∇L(θ). Il doit choisir une direction et une longueur.
2. **Pourquoi −∇L** [tronc]. Le gain d'un pas unitaire u vaut ⟨∇L, u⟩ + o(1), maximal pour u = ∇L/‖∇L‖ (Cauchy-Schwarz), minimal pour l'opposé. Au tableau : « La variation au premier ordre est le produit scalaire avec le gradient, donc elle est maximale dans sa direction, donc minimale dans la direction opposée, donc on descend en −∇L. »
3. **Le pas η.** θ ← θ − η∇L. Sur une parabole de courbure a, le pas contracte l'écart d'un facteur (1 − ηa) : η < 1/a converge sans osciller, 1/a < η < 2/a oscille et converge, η > 2/a diverge. Figure 1. Au tableau : « L'écart au minimum est multiplié par 1 − ηa à chaque pas, donc il tend vers zéro si ce facteur est de module inférieur à 1, donc η doit rester sous 2 sur la courbure. »
4. **Convexité** [tronc]. Convexe ⇒ tout minimum local est global ; strictement convexe ⇒ unique. La log-loss est convexe en z (dérivée seconde p(1 − p) > 0) et z affine en β ⇒ convexe en β. La descente arrive au bon endroit ; la vitesse est une autre affaire.
5. **Forme fermée vs itération.** ∇L = 0 est un système ; s'il est linéaire en θ (OLS, ridge : (XᵀX + λI)θ = Xᵀy) on le résout d'un coup ; sinon (logistique : Σ(σ(xᵢᵀβ) − yᵢ)xᵢ = 0, σ non linéaire) on itère. Au tableau : « Annuler le gradient donne des équations, donc si elles sont linéaires en θ on inverse une matrice, donc sinon on descend le gradient sur une fonction convexe. »
6. **Conditionnement** [tronc]. Quadratique : ∇L = Aθ − b ; dans la base propre chaque direction a sa courbure λᵢ. Un seul η pour toutes : η < 2/λ_max, et la direction λ_min se contracte de (1 − ηλ_min) ≈ 1 − 2λ_min/λ_max. Le nombre de pas est ~κ = λ_max/λ_min. Zigzag : le gradient pointe vers le mur raide, pas vers le fond de la vallée. Figure 2. Au tableau : « Le pas est limité par la direction la plus raide, donc la direction la plus plate avance à peine, donc le nombre d'itérations croît avec le rapport des courbures. »
7. **Ce qui vient en Phase 2.** SGD (gradient bruité par minibatch), momentum (mémoire de direction), Adam (pas par coordonnée) sont des réponses au pas 6. Nommer, ne pas développer.
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `descent`** : f = (θ − 1)², df = 2(θ − 1), x ∈ [−2, 4], θ₀ = 3,5 ; `slider` η ∈ [0,02 ; 1,2] ; `slider` pas ∈ [1, 30]. Readout donné par la primitive (divergence détectée). Légende : trois régimes, seuil 2/a = 1.
- **Figure 2 — SVG custom via `plot`** : ellipses de niveau de ½θᵀAθ avec A diag(1, κ) (κ par `slider` ∈ [1, 100]), trajectoire de la descente à η = 1,8/κ depuis (3, 3) sur 40 pas, points reliés. Readout : nombre de pas pour ‖θ‖ < 0,05. Légende : zigzag sur le mur raide, lenteur sur la vallée.
- **Figure 3 — `plot`** : log-loss en z (convexe) et 1 − σ(z)² en pointillé (non convexe, D4) ; readout de la dérivée seconde. Légende : pourquoi la descente sur la log-loss ne se perd pas.

## Où ça casse
- **Non convexe** (réseaux) : minima locaux, plateaux, selles ; la descente marche quand même, sans garantie — Phase 2.
- **Gradient bruité** (minibatch) : le pas doit décroître ou être moyenné (momentum).
- **Échelles hétérogènes** : κ explose ; standardiser les features est un préconditionnement.
- **Forme fermée coûteuse** : (XᵀX)⁻¹ en O(p³) ; à p grand, on itère même quand la forme fermée existe.

## Résumé
1. −∇L est la direction de plus forte descente (Cauchy-Schwarz).
2. Pas η : l'écart est multiplié par (1 − ηa) ; converge ssi η < 2/courbure.
3. Convexe ⇒ le minimum trouvé est global ; strictement ⇒ unique.
4. ∇L = 0 linéaire en θ ⇒ forme fermée (OLS, ridge) ; sinon itérer (logistique).
5. κ = λ_max/λ_min : le pas est bridé par la direction raide, la plate avance à peine ⇒ zigzag, ~κ itérations.
6. SGD, momentum, Adam : réponses de la Phase 2 au point 5.

**Phrase d'entretien** : « Je descends dans la direction opposée au gradient parce que c'est celle où la variation au premier ordre est la plus négative. Le pas est borné par la courbure la plus forte, deux sur lambda max ; la direction la moins courbée avance alors très lentement, et le nombre d'itérations croît avec le conditionnement. Quand annuler le gradient donne un système linéaire, je résous d'un coup ; sinon j'itère, et la convexité me garantit que j'arrive au minimum global. »

## Chaîne verbalisée
1. Pourquoi −∇L et pas une autre direction ? → Variation au premier ordre = ⟨∇L, u⟩, minimale pour u = −∇L/‖∇L‖.
2. À quelle condition le pas converge sur une parabole de courbure a ? → η < 2/a ; oscille entre 1/a et 2/a.
3. Quand a-t-on une forme fermée ? → ∇L = 0 linéaire en θ : OLS, ridge. Logistique : non.
4. Que garantit la convexité ? → Minimum local = global ; unique si stricte.
5. Pourquoi un bol allongé est lent ? → η bridé par λ_max ; direction λ_min contractée de 1 − 2/κ ; ~κ pas.

## Ce qui a cassé pour Salah
- Pas d'échec direct sur ce contenu : −∇ (t04) et convexité (D4) sont en place. Cette chaîne est un **pont** vers B1–B3 (micrograd, makemore, learning rate) : les pas 3 et 6 sont ce que Karpathy fera sentir empiriquement ; ici on les nomme d'avance.
- Scorie « chain rule élidée » : dans le pas 4, écrire explicitement d²/dβ² via z affine.
- Vocabulaire : « solution en forme fermée », pas « système en forme fermée » (learnings).

## Exclusions
Pas de momentum/Adam au-delà du nom (Phase 2). Pas de line search, pas de Newton au-delà d'une mention en pas 5. Pas de non-convexité détaillée.
