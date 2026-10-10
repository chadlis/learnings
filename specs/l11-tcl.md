---
id: l11
series: lesson
part: "00"
number: "11"
slug: tcl
title: Théorème central limite
subtitle: socle — Brunton 36 : la forme de la moyenne, à quelle vitesse, et où ça casse
prereq: [l06, l10]
anki: [stats::tcl, stats::normale]
bridges: [b04]
next: l12
status: built
---

## Question de la leçon
La moyenne de n mesures a un centre μ et une largeur σ/√n (l10). Quelle forme a sa loi, à partir de quel n, sous quelles hypothèses, et comment en tire-t-on un intervalle de confiance ?

## Vidéos couvertes
36 The Central Limit Theorem. Énoncés repris : 01 (Overview, premier énoncé du TCL) et 44 (Proof of the Central Limit Theorem, énoncé avec Φ). La preuve elle-même est en l12.

## Prérequis
- l06 n3 : standardiser, Z = (X − μ)/σ : moyenne 0, écart-type 1, même forme que X (`lesson-00-06-fonctions-standardisation.html#n3`).
- l10 n3 : X̄ est une variable aléatoire, E[X̄] = μ, Var(X̄) = σ²/n sous indépendance (`#n3`) ; n4 : la loi des grands nombres, la somme s'écarte (`#n4`) ; n5 : l'erreur standard σ/√n (`#n5`) ; n6 : la moyenne de termes corrélés (`#n6`).
- l04 n6 : la normale N(0, 1), Φ, ±1,96 pour 95 % (`lesson-00-04-variables-binomiale-normale.html#n6`) ; n7 : approximation normale de la binomiale et correction de continuité (`#n7`).
- l08 n6, n7 : le dé (μ = 3,5, σ² = 35/12, σ = 1,708) ; l'asymétrie, moment centré réduit d'ordre 3 (culture).

## Notions

