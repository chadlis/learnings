---
id: l02
series: lesson
part: "00"
number: "02"
slug: espace-axiomes-complement
title: Ω, axiomes, complément, triangle de Pascal
subtitle: socle — Brunton 04 à 07 : événements comme ensembles, trois axiomes, le réflexe du complément
prereq: [l01]
anki: [stats::axiomes, stats::complement]
bridges: []
next: l03
status: built
---

## Question de la leçon
Avec quel langage parle-t-on d'événements, quelles règles minimales une probabilité doit-elle suivre, et comment ces règles transforment-elles un calcul impossible (« au moins deux partagent ») en un produit d'une ligne ?

## Vidéos couvertes
04 Set Theory in Probability – Sample Spaces and Events · 05 The Birthday Problem in Probability – P(A) = 1 − P(not A) · 06 Quality Control, Non-Destructive Inspection and the "Multinomial" Distribution (en réalité hypergéométrique) · 07 The Binomial Distribution and the Multinomial Distribution (en réalité les coefficients).

## Prérequis
- l01 n2 : P(A) = #A/#Ω quand les issues sont équiprobables.
- l01 n3 : principe multiplicatif (2 × 2 × 2 = 8 suites de trois lancers).
- l01 n4 : ordonné sans remise, n!/(n − r)! = n(n − 1)…(n − r + 1).
- l01 n5 : C(n, r) = n!/(r!(n − r)!), sous-ensembles de taille r.

Convention de la leçon : F (face) et P (pile), comme l01 ; Brunton écrit H (heads, face) et T (tails, pile), son HTH est ici FPF (dit dans le bloc prérequis).

## Notions

### n1 · Ω, issues, événements : le langage des ensembles — OUTIL — Brunton 04
- Idée : « sec mais indispensable ». Univers Ω = ensemble des issues ; une issue ω est une réalisation (le mot de Brunton) ; un événement se dit en mots et s'écrit comme un sous-ensemble. Trois lancers : 8 issues ; A = « 1er lancer F » (4 issues), B = « 2e lancer P » (4 issues). Union = « ou », le grand parapluie (6 issues) ; intersection = « et », restrictive ({FPF, FPP}) ; complémentaire = « non » (4 issues commençant par P). L'image exacte de Brunton : la grille 2 × 2 de deux pièces.
- Formule : définitions de A ∪ B, A ∩ B, Aᶜ ; Ω exhaustif, issues qui s'excluent ; A se réalise si ω ∈ A ; incompatibles = A ∩ B = ∅ ; De Morgan (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ et (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ (ajouté : outil du complément en n4) ; commutativité, associativité.
- Exemples : dé (pair, au moins 4) ; De Morgan sur le dé ({1, 3}) ; les trois lancers ; univers infinis (mails par heure, température) ; issue FFP contre événement {FFP}, « au moins un F » = 7 issues.
- Code (c1) : les ensembles en Python, union, intersection, complément, De Morgan, P = #/#Ω.
- Où ça casse : « ou » inclusif (Brunton se reprend) ; l'union n'est pas une somme (8 ≠ 6) ; une issue est un résultat complet ; Aᶜ dépend de Ω ; un Venn n'est pas à l'échelle, la grille l'est.
- Brunton dit / c'est : (04) cercles qui se chevauchent pour des événements « techniquement indépendants » → les cercles ne peuvent pas le montrer ; la grille si : chevauchement ¼ = ½ × ½ (l03 n7).
- Ce qu'on garde : Un événement est un sous-ensemble de Ω (les issues) : ou = ∪ (inclusif), et = ∩, non = ᶜ ; (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ.

