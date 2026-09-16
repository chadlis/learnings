---
id: p04-01
series: chain
part: "04"
number: "01"
slug: matrice-action
title: Une matrice est une action — colonnes, image, noyau, affine
subtitle: algèbre — lire Ax comme un geste, pas comme un tableau
prereq: []
anki: [algebre::matrice, algebre::noyau, algebre::affine, algebre::temoin]
bridges: [b02]
next: p04-02
status: ready
---

## Question de la chaîne
Que fait une matrice à un vecteur, quand cette action perd de l'information, et pourquoi une couche de réseau n'est pas linéaire ?

## Prérequis
Aucune sheet. Rappel : vecteur = flèche de ℝⁿ ; produit scalaire ; combinaison linéaire.

## Hypothèses posées
- H1 : on lit une matrice A ∈ ℝᵐˣⁿ comme l'application x ↦ Ax de ℝⁿ vers ℝᵐ, jamais comme une grille de nombres.
- H2 : dimension 2 pour les figures ; tout se transporte.

## Exemple fil rouge
A = [[2, 1], [0, 3]]. Ae₁ = (2, 0), Ae₂ = (1, 3) : les colonnes sont les images de la base. A(1, 1) = 1·(2, 0) + 1·(1, 3) = (3, 3). det A = 6 : le carré unité devient un parallélogramme d'aire 6. Inversible.
B = [[1, 2], [2, 4]] : colonnes colinéaires, image = la droite dirigée par (1, 2), noyau = la droite dirigée par (2, −1) : B(2, −1) = 0. det B = 0, rang 1, non inversible : deux entrées différentes donnent la même sortie, on ne peut pas remonter.
Affine : f(x) = Wx + b avec b ≠ 0 : f(0) = b ≠ 0, f(x + y) ≠ f(x) + f(y). C'est une couche de réseau.
Témoin : min_{β ∈ ℝ²} RSS(β) ≤ RSS(β₁, 0) = min_{β₁} RSS(β₁) : ajouter une feature ne peut pas augmenter le RSS minimal, parce que β₂ = 0 est atteignable.

