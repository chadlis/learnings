---
id: p04-01
series: chain
part: "04"
number: "01"
slug: matrice-action
title: Une matrice est une action — colonnes, image, noyau, affine
subtitle: lire Ax comme un geste sur le plan, pas comme un tableau de nombres
prereq: []
anki: [algebre::matrice-action, algebre::noyau, algebre::affine, algebre::temoin]
bridges: [b02]
next: p04-02
status: ready
---

## Question de la chaîne
Que fait une matrice quand on la multiplie par un vecteur, pourquoi une matrice non inversible « perd » de l'information, et pourquoi Wx + b n'est pas linéaire ?

## Prérequis
Aucune sheet. Vecteur = flèche (ou liste de coordonnées) ; produit scalaire ⟨u, v⟩ = Σ uᵢvᵢ ; norme ‖v‖ = √⟨v, v⟩.

## Hypothèses posées
- H1 : on lit une matrice **par colonnes** : Ax = Σ xⱼ·(colonne j). C'est le seul réflexe de la chaîne.
- H2 : dimension 2 pour voir, mais rien ne dépend de la dimension.

## Exemple fil rouge
A = [[2, 1], [0, 3]] : colonnes (2, 0) et (1, 3). A(1, 0) = (2, 0) ; A(0, 1) = (1, 3) ; A(1, 1) = (3, 3) ; A(1, −1) = (1, −3). Le carré unité devient le parallélogramme de sommets (0,0), (2,0), (3,3), (1,3), d'aire |det A| = 6.
B = [[1, 2], [2, 4]] : colonnes (1, 2) et (2, 4), colinéaires : tout Bx tombe sur la droite dirigée par (1, 2). Noyau : B(2, −1) = (0, 0). det B = 0 : le carré unité s'écrase en un segment. Résoudre Bx = (1, 1) : impossible (pas sur la droite) ; Bx = (1, 2) : une droite entière de solutions, (1, 0) + t(2, −1).
Affine : f(x) = Wx + b avec b = (1, 1) : f(0) = (1, 1) ≠ 0 ; f(2x) ≠ 2f(x). Le biais décale.
Témoin : R² = 1 − RSS/TSS ; ajouter une variable ne peut pas faire monter RSS, parce que β_nouveau = 0 est atteignable et redonne l'ancien RSS.

