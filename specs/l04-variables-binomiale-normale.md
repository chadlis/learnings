---
id: l04
series: lesson
part: "00"
number: "04"
slug: variables-binomiale-normale
title: Variables aléatoires, de la binomiale à la normale
subtitle: socle — Brunton 13 à 16 : v.a. contre réalisation, PMF, densité, répartition, la normale comme limite
prereq: [l03]
anki: [stats::va, stats::densite, stats::binomiale, stats::normale]
bridges: []
next: l05
status: built
---

## Question de la leçon
Qu'est-ce qu'une variable aléatoire, que dit sa loi (probabilité ponctuelle, densité, fonction de répartition), et comment la somme de n pièces devient-elle une courbe en cloche avec laquelle on calcule ?

## Vidéos couvertes
13 Random Variables and Probability Distributions · 14 Bernoulli and Binomial Random Variables · 15 The Normal Distribution: the Limit of the Binomial Distribution for Large n · 16 The Standard Unit Normal and Probability Computations.

## Prérequis
- l03 : indépendance, P(A ∩ B) = P(A) P(B) (`lesson-00-03-conditionner-bayes-independance.html#n7`) ; mutuelle pour n essais (`#n9`).
- En avance : E[X], Var(X), σ, rappelés dans l'encadré des prérequis, construits en l08 (`lesson-00-08-esperance-variance.html#n1`).
- l01 : C(n, r), choisir r places parmi n (`lesson-00-01-compter.html#n5`).
- l02 : axiome d'additivité sur des événements disjoints (`lesson-00-02-espace-axiomes-complement.html#n2`) ; binôme et Pascal (`#n6`).

## Notions

