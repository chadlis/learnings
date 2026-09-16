---
id: p04-02
series: chain
part: "04"
number: "02"
slug: valeurs-propres-iteration
title: Valeurs propres et itération — ce qui survit à Aᵏ
subtitle: les directions qu'une matrice ne tourne pas, et pourquoi elles gouvernent le long terme
prereq: [p04-01]
anki: [algebre::eigen, algebre::power-iteration, algebre::markov, algebre::diagonalisation]
bridges: [b06]
next: p04-03
status: built
---

## Question de la chaîne
Quelles directions une matrice se contente d'étirer, comment les trouver, et pourquoi appliquer A mille fois ne laisse qu'une seule d'entre elles ?

## Prérequis
- p04-01 : Ax comme action ; colonnes ; det = 0 ⇔ noyau non trivial.

## Hypothèses posées
- H1 : A carrée, n×n : on itère A sur son propre espace.
- H2 : A **diagonalisable** avec une valeur propre dominante unique |λ₁| > |λ₂| ≥ … (cas générique ; la casse dit quand ça tombe).

## Exemple fil rouge
A = [[2, 1], [0, 3]]. Av = λv ⇔ (A − λI)v = 0 ⇔ det(A − λI) = 0 ⇔ (2 − λ)(3 − λ) = 0 : λ = 2 (v = (1, 0)) et λ = 3 (v = (1, 1)). Trace 5 = 2 + 3 ; det 6 = 2 × 3.
Itération depuis x₀ = (0, 1) : (1, 3) → (5, 9) → (19, 27) → (65, 81) → (211, 243) ; directions normalisées (0,32 ; 0,95) → (0,49 ; 0,87) → (0,58 ; 0,82) → (0,63 ; 0,78) → tend vers (0,71 ; 0,71) = direction de λ = 3. Le rapport des composantes le long de (1, 0) et (1, 1) décroît comme (2/3)ᵏ.
Markov : P = [[0,9 ; 0,5], [0,1 ; 0,5]] (colonnes = « reste / part »). Valeurs propres 1 et 0,4 ; vecteur propre de 1, normalisé à somme 1 : π = (5/6 ; 1/6). Depuis (1, 0) : (0,9 ; 0,1) → (0,86 ; 0,14) → (0,844 ; 0,156) → 0,833. L'écart à π décroît en 0,4ᵏ.
Ridge de p02-02 : XᵀX = [[14, 28], [28, 56]], valeurs propres 0 et 70 ; +λI → λ et 70 + λ.