### n2 · Trois axiomes, et ce qu'ils donnent : complément, monotonie — OUTIL — Brunton 04
- Idée : la pièce truquée que Brunton a pensé apporter (il ne la chiffre pas ; prenons P(face) = 0,7) : il faut peser, pas compter ; P est une fonction des événements vers [0, 1] avec trois exigences. Image : la fléchette uniforme, P(A) = aire de A / aire de Ω. Tout se déduit par découpage en morceaux disjoints : P(pile) = 1 − 0,7 = 0,3 ; A ⊆ B ⇒ P(A) ≤ P(B).
- Formule : P(Ω) = 1 ; P(A) ≥ 0 ; A ∩ B = ∅ ⇒ P(A ∪ B) = P(A) + P(B). Conséquences : P(Aᶜ) = 1 − P(A), P(∅) = 0, monotonie, P(A) ≤ 1. Rôle de chaque axiome ; additivité dénombrable pour Ω infini ; #A/#Ω vérifie les trois axiomes.
- Figure 1 : découpages disjoints (complément, monotonie, ∅), curseur P(A).
- Exemples : pièce truquée ; « pas de 6 » = 5/6 ; double six ⊆ au moins un six (1/36 ≤ 11/36) ; P(A) ≤ 1 par monotonie ; un « dé » à 6 × 0,2 = 1,2 n'est pas une probabilité.
- Preuve : complément (Ω = A ∪ Aᶜ, axiomes 3 puis 1), ∅ (Ω = Ω ∪ ∅), monotonie (B = A ∪ (B ∩ Aᶜ), axiomes 3 puis 2).
- Où ça casse : probabilité ≠ fréquence (l10) ; Aᶜ dans le même Ω ; monotonie dans un seul sens ; probabilité 0 ≠ impossible (fléchette sur une ligne).
- Brunton dit / c'est : (04) additivité pour deux ensembles, P défini « sur chaque sous-ensemble » → additivité dénombrable et événements mesurables pour Ω infini ou continu ; sa version suffit pour un Ω fini.
- Ce qu'on garde : Trois axiomes : P(Ω) = 1, P(A) ≥ 0, P(A ∪ B) = P(A) + P(B) si A ∩ B = ∅ ; le complément, la monotonie et P(∅) = 0 en découlent par découpage disjoint.

### n3 · Inclusion-exclusion : ne pas compter deux fois le chevauchement — OUTIL — Brunton 04
- Idée : P(A) + P(B) = 4/8 + 4/8 = 1 alors que A ∪ B a 6 issues ; FPF et FPP comptées deux fois. Aire de deux disques qui se recouvrent. Cœur ou roi : 13/52 + 4/52 − 1/52 = 16/52.
- Formule : P(A ∪ B) = P(A) + P(B) − P(A ∩ B), sans hypothèse ; borne de l'union P(A ∪ B) ≤ P(A) + P(B), généralisée à k événements ; version à trois événements.
- Figure 2 : deux modèles sur un test set de 100 exemples (A se trompe sur 10, B sur 8), curseur « les deux se trompent » c de 0 à 8 ; au moins un = 18 − c.
- Exemples : dé (4/6) ; cœur ou roi (4/13 ≈ 0,308) ; trois lancers (6/8) ; au moins un 6 en trois dés par inclusion-exclusion (91/216 ≈ 0,421, le même nombre que 1 − (5/6)³) ; ML : deux modèles 10 %, 8 %, 5 % en commun → 13 % ; Bonferroni : 40 tests à 0,05/40 donnent P(au moins un faux positif) ≤ 0,05 sans hypothèse d'indépendance.
- Preuve : A ∪ B = A ∪ (B ∩ Aᶜ) ; B = (A ∩ B) ∪ (B ∩ Aᶜ) ; soustraire. Borne de l'union par l'axiome 2, récurrence pour k.
- Code (c3) : 100 000 cartes tirées ; l'identité vaut exactement pour les fréquences ; P(A) + P(B) surcompte.
- Où ça casse : additionner sans retirer (« 6 × 1/6 = 1 » contre 0,665) ; disjoint ≠ indépendant (l03 n7) ; trois événements : rajouter le centre ; la borne de l'union peut dépasser 1 (40 tests à 5 % : 2).
- Ce qu'on garde : P(A ∪ B) = P(A) + P(B) − P(A ∩ B), sans hypothèse ; d'où P(A ∪ B) ≤ P(A) + P(B), égalité pour des disjoints.