## Pas de la chaîne
1. **Le décor.** Un tableau 2×2 ne dit rien ; « ce qu'il fait à (1, 0), à (0, 1), et donc à tout le plan » dit tout.
2. **Ax = combinaison des colonnes** [tronc]. Ax = x₁·col₁ + … + xₙ·colₙ. Les colonnes sont les images des vecteurs de base ; connaître l'action sur la base, c'est la connaître partout (linéarité). Au tableau : « x se décompose sur la base, donc Ax se décompose sur les images de la base, donc Ax est la combinaison des colonnes pondérée par les coordonnées de x. »
3. **Image = ce qu'on peut atteindre.** Im A = span des colonnes ; rang = sa dimension. Pour B, l'image est une droite : B écrase le plan sur une droite.
4. **Noyau = ce qui est écrasé sur 0** [tronc]. Ker A = {x : Ax = 0}. Si Ker ≠ {0}, deux entrées x et x + k (k ∈ Ker) ont la même image : information perdue, A non inversible, det A = 0. rang + dim Ker = n. Au tableau : « S'il existe k non nul envoyé sur zéro, alors x et x + k ont la même image, donc l'action n'est pas injective, donc elle n'est pas inversible, donc son déterminant est nul. »
5. **Déterminant = facteur d'aire (de volume), avec signe.** det A = 6 : les aires sont multipliées par 6 ; det < 0 : orientation renversée ; det = 0 : aplatissement, donc noyau non trivial. C'est le lien géométrique entre « non inversible » et « colonnes dépendantes ».
6. **Affine ≠ linéaire.** Wx + b : la translation b casse f(0) = 0 et l'additivité. Une couche de réseau est affine ; l'empilement affine ∘ affine reste affine — c'est pourquoi il faut une non-linéarité entre deux couches (Phase 2). Dire « linéaire en β » pour la logistique (z = βᵀx est linéaire en β), pas « linéaire ».
7. **Le témoin atteignable** [tronc]. Pour majorer un minimum, exhiber un point atteignable : min_S f ≤ f(s₀) pour tout s₀ ∈ S. Application : R² ne peut que croître quand on ajoute une feature (β_nouveau = 0 est atteignable, donc le nouveau min ≤ l'ancien). Même geste pour « le biais du max » (p01-04) et « tuning sur le test ». Au tableau : « Le minimum sur un ensemble est plus petit que la valeur en n'importe quel point de l'ensemble, donc il suffit d'exhiber un point pour le majorer, donc l'ancien optimum, atteignable dans le nouvel espace, majore le nouveau minimum. »
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plane`** : grille + carré unité + vecteurs e₁, e₂ ; presets A = [[2,1],[0,3]], B = [[1,2],[2,4]], rotation 45°, cisaillement [[1,1],[0,1]], réflexion ; readout det et « aire du carré ». Légende : les colonnes sont les images de e₁, e₂ ; B aplatit le plan sur une droite.
- **Figure 2 — `plane` + vecteur mobile** (`slider` angle) : x tourne sur le cercle, Bx dessiné : quand x ∥ (2, −1), Bx = 0 ; ligne du noyau en `fixed`. Légende : le noyau est la direction écrasée.
- **Figure 3 — `plot`** : RSS(β₁) sur une feature (parabole) et le point RSS(β₁*, 0) marqué comme majorant du min sur deux features ; readout des deux minima sur un petit jeu (3 points de p05-01 + une feature de bruit). Légende : le témoin.

## Où ça casse
- **Lire la matrice ligne par ligne** : « la ligne i donne la sortie i » est vrai mais ne dit pas ce que fait A ; la lecture par colonnes est celle qui prédit image et noyau.
- **Confondre affine et linéaire** dans les preuves de convexité (z affine en β ⇒ log-loss convexe en β : p03-02).
- **Noyau non trivial en régression** : colinéarité ⇒ XᵀX non inversible ⇒ droite de solutions (p02-02).
- **Le témoin ne minore pas** : exhiber un point majore un min ; pour minorer, il faut un argument sur tout l'ensemble.

## Résumé
1. Ax = combinaison des colonnes ; les colonnes sont les images de la base.
2. Image = atteignable (rang) ; noyau = écrasé sur 0 ; noyau ≠ {0} ⇔ non inversible ⇔ det = 0.
3. det = facteur d'aire signé.
4. Wx + b est affine ; affine ∘ affine = affine ⇒ non-linéarité nécessaire ; « linéaire en β ».
5. Témoin atteignable : min_S f ≤ f(s₀) ⇒ R² croît avec une feature ; biais du max.

**Phrase d'entretien** : « Je lis une matrice par ses colonnes : ce sont les images de la base, et Ax est leur combinaison. L'image est ce qu'on peut atteindre, le noyau ce qui est écrasé sur zéro ; un noyau non trivial signifie deux entrées pour une sortie, donc pas d'inverse, donc déterminant nul. Une couche de réseau est affine, pas linéaire, et c'est pour ça qu'il faut une non-linéarité entre deux couches. »

## Chaîne verbalisée
1. Que vaut A(1,1) pour A = [[2,1],[0,3]] et pourquoi ? → (3, 3) : col₁ + col₂.
2. Quel est le noyau de B = [[1,2],[2,4]] et que dit-il ? → Droite de (2, −1) ; non inversible, det 0, rang 1.
3. Que mesure det A ? → Le facteur d'aire, avec le signe de l'orientation.
4. Pourquoi Wx + b n'est pas linéaire, et pourquoi c'est important ? → f(0) = b ; affine ∘ affine = affine ⇒ non-linéarité.
5. Pourquoi R² ne peut que croître avec une feature ? → β = 0 atteignable ⇒ nouveau min ≤ ancien.

## Ce qui a cassé pour Salah
- Q3 de la calibration (témoin atteignable) réussie : le pas 7 est un rappel et un pont, pas une découverte ; l'écrire en une brique.
- Learnings : dire « linéaire en β » et non « linéaire » — pas 6.
- t04 (index) : « Ax = combinaison des colonnes, noyau ⇒ non inversible, Wx + b affine » déjà en cartes ; la chaîne les enchaîne en un geste (colonnes → image → noyau → det).

## Exclusions
Pas de calcul d'inverse, pas de systèmes linéaires généraux, pas de produit matriciel comme composition au-delà d'une ligne (p08-01).
