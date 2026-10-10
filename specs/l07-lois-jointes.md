---
id: l07
series: lesson
part: "00"
number: "07"
slug: lois-jointes
title: Lois jointes, marginales, conditionnelles
subtitle: socle — Brunton 26 et 27 : intégrer pour marginaliser, factoriser pour l'indépendance
prereq: [l03, l06]
anki: [stats::loi-jointe, stats::marginale]
bridges: []
next: l08
status: built
---

## Question de la leçon
Deux variables observées ensemble : comment décrire leur loi commune, en tirer la loi de chacune, la loi de l'une sachant l'autre, et reconnaître qu'elles sont indépendantes ?

## Vidéos couvertes
26 Joint Probability Distributions · 27 Joint Probability Distributions: Marginal and Conditional Densities.

## Prérequis
- l03 : P(A ∣ B) = P(A ∩ B)/P(B) (`lesson-00-03-conditionner-bayes-independance.html#n1`) ; probabilités totales (`#n3`) ; Bayes (`#n4`) ; effectifs et cotes (`#n5`) ; indépendance d'événements, P(A ∩ B) = P(A) P(B) (`#n7`).
- l04 : densité, f(x) dx ≈ P(X ∈ [x, x + dx]), une densité peut dépasser 1 (`lesson-00-04-variables-binomiale-normale.html#n2`) ; normale centrée réduite φ (`#n6`).
- l06 : de CDF à CDF puis dériver, la densité se multiplie par |dx/dy| (`lesson-00-06-fonctions-standardisation.html#n1`).

## Notions

