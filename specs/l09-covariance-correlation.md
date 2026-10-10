---
id: l09
series: lesson
part: "00"
number: "09"
slug: covariance-correlation
title: Covariance et corrélation
subtitle: socle — Brunton 41 et 42 : le terme croisé de Var(X ± Y), Cov = 0 sans indépendance, nuages gaussiens
prereq: [l07, l08]
anki: [stats::covariance, stats::correlation]
bridges: [b04]
next: l10
status: built
---

## Question de la leçon
Comment mesurer que deux variables bougent ensemble, pourquoi cette mesure est exactement le terme qui manque à Var(X + Y), et que dit-elle (ou ne dit-elle pas) de l'indépendance ?

## Vidéos couvertes
41 Covariance and Correlation in Probability · 42 Covariance and Correlation — Example with Gaussian Distributions. Var(X + Y) sous indépendance et Var(2X) viennent de la vidéo 30. La notion 6 (différence d'accuracy) n'est pas dans la playlist : c'est la séance M0 du 09–10/10, construite sur Var(X − Y).

## Prérequis
- l07 : loi jointe (`lesson-00-07-lois-jointes.html#n1`) ; indépendance = la jointe se factorise (`#n4`).
- l08 : linéarité de E sans hypothèse (`lesson-00-08-esperance-variance.html#n3`) ; E[XY] = E[X]E[Y] sous indépendance (`#n4`) ; Var = E[(X − μ)²] = E[X²] − μ² (`#n6`) ; Var(aX + b) = a² Var X (`#n9`). l08 annonce « le terme croisé 2ab Cov(X, Y), traité en l09 » : n2 tient la promesse.
- l06 : standardisation Z = (X − μ)/σ (`lesson-00-06-fonctions-standardisation.html#n3`), utilisée en n4.

## Fil rouge
- Quatre points équiprobables (1, 1), (2, 3), (3, 2), (4, 4) : centre (2,5 ; 2,5), rectangles 2,25 ; −0,25 ; −0,25 ; 2,25 ; Cov = 1 ; E[XY] = 7,25 ; Var X = Var Y = 1,25 ; σ = 1,118 ; ρ = 0,8. En pouces (× 12 les deux) : Cov = 144, σ_X σ_Y = 180, ρ = 0,8 ; Y seul en pouces : 12 / 15 ; Y retourné : ρ = −0,8.
- Deux dés, mêmes marges, trois couplages : Cov = 0 ; +35/12 = 2,917 (Y = X) ; −2,917 (Y = 7 − X).
- Composante partagée (séance M0) : A, B, C indépendantes de variance 1, X = A + B, Y = A + C : Cov = 1, ρ = ½.
- Deux modèles, 1 000 questions (table de la chaîne p01-04) : p_A = 0,872, p_B = 0,901, A seul juste 10, B seul juste 39, les deux justes 862, les deux faux 89.

## Notions

### n1 · La covariance : la moyenne du rectangle signé — OUTIL — Brunton 41
- Idée : le nuage incliné de Brunton et son point test ; écart horizontal X − μ_X, écart vertical Y − μ_Y ; leur produit est l'aire signée du rectangle centre–point (+ en haut à droite et en bas à gauche) ; exigence de Brunton avant la définition : Cov(X, X) = Var X. Exemple chiffré : les quatre points, Cov = 1.
- Formule : Cov(X, Y) = E[(X − μ_X)(Y − μ_Y)] = E[XY] − E[X]E[Y]. Hypothèses : E[X²], E[Y²] finies ; il faut la loi jointe (somme double sur P(X = x, Y = y)). Règles : symétrie, Cov(X, X) = Var X, unité de X fois unité de Y, bilinéarité Cov(aX + b, cY + d) = ac Cov(X, Y), Cov(X + Z, Y) = Cov(X, Y) + Cov(Z, Y).
- Exemples : constante (0) ; Cov(X, ±X) = ±Var X ; quatre points par les deux formes ; trois couplages de dés (E[XY] = 12,25 ; 15,17 ; 9,33 de l08 n4) ; composante partagée Cov(A + B, A + C) = Var A = 1, avec l'exemple ML de deux capteurs d'une même température.
- Preuve : la forme développée (« deux moins et un plus », Brunton) ; la bilinéarité en deux lignes.
- Code (c1) : composante partagée simulée, les trois calculs (moyenne des produits d'écarts, E[XY] − E[X]E[Y], np.cov) ≈ 1 ; Cov(B, C) ≈ 0 ; np.cov divise par n − 1 (1,333 contre 1 sur les quatre points).
- Où ça casse : il faut la jointe (mêmes marges, trois covariances) ; le nombre seul ne dit pas la force (× 144 en pouces ; σ = 1, ρ = 0,9 → 0,9 contre σ = 2, ρ = 0,5 → 2) ; la forme E[XY] − E[X]E[Y] perd tout en flottants quand les moyennes sont énormes (centre 10⁹, vraie covariance 0,5 : 384 contre 0,50) ; ddof de np.cov.
- Brunton rectifié : « pentu et serré ⇒ grande covariance » mélange covariance et corrélation.
- Ce qu'on garde : Cov(X, Y) = E[(X − μ_X)(Y − μ_Y)] = E[XY] − E[X]E[Y] : la moyenne du rectangle signé tendu entre le centre et le point.

### n2 · Var(X ± Y) : le terme croisé, et les deux rôles d'i.i.d. — OUTIL — Brunton 41 (et 30)
- Idée : Brunton 30, sous indépendance Var(X + Y) = Var X + Var Y, Var(2X) « presque sûr 4 Var X » ; 41, la formule générale en exercice. Le carré d'une somme d'écarts a un double produit, dont la moyenne est 2 Cov. Exemple chiffré : deux dés 5,83 contre un dé doublé 11,67.
- Formules : Var(X ± Y) = Var X + Var Y ± 2 Cov ; Var(aX + bY) = a² Var X + b² Var Y + 2ab Cov(X, Y) ; Var(X₁ + … + Xₙ) = Σ Var Xᵢ + 2 Σ_{i<j} Cov(Xᵢ, Xⱼ), i.i.d. ⇒ nσ². Aucune hypothèse pour la forme générale ; l'indépendance annule le terme croisé (additivité, pas linéarité) ; i.i.d. = deux hypothèses à deux endroits.
- Exemples : test des constantes X = Y = 1 (avec 2ab E[XY], a = 2, b = 3 donnerait une variance de 12 pour une constante) ; test du décalage ; Var(X − Y) de deux dés 5,83 et non 0 ; Y = X → 0 ; Y = 7 − X → 11,67 ; Var(2X − Y) = 14,58 ; dix dés 29,17 (σ 5,40) contre Var(10X) = 291,7.
- Preuve : Var(aX + bY) en regroupant les écarts, où E[(X − μ_X)(Y − μ_Y)] apparaît ; le chemin de l'erreur du 09/10 (E[(aX + bY)²] − (E[aX + bY])² : le 2ab E[XY] doit s'apparier au −2ab μ_X μ_Y) ; Var(ΣXᵢ) ligne par ligne, « indépendance » et « même loi » nommées chacune sur sa ligne.
- Code (c2) : Var(2X − Y) ≈ 14,58, Var(X + X) ≈ 11,67, somme de six variables de variance 1 : 6 i.i.d. contre 21 = 6 + 30 × 0,5 corrélées.
- Où ça casse : 2ab E[XY] ; l'indépendance ne rend pas la variance linéaire ; i.i.d. n'est pas une hypothèse mais deux ; une covariance négative fait baisser la variance (Y = 7 − X, variables antithétiques) ; moyenner des modèles corrélés garde ρσ² (b04).
- Brunton rectifié : (30) « vraiment fausse » si X et Y sont dépendantes, (41) les variables dépendantes ont « ce terme de covariance en plus » → Cov = 0 suffit (Y = X², 8/9 = 2/3 + 2/9).
- Ce qu'on garde : Var(aX + bY) = a² Var X + b² Var Y + 2ab Cov(X, Y), sans hypothèse. Dans Var(X₁ + … + Xₙ) = nσ², l'indépendance annule les covariances, la même loi met σ² partout.

### n3 · L'indépendance donne Cov = 0, pas l'inverse — OUTIL — Brunton 41
- Idée : indépendance ⇒ E[XY] = E[X]E[Y] ⇒ Cov = 0 ; le contre-exemple de Brunton, X uniforme sur {−1, 0, 1}, Y = X² : rectangles −⅓, 0, +⅓ autour de (0, ⅔) ; la covariance ne voit que le linéaire ; P(Y = 0 ∣ X = 0) = 1 ≠ P(Y = 0) = ⅓.
- Formule : X ⫫ Y ⇒ Cov = 0 ; Cov = 0 ⇏ X ⫫ Y ; « décorrélées » ; critère complet : Cov(g(X), h(Y)) = 0 pour toutes g, h bornées ; ici Cov(X², Y) = Var Y = 2/9.
- Exemples : deux dés ; la table 3 × 2 de Brunton (P(X = 0, Y = 0) = ⅓ contre 1/9) ; le cercle ; la demi-parabole X ∈ [0, 1] (Cov = 1/12, ρ = 0,97) ; ML : sélection de features par corrélation, qui rate y = x².
- Preuve : sens direct en une ligne ; le contre-exemple ; le mécanisme général (X symétrique, g paire ⇒ X g(X) impaire).
- Code (c3) : Cov ≈ 0, P(Y = 0 ∣ X = 0) = 1, Cov(X², Y) ≈ 2/9, Var(X + Y) = Var X + Var Y ; corr(x, x²) ≈ 0 et corr(|x|, x²) ≈ 0,97 en continu.
- Où ça casse : décorrélé ≠ indépendant (sauf couple gaussien, n5) ; Cov ne mesure qu'un lien linéaire ; l'additivité ne demande que Cov = 0 (8/9 = 2/3 + 2/9 sur des variables liées).
- Brunton rectifié : dépendance affirmée sans calcul ; « fonction paire sur un domaine impair » ; « la covariance de ces deux matrices ».
- Ce qu'on garde : indépendance ⇒ Cov = 0 ; la réciproque est fausse (X uniforme sur {−1, 0, 1}, Y = X²) ; la covariance ne voit que le linéaire.

### n4 · La corrélation : la covariance sans unité — OUTIL, preuve CULTURE — Brunton 41
- Idée : pieds → pouces, la covariance × 144, le nuage inchangé ; on divise par σ_X σ_Y ; quatre points ρ = 0,8 en pieds et en pouces ; = moyenne des rectangles standardisés ; ±1 = droite exacte.
- Formules : ρ = Cov/(σ_X σ_Y) = E[Z_X Z_Y] ; −1 ≤ ρ ≤ 1 ; |ρ| = 1 ⇔ Y = aX + b ; Cov(aX + b, cY + d) = ac Cov ; ρ(aX + b, cY + d) = signe(ac) ρ ; ρ² = part de variance expliquée par la meilleure droite (R² d'une régression simple). Hypothèses : σ_X, σ_Y > 0 ; a, c ≠ 0.
- Exemples : droites (±1), constante (indéfini) ; quatre points ; composante partagée ρ = ½ = Var A/(Var A + Var B) ; les cinq points de la chaîne régression (R² = 0,6, ρ = 0,775) ; dés 0, 1, −1 ; ML : features corrélées, VIF 1/(1 − ρ²) = 5,3 à ρ = 0,9 (simulé : 5,35).
- Preuve (CULTURE) : Var(Z_X ± Z_Y) = 2 ± 2ρ ≥ 0 ; cas d'égalité ; signe(ac) ; Var(Y − βX) minimale = σ_Y²(1 − ρ²).
- Code (c4) : ρ = 0,6 construit ; Cov en pieds puis pouces ; ρ inchangé par 12X + 5, 12Y − 3 ; signe inversé par 2X + 1, −3Y + 5 ; un point aberrant fabrique une corrélation.
- Où ça casse : ρ ne voit que le linéaire ; ρ n'est pas une pente (pente ρσ_Y/σ_X) ; ρ = 0,8 explique 64 %, pas 80 % ; un seul point lointain ; corrélation n'est pas causalité (cause commune = composante partagée).
- Brunton rectifié : Corr(aX + b, cY + d) = Corr(X, Y) seulement si ac > 0 ; −1 ≤ ρ ≤ 1 non démontré.
- Ce qu'on garde : ρ = Cov/(σ_X σ_Y) ∈ [−1, 1], ±1 pour une droite exacte ; ρ(aX + b, cY + d) = signe(ac) ρ(X, Y).

### n5 · La gaussienne 2D : cercle, ellipse alignée, ellipse tournée — OUTIL — Brunton 42
- Idée : la cible de fléchettes de Brunton ; cercles (σ égaux, indépendance), ellipse alignée σ_X = 2, σ_Y = 1 (toujours indépendantes, Cov = 0, ce que Brunton ne dit pas), tournée de 45° : Var X = Var Y = 2,5, Cov = 1,5, ρ = 0,6. La rotation seule crée la covariance (terme croisé en xy).
- Formules : densité avec z_x, z_y et ρ ; matrice Σ ; Cov = (σ₁² − σ₂²) sin θ cos θ pour une ellipse de demi-axes σ₁, σ₂ tournée de θ. Hypothèse : couple gaussien (jointement), |ρ| < 1. ρ = 0 ⇒ factorisation ⇒ indépendance : Cov = 0 ⇔ indépendance pour un couple gaussien. Axes de l'ellipse = vecteurs propres de Σ (PCA).
- Exemples : cercle, densité en 0 = 1/2π = 0,159 ; alignée diag(4, 1) ; 45° : 2,5 / 1,5 / 0,6 ; −45° : −0,6 ; 90° : diag(1, 4) ; 30° : 3,25 / 1,75 / 1,30 / 0,54 ; un cercle tourné reste un cercle ; ML : PCA.
- Preuve : Cov d'une ellipse tournée par bilinéarité ; ρ = 0 ⇒ f = f_X f_Y (le bon sens du raisonnement de Brunton).
- Code (c5) : U, V indépendants, rotation de 45° ; Σ ≈ [[2,5 ; 1,5] ; [1,5 ; 2,5]] ; ρ ≈ 0,6 ; valeurs propres 1 et 4 ; grand axe à 45° ; pente de régression 0,6 contre 1.
- Où ça casse : marges gaussiennes ≠ couple gaussien (Y = S X : Cov 0, |Y| = |X|, X + Y = 0 une fois sur deux) ; pente du grand axe ≠ pente de régression (1 contre 0,6) ; ρ n'est pas un angle (45° : ρ = 0 si σ₁ = σ₂, 0,98 si σ₁ = 10, σ₂ = 1) ; |ρ| = 1 : plus de densité.
- Brunton rectifié : indépendance « démontrée » en supposant le produit (circulaire) ; conclusion étendue à « une gaussienne multivariée en 2D », fausse dès que ρ ≠ 0 ; ellipse alignée non mentionnée ; « gaussienne multinomiale » pour multivariée.
- Ce qu'on garde : pour un couple gaussien, Cov = 0 ⇔ indépendance : cercle ou ellipse alignée sur les axes. La covariance vient de la rotation : Cov = (σ₁² − σ₂²) sin θ cos θ.

### n6 · Différence d'accuracy sur un jeu de test partagé — OUTIL — Brunton 41 (Var(X + Y), ici avec un signe moins), séance M0
- Idée : A 87,2 %, B 90,1 % sur les mêmes 1 000 questions ; Var(D̂) = Var p̂_A + Var p̂_B − 2 Cov ; la difficulté des questions est la composante partagée de n1 ; écart-type 0,0142 sur deux test sets, 0,0069 sur le même.
- Formules : D̂ = p̂_B − p̂_A ; Var(D̂) = [p_A(1 − p_A) + p_B(1 − p_B) − 2(p_AB − p_A p_B)]/n = [P(désaccord) − (p_B − p_A)²]/n. Hypothèses : questions i.i.d. (indépendance entre questions : Cov(A_i, B_j) = 0 pour i ≠ j, il reste n termes sur n², d'où le 1/n ; même loi : ces n termes valent Cov(A₁, B₁), la formule ne dépend que de p_A, p_B, p_AB) ; deux jeux de test séparés ⇒ Cov = 0.
- Exemples : deux test sets 0,0142 (z = 2,05) ; même test set Cov(A_i, B_i) = 0,0763, ρ = 0,76, 0,0069 (z = 4,18), variance divisée par 4,2 ; le même modèle deux fois (0 contre un écart-type de 0,0149 ; écart moyen 0,0119) ; erreurs indépendantes : aucun gain ; composante partagée réécrite X = S + U, Y = S + V : Var(X − Y) = Var(U − V).
- Preuve (CULTURE, pertinente) : Cov(p̂_A, p̂_B) = Cov(A₁, B₁)/n avec indépendance et même loi nommées ; Var(D̂) = [P(A₁ ≠ B₁) − D²]/n.
- Code (c6) : 10 000 évaluations par multinomiale (partagé) et binomiales (séparés) ; écarts-types, Cov(p̂_A, p̂_B), fréquence de D̂ ≤ 0.
- Où ça casse : deux IC qui se chevauchent ([0,851 ; 0,893] et [0,882 ; 0,920]) ne concluent rien ; la formule « séparés » sur un jeu de test partagé gaspille tant que Cov ≥ 0, et devient trop optimiste si Cov < 0 ; items dépendants (même document, même utilisateur) ; la sélection du meilleur de 40 (p01-04).
- Ce qu'on garde : sur un jeu de test partagé, Var(p̂_B − p̂_A) = [P(désaccord) − (p_B − p_A)²]/n : le terme −2 Cov, avec Cov > 0, retire la difficulté commune, d'où une variance plus faible qu'avec deux jeux de test.

## Figures exigées
Vignettes « voir l'idée » (sous chaque idée) :
- v1 (n1) — `plot` : quatre points (rectangles signés, aires affichées) et les trois nuages de Brunton (incliné serré, plus large et moins pentu, rond ; 250 points, graine fixe, couleur selon le signe du produit) ; point test et ses deux écarts ; bouton « point suivant » ; readouts écarts, produit, Cov, part des produits positifs.
- v2 (n2) — `repeat` (figure existante de p00-02, graine fixée) : X + Y contre 2X, 300 tirages amorcés, boutons tirer 1 / 50 / 500 ; écarts-types mesurés au départ 2,42 et 3,38 (théorie 2,42 et 3,42).
- v3 (n3) — `plot` : {−1, 0, 1} et X² (rectangles −⅓, 0, +⅓), parabole, cercle, demi-parabole ; readouts Cov, ρ, et pour Brunton P(Y = 0 ∣ X = 0) contre P(Y = 0).
- v4 (n4) — `plot` : les quatre points en pieds, en pouces, Y seul en pouces, Y retourné, décalé de 10 ; le nuage ne change pas, les axes oui ; readouts Cov, σ_X σ_Y, ρ.
- v5 (n5) — `plot` : trois cibles (cercle, ellipse alignée, tournée de 45°), fléchettes à graine fixe, transition animée ; bouton « lancer 300 fléchettes » ; readouts Var, Cov théorique et mesurée, factorisation oui / non.
- v6 (n6) — `plot` × 2 : histogrammes de D̂ sur 400 évaluations, même test set contre deux test sets ; bouton « refaire 400 évaluations » ; readouts écarts-types mesurés, fréquence de D̂ ≤ 0, désaccords de la dernière évaluation.

Figures sous la formule :
- Figure 1 (n2) — `plot` : grille n × n des Cov(Xᵢ, Xⱼ), curseur n ∈ [1 ; 6], boutons i.i.d. (dés) · indépendants de lois différentes (pièce, d4, d6, d8, d10, d12) · même loi corrélés ρ = 0,5 · le même dé n fois ; readouts somme de la diagonale, hors diagonale, Var de la somme, nσ².
- Figure 2 (n4) — `plot` : nuage de 300 points tirés une fois, curseurs ρ ∈ [−1 ; 1] et σ_Y ∈ [0,5 ; 2] ; droite de régression ; readouts ρ réglé, ρ mesuré, Cov = ρσ_Xσ_Y, pente.
- Figure 3 (n5) — `plot` : courbes de niveau d'une gaussienne 2D, curseurs σ₁, σ₂ ∈ [0,5 ; 2,5] et θ ∈ [−90° ; 90°] ; grand axe et droite de régression ; readouts Var X, Var Y, Cov, ρ, pentes.

## Résumé
1. Cov(X, Y) = E[(X − μ_X)(Y − μ_Y)] = E[XY] − E[X]E[Y] : la moyenne du rectangle signé ; Cov(X, X) = Var X.
2. Var(aX + bY) = a² Var X + b² Var Y + 2ab Cov(X, Y), sans hypothèse ; le terme croisé est en Cov, jamais en E[XY].
3. L'indépendance annule le terme croisé (Cov = 0 suffit, notion 3) : c'est de l'additivité, la variance n'est jamais linéaire.
4. i.i.d. = deux hypothèses : l'indépendance annule les covariances, la même loi donne nσ².
5. Indépendance ⇒ Cov = 0 ; la réciproque est fausse (Y = X²) ; la covariance ne voit que le linéaire.
6. ρ = Cov/(σ_X σ_Y) ∈ [−1, 1] : sans unité, signe inversé si l'on retourne une variable ; ρ² = part expliquée par la droite.
7. Couple gaussien : Cov = 0 ⇔ indépendance ; la covariance vient de la rotation de l'ellipse.
8. Deux modèles sur le même jeu de test : −2 Cov réduit la variance de la différence ; seuls les désaccords comptent.

Phrase d'entretien : « La covariance est l'espérance du produit des écarts au centre, E[XY] − E[X]E[Y]. C'est le terme croisé de la variance d'une somme, Var(X + Y) = Var X + Var Y + 2 Cov ; l'indépendance l'annule, mais une covariance nulle ne prouve pas l'indépendance, sauf pour un couple gaussien. Normalisée par les écarts-types, elle devient la corrélation, entre −1 et 1. C'est pour ça qu'on compare deux modèles sur le même test set : leurs scores sont corrélés positivement, et −2 Cov réduit la variance de leur différence. »

## Chaîne verbalisée
1. Définis la covariance, puis donne sa forme de calcul. → La moyenne du produit des écarts au centre, E[(X − μ_X)(Y − μ_Y)] ; E[XY] − E[X]E[Y].
2. Développe Var(aX + bY). Pourquoi le terme croisé n'est-il pas 2ab E[XY] ? → a² Var X + b² Var Y + 2ab Cov ; avec X = Y = 1, la variance vaut 0 mais 2ab E[XY] vaut 2ab.
3. Var(X − Y) pour deux dés indépendants, et Var(2X) ? → 5,83, pas 0 : l'indépendance donne l'additivité, pas la linéarité ; 4 Var X = 11,67.
4. Dans Var(X₁ + … + Xₙ) = nσ², où sert l'indépendance, où sert la même loi ? → L'indépendance annule les n(n − 1) covariances ; la même loi met σ² sur les n variances.
5. Une covariance nulle prouve-t-elle l'indépendance ? → Non : X uniforme sur {−1, 0, 1}, Y = X² ; oui seulement pour un couple gaussien.
6. Que devient ρ(aX + b, cY + d) ? → signe(ac) · ρ(X, Y).
7. Pourquoi comparer deux modèles sur le même test set ? → −2 Cov, Cov > 0 car ils ratent les mêmes questions : 0,0069 contre 0,0142.

## Ce qui a cassé pour Salah
- 09/10 : Var(aX + bY) écrite a² Var X + b² Var Y + 2ab E[XY]. Adressé en n2 : formule, test des constantes (exemple 1, a = 2, b = 3 → 12 pour une constante), test du décalage, preuve qui fait apparaître E[(X − μ_X)(Y − μ_Y)] et explique d'où vient l'erreur (le double produit du carré de la moyenne oublié), premier « où ça casse », maillon 2 de la chaîne verbalisée.
- 09/10 : « l'indépendance sert la linéarité de la variance ». Adressé en n2 : puce de la formule (additivité, pas linéarité), exemple 3 (Var(X − Y) = 5,83 et non 0), deuxième « où ça casse », maillon 3.
- 18/09 : i.i.d. traité comme une seule hypothèse. Adressé en n2 : puce de la formule, figure 1 (les quatre boutons séparent les deux hypothèses), preuve de Var(ΣXᵢ) = nσ² ligne par ligne avec « indépendance » et « même loi » en gras chacune sur sa ligne, troisième « où ça casse », maillon 4 ; rejoué en n6 (hypothèses et preuve de Var(D̂)).
- Séance M0 (09–10/10) : X = A + B, Y = A + C (une composante partagée crée une covariance) → n1 exemple 5 et code c1, n4 exemple 3 (ρ = ½), n6 exemple 5 (la composante s'annule dans X − Y) ; différence d'accuracy, même test set contre deux test sets → n6 entière (calcul, simulation c6, vignette v6).

## Erreurs de Brunton couvertes
41 « pentu et serré ⇒ grande covariance » (covariance confondue avec corrélation) → n1 · 41 dépendance de Y = X² affirmée sans calcul, « fonction paire sur un domaine impair », « covariance de ces deux matrices » → n3 · 41 Corr(aX + b, cY + d) = Corr(X, Y) (signe(ac)) et −1 ≤ ρ ≤ 1 non démontré → n4 · 42 indépendance « démontrée » en supposant le produit (circulaire), ellipse alignée non mentionnée, « multinomiale » → n5.

## Exclusions
Pas de matrice de covariance au-delà de 2 × 2 (chaîne PCA), pas d'estimateur sans biais de la covariance au-delà du ddof de numpy, pas de Cauchy-Schwarz général (la preuve de n4 passe par Var ≥ 0), pas de corrélation de rang (Spearman), pas d'information mutuelle au-delà de son nom, pas de McNemar (chaîne p01-04), pas de moyenne de termes corrélés ρσ² + (1 − ρ)σ²/n (l10 n6, pont b04).

## Questions pour la revue
- Notion 6 : la loi d'un item (0,862 / 0,010 / 0,039 / 0,089) est la table observée dans la chaîne p01-04, prise comme vraie loi pour simuler. La leçon le dit dans la formule (p_A, p_B paramètres fixes, p̂ estimateurs) et dans la légende de la vignette.
- Figure 3 : le plan demandait des curseurs « σ_x, σ_y, angle ». Après rotation, ces deux nombres ne sont plus les écarts-types de X et de Y ; les curseurs s'appellent donc σ₁ et σ₂ (demi-axes de l'ellipse), et la formule dit qu'à θ = 0, σ₁ = σ_X et σ₂ = σ_Y.
- Notion 2 : la figure existante X + Y contre 2X est devenue la vignette (c'est l'exemple que cite l'idée, Brunton 30) ; la figure sous la formule est une grille n × n des covariances, ajoutée pour séparer les deux rôles d'i.i.d. (erreur du 18/09).
- Notion 6 : p.src cite Brunton 41 (Var(X − Y)) et la séance M0, la notion n'étant pas dans la playlist.
- Les liens vers les autres leçons pointent sur `lesson-00-NN-<slug>.html#nK` (fichiers produits en parallèle, certains n'existent pas encore).
- Graines des vignettes : choisies (scan dans `WORK/l09/check/c04_seedscan.py`) pour que l'état initial soit représentatif de la théorie (v1 : 33, 7, 12 ; v2 : 15 et 1015 ; v5 : 193 ; v6 : 62). Chaque nombre cité dans une légende a été recalculé par une réplique Python du générateur de la page (`check/c03_jsrng.py`) puis comparé aux readouts rendus (`check/shots_states.py`) : identiques.
- v6, deux test sets : 9 évaluations sur 400 avec D̂ ≤ 0 pour 2,2 % en théorie (calcul exact par binomiales), soit 8,8 attendues.
- Relecture en contexte frais (10/10/2026), appliquée, chaque chiffre revérifié par script (`WORK/l09/check/c05_review.py`) :
  - n2, idée : « n'est vrai que sous indépendance » remplacé par « sous indépendance, Var(X + Y) = Var X + Var Y » ; encadré Brunton ajouté (30 « vraiment fausse », 41 « ce terme de covariance en plus » : Cov = 0 suffit, 8/9 = 2/3 + 2/9) ; « (Cov = 0 suffit, notion 3) » ajouté à la puce 3 de la formule et au résumé 3.
  - n6, formule : le 1/n vient de l'indépendance entre questions (n termes sur n²), la même loi rend ces termes égaux à Cov(A₁, B₁).
  - n6, où ça casse : intervalle de B [0,882 ; 0,920] (0,901 − 1,96 × 0,009445 = 0,88249) ; le chevauchement [0,882 ; 0,893] tient.
  - n6, exemple 5 : notation S + U, S + V, pour ne plus réutiliser A et B.
  - v2 : la marque de l'espérance, invisible sous la moyenne mesurée, est retirée ; la légende dit que le trait rouge tombe sur 7 en haut comme en bas.
  - v1, quatre points : pour (2, 3) et (3, 2), écarts de 0,5, flèches et étiquettes d'écart masquées ; le rectangle et les readouts suffisent.
  - Gardes ramenées à une idée et 40 mots au plus (n1 25, n2 35, n3 40, n4 24, n5 33, n6 38 mots), dont les trois formulations proposées pour n2, n4, n6.
  - n6, où ça casse 2 : « tant que Cov ≥ 0, le cas usuel » ; si Cov < 0 la formule « séparés » devient trop optimiste.
  - n4, où ça casse 5 : « peuvent être corrélées par une cause commune ».
  - v5 et figure 3 : « distances » remplacé par les demi-axes σ₁, σ₂ puis 2σ₁, 2σ₂ (et 3σ₁, 3σ₂).
  - v1, légende : « Rond : 45 % de produits positifs et une covariance de 0 : ce sont les aires qui comptent, pas les signes ».
  - n2, preuve : « définitions de Var (l08, notion 6) et de Cov (notion 1) ».
  - v2, légende : « 35/3 − 35/6 = 35/6 = 5,83 » ; « Tires-en 500 ».
  - n6, ligne source : « Brunton 41 (Var(X + Y), ici avec un signe moins) ».
  - n5, encadré Brunton : sa conclusion étendue à « une gaussienne multivariée en 2D », fausse dès que ρ ≠ 0, ce que son ellipse tournée montre ensuite.
  - n2, exemple 5 : « Var(10X), avec 10X = X + … + X, dix copies du même dé ».
  - Figure 1 : l'étiquette devient « échelle : toute la barre = n² × 2,917 », qui garde un sens en mode « lois différentes ».
  - Langue : « jeu de test (test set) » au premier usage puis « jeu de test », y compris dans les readouts et axes de v6 ; « taux de bonnes réponses (accuracy) » au premier usage (idée de n6) ; « variables explicatives (features) » au premier usage (n1, exemple 5) ; gras décoratifs retirés des idées de n3 et n5.
  - n6, exemple 3 : « l'écart-type de la différence apparente vaut 1,5 point » (l'écart moyen, √(2/π) × 0,0149, vaut 0,0119).
  - Aucune correction rejetée.
- Pour l'orchestrateur : la chaîne p01-04 (sheet, lignes 240–241, et spec, lignes 147–148) écrit la borne basse de l'intervalle de B 0,883 à trois décimales ; c'est 0,882 (0,88249, le spec la donne juste à quatre décimales, 0,8825).

## Correspondance des pas de p00-02 (pour la page de redirection)
- s1 Le décor → `lesson-00-08-esperance-variance.html#n1` (l08 s'ouvre sur « résumer une loi par deux nombres »).
- s2 Espérance, linéaire toujours → `lesson-00-08-esperance-variance.html#n3` (la définition est en `#n1`).
- s3 Variance → `lesson-00-08-esperance-variance.html#n6`.
- s4 Transformation affine → `lesson-00-08-esperance-variance.html#n9`.
- s5 Additivité seulement à covariance nulle → `lesson-00-09-covariance-correlation.html#n2` (figure X + Y contre 2X reprise en vignette v2 ; cas X − Y en formule et exemple 3).
- s6 Corrélation, Cov = 0 ⇏ indépendance → `#n4` pour ρ (le pont b04 cite s6 pour Cov = ρσ_Xσ_Y) ; le contre-exemple Y = X² et l'additivité 8/9 = 2/3 + 2/9 sont en `#n3`.
- s7 Masse contre densité → `lesson-00-04-variables-binomiale-normale.html#n2`.
- s8 Où ça casse : mixte. Queues lourdes → l08 (`#n1` Cauchy, `#n6` Pareto) ; Cov = 0 pris pour indépendance → l09 `#n3` ; additivité appliquée à des termes dépendants → l09 `#n2` et l10 `#n6` ; densité lue comme probabilité → l04 `#n2`. Cible unique proposée : l09 `#n2`.