## Pas de la chaîne
1. **Le décor.** Une matrice 2×2 est un tableau de 4 nombres. Elle est aussi une machine qui prend un vecteur et en rend un autre. Lire la machine, pas le tableau.
2. **Ax = combinaison des colonnes** [tronc]. Ax = x₁·col₁ + x₂·col₂. Donc : A envoie la base canonique sur ses colonnes, et tout le reste suit par linéarité. Au tableau : « Le produit matrice-vecteur pondère les colonnes par les coordonnées, donc l'image de la base est la liste des colonnes, donc connaître les colonnes c'est connaître l'action entière. »
3. **Linéarité = la grille reste une grille.** A(u + v) = Au + Av, A(λu) = λAu : les droites restent des droites, les parallèles restent parallèles, l'origine reste fixe. Le carré unité devient un parallélogramme, d'aire |det A| ; det = 0 ⇔ l'aire s'écrase. Figure 1.
4. **Image et rang.** L'image est l'ensemble des Ax = l'espace engendré par les colonnes. Rang = sa dimension = nombre de colonnes indépendantes. B a deux colonnes colinéaires ⇒ rang 1 ⇒ l'image est une droite.
5. **Noyau = ce qui est envoyé sur 0** [tronc]. Ker A = {x : Ax = 0}. Si Ker ≠ {0}, deux entrées différentes (x et x + k) ont la même sortie : l'information est perdue, A n'est pas inversible. Rang + dim Ker = n. Au tableau : « Un vecteur du noyau est écrasé sur zéro, donc l'ajouter à une entrée ne change pas la sortie, donc deux entrées se confondent, donc on ne peut pas revenir en arrière. »
6. **Résoudre Ax = b.** Trois cas : b hors de l'image ⇒ aucune solution (moindres carrés : on projette) ; b dans l'image et Ker = {0} ⇒ une solution ; b dans l'image et Ker ≠ {0} ⇒ une solution + tout le noyau (la droite de D4, p02-02 : la pénalité choisit). Au tableau : « Les solutions forment une solution particulière plus le noyau, donc leur nombre est 0, 1 ou une infinité selon que b est atteignable et que le noyau est trivial. »
7. **Affine ≠ linéaire.** f(x) = Wx + b : f(0) = b ≠ 0, f(2x) ≠ 2f(x). C'est une action linéaire suivie d'un décalage ; le biais d'un neurone déplace la frontière sans la tourner. Une couche sans biais force la frontière à passer par l'origine.
8. **Le témoin atteignable.** Pour montrer qu'un minimum ne peut pas monter quand on élargit l'espace, il suffit d'exhiber un point du nouvel espace qui reproduit l'ancien : β_nouveau = 0 rend l'ancien modèle ⇒ min RSS ne monte pas ⇒ R² ne baisse jamais en ajoutant une variable. Même geste pour le biais du max (b02). Au tableau : « L'ancien optimum est atteignable dans le nouvel espace, donc le nouveau minimum est au plus l'ancien, donc élargir ne peut que faire baisser le RSS. »
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plane`** avec presets A, B, rotation 45°, cisaillement, et un `slider` par coefficient (4 sliders) ; le carré unité et les vecteurs (1, 0), (0, 1), (1, 1) dessinés ; readouts det, rang, aire. Légende : les colonnes sont les images de la base ; det = 0 écrase le carré.
- **Figure 2 — `plane`** preset B avec le vecteur du noyau (2, −1) affiché en rouge et un `slider` t qui déplace x le long de x₀ + t(2, −1) : Bx ne bouge pas. Légende : tout un segment d'entrées a la même sortie.
- **Figure 3 — `plane`** : action affine Wx + b, `slider` sur b₁, b₂ : la grille se décale, l'origine n'est plus fixe. Légende : affine = linéaire + décalage.

## Où ça casse
- **Lire par lignes** : Ax par lignes (produits scalaires) est correct pour calculer et muet pour voir ; pour l'intuition, colonnes.
- **det = 0 numériquement** : en flottant, det ≈ 10⁻¹⁵ n'est pas 0 ; le bon test est le conditionnement (p04-03), pas le déterminant.
- **Confondre « pas de solution » et « solution non unique »** : le premier vient de l'image (b inatteignable), le second du noyau.
- **Un réseau sans biais** : toutes les frontières passent par l'origine ; standardiser les entrées masque le problème sans le résoudre.

## Résumé
1. Ax = combinaison des colonnes ; les colonnes sont les images de la base.
2. Linéaire ⇒ la grille reste une grille, l'origine fixe ; |det| = aire ; det = 0 écrase.
3. Image = espace des colonnes ; rang = sa dimension.
4. Noyau = entrées envoyées sur 0 ⇒ information perdue ⇒ non inversible.
5. Ax = b : 0, 1 ou une infinité de solutions (image, puis noyau) ; la pénalité choisit dans le noyau.
6. Wx + b est affine : le biais décale ; sans biais, tout passe par l'origine.
7. Témoin atteignable : élargir l'espace ne fait jamais monter un minimum.

**Phrase d'entretien** : « Je lis une matrice par ses colonnes : ce sont les images de la base, et tout le reste suit par linéarité. Si les colonnes sont liées, le noyau n'est pas trivial, deux entrées se confondent et la matrice n'est pas inversible ; résoudre Ax = b donne alors soit rien, soit une solution plus tout le noyau — et c'est là qu'une pénalité choisit. »

## Chaîne verbalisée
1. Que fait A à (1, 0) et (0, 1) ? → Les envoie sur ses colonnes.
2. Que signifie det A = 0 géométriquement et algébriquement ? → Le carré s'écrase ; colonnes liées ; noyau non trivial.
3. Pourquoi une matrice à noyau non trivial n'est pas inversible ? → x et x + k ont la même image.
4. Combien de solutions à Ax = b ? → 0 si b hors image ; 1 si noyau trivial ; infinité sinon.
5. Wx + b est-il linéaire ? → Non : f(0) = b ; affine.
6. Pourquoi R² ne baisse jamais en ajoutant une variable ? → β = 0 est un témoin atteignable.

## Ce qui a cassé pour Salah
- Q3 « témoin atteignable » réussie à la calibration : le pas 8 le nomme et le relie à b02 sans le redémontrer.
- D4 / p02-02 : la « droite de solutions » sous colinéarité — pas 6 lui donne son nom (solution particulière + noyau) pour que p02-02 s'y accroche.
- t04 avait « Ax = combinaison des colonnes, noyau, affine ≠ linéaire » en Q/A ; la figure 1 (`plane`) est ce qui manquait : voir la grille bouger.

## Exclusions
Pas de déterminant au-delà de l'aire, pas de Gauss, pas d'espaces abstraits, pas de projection orthogonale détaillée (nommée au pas 6).
