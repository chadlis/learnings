---
id: l05
series: lesson
part: "00"
number: "05"
slug: poisson-exponentielle-attentes
title: Événements rares et temps d'attente
subtitle: socle — Brunton 17 à 22 : Poisson par la limite, géométrique, exponentielle sans mémoire, processus de Poisson
prereq: [l04]
anki: [stats::poisson, stats::exponentielle, stats::geometrique, stats::lois]
bridges: []
next: l06
status: built
---

## Question de la leçon
Quand un événement rare a beaucoup d'occasions de se produire, comment compter ses occurrences, et combien de temps attendre la prochaine ?

## Vidéos couvertes
17 The Poisson Distribution: the Rare-Event Limit of a Binomial Distribution · 18 The Geometric Distribution: the First Success of a Bernoulli Sequence · 19 The Exponential Distribution: Time Between Poisson Events · 20 The Hazard Rate and Memoryless Property of the Exponential Distribution · 21 The Connection Between the Exponential Distribution and the Poisson Process · 22 The Gamma Distribution.

## Prérequis
- l04#n1 : variable aléatoire, réalisation, paramètre fixe (d'où P(X = k ; λ)).
- l04#n2 : loi discrète, densité, CDF ; une probabilité continue est une aire, pas une hauteur.
- l04#n4 : binomiale, somme de n Bernoulli(p) indépendantes, E = np, Var = np(1 − p).
- l04#n5 : la normale comme limite de la binomiale, et son échec quand p est petit (fin de Brunton 15).
- Rappels de l03 : P(A ∣ B) = P(A ∩ B)/P(B) (l03#n1) ; indépendance ⇒ produit (l03#n7).

## Notions

### n1 · Poisson, la limite des événements rares — OUTIL — Brunton 17
- Idée : 1 000 essais à 1/1 000 : la normale N(1 ; 0,999) met 15,9 % de sa masse sous 0 (« 16 % » de Brunton, juste). Garder λ = np fixé, n → ∞, p = λ/n → 0 : la binomiale devient Poisson(λ). Néons : 10 000 lampes, p = 0,002, λ = 20.
- Formule : P(X = k ; λ) = λᵏ e^(−λ)/k!, k = 0, 1, 2, … ; E = Var = λ. Hypothèses : p petit à np fixé (pas λ petit) ; occasions indépendantes de même p ; λ paramètre fixe (point-virgule) ; E = Var est un test nécessaire, pas suffisant.
- Exemples : λ = 1 : P(0) = P(1) = 0,368, P(2) = 0,184, P(3) = 0,061 ; Binomiale(1 000 ; 0,001) : 0,368 ; 0,368 ; 0,184 ; 0,061. Néons : P(20) = 0,0888 (binomiale 0,0889), P(10) = 0,0058, P(5) = 5,5 × 10⁻⁵. Fil rouge spams λ = 4 : P(0) = 0,018, P(4) = 0,195, P(≥ 7) = 0,111 ; Binomiale(1 000 ; 0,004) : P(4) = 0,196. ML : bootstrap, une ligne tirée Binomiale(n, 1/n) ≈ Poisson(1) fois : absente 0,368 (n = 1 000 : 0,3677), deux fois ou plus 0,264.
- Preuve : la réécriture exacte de Brunton, puis les trois limites justifiées (produit de k facteurs → 1 ; (1 − λ/n)^(−k) → 1 ; n ln(1 − λ/n) → −λ). Somme = 1 par la série de e^λ. E[X] = λ et E[X(X − 1)] = λ² par la série, donc Var = λ.
- Code : 100 000 journées de néons Binomiale(10 000 ; 0,002) : moyenne et variance ≈ 20 ; P(X = k) binomiale, Poisson, simulée ; écart max à Poisson(4) quand n grandit.
- Où ça casse : rafales ⇒ surdispersion (moyenne 4, variance 9 : rapport 2,25, pas Poisson ; binomiale négative nommée) ; p pas petit : Binomiale(10 ; 0,4), variance 2,4 contre 4, et Poisson donne P(X > 10) = 0,003 à un compte borné par 10 ; la normale échoue à λ petit, pas à λ = 20 (densité 0,0893 contre 0,0888).
- Brunton dit / c'est : (17) les néons comme cas de « np pas trop grand » → λ = 20 n'est pas petit ; ce qui justifie Poisson est p petit à np fixé. Il n'énonce pas E = Var = λ.
- Ce qu'on garde : occasions nombreuses, indépendantes et rares : Poisson(λ), limite de Binomiale(n, λ/n), P(X = k ; λ) = λᵏe^(−λ)/k!, E = Var = λ. Une variance nettement différente de la moyenne exclut la Poisson ; l'égalité ne la prouve pas.

### n2 · La géométrique : le rang du premier succès — OUTIL — Brunton 18
- Idée : lancer un dé jusqu'au premier 5 ; premier succès exactement au n-ième : n − 1 échecs puis un succès, produit par indépendance ; au 10e exactement 0,032 ; au moins 10 lancers ⇔ les 9 premiers ratent : (5/6)⁹ = 0,194, alors que la moyenne est 6.
- Formule : P(X = k ; p) = q^(k−1) p ; P(X ≥ k) = q^(k−1) ; E[X] = 1/p (Var = q/p², culture). Hypothèses : indépendance (le produit) ; même p ; X compte les essais, succès compris (support 1, 2, …).
- Exemples : pièce : P(X = 3) = 1/8, P(X ≥ 3) = 1/4 ; dé : 0,167 ; 0,139 ; 0,032 ; 0,194 ; moyenne 6, médiane 4 (P(X ≤ 4) = 0,518, P(X ≤ 3) = 0,421) ; ML pass@k : p = 0,2, pass@5 = 1 − 0,8⁵ = 0,672, pass@10 = 0,893.
- Preuve : produit ; queue par la série géométrique ; queue par équivalence ; E = Σ P(X ≥ k) = 1/p (l08#n11).
- Code : 200 000 joueurs (rng.geometric, support 1) ; P(X = 10), P(X ≥ 10), moyenne, médiane ; après 20 échecs, P(encore ≥ 10) = 0,194 ; pass@k.
- Où ça casse : « au moins » contre « exactement » ; la convention « échecs avant le succès » (support 0, moyenne q/p = 5) ; le 5 n'est pas « dû » (sans mémoire discrète) ; pass@k avec p qui varie : moitié à 0,4, moitié à 0 : 0,461 et non 0,672.
- Ce qu'on garde : Géométrique(p), rang du premier succès dans des essais indépendants de même p : P(X = k) = q^(k−1) p, P(X ≥ k) = q^(k−1), E[X] = 1/p.

### n3 · L'exponentielle : attendre un événement rare — OUTIL — Brunton 19
- Idée : ampoules, atomes, DMV ; densité λe^(−λt) qui part de λ ; ampoule de moyenne 100 h : P(T ≥ 50) = e^(−1/2) = 0,607 ; polonium 210, demi-vie 138 j : médiane, pas moyenne (199 j).
- Formule : f(t) = λe^(−λt), t ≥ 0 ; F = 1 − e^(−λt) ; S = e^(−λt) ; P(a < T < b) = e^(−λa) − e^(−λb) ; E[T] = 1/λ ; médiane = demi-vie = ln 2/λ. Hypothèses : λ taux fixe, unité ; T ≥ 0 ; f densité, pas probabilité ; σ = 1/λ et intégrales en l08#n8.
- Exemples : spams 4/h : 15 min ; P(T > 15 min) = 0,368 ; P(T > 30 min) = 0,135 ; P(15 < T < 30) = 0,233 ; médiane 10,4 min ; 63 % des attentes sous la moyenne. Ampoule : 0,607 ; P(50 < T < 100) = 0,239 ; médiane 69,3 h. Polonium : λ = 0,00502 par jour ; P(T > 365 j) = 0,160 ; 99 % disparus à 917 j (2,5 ans) ; vie moyenne 199 j.
- Preuve : F par intégration ; total 1 ; S par complément ; intervalle ; médiane ; moyenne par l'intuition (λH événements sur H) et par E = ∫ S (version continue de l08#n11, admise), renvoi à l08#n8 pour les parties.
- Code : 1 000 000 d'atomes de polonium, λ = ln 2/138, survie à 138, 365, 917 j ; ampoule P(T ≥ 50 h).
- Où ça casse : densité ≠ probabilité (f(0) = λ = 4 par heure) ; demi-vie ≠ vie moyenne ; unités et scale de numpy ; taux constant supposé (les ampoules de cuisine, n5).
- Brunton dit / c'est : (19) e^(−1/2) ≈ 70 % → 0,607 (√e = 1,649) ; P(a < T < b) = e^(−a) − e^(−b) → e^(−λa) − e^(−λb) ; sans λ, l'ampoule donnerait 2 × 10⁻²² au lieu de 0,239 ; « la probabilité de T au temps t » → une densité.
- Ce qu'on garde : Exponentielle(λ) : P(T > t) = e^(−λt), E[T] = 1/λ, médiane = demi-vie = ln 2/λ ; une probabilité est une aire sous λe^(−λt).

### n4 · L'absence de mémoire — OUTIL — Brunton 19, 20
- Idée : l'ampoule de 1 000 h qui a déjà tenu 1 000 h : encore 1 000 h en moyenne ; « on compte les secondes » faux pour l'exponentielle ; spams : P(T > 45 ∣ T > 15) = e^(−2) = 0,135 = P(T > 30).
- Formule : P(T > s + t ∣ T > s) = P(T > t). Hypothèses : barre = conditionnement sur un événement ; seule loi continue sur [0, ∞[ (géométrique en discret) ; E[T − s ∣ T > s] = 1/λ.
- Exemples : ampoule : 36,8 % passent 1 000 h, 13,5 % passent 2 000 h, toujours 1 000 h à vivre ; spams ; dé après 20 échecs : 0,194 ; contre-exemple usure N(1 000 ; 200²) : à 1 000 h, 50 % survivent, 160 h à vivre (à 500 h : 504 h ; à 1 500 h : 65 h).
- Preuve : définition, inclusion, rapport des survies ; réciproque S(s + t) = S(s)S(t) ⇒ S = e^(−λt) (culture) ; vie restante moyenne.
- Code : 400 000 ampoules exponentielles contre usure normale ; proportion vivante et vie restante à s = 0, 500, 1 000, 1 500 h.
- Où ça casse : seule l'exponentielle (usure, jeunesse) ; la condition compte (sans elle e^(−3) = 0,050) ; paradoxe du bus (moyenne 10 min entre bus : attente 10 min, intervalle attrapé 20 min, simulé 9,93 et 19,9) ; σ = moyenne n'est pas la cause (l08#n8).
- Brunton dit / c'est : (20) « la probabilité de panne change avec le temps » → pour l'exponentielle elle ne change pas, c'est l'absence de mémoire.
- Ce qu'on garde : une durée exponentielle est sans mémoire : P(T > s + t ∣ T > s) = P(T > t), donc après s sans événement il reste encore 1/λ en moyenne. C'est la seule loi continue qui le fait.

### n5 · Le taux de risque — CULTURE — Brunton 20
- Idée : sachant vivante en t, panne dans dt avec probabilité λ dt ; λ = taux de risque ; λ = 1/1 000 par heure : une chance sur mille dans l'heure, à tout âge ; ampoules de cuisine (jeunesse), usure, baignoire.
- Formule : h(t) = f(t)/S(t) ; P(t < T ≤ t + dt ∣ T > t) ≈ h(t) dt ; exponentielle h = λ ; S(t) = exp(−∫₀ᵗ h).
- Exemples : λ = 1/1 000 par heure : 1 − e^(−0,001) = 0,0009995 dans l'heure ; λ dt = 1,7 × 10⁻⁵ dans la minute ; Weibull (k < 1, = 1, > 1) ; normale 1 000 ± 200 h : h(1 000 h) = 0,0040 par heure.
- Preuve : rapport des survies, premier ordre ; Taylor de Brunton ; réciproque S′ = −λS (devoir de Brunton) ; risques concurrents : min indépendants ⇒ taux qui s'additionnent.
- Où ça casse : h n'est pas une probabilité (il dépasse 1, infini en 0 pour la jeunesse) ; vérifier un taux constant par tranches d'âge.
- Brunton dit / c'est : (20) « λ dt est le taux de risque » → le taux est λ, λ dt est la probabilité de panne dans [t, t + dt] sachant la survie ; chiffré : 0,001 pour dt = 1 h, 1,7 × 10⁻⁵ pour 1 min, taux inchangé. Baignoire et h = f/S hors Brunton.
- Ce qu'on garde (pas de carte) : h(t) = f(t)/S(t), un risque par unité de temps sachant la survie ; taux constant ⇔ exponentielle ⇔ sans mémoire ; baignoire.

### n6 · Le processus de Poisson : compter et attendre — OUTIL — Brunton 21
- Idée : frise de mails à 5 par minute, croix, attentes W₁, W₂, W₃ ; attente Exponentielle(5/min), 12 s ; compte dans t : Poisson(5t) ; aucun mail pendant t = première attente > t.
- Formule : attentes i.i.d. Exponentielle(λ) ⟺ dans toute fenêtre de durée t, N(t) ~ Poisson(λt), et comptes de fenêtres disjointes indépendants ; P(N(t) = k) = (λt)ᵏ e^(−λt)/k! ; P(T₁ > t) = P(N(t) = 0) = e^(−λt). Hypothèses : indépendance ; taux constant (même loi) ; λ a une unité, λt n'en a pas (le λ de n1 est un nombre moyen).
- Exemples : 5/min : P(0 en 1 min) = 0,0067, P(1) = 0,034, rapport 5 ; en 6 s : 0,607 et 0,303, rapport 0,5 ; 20 min sans mail : e^(−100) = 3,7 × 10⁻⁴⁴. Fil rouge : en 30 min, Poisson(2), P(0) = 0,135 = P(T > 30 min). ML API LLM, λ = 20/s : écart moyen 50 ms, 18 % sous 10 ms ; fenêtre de 100 ms : Poisson(2), vide 13,5 %, ≥ 5 : 5,3 % ; par seconde : Poisson(20), capacité 31/s suffit 99,2 % des secondes, capacité 20/s débordée 44 % des secondes. Table : combien dans t / attente du prochain / du r-ième / essai du premier succès.
- Preuve : {T₁ > t} = {N(t) = 0} ; tranches t/n, Binomiale(n, λt/n) → Poisson(λt) (n1) ; l'horloge repart (n4).
- Code : 500 000 attentes exponentielles à 5/min, comptes par fenêtres de 0,1 et 1 min : moyenne = variance = λt, P(N = 0), P(N = 1).
- Où ça casse : taux qui varie (lundi 9 h) et rafales ⇒ surdispersion ; retries dépendants ; λᵏ au lieu de (λt)ᵏ ; compter n'est pas une file d'attente.
- Brunton dit / c'est : (21) P(1 mail en t) = 5e^(−5t), « cinq fois plus probable » → 5t e^(−5t), rapport 5t (5 pour 1 min, 0,5 pour 6 s) ; sa formule dépasse 1 pour t < 0,32 min ; formule dite λᵏ e^(−λt)/k! → (λt)ᵏ ; « un très grand nombre » pour 20 min → l'exposant, la probabilité est 3,7 × 10⁻⁴⁴.
- Ce qu'on garde : processus de Poisson de taux λ : attentes i.i.d. Exponentielle(λ), compte Poisson(λt) dans une fenêtre de durée t, car « aucun événement pendant t » = « attente > t », de probabilité e^(−λt).

### n7 · La loi Gamma : attendre le r-ième ; série contre parallèle — CULTURE — Brunton 22
- Idée : le 10e mail n'est pas « 10 fois l'exponentielle » : somme de 10 attentes, Gamma(10, 5), moyenne 2 min, écart-type 0,63 contre 2 ; DMV : trois guichets en série 45 min, en parallèle (premier libre) 5 min.
- Formule : T_r = W₁ + … + W_r ~ Gamma(r, λ), f(t) = λʳ t^(r−1) e^(−λt)/(r − 1)!, E = r/λ, Var = r/λ², P(T_r > t) = Σ_{k<r} e^(−λt)(λt)ᵏ/k! ; min de r ~ Exponentielle(rλ). Hypothèses : indépendance (variances, produit des survies) ; même loi ; r entier (Erlang), Γ(r) sinon ; r = 1 exponentielle ; scipy a = r, scale = 1/λ.
- Exemples : 10e mail : P(T₁₀ > 3 min) = 0,070 contre 0,223 pour 10 W ; DMV série : 45 min, σ = 26 min, P(T₃ > 45) = P(Poisson(3) ≤ 2) = 0,423 ; parallèle : 5 min, P(min > 15) = 0,050 ; ML batching r = 8 à 20/s : 0,4 s, P(plein en 0,5 s) = P(Poisson(10) ≥ 8) = 0,780 ; guirlande : première panne de 3 ampoules de 1 000 h, moyenne 333 h.
- Preuve : {T_r > t} = {N(t) ≤ r − 1} ; survie ; dérivée télescopique ; E et Var par linéarité et additivité ; min par produit des survies.
- Code : 400 000 clients du DMV, série (somme) et parallèle (min) ; P(série > 45) contre Poisson et gamma.sf ; somme de 10 attentes contre 10 fois une.
- Où ça casse : « série » change de sens (guichets en série = somme, guirlande en série = min, guirlande en parallèle = max, moyenne 1 833 h) ; r·W n'est pas la somme ; l'attente en parallèle ne compte pas son propre passage (5 + 15 = 20 min).
- Brunton dit / c'est : (22) trois guichets en parallèle = Gamma(3, 1/15) → minimum, Exponentielle(3/15), 5 min ; Gamma(3, 1/15), 45 min, vaut en série ; la somme Σ e^(−λt)(λt)ᵏ/k! appelée « fonction de répartition » → fonction de survie.
- Ce qu'on garde (pas de carte) : attendre le r-ième événement d'un flux de taux λ : Gamma(r, λ), moyenne r/λ, variance r/λ² ; attendre le premier de r flux parallèles : Exponentielle(rλ).

## Figures exigées
Sous la formule (numérotées dans l'ordre de la page) :
- Figure 1 (n1) — `plot` + `slider` λ ∈ [0,5 ; 15] et n ∈ [20 ; 2 000] : Binomiale(n, λ/n) en barres, Poisson(λ) en points reliés ; readout écart max (vert sous 0,01) ; à λ = 15 et n = 20, p = 0,75 n'est plus petit et la binomiale (variance 3,75) est bien plus étroite que la Poisson (variance 15). Portée de p00-01 figure 2 (garde-fou p > 1 conservé dans le code, inatteignable avec n ≥ 20).
- Figure 2 (n2) — `plot` + boutons p = ½, ⅓, 1/6 et `slider` seuil k ∈ [1 ; 20] : barres de la loi géométrique, violettes avant le seuil, bleues pour la queue X ≥ k ; readouts P(X = k), P(X ≥ k) = q^(k−1), E = 1/p.
- Figure 3 (n3) — `plot` + `slider` λ (par heure), a et b (minutes) : densité exponentielle, aire P(a < T < b) ; moyenne, médiane ; readouts P(T > a), P(a < T < b). Portée de p00-01 figure 3 (sans le bouton).
- Figure 4 (n4) — `plot` + `slider` λ et t + bouton « déjà attendu 15 min » : densité, aire P(T > t), densité conditionnelle sachant T > 15, copie décalée, avec l'aire au-delà de 15 + t ombrée en rouge, égale à l'aire violette ; readout P(T > 15 + t ∣ T > 15) = P(T > t). Portée de p00-01 figure 3.
- Figure 5 (n6) — `plot` + `slider` t : P(N(t) = 0) en bleu, P(N(t) = 1) en rouge, P(N(t) = 2) en violet, à 5 mails par minute, et la formule de Brunton 5e^(−5t) en pointillé, qui dépasse 1 ; readouts dont le rapport 5t.
- Figure 6 (n7) — `plot` + `slider` r ∈ [1 ; 10] : densité de Gamma(r, 5) contre celle de r × W ; readouts moyennes égales, écarts-types √r/λ contre r/λ, P(T > 3 min).

Vignettes « voir l'idée » (une par notion) :
- v1 — boutons « 1 000 essais, p = 1/1 000 » / « néons » : binomiale exacte, Poisson, normale de même moyenne et variance avec sa masse sous 0 en rouge (15,9 % contre 0,0004 %).
- v2 — vingt joueurs qui lancent jusqu'au premier 5, une ligne par joueur ; bande des 9 premiers lancers ; cumul des joueurs, part ≥ 10 (théorie 19,4 %), rang moyen (6).
- v3 — 400 ampoules ou 400 atomes de polonium, curseur du temps, survie simulée contre e^(−λt) (60,7 % à 50 h ; 50 % à 138 j, 16 % à 365 j, 1 % à 917 j).
- v4 — 2 000 ampoules : vie restante des survivantes après s heures, exponentielle contre usure normale ; 1 000 h contre 160 h à s = 1 000.
- v5 — courbe en baignoire (jeunesse Weibull 0,5, hasard 0,5 pour 1 000 h, usure Weibull 5) contre taux constant ; curseur âge ; panne dans les 100 h : 31 % neuve, 9,5 % vers 1 200 h, 23 % à 3 000 h, 9,5 % à tout âge pour le taux constant.
- v6 — frise d'une heure de mails à 5 par minute (4 premières minutes dessinées, fenêtres et comptes, W₁ W₂ W₃), histogramme des attentes contre l'exponentielle, histogramme des comptes par fenêtre contre Poisson(5t) ; curseur de fenêtre.
- v7 — DMV : un client, trois guichets en série (escalier) ou en parallèle (trois barres, la première qui finit) ; 200 clients en histogramme ; 45 contre 5 min.

## Résumé
1. Poisson(λ) : limite de Binomiale(n, λ/n), beaucoup d'occasions indépendantes et rares ; P(X = k ; λ) = λᵏ e^(−λ)/k!, E = Var = λ.
2. Ce qui justifie Poisson est p petit à np fixé, pas λ petit.
3. Géométrique(p) : rang du premier succès ; P(X ≥ k) = q^(k − 1), E = 1/p.
4. Exponentielle(λ) : P(T > t) = e^(−λt), E = 1/λ, médiane = demi-vie = ln 2/λ ; une probabilité est une aire.
5. Sans mémoire : P(T > s + t ∣ T > s) = P(T > t) ; taux de risque constant λ, et λ dt est une probabilité.
6. Processus de Poisson : attentes i.i.d. Exponentielle(λ), comptes Poisson(λt) ; aucun événement pendant t = attente > t.
7. Somme de r attentes : Gamma(r, λ), moyenne r/λ ; premier de r flux parallèles : Exponentielle(rλ).

Phrase d'entretien : « Un comptage d'événements rares mais nombreux en occasions est Poisson, limite de la binomiale à p petit et np fixé, avec une variance égale à la moyenne. Dans un processus de Poisson de taux λ, l'attente du prochain événement est exponentielle, de moyenne 1/λ et sans mémoire, le nombre d'événements dans une fenêtre t est Poisson(λt), et l'attente du r-ième est une Gamma. Si les comptes ont une variance nettement plus grande que leur moyenne, les arrivées ne sont pas indépendantes ou leur taux varie, et le modèle tombe. »

## Chaîne verbalisée
1. Mille essais à une chance sur mille : pourquoi pas la normale, et quelle loi ? → La normale mettrait 16 % de la masse sous 0 ; Poisson(1), limite de Binomiale(n, λ/n), E = Var = 1.
2. 10 000 néons à 0,002 : λ = 20 est-il petit, et qu'est-ce qui justifie Poisson ? → Non ; p petit à np fixé.
3. Probabilité qu'il faille au moins 10 lancers pour un 5 ? → Les 9 premiers ratent : (5/6)⁹ = 0,194.
4. Ampoule de moyenne 100 h : P(T ≥ 50 h) et médiane ? → e^(−1/2) = 0,607 ; 100 ln 2 = 69,3 h.
5. Une ampoule de moyenne 1 000 h a déjà tenu 1 000 h : combien lui reste-t-il ? → 1 000 h en moyenne : P(T > s + t ∣ T > s) = e^(−λt).
6. Mails à 5 par minute : P(0 mail en t) et P(1 mail en t) ? → e^(−5t) = P(attente > t) ; 5t e^(−5t), rapport 5t.
7. Trois guichets de 15 min : en série, en parallèle ? → Somme, Gamma(3, 1/15), 45 min ; minimum, Exponentielle(3/15), 5 min.

## Ce qui a cassé pour Salah
- Diagnostic S1 et t01 : « Poisson compte, l'exponentielle chronomètre » et « E = Var = λ comme test » installés sans le mécanisme. Repris en n1 (la limite, prouvée) et n6 (la frise, les deux lectures du même processus).
- 15/09 : densité intégrée au lieu d'évaluée (et inversement). Adressé dans le « où ça casse » de n3 (f(0) = λ = 4 par heure n'est pas une probabilité ; une probabilité est une aire, figure 3) et n5 (h dépasse 1).
- Barre bayésienne p(x | θ) : la leçon écrit P(X = k ; λ) et P(X = k ; p), le dit en n1, et réserve la barre au conditionnement sur un événement (n4).
- Réalisation prise pour la variable : n1 (k réalisation, λ paramètre fixe).
- i.i.d. traité comme une seule hypothèse (18/09) : n6 et n7 séparent les deux rôles (indépendance : produit des survies, additivité des variances ; même loi : un taux constant, chaque terme vaut 1/λ et 1/λ²).
- L'indépendance ⇒ produit (fil B) : n2 (q^(k−1)p) et n7 (survie du minimum).

## Erreurs de Brunton couvertes
17 néons présentés comme « np pas trop grand » → n1 · 19 e^(−1/2) ≈ 70 % et P(a < T < b) sans λ → n3 · 19 « probabilité de T au temps t » pour une densité → n3 · 20 « la probabilité de panne change avec le temps » → n4 · 20 λ dt « taux de risque » → n5 · 21 5e^(−5t) et « cinq fois plus probable », λᵏ au lieu de (λt)ᵏ, « très grand nombre » → n6 · 22 parallèle = Gamma(3, 1/15), somme appelée fonction de répartition → n7.

## Exclusions
Pas de binomiale négative au-delà du nom, pas de file d'attente (M/M/1, loi de Little), pas de processus de Poisson non homogène au-delà de la remarque, pas de fonction génératrice (l12), pas d'intégration par parties pour E[T] et Var(T) (l08#n8), pas de Γ(r) pour r réel au-delà du nom, pas de théorème de Palm-Khintchine.

## Questions pour la revue
- Chiffres vérifiés par script (`WORK/l05/check/n1.py` … `n7.py`, `vis.py`) : tous ceux du plan et du digest sont exacts. Écarts au digest : aucun. Écart au plan : aucun sur les chiffres ; la table d'errata ne liste rien pour la vidéo 18, n2 n'a donc pas d'encadré « Brunton, rectifié ».
- Ajouts hors Brunton, signalés comme tels : la fonction h = f/S et la courbe en baignoire (n5), le paradoxe du bus (n4), l'unicité de l'exponentielle sans mémoire (n4, culture), la survie du minimum et le sens de « série » pour une guirlande (n7), les exemples ML (bootstrap, pass@k, API de LLM, batching).
- La moyenne 1/λ de l'exponentielle est donnée par l'intuition et par E = ∫ P(T > t) dt, version continue de l08#n11, admise ; l'intégration par parties reste en l08#n8.
- Le dimensionnement d'API en n6 est un raisonnement de comptage (capacité par seconde), pas une file d'attente : la limite est dite dans « où ça casse ».
- Graines des vignettes choisies (script `check/seeds.js`, même générateur que la page) pour que l'état initial soit représentatif : v2 4 joueurs sur 20 à X ≥ 10, rang moyen 6,00 ; v3 60,8 % à 50 h, 50,3 % à 138 j ; v4 37 % affiché (741/2000 = 37,05 %) et 992 h, usure 50,1 % et 161 h ; v6 graine 1413 : 298 mails, attente moyenne 12,1 s, W₁/W₂/W₃ = 15/14/8 s, comptes à t = 0,5 min de moyenne 2,48 et de variance 2,50 ; v7 44,4 et 5,1 min.
- L'encadré « Brunton, rectifié » de n4 (la probabilité de panne « qui change avec le temps », vidéo 20) vient du digest, pas de la table d'errata du plan.
- Le style `.brunton b` met tout gras de l'encadré en étiquette rouge : aucun gras dans le corps des encadrés.
- Correspondance des pas de p00-01 : s4 → n1 ; s5 → n3 (formules, fil rouge), n4 (sans mémoire), n6 (Poisson à zéro = attente) ; s7 (lignes Poisson et exponentielle de la table) → n6, exemple 4 ; s8 (dépendance, surdispersion) → n1 et n6, « où ça casse ». s1 (décor) est repris par les exemples fil rouge de n1, n3, n6 ; s2, s3, s6 relèvent de l04.
- Relecture en contexte frais (10/10/2026), appliquée :
  - phrase d'entretien : la surdispersion vient d'arrivées dépendantes ou d'un taux qui varie, plus seulement de la dépendance ;
  - n1 : E = Var est un test nécessaire, pas une preuve, dans la formule, le « ce qu'on garde » et l'encadré (« le premier test de la loi ») ;
  - n6 : l'équivalence porte sur tout le processus (comptes Poisson dans toute fenêtre, indépendants sur des fenêtres disjointes), et la preuve du « même loi pour W₂, W₃ » passe par les comptes indépendants, plus par l'absence de mémoire de W₁ ;
  - figure 2 : légende « violet : X < k », « bleu : la queue », car sl-bar3 est bleu et plus clair que le violet ;
  - v6 : graine 606 remplacée par 1413, vérifiée par `check/seeds_v6.js` (W₁ valait 61 s avec 606) ;
  - n5 : la baignoire est une somme de trois risques, plus « trois phases mises bout à bout » ;
  - n2 : preuve autonome de E = 1/p par E = 1 + qE, et notation F<sub>i</sub> de Brunton au lieu de E<sub>i</sub> ;
  - n4 : condition 0 < S(1) < 1 dans la preuve d'unicité, et « 1 000 heures sur 1 000 prévues » dans l'idée ;
  - n3 : l'encadré cite ce que Brunton dit (« e to the minus at minus e to the minus bt ») sans lui prêter ce qu'il écrit au tableau ;
  - n6 : « il pense sans doute à l'exposant, 5 × 20 = 100 » au lieu d'une affirmation ;
  - n7 : la première panne d'une guirlande est un minimum quel que soit le montage, et « r réel positif » pour Γ(r) ;
  - n1 : « 36,8 % de lignes hors-sac » au lieu de « le tiers » ;
  - « readout » remplacé par « la valeur affichée » (figure 1) et par une phrase sans le mot (figure 4) ;
  - gras décoratif retiré des idées (16 %, 0,607, encore 1 000 heures, et aussi exactement, au moins, même événement, la formule « Poisson compte… », somme, l'un après l'autre, en parallèle) ; seuls les mots définis restent en gras ;
  - v7 : les étiquettes de durée sont ancrées à droite de la barre en parallèle et sautées quand le trait de fin d'attente les traverse ;
  - figure 5 : « 2 mails » en violet (sl-c2), trait du curseur en pointillé neutre ;
  - figure 4 : aire conditionnelle au-delà de 15 + t ombrée (sl-bar2), légende réécrite ;
  - v3 et v6 : « premier panneau / second » au lieu de « à gauche / à droite » ;
  - v2 et autres valeurs des vignettes : espace insécable avant % dans les chaînes JS ;
  - spec : 37 % affiché pour v4, et non 37,1 %.
- Règle (c) des 40 mots : le « ce qu'on garde » de n1 fait 43 jetons si l'on compte les signes =, ; et :, mais 32 mots ; ceux de n4 et n6 ont été raccourcis à 39 et 36. Aucune correction rejetée.