### n4 · Anniversaires : passer par le complément — OUTIL — Brunton 05
- Idée : intuition 365/2 ≈ 183, réponse 23. Les paires de Brunton (n − 1) + … + 1 + 0 = n(n − 1)/2 : 253 à 23 personnes. « Au moins deux partagent » est un enfer de cas, son complément « tous différents » un produit 365/365 × 364/365 × … ; à 23 : 0,4927, donc 0,5073.
- Formule : 1 − 365 × 364 × … × (365 − n + 1)/365ⁿ = 1 − 365!/((365 − n)! 365ⁿ). Hypothèses : jours équiprobables, anniversaires indépendants → 365ⁿ suites équiprobables (l01 n2) ; numérateur ordonné sans remise (l01 n4) ; n ≤ 365 (tiroirs).
- Figure 3 : P(partage) selon n (exacte), 1 − (364/365)^(n(n − 1)/2) (paires supposées indépendantes, en tirets), 1 − (364/365)^(n − 1) (quelqu'un a ton anniversaire) ; curseur n de 2 à 80.
- Exemples : n = 2 → 0,0027 ; n = 3 → 0,0082 ; n = 20 → 190 paires, 0,5886 / 0,4114 (Wolfram 0,589 chez Brunton) ; n = 23 → 0,5073 ; repères 0,117 (10), 0,706 (30), 0,970 (50), 0,9992 (70) ; ton anniversaire : 253 autres personnes pour dépasser ½ ; ML : empreintes de 32 bits, 100 000 documents → 0,69 de fausse collision, la moitié vers 77 000, 2,7 × 10⁻¹⁰ en 64 bits ; graines de 32 bits pour 10 000 exécutions → 0,012.
- Preuve : Ω = suites, #Ω = 365ⁿ ; #Aᶜ ordonné sans remise ; complément. Pourquoi 23 : 1 − x ≤ e^(−x) donne P(Aᶜ) ≤ exp(−n(n − 1)/730) ; n(n − 1)/2 ≥ 365 ln 2 ⇒ P(Aᶜ) ≤ ½ ; à 23, 253/365 = 0,693151 > ln 2 = 0,693147, borne 0,499998 ; que 22 ne suffise pas vient du calcul exact (0,524) ; ordre de grandeur √(2 · 365 · ln 2) ≈ 22,5.
- Code (c4) : la boucle du devoir de Brunton (premier n = 23, 0,5073) ; 100 000 salles de 23 simulées ; 1 − (364/365)²⁵³ = 0,5005.
- Où ça casse : paires deux à deux indépendantes mais pas mutuellement (P(1–2, 1–3, 2–3) = 1/365² ≠ 1/365³) → 0,5005 contre 0,5073, écart 0,007 à n = 23, 0,010 au plus vers n = 34 ; l'espérance du nombre de paires 253/365 = 0,69 reste exacte (linéarité, l08 n3) ; naissances non uniformes : le partage devient plus probable (saisonnalité ± 10 % : 0,509) ; 365! ≈ 2,5 × 10⁷⁷⁸ dépasse le plus grand flottant (1,8 × 10³⁰⁸) : math.gamma(366) lève OverflowError, np.prod renvoie inf, les entiers exacts de Python passent → produit incrémental ou lgamma (chaîne p08-02) ; parallèle avec l03 n8.
- Brunton dit / c'est : (05) 190 paires comparées à 365/2 = 182,5 → le bon seuil est 365 ln 2 ≈ 253 paires, soit 23 personnes ; (05) le complément « comme la loi des probabilités totales » → il découle directement des axiomes 1 et 3.
- Ce qu'on garde : « Au moins un » se calcule par le complément : 1 − ∏ₖ₌₀ⁿ⁻¹ (365 − k)/365 dépasse ½ dès 23 personnes (253 paires ≈ 365 ln 2).

### n5 · Contrôle qualité : la loi hypergéométrique — CULTURE — Brunton 06
- Idée : le test destructif, l'échantillon ; Brunton compte en lettres, la leçon chiffre : N = 100 pièces, K = 5 défectueuses, n = 10 tirées sans remise ; C(5, k) × C(95, 10 − k) sur C(100, 10) ; P(0) = 0,584.
- Formule : P(X = k ; N, K, n) = C(K, k) C(N − K, n − k)/C(N, n), k de max(0, n − (N − K)) à min(n, K) ; sans remise ; échantillons équiprobables ; point-virgule pour les paramètres fixes ; E[X] = nK/N = 0,5.
- Figure 4 : barres hypergéométrique contre binomiale (n, 0,05), curseur n de 1 à 60 ; P(0) ; seuil de 5 % : 45 pièces sans remise (0,046), 59 avec remise.
- Exemples : N = 5, K = 2, n = 2 → 3/10, 6/10, 1/10 ; le lot de 100 pièces 0,584 / 0,339 / 0,070 / 0,0064, au moins un 0,416 ; poker 2 as : 6 × 17 296/2 598 960 ≈ 0,040 ; ML, audit de 20 étiquettes sur 1 000 dont 50 fausses → 0,355.
- Preuve (culture) : comptage des sous-ensembles, principe multiplicatif ; somme = 1 par découpage (Vandermonde).
- Code (c5) : 50 000 échantillons sans remise contre la formule, et avec remise (binomiale).
- Où ça casse : avec remise ou N ≫ n → binomiale (0,584 contre 0,599) ; le vrai problème est inverse (K inconnu : P(X = k ; K), K fixe, contre P(K ∣ X = k), K aléatoire) ; échantillon non aléatoire.
- Brunton dit / c'est : (06) « loi multinomiale » → hypergéométrique (sans remise, deux classes), multivariée au-delà, la multinomiale est le cas avec remise ; « divisé par » au tableau → produit ; lettres qui changent en cours de vidéo.
- Ce qu'on garde (pas de carte) : sans remise dans un lot à deux classes, C(K, k) C(N − K, n − k)/C(N, n) ; avec remise, la binomiale.

### n6 · Binôme de Newton, triangle de Pascal, planche de Galton — CULTURE — Brunton 07
- Idée : (x + y)² ; dans (x + y)ⁿ, choisir les k facteurs qui donnent x : C(n, k) ; le triangle (somme des deux du dessus), ligne 3 = 1 3 3 1 ; Plinko / Galton : k rebonds à droite, C(n, k) chemins sur 2ⁿ, la cloche.
- Formule : (x + y)ⁿ = Σ C(n, k) x^k y^(n − k) ; C(n, k) = C(n − 1, k − 1) + C(n − 1, k) pour 1 ≤ k ≤ n − 1 (ou partout avec C(m, j) = 0 hors de 0 ≤ j ≤ m) ; Σ C(n, k) = 2ⁿ (256 événements pour trois lancers) ; Galton : C(n, k)/2ⁿ si rebonds 50/50 indépendants = binomiale (n, ½) (l04 n4).
- Figure 5 : planche de Galton animée, 10 rangées, billes, effectifs attendus, curseur p (planche penchée).
- Exemples : (x + y)³ et 2³ = 8 ; ligne 4 et les 6 suites à 2 F ; C(5, 2) = 4 + 6 ; Galton 10 rangées : 252/1 024 = 0,246 au centre, 0,656 pour les cases 4 à 6 ; C(52, 5) ; 2⁸ = 256 événements.
- Preuve : règle de Pascal par « fixer le dernier objet » ; binôme par développement ; chemins de Galton.
- Code (c6) : triangle construit par la règle, comparé à math.comb ; 100 000 billes simulées.
- Où ça casse : les coefficients ne convergent pas (C(100, 50) ≈ 10²⁹) : seule la ligne divisée par 2ⁿ, centrée et réduite, tend vers la normale (de Moivre-Laplace, l04 n5) ; Galton exige 50/50 et indépendance ; un coefficient n'est pas une probabilité.
- Brunton dit / c'est : (07) « loi binomiale » pour des nombres de mains → coefficient binomial ; la loi s'écrit P(X = k ; n, p) ; une main est un sous-ensemble uniforme, c'est son nombre d'as qui est hypergéométrique ; « les lignes convergent vers la normale » → après division par 2ⁿ, centrage, réduction.
- Ce qu'on garde (pas de carte) : (x + y)ⁿ = Σ C(n, k) x^k y^(n − k) ; chaque case est la somme des deux du dessus ; la ligne n divisée par 2ⁿ est la loi d'arrivée d'une bille de Galton.

### n7 · Coefficient multinomial — CULTURE — Brunton 07
- Idée : distribuer groupe par groupe ; 7 personnes en 2, 3, 2 : 21 × 10 × 1 = 210 = 7!/(2! 3! 2!) ; bridge / spades 52!/(13!)⁴ ≈ 5,36 × 10²⁸.
- Formule : coefficient multinomial n!/(n₁! ⋯ n_r!), nommé en mots (pas de notation (n ; n₁, …), le point-virgule est réservé aux paramètres fixes), avec Σ nᵢ = n ; groupes étiquetés ; r = 2 → C(n, k) ; coefficient de la formule du multinôme.
- Exemples : 4 en deux binômes étiquetés = 6 ; comités 210 / 105 ; deux mains et le reste 3 986 646 103 440 = C(52, 5) × C(47, 5) ; bridge ; paires (2m)!/(2^m m!) = 3, 15, 105, 945 ; dé lancé 6 fois, chaque face une fois : 720/46 656 ≈ 0,015 (la loi multinomiale, avec remise).
- Preuve : produit télescopique de Brunton, 0! = 1 ; lecture par permutations.
- Code (c7) : dénombrement brut des 210 répartitions et des 105 à binômes interchangeables.
- Où ça casse : tailles de somme n ; groupes de même taille non étiquetés ; coefficient ≠ loi (loi multinomiale de Y₁…Y_r, effectifs par classe ; pour une main, sans remise, ces effectifs suivent l'hypergéométrique multivariée) ; ce n'est pas n₁ × n₂ × ….
- Brunton dit / c'est : (07) « loi multinomiale » pour le coefficient → un nombre de façons ; devoir « 7 personnes en 2, 3 et 3 » → 2 + 3 + 3 = 8, la contrainte est violée ; 7 en 2, 3, 2 : 210 (105) ; 8 en 2, 3, 3 : 560 (280).
- Ce qu'on garde (pas de carte) : n objets en r groupes étiquetés de tailles de somme n : n!/(n₁! ⋯ n_r!) ; diviser encore si des groupes de même taille sont interchangeables.

## Figures exigées
Vignettes « voir l'idée » (sous chaque idée) :
- v1 (n1) — Venn des trois lancers avec les 8 issues écrites dans leurs régions, et grille exacte 2 × 2 de deux pièces ; boutons A, B, A ∪ B, A ∩ B, Aᶜ, (A ∪ B)ᶜ ; readouts : issues sur 8, cases sur 4, probabilité.
- v2 (n2) — cible Ω (aire 1) : pièce juste, pièce truquée 0,7 / 0,3, disque d'aire 0,2 ; 100 fléchettes à graine fixe (54, 77, 19 dans A selon la cible), bouton « lancer 500 fléchettes » ; fréquence dans A, hors de A (toujours 1 − la première), aire.
- v3 (n3) — comptage pas à pas sur la grille des trois lancers et sur les 52 cartes (cœurs × rois) : compter A (seules les cases de A colorées), ajouter B (chevauchement à 2), retirer A ∩ B ; état initial à l'étape 2.
- v4 (n4) — n personnes en cercle, toutes les paires tracées (253 à 23), anniversaires tirés à graine fixe (une paire partage au départ, le 28 juin), paires qui partagent en rouge, « 1 000 salles » ; curseur n de 2 à 60.
- v5 (n5) — lot 10 × 10, 5 défectueuses, échantillon de 10 cerclé (aucune défectueuse au départ) ; « 1 000 contrôles » (graine 924 au premier clic : 0,580 / 0,344 / 0,068 / 0,008), barres des fréquences de 0, 1, 2, ≥ 3 défauts contre 0,584 / 0,339 / 0,070 / 0,0066.
- v6 (n6) — triangle de Pascal lignes 0 à 8, curseurs ligne n et position k (k borné à n), la case et ses deux parents, somme 2ⁿ, « construire ligne par ligne ».
- v7 (n7) — sept personnes servies dans trois comités (2, 3, 2) ; readouts 21, 10, 1, 210 ; bouton « comités de 2 interchangeables » → 105.

Figures sous la formule :
- Figure 1 (n2) — `plot` : bande Ω d'aire 1 découpée en morceaux disjoints selon la conséquence choisie (complément, monotonie avec P(B) = 0,6, ∅) ; curseur P(A) de 0,05 à 0,55.
- Figure 2 (n3) — `plot` : 100 exemples d'un jeu de test (test set), erreurs de A (10), de B (8), communes (c) ; curseur c de 0 à 8 ; readout 18 − c, 82 + c.
- Figure 3 (n4) — `plot` : les trois courbes de n = 2 à 80, ligne 0,5, curseur n ; readouts exacte, paires indépendantes, écart (0,0068 à 23, 0,0099 à 34), ton anniversaire (ne passe ½ qu'à 254 personnes).
- Figure 4 (n5) — `plot` : barres hypergéométrique (N = 100, K = 5) et binomiale (n, 0,05), k de 0 à 5 et ≥ 6 ; curseur n de 1 à 60.
- Figure 5 (n6) — `plot` : planche de Galton à 10 rangées, billes animées, histogramme, effectifs attendus en points creux ; curseur p ; 200 billes initiales à graine fixe.

## Résumé
1. Ω est l'ensemble des issues ; un événement est un sous-ensemble ; ou = ∪, et = ∩, non = ᶜ ; (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ.
2. Trois axiomes : P(Ω) = 1, P(A) ≥ 0, additivité des disjoints ; tout le reste par découpage disjoint.
3. P(Aᶜ) = 1 − P(A) ; A ⊆ B ⇒ P(A) ≤ P(B).
4. P(A ∪ B) = P(A) + P(B) − P(A ∩ B), d'où la borne de l'union.
5. « Au moins un » : passer par le complément « aucun ».
6. Anniversaires : n(n − 1)/2 paires ; 253 paires, 23 personnes, 0,507.
7. Sans remise dans un lot à deux classes : hypergéométrique ; avec remise : binomiale.
8. C(n, k) : binôme, Pascal, Galton ; n!/(n₁! ⋯ n_r!) pour r groupes étiquetés.

Phrase d'entretien : « Une probabilité est une fonction sur les événements, des sous-ensembles de Ω, qui vérifie trois axiomes : P(Ω) = 1, positivité, additivité pour des événements disjoints. Tout en découle par découpage en morceaux disjoints : le complément, la monotonie, l'inclusion-exclusion. Le réflexe pratique : « au moins un » se calcule par son complément, et c'est ce qui donne 23 personnes pour un anniversaire commun. »

## Chaîne verbalisée
1. Qu'est-ce qu'un événement, et que veut dire « A se réalise » ? → Un sous-ensemble de Ω ; l'issue ω qui sort appartient à A.
2. Énonce les trois axiomes. → P(Ω) = 1 ; P(A) ≥ 0 ; A ∩ B = ∅ ⇒ P(A ∪ B) = P(A) + P(B).
3. Démontre P(Aᶜ) = 1 − P(A). → Ω = A ∪ Aᶜ, disjoints : axiome 3 puis axiome 1.
4. P(A ∪ B) quand A et B se chevauchent ? → P(A) + P(B) − P(A ∩ B) ; sinon le chevauchement compte deux fois.
5. Pourquoi 23 personnes suffisent-elles ? → P(tous différents) = ∏ (365 − k)/365 = 0,493 ; 23 personnes font 253 paires, et il en faut ≈ 365 ln 2 ≈ 253.
6. Pourquoi 1 − (364/365)²⁵³ n'est-il qu'une approximation ? → Les paires ne sont pas mutuellement indépendantes ; 0,5005 contre 0,5073.
7. Lot de 100 pièces dont 5 défectueuses, on en tire 10 : quelle loi, et pourquoi pas la binomiale ? → Hypergéométrique, sans remise ; P(0) = 0,584 contre 0,599 avec remise.

## Ce qui a cassé pour Salah
Aucune erreur de séance ne porte directement sur 04–07. Deux erreurs connues (plan, Problème 4) ont leur premier ancrage ici :
- Barre bayésienne p(x | θ) en fréquentiste : n5, la formule s'écrit P(X = k ; N, K, n), point-virgule pour les paramètres fixes, barre réservée au conditionnement ; et le « où ça casse » de n5 oppose K paramètre fixe (fréquentiste) à P(K ∣ X = k) (bayésien).
- Réalisation prise pour la variable (18/09) : n1, une issue ω est une réalisation, Ω, A et P sont fixés avant l'expérience ; n2, fréquence des fléchettes (fluctue) contre P(A) (nombre fixe).

## Erreurs de Brunton couvertes
04 Venn pour des événements indépendants → n1 · 04 additivité pour deux ensembles, P sur « chaque sous-ensemble » → n2 · 05 seuil 365/2 au lieu de 365 ln 2 ≈ 253 paires, complément « comme les probabilités totales » → n4 · 06 « loi multinomiale » pour l'hypergéométrique, « divisé par » → n5 · 07 « loi binomiale » pour un coefficient, « les lignes convergent vers la normale » → n6 · 07 « loi multinomiale » pour le coefficient, devoir 7 personnes en 2 + 3 + 3 = 8 → n7.

## Exclusions
Pas de probabilité conditionnelle ni d'indépendance au-delà d'un renvoi (l03) ; pas de variable aléatoire formelle (l04 : X est nommée en n5 sans être définie) ; pas de loi binomiale développée (l04 n4) ni de de Moivre-Laplace (l04 n5) ; pas de théorie de la mesure au-delà d'une phrase ; pas d'hypergéométrique multivariée au-delà de son nom ; pas d'inclusion-exclusion à n événements au-delà de trois.

## Questions pour la revue
- Notation : F / P (face, pile) comme l01, publiée en parallèle ; la correspondance avec les H / T de Brunton est donnée une fois, dans le bloc prérequis.
- De Morgan ajouté dans la formule de n1 (absent chez Brunton), parce que n4 en a besoin pour passer de « au moins un » à « aucun ».
- Le digest (vidéo 07) donne 7!/(2! 3! 3!) = 70 pour le devoir des comités : ce nombre ne compte rien, 2 + 3 + 3 = 8 ≠ 7. La leçon donne 210 (7 en 2, 3, 2) et 560 (8 en 2, 3, 3), vérifiés par dénombrement brut.
- La part « en tirets » de la figure 3 (paires supposées indépendantes) sous-estime de 0,007 à n = 23 et de 0,0099 au plus (n = 34).
- n2 n'a pas de bloc code (plan : P seul) ; n1 et n7 en ont un alors que le plan n'en prévoit pas : dénombrement en Python, court, qui rend les ensembles et les 210 / 105 vérifiables.
- Captures regardées (10/10/2026), corrections appliquées : légende de la figure 2 sortie de la couche effacée ; légende de la figure 3 déplacée sous la ligne 0,5 ; curseur P(A) masqué en mode ∅ (il n'y agissait pas) ; opacité des cordes de v4 réduite au-delà de 320 paires ; fond derrière les étiquettes de la cible v2 ; pas de gras dans les encadrés « Brunton, rectifié » (la feuille de style le transforme en titre) ; lignes de code ramenées sous 85 caractères.
- Relecture en contexte frais (10/10/2026), appliquée, chaque chiffre revérifié par `WORK/l02/check/review_fix.py` :
  - sortie de c1 : libellés « A or B », « A and B » au lieu de « A | B », qui se lisait P(A ∣ B), et commentaire « | is union, & is intersection » ;
  - n5 : la phrase « le point-virgule et la barre cessent d'être interchangeables » remplacée par « deux écritures, deux choses : P(X = k ; K), K fixe, contre P(K ∣ X = k), K aléatoire » ;
  - n4 : le débordement est celui des flottants (365! ≈ 2,5 × 10⁷⁷⁸ > 1,8 × 10³⁰⁸ ; math.gamma lève OverflowError, np.prod renvoie inf), les entiers exacts de Python passent (0,4927) ;
  - n4, preuve : implication « n(n − 1)/2 ≥ 365 ln 2 ⇒ P(Aᶜ) ≤ ½ » ; 253/365 = 0,693151 > 0,693147, borne 0,499998 ; 22 exclu par le calcul exact (0,524) ;
  - « ce qu'on garde » de n1, n2, n4 ramenés à 28, 36 et 30 mots ;
  - n2 : l'additivité dénombrable est exigée, elle ne se déduit pas de l'axiome 3 ;
  - v6 : le curseur k est borné à n et ramené à n quand n baisse (testé : n = 8, k = 8, puis n = 5 → k = 5, C(5, 5)) ;
  - n6 et n7 : c'est le nombre d'as d'une main qui est hypergéométrique, ce sont les effectifs par classe qui suivent l'hypergéométrique multivariée ;
  - attributions : « prenons P(face) = 0,7 » ; Brunton compte en lettres, « le lot de 100 pièces » au lieu de « le lot de Brunton, chiffré » ;
  - figure 3 : case « écart » ajoutée (0,0068 à 23, 0,0099 à 34) ; légende : la courbe « ton anniversaire » ne passe ½ qu'à 254 personnes, soit 253 autres que toi (reformulé, vérifié) ;
  - v5 : graine 924 au premier « 1 000 contrôles » (0,580 / 0,344) et « s'en approchent » ; v3 : à l'étape 1, seules les cases de A sont colorées ;
  - langue : « en regroupe 4 aussi », « uniformément au hasard », la ligne de probabilité nulle mais non vide ;
  - n6 : domaine de la règle de Pascal, P(X = k ; n, p) dans l'encadré ;
  - n7 : plus de notation (n ; n₁, …), Y₁…Yᵣ au lieu de N₁… ;
  - « jeu de test (test set) », « taux de bonnes réponses (accuracy) », « exécutions » ; gras décoratif retiré (23, 253 paires, N = 100…, « peser », C(n, k), 210, « ton », « sans aucune hypothèse ») ; la puce « le complément se prend dans le même Ω » de n2 supprimée, elle doublait celle de n1 ;
  - readouts raccourcis : v7 « répartitions, 21 × 10 × 1 » → 210, figure 5 « théorie, case 5 » ;
  - règles transversales : légendes « premier panneau / second » (v1, v5) ; la note sur les lettres de Brunton passe du « où ça casse » de n5 à son encadré.
  - Aucune correction rejetée.
