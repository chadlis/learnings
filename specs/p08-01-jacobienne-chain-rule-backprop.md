---
id: p08-01
series: chain
part: "08"
number: "01"
slug: jacobienne-chain-rule-backprop
title: Jacobienne, chain rule, backprop
subtitle: la porte de micrograd — pourquoi on dérive depuis la sortie
prereq: [p04-01, p03-02]
anki: [analyse::gradient-jacobienne, dl::backprop, analyse::chain-rule]
bridges: [b01]
next: p08-02
status: ready
---

## Question de la chaîne
Pourquoi le gradient d'un réseau se calcule de la sortie vers l'entrée, et pourquoi c'est bon marché ?

## Prérequis
- p04-01 : une matrice est une application linéaire ; produit matrice × vecteur.
- p03-02 : le gradient est ce qui fait bouger un paramètre.

## Hypothèses posées
- H1 : la loss est un **scalaire** L ∈ ℝ. C'est ce qui rend la propagation arrière une suite de produits ligne × matrice.
- H2 : chaque brique est dérivable (ou presque partout : ReLU).

## Exemple fil rouge
Un neurone : z = w·x + b, p = σ(z), L = (p − y)². x = 2, w = 0,5, b = −0,5, y = 1.
z = 0,5 ; p = σ(0,5) = 0,6225 ; L = 0,1425.
Arrière : ∂L/∂p = 2(p − y) = −0,755 ; ∂p/∂z = p(1 − p) = 0,2350 ; ∂L/∂z = −0,1774 ; ∂L/∂w = ∂L/∂z · x = −0,3549 ; ∂L/∂b = −0,1774 ; ∂L/∂x = ∂L/∂z · w = −0,0887.
Coût : couches ℝⁿ → ℝᵐ → ℝᵏ → ℝ avec n = m = 1 000, k = 10 : arrière (1×k)(k×m) puis (1×m)(m×n) = km + mn = 1,01 M multiplications ; avant (k×m)(m×n) puis (1×k)(k×n) = kmn + kn = 10,01 M. Rapport 10.

## Pas de la chaîne
1. **Le décor.** Un réseau est une composition f = f_L ∘ … ∘ f₁ ; on veut ∂L/∂θ pour chaque paramètre de chaque couche, en un passage.
2. **La jacobienne est l'application linéaire locale** [tronc]. Pour f : ℝⁿ → ℝᵐ, J ∈ ℝᵐˣⁿ, J_ij = ∂f_i/∂x_j ; f(x + δ) ≈ f(x) + Jδ. Un gradient est la jacobienne d'une fonction scalaire : une ligne. Au tableau : « Près d'un point, une fonction dérivable est affine, donc sa variation est une matrice fois le déplacement, donc cette matrice — la jacobienne — est toute la dérivée. »
3. **Chain rule = produit de jacobiennes** [tronc]. J_{g∘f}(x) = J_g(f(x)) · J_f(x). Composer des fonctions, c'est composer des applications linéaires locales, donc multiplier leurs matrices. Sur le neurone : ∂L/∂z = ∂L/∂p · ∂p/∂z = −0,755 × 0,235. Au tableau : « La dérivée d'une composée est la composée des dérivées, donc un produit de matrices, dans l'ordre des couches. »
4. **Loss scalaire ⇒ ligne × matrice ⇒ depuis la sortie** [tronc]. J_L est une ligne 1×k. Multiplier depuis la sortie : (1×k)(k×m) = 1×m, puis (1×m)(m×n) = 1×n : chaque produit est un **vecteur × matrice** (VJP), coût = taille de la matrice. Depuis l'entrée il faudrait des produits matrice × matrice. Au tableau : « La loss est un scalaire, donc sa jacobienne est une ligne, donc en partant d'elle chaque étape reste une ligne, donc on ne forme jamais une jacobienne intermédiaire, donc on part de la sortie. »
5. **Le coût, chiffré.** km + mn contre kmn + kn : sur le fil rouge 1 M contre 10 M ; sur un réseau réel, des ordres de grandeur. C'est la raison d'être de l'autodiff en mode arrière ; le mode avant sert quand il y a peu d'entrées et beaucoup de sorties.
6. **Ce que chaque nœud doit savoir faire.** Reçoit ∂L/∂sortie (une ligne), renvoie ∂L/∂entrée = ∂L/∂sortie · J_local, et accumule ∂L/∂θ. Il n'a pas besoin de connaître le reste du graphe : c'est `_backward` de micrograd. Addition : passe le gradient tel quel aux deux branches ; multiplication : croise (∂/∂a = grad·b) ; un nœud utilisé deux fois **additionne** ses gradients.
7. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom via `plot` (graphe de calcul)** : nœuds x, w, b → z → p → L en ligne ; bouton « avant » qui remplit les valeurs (2 ; 0,5 ; −0,5 ; 0,5 ; 0,6225 ; 0,1425), bouton « arrière » qui remplit les gradients de droite à gauche un nœud par clic (1 ; −0,755 ; −0,1774 ; −0,3549 / −0,1774 / −0,0887). `slider` w pour voir tout se recalculer. Légende : le gradient arrive de la droite, chaque nœud le multiplie par sa dérivée locale.
- **Figure 2 — `plot` + `slider` m ∈ [10, 5 000]** (n = m, k = 10) : coût arrière km + mn et coût avant kmn + kn en fonction de m, axe y en log. Légende : le rapport tend vers m/ (1 + m/k)… ~k à grand m ; pourquoi personne ne dérive depuis l'entrée.
- **Figure 3 — `plot`** : σ(z) et σ′(z) = p(1 − p) ; marque z = 0,5. Légende : la dérivée locale d'une sigmoïde est ≤ 0,25 et s'écrase aux extrêmes — le gradient qui traverse dix sigmoïdes est multiplié par ≤ 0,25¹⁰ (vanishing).