## Pas de la chaîne
1. **Le décor.** A tourne et étire presque tout vecteur. Certains ne sont qu'étirés : ce sont les seuls sur lesquels A agit comme un nombre.
2. **Définition** [tronc]. Av = λv avec v ≠ 0 : v est une direction propre, λ le facteur d'étirement (négatif = retournement, 0 = écrasement, |λ| < 1 = contraction). Au tableau : « Sur une direction propre A agit comme un scalaire, donc toute la complexité de A est dans le choix de ces directions et de leurs facteurs. »
3. **Les trouver.** Av = λv ⇔ (A − λI)v = 0 ⇔ A − λI a un noyau non trivial ⇔ det(A − λI) = 0 (polynôme caractéristique). Puis v dans le noyau de A − λI. Vérifications : Σλᵢ = trace, Πλᵢ = det. Au tableau : « Une direction propre est dans le noyau de A − λI, donc ce noyau est non trivial, donc son déterminant est nul, donc λ est racine du polynôme caractéristique. »
4. **Diagonaliser = trois actions** [tronc]. Si n directions propres indépendantes : A = PDP⁻¹. Lire de droite à gauche : P⁻¹ exprime x dans la base propre, D étire chaque coordonnée par son λ, P revient à la base de départ. Au tableau : « Changer de base, étirer coordonnée par coordonnée, revenir, donc A n'est qu'une dilatation vue dans une base tournée. »
5. **Aᵏ = PDᵏP⁻¹ : seule la plus grande survit** [tronc]. Dᵏ = diag(λ₁ᵏ, …). Pour x = Σ cᵢvᵢ : Aᵏx = Σ cᵢλᵢᵏvᵢ = λ₁ᵏ[c₁v₁ + Σ cᵢ(λᵢ/λ₁)ᵏvᵢ] → la direction v₁, à vitesse (λ₂/λ₁)ᵏ. C'est la **power iteration** : appliquer, normaliser, répéter. Au tableau : « Chaque composante est multipliée par sa valeur propre à la puissance k, donc la plus grande écrase les autres, donc l'itération converge vers la direction dominante, d'autant plus vite que l'écart entre λ₁ et λ₂ est grand. »
6. **Le signal.** « Itération + long terme + matrice carrée » ⇒ valeur propre dominante. Chaînes de Markov (λ₁ = 1, le vecteur propre est la distribution stationnaire), PageRank (même chose sur le web), systèmes dynamiques, stabilité d'une récurrence (|λ| < 1 ⇒ converge), et le conditionnement d'une descente (p03-02 : λ_max/λ_min).
7. **+λI translate le spectre.** (A + λI)v = (λᵢ + λ)v : mêmes directions, valeurs décalées de λ. 0 devient λ ⇒ inversible. C'est le pas 5 de p02-02, vu d'ici.
8. **Symétrique : le cas propre.** A = Aᵀ ⇒ valeurs propres réelles, directions propres **orthogonales**, P orthogonale (P⁻¹ = Pᵀ) : le théorème spectral (p04-03). Les matrices de covariance, XᵀX, les hessiennes sont symétriques : en ML on est presque toujours dans ce cas.
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plane`** preset A avec ses deux directions propres tracées (`fixed`) et un vecteur mobile x (`slider` angle) : Ax affiché ; quand x est sur une direction propre, Ax reste dessus. Readout : angle de x, angle de Ax, facteur. Légende : deux directions ne tournent pas.
- **Figure 2 — SVG custom via `plot` (power iteration)** : bouton « appliquer A » qui trace x₀, Ax₀, A²x₀… normalisés sur le cercle unité, avec la direction (1, 1) en pointillé ; readout de l'angle et de l'écart (2/3)ᵏ. Second preset : Markov P depuis (1, 0), readout des composantes vers (5/6 ; 1/6). Légende : la direction dominante absorbe, à vitesse λ₂/λ₁.
- **Figure 3 — `plot` + `slider` λ ∈ [0, 20]** : les deux valeurs propres de XᵀX + λI (droites 0 + λ et 70 + λ, axe y log ou coupé) ; readout du conditionnement (70 + λ)/λ. Légende : translation, pas annulation ; κ chute vite puis lentement.

## Où ça casse
- **Pas diagonalisable** (bloc de Jordan, cisaillement [[1, 1], [0, 1]]) : une seule direction propre ; l'itération converge quand même mais lentement (en k, pas en ratio).
- **Valeurs propres complexes** (rotation) : aucune direction réelle fixe ; |λ| dit si ça spirale vers 0 ou l'infini.
- **λ₁ = −λ₂ ou |λ₁| = |λ₂|** : la power iteration oscille sans converger.
- **Non symétrique** : directions propres non orthogonales, P⁻¹ ≠ Pᵀ ; changer de base coûte une inversion, et le conditionnement de P entre en jeu.

## Résumé
1. Av = λv : directions que A ne tourne pas ; λ = facteur (contraction, retournement, écrasement).
2. Les trouver : det(A − λI) = 0, puis noyau ; trace = Σλ, det = Πλ.
3. A = PDP⁻¹ : changer de base, étirer, revenir.
4. Aᵏ = PDᵏP⁻¹ : la plus grande valeur propre survit, à vitesse (λ₂/λ₁)ᵏ — power iteration, Markov, PageRank.
5. +λI translate le spectre ; 0 → λ.
6. Symétrique ⇒ réel, orthogonal, P⁻¹ = Pᵀ : le cas de la covariance et de XᵀX.

**Phrase d'entretien** : « Une valeur propre est un facteur d'étirement sur une direction que la matrice ne tourne pas ; diagonaliser, c'est changer de base pour que la matrice devienne une dilatation. Appliquée mille fois, la matrice ne garde que sa direction dominante, à la vitesse du rapport des deux plus grandes valeurs propres : c'est la distribution stationnaire d'une chaîne de Markov et le PageRank. Et ajouter λI décale tout le spectre de λ sans rien annuler. »

## Chaîne verbalisée
1. Définis valeur et vecteur propres. → Av = λv, v ≠ 0 : direction non tournée, facteur λ.
2. Comment les trouver, et deux vérifications ? → det(A − λI) = 0 ; noyau ; trace et det.
3. Lis A = PDP⁻¹ de droite à gauche. → Base propre, étirement, retour.
4. Que devient Aᵏx, et à quelle vitesse ? → Direction dominante ; (λ₂/λ₁)ᵏ.
5. Que vaut la stationnaire de P, et pourquoi ? → Vecteur propre de λ = 1, somme 1 : (5/6 ; 1/6).
6. Que fait +λI ? → Translate chaque valeur propre de λ ; mêmes directions.

## Ce qui a cassé pour Salah
- Q7.1 (10/09) : « valeurs propres mal reliées à l'itération / long terme » — le pas 5 et la figure 2 sont la réponse ; Q7.2 (eig(Aᵀ) ≠ eig(A) pour la stationnaire) : préciser au pas 6 la convention colonnes = transitions, et que la stationnaire est un vecteur propre à **gauche** de la convention lignes.
- 15/09 : « +λI annule » — pas 7, avec p02-02 en cible.
- Ne pas redémontrer le spectral ici (p04-03) ; le nommer au pas 8.

## Exclusions
Pas de Jordan au-delà d'une phrase de casse, pas de valeurs propres complexes au-delà d'une phrase, pas d'algorithme QR.

## Questions pour la revue
- **Chiffres : rien à corriger.** Tout l'exemple fil rouge a été revérifié à la main
  en `fractions.Fraction` (polynôme caractéristique, noyaux, puissances de matrice,
  itérés exacts) : λ = 2 et 3 pour A, trace 5 et det 6, Aᵏ(0,1) = (3ᵏ − 2ᵏ ; 3ᵏ) donc
  (1,3) → (5,9) → (19,27) → (65,81) → (211,243), directions normalisées (0,32 ; 0,95)
  → (0,49 ; 0,87) → (0,58 ; 0,82) → (0,63 ; 0,78), ratio (2/3)ᵏ ; P de valeurs propres
  1 et 0,4, π = (5/6 ; 1/6), itérés (0,9 ; 0,1) → (0,86 ; 0,14) → (0,844 ; 0,156) avec
  un écart exactement en 0,4ᵏ × 1/6 ; XᵀX de valeurs propres 0 et 70. Un seul point de
  détail : la suite Markov passe par 0,8376 (k = 4) puis 0,835 avant 0,833 — la sheet
  affiche k = 4 = 0,8376 et annonce 0,8333 comme limite, là où le spec écrivait
  « → 0,833 » juste après k = 3. Rien de faux, à confirmer comme tel.
- **Figure 2, normalisation du preset Markov.** Le spec demande les itérés normalisés
  sur le cercle unité pour les deux presets. Rendu ainsi, le cas Markov était illisible :
  les itérés somment déjà à 1, leur norme vaut ≈ 0,86, donc points bruts et points
  normalisés se superposaient. La sheet normalise donc **par la norme pour A** (cercle
  unité) et **par la somme pour P** (segment des distributions, que P conserve), et le
  dit dans la légende. À valider — c'est le seul écart au spec.
- **Figure 1, les directions propres ne sont pas passées en `fixed`.** Les presets
  changent la matrice, donc les directions changent aussi, alors que le `fixed` de
  `SL.plane` est figé à la construction ; et le groupe monde de `SL.plane` n'est pas
  peint du tout quand la matrice est singulière (cas du preset B, λ = 0). Comme dans
  p04-01, `SL.plane` ne fournit donc que le décor de départ et toute la scène d'arrivée
  est redessinée en coordonnées écran. Effet voulu : à det = 0 la grille s'effondre sur
  une droite au lieu de disparaître.
- **Liens vers des sheets inexistantes.** Le théorème spectral (pas 8) et la suite
  pointent vers `map.html#p04-03`, et le pont b06 vers `map.html#b06`. Le cadrage de
  b06 retenu ici : « une forme quadratique est convexe quand ses valeurs propres sont
  ≥ 0, et la forme fermée existe quand aucune n'est nulle ». À reprendre si le pont
  b06 est écrit autrement.
