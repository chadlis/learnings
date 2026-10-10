---
id: l12
series: lesson
part: "00"
number: "12"
slug: generatrice-preuve-tcl
title: Fonction génératrice et preuve du TCL
subtitle: socle — Brunton 37 à 40 et 44 : l'empreinte d'une loi, la somme devient produit, six étapes jusqu'à e^(t²/2)
prereq: [l08, l11]
anki: [stats::mgf]
bridges: []
next: 
status: built
---

## Question de la leçon
Comment une seule fonction de t range-t-elle tous les moments d'une loi, change-t-elle une somme indépendante en produit, et démontre-t-elle que la somme standardisée devient normale — et où cette démonstration prend-elle des raccourcis ?

## Vidéos couvertes
37 The Moment Generating Function · 38 Example of the Moment Generating Function · 39 The Lebesgue Measure in Probability (titre orthographié « Lebesque ») · 40 Additive Property of the Moment Generating Function · 44 Proof of the Central Limit Theorem.

## Prérequis
- l08 : LOTUS `lesson-00-08-esperance-variance.html#n5` (E[e^{tX}] se calcule sans la loi de e^{tX}) ; moments, asymétrie, kurtosis `#n7` ; variance `#n6` ; espérance d'un produit sous indépendance `#n4`. l08#n6 renvoie à l12 pour l'énoncé vrai sur l'identification d'une loi : promesse tenue en n1 (formule et encadré).
- l11 : énoncé exact du TCL `lesson-00-11-tcl.html#n1` ; vitesse `#n2` ; où ça casse `#n4`.
- Lois : Poisson `lesson-00-05-poisson-exponentielle-attentes.html#n1`, exponentielle `#n3`, normale centrée réduite et Φ `lesson-00-04-variables-binomiale-normale.html#n6`.

## Notions

Toutes CULTURE (plan du 10/10/2026) : la leçon éclaire le TCL, elle ne donne pas de cartes. Ordre et numérotage du plan, ancres `#n1` à `#n6`.

### n1 · M(t) = E[e^{tX}] : l'empreinte d'une loi — CULTURE — Brunton 37 — P · C
- Idée : les moments comme coefficients d'une série de Taylor, « l'empreinte » de la loi (Brunton) ; M(t) est la moyenne de e^{tX}, t un bouton qui grossit les grandes valeurs (t > 0) ou les petites (t < 0). Dé : à t = 0,5 la face 6 pèse e³/6 = 3,35, la face 1 e^{0,5}/6 = 0,27, M(0,5) = 8,08.
- Formule : M_X(t) = E[e^{tX}] = Σ e^{tx} P(X = x) ou ∫ e^{tx} f(x) dx ; c'est LOTUS avec g(x) = e^{tx} ; M(0) = 1 ; M peut valoir +∞ ; hypothèse utile : M finie sur (−h, h). Alors M(t) = Σ E[X^k] t^k/k! et M détermine la loi (unicité, admise).
- Figure 1 : quatre lois de moyenne 0 et variance 1 (±1, trois points −√2, 0, √2 en ¼ ½ ¼, N(0, 1), Exp(1) − 1) ; même parabole 1 + t²/2 en 0 ; en t = 0,25 toutes entre 1,031 et 1,038 ; en t = 1 : 1,543, 1,589, 1,649, ∞.
- Exemples : constante e^{ct} ; Bernoulli 1 − p + pe^t ; dé, M(0,5) = 8,08 et M(−0,5) = 0,244 ; ±1 → cosh t.
- Preuve : série de l'exponentielle, espérance terme à terme (permutation justifiée par M finie près de 0), identification des coefficients E[X^k]/k! ; unicité admise, avec son idée (prolongement complexe, fonction caractéristique, inversion).
- Code c1 : les « sœurs » de la log-normale, densité f(x)[1 + a sin(2π ln x)], ont les mêmes moments e^{k²/2} (1 ; 1,649 ; 7,389 ; 90,017 ; 2 980,958) pour a = 0 ; 0,5 ; 1, et des fonctions de répartition différentes.
- Où ça casse : Cauchy (M infinie hors de 0) ; Student 3 ddl (variance 3, M infinie) ; log-normale (tous les moments finis, M = ∞ pour t > 0, sœurs aux mêmes moments) ; M(0) = 1 pour toute loi : c'est l'égalité sur un intervalle qui identifie.
- Brunton dit / c'est : (28, 30, 37) les moments « identifiants uniques » → pas toujours ; vrai si M finie près de 0. (37) « transformée de Laplace » → bilatérale, prise en −t.
- Ce qu'on garde : M(t) = E[e^{tX}], qui vaut 1 en 0, a pour coefficients de Taylor E[X^k]/k! ; finie près de 0 elle identifie la loi, sinon même tous les moments ne suffisent pas.