## Où ça casse
- **Gradient évanescent** : produit de dérivées locales < 1 ⇒ les premières couches ne reçoivent rien (sigmoïde, tanh profonds). ReLU, résiduels, batchnorm (Phase 2).
- **Nœud réutilisé** : oublier d'additionner les gradients des deux usages est le bug classique de micrograd.
- **In-place** : modifier une valeur dont la backward a besoin casse le graphe (PyTorch le refuse).
- **Non-dérivabilité** : ReLU en 0, max, argmax (gradient nul partout : critère en escalier, p03-01).

## Résumé
1. Jacobienne = application linéaire locale ; gradient = jacobienne d'un scalaire = une ligne.
2. Chain rule = produit de jacobiennes dans l'ordre des couches.
3. Loss scalaire ⇒ partir de la sortie garde une ligne à chaque étape (VJP) ⇒ coût = somme des tailles de matrices, pas leur produit.
4. Chaque nœud : reçoit ∂L/∂sortie, multiplie par sa dérivée locale, accumule ; réutilisé ⇒ additionne.
5. Casse : évanescence, gradients non additionnés, in-place, escaliers.

**Phrase d'entretien** : « La dérivée d'une composée est un produit de jacobiennes. Comme la loss est un scalaire, sa jacobienne est une ligne, et en partant de la sortie chaque étape reste un produit ligne fois matrice : on ne forme jamais de jacobienne intermédiaire et le coût est la somme des tailles des couches au lieu de leur produit. Chaque nœud n'a besoin que de sa dérivée locale et du gradient qui lui arrive. »

## Chaîne verbalisée
1. Qu'est-ce qu'une jacobienne, en une phrase ? → L'application linéaire qui approxime f près d'un point.
2. Que dit la chain rule matriciellement ? → J_{g∘f} = J_g · J_f.
3. Pourquoi depuis la sortie ? → Loss scalaire ⇒ ligne ; ligne × matrice à chaque pas ; jamais matrice × matrice.
4. Combien coûte l'arrière sur ℝ¹⁰⁰⁰ → ℝ¹⁰⁰⁰ → ℝ¹⁰ ? → km + mn ≈ 1 M contre 10 M en avant.
5. Que fait un nœud réutilisé deux fois ? → Il additionne les deux gradients reçus.

## Ce qui a cassé pour Salah
- Scorie persistante : **chain rule élidée** dans les dérivations — le pas 3 l'écrit facteur par facteur sur le neurone, avec les valeurs. Le fil rouge est le calcul de ce matin (log-loss en deux étages) transposé sur une MSE.
- DL fondamentaux N2 au diagnostic : ne pas réexpliquer la descente ; cette chaîne fixe le vocabulaire (VJP, dérivée locale, accumulation) que micrograd rendra concret en B1.

## Exclusions
Pas de mode avant détaillé (dual numbers), pas de hessienne, pas de batchnorm/ReLU au-delà de la casse.