### n1 · Loi jointe discrète et densité jointe — OUTIL — Brunton 26
- Idée : deux variables à la fois demandent une loi sur le plan. Deux dés : un tableau de 36 cases de 1/36 ; la probabilité d'un événement est la somme de ses cases. Le joueur de basket de Brunton filmé toute une saison : une densité f(x, y) de sa position ; la probabilité d'une zone est l'intégrale double de f sur la zone, la somme de petites cases f dx dy.
- Formule : p(x, y) = P(X = x, Y = y), Σ Σ p = 1, P((X, Y) ∈ A) = Σ_A p ; f(x, y) ≥ 0, ∬ f = 1, P((X, Y) ∈ A) = ∬_A f(x, y) dx dy ; f(x, y) dx dy ≈ P(X ∈ [x, x + dx], Y ∈ [y, y + dy]). Hypothèses : f est une densité (peut dépasser 1, unité inverse d'une aire) ; X et Y n'ont pas à avoir la même loi.
- Exemples : deux pièces, 4 cases de ¼ ; deux dés : P(X + Y = 7) = 6/36 = 1/6, P(X > Y) = 15/36 = 0,417, P(X ≤ 2, Y ≥ 5) = 4/36 = 1/9 ; uniforme sur le carré unité : P(X + Y ≤ 1) = ½ (aire du triangle) ; densité 4 sur [0 ; ½]², une densité qui vaut 4 ; terrain (densité inventée, trois bosses gaussiennes tronquées au demi-terrain FIBA 15 × 14 m, normalisation 0,98445) : raquette simplifiée 5 × 6 m 0,608, corner droit [12 ; 15] × [0 ; 3] 0,143 ; ML : un jeu de données est un échantillon de la loi jointe p(x, y) des features et de l'étiquette.
- Où ça casse : f(x, y) n'est pas une probabilité ; P(X = x, Y = y) = 0 en continu ; il faut toutes les cases, pas seulement les deux lois séparées (renvoi n2, n4).
- Brunton dit / c'est : (26) « la PCA suppose une loi jointe gaussienne » → la PCA calcule les directions de plus grande variance de n'importe quel nuage ; la gaussienne sert seulement à lire des composantes décorrélées comme indépendantes (l09).
- Ce qu'on garde : la loi jointe d'un couple (X, Y) donne la probabilité de chaque case, P(X = x, Y = y), ou une densité f(x, y) ; une région A pèse la somme de ses cases, ou ∬_A f dx dy.

### n2 · La marginale : intégrer l'autre variable — OUTIL — Brunton 26, 27
- Idée : la marginale de X est la loi de X seule, quelle que soit Y : somme de la colonne du tableau (écrite dans la marge), intégrale de f(x, y) en y. Ce qui a cassé pour Salah : « une gaussienne en x » devant un nuage qui semble uniforme. Deux raisons : au cœur du nuage la densité baisse lentement (à distance 1 du centre, elle n'a perdu que 1 − e^(−1/2) = 39 %) ; et « gaussienne en x » décrit la marginale, le compte des points par bande verticale, pas l'aspect du nuage.
- Formule : P(X = x) = Σ_y P(X = x, Y = y) ; f_X(x) = ∫ f(x, y) dy (et de même pour Y). Hypothèses : sommer sur toutes les valeurs de y (les {Y = y} partitionnent Ω, probabilités totales l03 n3) ; c'est une somme, pas une moyenne.
- Exemples : deux dés, chaque marge 6/36 ; (X, M = max) : marge de X uniforme, P(M = m) = (2m − 1)/36, soit 1, 3, 5, 7, 9, 11 /36, E[M] = 161/36 = 4,47 ; gaussienne 2D standard : marginale φ ; uniforme sur [−2 ; 2]² : marginale plate 1/4 ; uniforme sur le disque de rayon 2 : dôme (2/(π R²))√(R² − x²), valeur 1/π = 0,318 en 0 ; ML : mélange gaussien p(x) = Σ_k p(x, z = k), la vraisemblance marginale.
- Vignette v2 (exigée par Salah) : nuage et deux histogrammes marginaux qui se remplissent ; parts par bande [a ; a + 0,5] : gaussien 19,1 % pour [0 ; 0,5] contre 4,4 % pour [1,5 ; 2] ; carré 12,5 % partout ; disque 15,7 % et 7,2 %. Graine 3163 (800 points) : gaussien 18,8 / 4,3 %, carré 12,6 / 12,0 %, disque 15,5 / 6,8 %, et la barre surlignée est la plus haute de chaque histogramme.
- Preuve : la marginale est une densité (∫ f_X = ∬ f = 1) ; version discrète = probabilités totales ; marginale de la gaussienne 2D standard (l'intégrale en y vaut 1).
- Code : histogrammes marginaux du nuage gaussien, du carré, du disque, parts par bande.
- Où ça casse : la marginale n'est pas une conditionnelle ; « average out » = intégrer, sans diviser ; les marginales ne déterminent pas la jointe ; uniforme en 2D n'implique pas marginale plate (disque) ; « effet marginal » en économie et en p05-02 est une dérivée, autre sens.
- Brunton dit / c'est : (27) la marginale « conditionnée sur quelque chose en y » → loi de X quelle que soit Y ; (27) constante 1/√(2π) pour la gaussienne 2D → 1/(2π) (avec 1/√(2π), la masse totale vaut √(2π) = 2,507) ; (26, 27) « average out » → intégrer.
- Ce qu'on garde : f_X(x) = ∫ f(x, y) dy (discret : Σ_y P(X = x, Y = y)) : la loi de X quelle que soit Y, pas une loi conditionnelle.

### n3 · La conditionnelle f(y ∣ x) : la tranche renormalisée — OUTIL — Brunton 27
- Idée : fixer X = x, garder la tranche de la jointe, la diviser par sa masse, qui est la marginale. (X, M) : sachant X = 2, P(M = 2 ∣ X = 2) = (2/36)/(6/36) = 1/3, P(M = m ∣ X = 2) = 1/6 pour m = 3 à 6. Nuage Y = 0,8 X + 0,6 Z (X, Z normales centrées réduites indépendantes) : la tranche x = 1,5 est N(1,2 ; 0,6²), plus étroite que la marginale de Y, N(0, 1).
- Formule : P(Y = y ∣ X = x) = P(X = x, Y = y)/P(X = x) ; f(y ∣ x) = f(x, y)/f_X(x). Hypothèses : f_X(x) > 0 ; une densité en y à x fixé. Notation : la barre est juste (vrai conditionnement sur la variable X) ; dans le fil B, p(y ∣ x ; θ) met x derrière la barre (observé, conditionné) et θ derrière le point-virgule (paramètre fixe, pas une variable aléatoire).
- Exemples : deux dés, toute colonne renormalisée est uniforme ; (X, M) sachant X = 5 : M = 5 avec 5/6, M = 6 avec 1/6 ; nuage : tranche x = 0 → N(0 ; 0,36), x = 1,5 → centre 1,2 ; ML : un modèle discriminatif (régression logistique, classifieur softmax) apprend p(y ∣ x) sans jamais modéliser p(x).
- Figure 3 : la tranche brute f(x₀, y), d'aire f_X(x₀) = φ(x₀) (0,399 en 0 ; 0,130 en 1,5), puis divisée par f_X(x₀) : pic 0,665 constant, centre 0,8 x₀.
- Code : bande |x − 1,5| < 0,02 dans 2 000 000 tirages : moyenne 1,196, écart-type 0,604 ; (X, M) par comptage.
- Où ça casse : non définie où f_X(x) = 0 ; en continu P(X = x) = 0 : la définition est la limite d'une bande qui rétrécit ; f(y ∣ x) n'est pas une densité en x : ∫ f(y ∣ x) dx = 1/0,8 = 1,25 pour y = 1 ; f(y ∣ x) ≠ f(x ∣ y) (n5).
- Ce qu'on garde : f(y ∣ x) = f(x, y)/f_X(x) : la tranche de la jointe à x fixé, divisée par sa masse f_X(x) ; une densité en y, définie là où f_X(x) > 0.

### n4 · Indépendance = factorisation ; la gaussienne 2D — OUTIL — Brunton 26
- Idée : savoir x ne change rien à la loi de y ⇔ toutes les tranches ont la même loi ⇔ la jointe est le produit des marginales. Séparation des variables (équation de la chaleur sur un rectangle). Deux dés : 1/36 = 1/6 × 1/6 ; (X, M) : P(X = 1, M = 1) = 1/36 ≠ 1/6 × 1/36 = 1/216. Fléchettes : gaussienne ronde, séparable.
- Formule : X ⊥ Y ⇔ p(x, y) = p_X(x) p_Y(y) pour tous x, y ⇔ f(y ∣ x) = f_Y(y) partout où f_X(x) > 0 ; gaussienne 2D standard (1/(2π)) e^{−(x² + y²)/2} = φ(x) φ(y) ; avec corrélation ρ, exposant −(x² − 2ρxy + y²)/(2(1 − ρ²)) : le terme croisé empêche la factorisation, marginales N(0, 1) pour tout ρ.
- Figure 4 (curseur ρ) : contours de la jointe contre contours du produit des marginales (cercles fixes) ; en (1, 1) : jointe 0,0585 = produit à ρ = 0 ; 0,1522 à ρ = 0,8 (2,6 fois le produit) ; en (1, −1) : 0,0018 (0,03 fois).
- Vignette v4 : mélanger les y entre fléchettes fabrique le produit des marginales ; viser le centre : part dans r < 1 inchangée (39,3 %) ; viser l'anneau (R ~ N(2 ; 0,2²)) : 0 % → 8,7 % après mélange (les points glissent vers les quatre coins).
- Exemples : deux dés ; événement rectangle P(X ≤ 2, Y ≥ 5) = 1/9 = (1/3)(1/3) ; (X, M) ; gaussienne ronde ; support en triangle (uniforme sur 0 < y < x < 1 : f(0,2 ; 0,8) = 0 mais f_X(0,2) f_Y(0,8) = 0,4 × 0,4 = 0,16), et la règle juste : un support qui n'est pas un produit A × B prouve la dépendance (X, Y indépendantes uniformes sur [0 ; 1] ∪ [2 ; 3] ont un support en quatre carrés) ; ML : l'importance par permutation mélange une colonne, ce qui casse sa dépendance avec le reste.
- Preuve : factorisation ⇒ conditionnelle = marginale ; réciproque (f = f(y ∣ x) f_X) ; exponentielle d'une somme pour la gaussienne ; test du support.
- Code : écart maximal |f − f_X f_Y| sur une grille pour ρ = 0 et ρ = 0,8 ; test du mélange sur les fléchettes.
- Où ça casse : mêmes marginales, jointes différentes ; rond ≠ indépendant (disque uniforme, anneau) ; Cov = 0 sans indépendance (anneau, renvoi l09 n3) ; indépendance conditionnelle à la classe (Naive Bayes, n5) ≠ indépendance ; la gaussienne est la seule loi invariante par rotation à coordonnées indépendantes (Herschel–Maxwell, culture).
- Brunton dit / c'est : (26) la gaussienne des fléchettes « n'est pas séparable en x, y » → elle l'est ; ce qui est rond et non séparable : un anneau, un disque uniforme ; « séparable en r, θ » demande le jacobien (n6).
- Ce qu'on garde : X et Y indépendantes ⇔ f(x, y) = f_X(x) f_Y(y) pour tous x, y ⇔ toutes les tranches f(y ∣ x) sont la même loi f_Y.

### n5 · Bayes pour les densités — OUTIL — Brunton 27
- Idée : f(x, y) = f(y ∣ x) f_X(x) = f(x ∣ y) f_Y(y) ; diviser donne Bayes ; dénominateur = marginale par intégrale. Dépistage de l03 avec un score continu : sains N(0, 1), malades N(2, 1), prévalence 1 % ; la densité du score en 2 est 7,39 fois plus haute chez un malade, P(malade ∣ y = 2) = 6,9 %.
- Formule : f(x ∣ y) = f(y ∣ x) f_X(x)/f_Y(y), f_Y(y) = ∫ f(y ∣ x) f_X(x) dx ; version mixte P(C = k ∣ Y = y) = f(y ∣ k) P(C = k)/Σ_j f(y ∣ j) P(C = j). Hypothèses : f_Y(y) > 0 ; f(y ∣ x) vue comme fonction de x est une vraisemblance.
- Vignette v5 : vraisemblances f(y ∣ sain), f(y ∣ malade), curseur y, boutons prévalence 1 %, 10 %, 50 % ; courbe P(malade ∣ y) ; à y = 2 : 6,9 %, 45 %, 88 % ; seuil ½ en y = 3,3 à 1 %, 1 à 50 %.
- Exemples : (X, M) : P(X = 2 ∣ M = 2) = (1/3 × 1/6)/(3/36) = 2/3 ; score continu : y = 2 → 6,9 %, y = 3 → 35,5 %, y = 4 → 80,3 % ; à 10 % : y = 2 → 45,1 % ; rapport de vraisemblance e^{2y − 2}, logit P(malade ∣ y) = 2y − 2 + ln(p/(1 − p)), p la prévalence : une sigmoïde de y (lien régression logistique) ; Naive Bayes p(c ∣ x) ∝ p(c) Π_j p(x_j ∣ c).
- Code : 2 000 000 personnes, bande |y − 2| < 0,05 : 7,0 % de malades contre 6,95 % par la formule.
- Où ça casse : oubli du taux de base ; vraisemblance ≠ densité en x ; f_Y intraitable en grande dimension (MCMC, VI : p02-03) ; notation fréquentiste p(y ; θ) contre bayésienne f(θ ∣ y).
- Ce qu'on garde : Bayes pour les densités, là où f_Y(y) > 0 : f(x ∣ y) = f(y ∣ x) f_X(x)/f_Y(y), le dénominateur étant la marginale ∫ f(y ∣ x) f_X(x) dx.

### n6 · Coordonnées polaires et jacobien — CULTURE — Brunton 26, 27
- Idée : les « bonnes coordonnées » de Brunton. Réécrire f en (r, θ) est permis ; pour la densité de (R, Θ), il faut le facteur r, l'aire d'une case dr × dθ. Gaussienne : f_{R,Θ} = (r e^{−r²/2}) · 1/(2π) : R Rayleigh, Θ uniforme, indépendants. P(R ≤ 1) = 39,3 % (contre 68,3 % pour |X| ≤ 1 en 1D) ; densité maximale au centre, rayon le plus probable 1.
- Formule : f_{R,Θ}(r, θ) = r f_{X,Y}(r cos θ, r sin θ) ; cas général f_{U,V}(u, v) = f_{X,Y}(x(u, v), y(u, v)) |det J| (version 2D du |dx/dy| de l06 n1).
- Vignette v6 : cible, anneaux de largeur 0,25, curseur d'anneau ; disque [0 ; 0,25) : 3,1 % des fléchettes, 0,157 par unité d'aire ; anneau [1 ; 1,25) : 14,9 %, 0,084 par unité d'aire (4,8 fois plus de fléchettes, presque deux fois moins dense, aire 9 fois plus grande).
- Preuve : P(R ≤ r) = 1 − e^{−r²/2} par l'intégrale en polaires, dériver (méthode de l06 n1) ; intégrale de Gauss I² = 2π, d'où 1/√(2π) et 1/(2π).
- Code : Box–Muller ; P(R ≤ 1) ; norme en dimension d (≈ √d, écart-type ≈ 0,71).
- Où ça casse : oublier r donne une masse √(π/2) = 1,253 ; densité maximale ≠ rayon le plus probable ; en dimension 100, la norme vaut environ 10 ± 0,7 : presque aucun point près du centre.
- Brunton dit / c'est : (26, 27) « on peut l'écrire f(r, θ) », « séparable en r et θ » → comme fonction oui ; comme densité de (R, Θ), multiplier par r.
- Ce qu'on garde (pas de carte) : changer de coordonnées multiplie la densité par le jacobien ; en polaires, f_{R,Θ} = r f(r cos θ, r sin θ).

## Figures exigées
- Figure 1 (n1) — `plot` : demi-terrain 15 × 14 m, carte de densité en cases (1 m, 0,5 m, 0,25 m), boutons région (raquette, corner, terrain), cases de la région cerclées ; readouts nombre de cases, Σ f dx dy (0,610 ; 0,609 ; 0,608 pour la raquette ; 0,147 ; 0,144 ; 0,143 pour le corner ; 1,005 ; 1,001 ; 1,000 pour le terrain), valeur exacte.
- Figure 2 (n2) — `plot` : tableau 6 × 6 avec marges en haut (loi de X) et à droite (loi de Y ou de M) ; boutons (X, Y) et (X, M).
- Figure 3 (n3) — `plot` : tranche brute f(x₀, ·) et conditionnelle f(· ∣ x₀), curseur x₀ ∈ [−2,5 ; 2,5] ; readouts aire de la tranche = f_X(x₀), centre, écart-type.
- Figure 4 (n4) — `plot` : contours de la jointe gaussienne à corrélation ρ (traits pleins) et du produit des marginales (tirets), curseur ρ ∈ [−0,9 ; 0,9] ; points (1, 1) et (1, −1), readouts jointe, produit, rapport.
- Vignettes : v1 tableau des deux dés et trois événements (6/36, 15/36, 4/36) ; v2 nuage + histogrammes marginaux, trois lois, curseur de bande, boutons d'ajout de points (graine fixe) ; v3 nuage Y = 0,8 X + 0,6 Z (X, Z normales centrées réduites indépendantes), bande à x fixé, histogramme de la bande contre marginale ; v4 fléchettes, centre ou anneau, mélanger les y ; v5 score continu, curseur y, prévalence ; v6 cible et anneaux, curseur d'anneau.

## Résumé
1. La loi jointe P(X = x, Y = y) ou f(x, y) décrit le couple ; une région se mesure par une somme ou une intégrale double.
2. Marginale : sommer ou intégrer l'autre variable ; c'est la loi de X quelle que soit Y, pas une conditionnelle.
3. Conditionnelle : f(y ∣ x) = f(x, y)/f_X(x), la tranche à x fixé divisée par sa masse.
4. Indépendance : f(x, y) = f_X(x) f_Y(y) pour tous x, y ⇔ toutes les tranches ont la même loi.
5. Les marginales ne déterminent pas la jointe : N(0, 1) en x et en y va avec n'importe quelle corrélation.
6. La gaussienne 2D standard (1/(2π)) e^{−(x² + y²)/2} est ronde et se factorise.
7. Bayes : f(x ∣ y) = f(y ∣ x) f_X(x)/f_Y(y), le dénominateur est une marginale.
8. Changer de coordonnées multiplie la densité par le jacobien : r en polaires.

Phrase d'entretien : « La loi jointe décrit le couple. La marginale s'obtient en intégrant l'autre variable, la conditionnelle en coupant une tranche à x fixé puis en la divisant par la marginale. X et Y sont indépendantes quand la jointe est le produit des marginales, c'est-à-dire quand toutes les tranches ont la même forme ; les marginales seules ne disent rien de la dépendance. Bayes pour les densités inverse une conditionnelle, avec une marginale au dénominateur. »

## Chaîne verbalisée
1. Comment obtient-on f_X à partir de f(x, y) ? → On intègre y : f_X(x) = ∫ f(x, y) dy ; en discret, la somme de la colonne.
2. La marginale de X est-elle conditionnée par Y ? → Non : c'est la loi de X quelle que soit Y.
3. Définis f(y ∣ x) et dis ce qu'elle représente. → f(x, y)/f_X(x) : la tranche à x fixé divisée par sa masse ; une densité en y, définie là où f_X(x) > 0.
4. Quand X et Y sont-elles indépendantes ? → Quand f(x, y) = f_X(x) f_Y(y) pour tous x, y ; de façon équivalente, f(y ∣ x) = f_Y(y) là où f_X(x) > 0.
5. La gaussienne 2D ronde est-elle séparable en x, y ? Et avec une corrélation ρ ? → Oui, e^{−(x² + y²)/2} = e^{−x²/2} e^{−y²/2} ; avec ρ ≠ 0, le terme −2ρxy l'en empêche.
6. La densité d'un score est 7,4 fois plus haute chez un malade ; pourquoi P(malade ∣ score) ne vaut-elle que 6,9 % ? → Bayes : avec 1 % de prévalence, la cote a priori 1/99 multiplie le rapport 7,4 : cote 0,075.
7. Que devient la densité gaussienne en polaires ? → f_{R,Θ} = r f(r cos θ, r sin θ) = r e^{−r²/2} · 1/(2π) : R Rayleigh, Θ uniforme, indépendants.

## Ce qui a cassé pour Salah
- 10/10, vidéo 26 : devant un nuage gaussien 2D, il ne voyait pas pourquoi la loi est « gaussienne le long de x et le long de y » ; les points lui semblaient uniformément répartis. Adressé par l'idée de n2 (la densité baisse lentement au cœur du nuage, 39 % de perte à distance 1 ; « gaussienne en x » décrit la marginale, le compte par bande, pas l'aspect du nuage) et la vignette v2 : nuage gaussien avec ses deux histogrammes marginaux qui se remplissent (boutons d'ajout de points), bande déplaçable (19,1 % au centre, 4,4 % sur [1,5 ; 2]), comparaison avec un nuage uniforme sur un carré (marginales plates, 12,5 % par bande) et sur un disque (marginales en dôme ; le gaussien s'effiloche au bord, d'où les queues de sa marginale). Repris par v6 (densité maximale au centre, mais le plus de fléchettes vers r = 1).
- Notation (fil B) : f(y ∣ x) vrai conditionnement ; p(y ∣ x ; θ) sépare la variable observée x et le paramètre fixe θ. Dit une fois, dans la formule de n3.

## Erreurs de Brunton couvertes
26 gaussienne des fléchettes « non séparable en x, y » → n4 · 27 constante 1/√(2π) pour la gaussienne 2D → n2 (et preuve de n6) · 27 marginale « conditionnée sur y » → n2 · 26, 27 « average out » pour intégrer → n2 · 26, 27 f(r, θ) sans jacobien → n6 · 26 « la PCA suppose une loi jointe gaussienne » (imprécision hors table du plan) → n1.

## Exclusions
Pas de covariance au-delà du nom (l09 n1), pas d'ellipses avec σ_x, σ_y, angle (l09 n5), pas d'espérance d'un couple (l08 n3, n4), pas de paradoxe de Borel, pas de théorie de la mesure, pas de formule générale en dimension n au-delà d'une phrase.

## Questions pour la revue
- La densité du joueur de basket est inventée (trois bosses gaussiennes, poids 0,55 / 0,30 / 0,15) : Brunton ne donne aucun chiffre. La raquette est simplifiée à 5 × 6 m (FIBA : 4,9 × 5,8 m) pour que les cases s'alignent et que les sommes convergent proprement.
- n5 n'avait pas de visuel au plan (« — ») : la vignette v5 (score continu, prévalence) a été ajoutée, puisque toute notion en demande une. n5 a aussi reçu un bloc code (plan : « — ») : il montre le conditionnement par bande, invisible sans simulation. Idem n6 (plan : P seul) : Box–Muller et la coquille en grande dimension.
- Ajout hors table : l'imprécision de Brunton sur la PCA (n1).
- La vignette v2 ajoute un troisième nuage, uniforme sur un disque, que le prompt ne demandait pas : il montre qu'une densité constante ne suffit pas à rendre une marginale plate (la longueur des bandes compte aussi).
- Liens vers les autres leçons : `lesson-00-NN-<slug>.html#nK` (brief de production), alors que l08 publiée pointe encore vers `map.html#lNN`. Les fichiers l03, l04, l06, l09 n'existent pas encore au moment de la production : liens à vérifier après intégration (`make links`).
- Graines des vignettes choisies pour que l'état initial soit proche de la théorie (script `WORK/l07/check/seeds.mjs`) : v2, graine 3163 : 18,8 % pour 19,1 % (gaussien), 12,6 % pour 12,5 % (carré), 15,5 % pour 15,7 % (disque) ; v3 moyenne 1,19, écart-type 0,60 ; v4 39,8 % avant et après ; v6 15,0 % pour 14,9 %.
- Le mélange des y de l'anneau (v4) ne donne pas un disque plein mais un carré aux coins chargés : c'est bien le produit des marginales de l'anneau, dont chaque marginale se concentre près de ±2. La légende le dit.
- Relecture en contexte frais (10/10/2026), appliquée :
  - n2, idée : le paragraphe « l'œil voit la densité » est remplacé par les deux raisons vraies (pente douce au cœur, 39 % de perte à distance 1 ; « gaussienne en x » décrit la marginale) ; 178 mots.
  - v2 : graine recalée pour les trois nuages, et phrase ajoutée à la légende sur le cœur et les queues du gaussien.
  - n4, Brunton rectifié : il n'a jamais dit « indépendantes » ; la leçon dit maintenant qu'une gaussienne ronde à marginales N(0, 1) a forcément ρ = 0.
  - n4, exemple 4 : « un support qui n'est pas un produit A × B », car l'union de quatre carrés est un contre-exemple à « pas un rectangle ».
  - n3 : l'hypothèse « X normale centrée réduite » est ajoutée dans l'idée et les légendes de v3 et de la figure 3.
  - n3, où ça casse : biais de bande chiffré (1,191 pour ±0,15, 1,107 pour ±0,5) et bruit de 117 points (± 0,06) qui le masque.
  - n6, idée : « la densité se lit par unité d'aire, le compte par anneau ».
  - n2, où ça casse : l'exemple des marginales identiques vient de n1 (deux dés indépendants contre Y = X), plus de la figure 2.
  - n3 : P(X = 7) = 0 pour un dé ; n4, idée : « savoir x ne change rien à la loi de y ».
  - n5 : logit défini ; « la densité du score en 2 est 7,4 fois plus haute » (idée et chaîne 6) ; « ne somme pas à 1 en général » ; chaîne 4 : « là où f_X(x) > 0 ».
  - n3, idée : la maladie cardiaque d'un homme de 40 ans, sans médecin.
  - « variables explicatives (features) » au premier usage, puis « variables explicatives ».
  - Figure 4 : étiquettes décalées à droite avec un liseré, et notation scientifique pour les très petites valeurs (1,7·10⁻⁵) ; v1 et figure 2 : axe vertical nommé (« y, second dé », « m, maximum »).
  - Prérequis : φ pointe vers l04 n6 ; spec : « colonne » au lieu de « ligne ».
  - Règles transversales : gras décoratif retiré des idées de n4 et n6 ; « ce qu'on garde » de n1, n4, n5 ramené à une idée et 40 mots au plus ; légende de v6 en « second panneau ».
- Rejet partiel : la graine 84 proposée pour v2 a été vérifiée (19,3 / 4,8 %, 12,3 / 12,9 %, 15,4 / 7,0 %) mais laisse la barre surlignée du disque sous sa voisine de gauche (15,4 contre 16,1 %), le défaut même que la relecture signalait. La graine 3163 (`WORK/l07/check/c10_seed_v2.mjs`) met la barre surlignée au sommet des trois histogrammes, à moins de 0,5 point de la théorie sauf le disque en [1,5 ; 2] (6,8 contre 7,2 %).