### n1 · Variable aléatoire, réalisation, paramètre fixe — OUTIL — Brunton 13
- Idée : l'analogie de Brunton avec la variable de l'algèbre ; quatre lancers d'une pièce, Ω = 16 séquences ; X = nombre de piles attache un nombre à chaque séquence (X(PPFP) = 3) ; regroupées par valeur, 1, 4, 6, 4, 1 séquences : P(X = 2) = 6/16. Puis les trois colonnes.
- Formule : X : Ω → ℝ, ω ↦ X(ω) ; P(X = x) = P({ω : X(ω) = x}) ; X ~ Binomiale(4, ½) (« suit », pas « = », Brunton 14). Tableau des trois colonnes, avec la formulation retenue par Salah : FIXE = ce qui est vrai du monde, indépendamment des données (p, μ) ; ALÉATOIRE = ce qui dépend du tirage, changerait à chaque nouveau tirage (X, X̄, p̂) ; RÉALISÉ = la valeur sur ce tirage-ci, en minuscule (x = 3, p̂ = x/4 = 0,75 sur ce tirage, x̄ = 3,2) ; le chapeau sert pour l'estimateur et pour sa valeur, « sur ce tirage » dit lequel. Notation fréquentiste P(X = x ; p).
- Exemples : quatre pièces (P(X = 2) = 6/16 = 0,375) ; un dé, deux variables sur le même Ω (la face, et « un 6 ») ; dix lancers de dé 2, 5, 1, 4, 3, 6, 2, 3, 5, 1 : x̄ = 32/10 = 3,2 pendant que μ = 3,5 ; 100 pièces : 2¹⁰⁰ ≈ 1,27 · 10³⁰ séquences, jamais énumérées, la loi les résume (Brunton) ; la loi est un modèle (Brunton 13) : dix piles sur dix, (½)¹⁰ = 1/1 024 ≈ 0,001 (calcul que Brunton ne fait pas), c'est le test ; 100 passants pour régler moyenne et écart-type des tailles, c'est l'estimation ; la taille, variable continue.
- Code : énumérer Ω avec itertools, compter X par valeur (1, 4, 6, 4, 1), puis cinq tirages où x et p̂ changent et p reste ½.
- Où ça casse : écrire μ = 3,2 pour x̄ = 3,2, ou conclure p = 0,75 après x = 3 (c'est p̂ qui vaut 0,75 sur ce tirage) ; « X = 3 » est un événement, pas une définition de X ; une variable aléatoire n'est ni variable ni aléatoire, c'est une fonction fixe de l'issue ; deux variables différentes peuvent avoir la même loi (X piles et 4 − X faces, toutes deux Binomiale(4, ½), alors que X ≠ 4 − X sauf si X = 2) ; la barre p(x | θ) réservée au conditionnement.
- Ce qu'on garde : trois objets : le paramètre, fixe, vrai du monde (p, μ) ; la variable aléatoire, fonction de l'issue, qui changerait à chaque tirage (X, X̄, p̂) ; sa réalisation sur ce tirage, en minuscule (x, x̄ = 3,2).

### n2 · Loi discrète, densité, fonction de répartition ; évaluer contre intégrer — OUTIL — Brunton 13, 16
- Idée : discret, chaque valeur porte une probabilité (barres 1-4-6-4-1, somme 1) ; continu, la taille : P(exactement 1,75 m) = 0 ; une classe de 10 cm autour de 1,75 m contient 52,5 % de la masse, une classe de 1 cm 5,69 %, la probabilité tend vers 0 mais le rapport probabilité / largeur tend vers 5,70 par mètre : la densité. La fonction de répartition F(x) = P(X ≤ x) cumule, de 0 à 1, dans les deux cas. Modèle de taille d'illustration N(1,75 ; 0,07²) en mètres (chiffres inventés, comme ceux de Brunton).
- Formules : PMF P(X = x) ≥ 0, Σ = 1 ; densité f ≥ 0, ∫ f = 1, P(a ≤ X ≤ b) = ∫ₐᵇ f ; CDF F(x) = P(X ≤ x), P(a < X ≤ b) = F(b) − F(a), f = F′ ; F(μ) = ½ pour une densité symétrique autour de μ, pas en discret (quatre pièces : F(2) = 11/16). Deux gestes : évaluer f en un point donne une vraisemblance (une hauteur, sans borne 1) ; intégrer f donne une probabilité (une aire).
- Exemples : quatre pièces, F(2) = 11/16 et P(X < 2) = 5/16 (≤ et < diffèrent en discret) ; F(1,75) = ½ sous le pic ; P(1,70 < X ≤ 1,80) = 0,525 ; f(1,75) = 5,70 par mètre = 0,057 par cm ; vraisemblance d'une taille 1,82 m : f = 3,46 sous μ = 1,75 contre 1,31 sous μ = 1,70, rapport 2,64 ; ML : la densité évaluée aux données est la vraisemblance qu'on maximise.
- Figure 1.
- Preuve : {X ≤ b} = {X ≤ a} ∪ {a < X ≤ b} disjoints ⇒ F(b) − F(a) (axiome 3) ; P(X = x) ≤ F(x) − F(x − h) → 0 (F continue) ; P(x < X ≤ x + h) ≈ f(x) h ⇒ f = F′.
- Code : un million de tailles simulées ; aucune n'est exactement 1,75 ; fenêtres de 10, 1, 0,1 cm : probabilité → 0, probabilité / largeur → 5,70 ; mètres contre centimètres ; F(1,80) = 0,762.
- Où ça casse : f(x) lue comme une probabilité ; la valeur de f dépend de l'unité ; ≤ contre < en discret ; une CDF discrète est un escalier ; intégrer la densité quand on cherche la vraisemblance (erreur de Salah, 15/09).
- Brunton dit / c'est : (13, 16) « densité » pour la loi binomiale, « cumulative density function » → loi de probabilité (PMF) en discret, fonction de répartition (cumulative distribution function, CDF).
- Ce qu'on garde : variable continue : la densité f est une probabilité par unité de x ; évaluée en un point, c'est une vraisemblance, qui peut dépasser 1 ; seule son intégrale sur un intervalle est une probabilité.

### n3 · Bernoulli(p) — OUTIL — Brunton 14
- Idée : un essai, deux issues codées 1 et 0, on choisit ce qu'est un succès (pile, un 6, une pièce bonne) ; P(X = 1) = p, P(X = 0) = q = 1 − p ; dé : p = 1/6, q = 5/6 ; le masque aléatoire de Brunton sur une image (le dropout, sans le nommer).
- Formule : P(X = x ; p) = pˣ(1 − p)¹⁻ˣ, x ∈ {0, 1} ; E = p (calcul d'une ligne), Var = p(1 − p) (l08 n6).
- Exemples : pièce ½ ; un 6 : 1/6, Var = 5/36 = 0,139 ; pièce fabriquée bonne ou défectueuse ; ML : le label d'un classifieur binaire, Y ~ Bernoulli(p(x)), et −log pʸ(1 − p)¹⁻ʸ est la log-loss (p02-01).
- Pas de preuve ni de code (plan) ; la vignette porte la simulation.
- Où ça casse : un dé n'est une Bernoulli qu'une fois le succès défini ; « succès » est une convention (une pièce défectueuse peut être codée 1) ; E[X] = p n'est pas une valeur possible ; p fixe et identique pour une suite de Bernoulli.
- Brunton dit / c'est : (14) appelle d'abord p la probabilité de X = 0 puis se corrige → p = P(X = 1).
- Ce qu'on garde : Bernoulli(p) : un essai à deux issues codées 1 (probabilité p) et 0 ; P(X = x ; p) = pˣ(1 − p)¹⁻ˣ, de moyenne p et de variance p(1 − p).

### n4 · Binomiale = somme de n Bernoulli indépendantes — OUTIL — Brunton 14
- Idée : X = B₁ + … + Bₙ compte les succès ; n = 2 au tableau : q², pq + qp = 2pq, p² ; l'indépendance change le « et » en produit ; en général C(n, k) placements, chacun de probabilité pᵏqⁿ⁻ᵏ ; trois 6 en douze lancers : 220 · (1/6)³ · (5/6)⁹ = 0,197 (Brunton ne le calcule pas).
- Formule : P(X = k) = C(n, k) pᵏ(1 − p)ⁿ⁻ᵏ, k = 0, …, n ; X ~ Binomiale(n, p). Hypothèses : n fixé d'avance, même p, indépendance mutuelle, on compte sans l'ordre. E = np, Var = np(1 − p), annoncées (preuves : l08 n3 linéarité ; l09 n2 additivité, qui demande des covariances nulles, que l'indépendance garantit).
- Exemples : n = 2 pour un dé (25/36, 10/36, 1/36) ; n = 3 (1, 3, 3, 1 ; 0,579, 0,347, 0,069, 0,005 pour un dé) ; quatre pièces 1-4-6-4-1 ; trois 6 en douze : 0,197 ; dix 6 en cent : 0,0214 ; ML : 872 bonnes réponses sur 1 000 exemples de test, X ~ Binomiale(1 000, π), π fixe ; si π = 0,87 : E = 870, σ = 10,6.
- Figure 2 (existante, p00-01 figure 1).
- Preuve : produit par indépendance pour une séquence ; C(n, k) séquences ; somme sur des événements disjoints ; Σ = (p + q)ⁿ = 1 par le binôme.
- Code : 100 000 expériences de 12 lancers ; part des expériences à trois 6 contre 0,1974 ; somme des probabilités = 1 ; moyenne et variance contre np = 2 et np(1 − p) = 1,667.
- Où ça casse : tirages sans remise (hypergéométrique, l02 n5) ; p qui varie (mélange, variance plus grande que np(1 − p)) ; n non fixé (attendre le premier succès : géométrique, l05 n2) ; ML : exemples de test dupliqués ou corrélés, la variance binomiale sous-estime l'incertitude.
- Ce qu'on garde : Binomiale(n, p) : le nombre de succès en n essais indépendants de même p ; P(X = k) = C(n, k)pᵏ(1 − p)ⁿ⁻ᵏ, les placements fois la probabilité d'une séquence ; E = np, Var = np(1 − p).

### n5 · La normale comme limite de la binomiale — OUTIL — Brunton 15
- Idée : le code Python de Brunton superpose la binomiale (« exacte ») et la normale de moyenne np et de variance np(1 − p) (« approximation ») : n = 100, p = ½, écart maximal 0,0002 pour un pic de 0,080 ; n = 30 : 0,0012 ; n = 10 : 0,006 ; n = 5 : 0,011 pour un pic de 0,31 ; n = 30 et p = 0,02 : la normale met 21,7 % de sa masse à gauche de 0, dont 7,6 % sous −0,5, hors de toute barre, alors que P(X = 0) = 0,545 : il faudra Poisson.
- Formule : f(x) = 1/(σ√(2π)) · e^(−(x − μ)²/(2σ²)), N(μ, σ²) (second paramètre = variance) ; P(X = k) ≈ f(k) avec μ = np, σ² = np(1 − p) ; énoncé exact (de Moivre–Laplace) : (X − np)/√(np(1 − p)) tend en loi vers N(0, 1), à p fixé. Hypothèses : p fixe dans ]0, 1[ (si p = λ/n, Poisson, l05 n1) ; indépendance (premier cas du TCL, l11 n1) ; np(1 − p) pas petit.
- Exemples : les cinq cas de Brunton chiffrés ; p = 0,35 et n = 30 : écart 0,004 ; P(X = 50) = 0,0796 contre f(50) = 0,0798 ; queues : P(X ≥ 70) = 3,9 · 10⁻⁵ exacte contre 4,8 · 10⁻⁵ approchée, bon en absolu, faux de 23 % en relatif ; ML : 1 000 exemples, π = 0,87 : N(870 ; 10,6²) ; la variance binomiale donne le SE √(π(1 − π)/n) = 0,0106, l'approximation normale donne le 1,96.
- Figure 3 (curseurs n et p, bascule « centré réduit »).
- Code : la reproduction du code de Brunton, tableau des écarts maximaux, masse sous 0.
- Où ça casse : np petit, p de l'ordre de λ/n (Poisson), alors qu'un p petit seul ne suffit pas (p = 0,02, n = 10 000 : écart maximal 0,0005) ; n petit ; queues relatives ; la binomiale ne converge pas vers une loi fixe : sa moyenne et son écart-type grandissent, c'est la variable centrée réduite qui converge.
- Brunton dit / c'est : (15, 16) normale écrite P(X = x) → c'est une densité, P(X = x) = 0 en continu ; (16) « la probabilité infinitésimale » → c'est f(x) dx ; (15) « la binomiale converge vers une normale », variables « indépendantes, identiques », « presque toute loi », « sous des conditions très faibles » → c'est (X − np)/√(npq) qui converge ; il manque la variance finie, et c'est la somme centrée réduite qui converge (l11).
- Ce qu'on garde : Binomiale(n, p), n grand et np(1 − p) pas petit : (X − np)/√(np(1 − p)) tend vers N(0, 1), d'où P(X = k) ≈ f(k) pour N(np, np(1 − p)) ; si np reste petit, c'est Poisson.

### n6 · Normale centrée réduite, Φ, 68 / 95 / 99,7 — OUTIL — Brunton 16
- Idée : σ règle la largeur ; la normale centrée réduite μ = 0, σ = 1 ; sa fonction de répartition s'appelle Φ ; Φ(1) ≈ 0,841, queue droite 16 %, la même à gauche par symétrie, reste 68 % ; devoir : à ±2σ, 95,4 % ; les tables d'argile n'existaient que pour Z, on y ramène toute normale par z = (x − μ)/σ.
- Formule : φ(z) = e^(−z²/2)/√(2π) ; Φ(z) = P(Z ≤ z) = ∫ φ ; Φ(−z) = 1 − Φ(z) ; P(a ≤ X ≤ b) = Φ((b − μ)/σ) − Φ((a − μ)/σ) ; P(|X − μ| ≤ kσ) = 2Φ(k) − 1 = 68,27 / 95,45 / 99,73 % ; 95 % exactement à ±1,96σ. Pas de forme close pour Φ.
- Exemples : 400 pièces, N(200 ; 10²) : ±10 piles 68 % du temps ; taille N(1,75 ; 0,07²) : P(X > 1,89 m) = 1 − Φ(2) = 2,3 % (« suis-je normal ? ») ; Φ(0) = ½ mais φ(0) = 0,399 ; ML : 0,872 ± 1,96 × 0,0106 = [0,851 ; 0,893].
- Figure 4 (existante, p00-01 figure 4, avec Φ dessous et curseur σ).
- Preuve (culture) : symétrie ⇒ Φ(−z) = 1 − Φ(z) ; bande 2Φ(k) − 1 ; X = μ + σZ ⇒ la bande ne dépend que de k (standardisation démontrée en l06 n3).
- Code : Φ(1), Φ(2), Φ(3), Φ(−1), quantile 1,960 ; un million de N(200 ; 10²), parts dans ±1, 2, 3σ.
- Où ça casse : 68/95/99,7 ne vaut que pour la normale (l08 n6, la variable qui vaut 0 ou 10) ; hors de ±3σ, une fois sur 370 seulement, les queues lourdes réelles sont bien plus fréquentes ; Φ ≠ φ ; N(μ, σ²) contre `scale=σ` dans scipy.
- Brunton dit / c'est : (16) « paramétrée par la moyenne μ et l'écart-type σ² » → σ est l'écart-type, σ² la variance.
- Ce qu'on garde : toute normale : P(|X − μ| ≤ kσ) = 2Φ(k) − 1, avec Φ la répartition de N(0, 1) ; 68,3, 95,4 et 99,7 % à k = 1, 2, 3 ; 95 % à 1,96.

### n7 · Approximation normale et correction de continuité — OUTIL — Brunton 16
- Idée : 400 pièces, P(190 ≤ X ≤ 230) : 41 termes exacts, somme 0,852 ; normale N(200 ; 10²) entre 190 et 230 : Φ(3) − Φ(−1) = 0,840 ; chaque entier est une barre de largeur 1 de k − ½ à k + ½, l'aire de 190 à 230 coupe en deux la première et la dernière barre ; de 189,5 à 230,5 : Φ(3,05) − Φ(−1,05) = 0,852.
- Formule : P(a ≤ X ≤ b) ≈ Φ((b + ½ − np)/σ) − Φ((a − ½ − np)/σ), σ = √(np(1 − p)), a, b entiers ; inégalités strictes d'abord ramenées à des larges (P(190 < X < 230) = P(191 ≤ X ≤ 229)) ; P(X = k) ≈ Φ((k + ½ − np)/σ) − Φ((k − ½ − np)/σ).
- Exemples : 400 pièces (0,8520 exact, 0,8400 sans, 0,8520 avec) ; les demi-barres manquantes (0,0242 + 0,0004)/2 = 0,0123 ≈ l'écart 0,012 ; P(X = 200) = 0,0399 ; dix pièces, P(X ≤ 3) = 176/1 024 = 0,172 exact, 0,103 sans correction, 0,171 avec ; strict 190 < X < 230 : 0,8274 ; ML : P(X ≤ 850) pour 1 000 exemples à π = 0,87 : exact 0,0353, avec correction 0,0334, sans 0,0300.
- Code : les 41 termes, les deux approximations, les dix pièces.
- Où ça casse : ≤ contre < ; la correction n'a pas de sens pour une variable continue ; elle compte peu quand σ est grand ; p loin de ½ : l'asymétrie reste (cas ML) ; aujourd'hui le calcul exact est une ligne (`binom.cdf`) : l'approximation sert à raisonner et à calculer de tête.
- Brunton dit / c'est : (16) « 51 termes » → 41 ; « environ 85 % » → Φ(3) − Φ(−1) = 0,840 ; 0,852 est la valeur exacte, que la normale ne rend qu'avec la correction de continuité, qu'il ne nomme pas ; « Φ(230) et Φ(190) » → F(230) − F(190) pour la CDF de N(200 ; 10²), soit Φ(3) − Φ(−1).
- Ce qu'on garde : variable entière approchée par N(μ, σ²) : chaque entier est une barre de largeur 1, d'où P(a ≤ X ≤ b) ≈ Φ((b + ½ − μ)/σ) − Φ((a − ½ − μ)/σ).

## Figures exigées

Vignettes « voir l'idée » (sous chaque idée) :
- v1 (n1) — les 16 séquences de quatre pièces en tuiles avec leur valeur X ; bouton « regrouper par X » : les tuiles tombent en piles 1, 4, 6, 4, 1 (axe en seizièmes) ; bouton « lancer quatre pièces » (graine fixe, relançable) : une séquence s'allume ; readouts p fixe, X aléatoire, x et p̂ sur ce tirage.
- v2 (n2) — des barres à la densité : tailles N(1,75 ; 0,07²) en classes de 10, 5, 2, 1 cm ; deux lectures, « probabilité de chaque classe » (les barres s'écrasent) et « probabilité ÷ largeur » (elles collent à la courbe, pic 5,70 par mètre) ; readouts sur la classe centrale.
- v3 (n3) — le masque de Bernoulli de Brunton : 160 pixels, curseur p, nouveau masque ; readouts nombre et part masqués ; état initial à p = 0,3 : 44 sur 160, 0,275.
- v4 (n4) — le carré unité de Brunton n = 2 : colonnes p et q pour l'essai 1, lignes p et q pour l'essai 2, cases colorées par k ; aires q², pq, qp, p² ; à droite les barres P(X = k) ; curseur p (départ 1/6) ; une case trop étroite reçoit une étiquette pivotée (« SÉ · pq = 0,139 ») ; readouts q², 2pq, p², pq = qp, et q² + 2pq + p² = 1.
- v5 (n5) — les cinq tracés de Brunton : n = 100, 30, 10, 5 à p = ½, puis n = 30 et p = 0,02 ; barres et courbe ; readouts μ, σ, pic, écart maximal, masse sous 0 et sous −0,5 (21,7 et 7,6 %).
- v6 (n6) — la décomposition de Brunton en quatre temps : Φ(k), queue droite, queue gauche par symétrie, bande ; curseur k.
- v7 (n7) — 400 pièces : barres de 175 à 240 et courbe N(200 ; 10²) ; trois boutons (41 barres exactes, aire de 190 à 230, aire de 189,5 à 230,5) ; zoom sur la borne 190 ; readouts.

Figures sous la formule :
- Figure 1 (n2) — `plot` : densité des tailles avec l'aire de a à b, et la CDF dessous avec F(a), F(b) ; curseurs a, b ; bascule mètres / centimètres ; readouts f(a), f(b) (hauteurs, vraisemblances), F(b) − F(a) (aire), P(X = a) = 0.
- Figure 2 (n4) — `plot` (existante) : PMF binomiale, curseurs n ∈ [1, 100] et p, E = np en trait, E ± σ ; préréglages quatre pièces, douze dés, cent dés, curseur k (barre lue en rouge) ; readouts E, σ, P(X = k), somme des barres.
- Figure 3 (n5) — `plot` : binomiale et N(np, np(1 − p)) superposées, curseurs n ∈ [1, 200] et p ; bascule « en k » / « centré réduit » (hauteurs × σ contre φ fixe) ; readouts μ, σ, écart maximal, masse normale sous 0 (aire rouge).
- Figure 4 (n6) — `plot` (existante) : N(200 ; σ²) avec la bande μ ± kσ, et Φ((x − 200)/σ) dessous avec l'écart vertical F(b) − F(a) ; curseurs k et σ ; readout de l'aire, qui ne dépend pas de σ.

## Résumé
1. Une variable aléatoire est une fonction de l'issue : fixe (p, μ), aléatoire (X, X̄, p̂), réalisé (x, x̄).
2. Discret : P(X = x) est une probabilité (PMF). Continu : P(X = x) = 0, la densité est une probabilité par unité ; P(a < X ≤ b) = F(b) − F(a).
3. Densité évaluée = vraisemblance (peut dépasser 1) ; intégrée = probabilité.
4. Bernoulli(p) : pˣ(1 − p)¹⁻ˣ, moyenne p.
5. Binomiale(n, p), somme de n Bernoulli indépendantes : C(n, k)pᵏ(1 − p)ⁿ⁻ᵏ, E = np, Var = np(1 − p).
6. n grand, np(1 − p) pas petit : Binomiale ≈ N(np, np(1 − p)) ; np petit : Poisson.
7. Φ(z) = P(Z ≤ z) ; ±1, 2, 3σ : 68,3 / 95,4 / 99,7 % ; 95 % à ±1,96σ.
8. Variable entière : ±½ aux bornes ; 400 pièces : 0,852.

Phrase d'entretien : « Une variable aléatoire est une fonction de l'issue du tirage : le paramètre est fixe, la variable changerait à chaque tirage, la réalisation est sa valeur sur ce tirage. En discret la loi donne des probabilités ponctuelles ; en continu, une densité, que j'évalue pour une vraisemblance et que j'intègre pour une probabilité. Une binomiale est une somme de Bernoulli indépendantes ; pour n grand, je l'approche par N(np, np(1 − p)) avec une correction d'un demi aux bornes. »

## Chaîne verbalisée
1. Quatre pièces, X = nombre de piles : qu'est-ce qui est fixe, aléatoire, réalisé ? → p = ½ ; X et p̂ = X/4 ; x = 3 sur ce tirage.
2. Pourquoi P(X = 1,75 m) = 0, et que veut dire f(1,75) = 5,7 ? → Un point n'a pas de largeur ; f est une probabilité par mètre, une vraisemblance ; seule l'aire est une probabilité.
3. D'où vient C(n, k)pᵏ(1 − p)ⁿ⁻ᵏ ? → Chaque séquence à k succès vaut pᵏ(1 − p)ⁿ⁻ᵏ par indépendance ; il y en a C(n, k) ; on additionne des événements disjoints.
4. Quand une binomiale ressemble-t-elle à une normale, et laquelle ? → n grand et np(1 − p) pas petit : N(np, np(1 − p)) ; np petit : Poisson.
5. Pourquoi 68 % dans ±1σ ? → Φ(1) = 0,841, queue droite 0,159, la même à gauche, 1 − 2 × 0,159 = 0,683.
6. 400 pièces, P(190 ≤ X ≤ 230) ? → 41 termes, 0,852 ; Φ(3,05) − Φ(−1,05) = 0,852 avec la correction, 0,840 sans.

## Ce qui a cassé pour Salah
- 18/09 : la réalisation prise pour la variable. Adressé en n1 : tableau des trois colonnes dans la formule, avec sa formulation (FIXE, ALÉATOIRE, RÉALISÉ, chapeau sur l'estimateur), vignette v1 où x et p̂ changent à chaque lancer et p jamais, « où ça casse » (μ = 3,2 contre x̄ = 3,2), code c1. Repris en n4 (872/1 000 : π fixe, X aléatoire, x = 872).
- 15/09 : densité intégrée au lieu d'évaluée. Adressé en n2 : le bloc formule nomme les deux gestes, la figure 1 sépare les readouts « hauteur = vraisemblance » et « aire = probabilité » et bascule mètres / centimètres (la hauteur change, l'aire non), l'exemple de vraisemblance 3,46 contre 1,31, le « où ça casse » qui nomme l'erreur.
- Notation fréquentiste : P(X = x ; p) écrit en n1 et n3, la barre réservée au conditionnement.

## Erreurs de Brunton couvertes
13, 16 « densité » pour la loi discrète, « cumulative density function » → n2 · 15, 16 normale écrite P(X = x) → n5 · 15 « la binomiale converge vers la normale », TCL sans hypothèses → n5 · 14 p d'abord appelé P(X = 0) → n3 · 16 « l'écart-type σ² » → n6 · 16 « 51 termes », « environ 85 % », « Φ(230) et Φ(190) » → n7 (41 termes, 0,840 sans correction, 0,852 avec, valeur exacte 0,852).

## Exclusions
Pas de Poisson au-delà de son nom (l05), pas de preuve de la standardisation (l06 n3, utilisée ici), pas de preuve de E = np ni de Var = np(1 − p) (l08 n3, l09 n2), pas de preuve de la limite de de Moivre–Laplace ni du TCL (l11, l12), pas de ∫ e^(−x²/2) = √(2π) (l07 n6), pas d'hypergéométrique ni de multinomiale (l02).

## Questions pour la revue
- Chiffres recalculés par script (`WORK/l04/check/c_numbers.py`, scipy) ; écarts à Brunton : 41 termes et non 51 ; Φ(3) − Φ(−1) = 0,8400 et non « environ 85 % » ; la valeur exacte 0,8520 coïncide avec l'approximation corrigée 0,8520.
- Le modèle de taille N(1,75 m ; 0,07²) est inventé pour l'illustration (Brunton dit lui-même inventer 5'8") ; il sert en n2 et n6, avant que la formule de la normale ne soit posée en n5 : la courbe en cloche est montrée d'abord, comme chez Brunton 13.
- Le plan ne prévoit ni preuve ni code pour n1 et n3, ni figure pour n1, n3, n7 : n1 a reçu un code court (énumérer Ω, puis cinq tirages) parce qu'il montre la loi comme un comptage et la réalisation qui change ; n6 a reçu une preuve CULTURE (symétrie et indépendance de la bande vis-à-vis de σ) parce que c'est elle qui justifie les tables de Z.
- La règle de validité de l'approximation normale n'est pas chiffrée par une règle unique : les règles usuelles varient (np et n(1 − p) ≥ 5 ou ≥ 10) ; la leçon donne les écarts mesurés et dit que c'est np(1 − p) qui compte.
- Les preset de la figure 2 démarrent sur « quatre pièces » (le premier bouton est cliqué d'office par `buttons`).
- Arrondis : les soustractions affichées sont faites sur des valeurs à 4 décimales et le résultat donné à 3 avec « ≈ » quand l'arrondi l'exige (0,8413 − 0,1587 ≈ 0,683), pour qu'aucune ligne ne soit une soustraction fausse ; l'idée de n6 reprend les arrondis de Brunton (0,16 et 0,68).
- Relecture en contexte frais à faire par l'orchestrateur avant publication.
- Relecture en contexte frais (10/10/2026), appliquée :
  - n5, second encadré Brunton : le TCL demande aussi la même loi ; Brunton dit lui-même « indépendantes, identiques » ; il lui manque la variance finie, et c'est la somme centrée réduite qui converge.
  - n2 : « F vaut ½ sous le pic » limité aux densités symétriques ; contre-exemple discret F(2) = 11/16.
  - Prérequis : puce « moyenne et écart-type, en avance » (E, Var, σ, lien l08 n1).
  - n5 (garde, casse, exemples), résumé 6, maillon 4 : « np petit » au lieu de « p petit » ; vérifié : p = 0,02 et n = 10 000 donnent un écart maximal de 0,0005.
  - v4 : étiquette pivotée pour la case SÉ trop étroite, readout pq = qp = 0,139, légende qui dit que la barre de 0,278 réunit deux cases.
  - n1 : tableau « p̂ = x/4 = 0,75 sur ce tirage », puce sur le chapeau, casse « conclure p = 0,75 après x = 3 ».
  - n5, exemple ML : la variance binomiale donne le SE 0,0106, la normale donne le 1,96.
  - Liens « indépendance mutuelle » vers l03 n9 (prérequis, aside, n4 formule) ; l03 n7 gardé pour deux événements.
  - n1 : exemple « la loi est un modèle » (dix piles sur dix, 100 passants), vérifié dans la transcription 13 ; la valeur 1/1 024 est marquée comme un calcul que Brunton ne fait pas.
  - n5, premier encadré : « puis précise « la probabilité infinitésimale » », c'est f(x) dx qui est une probabilité. Formulation « puis précise » au lieu de « se reprendre » : Brunton dit « this is the infinitesimal probability that my random variable equals x », ce qui reste imprécis ; on ne lui prête pas une correction complète.
  - n4 : Var(X) = np(1 − p) demande des covariances nulles, que l'indépendance garantit.
  - n5 (idée, v5, exemples) : 21,7 % à gauche de 0, dont 7,6 % sous −0,5, hors de toute barre (recalculé).
  - Visuels : légende « F(b) − F(a) » en vert comme le segment (fig. 1 et 4) ; fig. 3, barres filtrées dans le cadre et axe vertical au bord en lecture centrée réduite.
  - Langue : « avec une précision infinie » ; « jeu de test (test set) » et « taux de bonnes réponses (accuracy) » au premier usage ; état initial de v3 donné (44 sur 160, 0,275).
  - Règles transversales : gras non définitoire retiré des idées (discrète, continue, aire, indépendants), aucun gras dans le corps des encadrés Brunton, chaque « ce qu'on garde » ramené à une idée et à 40 mots au plus, légendes « à droite » remplacées par « le second panneau » (v4, v7) ; n2, encadré Brunton : il dit aussi « cumulative distribution function ».
  - Aucune correction rejetée.