### n1 · L'énoncé exact : la moyenne standardisée tend vers N(0, 1) — OUTIL — Brunton 36
- Idée : la mesure répétée de Brunton (30 mesures de la vitesse de la lumière, toutes un peu différentes) ; la LGN dit où va la moyenne, le TCL dit quelle forme a sa loi. Dés : un dé, six barres plates ; deux dés, un triangle (3,5 avec probabilité 6/36) ; quatre dés, déjà une cloche : |X̄ − 3,5| ≤ 0,854 (un SE) dans 68,2 % des cas exactement, 68,3 % pour la normale. Mais la cloche s'écrase sur 3,5 : pour voir la forme il faut zoomer au rythme du resserrement, retirer μ et diviser par σ/√n.
- Formule : Zₙ = (X̄ₙ − μ)/(σ/√n) ; P(Zₙ ≤ z) → Φ(z) pour tout z. Hypothèses et rôle : indépendance (aléa neuf à chaque mesure ; Var(X̄) = σ²/n ; pas d'aléa commun qui survive à la moyenne) ; même loi (un seul μ, un seul σ ; affaiblissable en Lindeberg, aucun terme ne domine) ; σ² finie et non nulle (sans elle pas d'échelle σ/√n, Cauchy en n4) ; convergence en loi = de la fonction de répartition, pas de la densité ; usage à n fixé : X̄ₙ ≈ N(μ, σ²/n).
- Vignette v1 : l'expérience annoncée par Brunton (n dés, une moyenne, 1 000 fois), graine fixe ; deux axes empilés : brut (1 à 6, la cloche s'écrase) et zoomé (z, largeur 1, la forme rejoint N(0, 1)) ; curseur n ∈ {1, 2, 4, 10, 30, 100}, bouton « refaire » ; readouts SE, écart-type mesuré de x̄ et de z, part des z dans ±1.
- Figure 1 : fonction de répartition exacte de Zₙ (escalier) contre Φ, curseur n de 1 à 100, boutons dé / pièce ; écart maximal marqué. Dé : 0,143 (n = 1), 0,059 (4), 0,021 (30), 0,012 (100). Pièce : 0,341 (1), 0,072 (30), 0,040 (100), la moitié de la marche centrale P(S = 50) = 0,080.
- Exemples : n = 1, six valeurs de −1,46 à 1,46 ; quatre dés, 0,682 contre 0,683 et 0,946 contre 0,95 ; 30 mesures de la vitesse de la lumière, bruit d'écart-type 100 km/s (valeur d'illustration, la même qu'en l10) : SE 18,26 km/s, ±35,8 km/s à 95 % environ ; cent pièces : X̄ = proportion, Z = (X̄ − 0,5)/0,05, la normale de l04 n5 ; ML : perte d'un batch de 256 = moyenne de 256 pertes, écart-type σ/16, presque normale même si la perte d'un exemple est asymétrique.
- Preuve (culture) : E[Zₙ] = 0 et Var(Zₙ) = 1 pour tout n (l10 n3, l06 n3) : le zoom fixe centre et largeur, le TCL ne dit que la forme ; la preuve est en l12 n6.
- Code : 100 000 moyennes de n = 1, 4, 30 dés standardisées : moyenne 0, écart-type 1, P(Z ≤ 1) et P(|Z| ≤ 1,96) contre la normale ; la part de chaque face parmi les 3 millions de lancers reste 1/6.
- Où ça casse : « X̄ devient normale » (X̄ → μ ; N(μ, σ²/n) s'écrase) ; ce sont les moyennes, pas les données, qui deviennent normales ; convergence en loi, pas de densité (la moyenne de dés est discrète) ; le TCL ne dit pas à partir de quel n (n2).
- Brunton dit / c'est : (01) « la moyenne de variables de même loi devient normale » ; (36) « X̄ₙ est normale N(μ, σ²/n) », sans limite ; (44) « même fonction génératrice, donc même densité » pour annoncer la stratégie → indépendance, même loi, variance finie ; (X̄ₙ − μ)/(σ/√n) → N(0, 1) en loi, X̄ₙ → μ ; c'est la fonction de répartition qui converge (il le dit en 36 et dans sa conclusion de 44, et l'énoncé de 44 avec Φ est le bon).
- Ce qu'on garde : X₁, …, Xₙ indépendantes, de même loi, de variance σ² finie : (X̄ₙ − μ)/(σ/√n) converge en loi vers N(0, 1), et X̄ₙ ≈ N(μ, σ²/n) à n fixé. Ce sont les moyennes qui deviennent normales, pas les données.

### n2 · La vitesse : symétrie, asymétrie, événements rares — OUTIL — Brunton 36
- Idée : le TCL est une limite, il ne dit pas quand. L'expérience de Brunton faite sur trois lois à n = 30 : dés, cloche ; exponentielles, la cloche penche (asymétrie 2/√30 = 0,37) ; Bernoulli(0,02), un peigne, 54,5 % d'échantillons sans succès. Deux règles : l'asymétrie de la moyenne est celle d'une mesure divisée par √n ; pour une proportion, c'est np (et n(1 − p)) qui compte, pas n.
- Formule : asymétrie(X̄ₙ) = γ₁/√n ; exponentielle 2/√n ; Bernoulli(p) (1 − 2p)/√(np(1 − p)) ; règle pratique np ≥ 10 et n(1 − p) ≥ 10. Hypothèses : indépendance, moment d'ordre 3 fini. Culture : Berry-Esseen, sup |P(Zₙ ≤ z) − Φ(z)| ≤ C E|X − μ|³/(σ³√n), C < 0,48 ; pour une Bernoulli(p), E|X − p|³/σ³ = (p² + q²)/√(pq) ≈ 1/√p, d'où une borne ≈ 0,48/√(np).
- Vignette v2 : trois panneaux exacts standardisés (30 dés, 30 exponentielles, 30 Bernoulli(0,02)) contre N(0, 1) ; boutons n = 30, 100, 500 ; readouts asymétries 0 / 0,37 / 1,25 et P(aucun succès) 54,5 %.
- Figure 2 (existante, p00-04 figure 3, passée à la loi exacte) : densité exacte de la moyenne de n Exponentielle(1) (loi Gamma) contre N(1, 1/n), traits à μ ± 1,96 SE ; curseur n ∈ {1, 2, 5, 10, 30, 100} ; readouts asymétrie, queue droite et gauche. n = 10 : 3,9 % / 0,6 % ; n = 30 : 3,4 % / 1,4 % ; n = 100 : 3,0 % / 1,9 %.
- Figure 3 (existante, p00-04 figure 4, passée à la loi exacte) : loi exacte de la proportion observée p̂ pour p = 0,02, en dents fines (un peigne), contre la normale, axe de −0,04 à 0,125 ; curseur n ∈ {20, 100, 500, 5 000} ; readouts np, P(aucun succès), masse de la normale sous 0, asymétrie. n = 100 : np = 2, 13,3 %, 7,7 %, 0,69 ; n = 500 : np = 10, asymétrie 0,31.
- Exemples : dé (asymétrie nulle, n = 4 : 2,7 % de chaque côté de ±1,96) ; exponentielle (n = 30 et 100) ; Bernoulli(0,02) (n = 100 : 13 % sans succès, 7,7 % de normale sous 0) ; pièce équilibrée contre p = 0,1 à n = 30 (np = 3, asymétrie 0,49) ; ML : conversion à 2 % sur 10 000 visiteurs, 200 succès, le TCL tient.
- Preuve (culture) : E[(Σ Yᵢ)³] = Σ E[Yᵢ³] (termes croisés nuls par indépendance et E[Y] = 0), Var = nσ², d'où γ₁/√n ; diviser par n ne change pas un moment réduit.
- Code : 100 000 moyennes de n exponentielles (n = 30, 100) : asymétrie et queues ; Bernoulli(0,02) à n = 30, 100, 500 : part sans succès, asymétrie.
- Où ça casse : « n ≥ 30 » n'est pas un théorème ; np ≥ 10 porte sur les succès et sur les échecs (28/30 : deux échecs, n5) ; patrimoine log-normal (σ = 1,79, l08) : asymétrie 129, il faudrait ≈ 420 000 ménages pour ramener celle de la moyenne à 0,2 ; la distance maximale entre fonctions de répartition est un critère, les queues en sont un autre.
- Ce qu'on garde : pour que p̂ soit approximativement normale, et l'IC de Wald fiable, il faut np ≥ 10 et n(1 − p) ≥ 10 : le nombre de succès et d'échecs, pas n. (La règle γ₁/√n reste au résumé, point 3.)

### n3 · La version somme : Sₙ ≈ N(nμ, nσ²) — OUTIL — Brunton 36
- Idée : Brunton écrit le même théorème pour Sₙ = X₁ + … + Xₙ ; Sₙ = n X̄ₙ, donc même énoncé (l06 n2). 100 dés : centre 350, écart-type 17,08 ; P(S ≥ 380) ≈ 4,2 % par la normale avec correction de continuité (3,95 % sans), 4,20 % exact. La binomiale est une somme de Bernoulli. La largeur de la somme grandit en σ√n, celle de la moyenne rétrécit en σ/√n ; la somme ne converge vers rien, seule sa forme se stabilise.
- Formule : (Sₙ − nμ)/(σ√n) = (X̄ₙ − μ)/(σ/√n) → N(0, 1) ; Sₙ ≈ N(nμ, nσ²) à n fixé. Hypothèses : celles de n1 ; E[Sₙ] = nμ par linéarité, Var(Sₙ) = nσ² par indépendance ; correction de continuité pour une somme d'entiers (l04 n7) ; binomiale B(n, p) ≈ N(np, np(1 − p)).
- Vignette v3 : loi exacte de la somme de n dés (axe 0 à 420) au-dessus de celle de la moyenne (axe 1 à 6), crochets ±σ, normale superposée sur la somme ; curseur n de 1 à 100, bouton « de 1 à 100 » ; readouts E[Sₙ], σ(Sₙ), σ(X̄ₙ), largeur relative 0,488/√n.
- Exemples : deux dés (triangle) ; 100 dés (4,2 %) ; 400 pièces de Brunton 16 (0,840 sans correction, 0,852 avec, 0,852 exact) ; 100 spams à 4 par heure (25 h, 2,5 h ; P(S > 30 h) 2,3 % par la normale, 2,8 % exact) ; ML : erreurs sur 1 000 exemples à 12,8 %, N(128 ; 10,56²), P(≥ 150) 2,1 % contre 2,3 % exact.
- Preuve (culture) : diviser haut et bas par n ; E et Var de Sₙ.
- Code : somme de 100 Exponentielle(1) : queues à μ + kσ, exact (Gamma) contre normale, rapport 1,2 / 2,0 / 5,1 / 21 pour k = 2 à 5.
- Où ça casse : la somme ne converge pas, la cible bouge ; erreur relative dans les queues lointaines (100 exponentielles : ×2 à 3σ, ×21 à 5σ ; 100 dés, S ≥ 450 : 1,5 · 10⁻⁹ exact contre 2,8 · 10⁻⁹ avec correction, 2,4 · 10⁻⁹ sans) ; somme d'entiers sans correction de continuité.
- Brunton dit / c'est : (36) « Sₙ est normale N(nμ, nσ²) », (44, μ = 0) « N(0, nσ²) », comme des égalités → seule la somme standardisée converge ; Sₙ ≈ N(nμ, nσ²) est une approximation à n fixé. La correction de (35) « cette somme converge » est laissée à l10 n4.
- Ce qu'on garde : sous les hypothèses du TCL, Sₙ ≈ N(nμ, nσ²) à n fixé, puisque Sₙ = n X̄ₙ ; son écart-type σ√n grandit, et l'approximation vaut au centre, pas loin dans les queues.

### n4 · Où ça casse : dépendance, variance infinie, « n ≥ 30 » — OUTIL — Brunton 36
- Idée : Brunton : « peu importe la loi des Xᵢ », les hypothèses en une phrase (« identiques et indépendantes, avec une moyenne et une variance »). Variance infinie : la moyenne de n Cauchy a la loi d'une seule, P(|X̄ₙ| > 1) = ½ pour tout n. Dépendance : un dé recopié cent fois reste plat ; corrélation commune ρ = 0,05, la largeur plafonne à 0,382. « n ≥ 30 » : notion 2.
- Formule : indépendance → Var(X̄ₙ) = σ²[ρ + (1 − ρ)/n] → ρσ² (l10 n6) ; variance finie → sinon plus d'échelle σ/√n ni de limite normale (Pareto α = 1,5 : n^(−1/3)) ; moyenne finie → sinon, par exemple (Cauchy), X̄ₙ a la loi de X₁ ; n grand → γ₁/√n et np (n2). Culture : dépendance faible, TCL avec σ²(1 + 2 Σ ρₖ) ; lois différentes, Lindeberg ; Pareto 1 < α < 2, X̄ → μ mais fluctuations en n^(1/α − 1) (n^(−1/3) à α = 1,5) et limite stable non normale.
- Vignette v4 (le visuel du plan, « la moyenne de Cauchy qui ne se resserre pas ») : 2 000 moyennes simulées (graine fixe), centrées, sur un axe fixe de −4 à 4, en violet ; la référence i.i.d. en gris derrière, à la même échelle (son pic sort du cadre) ; valeurs hors de ±4 comptées à part ; boutons Cauchy / un dé recopié / corrélés ρ = 0,05 / i.i.d. ; curseur n ∈ {1, 10, 100, 1 000} ; readout « part à plus de 0,5 du centre » : Cauchy 70,5 %, copie 66,7 %, ρ = 0,05 ≈ 20 % à n = 1 000, i.i.d. 0 %.
- Exemples : copies (ρ = 1) ; ρ = 0,05, mesures d'écart-type 1,708 (plafond 0,382, l10 n6 ; à n = 10 000, l'IC « à 95 % » couvre 7 %) ; Cauchy (½ au-delà de ±1, 95 % dans ±12,7) ; Pareto α = 1,5 (moyenne 3 ; à n = 100, 70 % des moyennes sous 3, médiane 2,69, simulation) ; ML : A/B test analysé par événement au lieu de par utilisateur ; test set à quasi-doublons.
- Preuve (culture) : fonction caractéristique de Cauchy e^(−|t|) ; celle de X̄ₙ vaut e^(−|t|/n · n) = e^(−|t|) ; Cauchy n'a pas de fonction génératrice (l12), d'où la fonction caractéristique.
- Code : P(|moyenne − centre| > 1) pour Cauchy et dés à n = 1, 10, 100, 1 000 ; facteur commun ρ = 0,05 : écart-type simulé contre σ/√n et contre la formule.
- Où ça casse : un échantillon a toujours une variance finie (s² ne prouve rien) ; la dépendance ne se voit pas dans le centre ; bootstrap de lignes sous dépendance.
- Brunton dit / c'est : (36) « peu importe la loi des Xᵢ » → vrai de la forme limite sous indépendance et variance finie ; faux pour la vitesse.
- Ce qu'on garde : le TCL casse quand une hypothèse tombe : corrélation commune ρ > 0, l'écart-type de X̄ plafonne à σ√ρ ; variance infinie, plus d'échelle σ/√n ni de limite normale ; pas de moyenne (Cauchy), X̄ ne se resserre jamais.

### n5 · La brique de l'IC : X̄ ± 1,96 σ/√n — OUTIL — Brunton 36
- Idée : Brunton finit sur les usages (intervalles de confiance, tests, taille d'un sondage). P(−1,96 ≤ Zₙ ≤ 1,96) ≈ 0,95 ; isoler μ ; l'intervalle est aléatoire, μ fixe. Sondage de 1 000 électeurs, 52 % : SE 0,0158, [0,489 ; 0,551], 50 % dedans ; ±3 points demande 1 068 personnes.
- Formule : P(X̄ − 1,96 σ/√n ≤ μ ≤ X̄ + 1,96 σ/√n) ≈ 0,95 ; IC réalisé x̄ ± 1,96 σ/√n ; n = (1,96 σ/h)². Hypothèses : TCL applicable (n2, n4) ; σ inconnu remplacé par s, ou √(p̂(1 − p̂)) (Wald) ; Wilson défini dans la formule (on garde p dans le SE et on résout en p) ; à petit n et données normales, Student (2,262 à n = 10, p01-03) ; 1,645 (90 %), 2,576 (99 %).
- Vignette v5 : 25 sondages de 1 000 électeurs, vraie part 0,52 (graine fixe), intervalles de Wald ; ceux qui manquent 0,52 en rouge ; trait 0,5 ; bouton « 25 nouveaux sondages » ; readouts : contiennent 0,52, contiennent 0,5, demi-largeur.
- Figure 4 : couverture exacte de l'intervalle de Wald (puis Wilson) pour n = 30, 100, 1 000, en fonction de p puis de np. À p = 0,02 : 45 %, 87 %, 95 % ; en fonction de np les trois courbes se superposent ; au-dessus de np = 10, Wald oscille entre 91 et 96 % ; Wilson reste entre 92 et 98 % dès np ≥ 1.
- Exemples : dé suspect, 30 lancers, x̄ = 3,8 : [3,19 ; 4,41] ; sondage ; accuracy 872/1 000 : [0,851 ; 0,893] ; A/B 200/10 000 contre 240/10 000 : différence 0,4 point, SE 0,00207, z = 1,93, IC [−0,01 ; 0,81] point ; rappel 28/30 (n = 30 positifs).
- Preuve (culture) : inverser l'événement ligne à ligne ; Wilson = résoudre |p̂ − p| ≤ 1,96 √(p(1 − p)/n) en p, d'où un intervalle toujours dans [0, 1].
- Code : Wald et Wilson sur 28/30 ; couverture exacte en cinq cas (n, p).
- Où ça casse : « 95 % de chances que μ soit dedans » ; Wald casse par le nombre de succès ou d'échecs, pas par la prévalence (28/30 → [0,844 ; 1,023], Wilson [0,787 ; 0,982] ; 2 % sur 10 000 → aucun problème) ; le rappel a pour n le nombre de positifs (SE 0,0455, pas 0,0079) ; σ estimé à petit n ; dépendance : ρ = 0,05 et n = 1 000, vrai SE 0,385, l'IC annoncé à 95 % couvre 22 %.
- Ce qu'on garde : si le TCL s'applique, l'intervalle X̄ ± 1,96 σ/√n contient μ pour environ 95 % des échantillons : c'est l'intervalle qui est aléatoire, μ est fixe.

## Figures exigées
Vignettes « voir l'idée » (sous chaque idée) :
- v1 (n1) — `plot` ×2 : 1 000 moyennes de n dés (graine fixe) sur l'axe brut puis sur l'axe zoomé, normales superposées, sommes voisines regroupées en classes de largeur ≥ 0,25 en z dès n = 10 ; curseur n, bouton « refaire 1 000 expériences ».
- v2 (n2) — `plot` ×3 : lois exactes standardisées de la moyenne de 30 dés, 30 exponentielles, 30 Bernoulli(0,02), contre N(0, 1) ; boutons n = 30, 100, 500.
- v3 (n3) — `plot` ×2 : loi exacte de la somme et de la moyenne de n dés, crochets ±σ ; curseur n de 1 à 100 et lecture animée.
- v4 (n4) — `plot` : 2 000 moyennes simulées, quatre cas, référence i.i.d. en gris ; curseur n.
- v5 (n5) — `plot` : 25 intervalles de sondage, vraie part fixe ; bouton « 25 nouveaux sondages ».

Figures sous la formule :
- Figure 1 (n1) — `plot` : CDF exacte de Zₙ contre Φ, dé ou pièce, curseur n, écart maximal marqué.
- Figure 2 (n2) — `plot` : densité exacte de la moyenne de n exponentielles contre N(1, 1/n), curseur n, queues lues.
- Figure 3 (n2) — `plot` : loi exacte de p̂ pour p = 0,02 contre la normale, curseur n, masse sous 0 lue.
- Figure 4 (n5) — `plot` : couverture exacte de Wald et Wilson, axe p ou np, n = 30, 100, 1 000 ; readout min – max (Wald dès np ≥ 10 : 90,6 – 95,7 % ; Wilson dès np ≥ 1 : 91,7 – 98,0 %).

## Résumé
1. TCL : X₁, …, Xₙ indépendantes, de même loi, de variance finie ⇒ (X̄ₙ − μ)/(σ/√n) → N(0, 1) en loi.
2. X̄ₙ, elle, tend vers μ : X̄ₙ ≈ N(μ, σ²/n) est une approximation à n fixé ; ce sont les moyennes, pas les données, qui deviennent normales.
3. Vitesse : asymétrie de la moyenne γ₁/√n (exponentielle 2/√n) ; pour une proportion, np ≥ 10 et n(1 − p) ≥ 10.
4. Somme : Sₙ ≈ N(nμ, nσ²), même théorème ; largeur σ√n qui grandit ; fiable au centre, pas dans les queues lointaines.
5. Casse : dépendance (plafond σ√ρ) ; variance infinie (plus de limite normale ; sans moyenne, la Cauchy ne se resserre jamais) ; « n ≥ 30 » pris pour une règle.
6. IC : X̄ ± 1,96 σ/√n capture μ dans environ 95 % des échantillons ; l'intervalle est aléatoire, μ est fixe.
7. Wald casse par le nombre de succès ou d'échecs, pas par la prévalence : 28/30 → [0,844 ; 1,023] ; Wilson [0,787 ; 0,982].

Phrase d'entretien : « Si les observations sont indépendantes, de même loi et de variance finie, la moyenne standardisée, (X̄ − μ)/(σ/√n), converge en loi vers une normale standard, quelle que soit la loi de départ ; en pratique X̄ ≈ N(μ, σ²/n), d'où l'intervalle X̄ ± 1,96 σ/√n. La vitesse dépend de la loi : lente si elle est asymétrique, et pour une proportion il faut au moins dix succès et dix échecs. Le théorème casse avec la dépendance et les variances infinies. »

## Chaîne verbalisée
1. Énonce le TCL avec ses hypothèses. → X₁, …, Xₙ indépendantes, de même loi, de variance σ² finie : (X̄ₙ − μ)/(σ/√n) → N(0, 1) en loi.
2. Pourquoi ne pas dire « X̄ devient normale » ? → X̄ tend vers μ, une constante ; c'est la version standardisée qui a une loi limite ; X̄ ≈ N(μ, σ²/n) est une approximation à n fixé.
3. La moyenne de 30 exponentielles est-elle normale ? → Pas tout à fait : asymétrie 2/√30 = 0,37 ; 3,4 % au-delà de μ + 1,96 SE au lieu de 2,5 %.
4. Pourquoi la moyenne de n Cauchy ne se resserre-t-elle pas ? → Elle n'a pas de moyenne : la loi des grands nombres elle-même tombe, et X̄ₙ a la loi d'une seule Cauchy, pour tout n.
5. Loi approchée de la somme de 100 dés ? → N(350 ; 17,08²) ; P(S ≥ 380) ≈ 4,2 %.
6. 28 bons sur 30 positifs : pourquoi Wald échoue-t-il ? → Deux échecs seulement, n(1 − p̂) = 2 < 10 ; Wald [0,844 ; 1,023] sort de [0, 1] ; Wilson [0,787 ; 0,982].
7. Que qualifie le 95 % d'un IC ? → La procédure : la part des échantillons dont l'intervalle contient μ, environ 95 % quand le TCL s'applique ; μ est fixe, l'intervalle est aléatoire.

## Ce qui a cassé pour Salah
- 16/09 : « c'est la prévalence qui casse l'IC normal » corrigé en « le nombre de succès ou d'échecs ». Adressé par n2 (np ≥ 10 et n(1 − p) ≥ 10 ; figure 3), par le « où ça casse » de n5 (28/30 : Wald [0,844 ; 1,023], Wilson [0,787 ; 0,982], vérifiés par `check/k5_ic.py` ; à l'inverse 2 % sur 10 000 visiteurs) et surtout par la figure 4 : à prévalence égale (p = 0,02) la couverture de Wald vaut 45, 87 ou 95 % selon n ; en fonction de np, les trois courbes se superposent.
- Le rappel est une Bernoulli sur les positifs, avec n = nombre de positifs : n5 (exemple 5 et « où ça casse » : SE 0,0455 et non 0,0079).
- 18/09 : i.i.d. traité comme une seule hypothèse. La formule de n1 sépare les rôles (indépendance : aléa neuf, σ²/n ; même loi : un seul μ et un seul σ ; variance finie : l'échelle existe) ; n4 montre ce que casse chacune.
- 18/09 : la réalisation prise pour la variable. n5 : X̄ ± 1,96 σ/√n est un intervalle aléatoire, x̄ ± … sa réalisation, μ fixe ; vignette v5.

## Erreurs de Brunton couvertes
01 TCL « la moyenne de variables de même loi devient normale » → n1 · 36 « X̄ₙ est normale N(μ, σ²/n) » sans limite ni hypothèse explicite → n1 · 44 « même densité » en annonçant la stratégie → n1 (convergence de la fonction de répartition) · 36, 44 « la somme est normale N(nμ, nσ²) » (N(0, nσ²) en 44) → n3 ; la version de 35 est corrigée en l10 n4 · 36 « peu importe la loi des Xᵢ » → n4. Les trous de la preuve de 44 (fonction génératrice supposée finie, n·εₙ → 0, continuité contre unicité) sont pour l12.

## Exclusions
Pas de preuve du TCL (l12 n6), pas de fonction génératrice au-delà de son nom, pas de convergence presque sûre ni de loi forte, pas de Student au-delà du quantile cité (p01-03), pas de test d'hypothèse ni de p-value (p01-02), pas de Lindeberg ni de Berry-Esseen au-delà d'une ligne, pas de lois stables au-delà de leur nom, pas de Bessel.

## Questions pour la revue
- Tous les chiffres sont recalculés par les scripts de `WORK/l11/check/` (k1 dés exacts par convolution, k2 vitesses, k3 sommes, k4 cassures, k5 IC et couvertures exactes, k6 divers). Aucun chiffre de p00-04 n'a eu à être corrigé ; ceux qui y sont repris (0,382, facteur 22, 13 %, np ≥ 10) sont confirmés.
- Figures 2 et 3 : reprises de p00-04 (exponentielle moyennée, Bernoulli rare) mais calculées sur la loi exacte (Gamma, binomiale) plutôt que simulées : plus de bruit, et les chiffres de la légende se lisent tels quels. La simulation reste dans la vignette v1, qui est l'expérience annoncée par Brunton.
- Pas de figure sous la formule en n3 et n4 (le plan n'en demande pas). La figure « largeur contre n en log » envisagée pour n4 doublerait la vignette v6 de l10 (plancher ρσ²) ; la vignette v4 montre à la place la moyenne de Cauchy qui ne se resserre pas, comme le plan le demande, distincte de la moyenne courante de Cauchy de l10 v4.
- Critère de vitesse : la distance maximale entre fonctions de répartition ne classe pas le dé devant l'exponentielle (0,021 contre 0,024 à n = 30), parce que la moyenne de dés est discrète. La leçon mesure donc la vitesse par l'asymétrie et par les queues à ±1,96, et le dit dans le « où ça casse » de n2.
- Berry-Esseen cité avec C < 0,48 (Shevtsova, 2011 : 0,4748 dans le cas i.i.d.) ; à relire si une constante plus récente est connue.
- Chiffre d'illustration non mesuré : le bruit de 100 km/s par mesure de la vitesse de la lumière (repris de l10 pour la cohérence).
- Longueur des idées : 154 à 173 mots (n1 la plus longue), sous la tolérance de 180 du validateur, au-dessus de la cible de 140 : chacune garde l'exemple chiffré avant la formule.
- Liens : les prérequis et renvois pointent vers les fichiers de leçon avec ancre (`lesson-00-NN-….html#nK`), comme le demande le brief, et non vers `map.html#lNN` comme l'étalon l08.
- Chiffres de simulation (et non exacts) dans le texte : Pareto d'indice 1,5 à n = 100 (70 % sous 3, médiane 2,69 ; 40 000 répétitions, `check/k6_misc.py`). Les readouts des vignettes v1, v4 et v5 sont simulés à graine fixe ; leurs légendes ne citent que les valeurs théoriques.
- Relecture en contexte frais (10/10/2026), appliquée, chaque chiffre revérifié (`check/k7_review.py`) :
  - n4 : garde, ligne « variance finie » de la formule et maillon 4 réécrits : c'est l'absence de moyenne qui bloque la Cauchy ; une variance infinie seule (Pareto 1,5) ralentit en n^(−1/3) et casse la limite normale. Garde ramenée à une idée de 36 mots au lieu de la version longue proposée.
  - n1 : « P(X̄ₙ = 3,5) > 0 » faux pour n impair, remplacé par P(X̄₂ = 3,5) = 6/36 et « chaque valeur s/n a une probabilité > 0 ».
  - n1, preuve : « moins » et « plus » remis dans le bon sens (σ/n^0,4 > σ/√n).
  - n1, Brunton rectifié : « même densité » est l'annonce de la stratégie en 44, pas sa conclusion ; (36) nuancé, égalité écrite sans dire ce qui converge.
  - v1 : sommes voisines regroupées en classes (≥ 0,25 en z) dès n = 10, plus de dents de scie ; légende : n = 100 refait 50 fois chez Brunton, 1 000 fois ici.
  - n5 : puce Wilson ajoutée à la formule.
  - n2 : garde ramenée à la règle np ≥ 10 et n(1 − p) ≥ 10 ; la règle γ₁/√n reste au résumé (point 3) plutôt qu'en seconde garde, pour garder une seule carte par notion.
  - n3 : P(S ≥ 380) ≈ 4,2 % précisé « avec la correction de continuité » (3,95 % sans) ; 2,8 × 10⁻⁹ avec correction, 2,4 × 10⁻⁹ sans ; Brunton rectifié réduit à 36 et 44 (μ = 0, N(0, nσ²)), la correction de 35 laissée à l10 n4 ; P(N ≥ 379,5) devenu P(Y ≥ 379,5), Y ~ N(350 ; 17,08²).
  - n5 : vrai SE 0,385 (0,38549), pas 0,386 ; « environ 95 % » dans l'idée, la garde, le résumé et la chaîne (Wald couvre 94,7 % pour le sondage).
  - n1 : 1,96 × 18,26 = 35,8.
  - n4 et n5 : « mesures d'écart-type σ = 1,708, celui d'un dé ».
  - n4, exemple 2 : lien vers l10 n6 et conséquence nouvelle, l'IC « à 95 % » ne couvre μ que 7,0 % du temps à n = 10 000.
  - n2 : « cloche parfaite » devenu « colle à la normale ».
  - Sous-titre et idée de n1 : la largeur vient de Var(X̄) = σ²/n, pas de la LGN.
  - Visuels : figure 4 sans étiquette d'axe y (légende déplacée), readout min – max ajouté ; preuve de n2 coupée en trois lignes ; lignes de c1, c2, c3, c4, c5 ramenées sous 88 caractères ; espaces insécables dans les libellés de readouts.
  - Figure 1 : « la fonction de répartition exacte de Zₙ ».
  - Règles transversales : « jeu de test (test set) » au premier usage puis « jeu de test » ; « taux de bonnes réponses (accuracy) » au premier usage ; gras décoratif retiré des idées de n2 à n5 ; aucune garde au-delà de 40 mots.
  - Aucune correction rejetée.