### n2 · Dériver en 0 donne les moments ; Poisson — CULTURE — Brunton 38 — P · C
- Idée : on dérive en t, pas en x (« pas de règle de la chaîne, pas d'intégration par parties ») : chaque dérivée fait descendre un x, et en 0 l'exponentielle vaut 1. Bernoulli(p) : E[X] = E[X²] = p, Var = p(1 − p). Poisson (ampoules) : λ, λ² + λ, Var = λ.
- Formule : M^{(k)}(0) = E[X^k] ; Var = M″(0) − M′(0)² ; hypothèse M finie près de 0 (dérivation sous le signe somme) ; raccourci K = ln M : K′(0) = E[X], K″(0) = Var.
- Vignette v2 : M(t), tangente (pente E[X]) et parabole osculatrice (E[X²]/2 devant t²), Poisson λ ou pièce p.
- Exemples : Bernoulli(0,3) → 0,3 et 0,21 ; Poisson λ, λ² + λ, λ ; devoir de Brunton : E[X³] = λ³ + 3λ² + λ, E[X⁴] = λ⁴ + 6λ³ + 7λ² + λ (22 et 94 pour λ = 2) ; exponentielle : 1/λ, 2/λ², 1/λ² sans intégration par parties (l08#n8) ; K(t) = λ(e^t − 1) : moyenne, variance et troisième moment centré valent λ ; exemple ML : ln Σ p_i e^{t x_i} est un log-sum-exp, sa dérivée une moyenne pondérée par un softmax (p08-02).
- Preuve : dérivation terme à terme, LOTUS en 0 ; puis Poisson (chaîne, produit).
- Code c2 : différences finies sur M de Poisson(3) : 3 ; 12 ; 57 ; Var 3 ; moments d'échantillon ; asymétrie 1/√3 = 0,577.
- Où ça casse : M‴(0) = E[X³] n'est pas l'asymétrie (Poisson(2) : 22 contre 0,71, kurtosis 3,5) ; coefficients de Taylor = E[X^k]/k! ; log-normale : pas de dérivées en 0.
- Brunton dit / c'est : (37) « E[X³] est l'asymétrie, E[X⁴] la kurtosis » → moments centrés réduits E[((X − μ)/σ)³], E[((X − μ)/σ)⁴] (l08#n7). (38) devoir « λ³ + λ² + λ » → λ³ + 3λ² + λ. (38) dérivation sous l'intégrale non justifiée → hypothèse écrite dans la formule.
- Ce qu'on garde : dériver en t fait descendre un x : M^{(k)}(0) = E[X^k] ; Poisson : moyenne = variance = λ.

### n3 · Fonctions génératrices de Poisson, de la normale, de l'exponentielle — CULTURE — Brunton 37 — P · C
- Idée : trois astuces : série de l'exponentielle (Poisson), compléter le carré (normale, « plus simple que la densité »), intégrale qui ne converge que pour t < λ (exponentielle : M(0,5) = 2, M(0,9) = 10, M(1) = ∞). Motif commun : multiplier par e^{tx} redonne la même famille, à la constante M(t) près.
- Formule : e^{λ(e^t − 1)} pour tout t ; e^{t²/2} pour tout t, N(μ, σ²) : e^{μt + σ²t²/2} ; λ/(λ − t) pour t < λ. Brunton note s pour l'exponentielle.
- Vignette v3 : la loi en pointillé, multipliée par e^{tx} en plein ; aire = M(t) ; Poisson(2) à t = 0,5 : forme Poisson(3,30), somme 3,66 ; normale : cloche glissée en t, aire e^{t²/2} = 1,13 ; exponentielle(1) : aire 2 à t = 0,5, infinie pour t ≥ 1.
- Exemples : 3,66 ; 1,649 ; N(3, 4) → e^{3t + 2t²} ; exponentielle(1) ; vérification M′(0) = 0, M″(0) = 1 pour N(0, 1) ; E[X⁴] = 4!/8 = 3 par le coefficient de t⁴ de e^{t²/2} (promesse de l06#n4, kurtosis de l08#n7).
- Preuve : les trois calculs de Brunton, règle nommée à chaque ligne.
- Code c3 : moyenne empirique de e^{tX} contre la formule, t = 0,3 (2,010 contre 2,013 ; 1,045 contre 1,046 ; 1,433 contre 1,429) ; près du bord (t = 0,9 pour Exp(1)), cinq estimations dispersées : e^{0,9X} a une moyenne finie (10) et une variance infinie.
- Où ça casse : domaine ; e^{t²/2} vaut pour N(0, 1) seulement ; estimation instable près du bord.
- Brunton dit / c'est : (37) « la loi des probabilités totales dit que l'intégrale vaut 1 » → normalisation d'une densité ; la loi des probabilités totales est la formule de partition (l03#n3).
- Ce qu'on garde : e^{λ(e^t − 1)}, e^{t²/2}, λ/(λ − t) pour t < λ ; multiplier par e^{tx} redonne la même famille.

### n4 · Fonction de répartition plutôt que densité : le pic à 6 pieds — CULTURE — Brunton 39 — P · C
- Idée : M détermine F, pas la densité ; tailles déclarées des hommes américains (permis, applis de rencontre), presque normales avec une pile à exactement 6 pieds (on s'arrondit depuis 5'11½, même 5'10½) ; une masse ponctuelle n'a pas de densité (barre = masse/w → ∞), F a un saut ; « intégrer lisse, dériver abîme ».
- Modèle (jouet, pas des données) : taille vraie N(69, 3²) pouces (175,3 cm, écart-type 7,6 cm) ; la moitié de ceux qui mesurent entre 70,5 et 72 pouces (179,1 et 182,9 cm) déclarent 72. P(70,5 ≤ H < 72) = 0,1499 ; masse en 72 = 0,0749 ≈ 7,5 % ; F(72⁻) = 0,766, F(72) = Φ(1) = 0,841. Avec tous les arrondis (q = 1) : saut 15 %, F plate sur [70,5 ; 72[ à 0,691.
- Formule : F(x) = P(X ≤ x) = ∫_{−∞}^x f(u) du quand f existe ; saut F(a) − F(a⁻) = P(X = a) ; loi mixte F = (1 − m)F_c + m 𝟙{x ≥ a} ; unicité et TCL portent sur F (convergence en loi).
- Vignette v4 : histogramme en échelle de densité, classes centrées sur 72 ; la barre de 72 vaut 0,095 (w = 2, noyée avec le creux), 0,134 (w = 1), 0,2095 (w = 0,5), 0,3598 (w = 0,25), 0,8097 (w = 0,1), soit 0,075/w + 0,06 (hauteur ordinaire autour de 72, creux compris), contre un sommet de cloche ≈ 0,133.
- Figure 2 : densité de la partie continue (creux) + flèche de masse ; F avec saut ; curseur q.
- Exemples : dé (escalier) ; tailles ; somme de pièces (F en escalier, jamais de densité) ; ML : ReLU d'une N(0, 1), masse ½ en 0 ; délai d'expiration (timeout) à 30 s.
- Preuve : F(a) − F(a − h) → P(X = a) ; avec une densité ∫_a^a f = 0 ; Lebesgue nommé.
- Code c4 : 200 000 tailles simulées : part à 72 ≈ 0,075, hauteur de la classe de 72 selon w, saut de la CDF empirique.
- Où ça casse : question de Salah (Europe, 1,80 m), voir plus bas ; histogramme et estimation de densité étalent le pic ; P(X = a) = 0 pour une variable à densité.
- Brunton dit / c'est : (39) ∫_{−∞}^x f(x) dx → ∫_{−∞}^x f(u) du ; « fonction d'erreur » → Φ(x) = ½[1 + erf(x/√2)] ; (39) « on montrera que les moments de la somme convergent » → ce sont les fonctions génératrices (44), et la conclusion porte sur F (convergence en loi, non nommée).
- Ce qu'on garde : une masse ponctuelle n'a pas de densité ; F la montre par un saut égal à la masse ; c'est pourquoi l'unicité et le TCL portent sur F.

### n5 · Somme indépendante : produit des fonctions génératrices — CULTURE — Brunton 40 — P · C
- Idée : e^{t(x+y)} = e^{tx}e^{ty}, et l'indépendance factorise l'espérance ; deux pièces : (½ + ½e^t)² = ¼ + ½e^t + ¼e^{2t} ; deux dés : 36 termes, six de somme 7, P(S = 7) = 6/36 ; Laplace : la convolution devient un produit.
- Formule : X ⫫ Y ⇒ M_{X+Y} = M_X M_Y ; i.i.d. ⇒ M_{S_n} = M^n ; indépendance utilisée une fois, même loi seulement pour la puissance.
- Vignette v5 : grille 6 × 6 des termes e^{t(x+y)}/36, regroupés par x + y (triangle 1…6…1) ; Y = X : six cases, sommes paires ; en t = 0,2, M_{2X} = 5,07 contre M_X² = 4,55.
- Exemples : deux pièces ; n pièces → binomiale par le binôme de Newton ; Poisson(λ₁) + Poisson(λ₂) = Poisson(λ₁ + λ₂), exemple ML : fusion de deux flux de requêtes indépendants à 2 et 3 par seconde → Poisson(5), P(aucune requête) = e^{−5} = 0,0067 ; deux normales ; ln M s'additionne : cumulants, Var(X + Y) = Var X + Var Y, somme de pertes indépendantes.
- Preuve : définition, exponentielle, indépendance (fonctions de variables indépendantes, l08#n4), version discrète par factorisation de la jointe (l07#n4), récurrence.
- Code c5 : deux flux Poisson(2) et Poisson(3) simulés, fusion : moyenne ≈ variance ≈ 5, P(0) ≈ 0,0067 ; M_A M_B = M_{A+B} à t = 0,3 ; B = A : M_{2A} ≠ M_A².
- Où ça casse : Y = X ; réciproque fausse (loi jointe en dix-huitièmes [[2, 3, 1], [1, 2, 3], [3, 1, 2]] sur {0, 1, 2}² : marges uniformes, somme 1-2-3-2-1 neuvièmes comme sous indépendance, P(X = 0, Y = 1) = 1/6 ≠ 1/9) ; deux exponentielles → Gamma(2, λ) ; un mélange a ½M_X + ½M_Y, pas le produit.
- Brunton dit / c'est : (40) « blocs additionnés, fonctions de transfert multipliées » → blocs en série ; le fait sous-jacent est la convolution f_X * f_Y ; (40) M_X(t)^n pour « des variables » → il faut aussi la même loi.
- Ce qu'on garde : indépendantes ⇒ M_{X+Y} = M_X M_Y, i.i.d. ⇒ M^n ; la réciproque est fausse.

### n6 · Preuve du TCL en six étapes, avec ses trous — CULTURE — Brunton 44 — P · C
- Idée : X_i i.i.d., moyenne 0, variance σ², Z_n = S_n/(σ√n) ; M_{Z_n}(t) = M(t/(σ√n))^n ≈ (1 + t²/(2n))^n → e^{t²/2} ; les moments d'ordre ≥ 3 disparaissent. ±1 : cosh(1/√n)^n = 1,543 (n = 1), 1,635 (10), 1,647 (100) ; e^{0,5} = 1,649.
- Formule : énoncé avec Φ ; rôle de chaque hypothèse ; μ ≠ 0 par X_i − μ ; hypothèse propre à la preuve : M finie près de 0 ; conclusion sur F.
- Vignette v6 : M_{Z_n}(t) contre e^{t²/2}, curseur n, ±1 ou Exp(1) − 1 (domaine t < √n ; 1,895 à n = 10, 1,709 à n = 100).
- Figure 3 : CDF de Z_n pour n pièces ±1 contre Φ ; plus grand écart 0,341 (n = 1), 0,123 (10), 0,040 (100), 0,020 (400), ≈ 0,4/√n.
- Exemples : ±1 en chiffres ((1 + 0,5/n)^n : 1,629 et 1,647 pour n = 10 et 100) ; pourquoi √n (sans normalisation cosh(t)^n → ∞ ; en divisant par n, M → 1 : la loi des grands nombres) ; exponentielle centrée : n · ε_n = 0,160 (n = 10), 0,037 (100), 0,011 (1 000), ≈ t³/(3√n) ; μ ≠ 0.
- Preuve : six étapes (stratégie, produit, Taylor, échelle, substitution, limite), règle à chaque ligne, quatre trous signalés : unicité au lieu de continuité (Curtiss 1942 ; Lévy) ; reste « ε d'ordre t³ » ; n · ε_n → 0 (n ε_n = (t²/σ²) r(u)/u²) ; M finie près de 0, levée par la fonction caractéristique E[e^{itX}].
- Code c6 : M_{Z_n}(1) pour ±1 et Exp(1) − 1, n de 2 à 10 000, et n · ε_n ; Monte Carlo sur des sommes de 100 exponentielles : E[e^Z] et P(Z ≤ 1) ≈ Φ(1).
- Où ça casse : Student 3 ddl (preuve inapplicable, TCL vrai) ; variance infinie, plus de TCL classique (Cauchy : la moyenne reste Cauchy) ; n fixé : S_n ≈ N(nμ, nσ²), exact seulement pour des X_i normales ; sans indépendance, M_{S_n} n'est plus forcément M^n et, s'il y a corrélation, Var(S_n) ≠ nσ² (l09#n2).
- Brunton dit / c'est : (44) conclusion par l'unicité → théorème de continuité ; ε_n → 0 → n · ε_n → 0 ; M supposée finie ; (44) « même densité » → même fonction de répartition ; (36, 44) « S_n est N(0, nσ²) » → approximation.
- Ce qu'on garde : M(t/(σ√n))^n = (1 + t²/(2n) + ε_n)^n → e^{t²/2} : seuls moyenne et variance survivent ; trous : M finie, n · ε_n → 0, continuité ; la fonction caractéristique lève la finitude.

## Figures exigées
- Vignette v1 (n1) — `plot` ×2 : barres P(X = x) e^{tx} d'un dé, curseur t ∈ [−0,5 ; 0,5] ; à droite M(t) et sa série de Taylor à K moments (curseur K de 0 à 10) ; readouts M(t), part de la face la plus lourde, Taylor, écart. Chiffres : M(0,5) = 8,08, face 6 = 41 %, Taylor 4,65 (K = 2), 7,16 (K = 4), 8,07 (K = 8).
- Figure 1 (n1) — `plot` : quatre M(t) de moyenne 0 et variance 1 et la parabole 1 + t²/2, curseur t ; readouts des quatre valeurs.
- Vignette v2 (n2) — `plot` : M(t), tangente et parabole osculatrice ; boutons Poisson · pièce, curseur λ ou p ; readouts M′(0), M″(0), Var.
- Vignette v3 (n3) — `plot` : loi et loi × e^{tx}, boutons Poisson(2) · N(0, 1) · Exp(1), curseur t ∈ [−1 ; 1,2] ; readouts aire = M(t), forme.
- Vignette v4 (n4) — `plot` : histogramme en densité des tailles déclarées, curseur largeur w ∈ {2 ; 1 ; 0,5 ; 0,25 ; 0,1} ; readouts barre de 72, plus haute autre barre, masse.
- Figure 2 (n4) — `plot` ×2 : densité de la partie continue + flèche de masse, CDF avec saut ; curseur q ∈ [0 ; 1] ; readouts masse, F(72⁻), F(72).
- Vignette v5 (n5) — `plot` : 36 cases, boutons « le produit » · « regrouper par x + y » · « Y = X » ; readouts.
- Vignette v6 (n6) — `plot` : M_{Z_n}(t) et e^{t²/2}, boutons ±1 · Exp(1) − 1, curseur n ∈ {1, 2, 3, 5, 10, 20, 50, 100, 1 000}.
- Figure 3 (n6) — `plot` : CDF de Z_n (escalier) et Φ, curseur n ∈ {1, 2, 4, 10, 25, 100, 400} ; readout plus grand écart.

## Résumé
1. M(t) = E[e^{tX}] ; ses coefficients de Taylor sont E[X^k]/k! ; finie près de 0, elle détermine la loi.
2. Les moments seuls ne déterminent pas toujours la loi (log-normale).
3. M^{(k)}(0) = E[X^k], Var = M″(0) − M′(0)² ; Poisson : moyenne = variance = λ.
4. Poisson e^{λ(e^t − 1)}, N(0, 1) e^{t²/2}, exponentielle λ/(λ − t) pour t < λ.
5. Une masse ponctuelle n'a pas de densité, F la montre par un saut ; unicité et TCL portent sur F.
6. Indépendance ⇒ M_{X+Y} = M_X M_Y ; la réciproque est fausse.
7. TCL : M(t/(σ√n))^n → e^{t²/2} ; trous : M finie, n · ε_n → 0, continuité plutôt qu'unicité.

Phrase d'entretien : « La fonction génératrice M(t) = E[e^{tX}] range tous les moments dans une fonction : ses dérivées en 0 sont les moments et, quand elle est finie près de 0, elle détermine la loi. Sous indépendance, la fonction génératrice d'une somme est le produit des fonctions génératrices. Pour le TCL, celle de la somme standardisée vaut M(t/(σ√n))ⁿ ≈ (1 + t²/(2n))ⁿ, qui tend vers e^{t²/2}, celle de la normale ; la preuve rigoureuse passe par la fonction caractéristique et le théorème de continuité de Lévy. »

## Chaîne verbalisée
1. Qu'est-ce que M(t), et que vaut M(0) ? → La moyenne de e^{tX}, un nombre pour chaque t ; M(0) = 1.
2. Comment obtient-on E[X] et Var(X) à partir de M ? → M′(0) et M″(0) − M′(0)² : dériver en t fait descendre un x, et e⁰ = 1.
3. Les moments déterminent-ils toujours la loi ? → Non (log-normale) ; oui si M est finie près de 0.
4. Pourquoi l'unicité parle-t-elle de F et pas de la densité ? → Une masse ponctuelle (6 pieds) n'a pas de densité ; F existe toujours, avec un saut.
5. Que vaut M_{X+Y}, sous quelle hypothèse ? → M_X M_Y si X ⫫ Y ; l'exponentielle change la somme en produit, l'indépendance factorise l'espérance.
6. La preuve du TCL en une ligne, puis un trou. → M(t/(σ√n))^n = (1 + t²/(2n) + ε_n)^n → e^{t²/2} ; M supposée finie, n · ε_n → 0 à montrer, continuité et non unicité.

## Ce qui a cassé pour Salah
- 10/10, vidéo 39 : Salah demande si l'on observe en Europe le même pic, autour d'une valeur ronde comme 1,80 m. Adressé dans le « où ça casse » de n4, prudemment : l'entassement sur des valeurs rondes (heaping, préférence pour certains chiffres) est un phénomène général des données auto-déclarées ; aucun chiffre vérifié pour un pic à 1,80 m précisément. Deux faits européens vérifiés et cités sans lien : enquêtes suisses sur la santé 1992/93, 1997, 2002, 47 192 personnes de 15 ans et plus : les francophones et italophones déclarent plus souvent une taille finissant par 0 ou 5, les germanophones un chiffre pair autre que 0, soit 2, 4, 6 ou 8 (Faeh D., Bopp M., « End-digits preference for self-reported height depends on language », BMC Public Health 8:342, 2008 — résumé lu via DOAJ) ; France, Étude nationale nutrition santé (ENNS), 629 adultes : taille déclarée supérieure de 0,79 cm en moyenne à la taille mesurée (Julia C. et al., BEH 2010, n° 8, p. 69-72 — résumé lu sur santepubliquefrance.fr). Le cœur de la notion, une masse ponctuelle n'a pas de densité et F la montre par un saut, est porté par v4 et la figure 2.
- 10/10 : asymétrie et kurtosis classées CULTURE en l08#n7 ; la correction de Brunton 37 (moments bruts ≠ asymétrie) est rappelée en n2 avec le cas Poisson (E[X³] = 22 contre asymétrie 0,71), lien vers l08#n7.

## Erreurs de Brunton couvertes
- 28, 30, 37 les moments identifient toujours la loi → n1 (encadré ; l'énoncé vrai que l08#n6 promet).
- 37 « transformée de Laplace » → n1 (encadré).
- 37 E[X³] = asymétrie, E[X⁴] = kurtosis → n2 (encadré, renvoi l08#n7).
- 38 devoir λ³ + λ² + λ → n2 (encadré) ; 38 dérivation sous l'intégrale non justifiée → n2 (formule et preuve).
- 37 « loi des probabilités totales » pour la normalisation → n3 (encadré).
- 39 ∫ f(x) dx à borne x, Φ appelée « fonction d'erreur », « les moments de la somme convergent » → n4 (encadrés).
- 40 fonctions de transfert « additionnées » → n5 ; 40 M^n sans même loi → n5.
- 42, 44 TCL par unicité ; M supposée finie ; n · ε_n → 0 négligé → n6 (preuve, encadré) ; 44 « même densité » → n6 ; 36, 44 « S_n est N(0, nσ²) » → n6.
- 44 « les coefficients de Taylor sont mes moments » → n2 (encadré : E[X^k]/k!).

## Exclusions
Pas de théorie de la mesure au-delà du nom de Lebesgue (n4) ; pas de démonstration de l'unicité ni des théorèmes de continuité (énoncés, cités) ; pas de fonction caractéristique au-delà de sa définition et de son rôle dans la preuve générale ; pas de transformée de Laplace (citée en encadré) ; pas d'aparté historique Bayes-Laplace (37) ; pas de covariance (l09) ; pas de vitesse de convergence au-delà de l'exemple n · ε_n et de l'écart 0,4/√n (l11#n2, Berry-Esseen non nommé).

## Questions pour la revue
- Figures numérotées ajoutées alors que le plan ne demande un visuel que pour n4 : le validateur exige au moins une `div.fig#figN`, et deux intuitions se jouent sur la formule (figure 1 : même départ, empreintes différentes, aperçu de l'étape 3 de la preuve ; figure 3 : la conclusion du TCL porte sur F, ce qui relie n4 et n6).
- Codes c1, c3, c4 ajoutés hors du plan (P seul en n1 et n3, rien en n4) : chacun montre ce qu'on ne voit pas sans lui (sœurs de la log-normale ; estimation instable près du bord du domaine ; densité d'histogramme qui explose avec la finesse des classes).
- Le modèle des tailles (N(69, 3²) pouces, la moitié des 70,5–72 s'arrondit) est un modèle jouet, dit comme tel dans la page ; Brunton ne donne aucun chiffre.
- Unités : la notion 4 garde les pouces de Brunton sur les axes, avec conversions en cm dans le texte.
- Liens entrants honorés : l04 renvoie à l12#n4 (seule F décrit toujours une loi) et à l12#n6 (TCL démontré) ; l06#n4 renvoie à l12#n3 pour E[X⁴] = 3 (exemple 5 ajouté) ; l08#n6 renvoie à l12 pour l'énoncé vrai sur les moments (n1) ; l11 renvoie à l12#n6.
- La preuve de n6 sépare les six étapes (lignes `drv`, règle courte, renvoi « trou k ») et la liste des quatre trous, pour que la colonne des règles reste lisible.
- Relecture en contexte frais (10/10/2026), appliquée, chaque chiffre revérifié par script (`WORK/l12/check/review.py`) :
  - n1, idée : « le coefficient de t^k est E[X^k]/k! : les moments, divisés par k!, sont les coefficients de Taylor de M » remplace une formulation qui se lisait à l'envers.
  - n4, exemple 3 : c'est la CDF de Z_n = S_n/√n (pièces à ±1), et non celle de S_n, qui converge vers Φ.
  - n6, où ça casse : S_n ≈ N(nμ, nσ²) « en général pas = », exact seulement si les X_i sont normales (cohérent avec n5) ; même précision dans l'encadré 2 de n6.
  - n5 et n6, où ça casse, et lien b04 : « le produit peut être faux », « M_{S_n} n'est plus forcément M^n », la variance de la somme ne change qu'avec une corrélation (l09#n2), « avec des termes corrélés, Var(X̄) n'est plus σ²/n ».
  - n6 : « variance infinie : plus de TCL classique » au lieu de « plus de TCL du tout ».
  - v4, légende : la barre de 72 monte comme 0,075/w + 0,06 (0,2095 ; 0,3598 ; 0,8097 vérifiés).
  - n5, idée : Brunton parle de la convolution de deux signaux en équations différentielles ; la convolution des lois est dite par la leçon, plus prêtée à Brunton.
  - n4, réponse sourcée : « un chiffre pair autre que 0, soit 2, 4, 6 ou 8 », revues nommées dans la page (BMC Public Health, 2008 ; BEH 2010, n° 8), « (en anglais heaping, ou digit preference) ».
  - n4, idée : le modèle jouet est présenté comme tel avant ses chiffres (Brunton n'en donne aucun) ; idée resserrée à 178 mots.
  - n6 trou 4 et n1 preuve : i² = −1 et e^{iθ} = cos θ + i sin θ définis, d'où |e^{itX}| = 1 ; φ(t) = M(it) = e^{−t²/2} pour N(0, 1).
  - n6 trou 1 : l'unicité « ne suffit pas » (le théorème de continuité s'appuie sur elle pour identifier la limite).
  - n6 étape 6 : passage au ln, n ln(1 + a_n/n) = a_n + O(a_n²/n) → a.
  - n5 preuve : indépendance mutuelle nécessaire, contre-exemple X, Y à ±1 et Z = XY : M_S(1) = 5,30 contre cosh(1)³ = 3,67 (l03#n9).
  - n3, garde : « pour ces trois lois ».
  - n1, idée : « à t = 0, e^{tx} = 1 : chaque valeur pèse sa probabilité ».
  - Équité envers Brunton : il se reprend sur l'asymétrie dès la fin de 37 ; il dit qu'ε_n tend vers 0 « assez vite pour être négligé », sans dire à quelle vitesse ; il dit « identical independent » en ouvrant 40, sans le rappeler au moment de la puissance. Les trous 1 à 3 de n6 ne citent plus Brunton : ses formules sont corrigées dans l'encadré seulement (règle c).
  - n6, exemple 3 : t³/(3√n) « pour n grand » (0,160 contre 0,105 à n = 10).
  - Forme : « délai d'expiration (timeout) » ; gras décoratif retiré des idées de n2, n3, n4, n5, n6 ; M(t/(σ√n))ⁿ et t²/(2n) dans la phrase d'entretien et le maillon 6 ; vrai signe moins dans le readout de v3 (N(−1, 1)).
  - Spec : c3 à t = 0,3 ; l'erreur de 44 sur les coefficients de Taylor a désormais son encadré en n2.
  - Aucune correction rejetée.
